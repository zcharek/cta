// Intégration de l'espace client dans Cockpit : connexion des admins existants et pilotage des questionnaires.
import bcrypt from "bcryptjs";
import { beforeAll, describe, expect, it } from "vitest";
import type { Sql } from "../../api/_lib/cockpit/db";
import { appeler, creerProfil, preparerBase } from "./outils";

let sql: Sql;
let clientId: string;
let questionnaireId: string;

beforeAll(async () => {
  ({ sql } = await preparerBase());
  const hash = bcrypt.hashSync("ancien-mot-de-passe", 4);
  await sql`
    INSERT INTO users (email, password_hash, name, role) VALUES
      ('admin@cta.test', ${hash}, 'Charek Admin', 'admin'),
      ('client@societe.test', ${hash}, 'Nadia Client', 'client')`;
  [{ id: clientId }] = (await sql`SELECT id FROM users WHERE email = 'client@societe.test'`) as [{ id: string }];
  [{ id: questionnaireId }] = (await sql`
    INSERT INTO questionnaires (slug, title, description, schema)
    VALUES ('cadrage', 'Questionnaire de cadrage', 'Pour bien démarrer', ${JSON.stringify({ sections: [{ id: "s1", title: "Contexte", questions: [{ id: "q1", label: "Secteur ?", type: "text" }] }] })}::jsonb)
    RETURNING id`) as [{ id: string }];
});

describe("connexion d'un admin de l'espace client", () => {
  it("se connecte à Cockpit avec ses identifiants habituels et devient Co-Founder", async () => {
    const r = await appeler("POST", "auth/connexion", { corps: { email: "Admin@cta.test", motDePasse: "ancien-mot-de-passe" } });
    expect(r.status).toBe(200);
    expect(r.data.moi).toMatchObject({ email: "admin@cta.test", nom: "Charek Admin", role: "cofounder", admin: true });
    expect((await appeler("GET", "cabinets", { cookie: r.cookie })).status).toBe(200);
    // Une seconde connexion réutilise le même profil
    await appeler("POST", "auth/connexion", { corps: { email: "admin@cta.test", motDePasse: "ancien-mot-de-passe" } });
    const [n] = await sql`SELECT count(*)::int AS n FROM profils WHERE email = 'admin@cta.test'`;
    expect(n!.n).toBe(1);
  });

  it("refuse un mauvais mot de passe sans créer de profil", async () => {
    await sql`INSERT INTO users (email, password_hash, name, role) VALUES ('autre-admin@cta.test', ${bcrypt.hashSync("secret-123", 4)}, 'Autre', 'admin')`;
    expect((await appeler("POST", "auth/connexion", { corps: { email: "autre-admin@cta.test", motDePasse: "faux" } })).status).toBe(401);
    expect(await sql`SELECT 1 FROM profils WHERE email = 'autre-admin@cta.test'`).toHaveLength(0);
  });

  it("un compte client de l'espace client n'entre pas dans Cockpit", async () => {
    expect((await appeler("POST", "auth/connexion", { corps: { email: "client@societe.test", motDePasse: "ancien-mot-de-passe" } })).status).toBe(401);
  });

  it("un admin archivé dans Cockpit reste bloqué, même s'il est admin de l'espace client", async () => {
    await sql`UPDATE profils SET actif = false WHERE email = 'admin@cta.test'`;
    expect((await appeler("POST", "auth/connexion", { corps: { email: "admin@cta.test", motDePasse: "ancien-mot-de-passe" } })).status).toBe(403);
    await sql`UPDATE profils SET actif = true WHERE email = 'admin@cta.test'`;
  });
});

describe("espace client dans Cockpit", () => {
  let admin: string;
  let collab: string;

  beforeAll(async () => {
    admin = (await creerProfil(sql, "qa_manager")).cookie;
    collab = (await creerProfil(sql, "collaborateur")).cookie;
  });

  it("liste les comptes clients et les questionnaires disponibles", async () => {
    const r = await appeler("GET", "portail", { cookie: admin });
    expect(r.status).toBe(200);
    expect(r.data.comptes).toEqual([expect.objectContaining({ id: clientId, nom: "Nadia Client", email: "client@societe.test", envois: [] })]);
    expect(r.data.questionnaires).toEqual([expect.objectContaining({ id: questionnaireId, titre: "Questionnaire de cadrage" })]);
  });

  it("envoie un questionnaire, que le client voit dans son espace, puis affiche ses réponses", async () => {
    const envoi = await appeler("POST", "portail/envois", { cookie: admin, corps: { compteId: clientId, questionnaireId, message: "Bonjour Nadia" } });
    expect(envoi.status).toBe(201);
    const [a] = await sql`SELECT user_id, title, message, status FROM assignments WHERE id = ${envoi.data.id}`;
    expect(a).toMatchObject({ user_id: clientId, title: "Questionnaire de cadrage", message: "Bonjour Nadia", status: "sent" });

    await sql`UPDATE assignments SET answers = '{"q1": "Santé"}'::jsonb, status = 'submitted', submitted_at = now() WHERE id = ${envoi.data.id}`;
    const r = await appeler("GET", `portail/envois/${envoi.data.id}`, { cookie: admin });
    expect(r.data.envoi).toMatchObject({ titre: "Questionnaire de cadrage", statut: "submitted", nom: "Nadia Client", reponses: { q1: "Santé" } });
    expect(r.data.envoi.questionnaire.sections[0].questions[0].label).toBe("Secteur ?");

    const liste = await appeler("GET", "portail", { cookie: admin });
    expect(liste.data.comptes[0].envois[0]).toMatchObject({ titre: "Questionnaire de cadrage", statut: "submitted" });
  });

  it("refuse un envoi à un compte admin ou à un identifiant inconnu", async () => {
    const [adm] = await sql`SELECT id FROM users WHERE email = 'admin@cta.test'`;
    expect((await appeler("POST", "portail/envois", { cookie: admin, corps: { compteId: adm!.id, questionnaireId } })).status).toBe(404);
    expect((await appeler("POST", "portail/envois", { cookie: admin, corps: { compteId: "x", questionnaireId } })).status).toBe(404);
  });

  it("un Collaborateur n'y a pas accès", async () => {
    expect((await appeler("GET", "portail", { cookie: collab })).status).toBe(403);
    expect((await appeler("POST", "portail/envois", { cookie: collab, corps: { compteId: clientId, questionnaireId } })).status).toBe(403);
  });
});
