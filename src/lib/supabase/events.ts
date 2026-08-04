import { createClient } from "@/lib/supabase/client";
import type { CotonouEvent, EventSource } from "@/lib/types/event.types";
import {
  CATEGORY_SLUG_TO_NAME,
  CATEGORY_NAME_TO_SLUG,
} from "@/lib/constants/categories";
import {
  toBeninDateKey,
  formatShortDateLabel,
  formatTimeLabel,
  beninStartOfTodayISO,
} from "@/lib/utils/format-date";

export const EVENT_COLUMNS =
  "id,titre,description,date_debut,lieu_texte,quartier,categorie,prix,montant,organisateur_nom,source_type,image_url,url_source,latitude,longitude,created_at,date_fin";

export interface EventRow {
  id: string;
  titre: string;
  description: string | null;
  date_debut: string;
  lieu_texte: string | null;
  quartier: string | null;
  categorie: string;
  prix: "gratuit" | "payant" | "donation" | null;
  montant: number | null;
  organisateur_nom: string | null;
  source_type: "apify" | "formulaire" | null;
  image_url: string | null;
  url_source: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  date_fin: string | null;
}

export const SOURCE_LABEL: Record<
  NonNullable<EventRow["source_type"]>,
  EventSource
> = {
  apify: "Facebook",
  formulaire: "Formulaire",
};

export function mapEvent(row: EventRow): CotonouEvent {
  return {
    id: row.id,
    title: row.titre,
    category: CATEGORY_SLUG_TO_NAME[row.categorie] ?? "Autre",
    date: toBeninDateKey(row.date_debut),
    dateLabel: formatShortDateLabel(row.date_debut),
    time: formatTimeLabel(row.date_debut),
    venue: row.lieu_texte ?? "Lieu à confirmer",
    quartier: row.quartier ?? "Autre",
    priceType: row.prix ?? "gratuit",
    amount: row.prix === "gratuit" ? null : row.montant,
    price: row.prix === "gratuit" ? 0 : (row.montant ?? 0),
    sourceUrl: row.url_source ?? undefined,
    organizer: row.organisateur_nom ?? "Organisateur inconnu",
    source: row.source_type ? SOURCE_LABEL[row.source_type] : "Formulaire",
    description: row.description ?? "",
    imageUrl: row.image_url ?? undefined,
    // Apify renseigne ces coordonnées pour la majorité des événements, mais
    // elles retombent parfois sur le centroïde de Cotonou quand Facebook n'a
    // pas de localisation fine. Utilisables pour pointer un lieu, pas pour
    // prétendre à une précision au mètre.
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    createdAt: row.created_at,
    endDate: row.date_fin ?? undefined,
  };
}

/**
 * Événements publiés à venir, triés par date de début croissante.
 *
 * Le plancher de date est indispensable : sans lui, la liste remonte les
 * événements les plus anciens de la base en premier, donc des événements
 * déjà passés dès que le catalogue vieillit.
 */
export async function getPublishedEvents(): Promise<CotonouEvent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_COLUMNS)
    .eq("statut", "publie")
    .gte("date_debut", beninStartOfTodayISO())
    .order("date_debut", { ascending: true });

  if (error) {
    console.error("getPublishedEvents:", error.message);
    return [];
  }
  return (data as EventRow[]).map(mapEvent);
}

/** Un événement publié par id, ou undefined si introuvable / non publié. */
export async function getEventById(
  id: string,
): Promise<CotonouEvent | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_COLUMNS)
    .eq("id", id)
    .eq("statut", "publie")
    .maybeSingle();

  if (error || !data) return undefined;
  return mapEvent(data as EventRow);
}

/** Événements publiés de la même catégorie, hors l'événement courant. */
export async function getSimilarEvents(
  event: CotonouEvent,
  limit = 3,
): Promise<CotonouEvent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_COLUMNS)
    .eq("statut", "publie")
    .eq("categorie", CATEGORY_NAME_TO_SLUG[event.category])
    .neq("id", event.id)
    .gte("date_debut", beninStartOfTodayISO())
    .order("date_debut", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("getSimilarEvents:", error.message);
    return [];
  }
  return (data as EventRow[]).map(mapEvent);
}
