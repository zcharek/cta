import { defineConfig, devices } from "@playwright/test";

// Parcours de bout en bout sur le serveur de démonstration (Postgres en mémoire, aucun secret requis).
// Les tests partagent la même base : ils s'exécutent un par un, dans l'ordre des fichiers.
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: "http://localhost:5199",
    locale: "fr-FR",
    timezoneId: "Africa/Algiers",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1360, height: 900 } } }],
  webServer: {
    command: "node scripts/serveur-demo.mjs",
    url: "http://localhost:5199/api/cockpit/auth/moi",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
