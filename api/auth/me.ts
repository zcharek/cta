import { getSession, handler, json, sql } from "../_lib/http.js";

export const GET = handler(async (req) => {
  const s = await getSession(req);
  if (!s) return json({ user: null });
  const rows = await sql`SELECT id, email, name, company, role FROM users WHERE id = ${s.id}`;
  return json({ user: rows[0] ?? null });
});
