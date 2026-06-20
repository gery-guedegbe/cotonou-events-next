import { createServiceClient } from "@/lib/supabase/service";
import { SOURCE_LABEL, EVENT_COLUMNS, mapEvent, type EventRow } from "@/lib/supabase/events";
import { CATEGORY_SLUG_TO_NAME } from "@/lib/constants/categories";
import { maskPhone } from "@/lib/utils/format-phone";
import {
  formatShortDateLabel,
  formatTimeLabel,
  formatAdminDate,
  formatRelativeTime,
  toBeninDateKey,
} from "@/lib/utils/format-date";
import type { CategoryName, CotonouEvent, EventSource } from "@/lib/types/event.types";
import type { Subscriber } from "@/lib/types/subscriber.types";

export type EventStatut = "en_attente" | "publie" | "rejete";

export interface AdminPendingEvent {
  id: string;
  title: string;
  category: CategoryName;
  source: EventSource;
  date: string;
  lieu: string;
  organizer: string;
  contact: string;
  submitted: string;
}

export interface RecentSubmission {
  title: string;
  when: string;
  status: "En attente" | "Publié" | "Rejeté";
}

const STATUT_LABEL: Record<EventStatut, RecentSubmission["status"]> = {
  en_attente: "En attente",
  publie: "Publié",
  rejete: "Rejeté",
};

interface AdminEventRow {
  id: string;
  titre: string;
  categorie: string;
  source_type: "apify" | "formulaire" | null;
  date_debut: string;
  lieu_texte: string | null;
  organisateur_nom: string | null;
  organisateur_contact: string | null;
  statut: EventStatut;
  created_at: string;
}

/** Événements en attente de validation (service_role : RLS bloque l'anon). */
export async function getAdminPendingEvents(): Promise<AdminPendingEvent[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("events")
    .select(
      "id,titre,categorie,source_type,date_debut,lieu_texte,organisateur_nom,organisateur_contact,statut,created_at",
    )
    .eq("statut", "en_attente")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAdminPendingEvents:", error.message);
    return [];
  }

  return (data as AdminEventRow[]).map((row) => ({
    id: row.id,
    title: row.titre,
    category: CATEGORY_SLUG_TO_NAME[row.categorie] ?? "Autre",
    source: row.source_type ? SOURCE_LABEL[row.source_type] : "Formulaire",
    date: `${formatShortDateLabel(row.date_debut)} · ${formatTimeLabel(row.date_debut)}`,
    lieu: row.lieu_texte ?? "Lieu à confirmer",
    organizer: row.organisateur_nom ?? "Organisateur inconnu",
    contact: row.organisateur_contact ?? "—",
    submitted: formatRelativeTime(row.created_at),
  }));
}

/** Dernières soumissions (tous statuts), pour la vue d'ensemble. */
export async function getRecentSubmissions(
  limit = 5,
): Promise<RecentSubmission[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("events")
    .select("titre,statut,created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRecentSubmissions:", error.message);
    return [];
  }

  return (data as Pick<AdminEventRow, "titre" | "statut" | "created_at">[]).map(
    (row) => ({
      title: row.titre,
      when: formatRelativeTime(row.created_at),
      status: STATUT_LABEL[row.statut] ?? "En attente",
    }),
  );
}

interface SubscriberRow {
  id: string;
  telephone: string;
  prenom: string | null;
  categories: string[] | null;
  actif: boolean;
  opt_in_at: string;
}

const ALL_CATEGORY_SLUGS = Object.keys(CATEGORY_SLUG_TO_NAME);

function categoriesLabel(slugs: string[] | null): string[] {
  if (!slugs || slugs.length === 0) return [];
  if (ALL_CATEGORY_SLUGS.every((s) => slugs.includes(s)))
    return ["Tout recevoir"];
  return slugs.map((s) => CATEGORY_SLUG_TO_NAME[s] ?? s);
}

/** Cumul du nombre d'abonnés inscrits par jour sur les 30 derniers jours. */
function computeSubscriberTrend(rows: SubscriberRow[]): number[] {
  const days = 30;
  const today = new Date();
  const counts: number[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const key = toBeninDateKey(day.toISOString());
    const cumulative = rows.filter(
      (r) => toBeninDateKey(r.opt_in_at) <= key,
    ).length;
    counts.push(cumulative);
  }

  return counts;
}

/** Abonnés WhatsApp + tendance d'inscription (service_role : aucune policy anon sur subscribers). */
export async function getAdminSubscribersData(): Promise<{
  subscribers: Subscriber[];
  trend: number[];
}> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("subscribers")
    .select("id,telephone,prenom,categories,actif,opt_in_at")
    .order("opt_in_at", { ascending: false });

  if (error) {
    console.error("getAdminSubscribersData:", error.message);
    return { subscribers: [], trend: [] };
  }

  const rows = data as SubscriberRow[];

  const subscribers: Subscriber[] = rows.map((row) => ({
    id: row.id,
    prenom: row.prenom ?? "—",
    phone: maskPhone(row.telephone),
    categories: categoriesLabel(row.categories),
    date: formatAdminDate(row.opt_in_at),
    active: row.actif,
  }));

  return { subscribers, trend: computeSubscriberTrend(rows) };
}

export interface AdminEventListItem extends CotonouEvent {
  statut: EventStatut;
}

/** Tous les événements, quel que soit leur statut (service_role : RLS limite l'anon aux publiés). */
export async function getAllAdminEvents(): Promise<AdminEventListItem[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("events")
    .select(`${EVENT_COLUMNS},statut`)
    .order("date_debut", { ascending: false });

  if (error) {
    console.error("getAllAdminEvents:", error.message);
    return [];
  }

  return (data as (EventRow & { statut: EventStatut })[]).map((row) => ({
    ...mapEvent(row),
    statut: row.statut,
  }));
}

export interface AdminEventDetail extends CotonouEvent {
  statut: EventStatut;
  contactPhone: string;
  contactEmail: string | null;
  contactFb: string | null;
}

/** Détail complet d'un événement (n'importe quel statut), pour la prévisualisation admin. */
export async function getAdminEventById(id: string): Promise<AdminEventDetail | undefined> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("events")
    .select(`${EVENT_COLUMNS},statut,organisateur_contact,organisateur_email,organisateur_contact_fb`)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return undefined;

  const row = data as EventRow & {
    statut: EventStatut;
    organisateur_contact: string | null;
    organisateur_email: string | null;
    organisateur_contact_fb: string | null;
  };

  return {
    ...mapEvent(row),
    statut: row.statut,
    contactPhone: row.organisateur_contact ?? "—",
    contactEmail: row.organisateur_email,
    contactFb: row.organisateur_contact_fb,
  };
}
