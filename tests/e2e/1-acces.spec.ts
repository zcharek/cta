import { expect, test } from "@playwright/test";
import { connecter } from "./outils";

test("non connecté : toute page renvoie vers la connexion, puis vers la page demandée", async ({ page }) => {
  await page.goto("/cockpit/recap");
  await expect(page).toHaveURL(/\/cockpit\/connexion\?suite=%2Frecap/);
  await page.getByLabel("Adresse e-mail").fill("admin@cta.test");
  await page.getByLabel("Mot de passe").fill("mauvais");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page.getByRole("alert")).toHaveText("E-mail ou mot de passe incorrect.");
  await page.getByLabel("Mot de passe").fill("demo1234");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL(/\/cockpit\/recap/);
  await expect(page.getByRole("heading", { name: /Récap/ })).toBeVisible();
});

test("un Co-Founder invite un collaborateur, qui définit son mot de passe et arrive sur sa saisie", async ({ page }) => {
  const email = `nour${Date.now()}@cta.test`;
  await connecter(page, "admin@cta.test");
  await page.getByRole("link", { name: "Clients et collaborateurs" }).click();
  await page.getByRole("button", { name: "Inviter un collaborateur" }).click();
  const fenetre = page.getByRole("dialog");
  await fenetre.getByLabel("Prénom et nom").fill("Nour Hamidi");
  await fenetre.getByLabel("Adresse e-mail").fill(email);
  await fenetre.getByText("VetCare").click();
  await fenetre.getByRole("button", { name: "Envoyer l'invitation" }).click();

  // Sans Resend (démo), le lien s'affiche à l'écran
  const lien = await page.locator("a[href*='definir-mot-de-passe']").getAttribute("href");
  expect(lien).toBeTruthy();
  await expect(page.getByText("Invitation envoyée", { exact: false }).first()).toBeVisible();
  await page.getByRole("button", { name: "Se déconnecter" }).click();

  await page.goto(lien!);
  await expect(page.getByRole("heading", { name: "Bienvenue, Nour." })).toBeVisible();
  await expect(page).toHaveURL(/definir-mot-de-passe$/); // jeton retiré de l'adresse
  await page.getByLabel("Mot de passe", { exact: true }).fill("nour-secret-1");
  await page.getByLabel("Confirmation").fill("nour-secret-1");
  await page.getByRole("button", { name: "Activer mon compte" }).click();
  await expect(page).toHaveURL(/\/cockpit\/saisie/);
  await expect(page.getByRole("heading", { name: /Bonjour Nour,/ })).toBeVisible();

  // Le lien ne sert qu'une fois
  await page.goto(lien!);
  await expect(page.getByRole("heading", { name: /Lien expiré/ })).toBeVisible();
});

test("un Collaborateur ne voit que « Ma saisie » et ne peut rien ouvrir d'autre, même par l'API", async ({ page }) => {
  await connecter(page, "yasmine@cta.test");
  await expect(page).toHaveURL(/\/cockpit\/saisie/);
  await expect(page.getByRole("navigation", { name: "Navigation principale" }).getByRole("link")).toHaveText(["Ma saisie"]);
  for (const chemin of ["/cockpit/", "/cockpit/cabinets", "/cockpit/validation", "/cockpit/reglages/equipe"]) {
    await page.goto(chemin);
    await expect(page).toHaveURL(/\/cockpit\/saisie/);
  }
  const statuts = await page.evaluate(async () =>
    Promise.all(["cabinets", "collaborateurs", "validation", "recap?mois=2026-11", "accueil", "parametres/whatsapp"].map(async (c) => (await fetch(`/api/cockpit/${c}`)).status)),
  );
  expect(statuts).toEqual([403, 403, 403, 403, 403, 403]);
  const clients = await page.evaluate(async () => (await fetch("/api/cockpit/clients")).json());
  expect(JSON.stringify(clients)).not.toMatch(/tjm/i);
});

test("mot de passe oublié : même réponse quel que soit l'e-mail", async ({ page }) => {
  await page.goto("/cockpit/connexion");
  await page.getByRole("button", { name: "Mot de passe oublié ?" }).click();
  await page.getByLabel("Adresse e-mail").fill("personne@cta.test");
  await page.getByRole("button", { name: "Envoyer le lien" }).click();
  await expect(page.getByText(/Si un compte actif correspond/)).toBeVisible();
});
