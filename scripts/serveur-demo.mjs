// Cockpit en démonstration : interface Vite + API branchée sur un Postgres en mémoire (PGlite), avec des données d'exemple.
// Aucune base Neon ni aucun secret requis. Les données disparaissent à l'arrêt.
// Usage : npm run dev:demo   puis http://localhost:5199/cockpit/   (mot de passe de tous les comptes : demo1234)
// Utilisé aussi par les tests Playwright (playwright.config.ts).
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { PGlite } from "@electric-sql/pglite";
import { createServer } from "vite";

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT || 5199);
process.env.AUTH_SECRET ||= "secret-de-demonstration-uniquement-0123456789abcdef";
process.env.APP_URL ||= `http://localhost:${PORT}`;
delete process.env.RESEND_API_KEY; // les liens d'invitation s'affichent à l'écran
delete process.env.VERCEL_ENV;

const MOT_DE_PASSE = "demo1234";

// Même clé que shared/import.ts (nom + commune), pour qu'un import reconnaisse les cabinets de démo.
const cle = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

async function remplir(db) {
  const hash = bcrypt.hashSync(MOT_DE_PASSE, 8);

  // Espace client : un admin « historique », deux comptes clients, le questionnaire de cadrage et une réponse.
  await db.query(`INSERT INTO users (email, password_hash, name, role) VALUES ('ancien-admin@cta.test', $1, 'Admin Historique', 'admin')`, [hash]);
  await db.query(
    `INSERT INTO users (email, password_hash, name, company, role) VALUES ('nadia@pharma.test', $1, 'Nadia Kaci', 'Pharma Plus', 'client'), ('omar@banque.test', $1, 'Omar Ziani', 'Banque du Sud', 'client')`,
    [hash],
  );
  const q = JSON.parse(readFileSync(path.join(racine, "db/questionnaires/cadrage-cta.json"), "utf8"));
  await db.query(`INSERT INTO questionnaires (slug, title, description, schema) VALUES ($1, $2, $3, $4)`, [q.slug, q.title, q.description, JSON.stringify({ sections: q.sections })]);
  const premiere = q.sections[0].questions;
  const reponses = Object.fromEntries(premiere.map((x) => [x.id, x.type === "multi" ? x.options.slice(0, 2) : x.options ? x.options[0] : "Application de gestion des stocks pour nos pharmacies."]));
  await db.query(
    `INSERT INTO assignments (user_id, questionnaire_id, questionnaire_snapshot, title, message, status, answers, submitted_at)
     SELECT u.id, q.id, jsonb_build_object('description', q.description) || q.schema, q.title, 'Bonjour Nadia', 'submitted', $1::jsonb, now()
     FROM users u, questionnaires q WHERE u.email = 'nadia@pharma.test'`,
    [JSON.stringify(reponses)],
  );
  const profils = [
    ["Amina Cherif", "admin@cta.test", "cofounder"],
    ["Karim Ait Ali", "qa@cta.test", "qa_manager"],
    ["Yasmine Belkacem", "yasmine@cta.test", "collaborateur"],
    ["Sofiane Mekki", "sofiane@cta.test", "collaborateur"],
  ];
  for (const [nom, email, role] of profils)
    await db.query(`INSERT INTO profils (nom, email, role, mot_de_passe_hash, mot_de_passe_le, active_le) VALUES ($1, $2, $3, $4, now(), now())`, [nom, email, role, hash]);
  await db.query(`INSERT INTO profils (nom, email, role) VALUES ('Lina Bouzid', 'lina@cta.test', 'collaborateur')`);
  await db.query(`INSERT INTO clients (nom, tjm_dzd) VALUES ('Banque Atlas', 60000), ('VetCare', 45000), ('Sonatrach Digital', 75000)`);
  await db.query(`
    INSERT INTO affectations SELECT p.id, c.id FROM profils p, clients c
    WHERE (p.email = 'yasmine@cta.test' AND c.nom IN ('Banque Atlas', 'VetCare'))
       OR (p.email = 'sofiane@cta.test' AND c.nom = 'Sonatrach Digital')
       OR (p.email = 'lina@cta.test' AND c.nom = 'VetCare')`);

  const auj = new Date();
  const jour = (n) => new Date(auj.getTime() + n * 86400000).toISOString().slice(0, 10);
  const cabinets = [
    ["Clinique Vétérinaire El Biar", "Dr Amrani", "El Biar", "0550 12 34 56", "Clinique", "S1", "a_contacter", null],
    ["Cabinet Vétérinaire Hydra", "Dr Benali", "Hydra", "0770 98 76 54", "Cabinet", "S1", "message_envoye", jour(-2)],
    ["Cabinet du Dr Saïdi", "Dr Saïdi", "Kouba", "021 28 00 00", "Cabinet", "S1", "a_contacter", null],
    ["Clinique Bab Ezzouar", "Dr Lounes", "Bab Ezzouar", "0661 22 33 44", "Clinique", "S2", "relance", jour(0)],
    ["Vétérinaire Chéraga", "Dr Haddad", "Chéraga", "0555 44 33 22", "Cabinet", "S2", "en_discussion", jour(2)],
    ["Clinique des Pins", "Dr Ouali", "Ben Aknoun", "0697 11 22 33", "Clinique", "S2", "demo_planifiee", jour(5)],
    ["Cabinet Rouiba", "Dr Mansouri", "Rouiba", "0550 77 88 99", "Cabinet", "S3", "client_signe", null],
    ["Cabinet Dély Ibrahim", "Dr Kaci", "Dély Ibrahim", "0771 55 66 77", "Cabinet", "S3", "pas_interesse", null],
    ["Cabinet Saïd Hamdine", "Dr Ferhat", "Bir Mourad Raïs", "0550 12 34 56", "Cabinet", "S3", "a_contacter", null],
    ["Clinique Fermée", "Dr X", "Alger", "021 00 00 00", "Cabinet", "S3", "hors_cible", null],
  ];
  for (const [i, [nom, vet, commune, tel, segment, semaine, statut, relance]] of cabinets.entries())
    await db.query(
      `INSERT INTO cabinets (cle, nom, veterinaire, commune, telephone, segment, semaine_plan, canal1, statut, relance_le, premier_contact, adresse, horaires, lat, lng)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'WhatsApp', $8, $9, $10, $11, '8h-18h', 36.75, 3.05)`,
      [`${cle(nom)}-${cle(commune)}`, nom, vet, commune, tel, segment, semaine, statut, relance, statut === "a_contacter" || statut === "hors_cible" ? null : jour(-7), `${i + 1} rue de la Paix, ${commune}`],
    );
}

const db = new PGlite();
await db.exec(readFileSync(path.join(racine, "db/schema.sql"), "utf8")); // espace client
for (const f of readdirSync(path.join(racine, "db/migrations")).filter((f) => f.endsWith(".sql")).sort())
  await db.exec(readFileSync(path.join(racine, "db/migrations", f), "utf8"));
if (process.env.DEMO_VIDE !== "1") await remplir(db);

const serveur = await createServer({
  configFile: path.join(racine, "vite.config.ts"),
  server: { port: PORT, strictPort: true },
  plugins: [
    {
      name: "api-cockpit-demo",
      async configureServer(srv) {
        const { brancherSql } = await srv.ssrLoadModule(path.join(racine, "api/_lib/cockpit/db.ts"));
        brancherSql(async (strings, ...valeurs) => (await db.query(strings.reduce((a, s, i) => a + (i ? `$${i}` : "") + s, ""), valeurs)).rows);
        srv.middlewares.use(async (req, res, suite) => {
          if (!req.url?.startsWith("/api/cockpit")) return suite();
          const morceaux = [];
          for await (const m of req) morceaux.push(m);
          const { traiter } = await srv.ssrLoadModule(path.join(racine, "api/_lib/cockpit/app.ts"));
          const reponse = await traiter(
            new Request(`http://localhost:${PORT}${req.url}`, {
              method: req.method,
              headers: req.headers,
              body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(morceaux),
            }),
          );
          res.statusCode = reponse.status;
          reponse.headers.forEach((v, k) => res.setHeader(k, v));
          res.end(Buffer.from(await reponse.arrayBuffer()));
        });
      },
    },
  ],
});
await serveur.listen();
console.log(`Cockpit (démo) : http://localhost:${PORT}/cockpit/  ·  admin@cta.test / ${MOT_DE_PASSE}  ·  yasmine@cta.test / ${MOT_DE_PASSE}`);
