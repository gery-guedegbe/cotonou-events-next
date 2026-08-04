/**
 * Valide qu'une URL d'image vaut la peine d'être rendue dans un <img>.
 *
 * Les données scrapées via Apify contiennent des valeurs bruitées (chaîne vide,
 * espaces seuls, littéraux "null"/"undefined" sérialisés) qui passent un simple
 * test de véracité et produisent alors une icône d'image brisée à l'écran.
 * Cette fonction est volontairement pure et synchrone : elle filtre ce qui ne
 * peut structurellement pas être une image. Une URL bien formée mais morte
 * (lien fbcdn expiré) ne se détecte qu'au chargement, côté client.
 */
/**
 * Vrai si l'image est hébergée par le Storage Supabase du projet, donc
 * éligible à l'optimiseur de Next (redimensionnement, AVIF/WebP, srcset).
 *
 * Les affiches Facebook en sont volontairement exclues : leurs hôtes varient
 * (scontent-*.fbcdn.net) et leurs URL expirent. Passées à l'optimiseur, une
 * URL morte devient une erreur de rendu, alors qu'en <img> brut elle retombe
 * proprement sur le dégradé de catégorie via onError.
 */
export function isOptimizableImageUrl(url: string): boolean {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return false;

  try {
    return new URL(url).hostname === new URL(base).hostname;
  } catch {
    return false;
  }
}

export function isDisplayableImageUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;

  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed === "null" || trimmed === "undefined") return false;

  try {
    const { protocol } = new URL(trimmed);
    return protocol === "https:" || protocol === "http:";
  } catch {
    // Chemin relatif servi par le site lui-même (ex. /images/x.jpg).
    return trimmed.startsWith("/");
  }
}
