// Saisie, validation, récap mensuel et export CSV.
import { beforeAll, describe, expect, it } from "vitest";
import { construireRecap, recapEnCsv } from "../../shared/cockpit";
import type { Sql } from "../../api/_lib/cockpit/db";
import { appeler, creerProfil, preparerBase } from "./outils";

let sql: Sql;
let cofounder: Awaited<ReturnType<typeof creerProfil>>;
let alice: Awaited<ReturnType<typeof creerProfil>>;
let bruno: Awaited<ReturnType<typeof creerProfil>>;
let clientA: string;
let clientB: string;

const saisir = (qui: { cookie: string }, profilId: string, lundi: string, clientId: string, jour: string, valeur: number) =>
  appeler("PUT", "temps", { cookie: qui.cookie, corps: { profilId, lundi, clientId, jour, valeur } });
const statut = (qui: { cookie: string }, profilId: string, lundi: string, s: string) =>
  appeler("POST", "semaines/statut", { cookie: qui.cookie, corps: { profilId, lundi, statut: s } });

beforeAll(async () => {
  ({ sql } = await preparerBase());
  cofounder = await creerProfil(sql, "cofounder", { nom: "Charek Z" });
  alice = await creerProfil(sql, "collaborateur", { nom: "Alice Martin" });
  bruno = await creerProfil(sql, "collaborateur", { nom: "Bruno Haddad" });
  [{ id: clientA }] = (await sql`INSERT INTO clients (nom, tjm_dzd) VALUES ('Atlas; Banque', 45000) RETURNING id`) as [{ id: string }];
  [{ id: clientB }] = (await sql`INSERT INTO clients (nom, tjm_dzd) VALUES ('VetCare', 60000) RETURNING id`) as [{ id: string }];
  await sql`INSERT INTO affectations VALUES (${alice.id}, ${clientA}), (${bruno.id}, ${clientA}), (${bruno.id}, ${clientB})`;

  // Alice, semaine du 23 nov. : soumise
  await saisir(alice, alice.id, "2026-11-23", clientA, "2026-11-23", 1);
  await saisir(alice, alice.id, "2026-11-23", clientA, "2026-11-24", 0.5);
  await statut(alice, alice.id, "2026-11-23", "soumise");
  // Alice, semaine du 30 nov. (à cheval sur décembre) : brouillon
  await saisir(alice, alice.id, "2026-11-30", clientA, "2026-11-30", 1);
  await saisir(alice, alice.id, "2026-11-30", clientA, "2026-12-01", 1);
  // Bruno, semaine du 16 nov. : soumise puis validée
  await saisir(bruno, bruno.id, "2026-11-16", clientB, "2026-11-16", 1);
  await saisir(bruno, bruno.id, "2026-11-16", clientB, "2026-11-18", 1);
  await saisir(bruno, bruno.id, "2026-11-16", clientA, "2026-11-19", 0.5);
  await statut(bruno, bruno.id, "2026-11-16", "soumise");
  await statut(cofounder, bruno.id, "2026-11-16", "validee");
});

describe("saisie", () => {
  it("une case remise à vide supprime le temps", async () => {
    await saisir(alice, alice.id, "2026-11-30", clientA, "2026-12-02", 1);
    await saisir(alice, alice.id, "2026-11-30", clientA, "2026-12-02", 0);
    const r = await appeler("GET", "semaines?lundi=2026-11-30", { cookie: alice.cookie });
    expect(r.data.temps).toHaveLength(2);
    expect(r.data.semaine.statut).toBe("brouillon");
  });

  it("un admin ajoute un client ponctuel, qui apparaît ensuite dans la grille du collaborateur", async () => {
    expect((await saisir(cofounder, alice.id, "2026-11-30", clientB, "2026-12-03", 0.5)).status).toBe(200);
    const r = await appeler("GET", `semaines?profil=${alice.id}&lundi=2026-11-30`, { cookie: alice.cookie });
    expect(r.data.lignes.map((l: { nom: string }) => l.nom)).toEqual(["Atlas; Banque", "VetCare"]);
    // mais le collaborateur ne peut pas y saisir lui-même
    expect((await saisir(alice, alice.id, "2026-11-30", clientB, "2026-12-04", 1)).status).toBe(403);
    await saisir(cofounder, alice.id, "2026-11-30", clientB, "2026-12-03", 0);
  });
});

describe("validation", () => {
  it("liste les semaines soumises avec le détail par client, puis les dernières validées", async () => {
    const r = await appeler("GET", "validation", { cookie: cofounder.cookie });
    expect(r.status).toBe(200);
    expect(r.data.soumises).toHaveLength(1);
    expect(r.data.soumises[0]).toMatchObject({
      nom: "Alice Martin",
      lundi: "2026-11-23",
      total: 1.5,
      lignes: [{ client_id: clientA, nom: "Atlas; Banque", jours: { "2026-11-23": 1, "2026-11-24": 0.5 }, total: 1.5 }],
    });
    expect(r.data.validees).toHaveLength(1);
    expect(r.data.validees[0]).toMatchObject({ nom: "Bruno Haddad", lundi: "2026-11-16", total: 2.5, validee_par_nom: "Charek Z" });
    expect(JSON.stringify(r.data)).not.toMatch(/tjm/i);
  });

  it("un collaborateur n'y a pas accès", async () => {
    expect((await appeler("GET", "validation", { cookie: alice.cookie })).status).toBe(403);
  });
});

describe("récap mensuel", () => {
  it("semaines validées : seuls les temps validés comptent", async () => {
    const r = await appeler("GET", "recap?mois=2026-11", { cookie: cofounder.cookie });
    expect(r.status).toBe(200);
    expect(r.data.portee).toBe("validees");
    expect(r.data.jours).toBe(2.5);
    expect(r.data.montant).toBe(2 * 60000 + 0.5 * 45000);
    expect(r.data.clients.map((c: { nom: string; jours: number; montant: number }) => [c.nom, c.jours, c.montant])).toEqual([
      ["Atlas; Banque", 0.5, 22500],
      ["VetCare", 2, 120000],
    ]);
    // Bandeau : les deux semaines d'Alice qui touchent novembre ne sont pas validées
    expect(r.data.nonValidees.map((s: { nom: string; lundi: string; statut: string }) => [s.nom, s.lundi, s.statut])).toEqual([
      ["Alice Martin", "2026-11-23", "soumise"],
      ["Alice Martin", "2026-11-30", "brouillon"],
    ]);
  });

  it("toutes les saisies : un jour compte dans son propre mois", async () => {
    const nov = await appeler("GET", "recap?mois=2026-11&portee=toutes", { cookie: cofounder.cookie });
    const atlas = nov.data.clients[0];
    expect(atlas).toMatchObject({ nom: "Atlas; Banque", tjm_dzd: 45000, jours: 3, montant: 135000 });
    expect(atlas.collaborateurs).toEqual([
      { profil_id: alice.id, nom: "Alice Martin", jours: 2.5, montant: 112500 },
      { profil_id: bruno.id, nom: "Bruno Haddad", jours: 0.5, montant: 22500 },
    ]);
    expect(nov.data.jours).toBe(5);
    expect(nov.data.montant).toBe(255000);

    const dec = await appeler("GET", "recap?mois=2026-12&portee=toutes", { cookie: cofounder.cookie });
    expect(dec.data).toMatchObject({ jours: 1, montant: 45000 });
  });

  it("export CSV : BOM, « ; », virgule décimale et champs protégés", async () => {
    const r = await appeler("GET", "recap?mois=2026-11&portee=toutes", { cookie: cofounder.cookie });
    const csv = recapEnCsv(r.data);
    expect(csv.startsWith("﻿")).toBe(true);
    expect(csv.slice(1).split("\r\n")).toEqual([
      "Client;Collaborateur;Jours;TJM (DZD);Montant HT (DZD)",
      '"Atlas; Banque";Alice Martin;2,5;45000;112500',
      '"Atlas; Banque";Bruno Haddad;0,5;45000;22500',
      "VetCare;Bruno Haddad;2;60000;120000",
      "Total;;5;;255000",
      "",
    ]);
  });

  it("refuse un mois mal formé, et un collaborateur", async () => {
    expect((await appeler("GET", "recap?mois=2026-13", { cookie: cofounder.cookie })).status).toBe(400);
    expect((await appeler("GET", "recap?mois=2026-11", { cookie: alice.cookie })).status).toBe(403);
  });
});

describe("calculs", () => {
  it("montant avec une demi-journée sur un TJM impair", () => {
    const r = construireRecap([{ client_id: "c", client: "C", tjm_dzd: 45001, profil_id: "p", collaborateur: "P", jours: 0.5 }]);
    expect(r.montant).toBe(22500.5);
    expect(recapEnCsv(r)).toContain("C;P;0,5;45001;22500,5");
  });
});
