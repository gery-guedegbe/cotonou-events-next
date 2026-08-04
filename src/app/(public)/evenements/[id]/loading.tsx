import { Skeleton } from "@/components/ui/Skeleton";

export default function EventDetailLoading() {
  return (
    <div className="mx-auto max-w-container px-5 pb-16 pt-6">
      <Skeleton className="h-5 w-40" />

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <Skeleton className="h-[260px] w-full rounded-2xl md:h-[360px]" />

          <Skeleton className="mt-6 h-6 w-28 rounded-pill" />
          <Skeleton className="mt-4 h-9 w-[85%] md:h-10" />

          <div className="mt-6 flex flex-col gap-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-5 w-[60%]" />
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-2.5">
            {[...Array(5)].map((_, i) => (
              <Skeleton
                key={i}
                className={i === 4 ? "h-4 w-2/5" : "h-4 w-full"}
              />
            ))}
          </div>
        </div>

        <Skeleton className="h-[280px] w-full rounded-2xl" />
      </div>
    </div>
  );
}
