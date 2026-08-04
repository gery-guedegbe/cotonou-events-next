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
      /**
       * Échelle typographique explicite. Les pas xs->xl gardent volontairement
       * les valeurs Tailwind par défaut : les redéfinir aurait modifié en
       * silence la centaine d'usages existants de text-sm / text-base. Les
       * valeurs arbitraires du code (13px, 13.5px, 14.5px, 15px...) ont été
       * absorbées vers le haut, jamais vers le bas, pour gagner en lisibilité.
       * Au-dessus de xl, ratio 1.25 (tierce majeure) pour des titres nets.
       * La hauteur de ligne est portée par le token : elle ne doit plus être
       * redéclarée au cas par cas.
       */
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1.45" }], // 11px - micro-labels
        xs: ["0.75rem", { lineHeight: "1.45" }], // 12px - badges
        sm: ["0.875rem", { lineHeight: "1.55" }], // 14px - meta secondaire
        base: ["1rem", { lineHeight: "1.6" }], // 16px - corps de texte
        lg: ["1.125rem", { lineHeight: "1.55" }], // 18px - chapo
        xl: ["1.25rem", { lineHeight: "1.4" }], // 20px - petits titres
        "2xl": ["1.5625rem", { lineHeight: "1.25" }], // 25px
        "3xl": ["1.9375rem", { lineHeight: "1.15" }], // 31px
        "4xl": ["2.4375rem", { lineHeight: "1.08" }], // 39px
        "5xl": ["3.0625rem", { lineHeight: "1.03" }], // 49px
      },
      letterSpacing: {
        // Le tracking négatif suivait les tailles de façon incohérente
        // (-0.02em, -0.03em, -0.035em). Deux pas suffisent : titres et
        // grands titres. Plus le texte est gros, plus il se resserre.
        title: "-0.02em",
        display: "-0.035em",
        // Interlettrage positif des micro-labels en capitales, qui oscillait
        // entre 0.05 et 0.08em sans intention repérable.
        label: "0.06em",
      },
      spacing: {
        // Hauteur de la navbar. Sert d'offset aux colonnes sticky, qui la
        // codaient en dur (top-[88px]) sans dire de quoi il s'agissait.
        nav: "88px",
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
