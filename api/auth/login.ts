import bcrypt from "bcryptjs";
import { compterTentative, effacerTentatives, regles, verifierLimite } from "../_lib/cockpit/limite.js";
import { HttpError, handler, json, readBody, sessionCookie, sql, type Session } from "../_lib/http.js";

// Hash factice : on compare quand même quand l'email est inconnu, pour ne pas révéler par le temps de réponse quels emails existent.
const DUMMY_HASH = bcrypt.hashSync("compte-inexistant", 10);

export const POST = handler(async (req) => {
  const b = await readBody<{ email?: string; password?: string }>(req);
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  // 5 échecs par compte et 30 par adresse IP sur 15 minutes.
  const limites = regles(req, "portail-connexion", { email, max: 5 }, 30, 15);
  await verifierLimite(limites);
  const rows = await sql`SELECT id, email, role, password_hash, version_session, email_verifie_le FROM users WHERE email = ${email}`;
  const row = rows[0] as (Session & { password_hash: string; email_verifie_le: string | null }) | undefined;
  const ok = await bcrypt.compare(typeof b.password === "string" ? b.password : "", row?.password_hash ?? DUMMY_HASH);
  if (!row || !ok) {
    await compterTentative(limites);
    throw new HttpError(401, "Email ou mot de passe incorrect.");
  }
  await effacerTentatives(`portail-connexion:email:${email}`);
  // Vérifié après le mot de passe : on ne révèle pas à un inconnu si l'adresse est confirmée.
  if (!row.email_verifie_le) return json({ error: "Confirmez d'abord votre adresse e-mail avec le lien reçu.", nonVerifie: true }, { status: 403 });

  const user: Session = { id: row.id, email: row.email, role: row.role, version_session: row.version_session };
  return json({ user: { id: user.id, email: user.email, role: user.role } }, { headers: { "Set-Cookie": await sessionCookie(user) } });
});
