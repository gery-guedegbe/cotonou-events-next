import { cn } from "@/lib/utils/cn";
import { CATEGORIES } from "@/lib/constants/categories";
import type { CategoryName } from "@/lib/types/event.types";
import { formatPrice } from "@/lib/utils/format-date";

export function CategoryBadge({
  category,
  className,
}: {
  category: CategoryName;
  className?: string;
}) {
  const c = CATEGORIES[category];
  return (
    <span
      className={cn(
        "inline-flex rounded-pill px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em]",
        className,
      )}
      style={{ background: c.bg, color: c.text }}
    >
      {category}
    </span>
  );
}

export function PriceBadge({ price, className }: { price: number; className?: string }) {
  const free = price === 0;
  return (
    <span
      className={cn(
        "inline-flex rounded-pill px-2.5 py-1 text-[11.5px] font-bold",
        free ? "bg-brand-light text-brand-fg" : "bg-gray-100 text-gray-700",
        className,
      )}
    >
      {formatPrice(price)}
    </span>
  );
}
