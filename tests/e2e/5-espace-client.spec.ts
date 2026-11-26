import { expect, test } from "@playwright/test";
import { connecter } from "./outils";

test("un admin de l'espace client se connecte à Cockpit avec ses identifiants habituels", async ({ page }) => {
  await connecter(page, "ancien-admin@cta.test");
  await expect(page).toHaveURL(/\/cockpit\/$/);
  await expect(page.getByRole("button", { name: "Mon compte : Admin Historique" })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Mon compte/ })).toContainText("Co-Founder");
});

test("l'espace client se pilote depuis l'onglet Clients : prospects, réponses, rattachement, envoi", async ({ page }) => {
  await connecter(page, "admin@cta.test");
  await page.getByRole("link", { name: "Clients", exact: true }).click();
  await page.getByRole("link", { name: /^Prospects/ }).click();
  await expect(page).toHaveURL(/\/cockpit\/reglages\/clients\/prospects$/);

  // Réponses déjà reçues
  await page.getByRole("link", { name: /Nadia Kaci/ }).click();
  await page.getByRole("link", { name: /Questionnaire de cadrage/ }).click();
  await expect(page.getByText("Application de gestion des stocks pour nos pharmacies.")).toBeVisible();

  // Rattachement : le client est créé depuis la société saisie, Nadia apparaît dans son dossier
  await page.getByRole("link", { name: "← Nadia Kaci" }).click();
  await page.getByRole("button", { name: "Créer le client « Pharma Plus »" }).click();
  await page.getByRole("link", { name: "Pharma Plus", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Espace client" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Nadia Kaci.*Répondu/ })).toBeVisible();

  // Envoi d'un questionnaire à un prospect
  await page.goto("/cockpit/reglages/clients/prospects");
  await expect(page.getByRole("link", { name: /Nadia Kaci/ })).toHaveCount(1); // désormais dans « Comptes rattachés »
  await page.getByRole("link", { name: /Omar Ziani/ }).click();
  await page.getByLabel("Message au client (facultatif)").fill("Bonjour Omar, voici le questionnaire.");
  await page.getByRole("button", { name: "Envoyer", exact: true }).click();
  await expect(page.getByText("Envoyé. Le client le voit dans son espace.")).toBeVisible();
  await expect(page.getByRole("link", { name: /Questionnaire de cadrage.*À compléter/ })).toBeVisible();
});

test("les anciennes adresses de l'espace client mènent à l'onglet Clients", async ({ page }) => {
  await connecter(page, "admin@cta.test");
  await page.goto("/cockpit/espace-client");
  await expect(page).toHaveURL(/\/cockpit\/reglages\/clients\/prospects$/);
  await expect(page.getByRole("link", { name: "Clients et questionnaires" })).toHaveCount(0);
});

test("un Collaborateur n'a pas accès à l'espace client", async ({ page }) => {
  await connecter(page, "yasmine@cta.test");
  await page.goto("/cockpit/reglages/clients/prospects");
  await expect(page).toHaveURL(/\/cockpit\/saisie/);
  expect(await page.evaluate(async () => (await fetch("/api/cockpit/portail")).status)).toBe(403);
});
