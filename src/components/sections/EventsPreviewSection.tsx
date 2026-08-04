"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarSearch } from "lucide-react";
import type { CategoryName, CotonouEvent } from "@/lib/types/event.types";
import { EventCard } from "@/components/events/EventCard";
import { SearchBar } from "@/components/events/SearchBar";
import { CategoryChip } from "@/components/events/CategoryChip";
import { EmptyState } from "@/components/ui/EmptyState";

const CHIPS: (CategoryName | "Tous")[] = [
  "Tous",
  "Concert",
  "Culture",
  "Sport",
  "Business",
  "Formation",
  "Gastronomie",
];

export function EventsPreviewSection({ events }: { events: CotonouEvent[] }) {
  const [active, setActive] = useState<CategoryName | "Tous">("Tous");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.toLowerCase().trim();
    return events
      .filter((e) => active === "Tous" || e.category === active)
      .filter(
        (e) =>
          !q || `${e.title} ${e.venue} ${e.quartier}`.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [events, active, query]);

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-container px-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-display text-gray-900">
              Événements à venir à Cotonou
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {events.length} événements disponibles
            </p>
          </div>
        </div>

        <div className="mt-6">
          <SearchBar value={query} onChange={setQuery} />
        </div>

        <div className="no-scrollbar mt-4 flex gap-2.5 overflow-x-auto pb-1">
          {CHIPS.map((c) => (
            <CategoryChip
              key={c}
              label={c}
              active={active === c}
              onClick={() => setActive(c)}
            />
          ))}
        </div>

        {visible.length === 0 ? (
          <EmptyState
            className="mt-7"
            icon={CalendarSearch}
            title="Rien dans cette catégorie pour l'instant"
            description="Aucun événement à venir ne correspond. Les autres catégories en ont peut-être."
            action={
              <button
                onClick={() => {
                  setActive("Tous");
                  setQuery("");
                }}
                className="rounded-pill bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
              >
                Voir toutes les catégories
              </button>
            }
          />
        ) : (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/evenements"
            className="inline-flex items-center gap-2 rounded-pill border-[1.5px] border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-brand hover:text-brand"
          >
            Voir tous les événements{" "}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
