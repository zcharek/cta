import { describe, expect, it } from "vitest";
import {
  ajouterJours,
  aujourdhui,
  bornesMois,
  decalerMois,
  estAdmin,
  estLundi,
  formatDzd,
  formatJours,
  grouperParClient,
  joursOuvres,
  libelleMois,
  lundiDe,
  prenom,
  valeurSuivante,
} from "../../shared/cockpit";
import { transitionsDepuis } from "../../api/_lib/cockpit/routes-temps";
import { decouperSql } from "../../scripts/sql-split.mjs";

describe("types d'utilisateur", () => {
  it("seuls les profils actifs Assistant, QA Manager et Co-Founder ont l'accès complet", () => {
    expect(estAdmin({ role: "assistant", actif: true })).toBe(true);
    expect(estAdmin({ role: "qa_manager", actif: true })).toBe(true);
    expect(estAdmin({ role: "cofounder", actif: true })).toBe(true);
    expect(estAdmin({ role: "collaborateur", actif: true })).toBe(false);
    expect(estAdmin({ role: "cofounder", actif: false })).toBe(false);
    expect(estAdmin(null)).toBe(false);
  });
});

describe("transitions de semaine", () => {
  it("un collaborateur ne fait qu'aller-retour entre brouillon et soumise", () => {
    expect(transitionsDepuis(false, "soumise")).toEqual(["brouillon"]);
    expect(transitionsDepuis(false, "brouillon")).toEqual(["soumise"]);
    expect(transitionsDepuis(false, "validee")).toEqual([]);
  });
  it("un admin peut valider, renvoyer et rouvrir", () => {
    expect(transitionsDepuis(true, "validee")).toEqual(["brouillon", "soumise"]);
    expect(transitionsDepuis(true, "brouillon")).toEqual(["soumise", "validee"]);
  });
});

describe("dates", () => {
  it("reconnaît un lundi", () => {
    expect(estLundi("2026-11-23")).toBe(true);
    expect(estLundi("2026-11-24")).toBe(false);
    expect(estLundi("2026-02-30")).toBe(false);
    expect(estLundi("23/11/2026")).toBe(false);
  });
  it("calcule le lundi d'une semaine et les bornes du mois", () => {
    expect(lundiDe("2026-11-25")).toBe("2026-11-23");
    expect(lundiDe("2026-11-29")).toBe("2026-11-23");
    expect(lundiDe("2026-11-23")).toBe("2026-11-23");
    expect(ajouterJours("2026-11-28", 4)).toBe("2026-12-02");
    expect(bornesMois("2026-02-14")).toEqual({ debut: "2026-02-01", fin: "2026-02-28" });
    expect(bornesMois("2026-12-31")).toEqual({ debut: "2026-12-01", fin: "2026-12-31" });
  });
  it("donne la date du jour à Alger (UTC+1)", () => {
    expect(aujourdhui(new Date("2026-11-25T23:30:00Z"))).toBe("2026-11-26");
  });
});

describe("grille de saisie", () => {
  it("une case passe de vide à 1 jour, puis ½ jour, puis vide", () => {
    expect(valeurSuivante(0)).toBe(1);
    expect(valeurSuivante(1)).toBe(0.5);
    expect(valeurSuivante(0.5)).toBe(0);
  });
  it("regroupe les temps par client", () => {
    const g = grouperParClient([
      { client_id: "b", nom: "Banque", jour: "2026-11-23", valeur: 1 },
      { client_id: "a", nom: "Atlas", jour: "2026-11-23", valeur: 0.5 },
      { client_id: "a", nom: "Atlas", jour: "2026-11-24", valeur: 1 },
    ]);
    expect(g.total).toBe(2.5);
    expect(g.lignes.map((l) => [l.nom, l.total])).toEqual([
      ["Atlas", 1.5],
      ["Banque", 1],
    ]);
  });
  it("donne les jours ouvrés et les libellés", () => {
    expect(joursOuvres("2026-11-30")).toEqual(["2026-11-30", "2026-12-01", "2026-12-02", "2026-12-03", "2026-12-04"]);
    expect(formatJours(2.5)).toBe("2,5 j");
    expect(decalerMois("2026-12", 1)).toBe("2027-01");
    expect(decalerMois("2026-01", -1)).toBe("2025-12");
    expect(libelleMois("2026-11")).toBe("novembre 2026");
  });
});

describe("affichage", () => {
  it("formate les montants en dinars", () => {
    expect(formatDzd(12000)).toBe("12 000 DZD");
    expect(formatDzd(1250000)).toBe("1 250 000 DZD");
  });
  it("extrait le prénom", () => {
    expect(prenom("  Amina Benali ")).toBe("Amina");
  });
});

describe("découpage des migrations", () => {
  it("ignore les ; des commentaires, chaînes et blocs dollar", () => {
    const d = "$" + "$";
    const sql = `-- un commentaire ; ici\nCREATE TABLE a (x text DEFAULT 'a;b');\nINSERT INTO a VALUES ('l''été;');\nCREATE FUNCTION f() RETURNS int AS ${d} SELECT 1; ${d} LANGUAGE sql;`;
    expect(decouperSql(sql)).toEqual([
      "CREATE TABLE a (x text DEFAULT 'a;b')",
      "INSERT INTO a VALUES ('l''été;')",
      `CREATE FUNCTION f() RETURNS int AS ${d} SELECT 1; ${d} LANGUAGE sql`,
    ]);
  });
});
