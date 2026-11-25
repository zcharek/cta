import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    root: ".",
    include: ["tests/**/*.test.ts"],
    environment: "node",
    env: {
      AUTH_SECRET: "secret-de-test-suffisamment-long-pour-jose-0123456789",
      APP_URL: "https://cockpit.test",
    },
    testTimeout: 20_000,
  },
});
