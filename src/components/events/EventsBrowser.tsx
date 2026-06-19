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
import type { CotonouEvent } from "@/lib/types/event.types";

const PAGE_SIZE = 9;

export function EventsBrowser({ events }: { events: CotonouEvent[] }) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(false);

  const results = useMemo(() => filterEvents(filters, query, events), [filters, query, events]);
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
        <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-gray-900 md:text-[34px]">
          Événements à Cotonou
        </h1>

        <p className="mt-2 text-[15px] text-gray-500">
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
        <aside className="sticky top-[88px] hidden rounded-2xl border border-gray-200 bg-white p-[22px] md:block">
          <EventFilters filters={filters} onChange={update} onReset={reset} />
        </aside>

        <div>
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 px-5 py-20 text-center">
              <SearchX
                className="mx-auto h-12 w-12 text-gray-400"
                strokeWidth={1.5}
                aria-hidden
              />

              <h3 className="mt-[18px] text-lg font-bold text-gray-900">
                Aucun événement trouvé
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Essayez d&apos;élargir votre recherche ou de réinitialiser les
                filtres.
              </p>

              <Button onClick={reset} className="mt-5">
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {pageItems.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={current === 1}
                    className="flex h-10 items-center gap-1 rounded-pill border-[1.5px] border-gray-200 px-3.5 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:text-gray-300"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden /> Précédent
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`h-10 w-10 rounded-full text-sm font-bold ${
                        current === i + 1
                          ? "bg-brand text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={current === totalPages}
                    className="flex h-10 items-center gap-1 rounded-pill border-[1.5px] border-gray-200 px-3.5 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:text-gray-300"
                  >
                    Suivant <ChevronRight className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Barre filtres mobile */}
      <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-gray-200 bg-white p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:hidden">
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
                <button
                  onClick={() => setDrawer(false)}
                  aria-label="Fermer"
                  className="text-gray-400"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>

              <EventFilters
                filters={filters}
                onChange={update}
                onReset={reset}
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
