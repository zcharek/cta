import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { connecter } from "./outils";

// S'appuie sur la fiche de Yasmine complétée dans 6-onglets (naissance, civilité).
test("l'administration génère l'attestation et le certificat ; le salarié télécharge les siens", async ({ page }) => {
  await connecter(page, "admin@cta.test");
  await page.getByRole("link", { name: "Collaborateurs" }).click();
  const ligne = page.getByRole("listitem").filter({ hasText: "Yasmine Belkacem" });
  await ligne.getByRole("button", { name: "Documents" }).click();
  const fenetre = page.getByRole("dialog");
  await fenetre.getByLabel("Poste").fill("Ingénieure QA");
  await page.screenshot({ path: "test-results/documents.png" });
  const [attestation] = await Promise.all([page.waitForEvent("download"), fenetre.getByRole("button", { name: "Générer l'attestation" }).click()]);
  expect(attestation.suggestedFilename()).toMatch(/^Attestation_de_travail_Yasmine-Belkacem_\d{4}-\d{2}-\d{2}\.pdf$/);
  expect(readFileSync((await attestation.path())!).subarray(0, 5).toString()).toBe("%PDF-");
  await expect(ligne.getByText("Ingénieure QA")).toBeVisible(); // poste enregistré sur la fiche

  await ligne.getByRole("button", { name: "Documents" }).click();
  await fenetre.getByRole("radio", { name: /Certificat de travail/ }).check();
  await fenetre.getByLabel("Date de sortie", { exact: true }).fill("2026-12-31");
  const [certificat] = await Promise.all([page.waitForEvent("download"), fenetre.getByRole("button", { name: "Générer le certificat" }).click()]);
  expect(certificat.suggestedFilename()).toMatch(/^Certificat_de_travail_Yasmine-Belkacem/);

  // Côté salarié : « Mes documents » dans Mon profil
  await page.context().clearCookies();
  await connecter(page, "yasmine@cta.test");
  await page.goto("/cockpit/profil");
  await expect(page.getByText("Fin de contrat le 31/12/2026.")).toBeVisible();
  await page.screenshot({ path: "test-results/mes-documents.png", fullPage: true });
  const [perso] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Télécharger : Attestation de travail" }).click()]);
  expect(perso.suggestedFilename()).toMatch(/^Attestation_de_travail_Yasmine-Belkacem/);
});
