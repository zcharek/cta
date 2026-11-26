import { expect, test } from "@playwright/test";
import { connecter } from "./outils";

// Lina Bouzid (invitation en attente) n'est utilisée par aucun autre test : renvoyer son invitation ne change rien ailleurs.
test("le journal des accès montre l'invitation renvoyée, avec son auteur", async ({ page }) => {
  await connecter(page, "admin@cta.test");
  await page.getByRole("link", { name: "Collaborateurs", exact: true }).click();
  await page.getByLabel("Plus d'actions pour Lina Bouzid").click();
  await page.getByRole("button", { name: "Renvoyer l'invitation" }).click();
  await expect(page.getByText("Invitation envoyée à Lina Bouzid.")).toBeVisible();

  await page.getByRole("button", { name: "Journal des accès" }).click();
  const journal = page.getByRole("dialog");
  await expect(journal.getByText("Invitation renvoyée · Lina Bouzid")).toBeVisible();
  await expect(journal.getByText("Par Amina Cherif").first()).toBeVisible();
});
