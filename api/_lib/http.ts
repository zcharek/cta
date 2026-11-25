import { neon } from "@neondatabase/serverless";
import { SignJWT, jwtVerify } from "jose";
import { HttpError, authSecret as secret, readCookie } from "./web.js";

export { HttpError, handler, json, readBody, uuid } from "./web.js";

// Fichiers préfixés par « _ » : Vercel ne les expose pas comme routes.

export const sql = neon(process.env.DATABASE_URL!);

const COOKIE = "cta_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 jours

export type Session = { id: string; email: string; role: "client" | "admin" };

export async function sessionCookie(user: Session) {
  const token = await new SignJWT({ email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
  const secure = process.env.VERCEL_ENV ? "; Secure" : "";
  return `${COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${MAX_AGE}${secure}`;
}

export function clearCookie() {
  return `${COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;
}

export async function getSession(req: Request): Promise<Session | null> {
  const token = readCookie(req, COOKIE);
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    // Le rôle est relu en base : une rétrogradation prend effet immédiatement.
    const rows = await sql`SELECT id, email, role FROM users WHERE id = ${payload.sub!}`;
    return (rows[0] as Session | undefined) ?? null;
  } catch {
    return null;
  }
}

export async function requireUser(req: Request) {
  const s = await getSession(req);
  if (!s) throw new HttpError(401, "Veuillez vous connecter.");
  return s;
}

export async function requireAdmin(req: Request) {
  const s = await requireUser(req);
  if (s.role !== "admin") throw new HttpError(403, "Accès réservé à l'administrateur.");
  return s;
}

export function isAdminEmail(email: string) {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(email);
}
