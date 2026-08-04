"use client";

import { CATEGORY_NAMES } from "@/lib/constants/categories";
import { QUARTIERS } from "@/lib/constants/quartiers";
import type { CategoryName } from "@/lib/types/event.types";
import { Checkbox } from "@/components/ui/Checkbox";

export type DateFilter = "all" | "semaine" | "weekend" | "mois";
export type PriceFilter = "all" | "gratuit" | "payant";

export interface Filters {
  categories: CategoryName[];
  quartiers: string[];
  date: DateFilter;
  price: PriceFilter;
}

export const EMPTY_FILTERS: Filters = {
  categories: [],
  quartiers: [],
  date: "all",
  price: "all",
};

const DATE_OPTIONS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "Toutes les dates" },
  { value: "semaine", label: "Cette semaine" },
  { value: "weekend", label: "Ce week-end" },
  { value: "mois", label: "Ce mois" },
];

const PRICE_OPTIONS: { value: PriceFilter; label: string }[] = [
  { value: "all", label: "Tous les prix" },
  { value: "gratuit", label: "Gratuit" },
  { value: "payant", label: "Payant" },
];

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="mb-3 text-2xs font-bold uppercase tracking-label text-gray-500">
        {title}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

export function EventFilters({
  filters,
  onChange,
  onReset,
  groupPrefix = "filters",
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  onReset: () => void;
  /**
   * Préfixe des noms de groupes radio. Le composant est monté deux fois
   * (sidebar desktop et tiroir mobile) : sans préfixe distinct, les deux jeux
   * de radios formeraient un seul groupe dans le DOM.
   */
  groupPrefix?: string;
}) {
  const toggleArray = <T extends string>(
    key: "categories" | "quartiers",
    value: T,
  ) => {
    const arr = filters[key] as string[];
    const next = arr.includes(value)
      ? arr.filter((x) => x !== value)
      : [...arr, value];
    onChange({ ...filters, [key]: next });
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <span className="text-base font-bold text-gray-900">Filtres</span>

        <button
          onClick={onReset}
          className="text-sm font-semibold text-brand"
        >
          Réinitialiser
        </button>
      </div>

      <Group title="Catégorie">
        {CATEGORY_NAMES.map((name) => (
          <Checkbox
            key={name}
            checked={filters.categories.includes(name)}
            onChange={() => toggleArray<CategoryName>("categories", name)}
          >
            {name}
          </Checkbox>
        ))}
      </Group>

      <Group title="Date">
        {DATE_OPTIONS.map((o) => (
          <Checkbox
            key={o.value}
            shape="round"
            name={`${groupPrefix}-date`}
            checked={filters.date === o.value}
            onChange={() => onChange({ ...filters, date: o.value })}
          >
            {o.label}
          </Checkbox>
        ))}
      </Group>

      <Group title="Prix">
        {PRICE_OPTIONS.map((o) => (
          <Checkbox
            key={o.value}
            shape="round"
            name={`${groupPrefix}-price`}
            checked={filters.price === o.value}
            onChange={() => onChange({ ...filters, price: o.value })}
          >
            {o.label}
          </Checkbox>
        ))}
      </Group>

      <div>
        <div className="mb-3 text-2xs font-bold uppercase tracking-label text-gray-500">
          Quartier
        </div>

        <div className="flex flex-col gap-3">
          {QUARTIERS.filter((q) => q !== "Autre").map((q) => (
            <Checkbox
              key={q}
              checked={filters.quartiers.includes(q)}
              onChange={() => toggleArray("quartiers", q)}
            >
              {q}
            </Checkbox>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Applique un jeu de filtres + recherche texte à la liste d'événements. */
export function countActiveFilters(f: Filters): number {
  return (
    f.categories.length +
    f.quartiers.length +
    (f.date !== "all" ? 1 : 0) +
    (f.price !== "all" ? 1 : 0)
  );
}
