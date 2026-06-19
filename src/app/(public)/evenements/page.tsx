import type { Metadata } from "next";
import { EventsBrowser } from "@/components/events/EventsBrowser";
import { getPublishedEvents } from "@/lib/supabase/events";

export const metadata: Metadata = {
  title: "Événements à Cotonou",
  description:
    "Tous les événements à venir à Cotonou : concerts, culture, sport, business, gastronomie.",
  alternates: { canonical: "/evenements" },
};

// SSR avec revalidation horaire.
export const revalidate = 3600;

export default async function EvenementsPage() {
  const events = await getPublishedEvents();
  return <EventsBrowser events={events} />;
}
