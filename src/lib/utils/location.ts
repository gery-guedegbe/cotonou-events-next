/**
 * "Autre" est la valeur de repli du quartier quand la source ne le donne pas.
 * C'est une étiquette interne, pas une information : affichée telle quelle,
 * elle produisait "Erevan Plage, Autre" dans les cartes, les fiches et les
 * balises meta. On l'omet plutôt que de la montrer.
 */
const UNKNOWN_QUARTIER = "Autre";

export function hasKnownQuartier(quartier: string | undefined): boolean {
  return !!quartier && quartier !== UNKNOWN_QUARTIER;
}

/** "Lieu, Quartier" quand le quartier est connu, sinon le lieu seul. */
export function formatLocation(
  venue: string,
  quartier: string | undefined,
  separator = ", ",
): string {
  return hasKnownQuartier(quartier) ? `${venue}${separator}${quartier}` : venue;
}

/** Zone administrative affichée sous le nom du lieu, sur la fiche détail. */
export function formatArea(quartier: string | undefined): string {
  return hasKnownQuartier(quartier)
    ? `${quartier}, Cotonou, Bénin`
    : "Cotonou, Bénin";
}
