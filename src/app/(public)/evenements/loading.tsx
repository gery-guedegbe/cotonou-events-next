import { Skeleton, EventCardSkeleton } from "@/components/ui/Skeleton";

/**
 * Reproduit la structure d'EventsBrowser pendant le chargement pour éviter
 * le décalage de mise en page à l'arrivée des données. Squelette et non
 * spinner : la page a une forme connue à l'avance, autant l'annoncer.
 */
export default function EventsLoading() {
  return (
    <div className="mx-auto max-w-container px-5 pb-16 pt-9">
      <div className="mb-7">
        <Skeleton className="h-9 w-[280px] md:h-10" />
        <Skeleton className="mt-3 h-5 w-[170px]" />
      </div>

      <Skeleton className="mb-6 h-12 w-full rounded-pill" />

      <div className="grid items-start gap-8 md:grid-cols-[280px_1fr]">
        <aside className="hidden rounded-2xl border border-gray-200 bg-white p-6 md:block">
          {[...Array(4)].map((_, block) => (
            <div key={block} className={block > 0 ? "mt-7" : undefined}>
              <Skeleton className="h-4 w-24" />

              <div className="mt-3 flex flex-col gap-2.5">
                {[...Array(3)].map((_, row) => (
                  <Skeleton key={row} className="h-4 w-full" />
                ))}
              </div>
            </div>
          ))}
        </aside>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
