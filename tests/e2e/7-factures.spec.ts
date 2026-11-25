import { expect, test } from "@playwright/test";
import { connecter } from "./outils";

test("la page Factures propose la 013-26, après la dernière facture envoyée (012-26)", async ({ page }) => {
  await connecter(page, "admin@cta.test");
  await page.getByRole("link", { name: "Factures", exact: true }).click();
  await expect(page).toHaveURL(/\/cockpit\/factures/);
  await expect(page.getByRole("heading", { name: "Émettre une facture" })).toBeVisible();
  // Numérotation et identité de l'entreprise : lecture seule
  const numerotation = page.locator("section", { has: page.getByRole("heading", { name: "Numérotation" }) });
  await expect(numerotation).toContainText("012-26");
  await expect(numerotation.getByRole("textbox")).toHaveCount(0);
  await expect(numerotation.getByRole("button")).toHaveCount(0);
  const identite = page.locator("section", { has: page.getByRole("heading", { name: "Identité de l'entreprise" }) });
  await expect(identite.getByRole("textbox")).toHaveCount(0);
  await expect(page.getByText("Prochaine facture : 013-26").first()).toBeVisible();
  // Aperçu calculé pour le client choisi
  await expect(page.getByText("Total TTC")).toBeVisible();
  await page.screenshot({ path: "test-results/factures.png", fullPage: true });
});
