import bcrypt from "bcryptjs";
import { MOT_DE_PASSE_MIN } from "../../../shared/cockpit.js";
import { HttpError, json, readBody } from "../web.js";
import { sql } from "./db.js";
import type { Routeur } from "./router.js";
import { cookieSession, exigerProfil } from "./session.js";
import { texte } from "./valider.js";

/** Champ facultatif : texte nettoyé, ou null s'il est vide. */
function facultatif(v: unknown, quoi: string, max: number): string | null {
  if (v === null || v === undefined || (typeof v === "string" && !v.trim())) return null;
  if (typeof v !== "string") throw new HttpError(400, `${quoi} invalide.`);
  const s = v.trim();
  if (s.length > max) throw new HttpError(400, `${quoi} : ${max} caractères maximum.`);
  return s;
}

function telephone(v: unknown): string | null {
  const t = facultatif(v, "Téléphone", 30);
  if (t && !/^\+?[0-9 .()-]{6,30}$/.test(t)) throw new HttpError(400, "Téléphone invalide : chiffres, espaces et + uniquement.");
  return t;
}

// « Mon profil » : chacun consulte et modifie ses propres coordonnées et son mot de passe.
// Le type, les onglets et l'e-mail (identifiant de connexion) restent gérés dans Collaborateurs.
export function routesProfil(r: Routeur) {
  r.ajouter("GET", "profil", async ({ req }) => {
    const moi = await exigerProfil(req);
    const [p] = await sql`
      SELECT nom, email, role, telephone, adresse, mot_de_passe_le::text AS mot_de_passe_le
      FROM profils WHERE id = ${moi.id}`;
    return json({ profil: p });
  });

  r.ajouter("PATCH", "profil", async ({ req }) => {
    const moi = await exigerProfil(req);
    const b = await readBody<Record<string, unknown>>(req);
    const nom = b.nom === undefined ? null : texte(b.nom, "Prénom et nom");
    const maj = {
      telephone: b.telephone === undefined ? undefined : telephone(b.telephone),
      adresse: b.adresse === undefined ? undefined : facultatif(b.adresse, "Adresse", 300),
    };
    await sql`
      UPDATE profils SET
        nom = COALESCE(${nom}, nom),
        telephone = CASE WHEN ${maj.telephone !== undefined}::boolean THEN ${maj.telephone ?? null} ELSE telephone END,
        adresse = CASE WHEN ${maj.adresse !== undefined}::boolean THEN ${maj.adresse ?? null} ELSE adresse END
      WHERE id = ${moi.id}`;
    return json({ ok: true });
  });

  r.ajouter("POST", "profil/mot-de-passe", async ({ req }) => {
    const moi = await exigerProfil(req);
    const b = await readBody<{ actuel?: unknown; nouveau?: unknown }>(req);
    const actuel = typeof b.actuel === "string" ? b.actuel : "";
    const nouveau = typeof b.nouveau === "string" ? b.nouveau : "";
    if (nouveau.length < MOT_DE_PASSE_MIN) throw new HttpError(400, `Le nouveau mot de passe doit faire au moins ${MOT_DE_PASSE_MIN} caractères.`);
    if (nouveau.length > 200) throw new HttpError(400, "Mot de passe trop long.");
    const [p] = await sql`SELECT mot_de_passe_hash FROM profils WHERE id = ${moi.id}`;
    if (!p?.mot_de_passe_hash || !(await bcrypt.compare(actuel, p.mot_de_passe_hash))) throw new HttpError(400, "Mot de passe actuel incorrect.");
    const [maj] = await sql`
      UPDATE profils SET mot_de_passe_hash = ${await bcrypt.hash(nouveau, 10)}, mot_de_passe_le = now(), version_session = version_session + 1
      WHERE id = ${moi.id} RETURNING version_session`;
    // Les autres sessions sont fermées ; celle-ci reçoit un nouveau cookie.
    return json({ ok: true }, { headers: { "Set-Cookie": await cookieSession(moi.id, maj!.version_session) } });
  });
}
