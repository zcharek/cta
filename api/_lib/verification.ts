// Vérification de l'adresse e-mail des comptes de l'espace client : lien à usage unique valable 24 heures.
import { randomBytes } from "node:crypto";
import { empreinte } from "./cockpit/jetons.js";
import { sql } from "./cockpit/db.js";

/** Nouveau lien de vérification ; les précédents non utilisés sont annulés. Seule l'empreinte est stockée. */
export async function creerVerification(userId: string): Promise<string> {
  const jeton = randomBytes(32).toString("base64url");
  await sql`DELETE FROM verifications_email WHERE user_id = ${userId} AND utilise_le IS NULL`;
  await sql`INSERT INTO verifications_email (empreinte, user_id, expire_le) VALUES (${empreinte(jeton)}, ${userId}, now() + interval '24 hours')`;
  return jeton;
}

/** Consomme le jeton (une seule fois) et marque l'adresse comme vérifiée. Renvoie le compte, ou null si le lien n'est plus valable. */
export async function consommerVerification(jeton: unknown) {
  if (typeof jeton !== "string" || jeton.length < 20 || jeton.length > 200) return null;
  const [v] = await sql`
    UPDATE verifications_email SET utilise_le = now()
    WHERE empreinte = ${empreinte(jeton)} AND utilise_le IS NULL AND expire_le > now()
    RETURNING user_id`;
  if (!v) return null;
  const [u] = await sql`
    UPDATE users SET email_verifie_le = COALESCE(email_verifie_le, now()) WHERE id = ${v.user_id}
    RETURNING id, email, role, version_session`;
  return u ?? null;
}

export const lienVerification = (base: string, jeton: string) => `${base}/#/espace/verifier/${jeton}`;
export const lienEspace = (base: string) => `${base}/#/espace`;
