import bcrypt from "bcryptjs";
import { EMAIL_FOUNDER, MOT_DE_PASSE_MIN } from "../../../shared/cockpit.js";
import { HttpError, json, readBody } from "../web.js";
import { sql } from "./db.js";
import { emailReinitialisation, envoyerEmail, urlApplication } from "./emails.js";
import { creerJeton, lienMotDePasse, lireJeton } from "./jetons.js";
import { journaliser } from "./journal.js";
import { compterTentative, effacerTentatives, limiter, regles, verifierLimite } from "./limite.js";
import type { Routeur } from "./router.js";
import { cookieDeconnexion, cookieSession, profilConnecte, versMoi, type Profil } from "./session.js";

// Hash factice : on compare quand même quand l'e-mail est inconnu, pour ne pas révéler par le temps de réponse quels comptes existent.
const HASH_FACTICE = bcrypt.hashSync("compte-inexistant", 10);

/** Ouvre la session : cookie signé et profil de la personne. */
async function ouvrirSession(p: Profil & { version_session: number }) {
  return json({ moi: versMoi(p) }, { headers: { "Set-Cookie": await cookieSession(p.id, p.version_session) } });
}

export function routesAuth(r: Routeur) {
  r.ajouter("GET", "auth/moi", async ({ req }) => {
    const p = await profilConnecte(req);
    return json({ moi: p ? versMoi(p) : null });
  });

  r.ajouter("POST", "auth/connexion", async ({ req }) => {
    const b = await readBody<{ email?: string; motDePasse?: string }>(req);
    const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
    const motDePasse = typeof b.motDePasse === "string" ? b.motDePasse : "";
    // 5 échecs par compte et 30 par adresse IP sur 15 minutes.
    const limites = regles(req, "connexion", { email, max: 5 }, 30, 15);
    await verifierLimite(limites);
    const lire = () => sql`
      SELECT id, nom, email, role, actif, onglets, mot_de_passe_hash, version_session FROM profils WHERE email = ${email}`;
    let p = (await lire())[0];

    // Un admin de l'espace client (table users, désigné par npm run db:make-admin) entre dans Cockpit avec ses identifiants
    // habituels : à sa première connexion, son profil Co-Founder (Founder pour EMAIL_FOUNDER) est créé avec le même mot de passe.
    const admin = p
      ? undefined
      : (await sql`SELECT name, email, password_hash FROM users WHERE email = ${email} AND role = 'admin' AND email_verifie_le IS NOT NULL`)[0];

    const ok = await bcrypt.compare(motDePasse, p?.mot_de_passe_hash ?? admin?.password_hash ?? HASH_FACTICE);
    if (!ok || (!p?.mot_de_passe_hash && !admin)) {
      await compterTentative(limites);
      throw new HttpError(401, "E-mail ou mot de passe incorrect.");
    }
    await effacerTentatives(`connexion:email:${email}`);
    if (!p) {
      await sql`
        INSERT INTO profils (nom, email, role, mot_de_passe_hash, mot_de_passe_le, active_le)
        VALUES (${admin!.name}, ${admin!.email}, ${email === EMAIL_FOUNDER ? "founder" : "cofounder"}, ${admin!.password_hash}, now(), now())
        ON CONFLICT (email) DO NOTHING`;
      p = (await lire())[0];
      if (!p) throw new HttpError(401, "E-mail ou mot de passe incorrect.");
      await journaliser(null, { id: p.id, nom: p.nom }, "creation", { role: p.role, origine: "admin de l'espace client" });
    }
    if (!p.actif) throw new HttpError(403, "Ce compte est archivé. Contactez un responsable de Central Test Agency.");
    return ouvrirSession(p as Profil & { version_session: number });
  });

  r.ajouter("POST", "auth/deconnexion", async () => json({ ok: true }, { headers: { "Set-Cookie": cookieDeconnexion() } }));

  // Réponse identique que le compte existe ou non.
  r.ajouter("POST", "auth/mot-de-passe-oublie", async ({ req }) => {
    const b = await readBody<{ email?: string }>(req);
    const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
    // 3 demandes par compte et 10 par adresse IP par heure : évite d'inonder une boîte de liens.
    await limiter(regles(req, "oubli", { email, max: 3 }, 10, 60));
    const rows = await sql`SELECT id, email FROM profils WHERE email = ${email} AND actif`;
    if (rows[0]) {
      const jeton = await creerJeton(rows[0].id, "reinitialisation");
      await envoyerEmail(emailReinitialisation(rows[0].email, lienMotDePasse(urlApplication(req), jeton)));
    }
    return json({ ok: true });
  });

  r.ajouter("GET", "auth/jeton", async ({ url }) => {
    const j = await lireJeton(url.searchParams.get("jeton"));
    if (!j) throw new HttpError(410, "Ce lien n'est plus valable. Demandez-en un nouveau.");
    return json({ nom: j.nom, email: j.email, type: j.type });
  });

  r.ajouter("POST", "auth/definir-mot-de-passe", async ({ req }) => {
    const b = await readBody<{ jeton?: string; motDePasse?: string; confirmation?: string }>(req);
    const mdp = typeof b.motDePasse === "string" ? b.motDePasse : "";
    if (mdp.length < MOT_DE_PASSE_MIN) throw new HttpError(400, `Le mot de passe doit faire au moins ${MOT_DE_PASSE_MIN} caractères.`);
    if (mdp.length > 200) throw new HttpError(400, "Le mot de passe est trop long.");
    if (mdp !== b.confirmation) throw new HttpError(400, "Les deux mots de passe ne correspondent pas.");

    const j = await lireJeton(b.jeton);
    if (!j) throw new HttpError(410, "Ce lien n'est plus valable. Demandez-en un nouveau.");
    // Marque le jeton utilisé en premier : deux envois simultanés ne peuvent pas le consommer deux fois.
    const pris = await sql`UPDATE jetons SET utilise_le = now() WHERE empreinte = ${j.empreinte} AND utilise_le IS NULL RETURNING profil_id`;
    if (!pris.length) throw new HttpError(410, "Ce lien n'est plus valable. Demandez-en un nouveau.");

    const hash = await bcrypt.hash(mdp, 10);
    const rows = await sql`
      UPDATE profils
      SET mot_de_passe_hash = ${hash}, mot_de_passe_le = now(), active_le = COALESCE(active_le, now()),
          version_session = version_session + 1
      WHERE id = ${j.profil_id} AND actif
      RETURNING id, nom, email, role, actif, onglets, version_session`;
    if (!rows[0]) throw new HttpError(410, "Ce lien n'est plus valable. Demandez-en un nouveau.");
    await sql`DELETE FROM jetons WHERE profil_id = ${j.profil_id} AND utilise_le IS NULL`;
    const p = rows[0] as Profil & { version_session: number };
    if (j.type === "reinitialisation") await journaliser({ id: p.id, nom: p.nom }, { id: p.id, nom: p.nom }, "mot_de_passe_reinitialise");
    return ouvrirSession(p);
  });
}
