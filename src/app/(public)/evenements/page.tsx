import type { Metadata } from "next";
import { EventsBrowser } from "@/components/events/EventsBrowser";
import { getPublishedEvents } from "@/lib/supabase/events";
import {
  eventListSchema,
  breadcrumbSchema,
  jsonLdString,
} from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Événements à Cotonou",
  description:
    "Tous les événements à venir à Cotonou : concerts, culture, sport, business, gastronomie. Mis à jour deux fois par semaine, consultable sans inscription.",
  alternates: { canonical: "/evenements" },
  openGraph: {
    title: "Événements à Cotonou",
    description:
      "Tous les événements à venir à Cotonou, mis à jour deux fois par semaine.",
    url: "/evenements",
    locale: "fr_BJ",
  },
};

// SSR avec revalidation horaire.
export const revalidate = 3600;

export default async function EvenementsPage() {
  const events = await getPublishedEvents();

  // ItemList : donne aux moteurs la liste ordonnée des événements du
  // catalogue, que le rendu client seul ne leur permettait pas de constituer.
  const jsonLd = [
    eventListSchema(events),
    breadcrumbSchema([
      { name: "Accueil", path: "/" },
      { name: "Événements", path: "/evenements" },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <EventsBrowser events={events} />
    </>
  );
}
