import { expect, test } from "@playwright/test";
import { connecter } from "./outils";

test("un admin de l'espace client se connecte à Cockpit avec ses identifiants habituels", async ({ page }) => {
  await connecter(page, "ancien-admin@cta.test");
  await expect(page).toHaveURL(/\/cockpit\/$/);
  await expect(page.getByText("Admin Historique")).toBeVisible();
  await expect(page.getByText("Co-Founder").first()).toBeVisible();
});

test("l'espace client se pilote depuis Cockpit : comptes, envoi d'un questionnaire, réponses", async ({ page }) => {
  await connecter(page, "admin@cta.test");
  await page.getByRole("link", { name: "Clients et questionnaires" }).click();
  await expect(page.getByRole("heading", { name: "Espace client." })).toBeVisible();

  // Réponses déjà reçues
  await page.getByRole("link", { name: /Nadia Kaci/ }).click();
  await page.getByRole("link", { name: /Questionnaire de cadrage/ }).click();
  await expect(page.getByText("Application de gestion des stocks pour nos pharmacies.")).toBeVisible();

  // Envoi d'un questionnaire à un autre compte
  await page.getByRole("link", { name: "Clients et questionnaires" }).click();
  await page.getByRole("link", { name: /Omar Ziani/ }).click();
  await page.getByLabel("Message au client (facultatif)").fill("Bonjour Omar, voici le questionnaire.");
  await page.getByRole("button", { name: "Envoyer", exact: true }).click();
  await expect(page.getByText("Envoyé. Le client le voit dans son espace.")).toBeVisible();
  await expect(page.getByRole("link", { name: /Questionnaire de cadrage.*À compléter/ })).toBeVisible();
});

test("un Collaborateur n'a pas accès à l'espace client", async ({ page }) => {
  await connecter(page, "yasmine@cta.test");
  await page.goto("/cockpit/espace-client");
  await expect(page).toHaveURL(/\/cockpit\/saisie/);
  expect(await page.evaluate(async () => (await fetch("/api/cockpit/portail")).status)).toBe(403);
});
