import type { CotonouEvent } from "@/lib/types/event.types";
import { toISODateTime } from "@/lib/utils/format-date";

export const SITE_URL = "https://cotonouevents.tech";
export const SITE_NAME = "cotonouevents";

/**
 * Constructeurs de JSON-LD. Regroupés ici plutôt qu'inlinés dans les pages :
 * les mêmes entités (organisation, fil d'ariane) sont référencées depuis
 * plusieurs routes, et une divergence entre deux copies casse silencieusement
 * le graphe que lisent Google et les moteurs génératifs.
 */

/** Identité émettrice, référencée par `publisher` / `organizer` ailleurs. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Agenda des événements de Cotonou, au Bénin, avec une alerte WhatsApp hebdomadaire envoyée chaque vendredi à 18h.",
    areaServed: {
      "@type": "City",
      name: "Cotonou",
      containedInPlace: { "@type": "Country", name: "Bénin" },
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "fr-BJ",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: step.name,
      item: `${SITE_URL}${step.path}`,
    })),
  };
}

/** Liste ordonnée des événements d'une page de catalogue. */
export function eventListSchema(events: CotonouEvent[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Événements à venir à Cotonou",
    numberOfItems: events.length,
    itemListElement: events.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/evenements/${event.id}`,
      name: event.title,
    })),
  };
}

export function eventSchema(event: CotonouEvent) {
  const hasCoords =
    typeof event.latitude === "number" && typeof event.longitude === "number";

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    url: `${SITE_URL}/evenements/${event.id}`,
    startDate: toISODateTime(event.date, event.time),
    // `endDate` n'est renseigné que si la source le fournit : inventer une
    // durée serait une donnée fausse déclarée comme structurée.
    ...(event.endDate ? { endDate: event.endDate } : {}),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    description: event.description,
    ...(event.imageUrl ? { image: [event.imageUrl] } : {}),
    location: {
      "@type": "Place",
      name: event.venue,
      address: {
        "@type": "PostalAddress",
        // Le quartier est une subdivision de Cotonou, pas une région. Il
        // occupait auparavant `addressLocality` avec "Cotonou" en
        // `addressRegion`, ce qui décrivait une ville nommée d'après le
        // quartier dans une région nommée Cotonou — géographie inexistante.
        streetAddress: event.venue,
        addressLocality: "Cotonou",
        addressRegion: "Littoral",
        addressCountry: "BJ",
      },
      ...(hasCoords
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: event.latitude,
              longitude: event.longitude,
            },
          }
        : {}),
    },
    organizer: {
      "@type": "Organization",
      name: event.organizer,
      ...(event.sourceUrl ? { url: event.sourceUrl } : {}),
    },
    offers: {
      "@type": "Offer",
      // Un événement gratuit doit déclarer 0, pas l'absence de prix.
      price: event.priceType === "gratuit" ? 0 : (event.amount ?? 0),
      priceCurrency: "XOF",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/evenements/${event.id}`,
      ...(event.createdAt ? { validFrom: event.createdAt } : {}),
    },
    isAccessibleForFree: event.priceType === "gratuit",
  };
}

/** Sérialise un ou plusieurs schémas pour un unique bloc `<script>`. */
export function jsonLdString(schema: object | object[]): string {
  return JSON.stringify(schema);
}
