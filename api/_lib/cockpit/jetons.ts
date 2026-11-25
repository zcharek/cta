import { createHash, randomBytes } from "node:crypto";
import { sql } from "./db.js";

export type TypeJeton = "invitation" | "reinitialisation";

const DUREE: Record<TypeJeton, string> = { invitation: "7 days", reinitialisation: "1 hour" };

export const empreinte = (jeton: string) => createHash("sha256").update(jeton).digest("hex");

/** Crée un jeton à usage unique et annule les précédents du même type. Seule son empreinte est stockée. */
export async function creerJeton(profilId: string, type: TypeJeton): Promise<string> {
  const jeton = randomBytes(32).toString("base64url");
  await sql`DELETE FROM jetons WHERE profil_id = ${profilId} AND type = ${type} AND utilise_le IS NULL`;
  await sql`
    INSERT INTO jetons (empreinte, profil_id, type, expire_le)
    VALUES (${empreinte(jeton)}, ${profilId}, ${type}, now() + ${DUREE[type]}::interval)`;
  return jeton;
}

/** Profil associé à un jeton encore valable (non utilisé, non expiré, profil actif). */
export async function lireJeton(jeton: unknown) {
  if (typeof jeton !== "string" || jeton.length < 20 || jeton.length > 200) return null;
  const rows = await sql`
    SELECT j.empreinte, j.type, p.id AS profil_id, p.nom, p.email, p.role
    FROM jetons j JOIN profils p ON p.id = j.profil_id
    WHERE j.empreinte = ${empreinte(jeton)} AND j.utilise_le IS NULL AND j.expire_le > now() AND p.actif`;
  return rows[0] ?? null;
}

export const lienMotDePasse = (base: string, jeton: string) => `${base}/cockpit/definir-mot-de-passe?jeton=${jeton}`;
