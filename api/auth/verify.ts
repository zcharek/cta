import { emailVerification, envoyerEmail, lienVisibleEnReponse, urlApplication } from "../_lib/cockpit/emails.js";
import { limiter, regles } from "../_lib/cockpit/limite.js";
import { HttpError, handler, json, readBody, sessionCookie, sql, type Session } from "../_lib/http.js";
import { consommerVerification, creerVerification, lienVerification } from "../_lib/verification.js";

// POST { jeton } : confirme l'adresse (lien reçu par e-mail) et ouvre la session.
// POST { email } : renvoie le lien de confirmation. Réponse identique que le compte existe ou non.
// Le lien mène à une page du site qui appelle cette route : un antivirus qui « visite » le lien ne consomme rien.
export const POST = handler(async (req) => {
  const b = await readBody<{ jeton?: unknown; email?: unknown }>(req);

  if (b.jeton !== undefined) {
    await limiter(regles(req, "verification", null, 30, 15));
    const u = (await consommerVerification(b.jeton)) as Session | null;
    if (!u) throw new HttpError(410, "Ce lien n'est plus valable. Connectez-vous pour en recevoir un nouveau.");
    return json({ user: { id: u.id, email: u.email, role: u.role } }, { headers: { "Set-Cookie": await sessionCookie(u) } });
  }

  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  // 3 envois par adresse et 10 par IP par heure.
  await limiter(regles(req, "renvoi-verification", { email, max: 3 }, 10, 60));
  const [u] = await sql`SELECT id, name FROM users WHERE email = ${email} AND email_verifie_le IS NULL`;
  let lien: string | undefined;
  if (u) {
    lien = lienVerification(urlApplication(req), await creerVerification(u.id));
    await envoyerEmail(emailVerification(email, u.name, lien));
  }
  return json({ ok: true, ...(lienVisibleEnReponse() && lien ? { lien } : {}) });
});
