import type { CotonouEvent } from "@/lib/types/event.types";
import {
  isUpcoming,
  isUpcomingWeekend,
  isInCurrentWeek,
  isInCurrentMonth,
} from "@/lib/utils/format-date";
import type { Filters } from "@/components/events/EventFilters";

/** Applique le filtre de date. Chaque option borne déjà la fenêtre à venir. */
function matchesDate(filters: Filters, date: string): boolean {
  switch (filters.date) {
    case "semaine":
      return isInCurrentWeek(date);
    case "weekend":
      return isUpcomingWeekend(date);
    case "mois":
      return isInCurrentMonth(date);
    default:
      return true;
  }
}

/** Filtre une liste d'événements selon les filtres actifs + une requête texte. */
export function filterEvents(
  filters: Filters,
  query: string,
  source: CotonouEvent[],
): CotonouEvent[] {
  const q = query.toLowerCase().trim();
  return source.filter((e) => {
    // Filet de sécurité : les requêtes Supabase excluent déjà le passé, mais un
    // appelant passant une autre source ne doit pas ressusciter d'événements périmés.
    if (!isUpcoming(e.date)) return false;
    if (filters.categories.length && !filters.categories.includes(e.category))
      return false;
    if (filters.quartiers.length && !filters.quartiers.includes(e.quartier))
      return false;
    if (filters.price === "gratuit" && e.priceType !== "gratuit") return false;
    if (filters.price === "payant" && e.priceType === "gratuit") return false;
    if (!matchesDate(filters, e.date)) return false;
    if (q && !`${e.title} ${e.venue} ${e.quartier}`.toLowerCase().includes(q))
      return false;
    return true;
  });
}
