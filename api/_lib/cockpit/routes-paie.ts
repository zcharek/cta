import { paieDepuisNet, type DonneesBulletin } from "../../../shared/paie.js";
import { HttpError, json, readBody, uuid } from "../web.js";
import { sql } from "./db.js";
import type { Routeur } from "./router.js";
import { exigerOnglet } from "./session.js";

// Bulletins de paie (onglet « paie », données sensibles) : le brut est calculé à partir du net convenu.
// Les informations manquantes (matricule, fonction, date d'entrée, N° adhérent…) sont saisies à la première
// génération puis enregistrées, pour être reprises les mois suivants.

const MOIS_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

function net(v: unknown): number {
  const n = typeof v === "number" ? v : Number(String(v ?? "").replace(/\s/g, "").replace(",", "."));
  if (!Number.isFinite(n) || n <= 0 || n > 100_000_000) throw new HttpError(400, "Salaire net invalide.");
  return Math.round(n * 100) / 100;
}

function texte(v: unknown, quoi: string, max: number, obligatoire = false): string | null {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) {
    if (obligatoire) throw new HttpError(400, `${quoi} : champ obligatoire.`);
    return null;
  }
  if (s.length > max) throw new HttpError(400, `${quoi} : ${max} caractères maximum.`);
  return s;
}

function dateIso(v: unknown, quoi: string): string | null {
  if (v === undefined || v === null || v === "") return null;
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v) || new Date(`${v}T12:00:00Z`).toISOString().slice(0, 10) !== v) throw new HttpError(400, `${quoi} invalide.`);
  return v;
}

async function entreprise() {
  const [r] = await sql`SELECT valeur FROM parametres WHERE cle = 'entreprise'`;
  if (!r) throw new HttpError(500, "Identité de l'entreprise non configurée.");
  return r.valeur as { raison_sociale: string; siege: string; numero_adherent?: string | null };
}

async function prochainMatricule(): Promise<string> {
  const [r] = await sql`SELECT COALESCE(max(matricule::int), 0)::int AS max FROM profils WHERE matricule ~ '^[0-9]+$'`;
  return String(r!.max + 1).padStart(3, "0");
}

export function routesPaie(r: Routeur) {
  r.ajouter("GET", "paie", async ({ req }) => {
    await exigerOnglet(req, "paie");
    const [e, salaries, bulletins, matricule] = await Promise.all([
      entreprise(),
      sql`
        SELECT id, nom, email, role, matricule, fonction, affectation, date_entree::text AS date_entree, salaire_net::float8 AS salaire_net,
          situation_familiale, numero_ss, numero_compte
        FROM profils WHERE actif ORDER BY nom`,
      sql`
        SELECT b.id, b.mois, b.profil_id, p.nom, b.brut::float8 AS brut, b.net::float8 AS net, b.cree_le::text AS cree_le
        FROM bulletins b JOIN profils p ON p.id = b.profil_id
        ORDER BY b.mois DESC, p.nom`,
      prochainMatricule(),
    ]);
    return json({ numeroAdherent: e.numero_adherent ?? null, salaries, bulletins, prochainMatricule: matricule });
  });

  r.ajouter("GET", "paie/apercu", async ({ req, url }) => {
    await exigerOnglet(req, "paie");
    return json({ paie: paieDepuisNet(net(url.searchParams.get("net"))) });
  });

  r.ajouter("POST", "paie/bulletins", async ({ req }) => {
    const moi = await exigerOnglet(req, "paie");
    const b = await readBody<Record<string, unknown>>(req);
    const profilId = uuid(b.profilId, "Salarié");
    if (typeof b.mois !== "string" || !MOIS_RE.test(b.mois)) throw new HttpError(400, "Mois attendu au format aaaa-mm.");
    const mois = b.mois;
    const montantNet = net(b.net);
    const e = await entreprise();

    // N° adhérent : demandé une fois, puis conservé
    const adherent = texte(b.numeroAdherent, "N° adhérent", 40) ?? e.numero_adherent ?? null;
    if (!adherent) throw new HttpError(400, "N° adhérent de l'employeur : champ obligatoire.");
    if (adherent !== e.numero_adherent) await sql`UPDATE parametres SET valeur = valeur || ${JSON.stringify({ numero_adherent: adherent })}::jsonb WHERE cle = 'entreprise'`;

    const situation = texte(b.situationFamiliale, "Situation familiale", 1);
    if (situation && !["C", "M", "D", "V"].includes(situation)) throw new HttpError(400, "Situation familiale invalide.");
    const champs = {
      matricule: texte(b.matricule, "Matricule", 20, true)!,
      fonction: texte(b.fonction, "Fonction", 120, true)!,
      affectation: texte(b.affectation, "Affectation", 120),
      dateEntree: dateIso(b.dateEntree, "Date d'entrée"),
      numeroSs: texte(b.numeroSs, "N° sécurité sociale", 30),
      numeroCompte: texte(b.numeroCompte, "N° de compte", 40),
    };

    let p;
    try {
      [p] = await sql`
        UPDATE profils SET matricule = ${champs.matricule}, fonction = ${champs.fonction},
          -- Champ absent de la requête : valeur déjà enregistrée conservée ; champ envoyé vide : effacé.
          affectation = CASE WHEN ${b.affectation === undefined}::boolean THEN affectation ELSE ${champs.affectation} END,
          date_entree = CASE WHEN ${b.dateEntree === undefined}::boolean THEN date_entree ELSE ${champs.dateEntree}::date END,
          salaire_net = ${montantNet},
          situation_familiale = COALESCE(${situation}, situation_familiale),
          numero_ss = COALESCE(${champs.numeroSs}, numero_ss), numero_compte = COALESCE(${champs.numeroCompte}, numero_compte)
        WHERE id = ${profilId}
        RETURNING nom, matricule, fonction, affectation, date_entree::text AS date_entree, situation_familiale, numero_ss, numero_compte`;
    } catch (err) {
      if ((err as { code?: string }).code === "23505") throw new HttpError(409, "Ce matricule est déjà attribué à un autre salarié.");
      throw err;
    }
    if (!p) throw new HttpError(404, "Salarié introuvable.");

    const paie = paieDepuisNet(montantNet);
    const donnees: DonneesBulletin = {
      mois,
      entreprise: { raison_sociale: e.raison_sociale, siege: e.siege, numero_adherent: adherent },
      salarie: {
        matricule: p.matricule,
        nom: p.nom,
        situation_familiale: p.situation_familiale,
        fonction: p.fonction,
        affectation: p.affectation,
        date_entree: p.date_entree,
        numero_ss: p.numero_ss,
        numero_compte: p.numero_compte,
      },
      paie,
    };
    const [bulletin] = await sql`
      INSERT INTO bulletins (profil_id, mois, brut, retenue_ss, irg, net, donnees, cree_par)
      VALUES (${profilId}, ${mois}, ${paie.brut}, ${paie.retenueSs}, ${paie.irg}, ${paie.net}, ${JSON.stringify(donnees)}::jsonb, ${moi.id})
      ON CONFLICT (profil_id, mois) DO UPDATE SET
        brut = EXCLUDED.brut, retenue_ss = EXCLUDED.retenue_ss, irg = EXCLUDED.irg, net = EXCLUDED.net,
        donnees = EXCLUDED.donnees, cree_par = EXCLUDED.cree_par, cree_le = now()
      RETURNING id`;
    return json({ id: bulletin!.id, donnees }, { status: 201 });
  });

  r.ajouter("GET", "paie/bulletins/:id", async ({ req, params }) => {
    await exigerOnglet(req, "paie");
    const [bulletin] = await sql`SELECT donnees FROM bulletins WHERE id = ${uuid(params.id, "Bulletin")}`;
    if (!bulletin) throw new HttpError(404, "Bulletin introuvable.");
    return json({ donnees: bulletin.donnees });
  });
}
