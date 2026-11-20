// Crée les tables et charge (ou met à jour) les modèles de questionnaires.
// Usage : npm run db:setup            (lit DATABASE_URL dans .env)
//         npm run db:make-admin -- toi@exemple.com
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL manquant. Ajoute-le dans .env.");
  process.exit(1);
}
const sql = neon(url);

const [command, arg] = process.argv.slice(2);

if (command === "make-admin") {
  if (!arg) {
    console.error("Usage : npm run db:make-admin -- email@exemple.com");
    process.exit(1);
  }
  const rows = await sql`UPDATE users SET role = 'admin' WHERE email = ${arg.trim().toLowerCase()} RETURNING email`;
  console.log(rows.length ? `${rows[0].email} est maintenant admin.` : "Aucun compte avec cet email. Crée d'abord le compte sur le site.");
  process.exit(0);
}

// 1. Schéma
const schema = readFileSync(path.join(root, "db/schema.sql"), "utf8")
  .split(/;\s*\n/)
  .map((s) => s.replace(/^\s*--.*$/gm, "").trim())
  .filter(Boolean);
for (const statement of schema) await sql.query(statement);
console.log(`Schéma appliqué (${schema.length} instructions).`);

// 2. Modèles de questionnaires
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
