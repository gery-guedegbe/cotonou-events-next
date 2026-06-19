import type { CategoryName, CategoryMeta } from "@/lib/types/event.types";

export const CATEGORIES: Record<CategoryName, CategoryMeta> = {
  Concert: {
    bg: "#FEF3C7",
    text: "#92400E",
    g1: "#FDE68A",
    g2: "#F59E0B",
    icon: "music",
  },
  Culture: {
    bg: "#DBEAFE",
    text: "#1E40AF",
    g1: "#BFDBFE",
    g2: "#3B82F6",
    icon: "palette",
  },
  Sport: {
    bg: "#DCFCE7",
    text: "#14532D",
    g1: "#BBF7D0",
    g2: "#16A34A",
    icon: "trophy",
  },
  Business: {
    bg: "#F3F4F6",
    text: "#374151",
    g1: "#E5E7EB",
    g2: "#9CA3AF",
    icon: "briefcase",
  },
  Formation: {
    bg: "#EDE9FE",
    text: "#5B21B6",
    g1: "#DDD6FE",
    g2: "#8B5CF6",
    icon: "graduation-cap",
  },
  Gastronomie: {
    bg: "#FCE7F3",
    text: "#9D174D",
    g1: "#FBCFE8",
    g2: "#EC4899",
    icon: "utensils",
  },
  Religieux: {
    bg: "#E0F2FE",
    text: "#0C4A6E",
    g1: "#BAE6FD",
    g2: "#0EA5E9",
    icon: "church",
  },
  "Vie nocturne": {
    bg: "#E0E7FF",
    text: "#3730A3",
    g1: "#C7D2FE",
    g2: "#6366F1",
    icon: "martini",
  },
  "Mode & Beauté": {
    bg: "#FAE8FF",
    text: "#86198F",
    g1: "#F5D0FE",
    g2: "#C026D3",
    icon: "shirt",
  },
  Famille: {
    bg: "#CCFBF1",
    text: "#115E59",
    g1: "#99F6E4",
    g2: "#0D9488",
    icon: "users-round",
  },
  Communautaire: {
    bg: "#FFEDD5",
    text: "#9A3412",
    g1: "#FED7AA",
    g2: "#EA580C",
    icon: "handshake",
  },
  Autre: {
    bg: "#F1F5F9",
    text: "#334155",
    g1: "#E2E8F0",
    g2: "#64748B",
    icon: "ellipsis",
  },
};

export const CATEGORY_NAMES = Object.keys(CATEGORIES) as CategoryName[];

/** Slug DB (categorie check constraint) -> libellé d'affichage. */
export const CATEGORY_SLUG_TO_NAME: Record<string, CategoryName> = {
  concert: "Concert",
  culture: "Culture",
  sport: "Sport",
  business: "Business",
  formation: "Formation",
  gastronomie: "Gastronomie",
  religieux: "Religieux",
  nightlife: "Vie nocturne",
  mode_beaute: "Mode & Beauté",
  famille: "Famille",
  communautaire: "Communautaire",
  autre: "Autre",
};

/** Libellé d'affichage -> slug DB, pour les écritures (formulaires, filtres). */
export const CATEGORY_NAME_TO_SLUG: Record<CategoryName, string> = Object.fromEntries(
  Object.entries(CATEGORY_SLUG_TO_NAME).map(([slug, name]) => [name, slug]),
) as Record<CategoryName, string>;
