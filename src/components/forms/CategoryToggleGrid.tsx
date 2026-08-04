"use client";

import { CheckCircle2, Sparkles } from "lucide-react";
import { CATEGORY_NAMES, CATEGORIES } from "@/lib/constants/categories";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/Icon";

export const ALL_CATEGORIES_LABEL = "Tout recevoir";

const TOGGLES = [...CATEGORY_NAMES, ALL_CATEGORIES_LABEL];

/**
 * Applique la règle d'exclusion entre "Tout recevoir" et les catégories
 * individuelles. Extraite du composant pour rester testable et pour que le
 * formulaire n'ait plus à porter cette logique.
 */
export function toggleCategory(current: string[], name: string): string[] {
  if (name === ALL_CATEGORIES_LABEL) {
    return current.includes(name) ? [] : [ALL_CATEGORIES_LABEL];
  }
  const base = current.filter((c) => c !== ALL_CATEGORIES_LABEL);
  return base.includes(name)
    ? base.filter((c) => c !== name)
    : [...base, name];
}

interface CategoryToggleGridProps {
  value: string[];
  onChange: (next: string[]) => void;
}

export function CategoryToggleGrid({
  value,
  onChange,
}: CategoryToggleGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {TOGGLES.map((name) => {
        const on = value.includes(name);
        const icon =
          name === ALL_CATEGORIES_LABEL
            ? null
            : CATEGORIES[name as keyof typeof CATEGORIES]?.icon;

        return (
          <button
            type="button"
            key={name}
            // aria-pressed : ces boutons portent un état, un bouton nu ne
            // l'annoncerait pas aux lecteurs d'écran.
            aria-pressed={on}
            onClick={() => onChange(toggleCategory(value, name))}
            className={cn(
              "relative flex min-h-11 items-center gap-2.5 rounded-[10px] border-[1.5px] px-3.5 py-3 text-left transition-colors",
              on
                ? "border-brand bg-brand-light/40"
                : "border-gray-200 bg-white hover:border-gray-300",
            )}
          >
            {icon ? (
              <Icon
                name={icon}
                className={cn(
                  "h-5 w-5 flex-none",
                  on ? "text-brand" : "text-gray-500",
                )}
                aria-hidden
              />
            ) : (
              <Sparkles
                className={cn(
                  "h-5 w-5 flex-none",
                  on ? "text-brand" : "text-gray-500",
                )}
                aria-hidden
              />
            )}

            <span className="pr-5 text-sm font-semibold text-gray-900">
              {name}
            </span>

            {on && (
              <CheckCircle2
                className="absolute right-3 h-[18px] w-[18px] text-brand"
                aria-hidden
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
