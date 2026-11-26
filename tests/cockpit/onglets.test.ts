// Compte Founder verrouillé et onglets activables par utilisateur.
import bcrypt from "bcryptjs";
import { beforeAll, describe, expect, it } from "vitest";
import { EMAIL_FOUNDER, ONGLETS, ongletsDe } from "../../shared/cockpit";
import type { Sql } from "../../api/_lib/cockpit/db";
import { appeler, creerProfil, preparerBase } from "./outils";

let sql: Sql;
let founder: { id: string; cookie: string };
let cofounder: Awaited<ReturnType<typeof creerProfil>>;
let qa: Awaited<ReturnType<typeof creerProfil>>;
let assistant: Awaited<ReturnType<typeof creerProfil>>;

beforeAll(async () => {
  ({ sql } = await preparerBase());
  // Le compte fondateur existe dans l'espace client : sa première connexion crée son profil Founder.
  await sql`INSERT INTO users (email, password_hash, name, role, email_verifie_le) VALUES (${EMAIL_FOUNDER}, ${bcrypt.hashSync("fondateur-123", 4)}, 'Central Test Agency', 'admin', now())`;
  const r = await appeler("POST", "auth/connexion", { corps: { email: EMAIL_FOUNDER, motDePasse: "fondateur-123" } });
  expect(r.status).toBe(200);
  founder = { id: r.data.moi.id, cookie: r.cookie! };
  cofounder = await creerProfil(sql, "cofounder");
  qa = await creerProfil(sql, "qa_manager");
  assistant = await creerProfil(sql, "assistant");
});

const modifier = (cookie: string, id: string, corps: Record<string, unknown>) => appeler("PATCH", `collaborateurs/${id}`, { cookie, corps });

describe("compte Founder", () => {
  it("est Founder, gère les accès et a tous les onglets", async () => {
    const r = await appeler("GET", "auth/moi", { cookie: founder.cookie });
    expect(r.data.moi).toMatchObject({ email: EMAIL_FOUNDER, role: "founder", admin: true, gereAcces: true, onglets: [...ONGLETS] });
  });

  it("ne peut être ni archivé, ni changé de type, ni restreint, même par un Co-Founder", async () => {
    expect((await modifier(cofounder.cookie, founder.id, { actif: false })).status).toBe(403);
    expect((await modifier(cofounder.cookie, founder.id, { role: "assistant" })).status).toBe(403);
    expect((await modifier(cofounder.cookie, founder.id, { onglets: ["saisie"] })).status).toBe(403);
    expect((await modifier(cofounder.cookie, founder.id, { email: "pirate@cta.test" })).status).toBe(403);
    expect((await modifier(founder.cookie, founder.id, { actif: false })).status).toBe(403);
    const [p] = await sql`SELECT role, actif, email, onglets FROM profils WHERE id = ${founder.id}`;
    expect(p).toMatchObject({ role: "founder", actif: true, email: EMAIL_FOUNDER, onglets: null });
  });

  it("la base refuse aussi de l'archiver", async () => {
    await expect(sql`UPDATE profils SET actif = false WHERE id = ${founder.id}`).rejects.toThrow();
  });

  it("le type Founder ne s'attribue pas, et il n'y en a qu'un", async () => {
    expect((await modifier(cofounder.cookie, qa.id, { role: "founder" })).status).toBe(400);
    expect((await appeler("POST", "collaborateurs", { cookie: founder.cookie, corps: { nom: "X", email: "x@cta.test", role: "founder" } })).status).toBe(400);
    await expect(sql`UPDATE profils SET role = 'founder' WHERE id = ${qa.id}`).rejects.toThrow();
  });

  it("un Co-Founder peut quand même lui assigner des clients (le formulaire renvoie le même nom)", async () => {
    expect((await modifier(cofounder.cookie, founder.id, { nom: "Central Test Agency", clientIds: [] })).status).toBe(200);
  });
});

describe("gestion des accès", () => {
  it("un Assistant ne change ni le type, ni les onglets, ni l'archivage, ni l'e-mail d'un autre", async () => {
    const c = await creerProfil(sql, "collaborateur");
    expect((await modifier(assistant.cookie, c.id, { role: "assistant" })).status).toBe(403);
    expect((await modifier(assistant.cookie, c.id, { onglets: ["saisie", "cabinets"] })).status).toBe(403);
    expect((await modifier(assistant.cookie, c.id, { actif: false })).status).toBe(403);
    expect((await modifier(assistant.cookie, c.id, { email: "autre@cta.test" })).status).toBe(403);
    // Mais peut renommer et inviter des Collaborateurs
    expect((await modifier(assistant.cookie, c.id, { nom: "Nouveau nom" })).status).toBe(200);
    expect((await appeler("POST", "collaborateurs", { cookie: assistant.cookie, corps: { nom: "Invité", email: "invite@cta.test", role: "collaborateur" } })).status).toBe(201);
    expect((await appeler("POST", "collaborateurs", { cookie: assistant.cookie, corps: { nom: "Chef", email: "chef@cta.test", role: "cofounder" } })).status).toBe(403);
  });

  it("un QA Manager active des onglets : l'API suit immédiatement", async () => {
    const c = await creerProfil(sql, "collaborateur");
    expect((await appeler("GET", "cabinets", { cookie: c.cookie })).status).toBe(403);

    expect((await modifier(qa.cookie, c.id, { onglets: ["saisie", "cabinets"] })).status).toBe(200);
    expect((await appeler("GET", "auth/moi", { cookie: c.cookie })).data.moi.onglets).toEqual(["cabinets", "saisie"]);
    expect((await appeler("GET", "cabinets", { cookie: c.cookie })).status).toBe(200);
    expect((await appeler("GET", "recap", { cookie: c.cookie })).status).toBe(403);

    // Sans l'onglet Saisie, plus d'accès à sa saisie
    expect((await modifier(qa.cookie, c.id, { onglets: ["cabinets"] })).status).toBe(200);
    expect((await appeler("GET", `semaines?profil=${c.id}&lundi=2026-11-23`, { cookie: c.cookie })).status).toBe(403);
  });

  it("restreindre un Assistant lui retire l'accès côté API", async () => {
    const a = await creerProfil(sql, "assistant");
    expect((await modifier(cofounder.cookie, a.id, { onglets: ["aujourdhui", "saisie"] })).status).toBe(200);
    expect((await appeler("GET", "cabinets", { cookie: a.cookie })).status).toBe(403);
    expect((await appeler("GET", "portail", { cookie: a.cookie })).status).toBe(403);
    const accueil = await appeler("GET", "accueil", { cookie: a.cookie });
    expect(accueil.status).toBe(200);
    expect(accueil.data).toMatchObject({ relances: null, prospection: null, semainesAValider: null, temps: null });
  });

  it("changer de type sans préciser d'onglets revient aux onglets du nouveau type", async () => {
    const c = await creerProfil(sql, "collaborateur");
    await modifier(qa.cookie, c.id, { onglets: ["saisie", "cabinets"] });
    expect((await modifier(qa.cookie, c.id, { role: "assistant" })).status).toBe(200);
    const [p] = await sql`SELECT role, onglets FROM profils WHERE id = ${c.id}`;
    expect(p).toMatchObject({ role: "assistant", onglets: null });
    expect(ongletsDe({ role: "assistant", onglets: null })).toEqual(ONGLETS.filter((o) => o !== "paie" && o !== "documents"));
  });

  it("on ne peut pas se retirer soi-même la gestion des accès", async () => {
    expect((await modifier(qa.cookie, qa.id, { onglets: ["aujourdhui"] })).status).toBe(400);
    expect((await modifier(qa.cookie, qa.id, { role: "assistant" })).status).toBe(400);
  });

  it("la liste des collaborateurs indique les onglets choisis", async () => {
    const r = await appeler("GET", "collaborateurs", { cookie: qa.cookie });
    const f = r.data.collaborateurs.find((c: { id: string }) => c.id === founder.id);
    expect(f).toMatchObject({ role: "founder", onglets_personnalises: false });
  });
});

describe("type Comptable", () => {
  it("a le récap, les factures et la paie par défaut, sans gérer les accès ni valider les temps", async () => {
    const collab = await creerProfil(sql, "collaborateur");
    expect((await modifier(qa.cookie, collab.id, { role: "comptable" })).status).toBe(200);
    const comptable = await appeler("GET", "auth/moi", { cookie: collab.cookie });
    expect(comptable.data.moi).toMatchObject({ role: "comptable", admin: false, gereAcces: false, onglets: ["aujourdhui", "recap", "factures", "paie", "documents"] });
    expect((await appeler("GET", "factures", { cookie: collab.cookie })).status).toBe(200);
    expect((await appeler("GET", "paie", { cookie: collab.cookie })).status).not.toBe(403);
    expect((await appeler("GET", "collaborateurs", { cookie: collab.cookie })).status).toBe(403);
    expect(ongletsDe({ role: "comptable", onglets: null })).not.toContain("validation");
  });
});

describe("suppression d'un collaborateur", () => {
  it("réservée à la gestion des accès ; efface le compte et ses temps ; jamais le Founder, soi-même ni un salarié avec bulletins", async () => {
    const cible = await creerProfil(sql, "collaborateur");
    const [{ id: clientId }] = (await sql`INSERT INTO clients (nom, tjm_dzd) VALUES ('Client suppression', 100) RETURNING id`) as [{ id: string }];
    const [s] = await sql`INSERT INTO semaines (profil_id, lundi, statut, validee_par) VALUES (${cible.id}, '2026-03-02', 'validee', ${qa.id}) RETURNING id`;
    await sql`INSERT INTO temps (semaine_id, client_id, jour, valeur) VALUES (${s!.id}, ${clientId}, '2026-03-02', 1)`;
    // Une semaine d'un autre validée par la personne supprimée reste, sans valideur
    const valideur = await creerProfil(sql, "assistant");
    const autre = await creerProfil(sql, "collaborateur");
    await sql`INSERT INTO semaines (profil_id, lundi, statut, validee_par) VALUES (${autre.id}, '2026-03-02', 'validee', ${valideur.id})`;

    expect((await appeler("DELETE", `collaborateurs/${cible.id}`, { cookie: assistant.cookie })).status).toBe(403);
    expect((await appeler("DELETE", `collaborateurs/${founder.id}`, { cookie: cofounder.cookie })).status).toBe(403);
    expect((await appeler("DELETE", `collaborateurs/${qa.id}`, { cookie: qa.cookie })).status).toBe(400);

    expect((await appeler("DELETE", `collaborateurs/${cible.id}`, { cookie: qa.cookie })).status).toBe(200);
    expect(await sql`SELECT 1 FROM profils WHERE id = ${cible.id}`).toHaveLength(0);
    expect(await sql`SELECT 1 FROM semaines WHERE profil_id = ${cible.id}`).toHaveLength(0);
    expect((await appeler("GET", "auth/moi", { cookie: cible.cookie })).data.moi).toBeNull();

    expect((await appeler("DELETE", `collaborateurs/${valideur.id}`, { cookie: qa.cookie })).status).toBe(200);
    expect((await sql`SELECT validee_par FROM semaines WHERE profil_id = ${autre.id}`)[0]).toMatchObject({ validee_par: null });

    const salarie = await creerProfil(sql, "collaborateur");
    await sql`INSERT INTO bulletins (profil_id, mois, brut, retenue_ss, irg, net, donnees) VALUES (${salarie.id}, '2026-03', 100, 9, 0, 91, '{}'::jsonb)`;
    expect((await appeler("DELETE", `collaborateurs/${salarie.id}`, { cookie: qa.cookie })).status).toBe(409);
  });
});
