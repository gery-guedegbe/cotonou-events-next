import { cn } from "@/lib/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-md", className)} aria-hidden />;
}

/** Carte squelette reproduisant la card événement pendant le chargement. */
export function EventCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <Skeleton className="h-40 rounded-none" />

      <div className="flex flex-col gap-2.5 p-4">
        <Skeleton className="h-4 w-[85%]" />
        <Skeleton className="h-3 w-3/5" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
