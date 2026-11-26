import { clearCookie, getSession, handler, json, sql } from "../_lib/http.js";

// Déconnexion : efface le cookie et invalide le jeton côté serveur (toutes les sessions de ce compte).
export const POST = handler(async (req) => {
  const s = await getSession(req);
  if (s) await sql`UPDATE users SET version_session = version_session + 1 WHERE id = ${s.id}`;
  return json({ ok: true }, { headers: { "Set-Cookie": clearCookie() } });
});
