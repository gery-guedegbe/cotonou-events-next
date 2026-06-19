import type { Config } from "tailwindcss";

/**
 * Le design system Cotonou.events s'aligne presque parfaitement sur la palette
 * Tailwind par défaut (green-600 = #16A34A, gray-900 = #111827, etc.).
 * On ajoute uniquement des alias sémantiques + les tokens spécifiques au brief.
 */
const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#16A34A",
          hover: "#15803D",
          light: "#DCFCE7",
          fg: "#14532D",
        },
        whatsapp: {
          DEFAULT: "#25D366",
          header: "#075E54",
          bubble: "#DCF8C6",
          bg: "#ECE5DD",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        pill: "100px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.10)",
      },
      maxWidth: {
        container: "1200px",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-460px 0" },
          "100%": { backgroundPosition: "460px 0" },
        },
        "pulse-dot": {
          "0%": { boxShadow: "0 0 0 0 rgba(22,163,74,0.5)" },
          "70%": { boxShadow: "0 0 0 7px rgba(22,163,74,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(22,163,74,0)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite linear",
        "pulse-dot": "pulse-dot 2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
