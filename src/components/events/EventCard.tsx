import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/constants/categories";
import type { CotonouEvent } from "@/lib/types/event.types";
import { formatDateBlock } from "@/lib/utils/format-date";
import { formatLocation } from "@/lib/utils/location";
import { CategoryBadge, PriceBadge } from "@/components/ui/Badge";
import { EventImage } from "@/components/events/EventImage";

/** Affiche réelle si disponible, sinon dégradé basé sur la catégorie + icône + rayures. */
function CategoryImage({ event }: { event: CotonouEvent }) {
  const c = CATEGORIES[event.category];

  return (
    <div className="relative h-40 overflow-hidden">
      <EventImage
        imageUrl={event.imageUrl}
        category={event.category}
        title={event.title}
        variant="card"
      />

      <span
        className="absolute left-3 top-3 rounded-pill bg-white/95 px-2.5 py-1 text-2xs font-bold uppercase tracking-label shadow-sm"
        style={{ color: c.text }}
      >
        {event.category}
      </span>
    </div>
  );
}

export function EventCard({ event }: { event: CotonouEvent }) {
  return (
    <Link
      href={`/evenements/${event.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card transition-[box-shadow,transform] duration-150 hover:-translate-y-[3px] hover:shadow-card-hover"
    >
      <CategoryImage event={event} />

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="line-clamp-2 min-h-[42px] text-base font-bold leading-snug text-gray-900">
          {event.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-3.5 w-3.5 flex-none" aria-hidden />

          <span>
            {event.dateLabel} · {event.time}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5 flex-none" aria-hidden />

          <span className="truncate">
            {formatLocation(event.venue, event.quartier)}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-1.5">
          <PriceBadge priceType={event.priceType} amount={event.amount} />

          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
            Voir les détails{" "}
            <ArrowRight className="h-[15px] w-[15px]" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Variante horizontale pour les listes mobiles (bloc date à gauche). */
export function EventCardMobile({ event }: { event: CotonouEvent }) {
  const { day, month } = formatDateBlock(event.date);
  return (
    <Link
      href={`/evenements/${event.id}`}
      className="flex items-stretch gap-3.5 rounded-xl border border-gray-200 bg-white p-3 shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="flex h-14 w-14 flex-none flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
        <span className="text-xl font-extrabold leading-none text-gray-900">
          {day}
        </span>
        <span className="mt-0.5 text-2xs font-bold uppercase tracking-label text-gray-500">
          {month}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <CategoryBadge category={event.category} className="self-start" />

        <h3 className="line-clamp-2 text-base font-bold leading-snug text-gray-900">
          {event.title}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5" aria-hidden />

          <span className="truncate">
            {formatLocation(event.venue, event.quartier, " · ")}
          </span>
        </div>

        <PriceBadge
          priceType={event.priceType}
          amount={event.amount}
          className="mt-0.5 self-start"
        />
      </div>
    </Link>
  );
}
