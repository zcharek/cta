import { neon } from "@neondatabase/serverless";
import { SignJWT, jwtVerify } from "jose";

// Fichiers préfixés par « _ » : Vercel ne les expose pas comme routes.

export const sql = neon(process.env.DATABASE_URL!);

const COOKIE = "cta_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 jours

export type Session = { id: string; email: string; role: "client" | "admin" };

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function json(data: unknown, init: ResponseInit = {}) {
  return Response.json(data, { ...init, headers: { "Cache-Control": "no-store", ...init.headers } });
}

/** Enveloppe un handler : transforme les HttpError en réponses JSON propres. */
export function handler(fn: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    try {
      return await fn(req);
    } catch (err) {
      if (err instanceof HttpError) return json({ error: err.message }, { status: err.status });
      console.error(err);
      return json({ error: "Erreur serveur. Réessayez dans un instant." }, { status: 500 });
    }
  };
}

export async function readBody<T>(req: Request): Promise<T> {
  // Exiger du JSON bloque les formulaires cross-site (en plus de SameSite=Lax sur le cookie).
  if (!req.headers.get("content-type")?.includes("application/json")) throw new HttpError(415, "JSON attendu.");
  try {
    return (await req.json()) as T;
  } catch {
    throw new HttpError(400, "Requête invalide.");
  }
}

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("AUTH_SECRET manquant ou trop court (32 caractères minimum).");
  return new TextEncoder().encode(s);
}

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
  const raw = req.headers.get("cookie") ?? "";
  const token = raw.split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
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

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Vérifie un identifiant avant de l'envoyer à Postgres (sinon erreur 500 sur une valeur mal formée). */
export function uuid(value: unknown, what = "Élément"): string {
  if (typeof value !== "string" || !UUID.test(value)) throw new HttpError(404, `${what} introuvable.`);
  return value;
}

export function isAdminEmail(email: string) {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(email);
}
