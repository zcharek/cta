// Durcissement : hiérarchie de la gestion des accès, limitation des tentatives, liens jamais exposés en ligne, journal des accès.
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import type { Sql } from "../../api/_lib/cockpit/db";
import { lienVisibleEnReponse } from "../../api/_lib/cockpit/emails";
import { peutGererRole } from "../../shared/cockpit";
import { appeler, creerProfil, preparerBase } from "./outils";

let sql: Sql;
let boite: { a: string }[];
let cofounder: Awaited<ReturnType<typeof creerProfil>>;
let qa: Awaited<ReturnType<typeof creerProfil>>;

beforeAll(async () => {
  ({ sql, boite } = await preparerBase());
  cofounder = await creerProfil(sql, "cofounder");
  qa = await creerProfil(sql, "qa_manager");
});

const modifier = (cookie: string, id: string, corps: Record<string, unknown>) => appeler("PATCH", `collaborateurs/${id}`, { cookie, corps });

describe("hiérarchie de la gestion des accès", () => {
  it("règle : Founder gère tout, Co-Founder tout sauf Founder, QA Manager seulement les types sans gestion des accès", () => {
    const de = (role: "founder" | "cofounder" | "qa_manager" | "assistant") => ({ role, actif: true });
    expect(peutGererRole(de("founder"), "cofounder")).toBe(true);
    expect(peutGererRole(de("cofounder"), "cofounder")).toBe(true);
    expect(peutGererRole(de("cofounder"), "founder")).toBe(false);
    expect(peutGererRole(de("qa_manager"), "assistant")).toBe(true);
    expect(peutGererRole(de("qa_manager"), "qa_manager")).toBe(false);
    expect(peutGererRole(de("qa_manager"), "cofounder")).toBe(false);
    expect(peutGererRole(de("assistant"), "collaborateur")).toBe(false);
  });

  it("un QA Manager ne peut pas se promouvoir Co-Founder ni s'ajouter des onglets", async () => {
    expect((await modifier(qa.cookie, qa.id, { role: "cofounder" })).status).toBe(403);
    expect((await modifier(qa.cookie, qa.id, { onglets: ["collaborateurs", "paie", "factures", "documents"] })).status).toBe(403);
    const [p] = await sql`SELECT role, onglets FROM profils WHERE id = ${qa.id}`;
    expect(p).toMatchObject({ role: "qa_manager", onglets: null });
  });

  it("un QA Manager ne touche pas à un Co-Founder : ni e-mail, ni archivage, ni type, ni suppression", async () => {
    expect((await modifier(qa.cookie, cofounder.id, { email: "pirate@exemple.com" })).status).toBe(403);
    expect((await modifier(qa.cookie, cofounder.id, { actif: false })).status).toBe(403);
    expect((await modifier(qa.cookie, cofounder.id, { role: "collaborateur" })).status).toBe(403);
    expect((await appeler("DELETE", `collaborateurs/${cofounder.id}`, { cookie: qa.cookie })).status).toBe(403);
    const [p] = await sql`SELECT email, actif, role FROM profils WHERE id = ${cofounder.id}`;
    expect(p).toMatchObject({ email: cofounder.email, actif: true, role: "cofounder" });
  });

  it("un QA Manager ne crée ni Co-Founder ni QA Manager, mais crée et gère un Assistant", async () => {
    for (const role of ["cofounder", "qa_manager"]) {
      expect((await appeler("POST", "collaborateurs", { cookie: qa.cookie, corps: { nom: "X Y", email: `${role}-nouveau@cta.test`, role } })).status).toBe(403);
    }
    const cree = await appeler("POST", "collaborateurs", { cookie: qa.cookie, corps: { nom: "Assistant Neuf", email: "assistant-neuf@cta.test", role: "assistant" } });
    expect(cree.status).toBe(201);
    expect((await modifier(qa.cookie, cree.data.id, { role: "comptable" })).status).toBe(200);
    expect((await modifier(qa.cookie, cree.data.id, { role: "qa_manager" })).status).toBe(403);
  });

  it("un Co-Founder gère un QA Manager", async () => {
    const autre = await creerProfil(sql, "qa_manager");
    expect((await modifier(cofounder.cookie, autre.id, { role: "cofounder" })).status).toBe(200);
  });
});

describe("limitation des tentatives", () => {
  afterEach(async () => {
    await sql`DELETE FROM tentatives`;
  });

  it("connexion : après 5 échecs, le compte est bloqué 15 minutes, même avec le bon mot de passe", async () => {
    const p = await creerProfil(sql, "collaborateur");
    await sql`DELETE FROM tentatives`;
    for (let i = 0; i < 5; i++) expect((await appeler("POST", "auth/connexion", { corps: { email: p.email, motDePasse: "mauvais" } })).status).toBe(401);
    expect((await appeler("POST", "auth/connexion", { corps: { email: p.email, motDePasse: p.motDePasse } })).status).toBe(429);
    // Les échecs de plus de 15 minutes ne comptent plus.
    await sql`UPDATE tentatives SET le = now() - interval '16 minutes'`;
    expect((await appeler("POST", "auth/connexion", { corps: { email: p.email, motDePasse: p.motDePasse } })).status).toBe(200);
  });

  it("connexion réussie : les échecs précédents sont oubliés", async () => {
    const p = await creerProfil(sql, "collaborateur");
    for (let i = 0; i < 4; i++) await appeler("POST", "auth/connexion", { corps: { email: p.email, motDePasse: "mauvais" } });
    expect((await appeler("POST", "auth/connexion", { corps: { email: p.email, motDePasse: p.motDePasse } })).status).toBe(200);
    const [r] = await sql`SELECT count(*)::int AS n FROM tentatives WHERE cle = ${`connexion:email:${p.email}`}`;
    expect(r!.n).toBe(0);
  });

  it("mot de passe oublié : 3 demandes par heure et par compte", async () => {
    const p = await creerProfil(sql, "collaborateur");
    const avant = boite.length;
    for (let i = 0; i < 3; i++) expect((await appeler("POST", "auth/mot-de-passe-oublie", { corps: { email: p.email } })).status).toBe(200);
    expect((await appeler("POST", "auth/mot-de-passe-oublie", { corps: { email: p.email } })).status).toBe(429);
    expect(boite.length - avant).toBe(3);
  });
});

describe("liens d'invitation", () => {
  const env = { ...process.env };
  afterEach(() => {
    process.env = { ...env };
  });

  it("jamais renvoyés par l'API sur un déploiement en ligne, preview comprise", () => {
    delete process.env.RESEND_API_KEY;
    delete process.env.VERCEL_ENV;
    expect(lienVisibleEnReponse()).toBe(true);
    process.env.VERCEL_ENV = "preview";
    expect(lienVisibleEnReponse()).toBe(false);
    process.env.VERCEL_ENV = "production";
    expect(lienVisibleEnReponse()).toBe(false);
  });
});

describe("journal des accès", () => {
  it("enregistre les changements de droits, lisible par la gestion des accès seulement", async () => {
    const cofounder = await creerProfil(sql, "cofounder", { nom: "Chef Journal" });
    const assistant = await creerProfil(sql, "assistant");
    const cree = await appeler("POST", "collaborateurs", { cookie: cofounder.cookie, corps: { nom: "Nouvel Arrivant", email: "nouvel-arrivant@cta.test", role: "collaborateur" } });
    const id = cree.data.id as string;
    await appeler("PATCH", `collaborateurs/${id}`, { cookie: cofounder.cookie, corps: { role: "comptable" } });
    await appeler("PATCH", `collaborateurs/${id}`, { cookie: cofounder.cookie, corps: { actif: false } });
    await appeler("DELETE", `collaborateurs/${id}`, { cookie: cofounder.cookie });

    expect((await appeler("GET", "journal-acces", { cookie: assistant.cookie })).status).toBe(403);
    const r = await appeler("GET", "journal-acces", { cookie: cofounder.cookie });
    expect(r.status).toBe(200);
    const pourLui = r.data.evenements.filter((e: { cible_nom: string }) => e.cible_nom === "Nouvel Arrivant");
    expect(pourLui.map((e: { action: string }) => e.action)).toEqual(["suppression", "archivage", "modification", "creation"]);
    expect(pourLui.every((e: { auteur_nom: string }) => e.auteur_nom === "Chef Journal")).toBe(true);
    expect(pourLui[2].details).toMatchObject({ role: { avant: "collaborateur", apres: "comptable" } });
  });
});
