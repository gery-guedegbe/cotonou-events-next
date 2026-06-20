import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowLeft, ExternalLink } from "lucide-react";
import { getPublishedEvents, getEventById, getSimilarEvents } from "@/lib/supabase/events";
import { toISODateTime } from "@/lib/utils/format-date";
import { EventDetailView, EventHeroImage } from "@/components/events/EventDetailView";
import { EventCard } from "@/components/events/EventCard";
import { ShareCard } from "@/components/events/ShareCard";

type Params = Promise<{ id: string }>;

// Pré-génère les pages des événements (en prod : les 20 plus populaires).
export async function generateStaticParams() {
  const events = await getPublishedEvents();
  return events.map((e) => ({ id: e.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) return { title: "Événement introuvable" };
  return {
    title: event.title,
    description: event.description.slice(0, 155),
    alternates: { canonical: `/evenements/${event.id}` },
    openGraph: {
      title: event.title,
      description: event.description.slice(0, 155),
      url: `/evenements/${event.id}`,
      type: "article",
    },
  };
}

export default async function EventDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  const similar = await getSimilarEvents(event);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: toISODateTime(event.date, event.time),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.quartier,
        addressRegion: "Cotonou",
        addressCountry: "BJ",
      },
    },
    description: event.description,
    organizer: { "@type": "Organization", name: event.organizer },
    offers: {
      "@type": "Offer",
      price: event.price,
      priceCurrency: "XOF",
      availability: "https://schema.org/InStock",
      url: `https://cotonou.events/evenements/${event.id}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-container px-5 pt-6">
        <nav
          className="flex flex-wrap items-center gap-2 text-[13px] text-gray-400"
          aria-label="Fil d'ariane"
        >
          <Link href="/" className="hover:text-brand">
            Accueil
          </Link>

          <ChevronRight className="h-3.5 w-3.5" aria-hidden />

          <Link href="/evenements" className="hover:text-brand">
            Événements
          </Link>

          <ChevronRight className="h-3.5 w-3.5" aria-hidden />

          <span className="font-semibold text-gray-700">
            {event.title.length > 32
              ? `${event.title.slice(0, 32)}…`
              : event.title}
          </span>
        </nav>

        <Link
          href="/evenements"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Retour aux événements
        </Link>
      </div>

      <div className="mx-auto mt-4 max-w-container px-5">
        <EventHeroImage event={event} />
      </div>

      <div className="mx-auto grid max-w-container items-start gap-10 px-5 pb-16 pt-8 lg:grid-cols-[1fr_320px]">
        <div className="max-w-[800px]">
          <EventDetailView event={event} />

          <a
            href="#"
            className="mt-[22px] inline-flex items-center gap-1.5 text-[13.5px] text-gray-500 hover:text-brand"
          >
            <ExternalLink className="h-[15px] w-[15px]" aria-hidden />
            Voir l&apos;annonce originale sur {event.source}
          </a>
        </div>

        <ShareCard title={event.title} />
      </div>

      {similar.length > 0 && (
        <div className="bg-gray-50 py-14">
          <div className="mx-auto max-w-container px-5">
            <h2 className="mb-6 text-[22px] font-extrabold tracking-[-0.02em] text-gray-900">
              Événements similaires
            </h2>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
