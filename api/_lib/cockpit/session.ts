import { SignJWT, jwtVerify } from "jose";
import { estAdmin, gereLesAcces, ongletsDe, type Moi, type Onglet, type Role } from "../../../shared/cockpit.js";
import { HttpError, authSecret, readCookie } from "../web.js";
import { sql } from "./db.js";

const COOKIE = "cockpit_session";
const DUREE = 60 * 60 * 24 * 7; // 7 jours

export type Profil = { id: string; nom: string; email: string; role: Role; actif: boolean; onglets?: string[] | null };

export function versMoi(p: Profil): Moi {
  return { id: p.id, nom: p.nom, email: p.email, role: p.role, admin: estAdmin(p), gereAcces: gereLesAcces(p), onglets: ongletsDe(p) };
}

export async function cookieSession(profilId: string, version: number) {
  const token = await new SignJWT({ v: version })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(profilId)
    .setIssuedAt()
    .setExpirationTime(`${DUREE}s`)
    .sign(authSecret());
  const secure = process.env.VERCEL_ENV ? "; Secure" : "";
  return `${COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${DUREE}${secure}`;
}

export function cookieDeconnexion() {
  return `${COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;
}

/**
 * Profil connecté, relu en base à chaque requête : un archivage ou un changement de type
 * prend effet immédiatement. Un changement de mot de passe (version_session) invalide les sessions plus anciennes.
 */
export async function profilConnecte(req: Request): Promise<Profil | null> {
  const token = readCookie(req, COOKIE);
  if (!token) return null;
  let sub: string | undefined;
  let version: unknown;
  try {
    const { payload } = await jwtVerify(token, authSecret());
    sub = payload.sub;
    version = payload.v;
  } catch {
    return null;
  }
  if (!sub || typeof version !== "number" || !/^[0-9a-f-]{36}$/i.test(sub)) return null;
  const rows = await sql`
    SELECT id, nom, email, role, actif, onglets FROM profils
    WHERE id = ${sub} AND actif AND mot_de_passe_hash IS NOT NULL AND version_session = ${version}`;
  const p = rows[0];
  if (!p) return null;
  return { id: p.id, nom: p.nom, email: p.email, role: p.role, actif: p.actif, onglets: p.onglets };
}

export async function exigerProfil(req: Request): Promise<Profil> {
  const p = await profilConnecte(req);
  if (!p) throw new HttpError(401, "Veuillez vous connecter.");
  return p;
}

export async function exigerAdmin(req: Request): Promise<Profil> {
  const p = await exigerProfil(req);
  if (!estAdmin(p)) throw new HttpError(403, "Accès réservé.");
  return p;
}

/** La personne a-t-elle accès à l'un de ces onglets ? */
export const aOnglet = (p: Profil, ...onglets: Onglet[]) => p.actif && onglets.some((o) => ongletsDe(p).includes(o));

/** Profil connecté ayant accès à au moins un des onglets donnés. */
export async function exigerOnglet(req: Request, ...onglets: Onglet[]): Promise<Profil> {
  const p = await exigerProfil(req);
  if (!aOnglet(p, ...onglets)) throw new HttpError(403, "Accès réservé.");
  return p;
}
