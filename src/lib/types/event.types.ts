export type CategoryName =
  | "Concert"
  | "Culture"
  | "Sport"
  | "Business"
  | "Formation"
  | "Gastronomie"
  | "Religieux"
  | "Vie nocturne"
  | "Mode & Beauté"
  | "Famille"
  | "Communautaire"
  | "Autre";

export type EventSource = "Facebook" | "Formulaire" | "Apify";

export interface CotonouEvent {
  id: string;
  title: string;
  category: CategoryName;
  date: string;
  dateLabel: string;
  time: string;
  venue: string;
  quartier: string;
  price: number;
  organizer: string;
  source: EventSource;
  description: string;
  featured?: boolean;
  imageUrl?: string;
}

export interface CategoryMeta {
  /** Couleur de fond du badge */
  bg: string;
  /** Couleur du texte du badge */
  text: string;
  /** Dégradé de fallback (départ) */
  g1: string;
  /** Dégradé de fallback (fin) */
  g2: string;
  /** Nom de l'icône lucide-react (kebab-case) */
  icon: string;
}
