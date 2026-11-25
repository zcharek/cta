// Règles d'accès de la section 2 du prompt Cockpit, vérifiées par appel direct à l'API
// (le navigateur n'a aucun accès direct à la base : l'API est la seule porte d'entrée).
import { beforeAll, describe, expect, it } from "vitest";
import type { Sql } from "../../api/_lib/cockpit/db";
import { appeler, creerProfil, preparerBase } from "./outils";

const LUNDI = "2026-11-23";
const MARDI = "2026-11-24";

let sql: Sql;
let cofounder: Awaited<ReturnType<typeof creerProfil>>;
let alice: Awaited<ReturnType<typeof creerProfil>>;
let bruno: Awaited<ReturnType<typeof creerProfil>>;
let clientA: string;
let clientB: string;

beforeAll(async () => {
  ({ sql } = await preparerBase());
  cofounder = await creerProfil(sql, "cofounder", { nom: "Charek Z" });
  alice = await creerProfil(sql, "collaborateur", { nom: "Alice Martin" });
  bruno = await creerProfil(sql, "collaborateur", { nom: "Bruno Haddad" });
  [{ id: clientA }] = (await sql`INSERT INTO clients (nom, tjm_dzd) VALUES ('Client A', 45000) RETURNING id`) as [{ id: string }];
  [{ id: clientB }] = (await sql`INSERT INTO clients (nom, tjm_dzd) VALUES ('Client B', 60000) RETURNING id`) as [{ id: string }];
  await sql`INSERT INTO affectations (profil_id, client_id) VALUES (${alice.id}, ${clientA}), (${bruno.id}, ${clientA}), (${bruno.id}, ${clientB})`;
  await sql`INSERT INTO cabinets (cle, nom, commune) VALUES ('cabinet-test-alger', 'Cabinet Test', 'Alger')`;
});

const saisir = (cookie: string, profilId: string, clientId: string, jour: string, valeur: number) =>
  appeler("PUT", "temps", { cookie, corps: { profilId, lundi: LUNDI, clientId, jour, valeur } });

describe("sans connexion", () => {
  it.each([
    ["GET", "clients"],
    ["GET", "collaborateurs"],
    ["GET", "cabinets"],
    ["GET", `semaines?lundi=${LUNDI}`],
  ])("%s %s → 401", async (m, chemin) => {
    expect((await appeler(m, chemin)).status).toBe(401);
  });

  it("un cookie falsifié est refusé", async () => {
    const r = await appeler("GET", "clients", { cookie: "cockpit_session=eyJhbGciOiJIUzI1NiJ9.e30.faux" });
    expect(r.status).toBe(401);
  });
});

describe("un Collaborateur", () => {
  it("ne peut pas lire un cabinet", async () => {
    const r = await appeler("GET", "cabinets", { cookie: alice.cookie });
    expect(r.status).toBe(403);
    expect(JSON.stringify(r.data)).not.toContain("Cabinet Test");
  });

  it("ne peut pas lire un TJM : il ne voit que ses clients, sans TJM", async () => {
    const r = await appeler("GET", "clients", { cookie: alice.cookie });
    expect(r.status).toBe(200);
    expect(r.data.clients).toEqual([{ id: clientA, nom: "Client A" }]);
    expect(JSON.stringify(r.data)).not.toMatch(/tjm|45000|60000/i);
  });

  it("ne voit aucun TJM dans sa semaine", async () => {
    const r = await appeler("GET", `semaines?lundi=${LUNDI}`, { cookie: alice.cookie });
    expect(r.status).toBe(200);
    expect(JSON.stringify(r.data)).not.toMatch(/tjm|45000/i);
  });

  it("ne peut ni lister ni modifier les collaborateurs et les clients", async () => {
    expect((await appeler("GET", "collaborateurs", { cookie: alice.cookie })).status).toBe(403);
    expect((await appeler("POST", "collaborateurs", { cookie: alice.cookie, corps: { nom: "X", email: "x@cta.test", role: "cofounder" } })).status).toBe(403);
    expect((await appeler("PATCH", `collaborateurs/${alice.id}`, { cookie: alice.cookie, corps: { role: "cofounder" } })).status).toBe(403);
    expect((await appeler("POST", "clients", { cookie: alice.cookie, corps: { nom: "X", tjmDzd: 1 } })).status).toBe(403);
    expect((await appeler("PATCH", `clients/${clientA}`, { cookie: alice.cookie, corps: { tjmDzd: 1 } })).status).toBe(403);
    const [p] = await sql`SELECT role FROM profils WHERE id = ${alice.id}`;
    expect(p!.role).toBe("collaborateur");
  });

  it("saisit sur ses clients assignés, et seulement sur eux", async () => {
    expect((await saisir(alice.cookie, alice.id, clientA, LUNDI, 1)).status).toBe(200);
    expect((await saisir(alice.cookie, alice.id, clientA, MARDI, 0.5)).status).toBe(200);
    expect((await saisir(alice.cookie, alice.id, clientB, LUNDI, 1)).status).toBe(403);
  });

  it("refuse un jour hors de la semaine ou une valeur invalide", async () => {
    expect((await saisir(alice.cookie, alice.id, clientA, "2026-11-28", 1)).status).toBe(400);
    expect((await saisir(alice.cookie, alice.id, clientA, LUNDI, 2)).status).toBe(400);
  });

  it("ne peut ni lire ni modifier la semaine d'un autre", async () => {
    await saisir(bruno.cookie, bruno.id, clientA, LUNDI, 1);
    expect((await appeler("GET", `semaines?profil=${bruno.id}&lundi=${LUNDI}`, { cookie: alice.cookie })).status).toBe(403);
    expect((await saisir(alice.cookie, bruno.id, clientA, MARDI, 1)).status).toBe(403);
    expect((await saisir(alice.cookie, bruno.id, clientA, LUNDI, 0)).status).toBe(403);
    expect((await appeler("POST", "semaines/statut", { cookie: alice.cookie, corps: { profilId: bruno.id, lundi: LUNDI, statut: "soumise" } })).status).toBe(403);
    const temps = await sql`SELECT valeur::float8 AS v FROM temps t JOIN semaines s ON s.id = t.semaine_id WHERE s.profil_id = ${bruno.id}`;
    expect(temps).toEqual([{ v: 1 }]);
  });

  it("ne peut pas valider sa propre semaine", async () => {
    const r = await appeler("POST", "semaines/statut", { cookie: alice.cookie, corps: { profilId: alice.id, lundi: LUNDI, statut: "validee" } });
    expect(r.status).toBe(403);
    const [s] = await sql`SELECT statut FROM semaines WHERE profil_id = ${alice.id} AND lundi = ${LUNDI}::date`;
    expect(s!.statut).toBe("brouillon");
  });

  it("soumet sa semaine, ne peut plus la modifier, puis la repasse en brouillon", async () => {
    const soumise = await appeler("POST", "semaines/statut", { cookie: alice.cookie, corps: { profilId: alice.id, lundi: LUNDI, statut: "soumise" } });
    expect(soumise.status).toBe(200);
    expect(soumise.data.semaine.statut).toBe("soumise");
    expect((await saisir(alice.cookie, alice.id, clientA, LUNDI, 0.5)).status).toBe(409);
    expect((await appeler("POST", "semaines/statut", { cookie: alice.cookie, corps: { profilId: alice.id, lundi: LUNDI, statut: "validee" } })).status).toBe(403);

    const brouillon = await appeler("POST", "semaines/statut", { cookie: alice.cookie, corps: { profilId: alice.id, lundi: LUNDI, statut: "brouillon" } });
    expect(brouillon.data.semaine.statut).toBe("brouillon");
    expect((await saisir(alice.cookie, alice.id, clientA, LUNDI, 0.5)).status).toBe(200);
  });

  it("ne peut plus repasser en brouillon une semaine validée", async () => {
    await appeler("POST", "semaines/statut", { cookie: alice.cookie, corps: { profilId: alice.id, lundi: LUNDI, statut: "soumise" } });
    const v = await appeler("POST", "semaines/statut", { cookie: cofounder.cookie, corps: { profilId: alice.id, lundi: LUNDI, statut: "validee" } });
    expect(v.status).toBe(200);
    expect((await appeler("POST", "semaines/statut", { cookie: alice.cookie, corps: { profilId: alice.id, lundi: LUNDI, statut: "brouillon" } })).status).toBe(409);
    expect((await saisir(alice.cookie, alice.id, clientA, LUNDI, 1)).status).toBe(409);
  });
});

describe("Assistant, QA Manager et Co-Founder", () => {
  it.each(["assistant", "qa_manager", "cofounder"] as const)("%s accède à tout", async (role) => {
    const p = await creerProfil(sql, role);
    const cabinets = await appeler("GET", "cabinets", { cookie: p.cookie });
    expect(cabinets.status).toBe(200);
    expect(cabinets.data.cabinets[0].nom).toBe("Cabinet Test");
    const clients = await appeler("GET", "clients", { cookie: p.cookie });
    expect(clients.data.clients.map((c: { tjm_dzd: number }) => c.tjm_dzd)).toEqual([45000, 60000]);
    expect((await appeler("GET", "collaborateurs", { cookie: p.cookie })).status).toBe(200);
    expect((await appeler("GET", `semaines?profil=${bruno.id}&lundi=${LUNDI}`, { cookie: p.cookie })).status).toBe(200);
  });

  it("un admin rouvre une semaine validée puis la modifie", async () => {
    expect((await saisir(cofounder.cookie, alice.id, clientA, LUNDI, 1)).status).toBe(409);
    const r = await appeler("POST", "semaines/statut", { cookie: cofounder.cookie, corps: { profilId: alice.id, lundi: LUNDI, statut: "brouillon" } });
    expect(r.data.semaine.statut).toBe("brouillon");
    expect((await saisir(cofounder.cookie, alice.id, clientB, MARDI, 1)).status).toBe(200);
  });
});

describe("type vérifié en base à chaque requête", () => {
  it("un Co-Founder rétrogradé perd l'accès immédiatement, avec le même cookie", async () => {
    const p = await creerProfil(sql, "cofounder");
    expect((await appeler("GET", "cabinets", { cookie: p.cookie })).status).toBe(200);
    await sql`UPDATE profils SET role = 'collaborateur' WHERE id = ${p.id}`;
    expect((await appeler("GET", "cabinets", { cookie: p.cookie })).status).toBe(403);
  });

  it("un compte archivé n'a plus de session", async () => {
    const p = await creerProfil(sql, "assistant");
    await sql`UPDATE profils SET actif = false WHERE id = ${p.id}`;
    expect((await appeler("GET", "clients", { cookie: p.cookie })).status).toBe(401);
    expect((await appeler("GET", "auth/moi", { cookie: p.cookie })).data.moi).toBeNull();
  });
});
