import { HttpError } from "../web.js";
import { sql } from "./db.js";

// Limitation des tentatives, stockée en base (les fonctions serverless ne partagent pas de mémoire).
// Utilisée par Cockpit et par l'espace client : connexion, mot de passe oublié, inscription.

export type Regle = { cle: string; max: number; minutes: number };

/** Adresse IP du visiteur. Sur Vercel, x-forwarded-for est réécrit par la plateforme et ne peut pas être falsifié. */
export function adresseIp(req: Request): string | null {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip")?.trim();
  return ip ? ip.slice(0, 64) : null;
}

/** Règles par e-mail et par IP pour une action. Sans IP connue (tests, appels internes), seule la règle e-mail s'applique. */
export function regles(req: Request, action: string, parEmail: { email: string; max: number } | null, parIp: number, minutes: number): Regle[] {
  const r: Regle[] = [];
  if (parEmail?.email) r.push({ cle: `${action}:email:${parEmail.email}`, max: parEmail.max, minutes });
  const ip = adresseIp(req);
  if (ip) r.push({ cle: `${action}:ip:${ip}`, max: parIp, minutes });
  return r;
}

/** Refuse (429) si l'une des règles a atteint son maximum sur sa fenêtre. */
export async function verifierLimite(liste: Regle[]) {
  for (const { cle, max, minutes } of liste) {
    const [r] = await sql`SELECT count(*)::int AS n FROM tentatives WHERE cle = ${cle} AND le > now() - make_interval(mins => ${minutes})`;
    if ((r?.n ?? 0) >= max) throw new HttpError(429, "Trop de tentatives. Réessayez dans quelques minutes.");
  }
}

/** Compte une tentative pour chaque règle et purge de temps en temps les lignes de plus d'un jour. */
export async function compterTentative(liste: Regle[]) {
  for (const { cle } of liste) await sql`INSERT INTO tentatives (cle) VALUES (${cle})`;
  if (Math.random() < 0.05) await sql`DELETE FROM tentatives WHERE le < now() - interval '1 day'`;
}

/** Après une connexion réussie, on oublie les échecs liés à cet e-mail. */
export async function effacerTentatives(cle: string) {
  await sql`DELETE FROM tentatives WHERE cle = ${cle}`;
}

/** Vérifie puis compte : pour les actions limitées à chaque appel (mot de passe oublié, inscription). */
export async function limiter(liste: Regle[]) {
  await verifierLimite(liste);
  await compterTentative(liste);
}
