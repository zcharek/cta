import type { Config } from "tailwindcss";

export default {
  content: ["./client/index.html", "./client/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
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
      },
    },
  },
} satisfies Config;
