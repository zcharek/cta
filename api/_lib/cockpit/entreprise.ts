import type { Entreprise } from "../../../shared/facture.js";
import { HttpError } from "../web.js";
import { sql } from "./db.js";

export type IdentiteEntreprise = Entreprise & { numero_adherent?: string | null };

/**
 * Identité légale de CTA (en-tête des factures et bulletins).
 * En production, elle vient de la variable d'environnement ENTREPRISE_CTA (JSON) : figée, non modifiable depuis
 * Cockpit, et jamais versionnée (le dépôt est public). Sans cette variable (développement, tests), on lit le
 * paramètre « entreprise » de la base.
 */
export async function identiteEntreprise(): Promise<{ entreprise: IdentiteEntreprise | null; verrouillee: boolean }> {
  const brut = process.env.ENTREPRISE_CTA?.trim();
  const [r] = await sql`SELECT valeur FROM parametres WHERE cle = 'entreprise'`;
  const base = (r?.valeur ?? null) as IdentiteEntreprise | null;
  if (!brut) return { entreprise: base, verrouillee: false };
  let fixe: IdentiteEntreprise;
  try {
    fixe = JSON.parse(brut);
  } catch {
    throw new HttpError(500, "Variable ENTREPRISE_CTA invalide (JSON attendu).");
  }
  // Le N° adhérent peut venir de la variable ; sinon, celui saisi au premier bulletin de paie.
  return { entreprise: { ...fixe, numero_adherent: fixe.numero_adherent || base?.numero_adherent || null }, verrouillee: true };
}
