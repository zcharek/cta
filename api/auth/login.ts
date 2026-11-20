import bcrypt from "bcryptjs";
import { HttpError, handler, json, readBody, sessionCookie, sql, type Session } from "../_lib/http.js";

// Hash factice : on compare quand même quand l'email est inconnu, pour ne pas révéler par le temps de réponse quels emails existent.
const DUMMY_HASH = bcrypt.hashSync("compte-inexistant", 10);

export const POST = handler(async (req) => {
  const b = await readBody<{ email?: string; password?: string }>(req);
  const email = b.email?.trim().toLowerCase() ?? "";
  const rows = await sql`SELECT id, email, role, password_hash FROM users WHERE email = ${email}`;
  const row = rows[0] as (Session & { password_hash: string }) | undefined;
  const ok = await bcrypt.compare(b.password ?? "", row?.password_hash ?? DUMMY_HASH);
  if (!row || !ok) throw new HttpError(401, "Email ou mot de passe incorrect.");

  const user: Session = { id: row.id, email: row.email, role: row.role };
  return json({ user }, { headers: { "Set-Cookie": await sessionCookie(user) } });
});
