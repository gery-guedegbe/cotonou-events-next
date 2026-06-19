import { EVENTS } from "@/lib/data/events";
import type { CotonouEvent } from "@/lib/types/event.types";
import { isWeekend } from "@/lib/utils/format-date";
import type { Filters } from "@/components/events/EventFilters";

/** Filtre la liste complète selon les filtres + une requête texte. */
export function filterEvents(
  filters: Filters,
  query: string,
  source: CotonouEvent[] = EVENTS,
): CotonouEvent[] {
  const q = query.toLowerCase().trim();
  return source.filter((e) => {
    if (filters.categories.length && !filters.categories.includes(e.category))
      return false;
    if (filters.quartiers.length && !filters.quartiers.includes(e.quartier))
      return false;
    if (filters.price === "gratuit" && e.price !== 0) return false;
    if (filters.price === "payant" && e.price === 0) return false;
    if (filters.date === "weekend" && !isWeekend(e.date)) return false;
    if (q && !`${e.title} ${e.venue} ${e.quartier}`.toLowerCase().includes(q))
      return false;
    return true;
  });
}
