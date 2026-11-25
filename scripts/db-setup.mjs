// Crée les tables, applique les migrations Cockpit et charge (ou met à jour) les modèles de questionnaires.
// Usage : npm run db:setup                         (lit DATABASE_URL dans .env)
//         (automatique) au build de production Vercel, avec --deploiement
//         npm run db:make-admin -- toi@exemple.com  (admin de l'espace client)
//         npm run cockpit:seed                      (premier compte Co-Founder de Cockpit)
import { createHash, randomBytes } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";
import { decouperSql } from "./sql-split.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Appelé par le build Vercel (vercel.json) : migrations appliquées au déploiement de production uniquement.
// Les previews n'y touchent pas, pour qu'une branche non fusionnée ne modifie pas la base.
if (process.argv.includes("--deploiement") && process.env.VERCEL_ENV !== "production") {
  console.log(`Migrations ignorées (environnement : ${process.env.VERCEL_ENV ?? "local"}).`);
  process.exit(0);
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL manquant. Ajoute-le dans .env.");
  process.exit(1);
}
const sql = neon(url);

const [command, arg] = process.argv.slice(2).filter((a) => a !== "--deploiement");

if (command === "make-admin") {
  if (!arg) {
    console.error("Usage : npm run db:make-admin -- email@exemple.com");
    process.exit(1);
  }
  const rows = await sql`UPDATE users SET role = 'admin' WHERE email = ${arg.trim().toLowerCase()} RETURNING email`;
  console.log(rows.length ? `${rows[0].email} est maintenant admin.` : "Aucun compte avec cet email. Crée d'abord le compte sur le site.");
  process.exit(0);
}

if (command === "seed-cockpit") {
  await seedCockpit();
  process.exit(0);
}

// 1. Schéma de l'espace client (idempotent)
const schema = decouperSql(readFileSync(path.join(root, "db/schema.sql"), "utf8"));
for (const statement of schema) await sql.query(statement);
console.log(`Schéma appliqué (${schema.length} instructions).`);

// 2. Migrations versionnées (Cockpit) : chacune n'est appliquée qu'une fois, dans une transaction.
await sql.query(`CREATE TABLE IF NOT EXISTS schema_migrations (nom text PRIMARY KEY, appliquee_le timestamptz NOT NULL DEFAULT now())`);
const faites = new Set((await sql`SELECT nom FROM schema_migrations`).map((r) => r.nom));
const migDir = path.join(root, "db/migrations");
for (const file of readdirSync(migDir).filter((f) => f.endsWith(".sql")).sort()) {
  if (faites.has(file)) continue;
  const statements = decouperSql(readFileSync(path.join(migDir, file), "utf8"));
  await sql.transaction([...statements.map((s) => sql.query(s)), sql`INSERT INTO schema_migrations (nom) VALUES (${file})`]);
  console.log(`Migration ${file} appliquée.`);
}

// 3. Modèles de questionnaires
const dir = path.join(root, "db/questionnaires");
for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const q = JSON.parse(readFileSync(path.join(dir, file), "utf8"));
  const body = { sections: q.sections };
  await sql`
    INSERT INTO questionnaires (slug, title, description, schema)
    VALUES (${q.slug}, ${q.title}, ${q.description ?? null}, ${JSON.stringify(body)})
    ON CONFLICT (slug) DO UPDATE
      SET title = EXCLUDED.title, description = EXCLUDED.description, schema = EXCLUDED.schema, updated_at = now()`;
  console.log(`Questionnaire « ${q.title} » chargé.`);
}

async function seedCockpit() {
  const email = process.env.COCKPIT_SEED_EMAIL?.trim().toLowerCase();
  const nom = process.env.COCKPIT_SEED_NOM?.trim();
  const motDePasse = process.env.COCKPIT_SEED_MOT_DE_PASSE;
  if (!email || !nom) {
    console.error("Renseigne COCKPIT_SEED_EMAIL et COCKPIT_SEED_NOM dans .env (COCKPIT_SEED_MOT_DE_PASSE est facultatif).");
    process.exit(1);
  }
  if (motDePasse && motDePasse.length < 8) {
    console.error("COCKPIT_SEED_MOT_DE_PASSE doit faire au moins 8 caractères.");
    process.exit(1);
  }
  const hash = motDePasse ? await bcrypt.hash(motDePasse, 10) : null;
  const role = email === "centraltestagency@gmail.com" ? "founder" : "cofounder";
  const rows = await sql`
    INSERT INTO profils (nom, email, role, mot_de_passe_hash, mot_de_passe_le, active_le)
    VALUES (${nom}, ${email}, ${role}, ${hash}, ${hash ? new Date().toISOString() : null}, ${hash ? new Date().toISOString() : null})
    ON CONFLICT (email) DO UPDATE SET role = ${role}, actif = true
    RETURNING id, mot_de_passe_hash IS NOT NULL AS a_mot_de_passe`;
  const profil = rows[0];
  console.log(`Compte ${role === "founder" ? "Founder" : "Co-Founder"} prêt : ${email}.`);
  if (profil.a_mot_de_passe) return;

  // Pas de mot de passe : on fabrique un lien pour le définir.
  const jeton = randomBytes(32).toString("base64url");
  const empreinte = createHash("sha256").update(jeton).digest("hex");
  await sql`
    INSERT INTO jetons (empreinte, profil_id, type, expire_le)
    VALUES (${empreinte}, ${profil.id}, 'invitation', now() + interval '7 days')`;
  const base = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
  console.log(`Définis ton mot de passe ici (valable 7 jours) :\n${base}/cockpit/definir-mot-de-passe?jeton=${jeton}`);
}
