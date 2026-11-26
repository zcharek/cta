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

  // Après l'enregistrement, on bascule sur les documents clients, rangés par client
  await expect(page.getByRole("tab", { name: /Documents clients et partenaires/ })).toHaveAttribute("aria-selected", "true");
  const ligne = page.getByRole("row").filter({ hasText: "NDA Pharma Nova" });
  await expect(page.getByRole("link", { name: "SPA Pharma Nova" })).toBeVisible();
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

test("dossier légal : une pièce ajoutée depuis sa carte passe « À jour »", async ({ page }) => {
  await connecter(page, "admin@cta.test");
  await page.getByRole("link", { name: "Documents" }).click();
  await expect(page.getByRole("tab", { name: "Dossier légal CTA" })).toHaveAttribute("aria-selected", "true");
  const carte = page.getByRole("listitem").filter({ has: page.getByRole("heading", { name: "Registre de commerce" }) });
  await expect(carte).toContainText("Fichier manquant");
  const [selecteur] = await Promise.all([page.waitForEvent("filechooser"), carte.getByRole("button", { name: "Ajouter le fichier" }).click()]);
  await selecteur.setFiles({ name: "scan.pdf", mimeType: "application/pdf", buffer: await pdfTexte(["Document"]) });
  const ligne = page.getByRole("listitem").filter({ hasText: "scan.pdf" });
  await expect(ligne).toContainText("Dossier légal : Registre de commerce");
  await page.getByRole("button", { name: "Enregistrer le document" }).click();
  await expect(ligne.getByText("Ajouté au dossier légal")).toBeVisible();
  await expect(carte).toContainText("À jour");
  await expect(carte).toContainText("scan.pdf");
  // Une attestation demande sa date de validité
  const cnas = page.getByRole("listitem").filter({ has: page.getByRole("heading", { name: "Attestation CNAS" }) });
  const [s2] = await Promise.all([page.waitForEvent("filechooser"), cnas.getByRole("button", { name: "Ajouter avec sa date de validité" }).click()]);
  await s2.setFiles({ name: "cnas.pdf", mimeType: "application/pdf", buffer: await pdfTexte(["CNAS"]) });
  const l2 = page.getByRole("listitem").filter({ hasText: "cnas.pdf" });
  await expect(l2).toContainText("Date de validité à renseigner.");
  await l2.getByLabel("Valide jusqu'au").fill("2030-01-31");
  await page.getByRole("button", { name: "Enregistrer le document" }).click();
  await expect(cnas).toContainText("Valide jusqu'au 31/01/2030");
});

test("un Collaborateur n'a pas l'onglet Documents", async ({ page }) => {
  await connecter(page, "yasmine@cta.test");
  await expect(page.getByRole("link", { name: "Documents" })).toHaveCount(0);
});
