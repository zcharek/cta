import { bornesMois, aujourdhui } from "../../../shared/cockpit.js";
import { calculerFacture, numeroFacture, type DonneesFacture, type Entreprise } from "../../../shared/facture.js";
import { HttpError, json, readBody, uuid } from "../web.js";
import { sql } from "./db.js";
import type { Routeur } from "./router.js";
import { identiteEntreprise } from "./entreprise.js";
import { exigerOnglet } from "./session.js";
import { stockage } from "./stockage.js";

type Facturation = { tva: number; derniere: { numero: number; annee: number } | null };

const MOIS_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

function mois(v: unknown): string {
  if (typeof v !== "string" || !MOIS_RE.test(v)) throw new HttpError(400, "Mois attendu au format aaaa-mm.");
  return v;
}

function dateIso(v: unknown, quoi: string): string {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v) || new Date(`${v}T12:00:00Z`).toISOString().slice(0, 10) !== v) throw new HttpError(400, `${quoi} invalide.`);
  return v;
}

async function parametres(): Promise<{ facturation: Facturation; entreprise: Entreprise | null }> {
  const [[f], { entreprise }] = await Promise.all([sql`SELECT valeur FROM parametres WHERE cle = 'facturation'`, identiteEntreprise()]);
  return { facturation: f?.valeur ?? { tva: 19, derniere: null }, entreprise };
}

/** Prochain numéro de l'année : après la dernière facture de Cockpit et la dernière envoyée avant Cockpit. */
async function prochainNumero(annee: number, f: Facturation): Promise<number> {
  const [r] = await sql`SELECT COALESCE(max(numero), 0)::int AS max FROM factures WHERE annee = ${annee}`;
  const avant = f.derniere?.annee === annee ? f.derniere.numero : 0;
  return Math.max(r!.max, avant) + 1;
}

/** Client, jours validés du mois et montants : base de l'aperçu et de la facture émise. */
async function calculer(clientId: string, m: string, tauxTva: number) {
  const { debut, fin } = bornesMois(`${m}-01`);
  const [[client], [jours]] = await Promise.all([
    sql`
      SELECT id, nom, COALESCE(raison_sociale_facture, raison_sociale, nom) AS raison_sociale, adresse, rc, nif,
        COALESCE(raison_sociale, nom) AS raison_sociale_timesheet, numero_contrat, mission,
        tjm_dzd, forfait_mensuel_dzd, jours_forfait
      FROM clients WHERE id = ${clientId}`,
    sql`
      SELECT COALESCE(sum(t.valeur), 0)::float8 AS valides
      FROM temps t JOIN semaines s ON s.id = t.semaine_id
      WHERE t.client_id = ${clientId} AND s.statut = 'validee' AND t.jour BETWEEN ${debut}::date AND ${fin}::date`,
  ]);
  if (!client) throw new HttpError(404, "Client introuvable.");
  const [nonValides] = await sql`
    SELECT COALESCE(sum(t.valeur), 0)::float8 AS jours
    FROM temps t JOIN semaines s ON s.id = t.semaine_id
    WHERE t.client_id = ${clientId} AND s.statut <> 'validee' AND t.jour BETWEEN ${debut}::date AND ${fin}::date`;
  const montants = calculerFacture(client as never, jours!.valides, tauxTva);
  return { client, debut, fin, jours: jours!.valides as number, joursNonValides: nonValides!.jours as number, ...montants };
}

type Calcul = Awaited<ReturnType<typeof calculer>>;

/** Tout ce qui est imprimé sur la facture (copie figée à l'émission ; aussi utilisé pour l'aperçu). */
function donneesFacture(numero: string, dateEmission: string, entreprise: Entreprise, c: Calcul, tva: number): DonneesFacture {
  return {
    numero,
    date_emission: dateEmission,
    entreprise,
    client: { raison_sociale: c.client.raison_sociale, adresse: c.client.adresse, rc: c.client.rc, nif: c.client.nif },
    ligne: { designation: "Prestation de service", debut: c.debut, fin: c.fin, unite: "Jour", quantite: c.jours, pu: c.pu, montant: c.ht },
    tva_taux: tva,
    montant_ht: c.ht,
    montant_tva: c.tva,
    montant_ttc: c.ttc,
  };
}

export function routesFactures(r: Routeur) {
  r.ajouter("GET", "factures", async ({ req }) => {
    await exigerOnglet(req, "factures");
    const { facturation } = await parametres();
    const annee = Number(aujourdhui().slice(0, 4));
    const factures = await sql`
      SELECT f.id, f.annee, f.numero, f.mois, f.date_emission::text AS date_emission, f.jours::float8 AS jours,
        f.montant_ht::float8 AS montant_ht, f.montant_tva::float8 AS montant_tva, f.montant_ttc::float8 AS montant_ttc,
        COALESCE(f.donnees->'client'->>'raison_sociale', c.raison_sociale_facture, c.raison_sociale, c.nom) AS client, c.nom AS client_nom, f.fichier IS NOT NULL AS importee, f.client_id, p.nom AS cree_par, f.cree_le::text AS cree_le,
        f.numero = (SELECT max(numero) FROM factures x WHERE x.annee = f.annee) AS derniere,
        f.payee_le::text AS payee_le,
        -- Statut : payée, en retard (non payée 30 jours après l'émission) ou envoyée
        CASE WHEN f.payee_le IS NOT NULL THEN 'payee'
             WHEN f.date_emission + 30 < ${aujourdhui()}::date THEN 'en_retard'
             ELSE 'envoyee' END AS statut
      FROM factures f JOIN clients c ON c.id = f.client_id LEFT JOIN profils p ON p.id = f.cree_par
      ORDER BY f.annee DESC, f.numero DESC`;
    // Clients dont des jours sont soumis mais pas encore validés (à valider avant de facturer)
    const [attente] = await sql`
      SELECT count(DISTINCT t.client_id)::int AS n FROM temps t JOIN semaines s ON s.id = t.semaine_id WHERE s.statut = 'soumise'`;
    return json({
      factures: factures.map((f) => ({ ...f, numero_affiche: numeroFacture(f.numero, f.annee) })),
      clientsEnAttente: attente!.n,
      tva: facturation.tva,
      derniereHorsCockpit: facturation.derniere ? numeroFacture(facturation.derniere.numero, facturation.derniere.annee) : null,
      prochain: numeroFacture(await prochainNumero(annee, facturation), annee),
    });
  });

  r.ajouter("GET", "factures/apercu", async ({ req, url }) => {
    await exigerOnglet(req, "factures");
    const clientId = uuid(url.searchParams.get("client"), "Client");
    const m = mois(url.searchParams.get("mois"));
    const dateEmission = url.searchParams.get("date") ? dateIso(url.searchParams.get("date"), "Date d'émission") : aujourdhui();
    const { facturation, entreprise } = await parametres();
    const calcul = await calculer(clientId, m, facturation.tva);
    const annee = Number(dateEmission.slice(0, 4));
    const existantes = await sql`SELECT annee, numero FROM factures WHERE client_id = ${clientId} AND mois = ${m} ORDER BY numero`;
    const numero = numeroFacture(await prochainNumero(annee, facturation), annee);
    return json({
      ...calcul,
      // Aperçu PDF : rien n'est enregistré, aucun numéro n'est consommé
      donnees: entreprise ? donneesFacture(`${numero} (aperçu)`, dateEmission, entreprise, calcul, facturation.tva) : null,
      tva_taux: facturation.tva,
      numero,
      dejaFacture: existantes.map((f) => numeroFacture(f.numero, f.annee)),
      entrepriseIncomplete: !entreprise?.nif || !entreprise?.rib,
    });
  });

  r.ajouter("POST", "factures", async ({ req }) => {
    const moi = await exigerOnglet(req, "factures");
    const b = await readBody<Record<string, unknown>>(req);
    const clientId = uuid(b.clientId, "Client");
    const m = mois(b.mois);
    const dateEmission = dateIso(b.dateEmission, "Date d'émission");
    const { facturation, entreprise } = await parametres();
    if (!entreprise) throw new HttpError(500, "Identité de l'entreprise non configurée (paramètre « entreprise »).");
    const c = await calculer(clientId, m, facturation.tva);
    if (c.jours <= 0) throw new HttpError(409, "Aucun jour validé pour ce client sur ce mois : rien à facturer.");
    const existantes = await sql`SELECT annee, numero FROM factures WHERE client_id = ${clientId} AND mois = ${m}`;
    if (existantes.length && b.confirmerDoublon !== true)
      throw new HttpError(409, `Ce mois est déjà facturé à ce client (facture ${existantes.map((f) => numeroFacture(f.numero, f.annee)).join(", ")}).`);

    const annee = Number(dateEmission.slice(0, 4));
    // Le numéro est attribué au moment de l'enregistrement ; en cas d'émission simultanée, on prend le suivant.
    for (let essai = 0; essai < 3; essai++) {
      const numero = await prochainNumero(annee, facturation);
      const donnees = donneesFacture(numeroFacture(numero, annee), dateEmission, entreprise, c, facturation.tva);
      try {
        const [f] = await sql`
          INSERT INTO factures (annee, numero, client_id, mois, date_emission, jours, montant_ht, montant_tva, montant_ttc, donnees, cree_par)
          VALUES (${annee}, ${numero}, ${clientId}, ${m}, ${dateEmission}, ${c.jours}, ${c.ht}, ${c.tva}, ${c.ttc}, ${JSON.stringify(donnees)}::jsonb, ${moi.id})
          RETURNING id`;
        return json({ id: f!.id, donnees }, { status: 201 });
      } catch (err) {
        if ((err as { code?: string }).code !== "23505") throw err;
      }
    }
    throw new HttpError(409, "Numéro de facture déjà pris : réessayez.");
  });

  r.ajouter("GET", "factures/:id", async ({ req, params }) => {
    await exigerOnglet(req, "factures");
    const [f] = await sql`SELECT donnees, fichier FROM factures WHERE id = ${uuid(params.id, "Facture")}`;
    if (!f) throw new HttpError(404, "Facture introuvable.");
    // Facture importée : lien signé vers le PDF d'origine
    if (f.fichier) return json({ donnees: null, lien: await stockage().lienLecture(f.fichier) });
    return json({ donnees: f.donnees });
  });

  // Suivi du paiement : marquer payée (date du jour par défaut) ou revenir à « envoyée ».
  r.ajouter("PATCH", "factures/:id", async ({ req, params }) => {
    await exigerOnglet(req, "factures");
    const id = uuid(params.id, "Facture");
    const b = await readBody<{ payee?: unknown; payeeLe?: unknown }>(req);
    if (typeof b.payee !== "boolean") throw new HttpError(400, "Valeur « payée » attendue.");
    const date = b.payee ? (b.payeeLe === undefined ? aujourdhui() : dateIso(b.payeeLe, "Date de paiement")) : null;
    const [f] = await sql`UPDATE factures SET payee_le = ${date}::date WHERE id = ${id} RETURNING id`;
    if (!f) throw new HttpError(404, "Facture introuvable.");
    return json({ ok: true });
  });

  // Seule la dernière facture de l'année peut être supprimée : la numérotation reste continue.
  r.ajouter("DELETE", "factures/:id", async ({ req, params }) => {
    await exigerOnglet(req, "factures");
    const id = uuid(params.id, "Facture");
    const [f] = await sql`SELECT annee, numero, fichier FROM factures WHERE id = ${id}`;
    if (!f) throw new HttpError(404, "Facture introuvable.");
    // Facture importée : son numéro vient d'avant Cockpit, on peut la retirer à tout moment (erreur d'import).
    if (f.fichier) {
      await sql`DELETE FROM factures WHERE id = ${id}`;
      await stockage().supprimer(f.fichier).catch(() => undefined);
      return json({ ok: true });
    }
    const [{ max }] = (await sql`SELECT max(numero)::int AS max FROM factures WHERE annee = ${f.annee}`) as [{ max: number }];
    if (f.numero !== max) throw new HttpError(409, "Seule la dernière facture émise peut être supprimée, pour garder une numérotation continue.");
    await sql`DELETE FROM factures WHERE id = ${id}`;
    return json({ ok: true });
  });

  // Identité légale de l'entreprise (en-tête des factures et bulletins) : lecture seule.
  // La numérotation (dernière facture avant Cockpit : 012-26) et la TVA (19 %) sont fixées par la migration 0006 :
  // aucune route ne permet de les modifier.
  r.ajouter("GET", "parametres/entreprise", async ({ req }) => {
    await exigerOnglet(req, "factures", "paie");
    return json(await identiteEntreprise());
  });
}
