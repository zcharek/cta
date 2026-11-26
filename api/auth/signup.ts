import bcrypt from "bcryptjs";
import { emailCompteExistant, emailVerification, envoyerEmail, lienVisibleEnReponse, urlApplication } from "../_lib/cockpit/emails.js";
import { limiter, regles } from "../_lib/cockpit/limite.js";
import { HttpError, handler, json, readBody, sql } from "../_lib/http.js";
import { creerVerification, lienEspace, lienVerification } from "../_lib/verification.js";

type Body = { email?: string; password?: string; name?: string; company?: string; phone?: string };

// Inscription : le compte est créé, mais on ne s'y connecte qu'après avoir confirmé son adresse par le lien reçu.
// La réponse est la même que l'adresse soit libre ou déjà utilisée : on ne révèle pas qui a un compte.
export const POST = handler(async (req) => {
  const b = await readBody<Body>(req);
  // 10 inscriptions par adresse IP et par heure.
  await limiter(regles(req, "inscription", null, 10, 60));
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  const name = typeof b.name === "string" ? b.name.trim() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) throw new HttpError(400, "Adresse email invalide.");
  if (!name) throw new HttpError(400, "Merci d'indiquer votre nom.");
  if (typeof b.password !== "string" || b.password.length < 8) throw new HttpError(400, "Le mot de passe doit faire au moins 8 caractères.");
  if (b.password.length > 200) throw new HttpError(400, "Le mot de passe est trop long.");
  const hash = await bcrypt.hash(b.password, 10);
  const texte = (v: unknown, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);

  // Toujours « client » : un admin est désigné en ligne de commande (npm run db:make-admin -- email@exemple.com).
  const [cree] = await sql`
    INSERT INTO users (email, password_hash, name, company, phone, role)
    VALUES (${email}, ${hash}, ${name.slice(0, 120)}, ${texte(b.company, 120)}, ${texte(b.phone, 40)}, 'client')
    ON CONFLICT (email) DO NOTHING
    RETURNING id`;

  const base = urlApplication(req);
  let lien: string | undefined;
  if (cree) {
    lien = lienVerification(base, await creerVerification(cree.id));
    await envoyerEmail(emailVerification(email, name, lien));
  } else {
    const [existant] = await sql`SELECT id, name, email_verifie_le FROM users WHERE email = ${email}`;
    // Pas encore confirmé : on renvoie le lien. Déjà confirmé : on prévient le titulaire par e-mail.
    if (existant && !existant.email_verifie_le) {
      lien = lienVerification(base, await creerVerification(existant.id));
      await envoyerEmail(emailVerification(email, existant.name, lien));
    } else if (existant) {
      await envoyerEmail(emailCompteExistant(email, lienEspace(base)));
      lien = undefined;
    }
  }
  return json({ verificationEnvoyee: true, ...(lienVisibleEnReponse() && lien ? { lien } : {}) }, { status: 202 });
});
