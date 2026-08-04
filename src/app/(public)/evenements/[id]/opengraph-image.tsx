import { ImageResponse } from "next/og";
import { getEventById } from "@/lib/supabase/events";
import { CATEGORIES } from "@/lib/constants/categories";
import { formatEventPrice } from "@/lib/utils/format-date";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Aperçu de l'événement sur Cotonou.events";

/**
 * Aperçu de partage propre à chaque événement. Le produit se diffuse d'abord
 * par WhatsApp : un lien partagé sans vignette dédiée n'affichait que le logo
 * générique du site, sans dire de quel événement il s'agissait.
 */
export default async function EventOgImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "white",
            fontSize: 64,
            fontWeight: 800,
            color: "#111827",
            fontFamily: "sans-serif",
          }}
        >
          cotonou<span style={{ color: "#16A34A" }}>.events</span>
        </div>
      ),
      { ...size },
    );
  }

  const cat = CATEGORIES[event.category];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "white",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Couple bg/text du badge, pas la couleur de départ du dégradé :
              celle-ci est claire et laissait un texte blanc illisible. */}
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "10px 24px",
              borderRadius: 100,
              background: cat.bg,
              color: cat.text,
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            {event.category}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontSize: event.title.length > 60 ? 54 : 68,
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {event.title.length > 90
              ? `${event.title.slice(0, 90)}…`
              : event.title}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 32,
              color: "#6B7280",
            }}
          >
            {event.dateLabel} · {event.time} · {event.venue}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid #E5E7EB",
            paddingTop: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 34,
              fontWeight: 800,
              color: "#111827",
            }}
          >
            cotonou<span style={{ color: "#16A34A" }}>.events</span>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 700,
              color: "#16A34A",
            }}
          >
            {formatEventPrice(event.priceType, event.amount)}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
