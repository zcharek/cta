import { STATUTS_SEMAINE, ajouterJours, estLundi, type StatutSemaine } from "../../../shared/cockpit.js";
import { HttpError, json, readBody, uuid } from "../web.js";
import { sql } from "./db.js";
import type { Routeur } from "./router.js";
import { aOnglet, exigerProfil, type Profil } from "./session.js";

function lundi(v: unknown): string {
  if (typeof v !== "string" || !estLundi(v)) throw new HttpError(400, "La semaine doit commencer un lundi (aaaa-mm-jj).");
  return v;
}

/** Onglet « Validation » : voir et corriger la saisie de tout le monde. */
const valideur = (moi: Profil) => aOnglet(moi, "validation");

/** Sa propre saisie avec l'onglet « Saisie des temps » ; celle des autres avec l'onglet « Validation ». */
function cibler(moi: Profil, profilId: unknown): string {
  const id = uuid(profilId, "Collaborateur");
  if (valideur(moi)) return id;
  if (id !== moi.id) throw new HttpError(403, "Vous ne pouvez accéder qu'à votre propre saisie.");
  if (!aOnglet(moi, "saisie")) throw new HttpError(403, "Accès réservé.");
  return id;
}

/** Crée la semaine en brouillon si elle n'existe pas encore. */
async function semaineDe(profilId: string, l: string) {
  const rows = await sql`
    INSERT INTO semaines (profil_id, lundi) SELECT id, ${l}::date FROM profils WHERE id = ${profilId}
    ON CONFLICT (profil_id, lundi) DO UPDATE SET profil_id = EXCLUDED.profil_id
    RETURNING id, statut`;
  if (!rows[0]) throw new HttpError(404, "Collaborateur introuvable.");
  return rows[0] as { id: string; statut: StatutSemaine };
}

/**
 * Transitions permises. Un collaborateur passe sa semaine de brouillon à soumise et inversement, jamais à validée.
 * Un admin peut tout faire, dont valider, renvoyer une semaine soumise et rouvrir une semaine validée.
 */
export function transitionsDepuis(admin: boolean, vers: StatutSemaine): StatutSemaine[] {
  if (!admin) return vers === "soumise" ? ["brouillon"] : vers === "brouillon" ? ["soumise"] : [];
  return STATUTS_SEMAINE.filter((s) => s !== vers);
}

export function routesTemps(r: Routeur) {
  r.ajouter("GET", "semaines", async ({ req, url }) => {
    const moi = await exigerProfil(req);
    const profilId = cibler(moi, url.searchParams.get("profil") ?? moi.id);
    const l = lundi(url.searchParams.get("lundi"));
    const vendredi = ajouterJours(l, 4);
    const [semaine] = await sql`
      SELECT id, lundi::text AS lundi, statut, soumise_le::text AS soumise_le, validee_le::text AS validee_le
      FROM semaines WHERE profil_id = ${profilId} AND lundi = ${l}::date`;
    // Lignes : clients assignés et actifs, plus ceux déjà saisis cette semaine. Jamais de TJM ici.
    const lignes = await sql`
      SELECT c.id, c.nom FROM clients c
      WHERE (c.actif AND c.id IN (SELECT client_id FROM affectations WHERE profil_id = ${profilId}))
         OR c.id IN (SELECT t.client_id FROM temps t JOIN semaines s ON s.id = t.semaine_id
                     WHERE s.profil_id = ${profilId} AND s.lundi = ${l}::date)
      ORDER BY c.nom`;
    const temps = semaine
      ? await sql`SELECT client_id, jour::text AS jour, valeur::float8 AS valeur FROM temps WHERE semaine_id = ${semaine.id} AND jour BETWEEN ${l}::date AND ${vendredi}::date`
      : [];
    return json({
      semaine: semaine ?? { id: null, lundi: l, statut: "brouillon", soumise_le: null, validee_le: null },
      lignes,
      temps,
    });
  });

  r.ajouter("PUT", "temps", async ({ req }) => {
    const moi = await exigerProfil(req);
    const admin = valideur(moi);
    const b = await readBody<Record<string, unknown>>(req);
    const profilId = cibler(moi, b.profilId);
    const l = lundi(b.lundi);
    const clientId = uuid(b.clientId, "Client");
    const jour = typeof b.jour === "string" ? b.jour : "";
    if (![0, 1, 2, 3, 4].some((n) => ajouterJours(l, n) === jour)) throw new HttpError(400, "Le jour doit être compris entre le lundi et le vendredi de la semaine.");
    if (![0, 0.5, 1].includes(b.valeur as number)) throw new HttpError(400, "Valeur attendue : 0, 0,5 ou 1 jour.");

    const autorise = admin
      ? await sql`SELECT 1 FROM clients WHERE id = ${clientId}`
      : await sql`SELECT 1 FROM affectations a JOIN clients c ON c.id = a.client_id WHERE a.profil_id = ${profilId} AND a.client_id = ${clientId} AND c.actif`;
    if (!autorise.length) throw new HttpError(403, "Ce client ne vous est pas assigné.");

    const semaine = await semaineDe(profilId, l);
    const modifiables: StatutSemaine[] = admin ? ["brouillon", "soumise"] : ["brouillon"];
    // L'écriture n'a lieu que si la semaine est encore modifiable au moment même de l'écriture.
    const ecrit =
      b.valeur === 0
        ? await sql`
            DELETE FROM temps t USING semaines s
            WHERE t.semaine_id = s.id AND s.id = ${semaine.id} AND s.statut = ANY(${modifiables}::text[])
              AND t.client_id = ${clientId} AND t.jour = ${jour}::date
            RETURNING s.id`
        : await sql`
            INSERT INTO temps (semaine_id, client_id, jour, valeur)
            SELECT s.id, ${clientId}, ${jour}::date, ${b.valeur}::numeric FROM semaines s
            WHERE s.id = ${semaine.id} AND s.statut = ANY(${modifiables}::text[])
            ON CONFLICT (semaine_id, client_id, jour) DO UPDATE SET valeur = EXCLUDED.valeur
            RETURNING semaine_id`;
    if (!ecrit.length) {
      const [s] = await sql`SELECT statut FROM semaines WHERE id = ${semaine.id}`;
      if (s && !modifiables.includes(s.statut))
        throw new HttpError(409, admin ? "Cette semaine est validée : rouvrez-la pour la modifier." : "Cette semaine n'est plus en brouillon : repassez-la en brouillon pour la modifier.");
    }
    return json({ ok: true });
  });

  r.ajouter("POST", "semaines/statut", async ({ req }) => {
    const moi = await exigerProfil(req);
    const admin = valideur(moi);
    const b = await readBody<Record<string, unknown>>(req);
    const profilId = cibler(moi, b.profilId);
    const l = lundi(b.lundi);
    const vers = b.statut as StatutSemaine;
    if (!STATUTS_SEMAINE.includes(vers)) throw new HttpError(400, "Statut invalide.");
    if (vers === "validee" && !admin) throw new HttpError(403, "Seul un responsable peut valider une semaine.");
    const depuis = transitionsDepuis(admin, vers);

    const semaine = await semaineDe(profilId, l);
    const rows = await sql`
      UPDATE semaines SET
        statut = ${vers}::text,
        soumise_le = CASE WHEN ${vers}::text = 'soumise' THEN now() WHEN ${vers}::text = 'brouillon' THEN NULL ELSE soumise_le END,
        validee_le = CASE WHEN ${vers}::text = 'validee' THEN now() ELSE NULL END,
        validee_par = CASE WHEN ${vers}::text = 'validee' THEN ${moi.id}::uuid ELSE NULL END
      WHERE id = ${semaine.id} AND statut = ANY(${depuis}::text[])
      RETURNING id, lundi::text AS lundi, statut, soumise_le::text AS soumise_le, validee_le::text AS validee_le`;
    if (!rows[0]) throw new HttpError(409, `Impossible de passer cette semaine de « ${semaine.statut} » à « ${vers} ».`);
    return json({ semaine: rows[0] });
  });
}
