import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { connecter } from "./outils";

test("premier bulletin de paie : informations demandées une fois, brut calculé depuis le net, PDF téléchargé", async ({ page }) => {
  await connecter(page, "admin@cta.test");
  await page.getByRole("link", { name: "Bulletins de paie" }).click();
  await page.getByLabel("Salarié", { exact: true }).selectOption({ label: "Sofiane Mekki" });
  await expect(page.getByText("Premier bulletin de Sofiane Mekki")).toBeVisible();
  await page.getByLabel("Salaire net à payer (DA)").fill("80000");
  await expect(page.getByText("109 730,77 DA")).toBeVisible();
  await page.getByLabel("N° adhérent (CNAS)").fill("12345678 90");
  await page.getByLabel("Fonction").fill("Ingénieur logiciel");
  await expect(page.getByLabel("Aperçu du bulletin")).toContainText("INGÉNIEUR LOGICIEL");
  await page.screenshot({ path: "test-results/paie.png", fullPage: true });
  const [pdf] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Générer le bulletin" }).click()]);
  expect(pdf.suggestedFilename()).toMatch(/^Bulletin_\d{4}-\d{2}_Sofiane-Mekki\.pdf$/);
  expect(readFileSync((await pdf.path())!).subarray(0, 5).toString()).toBe("%PDF-");
  await expect(page.getByRole("heading", { name: "Bulletins générés" })).toBeVisible();
  const ligne = page.locator("#bulletins-generes").getByRole("row", { name: /Sofiane Mekki/ });
  await expect(ligne).toContainText("80 000,00 DA");
  await expect(ligne).toContainText("109 730,77 DA");
});
