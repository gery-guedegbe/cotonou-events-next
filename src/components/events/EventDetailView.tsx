import { Calendar, Clock, MapPin, User, ExternalLink } from "lucide-react";
import type { CotonouEvent } from "@/lib/types/event.types";
import { CATEGORIES } from "@/lib/constants/categories";
import { formatFullDate } from "@/lib/utils/format-date";
import { CategoryBadge, PriceBadge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";

/** Image d'illustration de l'événement (affiche réelle ou gradient + icône de catégorie). */
export function EventHeroImage({ event }: { event: CotonouEvent }) {
  const cat = CATEGORIES[event.category];

  return (
    <div className="relative h-[220px] overflow-hidden rounded-[18px] md:h-[320px]">
      {event.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={event.imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${cat.g1}, ${cat.g2})` }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, rgba(255,255,255,0.12) 0 2px, transparent 2px 13px)",
            }}
          />

          <Icon
            name={cat.icon}
            className="absolute bottom-6 right-[30px] h-20 w-20 text-white/70"
            strokeWidth={1.25}
            aria-hidden
          />
        </div>
      )}
    </div>
  );
}

/**
 * Corps de la fiche événement (badges, titre, infos, description, lieu),
 * partagé entre la page publique de détail et la prévisualisation admin.
 * Ne gère pas sa propre largeur : à englober dans le conteneur du contexte
 * appelant (ex. `max-w-[800px]`).
 */
export function EventDetailView({ event }: { event: CotonouEvent }) {
  const infos = [
    { Icon: Calendar, label: "Date", value: formatFullDate(event.date) },
    { Icon: Clock, label: "Heure", value: event.time },
    { Icon: MapPin, label: "Lieu", value: `${event.venue}, ${event.quartier}` },
    { Icon: User, label: "Organisateur", value: event.organizer },
  ];

  return (
    <>
      <div className="flex gap-2">
        <CategoryBadge category={event.category} />
        <PriceBadge price={event.price} />
      </div>

      <h1 className="mt-4 text-[26px] font-extrabold leading-tight tracking-[-0.03em] text-gray-900 md:text-4xl">
        {event.title}
      </h1>

      <div className="mt-[22px] grid gap-4 sm:grid-cols-2">
        {infos.map((info) => (
          <div key={info.label} className="flex items-start gap-3">
            <info.Icon className="h-5 w-5 flex-none text-brand" aria-hidden />

            <div>
              <div className="text-xs text-gray-400">{info.label}</div>

              <div className="text-[14.5px] font-semibold text-gray-900">
                {info.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="my-7 h-px bg-gray-200" />

      <h2 className="mb-3 text-lg font-bold text-gray-900">
        À propos de l&apos;événement
      </h2>

      <p className="text-[15.5px] leading-relaxed text-gray-700">
        {event.description}
      </p>

      <h2 className="mb-3 mt-8 text-lg font-bold text-gray-900">Lieu</h2>

      <div className="overflow-hidden rounded-2xl border border-gray-200">
        <div
          className="relative flex h-[180px] items-center justify-center bg-gray-200"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.04),rgba(0,0,0,0.04)), repeating-linear-gradient(0deg,#DDE3EA 0 1px,transparent 1px 28px), repeating-linear-gradient(90deg,#DDE3EA 0 1px,transparent 1px 28px)",
          }}
        >
          <div className="h-10 w-10 -rotate-45 rounded-[50%_50%_50%_0] bg-red-500 shadow-[0_4px_10px_rgba(0,0,0,0.2)]" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <div className="text-[14.5px] font-semibold text-gray-900">
              {event.venue}
            </div>

            <div className="text-[13px] text-gray-500">
              {event.quartier}, Cotonou, Bénin
            </div>
          </div>

          <a
            href={`https://www.google.com/maps/search/${encodeURIComponent(`${event.venue} Cotonou`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-brand"
          >
            Voir sur Google Maps <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </>
  );
}
