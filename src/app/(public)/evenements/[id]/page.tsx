import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowLeft, ExternalLink } from "lucide-react";
import { getPublishedEvents, getEventById, getSimilarEvents } from "@/lib/supabase/events";
import {
  eventSchema,
  breadcrumbSchema,
  jsonLdString,
} from "@/lib/seo/schema";
import { truncateAtWord } from "@/lib/utils/text";
import { formatLocation } from "@/lib/utils/location";
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

  // Réponse d'abord : la description meta commence par les faits que
  // l'internaute cherche (quoi, quand, où, combien), pas par une reprise du
  // titre. C'est aussi ce que citent les moteurs génératifs.
  const facts = [
    `${event.dateLabel} à ${event.time}`,
    formatLocation(event.venue, event.quartier),
    event.priceType === "gratuit" ? "Entrée gratuite" : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const description = truncateAtWord(
    `${facts}. ${event.description}`,
    155,
  );

  return {
    title: event.title,
    description,
    alternates: { canonical: `/evenements/${event.id}` },
    openGraph: {
      title: event.title,
      description,
      url: `/evenements/${event.id}`,
      type: "article",
      locale: "fr_BJ",
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description,
    },
  };
}

export default async function EventDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  const similar = await getSimilarEvents(event);

  // Le fil d'ariane visuel existait sans son équivalent structuré : les
  // moteurs ne pouvaient pas reconstituer la hiérarchie du site.
  const jsonLd = [
    eventSchema(event),
    breadcrumbSchema([
      { name: "Accueil", path: "/" },
      { name: "Événements", path: "/evenements" },
      { name: event.title, path: `/evenements/${event.id}` },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <div className="mx-auto max-w-container px-5 pt-6">
        <nav
          className="flex flex-wrap items-center gap-2 text-sm text-gray-500"
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

          {/* Affiché seulement si la source existe : un lien mort vers "#"
              est pire que pas de lien du tout. */}
          {event.sourceUrl && (
            <a
              href={event.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand"
            >
              <ExternalLink className="h-[15px] w-[15px]" aria-hidden />
              Voir l&apos;annonce originale sur {event.source}
            </a>
          )}
        </div>

        <ShareCard title={event.title} />
      </div>

      {similar.length > 0 && (
        <div className="bg-gray-50 py-14">
          <div className="mx-auto max-w-container px-5">
            <h2 className="mb-6 text-2xl font-extrabold tracking-title text-gray-900">
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
