import { STATUTS_CABINET, type StatutCabinet } from "../../../shared/cockpit.js";
import { CHAMPS_DATE, CHAMPS_TEXTE, type CabinetImporte } from "../../../shared/import.js";
import { HttpError } from "../web.js";
import { sql } from "./db.js";

// Accès SQL aux cabinets. Les écritures passent par jsonb_populate_record :
// seules les clés présentes dans le JSON changent, les autres colonnes gardent leur valeur.

const MAX_TEXTE = 5000;

function texteOuNull(v: unknown, quoi: string): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v !== "string") throw new HttpError(400, `${quoi} : texte attendu.`);
  const s = v.trim();
  if (s.length > MAX_TEXTE) throw new HttpError(400, `${quoi} : texte trop long.`);
  return s || null;
}

function dateOuNull(v: unknown, quoi: string): string | null {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v) || Number.isNaN(new Date(`${v}T00:00:00Z`).getTime()))
    throw new HttpError(400, `${quoi} : date invalide.`);
  return v;
}

function nombreOuNull(v: unknown, quoi: string): number | null {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v !== "number" || !Number.isFinite(v)) throw new HttpError(400, `${quoi} : nombre attendu.`);
  return v;
}

export function statutValide(v: unknown): StatutCabinet {
  if (!STATUTS_CABINET.includes(v as StatutCabinet)) throw new HttpError(400, "Statut invalide.");
  return v as StatutCabinet;
}

/** Vérifie un cabinet envoyé par le navigateur lors d'un import. */
export function nettoyerImporte(x: unknown): CabinetImporte {
  if (!x || typeof x !== "object") throw new HttpError(400, "Cabinet invalide.");
  const o = x as Record<string, unknown>;
  const cle = texteOuNull(o.cle, "Clé");
  const nom = texteOuNull(o.nom, "Nom");
  if (!cle || !nom || cle.length > 300) throw new HttpError(400, "Chaque cabinet doit avoir un nom.");
  const c: CabinetImporte = { cle, nom, statut: "a_contacter", raison_hors_cible: null, extra: {} };
  for (const ch of CHAMPS_TEXTE) if (ch !== "nom") c[ch] = texteOuNull(o[ch], ch);
  for (const ch of CHAMPS_DATE) c[ch] = dateOuNull(o[ch], ch);
  c.lat = nombreOuNull(o.lat, "Latitude");
  c.lng = nombreOuNull(o.lng, "Longitude");
  c.statut = STATUTS_CABINET.includes(o.statut as StatutCabinet) ? (o.statut as StatutCabinet) : "a_contacter";
  c.raison_hors_cible = texteOuNull(o.raison_hors_cible, "Raison");
  if (o.extra && typeof o.extra === "object" && !Array.isArray(o.extra)) {
    const entrees = Object.entries(o.extra as Record<string, unknown>).slice(0, 60);
    for (const [k, v] of entrees) if (typeof v === "string" && k.length <= 200) c.extra[k] = v.slice(0, MAX_TEXTE);
  }
  return c;
}

/** Champs modifiables depuis la fiche. */
export const CHAMPS_FICHE = [
  "nom",
  "veterinaire",
  "commune",
  "type",
  "adresse",
  "telephone",
  "telephone2",
  "email",
  "site",
  "segment",
  "semaine_plan",
  "canal1",
  "contact_canal1",
  "canal_relance",
  "contact_relance",
  "message",
  "ensuite",
  "notes",
] as const;

export function nettoyerPatchFiche(o: Record<string, unknown>): Record<string, unknown> {
  const patch: Record<string, unknown> = {};
  for (const ch of CHAMPS_FICHE) if (ch in o) patch[ch] = texteOuNull(o[ch], ch);
  for (const ch of CHAMPS_DATE) if (ch in o) patch[ch] = dateOuNull(o[ch], ch);
  if ("nom" in patch && !patch.nom) throw new HttpError(400, "Le nom du cabinet est obligatoire.");
  return patch;
}

/** Applique un patch partiel (clés présentes uniquement) à un cabinet. */
export async function modifierCabinet(id: string, patch: Record<string, unknown>) {
  return sql`
    UPDATE cabinets c SET
      (numero, nom, commune, veterinaire, type, adresse, adresse2, telephone, telephone2, email, site, facebook, instagram, tiktok,
       lat, lng, lien_carte, horaires, urgences, note_google, etat_google, sources, segment, semaine_plan, canal1, contact_canal1,
       canal_relance, contact_relance, message, ensuite, statut, raison_hors_cible, premier_contact, relance_le, demo_le, notes, extra, maj_le)
      = (SELECT r.numero, r.nom, r.commune, r.veterinaire, r.type, r.adresse, r.adresse2, r.telephone, r.telephone2, r.email, r.site,
                r.facebook, r.instagram, r.tiktok, r.lat, r.lng, r.lien_carte, r.horaires, r.urgences, r.note_google, r.etat_google,
                r.sources, r.segment, r.semaine_plan, r.canal1, r.contact_canal1, r.canal_relance, r.contact_relance, r.message,
                r.ensuite, r.statut, r.raison_hors_cible, r.premier_contact, r.relance_le, r.demo_le, r.notes, r.extra, now()
         FROM jsonb_populate_record(c, ${JSON.stringify(patch)}::jsonb) r)
    WHERE c.id = ${id}
    RETURNING c.id`;
}

/** Insère les cabinets nouveaux (clé inconnue) et leur première ligne d'historique. Renvoie le nombre créé. */
export async function insererCabinets(cabinets: CabinetImporte[], auteurId: string): Promise<number> {
  if (!cabinets.length) return 0;
  const rows = await sql`
    WITH nouveaux AS (
      INSERT INTO cabinets (cle, numero, nom, commune, veterinaire, type, adresse, adresse2, telephone, telephone2, email, site,
        facebook, instagram, tiktok, lat, lng, lien_carte, horaires, urgences, note_google, etat_google, sources, segment,
        semaine_plan, canal1, contact_canal1, canal_relance, contact_relance, message, ensuite, statut, raison_hors_cible,
        premier_contact, relance_le, demo_le, notes, extra)
      SELECT r.cle, r.numero, r.nom, r.commune, r.veterinaire, r.type, r.adresse, r.adresse2, r.telephone, r.telephone2, r.email,
        r.site, r.facebook, r.instagram, r.tiktok, r.lat, r.lng, r.lien_carte, r.horaires, r.urgences, r.note_google,
        r.etat_google, r.sources, r.segment, r.semaine_plan, r.canal1, r.contact_canal1, r.canal_relance, r.contact_relance,
        r.message, r.ensuite, COALESCE(r.statut, 'a_contacter'), r.raison_hors_cible, r.premier_contact, r.relance_le,
        r.demo_le, r.notes, COALESCE(r.extra, '{}'::jsonb)
      FROM jsonb_populate_recordset(NULL::cabinets, ${JSON.stringify(cabinets)}::jsonb) r
      ON CONFLICT (cle) DO NOTHING
      RETURNING id, statut, raison_hors_cible
    )
    INSERT INTO historique_cabinet (cabinet_id, auteur_id, statut, action, note)
    SELECT id, ${auteurId}::uuid, statut, 'Importé', raison_hors_cible FROM nouveaux
    RETURNING cabinet_id`;
  return rows.length;
}

/** Cabinets existants pour une liste de clés, avec les champs utiles à la comparaison. */
export async function cabinetsParCles(cles: string[]) {
  if (!cles.length) return new Map<string, Record<string, unknown>>();
  // to_jsonb : dates en texte et nombres en nombres, quel que soit le pilote
  const rows = await sql`SELECT to_jsonb(c) AS c FROM cabinets c WHERE c.cle = ANY(${cles}::text[])`;
  return new Map(rows.map((r) => [r.c.cle as string, r.c as Record<string, unknown>]));
}

export async function ajouterHistorique(cabinetId: string, auteurId: string, statut: StatutCabinet | null, action: string, note: string | null = null) {
  await sql`
    INSERT INTO historique_cabinet (cabinet_id, auteur_id, statut, action, note)
    VALUES (${cabinetId}, ${auteurId}, ${statut}, ${action}, ${note})`;
}
