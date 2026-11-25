// Timesheet mensuel (modèle AEBS) : données, tarif au forfait et PDF.
import { PDFDocument } from "pdf-lib";
import { beforeAll, describe, expect, it } from "vitest";
import type { Sql } from "../../api/_lib/cockpit/db";
import { genererTimesheet, lignesRecapitulatif, montantFr, nomFichier, periodeFr, tauxJournalier, type DonneesTimesheet } from "../../shared/timesheet";
import { appeler, creerProfil, preparerBase } from "./outils";

let sql: Sql;
let admin: string;
let clientId: string;
let omar: Awaited<ReturnType<typeof creerProfil>>;

/** Crée une semaine pour un profil avec des jours sur un client, au statut donné. */
async function semaine(profilId: string, lundi: string, jours: string[], statut: "validee" | "soumise") {
  const [s] = await sql`INSERT INTO semaines (profil_id, lundi, statut) VALUES (${profilId}, ${lundi}, ${statut}) RETURNING id`;
  for (const j of jours) await sql`INSERT INTO temps (semaine_id, client_id, jour, valeur) VALUES (${s!.id}, ${clientId}, ${j}, 1)`;
}

beforeAll(async () => {
  ({ sql } = await preparerBase());
  admin = (await creerProfil(sql, "cofounder")).cookie;
  omar = await creerProfil(sql, "collaborateur", { nom: "Karim Benali" });
  // Client au forfait mensuel, comme dans le modèle AEBS
  [{ id: clientId }] = (await sql`INSERT INTO clients (nom, tjm_dzd) VALUES ('Beyn', 9000) RETURNING id`) as [{ id: string }];
  // Données de facturation fictives (les vraies se saisissent dans la fiche client)
  await sql`UPDATE clients SET raison_sociale = 'Algeria e-Banking Services - AEBS', adresse = 'Zone industrielle, Cheraga, Alger – ALGERIE',
    numero_contrat = 'N°2025-01-TEST', forfait_mensuel_dzd = 160000, jours_forfait = 22,
    raison_sociale_facture = 'SARL Algeria E-Banking Services', rc = '16/00-0000000 B 00', nif = '000000000000001'
    WHERE id = ${clientId}`;
  // Février 2026 : 2 semaines validées (10 jours) et 1 soumise (5 jours, non comptés)
  await semaine(omar.id, "2026-02-02", ["2026-02-02", "2026-02-03", "2026-02-04", "2026-02-05", "2026-02-06"], "validee");
  await semaine(omar.id, "2026-02-09", ["2026-02-09", "2026-02-10", "2026-02-11", "2026-02-12", "2026-02-13"], "validee");
  await semaine(omar.id, "2026-02-16", ["2026-02-16", "2026-02-17", "2026-02-18", "2026-02-19", "2026-02-20"], "soumise");
});

describe("données du timesheet", () => {
  it("reprend le client AEBS, le contrat, le prestataire et les seuls jours validés", async () => {
    const r = await appeler("GET", `timesheet?client=${clientId}&mois=2026-02`, { cookie: admin });
    expect(r.status).toBe(200);
    expect(r.data).toMatchObject({
      debut: "2026-02-01",
      fin: "2026-02-28",
      prestataire: { nom: "Central Test Application - CTA" },
      client: { nom: "Algeria e-Banking Services - AEBS", numero_contrat: "N°2025-01-TEST", forfait_mensuel_dzd: 160000, jours_forfait: 22 },
      consultants: [{ nom: "Karim Benali", jours: 10 }],
      joursNonValides: 5,
    });
    expect(r.data.client.adresse).toContain("Cheraga");
  });

  it("le récap utilise le tarif au forfait (160 000 / 22 par jour)", async () => {
    const r = await appeler("GET", "recap?mois=2026-02", { cookie: admin });
    const c = r.data.clients.find((x: { client_id: string }) => x.client_id === clientId);
    expect(c.tjm_dzd).toBeCloseTo(7272.727, 2);
    expect(c.montant).toBeCloseTo(72727.27, 1);
  });

  it("réservé à l'onglet Récap", async () => {
    expect((await appeler("GET", `timesheet?client=${clientId}&mois=2026-02`, { cookie: omar.cookie })).status).toBe(403);
  });

  it("le formulaire client enregistre contrat et forfait, et repasse au TJM", async () => {
    const [{ id }] = (await sql`INSERT INTO clients (nom, tjm_dzd) VALUES ('Autre', 10000) RETURNING id`) as [{ id: string }];
    expect((await appeler("PATCH", `clients/${id}`, { cookie: admin, corps: { numeroContrat: "N°2026-01-ABCD", forfaitMensuelDzd: "200 000", joursForfait: 20, raisonSociale: "Autre SPA" } })).status).toBe(200);
    expect((await sql`SELECT numero_contrat, forfait_mensuel_dzd, jours_forfait, raison_sociale FROM clients WHERE id = ${id}`)[0]).toMatchObject({
      numero_contrat: "N°2026-01-ABCD",
      forfait_mensuel_dzd: 200000,
      jours_forfait: 20,
      raison_sociale: "Autre SPA",
    });
    await appeler("PATCH", `clients/${id}`, { cookie: admin, corps: { forfaitMensuelDzd: null, tjmDzd: 12000 } });
    expect((await sql`SELECT tjm_dzd, forfait_mensuel_dzd FROM clients WHERE id = ${id}`)[0]).toMatchObject({ tjm_dzd: 12000, forfait_mensuel_dzd: null });
  });
});

describe("mise en forme du modèle", () => {
  const donnees: DonneesTimesheet = {
    mois: "2026-02",
    debut: "2026-02-01",
    fin: "2026-02-28",
    prestataire: { nom: "Central Test Application - CTA", adresse: "N°384 Lotissement Guessas, 1er étage N°2 BIS, Draria, Alger – ALGERIE" },
    client: {
      nom: "Algeria e-Banking Services - AEBS",
      adresse: "Route d’Ouled Fayet, zone industrielle Amara, n°04, 3ème étage, Cheraga, Alger – ALGERIE",
      numero_contrat: "N°2025-01-TEST",
      mission: null,
      tjm_dzd: 0,
      forfait_mensuel_dzd: 160000,
      jours_forfait: 22,
    },
    consultants: [{ nom: "Karim Benali", jours: 20 }],
  };

  it("montants et taux comme sur le modèle", () => {
    expect(montantFr(160000)).toBe("160.000,00");
    expect(tauxJournalier(donnees.client)).toBe(7272.72);
    expect(lignesRecapitulatif(donnees)).toEqual([
      "- Tarif journalier de référence : 160.000,00 DZD /22 jours, soit 7272,72 DZD/Jour",
      "- Total jours facturables : 20 Jours",
    ]);
    expect(periodeFr("2026-02")).toBe("Mois Février 2026");
    expect(nomFichier(donnees)).toBe("Timesheet_AEBS_2026-02.pdf");
  });

  it("produit un PDF A4 d'une page, même avec des caractères hors police", async () => {
    const octets = await genererTimesheet({ ...donnees, consultants: [...donnees.consultants, { nom: "Nour 🙂 Hamidi", jours: 19.5 }] });
    const pdf = await PDFDocument.load(octets);
    expect(pdf.getPageCount()).toBe(1);
    expect(pdf.getTitle()).toBe("Timesheet Mois Février 2026 - Algeria e-Banking Services - AEBS");
    // Le retour à la ligne des observations n'est pas pris pour un caractère inconnu
    const texte = new TextDecoder("latin1").decode(await genererTimesheet({ ...donnees, consultants: [] }));
    expect(texte).not.toContain("?Au");
    if (process.env.TIMESHEET_SORTIE) (await import("node:fs")).writeFileSync(process.env.TIMESHEET_SORTIE, await genererTimesheet(donnees));
  });
});
