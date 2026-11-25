import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// En dev, /cockpit/saisie (etc.) doit servir la page Cockpit, comme la réécriture de vercel.json en production.
const cockpitSpa: Plugin = {
  name: "cockpit-spa",
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const chemin = req.url?.split("?")[0] ?? "";
      if (/^\/cockpit(\/[^.]*)?$/.test(chemin)) req.url = "/cockpit/index.html";
      next();
    });
  },
};

export default defineConfig({
  plugins: [react(), cockpitSpa],
  resolve: {
    alias: { "@": path.resolve(__dirname, "client", "src") },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        site: path.resolve(__dirname, "client/index.html"),
        cockpit: path.resolve(__dirname, "client/cockpit/index.html"),
      },
    },
  },
});
