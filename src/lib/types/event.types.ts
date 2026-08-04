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

/** Reflète la colonne `prix` de la base : gratuit, payant ou participation libre. */
export type PriceType = "gratuit" | "payant" | "donation";

export interface CotonouEvent {
  id: string;
  title: string;
  category: CategoryName;
  date: string;
  dateLabel: string;
  time: string;
  venue: string;
  quartier: string;
  /** Nature du prix, telle que stockée en base. */
  priceType: PriceType;
  /** Montant en FCFA quand `priceType` vaut "payant" ou "donation", sinon null. */
  amount: number | null;
  /**
   * Montant aplati en nombre (0 = gratuit).
   * Conservé pour le filtrage et le tri ; préférer `priceType` + `amount`
   * pour l'affichage, qui seuls distinguent une participation libre.
   */
  price: number;
  organizer: string;
  source: EventSource;
  /** Lien vers l'annonce d'origine (page Facebook, site de l'organisateur). */
  sourceUrl?: string;
  description: string;
  featured?: boolean;
  imageUrl?: string;
  /** Coordonnées du lieu quand la source les fournit. Voir la note de mapEvent. */
  latitude?: number;
  longitude?: number;
  /** Date d'insertion en base. Sert de `lastModified` au sitemap. */
  createdAt?: string;
  /** Fin de l'événement quand la source la fournit (`endDate` schema.org). */
  endDate?: string;
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
