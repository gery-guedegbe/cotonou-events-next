import type { CategoryName, EventSource } from "@/lib/types/event.types";
import type { Subscriber } from "@/lib/types/subscriber.types";

export interface PendingEvent {
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

export const PENDING_EVENTS: PendingEvent[] = [
  {
    id: "p1",
    title: "Festival des Arts de la Rue",
    category: "Culture",
    source: "Formulaire",
    date: "Sam 7 juin · 16h",
    lieu: "Place Lénine, Centre-ville",
    organizer: "Collectif Urbain",
    contact: "+229 61 22 33 44",
    submitted: "il y a 3h",
  },
  {
    id: "p2",
    title: "Match de gala — Anciens Écureuils",
    category: "Sport",
    source: "Formulaire",
    date: "Dim 8 juin · 16h",
    lieu: "Stade de l'Amitié",
    organizer: "Asso Sport+",
    contact: "+229 97 88 11 22",
    submitted: "il y a 6h",
  },
  {
    id: "p3",
    title: "Conférence Femmes & Tech",
    category: "Business",
    source: "Apify",
    date: "Jeu 12 juin · 09h",
    lieu: "Azalaï Hôtel",
    organizer: "WTech Bénin",
    contact: "contact@wtech.bj",
    submitted: "il y a 1j",
  },
];

export interface RecentSubmission {
  title: string;
  when: string;
  status: "En attente" | "Publié" | "Rejeté";
}

export const RECENT_SUBMISSIONS: RecentSubmission[] = [
  {
    title: "Festival des Arts de la Rue",
    when: "il y a 3h",
    status: "En attente",
  },
  { title: "Afro Nuit Live", when: "il y a 5h", status: "Publié" },
  {
    title: "Match de gala — Anciens Écureuils",
    when: "il y a 6h",
    status: "En attente",
  },
  { title: "Brunch Jazz du dimanche", when: "il y a 1j", status: "Publié" },
  { title: "Soirée karaoké", when: "il y a 1j", status: "Rejeté" },
];

export const SUBSCRIBERS: Subscriber[] = [
  {
    id: "s1",
    phone: "+229 61 •• •• 12",
    prenom: "Koffi",
    categories: ["Concert", "Sport"],
    date: "2 mai 2025",
    active: true,
  },
  {
    id: "s2",
    phone: "+229 97 •• •• 88",
    prenom: "Aïcha",
    categories: ["Tout recevoir"],
    date: "29 avr. 2025",
    active: true,
  },
  {
    id: "s3",
    phone: "+229 66 •• •• 45",
    prenom: "Bénédicta",
    categories: ["Culture", "Gastronomie"],
    date: "26 avr. 2025",
    active: true,
  },
  {
    id: "s4",
    phone: "+229 90 •• •• 03",
    prenom: "Rodrigue",
    categories: ["Business", "Formation"],
    date: "21 avr. 2025",
    active: false,
  },
  {
    id: "s5",
    phone: "+229 62 •• •• 77",
    prenom: "Fatima",
    categories: ["Concert"],
    date: "18 avr. 2025",
    active: true,
  },
  {
    id: "s6",
    phone: "+229 95 •• •• 31",
    prenom: "Serge",
    categories: ["Sport", "Concert"],
    date: "14 avr. 2025",
    active: true,
  },
  {
    id: "s7",
    phone: "+229 67 •• •• 59",
    prenom: "Mariam",
    categories: ["Gastronomie"],
    date: "9 avr. 2025",
    active: false,
  },
  {
    id: "s8",
    phone: "+229 91 •• •• 20",
    prenom: "Donald",
    categories: ["Tout recevoir"],
    date: "3 avr. 2025",
    active: true,
  },
];

export const SYSTEM_LOGS = [
  "[06:00:01] apify.run started — actor cotonou-events-scraper",
  "[06:00:14] fetched 38 listings from facebook events",
  "[06:00:22] dedupe: 4 duplicates skipped",
  "[06:00:23] inserted 12 new events (status=pending)",
  "[06:00:24] apify.run finished ✓ (23.4s)",
  "[12:00:00] cron: digest-preview generated for 127 subscribers",
  "[12:00:01] segmentation: 7 categories matched",
  "[18:00:00] whatsapp.send queued — 127 messages",
  "[18:02:11] whatsapp.send delivered 124 / failed 3",
  "[18:02:12] retry scheduled for 3 failed deliveries",
];

/** Points du graphique abonnés (30 jours). */
export const SUBSCRIBER_TREND = [
  44, 46, 48, 47, 52, 55, 54, 58, 61, 63, 67, 66, 70, 74, 78, 80, 83, 82, 86,
  90, 93, 97, 100, 104, 108, 110, 114, 119, 123, 127,
];
