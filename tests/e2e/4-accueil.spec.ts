import { expect, test } from "@playwright/test";
import { connecter } from "./outils";

test("Aujourd'hui : tâches, prospection et temps du mois, avec des liens vers chaque module", async ({ page }) => {
  await connecter(page, "admin@cta.test");
  await expect(page).toHaveURL(/\/cockpit\/$/);
  await expect(page.getByRole("heading", { name: "Bonjour, voici votre journée." })).toBeVisible();
  for (const titre of ["À faire", "Prospection VetCare", "Temps du mois"]) await expect(page.getByRole("heading", { name: titre })).toBeVisible();
  await expect(page.getByText(/relances? dues?/)).toBeVisible();
  await expect(page.getByText(/Prochaine semaine du plan : S\d/)).toBeVisible();

  await page.getByRole("button", { name: "Voir les relances" }).click();
  await expect(page).toHaveURL(/\/cockpit\/cabinets\?relance=1/);
  await expect(page.getByRole("button", { name: /^À relancer/ })).toHaveAttribute("aria-pressed", "true");

  await page.goto("/cockpit/");
  await page.getByRole("button", { name: /^Ouvrir S\d/ }).click();
  await expect(page).toHaveURL(/semaine=S\d/);
});

test("mode sombre : les couleurs suivent le réglage du système", async ({ browser }) => {
  const contexte = await browser.newContext({ colorScheme: "dark" });
  const page = await contexte.newPage();
  await page.goto("/cockpit/connexion");
  const fond = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--ck-surface").trim());
  expect(fond).toBe("#101c3d");
  await contexte.close();
});

test("le pied de page affiche le logo et « Designed by Central Test Agency »", async ({ page }) => {
  await page.goto("/cockpit/connexion");
  await expect(page.getByRole("contentinfo")).toContainText("Designed by Central Test Agency");
  await expect(page.getByRole("contentinfo").getByRole("img", { name: "Central Test Agency" })).toBeVisible();
});
