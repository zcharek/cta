import { expect, test } from "@playwright/test";
import { connecter } from "./outils";

test("la page Factures propose la 013-26, après la dernière facture envoyée (012-26)", async ({ page }) => {
  await connecter(page, "admin@cta.test");
  await page.getByRole("link", { name: "Factures", exact: true }).click();
  await expect(page).toHaveURL(/\/cockpit\/factures/);
  await expect(page.getByRole("heading", { name: "Émettre une facture" })).toBeVisible();
  // Numérotation et identité de l'entreprise : lecture seule
  const numerotation = page.locator("section", { has: page.getByRole("heading", { name: "Numérotation et TVA" }) }).last();
  await expect(numerotation).toContainText("012-26");
  await expect(numerotation.getByRole("textbox")).toHaveCount(0);
  await expect(numerotation.getByRole("button")).toHaveCount(0);
  const identite = page.locator("section", { has: page.getByRole("heading", { name: "Identité de l'entreprise" }) }).last();
  await expect(identite.getByRole("textbox")).toHaveCount(0);
  await expect(page.getByText("prochain numéro")).toBeVisible();
  await expect(page.getByText("013-26").first()).toBeVisible();
  // Émission en trois étapes et aperçu de la facture
  await expect(page.getByRole("heading", { name: "Vérifications" })).toBeVisible();
  await expect(page.getByLabel("Aperçu de la facture")).toContainText("FACTURE N° 013-26");
  await page.screenshot({ path: "test-results/factures.png", fullPage: true });
});
