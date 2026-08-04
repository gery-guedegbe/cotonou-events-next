/**
 * Tronque sur une frontière de mot, avec points de suspension.
 *
 * `slice(0, n)` brut coupait au milieu des mots dans les balises meta et les
 * descriptions Open Graph, ce qui produisait des extraits du type
 * "Grand concert de musique tradition…" dans les résultats de recherche et
 * les aperçus de partage WhatsApp.
 */
export function truncateAtWord(input: string, max: number): string {
  const text = input.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;

  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  // Si aucun espace dans la fenêtre, on garde la coupe brute plutôt que de
  // renvoyer une chaîne vide (cas d'un mot unique très long).
  const base = lastSpace > max * 0.5 ? cut.slice(0, lastSpace) : cut;

  return `${base.replace(/[,;:.\s]+$/, "")}…`;
}
