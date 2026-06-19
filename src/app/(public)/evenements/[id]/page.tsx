import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  ExternalLink,
} from "lucide-react";
import { getPublishedEvents, getEventById, getSimilarEvents } from "@/lib/supabase/events";
import { CATEGORIES } from "@/lib/constants/categories";
import { formatFullDate, toISODateTime } from "@/lib/utils/format-date";
import { CategoryBadge, PriceBadge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
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

const INFO_ICONS = { Calendar, Clock, MapPin, User };

export default async function EventDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  const cat = CATEGORIES[event.category];
  const similar = await getSimilarEvents(event);

  const infos = [
    {
      Icon: INFO_ICONS.Calendar,
      label: "Date",
      value: formatFullDate(event.date),
    },
    { Icon: INFO_ICONS.Clock, label: "Heure", value: event.time },
    {
      Icon: INFO_ICONS.MapPin,
      label: "Lieu",
      value: `${event.venue}, ${event.quartier}`,
    },
    { Icon: INFO_ICONS.User, label: "Organisateur", value: event.organizer },
  ];

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
      </div>

      <div className="mx-auto grid max-w-container items-start gap-10 px-5 pb-16 pt-8 lg:grid-cols-[1fr_320px]">
        <div className="max-w-[800px]">
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
                <info.Icon
                  className="h-5 w-5 flex-none text-brand"
                  aria-hidden
                />

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
                Voir sur Google Maps{" "}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            </div>
          </div>

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
