export interface Subscriber {
  id: string;
  prenom: string;
  /** Numéro masqué pour affichage, e.g. "+229 61 •• •• 12" */
  phone: string;
  categories: string[];
  /** Date d'inscription formatée */
  date: string;
  active: boolean;
}
