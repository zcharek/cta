import type { Config } from "tailwindcss";

export default {
  content: ["./client/index.html", "./client/src/**/*.{ts,tsx}", "./client/cockpit/**/*.{html,ts,tsx}", "./shared/**/*.ts"],
  theme: {
    extend: {
      colors: {
        // Cockpit : couleurs portées par des variables CSS (mode sombre, voir client/cockpit/src/styles.css)
        ck: {
          marine: "var(--ck-marine)",
          orange: "var(--ck-orange)",
          "orange-texte": "var(--ck-orange-texte)",
          surface: "var(--ck-surface)",
          "surface-2": "var(--ck-surface-2)",
          texte: "var(--ck-texte)",
          "texte-2": "var(--ck-texte-2)",
          bordure: "var(--ck-bordure)",
          titre: "var(--ck-titre)",
          plein: "var(--ck-plein)",
          "plein-texte": "var(--ck-plein-texte)",
        },
        brand: {
          red: { 700: "#e8491d" },
          blue: {
            50: "#e6f9ff",
            100: "#ccefff",
            300: "#7aabcc",
            600: "#264f7f",
            700: "#143666",
            800: "#08224c",
            900: "#001233",
          },
        },
      },
      fontFamily: {
        sans: ["Lexend", "system-ui", "sans-serif"],
        outfit: ["Outfit", "system-ui", "sans-serif"],
      },
    },
  },
} satisfies Config;
