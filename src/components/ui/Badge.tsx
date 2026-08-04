import { cn } from "@/lib/utils/cn";
import { CATEGORIES } from "@/lib/constants/categories";
import type { CategoryName, PriceType } from "@/lib/types/event.types";
import { formatEventPrice } from "@/lib/utils/format-date";

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
        "inline-flex rounded-pill px-2.5 py-1 text-2xs font-bold uppercase tracking-label",
        className,
      )}
      style={{ background: c.bg, color: c.text }}
    >
      {category}
    </span>
  );
}

export function PriceBadge({
  priceType,
  amount,
  className,
}: {
  priceType: PriceType;
  amount: number | null;
  className?: string;
}) {
  const free = priceType === "gratuit";
  return (
    <span
      className={cn(
        "inline-flex rounded-pill px-2.5 py-1 text-2xs font-bold",
        free ? "bg-brand-light text-brand-fg" : "bg-gray-100 text-gray-700",
        className,
      )}
    >
      {formatEventPrice(priceType, amount)}
    </span>
  );
}
