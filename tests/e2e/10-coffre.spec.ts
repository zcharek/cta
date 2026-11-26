import { expect, test } from "@playwright/test";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { genererFacture, type DonneesFacture } from "../../shared/facture";
import { connecter } from "./outils";

async function pdfTexte(lignes: string[]) {
  const doc = await PDFDocument.create();
  const page = doc.addPage();
  const police = await doc.embedFont(StandardFonts.Helvetica);
  lignes.forEach((l, i) => page.drawText(l, { x: 50, y: 760 - i * 20, size: 12, font: police }));
  return Buffer.from(await doc.save());
}

test("documents : une facture et un NDA sont détectés, leurs clients créés, puis enregistrés", async ({ page }) => {
  const facture: DonneesFacture = {
    numero: "004-26",
    date_emission: "2026-02-03",
    entreprise: { raison_sociale: "SARL CENTRAL TEST APPLICATION", siege: "Alger", rc: "", nif: "", nis: "", ai: "", rib: "", banque: "", email: "", ville: "Alger" } as never,
    client: { raison_sociale: "SARL Ancien Partenaire", adresse: "Oran", rc: "31/00-7654321 B 12", nif: "000999888777666" },
    ligne: { designation: "Prestation de service", debut: "2026-01-01", fin: "2026-01-31", unite: "Jour", quantite: 20, pu: 5000, montant: 100000 },
    tva_taux: 19,
    montant_ht: 100000,
    montant_tva: 19000,
    montant_ttc: 119000,
  };
  await connecter(page, "admin@cta.test");
  await page.getByRole("link", { name: "Documents" }).click();
  await expect(page.getByRole("heading", { name: /Les documents/ })).toBeVisible();

  await page.getByLabel("Choisir des documents").setInputFiles([
    { name: "Facture 004-26.pdf", mimeType: "application/pdf", buffer: Buffer.from(await genererFacture(facture)) },
    { name: "accord.pdf", mimeType: "application/pdf", buffer: await pdfTexte(["ACCORD DE CONFIDENTIALITE", "Entre : SARL CENTRAL TEST APPLICATION", "Et : SPA Pharma Nova", "Fait a Alger le 12/03/2025"]) },
  ]);

  const lFacture = page.getByRole("listitem").filter({ hasText: "Facture 004-26.pdf" });
  await expect(lFacture.getByLabel("N° de facture")).toHaveValue("004-26");
  await expect(lFacture.getByLabel("Émise le")).toHaveValue("2026-02-03");
  await expect(lFacture.getByLabel("Mois facturé")).toHaveValue("2026-01");
  await expect(lFacture.getByLabel("Total TTC (DZD)")).toHaveValue("119000");
  await expect(lFacture.getByLabel("Nom du nouveau client")).toHaveValue("SARL Ancien Partenaire");
  await expect(lFacture.getByLabel("NIF", { exact: true })).toHaveValue("000999888777666");

  const lNda = page.getByRole("listitem").filter({ hasText: "accord.pdf" });
  await expect(lNda.getByRole("combobox").first()).toHaveValue("nda");
  await expect(lNda.getByLabel("Nom du nouveau client")).toHaveValue("SPA Pharma Nova");
  await expect(lNda.getByLabel("Date du document")).toHaveValue("2025-03-12");
  await lNda.getByLabel("Titre").fill("NDA Pharma Nova");

  await page.getByRole("button", { name: "Enregistrer les 2 documents" }).click();
  await expect(lFacture.getByText("Facture 004-26 importée, client créé")).toBeVisible();
  await expect(lNda.getByText("Enregistré, client créé")).toBeVisible();

  const ligne = page.getByRole("row").filter({ hasText: "NDA Pharma Nova" });
  await expect(ligne).toContainText("SPA Pharma Nova");
  // Ouverture par lien (stockage en mémoire en démo)
  // Ouverture par lien signé (stockage en mémoire en démo) : Chromium sans interface télécharge le PDF au lieu de l'afficher
  const [onglet] = await Promise.all([page.waitForEvent("popup"), ligne.getByRole("button", { name: "Ouvrir" }).click()]);
  const telechargement = await onglet.waitForEvent("download");
  expect(telechargement.url()).toMatch(/__demo-stockage\/documents\/\d{4}\/[0-9a-f-]{36}-accord\.pdf$/);
  await onglet.close();

  // La facture importée apparaît dans Factures, avec son badge
  await page.getByRole("link", { name: "Factures", exact: true }).click();
  const fLigne = page.getByRole("row").filter({ hasText: "004-26" });
  await expect(fLigne).toContainText("Importée");
  await expect(fLigne).toContainText("SARL Ancien Partenaire");
});

test("un Collaborateur n'a pas l'onglet Documents", async ({ page }) => {
  await connecter(page, "yasmine@cta.test");
  await expect(page.getByRole("link", { name: "Documents" })).toHaveCount(0);
});
