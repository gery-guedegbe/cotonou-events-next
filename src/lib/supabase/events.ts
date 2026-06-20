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
} from "@/lib/utils/format-date";

export const EVENT_COLUMNS =
  "id,titre,description,date_debut,lieu_texte,quartier,categorie,prix,montant,organisateur_nom,source_type,image_url";

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
    price: row.prix === "gratuit" ? 0 : (row.montant ?? 0),
    organizer: row.organisateur_nom ?? "Organisateur inconnu",
    source: row.source_type ? SOURCE_LABEL[row.source_type] : "Formulaire",
    description: row.description ?? "",
    imageUrl: row.image_url ?? undefined,
  };
}

/** Tous les événements publiés, triés par date de début croissante. */
export async function getPublishedEvents(): Promise<CotonouEvent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_COLUMNS)
    .eq("statut", "publie")
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
    .order("date_debut", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("getSimilarEvents:", error.message);
    return [];
  }
  return (data as EventRow[]).map(mapEvent);
}
