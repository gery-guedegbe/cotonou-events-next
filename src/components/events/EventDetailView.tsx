import { Calendar, Clock, MapPin, User, ExternalLink } from "lucide-react";
import type { CotonouEvent } from "@/lib/types/event.types";
import { formatFullDate } from "@/lib/utils/format-date";
import { formatArea, formatLocation } from "@/lib/utils/location";
import { CategoryBadge, PriceBadge } from "@/components/ui/Badge";
import { EventImage } from "@/components/events/EventImage";

/** Image d'illustration de l'événement (affiche réelle ou gradient + icône de catégorie). */
export function EventHeroImage({ event }: { event: CotonouEvent }) {
  return (
    <div className="relative h-[220px] overflow-hidden rounded-[18px] md:h-[320px]">
      <EventImage
        imageUrl={event.imageUrl}
        category={event.category}
        title={event.title}
        variant="hero"
        priority
      />
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
    {
      Icon: MapPin,
      label: "Lieu",
      value: formatLocation(event.venue, event.quartier),
    },
    { Icon: User, label: "Organisateur", value: event.organizer },
  ];

  // Coordonnées exactes si la source les fournit, recherche textuelle sinon.
  const hasCoords =
    typeof event.latitude === "number" && typeof event.longitude === "number";
  const mapsUrl = hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${event.venue}, ${formatArea(event.quartier)}`,
      )}`;

  return (
    <>
      <div className="flex gap-2">
        <CategoryBadge category={event.category} />
        <PriceBadge priceType={event.priceType} amount={event.amount} />
      </div>

      <h1 className="mt-4 text-3xl font-extrabold tracking-display text-gray-900 md:text-4xl">
        {event.title}
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {infos.map((info) => (
          <div key={info.label} className="flex items-start gap-3">
            <info.Icon className="h-5 w-5 flex-none text-brand" aria-hidden />

            <div>
              <div className="text-xs text-gray-500">{info.label}</div>

              <div className="text-sm font-semibold text-gray-900">
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

      <p className="text-base leading-relaxed text-gray-700">
        {event.description}
      </p>

      <h2 className="mb-3 mt-8 text-lg font-bold text-gray-900">Lieu</h2>

      {/* Pas de carte décorative ici. L'ancienne version affichait une grille
          grise avec une épingle systématiquement centrée : 180px d'écran qui
          imitaient une carte sans jamais montrer le lieu réel. Le lien Maps
          pointe sur les coordonnées exactes quand la source les fournit, et
          retombe sur une recherche textuelle sinon. */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 p-5">
        <div className="flex min-w-0 items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 flex-none text-brand" aria-hidden />

          <div className="min-w-0">
            <div className="font-semibold text-gray-900">{event.venue}</div>

            <div className="mt-0.5 text-sm text-gray-600">
              {formatArea(event.quartier)}
            </div>
          </div>
        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 flex-none items-center gap-2 rounded-pill border-[1.5px] border-gray-200 px-5 text-sm font-semibold text-gray-700 transition-colors hover:border-brand hover:text-brand"
        >
          Ouvrir dans Maps
          <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </>
  );
}
