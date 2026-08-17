"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  SearchX,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { filterEvents } from "@/lib/utils/filter-events";
import {
  EventFilters,
  EMPTY_FILTERS,
  countActiveFilters,
  type Filters,
} from "@/components/events/EventFilters";
import { EventCard } from "@/components/events/EventCard";
import { SearchBar } from "@/components/events/SearchBar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import type { CotonouEvent } from "@/lib/types/event.types";

const PAGE_SIZE = 9;

export function EventsBrowser({ events }: { events: CotonouEvent[] }) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(false);

  const results = useMemo(
    () => filterEvents(filters, query, events),
    [filters, query, events],
  );
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = results.slice(
    (current - 1) * PAGE_SIZE,
    current * PAGE_SIZE,
  );
  const activeCount = countActiveFilters(filters);

  const update = (next: Filters) => {
    setFilters(next);
    setPage(1);
  };
  const reset = () => {
    setFilters(EMPTY_FILTERS);
    setQuery("");
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-container px-5 pb-16 pt-9">
      <div className="mb-7">
        <h1 className="text-3xl font-extrabold tracking-display text-gray-900 md:text-4xl">
          Événements à Cotonou
        </h1>

        <p className="mt-2 text-base text-gray-500">
          {results.length} événement{results.length > 1 ? "s" : ""} disponible
          {results.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="mb-6">
        <SearchBar
          value={query}
          onChange={(v) => {
            setQuery(v);
            setPage(1);
          }}
        />
      </div>

      <div className="grid items-start gap-8 md:grid-cols-[280px_1fr]">
        <aside className="sticky top-nav hidden rounded-2xl border border-gray-200 bg-white p-6 md:block">
          <EventFilters
            filters={filters}
            onChange={update}
            onReset={reset}
            groupPrefix="desktop"
          />
        </aside>

        <div className="min-w-0">
          {results.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="Aucun événement trouvé"
              description="Essayez d'élargir votre recherche ou de réinitialiser les filtres."
              action={
                <Button onClick={reset}>Réinitialiser les filtres</Button>
              }
            />
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {pageItems.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-between gap-1.5 sm:justify-center">
                  {/* Bouton Précédent */}
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={current === 1}
                    className="flex h-11 flex-none items-center gap-1 rounded-pill border-[1.5px] border-gray-200 px-3 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:text-gray-400 sm:px-4"
                    aria-label="Page précédente"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden />
                    <span className="hidden sm:inline">Précédent</span>
                  </button>

                  {/* Zone défilable pour les numéros de page sur mobile */}
                  <div className="no-scrollbar flex max-w-[200px] items-center gap-1.5 overflow-x-auto py-1 sm:max-w-none">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`flex h-11 w-11 flex-none items-center justify-center rounded-full text-sm font-bold ${
                          current === i + 1
                            ? "bg-brand text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  {/* Bouton Suivant */}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={current === totalPages}
                    className="flex h-11 flex-none items-center gap-1 rounded-pill border-[1.5px] border-gray-200 px-3 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:text-gray-400 sm:px-4"
                    aria-label="Page suivante"
                  >
                    <span className="hidden sm:inline">Suivant</span>
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Barre filtres mobile */}
      {/* Décalée au-dessus de la bannière cookies quand celle-ci est affichée
          (variable publiée par CookieBanner), sinon collée en bas. */}
      <div
        style={{ bottom: "var(--cookie-banner-h, 0px)" }}
        className="fixed inset-x-0 z-[70] border-t border-gray-200 bg-white p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:hidden"
      >
        <Button
          onClick={() => setDrawer(true)}
          className="w-full"
          variant="primary"
        >
          <SlidersHorizontal className="h-[18px] w-[18px]" aria-hidden />
          Filtres{activeCount ? ` (${activeCount})` : ""}
        </Button>
      </div>

      <AnimatePresence>
        {drawer && (
          <div className="fixed inset-0 z-[90] md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawer(false)}
              className="absolute inset-0 bg-black/50"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-[20px] bg-white p-5 pb-7"
            >
              <div className="mb-2 flex justify-end">
                {/* -mr-2 compense le padding ajouté pour atteindre 44px sans
                    décaler visuellement l'icône par rapport au bord. */}
                <button
                  onClick={() => setDrawer(false)}
                  aria-label="Fermer les filtres"
                  className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>

              <EventFilters
                filters={filters}
                onChange={update}
                onReset={reset}
                groupPrefix="mobile"
              />

              <Button onClick={() => setDrawer(false)} className="mt-4 w-full">
                Voir {results.length} événements
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
