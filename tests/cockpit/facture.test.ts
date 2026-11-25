// Factures : montants, montant en lettres, numérotation continue après 012-26, PDF.
import { readFileSync } from "node:fs";
import { PDFDocument } from "pdf-lib";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Sql } from "../../api/_lib/cockpit/db";
import { calculerFacture, enLettres, genererFacture, lireNumeroFacture, montantEnLettres, montantFacture, nomFichierFacture, numeroFacture } from "../../shared/facture";
import { appeler, creerProfil, preparerBase } from "./outils";

describe("règles de la facture", () => {
  it("forfait AEBS : 22 jours = 160 000,00 HT, PU 7 272,72, TTC 190 400,00", () => {
    const t = { tjm_dzd: 0, forfait_mensuel_dzd: 160000, jours_forfait: 22 };
    expect(calculerFacture(t, 22, 19)).toEqual({ pu: 7272.72, ht: 160000, tva: 30400, ttc: 190400 });
    expect(calculerFacture(t, 20, 19)).toEqual({ pu: 7272.72, ht: 145454.55, tva: 27636.36, ttc: 173090.91 });
    expect(calculerFacture({ tjm_dzd: 45000, forfait_mensuel_dzd: null, jours_forfait: 22 }, 1.5, 19)).toMatchObject({ pu: 45000, ht: 67500 });
  });

  it("formats du modèle", () => {
    expect(montantFacture(160000)).toBe("160,000.00");
    expect(montantFacture(7272.72)).toBe("7,272.72");
    expect(numeroFacture(13, 2026)).toBe("013-26");
    expect(lireNumeroFacture("012-26")).toEqual({ numero: 12, annee: 2026 });
    expect(lireNumeroFacture(" 7/2027 ")).toEqual({ numero: 7, annee: 2027 });
    expect(lireNumeroFacture("FACTURE")).toBeNull();
  });

  it("montant en lettres", () => {
    expect(montantEnLettres(190400)).toBe("cent quatre-vingt-dix mille quatre cents dinars");
    expect(enLettres(80)).toBe("quatre-vingts");
    expect(enLettres(81)).toBe("quatre-vingt-un");
    expect(enLettres(71)).toBe("soixante et onze");
    expect(enLettres(21)).toBe("vingt et un");
    expect(enLettres(200000)).toBe("deux cent mille");
    expect(enLettres(1000)).toBe("mille");
    expect(enLettres(1_280_000)).toBe("un million deux cent quatre-vingt mille");
    expect(montantEnLettres(173090.91)).toBe("cent soixante-treize mille quatre-vingt-dix dinars et quatre-vingt-onze centimes");
  });
});

describe("émission des factures", () => {
  afterAll(() => {
    delete process.env.ENTREPRISE_CTA;
  });
  let sql: Sql;
  let admin: string;
  let clientId: string;

  beforeAll(async () => {
    ({ sql } = await preparerBase());
    admin = (await creerProfil(sql, "cofounder")).cookie;
    const omar = await creerProfil(sql, "collaborateur", { nom: "Karim Benali" });
    [{ id: clientId }] = (await sql`INSERT INTO clients (nom, tjm_dzd) VALUES ('Beyn', 0) RETURNING id`) as [{ id: string }];
    await sql`UPDATE clients SET raison_sociale = 'Algeria e-Banking Services - AEBS', adresse = 'Zone industrielle, Cheraga, Alger – ALGERIE',
    numero_contrat = 'N°2025-01-TEST', forfait_mensuel_dzd = 160000, jours_forfait = 22,
    raison_sociale_facture = 'SARL Algeria E-Banking Services', rc = '16/00-0000000 B 00', nif = '000000000000001'
    WHERE id = ${clientId}`;
    // Identité de l'entreprise fictive : en production, elle vient de la variable ENTREPRISE_CTA (hors dépôt)
    process.env.ENTREPRISE_CTA = JSON.stringify({ raison_sociale: "SARL CENTRAL TEST APPLICATION", siege: "Draria, Alger", rc: "16/00-1111111 B 25", nif: "000000000000002", nis: "000000000000003", ai: "00000000000", rib: "000 00000 0000000000-00", banque: "Banque Test", email: "facturation@cta.test", ville: "Alger" });
    // Avril 2026 : 22 jours ouvrés validés
    const lundis = ["2026-03-30", "2026-04-06", "2026-04-13", "2026-04-20", "2026-04-27"];
    for (const l of lundis) {
      const [s] = await sql`INSERT INTO semaines (profil_id, lundi, statut) VALUES (${omar.id}, ${l}, 'validee') RETURNING id`;
      for (let i = 0; i < 5; i++) {
        const jour = new Date(Date.parse(`${l}T12:00:00Z`) + i * 86400000).toISOString().slice(0, 10);
        if (jour.startsWith("2026-04")) await sql`INSERT INTO temps (semaine_id, client_id, jour, valeur) VALUES (${s!.id}, ${clientId}, ${jour}, 1)`;
      }
    }
  });

  it("l'aperçu propose 013-26 (après la 012-26 envoyée avant Cockpit)", async () => {
    const r = await appeler("GET", `factures/apercu?client=${clientId}&mois=2026-04&date=2026-05-01`, { cookie: admin });
    expect(r.status).toBe(200);
    expect(r.data).toMatchObject({ numero: "013-26", jours: 22, pu: 7272.72, ht: 160000, tva: 30400, ttc: 190400, dejaFacture: [], entrepriseIncomplete: false });
    expect(r.data.client).toMatchObject({ raison_sociale: "SARL Algeria E-Banking Services", rc: "16/00-0000000 B 00", nif: "000000000000001" });
  });

  it("émet la 013-26, refuse un doublon sans confirmation, puis enchaîne 014-26", async () => {
    const r = await appeler("POST", "factures", { cookie: admin, corps: { clientId, mois: "2026-04", dateEmission: "2026-05-01" } });
    expect(r.status).toBe(201);
    expect(r.data.donnees).toMatchObject({ numero: "013-26", montant_ttc: 190400, entreprise: { raison_sociale: "SARL CENTRAL TEST APPLICATION", nif: "000000000000002", rib: "000 00000 0000000000-00" } });
    expect(r.data.donnees.ligne).toMatchObject({ debut: "2026-04-01", fin: "2026-04-30", quantite: 22, pu: 7272.72, montant: 160000 });

    expect((await appeler("POST", "factures", { cookie: admin, corps: { clientId, mois: "2026-04", dateEmission: "2026-05-01" } })).status).toBe(409);
    const bis = await appeler("POST", "factures", { cookie: admin, corps: { clientId, mois: "2026-04", dateEmission: "2026-05-02", confirmerDoublon: true } });
    expect(bis.data.donnees.numero).toBe("014-26");

    const liste = await appeler("GET", "factures", { cookie: admin });
    expect(liste.data.factures.map((f: { numero_affiche: string }) => f.numero_affiche)).toEqual(["014-26", "013-26"]);
    expect(liste.data.prochain).toBe("015-26");

    // Seule la dernière se supprime ; son numéro est ensuite réutilisé
    expect((await appeler("DELETE", `factures/${r.data.id}`, { cookie: admin })).status).toBe(409);
    expect((await appeler("DELETE", `factures/${bis.data.id}`, { cookie: admin })).status).toBe(200);
    expect((await appeler("GET", "factures", { cookie: admin })).data.prochain).toBe("014-26");

    // Retéléchargement à l'identique
    expect((await appeler("GET", `factures/${r.data.id}`, { cookie: admin })).data.donnees.numero).toBe("013-26");
  });

  it("refuse une facture sans jour validé", async () => {
    expect((await appeler("POST", "factures", { cookie: admin, corps: { clientId, mois: "2026-06", dateEmission: "2026-07-01" } })).status).toBe(409);
  });

  it("numérotation, TVA et identité de l'entreprise ne sont pas modifiables ; réservé à l'onglet Factures", async () => {
    // Aucune route d'écriture : 404 ou 405 (méthode non autorisée)
    expect([404, 405]).toContain((await appeler("PUT", "parametres/facturation", { cookie: admin, corps: { derniere: "040-26", tva: "10" } })).status);
    expect([404, 405]).toContain((await appeler("PUT", "parametres/entreprise", { cookie: admin, corps: { rib: "999" } })).status);
    const liste = await appeler("GET", "factures", { cookie: admin });
    expect(liste.data).toMatchObject({ prochain: "014-26", tva: 19, derniereHorsCockpit: "012-26" });
    expect((await appeler("GET", "parametres/entreprise", { cookie: admin })).data).toMatchObject({ verrouillee: true, entreprise: { rib: "000 00000 0000000000-00" } });
    const collab = await creerProfil(sql, "collaborateur");
    expect((await appeler("GET", "factures", { cookie: collab.cookie })).status).toBe(403);
  });

  it("produit un PDF d'une page avec le logo", async () => {
    const r = await appeler("POST", "factures", { cookie: admin, corps: { clientId, mois: "2026-04", dateEmission: "2026-05-01", confirmerDoublon: true } });
    const logo = new Uint8Array(readFileSync(new URL("../../client/public/images/logo-cta-facture.png", import.meta.url)));
    const octets = await genererFacture(r.data.donnees, logo);
    const pdf = await PDFDocument.load(octets);
    expect(pdf.getPageCount()).toBe(1);
    expect(nomFichierFacture(r.data.donnees)).toBe("Facture_014-26_Algeria-E-Banking-Services.pdf");
    if (process.env.FACTURE_SORTIE) (await import("node:fs")).writeFileSync(process.env.FACTURE_SORTIE, octets);
  });
});
