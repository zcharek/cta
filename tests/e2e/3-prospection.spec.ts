import { expect, test, type Locator, type Page } from "@playwright/test";
import { connecter } from "./outils";

const colonne = (page: Page, nom: string) => page.getByRole("region", { name: new RegExp(`^${nom} :`) });
const carte = (page: Page, nom: string) => page.locator("li", { has: page.getByRole("button", { name: nom, exact: false }) }).filter({ hasText: nom });

/** Glisser-déposer à la souris, par petits pas (dnd-kit démarre après 8 px). */
async function glisser(page: Page, source: Locator, cible: Locator) {
  const a = (await source.boundingBox())!;
  const b = (await cible.boundingBox())!;
  await page.mouse.move(a.x + a.width / 2, a.y + 20);
  await page.mouse.down();
  await page.mouse.move(a.x + a.width / 2 + 20, a.y + 30, { steps: 5 });
  await page.mouse.move(b.x + b.width / 2, b.y + 60, { steps: 15 });
  await page.mouse.up();
  // dnd-kit ignore les clics pendant 50 ms après un dépôt (pour qu'un lâcher ne compte pas comme un clic)
  await page.waitForTimeout(100);
}

test.beforeEach(async ({ page }) => {
  // On n'ouvre jamais réellement WhatsApp pendant les tests
  await page.context().route("https://wa.me/**", (r) => r.fulfill({ body: "WhatsApp" }));
  await connecter(page, "admin@cta.test");
  await page.getByRole("link", { name: "Cabinets" }).click();
});

test("le Kanban affiche les colonnes dans l'ordre, sans les Hors cible", async ({ page }) => {
  await expect(page.getByRole("region")).toHaveCount(7); // attend l'affichage du Kanban
  const titres = await page.getByRole("region").evaluateAll((els) => els.map((e) => e.getAttribute("aria-label")!.split(" :")[0]));
  expect(titres).toEqual(["À contacter", "Message WhatsApp envoyé", "Relancé", "En discussion", "Démo planifiée", "Client signé", "Pas intéressé"]);
  await expect(page.getByText("Clinique Fermée")).toHaveCount(0);
  await expect(page.getByText("Doublon possible")).toHaveCount(2);
});

test("le bouton WhatsApp ouvre la bonne conversation et passe le cabinet en « Message envoyé »", async ({ page }) => {
  const c = carte(page, "Clinique Vétérinaire El Biar");
  const lien = c.getByRole("link", { name: /WhatsApp/ });
  const href = await lien.getAttribute("href");
  expect(href).toMatch(/^https:\/\/wa\.me\/213550123456\?text=/);
  expect(decodeURIComponent(href!.split("text=")[1]!)).toContain("Bonjour Dr Amrani");
  expect(decodeURIComponent(href!.split("text=")[1]!)).toContain("Clinique Vétérinaire El Biar");

  const [onglet] = await Promise.all([page.context().waitForEvent("page"), lien.click()]);
  await onglet.close();
  await expect(colonne(page, "Message WhatsApp envoyé").getByText("Clinique Vétérinaire El Biar")).toBeVisible();

  // Un fixe n'a pas de WhatsApp mais un lien d'appel
  await expect(carte(page, "Cabinet du Dr Saïdi").getByRole("link", { name: /Appeler/ })).toHaveAttribute("href", "tel:+21321280000");
});

test("glisser une carte change le statut, programme la relance et alimente l'historique", async ({ page }) => {
  await glisser(page, carte(page, "Cabinet Saïd Hamdine"), colonne(page, "Relancé"));
  const deplacee = colonne(page, "Relancé").locator("li").filter({ hasText: "Cabinet Saïd Hamdine" });
  await expect(deplacee).toBeVisible();
  await expect(deplacee).toContainText(/Relance \d+ /);

  await deplacee.getByRole("button", { name: /Cabinet Saïd Hamdine/ }).click();
  const fiche = page.getByRole("dialog");
  await expect(fiche.getByLabel("Statut")).toHaveValue("relance");
  await expect(fiche.getByText("Statut : Relancé")).toBeVisible();
  await expect(fiche.getByLabel("Prochaine relance")).not.toHaveValue("");
  await fiche.getByRole("button", { name: "Fermer la fiche" }).click();
});

test("au clavier, le menu « Déplacer vers… » déplace une carte", async ({ page }) => {
  const menu = page.getByLabel("Déplacer Cabinet Vétérinaire Hydra vers…");
  await menu.focus();
  await menu.selectOption({ label: "Relancé" });
  await expect(colonne(page, "Relancé").getByText("Cabinet Vétérinaire Hydra")).toBeVisible();
});

test("filtres : recherche par numéro et « À relancer »", async ({ page }) => {
  await page.getByLabel("Rechercher un cabinet").fill("0697 11");
  await expect(page.locator("li").filter({ hasText: "Dr " })).toHaveCount(1);
  await expect(page.getByText("Clinique des Pins")).toBeVisible();
  await page.getByLabel("Rechercher un cabinet").fill("");

  await page.getByRole("button", { name: /^À relancer/ }).click();
  await expect(page).toHaveURL(/relance=1/);
  await expect(page.getByText("Clinique Bab Ezzouar")).toBeVisible();
  await expect(page.getByText("Vétérinaire Chéraga")).toHaveCount(0);
});

test("la fiche enregistre les modifications et la suppression demande une confirmation", async ({ page }) => {
  await carte(page, "Cabinet Dély Ibrahim").getByRole("button", { name: /Cabinet Dély Ibrahim/ }).click();
  const fiche = page.getByRole("dialog");
  await fiche.getByLabel("Notes").fill("Rappeler en janvier");
  await fiche.getByRole("button", { name: "Enregistrer (1)" }).click();
  await expect(fiche.getByText("Fiche enregistrée.")).toBeVisible();

  await fiche.getByRole("button", { name: "Supprimer" }).click();
  await page.getByRole("button", { name: "Supprimer définitivement" }).click();
  await expect(page.getByText("Cabinet Dély Ibrahim")).toHaveCount(0);
});

test("import CSV : prévisualisation puis import par lots", async ({ page }) => {
  const csv = [
    "Nom de l'établissement;Vétérinaire(s);Commune;Téléphone 1;Segment;Semaine",
    "Clinique Vétérinaire El Biar;Dr Amrani;El Biar;0550 12 34 56;Clinique;S1",
    "Cabinet Neuf Zéralda;Dr Nouveau;Zéralda;0550 99 88 77;Cabinet;S4",
    "TEST à ignorer;Moi;Alger;0550 00 00 00;Test;S0",
  ].join("\r\n");
  await page.getByRole("button", { name: "Importer un fichier" }).click();
  await page.locator("input[type=file]").setInputFiles({ name: "cabinets.csv", mimeType: "text/csv", buffer: Buffer.from(csv, "utf8") });
  const fenetre = page.getByRole("dialog");
  await expect(fenetre.getByText("CSV, UTF-8, séparateur « ; »", { exact: false })).toBeVisible();
  await expect(fenetre.getByText("nouveaux")).toBeVisible();
  await expect(fenetre.locator("p", { hasText: /^1$/ }).first()).toBeVisible();
  await expect(fenetre.getByText("Lignes de test ignorées (1)")).toBeVisible();
  await fenetre.getByRole("button", { name: "Importer" }).click();
  await expect(fenetre.getByText("1 cabinet créé")).toBeVisible();
  await fenetre.getByRole("button", { name: "Voir les cabinets" }).click();
  await expect(colonne(page, "À contacter").getByText("Cabinet Neuf Zéralda")).toBeVisible();
});

test("le modèle de message WhatsApp s'enregistre avec un aperçu", async ({ page }) => {
  await page.getByRole("link", { name: "Message WhatsApp" }).click();
  const zone = page.getByLabel("Modèle de message");
  await zone.fill("Salam {veterinaire}, VetCare pour {cabinet} ?");
  await page.getByLabel("Aperçu pour").selectOption({ index: 0 });
  await expect(page.getByLabel("Aperçu du message")).toContainText(/Salam Dr .+, VetCare pour .+ \?/);
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByText("Modèle enregistré.")).toBeVisible();
});
