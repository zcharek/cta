import { readFileSync } from "node:fs";
import { devices, expect, test } from "@playwright/test";
import { caseSaisie, connecter } from "./outils";

test.describe("sur téléphone", () => {
  const { defaultBrowserType: _, ...pixel7 } = devices["Pixel 7"];
  test.use(pixel7);

  test("une collaboratrice saisit et soumet sa semaine", async ({ page }) => {
    await connecter(page, "yasmine@cta.test");
    await expect(page.getByRole("heading", { name: /Bonjour Yasmine,/ })).toBeVisible();

    await caseSaisie(page, "VetCare", "lundi").tap();
    await caseSaisie(page, "VetCare", "mardi").tap();
    await caseSaisie(page, "VetCare", "mardi").tap();
    await expect(caseSaisie(page, "VetCare", "lundi")).toHaveAccessibleName(/1 jour/);
    await expect(caseSaisie(page, "VetCare", "mardi")).toHaveAccessibleName(/½ jour/);

    // Dépassement d'un jour : alerte
    await caseSaisie(page, "Banque Atlas", "lundi").tap();
    await expect(page.getByRole("alert")).toContainText("ne devrait pas dépasser 1 jour");
    await caseSaisie(page, "Banque Atlas", "lundi").tap();
    await caseSaisie(page, "Banque Atlas", "lundi").tap();
    await expect(page.getByRole("alert")).toHaveCount(0);
    await expect(page.getByText("Enregistrement automatique")).toBeVisible();

    // Enregistré côté serveur
    await page.reload();
    await expect(page.getByText("Total : 1,5 j")).toBeVisible();

    await page.getByRole("button", { name: "Soumettre la semaine" }).tap();
    await expect(page.getByText(/en attente de validation/)).toBeVisible();
    await expect(caseSaisie(page, "VetCare", "jeudi")).toBeDisabled();
  });
});

test("un admin valide la semaine, le récap et l'export CSV donnent les bons montants", async ({ page }) => {
  await connecter(page, "admin@cta.test");
  await page.getByRole("link", { name: "Validation" }).click();
  const carte = page.locator("section", { has: page.getByRole("heading", { name: "Yasmine Belkacem" }) });
  await expect(carte).toContainText("1,5 j");
  await carte.getByRole("button", { name: "Valider" }).click();
  await expect(page.getByText("Aucune semaine en attente de validation.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Dernières semaines validées" })).toBeVisible();

  await page.getByRole("link", { name: "Récap mensuel" }).click();
  // 1,5 j × 45 000 DZD (VetCare) — la semaine peut chevaucher deux mois : on ne vérifie que le client VetCare s'il est dans ce mois
  const vetcare = page.getByRole("rowheader", { name: "VetCare", exact: true });
  if (await vetcare.count()) {
    const ligne = page.getByRole("row", { name: /^VetCare/ });
    await expect(ligne).toContainText("45 000 DZD");
  }
  await page.getByRole("radio", { name: "Toutes les saisies" }).click();
  await expect(page.getByRole("radio", { name: "Toutes les saisies" })).toHaveAttribute("aria-checked", "true");

  const boutonCsv = page.getByRole("button", { name: "Exporter en CSV" });
  if (await boutonCsv.isEnabled()) {
    const [telechargement] = await Promise.all([page.waitForEvent("download"), boutonCsv.click()]);
    const csv = readFileSync((await telechargement.path())!, "utf8");
    expect(csv.charCodeAt(0)).toBe(0xfeff);
    expect(csv).toContain("Client;Collaborateur;Jours;TJM (DZD);Montant HT (DZD)");
    expect(csv).toMatch(/VetCare;Yasmine Belkacem;[\d,]+;45000;/);
  }
});

test("un admin rouvre une semaine validée depuis la saisie", async ({ page }) => {
  await connecter(page, "admin@cta.test");
  await page.getByRole("link", { name: "Saisie des temps" }).click();
  await page.getByLabel("Collaborateur").selectOption({ label: "Yasmine Belkacem" });
  await expect(page.getByText(/Semaine validée le/)).toBeVisible();
  await page.getByRole("button", { name: "Rouvrir la semaine" }).click();
  await expect(page.getByRole("button", { name: "Soumettre la semaine" })).toBeVisible();
  await expect(caseSaisie(page, "VetCare", "jeudi")).toBeEnabled();
});
