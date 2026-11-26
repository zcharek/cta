import {
  EMAIL_FOUNDER,
  ONGLETS,
  ROLES_ATTRIBUABLES,
  aujourdhui,
  bornesMois,
  gereLesAcces,
  ongletsDe,
  peutGererRole,
  type Onglet,
  type Role,
  type StatutAcces,
} from "../../../shared/cockpit.js";
import { HttpError, json, readBody, uuid } from "../web.js";
import { sql } from "./db.js";
import { emailInvitation, envoyerEmail, lienVisibleEnReponse, urlApplication } from "./emails.js";
import { numeroFacture } from "../../../shared/facture.js";
import { creerJeton, lienMotDePasse } from "./jetons.js";
import { journaliser } from "./journal.js";
import type { Routeur } from "./router.js";
import { aOnglet, exigerOnglet, exigerProfil, type Profil } from "./session.js";
import { stockage } from "./stockage.js";
import { email, entier, estDoublon, idsListe, texte } from "./valider.js";

function role(v: unknown): Role {
  if (!ROLES_ATTRIBUABLES.includes(v as Role)) throw new HttpError(400, "Type d'utilisateur invalide.");
  return v as Role;
}

/** Poste occupé (repris sur le bulletin de paie, l'attestation et le certificat de travail). */
function fonction(v: unknown): string | null | undefined {
  if (v === undefined) return undefined;
  if (v === null || (typeof v === "string" && !v.trim())) return null;
  if (typeof v !== "string") throw new HttpError(400, "Poste invalide.");
  if (v.trim().length > 120) throw new HttpError(400, "Poste : 120 caractères maximum.");
  return v.trim();
}

function onglets(v: unknown): Onglet[] {
  if (!Array.isArray(v) || v.some((o) => !ONGLETS.includes(o))) throw new HttpError(400, "Liste d'onglets invalide.");
  return ONGLETS.filter((o) => v.includes(o));
}

/** Texte facultatif : undefined si absent (inchangé), null si vidé. */
function optionnel(v: unknown, quoi: string, max: number): string | null | undefined {
  if (v === undefined) return undefined;
  if (v === null || (typeof v === "string" && !v.trim())) return null;
  if (typeof v !== "string") throw new HttpError(400, `${quoi} invalide.`);
  if (v.trim().length > max) throw new HttpError(400, `${quoi} : ${max} caractères maximum.`);
  return v.trim();
}

/** Informations de facturation d'un client (timesheet) : undefined = inchangé. */
function facturation(b: Record<string, unknown>) {
  return {
    raisonSociale: optionnel(b.raisonSociale, "Raison sociale", 200),
    adresse: optionnel(b.adresse, "Adresse", 300),
    numeroContrat: optionnel(b.numeroContrat, "Numéro de contrat", 80),
    mission: optionnel(b.mission, "Projet / mission", 200),
    raisonSocialeFacture: optionnel(b.raisonSocialeFacture, "Raison sociale (facture)", 200),
    rc: optionnel(b.rc, "RC", 60),
    nif: optionnel(b.nif, "NIF", 60),
    // null = facturé au TJM
    forfait: b.forfaitMensuelDzd === undefined ? undefined : b.forfaitMensuelDzd === null || b.forfaitMensuelDzd === "" ? null : entier(b.forfaitMensuelDzd, "Forfait mensuel", 1),
    joursForfait: b.joursForfait === undefined ? undefined : entier(b.joursForfait, "Jours du forfait", 1, 31),
  };
}

const RESERVE_GESTION = "Seuls le Founder, un Co-Founder ou un QA Manager peuvent changer le type, les onglets, l'archivage ou la suppression d'un utilisateur.";
const RESERVE_HIERARCHIE = "Un QA Manager ne gère que les Collaborateurs, Comptables et Assistants ; seul le Founder gère les Co-Founders et lui-même.";

/** Remplace la liste des clients d'un collaborateur (seuls les clients actifs sont retenus). */
async function affecterClients(profilId: string, clientIds: string[]) {
  await sql`DELETE FROM affectations WHERE profil_id = ${profilId} AND NOT (client_id = ANY(${clientIds}::uuid[]))`;
  await sql`
    INSERT INTO affectations (profil_id, client_id)
    SELECT ${profilId}, id FROM clients WHERE id = ANY(${clientIds}::uuid[]) AND actif
    ON CONFLICT DO NOTHING`;
}

/** Remplace l'équipe d'un client. */
async function affecterEquipe(clientId: string, profilIds: string[]) {
  await sql`DELETE FROM affectations WHERE client_id = ${clientId} AND NOT (profil_id = ANY(${profilIds}::uuid[]))`;
  await sql`
    INSERT INTO affectations (profil_id, client_id)
    SELECT id, ${clientId} FROM profils WHERE id = ANY(${profilIds}::uuid[]) AND actif
    ON CONFLICT DO NOTHING`;
}

async function inviter(req: Request, auteur: Profil, profil: { id: string; nom: string; email: string }) {
  const jeton = await creerJeton(profil.id, "invitation");
  const lien = lienMotDePasse(urlApplication(req), jeton);
  await sql`UPDATE profils SET invite_le = now() WHERE id = ${profil.id}`;
  try {
    await envoyerEmail(emailInvitation(profil.email, profil.nom, auteur.nom, lien));
  } catch (err) {
    const message = err instanceof HttpError ? err.message : "L'e-mail n'a pas pu être envoyé.";
    return { envoye: false, avertissement: `${message} Utilisez « Renvoyer l'invitation ».` };
  }
  return { envoye: true, ...(lienVisibleEnReponse() ? { lien } : {}) };
}

export function routesEquipe(r: Routeur) {
  r.ajouter("GET", "collaborateurs", async ({ req }) => {
    await exigerOnglet(req, "collaborateurs", "clients", "validation");
    const { debut, fin } = bornesMois(aujourdhui());
    const rows = await sql`
      SELECT p.id, p.nom, p.email, p.role, p.actif, p.onglets, p.matricule, p.date_entree::text AS date_entree, p.date_sortie::text AS date_sortie, p.fonction, p.civilite, p.telephone, p.adresse, p.ville, p.wilaya,
        p.date_naissance::text AS date_naissance, p.lieu_naissance, p.nationalite,
        p.nin IS NOT NULL AS nin_renseigne, -- NIN, N° SS et compte restent sur la fiche de la personne
        p.situation_familiale, p.numero_ss IS NOT NULL AS ss_renseigne, p.numero_compte IS NOT NULL AS compte_renseigne,
        p.mot_de_passe_hash IS NOT NULL AS a_mot_de_passe,
        p.invite_le::text AS invite_le, p.active_le::text AS active_le,
        COALESCE((SELECT json_agg(a.client_id) FROM affectations a WHERE a.profil_id = p.id), '[]'::json) AS client_ids,
        COALESCE((SELECT sum(t.valeur) FROM temps t JOIN semaines s ON s.id = t.semaine_id
                  WHERE s.profil_id = p.id AND t.jour BETWEEN ${debut}::date AND ${fin}::date), 0)::float8 AS jours_mois
      FROM profils p
      ORDER BY p.actif DESC, p.nom`;
    const collaborateurs = rows.map(({ a_mot_de_passe, onglets: choisis, ...p }) => ({
      ...p,
      onglets: ongletsDe({ role: p.role, onglets: choisis }),
      onglets_personnalises: p.role !== "founder" && choisis !== null,
      statut: (!p.actif ? "archive" : a_mot_de_passe ? "actif" : "invitation") satisfies StatutAcces,
    }));
    return json({ collaborateurs });
  });

  r.ajouter("POST", "collaborateurs", async ({ req }) => {
    const auteur = await exigerOnglet(req, "collaborateurs");
    const b = await readBody<Record<string, unknown>>(req);
    const p = { nom: texte(b.nom, "Nom"), email: email(b.email), role: role(b.role) };
    const poste = fonction(b.fonction);
    const choisis = b.onglets === undefined || b.onglets === null ? null : onglets(b.onglets);
    // Sans droit de gestion des accès : uniquement des Collaborateurs ou Assistants, avec les onglets par défaut.
    if (!gereLesAcces(auteur) && (choisis || !["collaborateur", "assistant"].includes(p.role))) throw new HttpError(403, RESERVE_GESTION);
    if (gereLesAcces(auteur) && !peutGererRole(auteur, p.role)) throw new HttpError(403, RESERVE_HIERARCHIE);
    if (p.email === EMAIL_FOUNDER) throw new HttpError(409, "Cette adresse est celle du compte Founder.");
    const clientIds = idsListe(b.clientIds, "Client");
    const rows = await sql`
      INSERT INTO profils (nom, email, role, onglets, fonction) VALUES (${p.nom}, ${p.email}, ${p.role}, ${choisis}::text[], ${poste ?? null})
      ON CONFLICT (email) DO NOTHING
      RETURNING id, nom, email`;
    if (!rows[0]) throw new HttpError(409, "Un collaborateur existe déjà avec cette adresse e-mail.");
    await affecterClients(rows[0].id, clientIds);
    await journaliser(auteur, { id: rows[0].id, nom: p.nom }, "creation", { role: p.role, email: p.email, ...(choisis ? { onglets: choisis } : {}) });
    const invitation = await inviter(req, auteur, rows[0] as { id: string; nom: string; email: string });
    return json({ id: rows[0].id, invitation }, { status: 201 });
  });

  r.ajouter("PATCH", "collaborateurs/:id", async ({ req, params }) => {
    const auteur = await exigerOnglet(req, "collaborateurs");
    const id = uuid(params.id, "Collaborateur");
    const b = await readBody<Record<string, unknown>>(req);
    const existant = (await sql`SELECT id, nom, email, role, actif, onglets FROM profils WHERE id = ${id}`)[0];
    if (!existant) throw new HttpError(404, "Collaborateur introuvable.");

    let nom = b.nom === undefined ? null : texte(b.nom, "Nom");
    let mail = b.email === undefined ? null : email(b.email);
    let nouveauRole = b.role === undefined ? null : role(b.role);
    if (b.actif !== undefined && typeof b.actif !== "boolean") throw new HttpError(400, "Valeur « actif » invalide.");
    let actif = b.actif === undefined ? null : b.actif === true;
    let choisis = b.onglets === undefined || b.onglets === null ? null : onglets(b.onglets);
    // Poste : undefined = inchangé ; vide = effacé.
    const poste = fonction(b.fonction);

    // On ignore ce qui ne change pas (le formulaire renvoie tout) pour n'appliquer les règles qu'aux vrais changements.
    if (nom === existant.nom) nom = null;
    if (mail === existant.email) mail = null;
    if (nouveauRole === existant.role) nouveauRole = null;
    if (actif === existant.actif) actif = null;
    const ongletsActuels = ongletsDe(existant as { role: Role; onglets: string[] | null });
    if (choisis && !nouveauRole && choisis.join() === ongletsActuels.join()) choisis = null;

    if (existant.role === "founder") {
      // Compte fondateur : toujours Founder, actif et avec tous les onglets ; seul lui-même change son nom.
      if (nouveauRole || actif === false || choisis) throw new HttpError(403, "Le compte Founder ne peut être ni archivé, ni changé de type, ni restreint.");
      if (mail) throw new HttpError(403, "L'adresse du compte Founder ne peut pas être modifiée.");
      if (nom && auteur.id !== id) throw new HttpError(403, "Seul le Founder peut modifier son propre compte.");
    }
    // Type, onglets, archivage et adresse e-mail d'un autre (qui permettrait de prendre son compte) : gestion des accès.
    if ((nouveauRole || actif !== null || choisis || (mail && id !== auteur.id)) && !gereLesAcces(auteur)) throw new HttpError(403, RESERVE_GESTION);

    // Évite de se retirer soi-même l'accès.
    if (id === auteur.id) {
      if (actif === false) throw new HttpError(400, "Vous ne pouvez pas archiver votre propre compte.");
      if (nouveauRole && !gereLesAcces({ role: nouveauRole, actif: true })) throw new HttpError(400, "Vous ne pouvez pas retirer votre propre droit de gestion des accès.");
      const apres = choisis ?? (nouveauRole ? ongletsDe({ role: nouveauRole }) : ongletsActuels);
      if (!apres.includes("collaborateurs")) throw new HttpError(400, "Vous ne pouvez pas retirer votre propre accès à « Collaborateurs ».");
    }

    // Hiérarchie : on ne gère que les comptes d'un type qu'on peut attribuer, et on n'attribue pas un type au-dessus du sien.
    // Un QA Manager ne peut donc ni se promouvoir, ni changer ses propres onglets, ni toucher à un Co-Founder.
    if ((nouveauRole || actif !== null || choisis || (mail && id !== auteur.id)) && (!peutGererRole(auteur, existant.role) || (nouveauRole && !peutGererRole(auteur, nouveauRole))))
      throw new HttpError(403, RESERVE_HIERARCHIE);

    // Changer de type sans préciser les onglets revient aux onglets par défaut du nouveau type.
    const majOnglets = choisis !== null || nouveauRole !== null;
    try {
      await sql`
        UPDATE profils SET
          nom = COALESCE(${nom}, nom),
          email = COALESCE(${mail}, email),
          role = COALESCE(${nouveauRole}, role),
          fonction = CASE WHEN ${poste !== undefined}::boolean THEN ${poste ?? null} ELSE fonction END,
          actif = COALESCE(${actif}::boolean, actif),
          onglets = CASE WHEN ${majOnglets}::boolean THEN ${choisis}::text[] ELSE onglets END
        WHERE id = ${id}`;
    } catch (err) {
      if (estDoublon(err)) throw new HttpError(409, "Un autre collaborateur utilise déjà cette adresse e-mail.");
      throw err;
    }
    // Un compte archivé ne doit plus pouvoir utiliser un lien en attente.
    if (actif === false) await sql`DELETE FROM jetons WHERE profil_id = ${id} AND utilise_le IS NULL`;

    // Journal : seulement les changements de droits ou d'identifiant (pas le nom ni le poste).
    const cible = { id, nom: nom ?? existant.nom };
    if (actif !== null) await journaliser(auteur, cible, actif ? "reactivation" : "archivage");
    const changements: Record<string, unknown> = {};
    if (nouveauRole) changements.role = { avant: existant.role, apres: nouveauRole };
    if (majOnglets) changements.onglets = { avant: ongletsActuels, apres: choisis ?? ongletsDe({ role: nouveauRole ?? existant.role }) };
    if (mail) changements.email = { avant: existant.email, apres: mail };
    if (Object.keys(changements).length) await journaliser(auteur, cible, "modification", changements);
    if (b.clientIds !== undefined) await affecterClients(id, idsListe(b.clientIds, "Client"));
    return json({ ok: true });
  });

  // Suppression définitive (gestion des accès) : profil, affectations, liens et temps saisis.
  // Les factures émises gardent leur copie figée. Les bulletins de paie, à conserver, bloquent la suppression.
  r.ajouter("DELETE", "collaborateurs/:id", async ({ req, params }) => {
    const auteur = await exigerOnglet(req, "collaborateurs");
    if (!gereLesAcces(auteur)) throw new HttpError(403, RESERVE_GESTION);
    const id = uuid(params.id, "Collaborateur");
    const [p] = await sql`SELECT nom, email, role, (SELECT count(*) FROM bulletins b WHERE b.profil_id = profils.id)::int AS bulletins FROM profils WHERE id = ${id}`;
    if (!p) throw new HttpError(404, "Collaborateur introuvable.");
    if (p.role === "founder") throw new HttpError(403, "Le compte Founder ne peut pas être supprimé.");
    if (id === auteur.id) throw new HttpError(400, "Vous ne pouvez pas supprimer votre propre compte.");
    if (!peutGererRole(auteur, p.role)) throw new HttpError(403, RESERVE_HIERARCHIE);
    if (p.bulletins > 0) throw new HttpError(409, "Ce collaborateur a des bulletins de paie, qui doivent être conservés : archivez-le plutôt.");
    // Traces laissées sur le travail des autres : on garde le travail, sans l'auteur.
    await sql`UPDATE semaines SET validee_par = NULL WHERE validee_par = ${id}`;
    await sql`UPDATE factures SET cree_par = NULL WHERE cree_par = ${id}`;
    await sql`UPDATE bulletins SET cree_par = NULL WHERE cree_par = ${id}`;
    await sql`DELETE FROM profils WHERE id = ${id}`;
    await journaliser(auteur, { id: null, nom: p.nom }, "suppression", { email: p.email, role: p.role });
    return json({ ok: true });
  });

  // Journal des accès (200 derniers événements, éventuellement pour un seul compte) : gestion des accès uniquement.
  r.ajouter("GET", "journal-acces", async ({ req, url }) => {
    const auteur = await exigerOnglet(req, "collaborateurs");
    if (!gereLesAcces(auteur)) throw new HttpError(403, RESERVE_GESTION);
    const profil = url.searchParams.get("profil");
    const cible = profil ? uuid(profil, "Collaborateur") : null;
    const evenements = await sql`
      SELECT id, le::text AS le, auteur_nom, cible_id, cible_nom, action, details
      FROM journal_acces WHERE ${cible}::uuid IS NULL OR cible_id = ${cible}::uuid
      ORDER BY le DESC LIMIT 200`;
    return json({ evenements });
  });

  r.ajouter("POST", "collaborateurs/:id/invitation", async ({ req, params }) => {
    const auteur = await exigerOnglet(req, "collaborateurs");
    const id = uuid(params.id, "Collaborateur");
    const rows = await sql`SELECT id, nom, email, actif, mot_de_passe_hash IS NOT NULL AS a_mot_de_passe FROM profils WHERE id = ${id}`;
    const p = rows[0];
    if (!p) throw new HttpError(404, "Collaborateur introuvable.");
    if (!p.actif) throw new HttpError(409, "Ce collaborateur est archivé. Réactivez-le d'abord.");
    if (p.a_mot_de_passe) throw new HttpError(409, "Ce collaborateur a déjà défini son mot de passe.");
    await journaliser(auteur, { id: p.id, nom: p.nom }, "invitation", { renvoi: true });
    return json({ invitation: await inviter(req, auteur, p as { id: string; nom: string; email: string }) });
  });

  // Avec l'onglet Clients, Collaborateurs, Validation ou Récap : tous les clients (dont le TJM).
  // Sinon, seulement ses clients assignés, sans TJM (équivalent de la vue mes_clients).
  r.ajouter("GET", "clients", async ({ req }) => {
    const moi = await exigerProfil(req);
    if (!aOnglet(moi, "clients", "collaborateurs", "validation", "recap")) {
      const clients = await sql`
        SELECT c.id, c.nom FROM clients c JOIN affectations a ON a.client_id = c.id
        WHERE a.profil_id = ${moi.id} AND c.actif ORDER BY c.nom`;
      return json({ clients });
    }
    const { debut, fin } = bornesMois(aujourdhui());
    const clients = await sql`
      SELECT c.id, c.nom, c.tjm_dzd, c.actif, c.raison_sociale, c.adresse, c.numero_contrat, c.mission,
        c.forfait_mensuel_dzd, c.jours_forfait, c.raison_sociale_facture, c.rc, c.nif,
        COALESCE((SELECT json_agg(a.profil_id) FROM affectations a WHERE a.client_id = c.id), '[]'::json) AS profil_ids,
        COALESCE((SELECT sum(t.valeur) FROM temps t
                  WHERE t.client_id = c.id AND t.jour BETWEEN ${debut}::date AND ${fin}::date), 0)::float8 AS jours_mois
      FROM clients c ORDER BY c.actif DESC, c.nom`;
    return json({ clients });
  });

  r.ajouter("POST", "clients", async ({ req }) => {
    await exigerOnglet(req, "clients");
    const b = await readBody<Record<string, unknown>>(req);
    const nom = texte(b.nom, "Nom du client");
    const f = facturation(b);
    const tjm = f.forfait ? 0 : entier(b.tjmDzd, "TJM");
    const rows = await sql`
      INSERT INTO clients (nom, tjm_dzd, raison_sociale, adresse, numero_contrat, mission, forfait_mensuel_dzd, jours_forfait, raison_sociale_facture, rc, nif)
      VALUES (${nom}, ${tjm}, ${f.raisonSociale ?? null}, ${f.adresse ?? null}, ${f.numeroContrat ?? null}, ${f.mission ?? null},
        ${f.forfait ?? null}::int, ${f.joursForfait ?? 22}::int, ${f.raisonSocialeFacture ?? null}, ${f.rc ?? null}, ${f.nif ?? null})
      RETURNING id`;
    await affecterEquipe(rows[0]!.id, idsListe(b.profilIds, "Collaborateur"));
    return json({ id: rows[0]!.id }, { status: 201 });
  });

  r.ajouter("PATCH", "clients/:id", async ({ req, params }) => {
    await exigerOnglet(req, "clients");
    const id = uuid(params.id, "Client");
    const b = await readBody<Record<string, unknown>>(req);
    const nom = b.nom === undefined ? null : texte(b.nom, "Nom du client");
    const tjm = b.tjmDzd === undefined || b.tjmDzd === null || b.tjmDzd === "" ? null : entier(b.tjmDzd, "TJM");
    const f = facturation(b);
    const change = (v: unknown) => v !== undefined;
    if (b.actif !== undefined && typeof b.actif !== "boolean") throw new HttpError(400, "Valeur « actif » invalide.");
    const actif = b.actif === undefined ? null : b.actif;
    const rows = await sql`
      UPDATE clients SET
        nom = COALESCE(${nom}, nom),
        tjm_dzd = COALESCE(${tjm}::int, tjm_dzd),
        actif = COALESCE(${actif}::boolean, actif),
        raison_sociale = CASE WHEN ${change(f.raisonSociale)}::boolean THEN ${f.raisonSociale ?? null} ELSE raison_sociale END,
        adresse = CASE WHEN ${change(f.adresse)}::boolean THEN ${f.adresse ?? null} ELSE adresse END,
        numero_contrat = CASE WHEN ${change(f.numeroContrat)}::boolean THEN ${f.numeroContrat ?? null} ELSE numero_contrat END,
        mission = CASE WHEN ${change(f.mission)}::boolean THEN ${f.mission ?? null} ELSE mission END,
        forfait_mensuel_dzd = CASE WHEN ${change(f.forfait)}::boolean THEN ${f.forfait ?? null}::int ELSE forfait_mensuel_dzd END,
        jours_forfait = COALESCE(${f.joursForfait ?? null}::int, jours_forfait),
        raison_sociale_facture = CASE WHEN ${change(f.raisonSocialeFacture)}::boolean THEN ${f.raisonSocialeFacture ?? null} ELSE raison_sociale_facture END,
        rc = CASE WHEN ${change(f.rc)}::boolean THEN ${f.rc ?? null} ELSE rc END,
        nif = CASE WHEN ${change(f.nif)}::boolean THEN ${f.nif ?? null} ELSE nif END
      WHERE id = ${id} RETURNING id`;
    if (!rows[0]) throw new HttpError(404, "Client introuvable.");
    if (b.profilIds !== undefined) await affecterEquipe(id, idsListe(b.profilIds, "Collaborateur"));
    return json({ ok: true });
  });

  // Dossier d'un client : sa fiche, son équipe, ses documents (onglet Documents) et ses factures (onglet Factures).
  r.ajouter("GET", "clients/:id/dossier", async ({ req, params }) => {
    const moi = await exigerOnglet(req, "clients");
    const id = uuid(params.id, "Client");
    const { debut, fin } = bornesMois(aujourdhui());
    const [client] = await sql`
      SELECT c.id, c.nom, c.tjm_dzd, c.actif, c.raison_sociale, c.adresse, c.numero_contrat, c.mission,
        c.forfait_mensuel_dzd, c.jours_forfait, c.raison_sociale_facture, c.rc, c.nif, c.cree_le::text AS cree_le,
        COALESCE((SELECT json_agg(a.profil_id) FROM affectations a WHERE a.client_id = c.id), '[]'::json) AS profil_ids,
        COALESCE((SELECT sum(t.valeur) FROM temps t
                  WHERE t.client_id = c.id AND t.jour BETWEEN ${debut}::date AND ${fin}::date), 0)::float8 AS jours_mois,
        COALESCE((SELECT sum(t.valeur) FROM temps t WHERE t.client_id = c.id), 0)::float8 AS jours_total
      FROM clients c WHERE c.id = ${id}`;
    if (!client) throw new HttpError(404, "Client introuvable.");
    const voitDocuments = aOnglet(moi, "documents");
    const voitFactures = aOnglet(moi, "factures");
    const [equipe, documents, factures] = await Promise.all([
      sql`
        SELECT p.id, p.nom, p.role, p.fonction, p.actif,
          COALESCE((SELECT sum(t.valeur) FROM temps t JOIN semaines s ON s.id = t.semaine_id
                    WHERE s.profil_id = p.id AND t.client_id = ${id} AND t.jour BETWEEN ${debut}::date AND ${fin}::date), 0)::float8 AS jours_mois
        FROM affectations a JOIN profils p ON p.id = a.profil_id WHERE a.client_id = ${id} ORDER BY p.nom`,
      voitDocuments
        ? sql`
          SELECT d.id, d.categorie, d.titre, d.date_document::text AS date_document, d.expire_le::text AS expire_le,
            d.nom_fichier, d.type_mime, d.taille, p.nom AS ajoute_par, d.ajoute_le::text AS ajoute_le,
            (WITH RECURSIVE h AS (SELECT id, precedent_id FROM documents WHERE id = d.precedent_id
               UNION ALL SELECT x.id, x.precedent_id FROM documents x JOIN h ON x.id = h.precedent_id)
             SELECT count(*)::int FROM h) AS versions_precedentes
          FROM documents d LEFT JOIN profils p ON p.id = d.ajoute_par
          WHERE d.client_id = ${id} AND NOT EXISTS (SELECT 1 FROM documents n WHERE n.precedent_id = d.id)
          ORDER BY d.ajoute_le DESC`
        : Promise.resolve(null),
      voitFactures
        ? sql`
          SELECT f.id, f.annee, f.numero, f.mois, f.date_emission::text AS date_emission, f.jours::float8 AS jours,
            f.montant_ht::float8 AS montant_ht, f.montant_ttc::float8 AS montant_ttc, f.fichier IS NOT NULL AS importee, f.payee_le::text AS payee_le,
            CASE WHEN f.payee_le IS NOT NULL THEN 'payee'
                 WHEN f.date_emission + 30 < ${aujourdhui()}::date THEN 'en_retard'
                 ELSE 'envoyee' END AS statut
          FROM factures f WHERE f.client_id = ${id} ORDER BY f.annee DESC, f.numero DESC`
        : Promise.resolve(null),
    ]);
    const [emises] = await sql`SELECT count(*)::int AS n FROM factures WHERE client_id = ${id} AND fichier IS NULL`;
    return json({
      client,
      equipe,
      documents,
      factures: factures?.map((f) => ({ ...f, numero_affiche: numeroFacture(f.numero, f.annee) })) ?? null,
      // Factures émises par Cockpit : elles bloquent la suppression définitive.
      facturesEmises: emises!.n,
      peutSupprimer: gereLesAcces(moi),
    });
  });

  // Suppression définitive (gestion des accès) : le client, ses affectations, ses temps saisis, ses documents
  // (toutes versions, fichiers compris) et ses factures importées. Les factures émises par Cockpit, à conserver
  // et à numérotation continue, bloquent la suppression : il faut alors archiver le client.
  r.ajouter("DELETE", "clients/:id", async ({ req, params }) => {
    const auteur = await exigerOnglet(req, "clients");
    if (!gereLesAcces(auteur)) throw new HttpError(403, "Seuls le Founder, un Co-Founder ou un QA Manager peuvent supprimer un client.");
    const id = uuid(params.id, "Client");
    const [c] = await sql`SELECT (SELECT count(*) FROM factures f WHERE f.client_id = clients.id AND f.fichier IS NULL)::int AS emises FROM clients WHERE id = ${id}`;
    if (!c) throw new HttpError(404, "Client introuvable.");
    if (c.emises > 0)
      throw new HttpError(409, `Ce client a ${c.emises > 1 ? `${c.emises} factures émises` : "une facture émise"} par Cockpit, qui doivent être conservées : archivez-le plutôt.`);
    // Documents du client et toutes leurs versions précédentes
    const documents = await sql`
      WITH RECURSIVE h AS (SELECT id, precedent_id, fichier FROM documents WHERE client_id = ${id}
        UNION SELECT d.id, d.precedent_id, d.fichier FROM documents d JOIN h ON d.id = h.precedent_id)
      SELECT id, fichier FROM h`;
    const factures = await sql`SELECT fichier FROM factures WHERE client_id = ${id} AND fichier IS NOT NULL`;
    if (documents.length) await sql`DELETE FROM documents WHERE id = ANY(${documents.map((d) => d.id)}::uuid[])`;
    await sql`DELETE FROM factures WHERE client_id = ${id}`;
    await sql`DELETE FROM temps WHERE client_id = ${id}`;
    await sql`DELETE FROM clients WHERE id = ${id}`;
    await Promise.all([...documents, ...factures].map((f) => stockage().supprimer(f.fichier).catch(() => undefined)));
    return json({ ok: true });
  });
}
