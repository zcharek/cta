import { expect, test } from "@playwright/test";
import { connecter, menuCompte } from "./outils";

test("un Co-Founder active l'onglet Cabinets pour un Collaborateur, qui le voit à sa connexion", async ({ page }) => {
  const email = `sami${Date.now()}@cta.test`;
  await connecter(page, "admin@cta.test");
  await page.getByRole("link", { name: "Collaborateurs", exact: true }).click();
  await page.getByRole("button", { name: "Inviter un collaborateur" }).click();
  const fenetre = page.getByRole("dialog");
  await fenetre.getByLabel("Prénom et nom").fill("Sami Larbi");
  await fenetre.getByLabel("Adresse e-mail").fill(email);

  // Collaborateur : seule la saisie est cochée par défaut
  await expect(fenetre.getByRole("checkbox", { name: "Saisie des temps" })).toBeChecked();
  await expect(fenetre.getByRole("checkbox", { name: /Cabinets/ })).not.toBeChecked();
  await fenetre.getByRole("checkbox", { name: /Cabinets/ }).check();
  await fenetre.screenshot({ path: "test-results/onglets-fenetre.png" });
  await fenetre.getByRole("button", { name: "Envoyer l'invitation" }).click();

  const lien = await page.locator("a[href*='definir-mot-de-passe']").getAttribute("href");
  await menuCompte(page, "Se déconnecter");
  await page.goto(lien!);
  await page.getByLabel("Mot de passe", { exact: true }).fill("sami-secret-1");
  await page.getByLabel("Confirmation").fill("sami-secret-1");
  await page.getByRole("button", { name: "Activer mon compte" }).click();

  // Premier onglet activé : Cabinets ; la barre latérale ne montre que ses onglets
  await expect(page).toHaveURL(/\/cockpit\/cabinets/);
  const nav = page.getByRole("navigation", { name: "Navigation principale" });
  await expect(nav.getByRole("link")).toHaveText(["Cabinets", "Ma saisie"]);
  await page.goto("/cockpit/recap");
  await expect(page).toHaveURL(/\/cockpit\/cabinets/);
});

test("le compte Founder ne peut pas être archivé ni restreint depuis l'écran", async ({ page }) => {
  await connecter(page, "admin@cta.test");
  await page.goto("/cockpit/reglages/collaborateurs");
  const ligne = page.getByRole("listitem").filter({ hasText: "Founder" }).filter({ hasNotText: "Co-Founder" });
  await ligne.getByRole("button", { name: "Modifier" }).click();
  const fenetre = page.getByRole("dialog");
  await expect(fenetre.getByText("Compte Founder : il a toujours accès")).toBeVisible();
  await expect(fenetre.getByRole("button", { name: "Archiver" })).toHaveCount(0);
  await expect(fenetre.getByRole("checkbox", { name: /Cabinets/ })).toHaveCount(0);
});

test("un Collaborateur renseigne ses coordonnées dans Mon profil", async ({ page }) => {
  await connecter(page, "yasmine@cta.test");
  await menuCompte(page, "Mon profil");
  await expect(page).toHaveURL(/\/cockpit\/profil/);
  await expect(page.getByLabel("Adresse e-mail")).toHaveAttribute("readonly", "");
  await expect(page.getByText(/Fiche complète à \d+ %/)).toBeVisible();
  await page.screenshot({ path: "test-results/mon-profil.png", fullPage: true });

  await page.getByLabel("Civilité").selectOption("Mme");
  await page.getByLabel("Téléphone").fill("0550 98 76 54");
  await page.getByLabel("Date de naissance").fill("1994-03-12");
  await page.getByLabel("Lieu de naissance").fill("Tizi Ouzou");
  await page.getByLabel("Nationalité").fill("Algérienne");
  await page.getByLabel("NIN").fill("1099 4031 2012 3456 78");
  await page.getByRole("tab", { name: /Adresse/ }).click();
  await page.getByLabel("Adresse", { exact: true }).fill("5 rue Larbi Ben M'hidi");
  await page.getByLabel("Ville").fill("Alger-Centre");
  await page.getByLabel("Wilaya").fill("Alger");
  await page.getByRole("tab", { name: /Paie/ }).click();
  await page.getByLabel("Situation familiale").selectOption("C");
  await page.getByLabel("N° de sécurité sociale").fill("1234567890 12");
  await page.getByLabel("N° de compte bancaire (RIP ou RIB)").fill("00799999001234567890");
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByText("Informations enregistrées.")).toBeVisible();
  await expect(page.getByText("Fiche complète : prête pour vos contrats et bulletins.")).toBeVisible();
  await page.getByRole("button", { name: /^Mon compte/ }).click();
  await page.screenshot({ path: "test-results/menu-compte.png" });
  await page.keyboard.press("Escape");

  await page.reload();
  await expect(page.getByLabel("Téléphone")).toHaveValue("0550 98 76 54");
  await expect(page.getByLabel("Date de naissance")).toHaveValue("1994-03-12");
  await page.getByRole("tab", { name: /Adresse/ }).click();
  await expect(page.getByLabel("Wilaya")).toHaveValue("Alger");
});

test("Mon profil : un NIN invalide dans un onglet masqué fait revenir sur cet onglet", async ({ page }) => {
  await connecter(page, "sofiane@cta.test");
  await menuCompte(page, "Mon profil");
  await page.getByLabel("NIN").fill("123");
  await page.getByRole("tab", { name: /Paie/ }).click();
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByRole("tab", { name: /Informations personnelles/ })).toHaveAttribute("aria-selected", "true");
});

test("Clients et Collaborateurs sont deux pages séparées", async ({ page }) => {
  await connecter(page, "admin@cta.test");
  await page.getByRole("link", { name: "Clients", exact: true }).click();
  await expect(page).toHaveURL(/\/cockpit\/reglages\/clients/);
  await expect(page.getByRole("button", { name: "Nouveau client" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Inviter un collaborateur" })).toHaveCount(0);
  await page.screenshot({ path: "test-results/clients.png" });
  await page.getByRole("link", { name: "Collaborateurs", exact: true }).click();
  await expect(page.getByRole("button", { name: "Inviter un collaborateur" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Nouveau client" })).toHaveCount(0);
  // L'ancienne adresse mène aux collaborateurs
  await page.goto("/cockpit/reglages/equipe");
  await expect(page).toHaveURL(/\/cockpit\/reglages\/collaborateurs/);
});
