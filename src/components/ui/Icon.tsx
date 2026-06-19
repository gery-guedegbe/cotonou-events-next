"use client";

import { icons, type LucideProps } from "lucide-react";

/** kebab-case -> PascalCase ("graduation-cap" -> "GraduationCap") */
function toPascal(name: string): string {
  return name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

/**
 * Rend une icône lucide à partir de son nom kebab-case (tel que stocké dans les
 * métadonnées de catégorie). Évite d'importer chaque icône manuellement.
 */
export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = icons[toPascal(name) as keyof typeof icons];
  if (!Cmp) return null;
  return <Cmp {...props} />;
}
