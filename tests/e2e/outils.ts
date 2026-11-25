import { expect, type Page } from "@playwright/test";

export const MOT_DE_PASSE = "demo1234";

export async function connecter(page: Page, email: string, motDePasse = MOT_DE_PASSE) {
  await page.goto("/cockpit/connexion");
  await page.getByLabel("Adresse e-mail").fill(email);
  await page.getByLabel("Mot de passe").fill(motDePasse);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).not.toHaveURL(/connexion/);
}

/** Case de la grille de saisie, par client et jour (« lundi », « mardi »…). */
export const caseSaisie = (page: Page, client: string, jour: string) => page.getByRole("button", { name: new RegExp(`^${client}, ${jour}`) });

/** Ouvre le menu du compte (en haut à droite) et choisit une entrée. */
export async function menuCompte(page: Page, entree: "Mon profil" | "Se déconnecter") {
  await page.getByRole("button", { name: /^Mon compte/ }).click();
  await page.getByRole("menuitem", { name: entree }).click();
}
