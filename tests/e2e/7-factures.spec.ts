import { expect, test } from "@playwright/test";
import { connecter } from "./outils";

test("la page Factures propose la 013-26, après la dernière facture envoyée (012-26)", async ({ page }) => {
  await connecter(page, "admin@cta.test");
  await page.getByRole("link", { name: "Factures", exact: true }).click();
  await expect(page).toHaveURL(/\/cockpit\/factures/);
  await expect(page.getByRole("heading", { name: "Émettre une facture" })).toBeVisible();
  await expect(page.getByLabel("Dernière facture envoyée avant Cockpit")).toHaveValue("012-26");
  await expect(page.getByText("Prochaine facture : 013-26").first()).toBeVisible();
  // Aperçu calculé pour le client choisi
  await expect(page.getByText("Total TTC")).toBeVisible();
  await page.screenshot({ path: "test-results/factures.png", fullPage: true });
});
