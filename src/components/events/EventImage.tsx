"use client";

import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import { CATEGORIES } from "@/lib/constants/categories";
import type { CategoryName } from "@/lib/types/event.types";
import { Icon } from "@/components/ui/Icon";
import {
  isDisplayableImageUrl,
  isOptimizableImageUrl,
} from "@/lib/utils/image-url";

/**
 * Réglages visuels par contexte d'affichage. Les valeurs reprennent à
 * l'identique celles qui existaient dans EventCard et EventDetailView.
 */
const VARIANTS = {
  card: {
    stripes:
      "repeating-linear-gradient(135deg, rgba(255,255,255,0.14) 0 2px, transparent 2px 11px)",
    icon: "absolute bottom-3 right-3.5 h-[46px] w-[46px] text-white/[0.78]",
    strokeWidth: 1.5,
  },
  hero: {
    stripes:
      "repeating-linear-gradient(135deg, rgba(255,255,255,0.12) 0 2px, transparent 2px 13px)",
    icon: "absolute bottom-6 right-[30px] h-20 w-20 text-white/70",
    strokeWidth: 1.25,
  },
} as const;

interface EventImageProps {
  imageUrl?: string;
  category: CategoryName;
  /** Sert à composer le texte alternatif de l'affiche. */
  title: string;
  variant: keyof typeof VARIANTS;
  /** Priorise le chargement (image au-dessus de la ligne de flottaison). */
  priority?: boolean;
}

/**
 * Largeurs candidates transmises au navigateur. La carte occupe un tiers de
 * la grille en desktop et toute la largeur en mobile ; le hero est plus large
 * mais plafonne au conteneur.
 */
const SIZES = {
  card: "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw",
  hero: "(min-width: 768px) 800px, 100vw",
} as const;

/**
 * Affiche l'affiche réelle de l'événement, avec repli sur un dégradé de
 * catégorie. Le repli couvre deux cas distincts :
 *   1. URL absente ou structurellement invalide, écartée au rendu
 *   2. URL valide mais image qui échoue à charger (lien Facebook expiré,
 *      hôte injoignable, fichier supprimé) — capté par onError
 *
 * Sans le second cas, une URL morte produit l'icône d'image brisée du
 * navigateur, ce qui est plus dégradé visuellement que pas d'image du tout.
 */
export function EventImage({
  imageUrl,
  category,
  title,
  variant,
  priority = false,
}: EventImageProps) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Le balisage étant rendu côté serveur, une image peut échouer avant que
  // React n'ait hydraté : l'évènement error est alors émis sans handler et
  // perdu, laissant l'icône d'image brisée à l'écran. On rattrape ce cas au
  // montage. Une image chargée avec succès a un naturalWidth non nul ; une
  // image terminée (complete) avec naturalWidth à 0 a forcément échoué.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  const cat = CATEGORIES[category];
  const style = VARIANTS[variant];
  const showImage = isDisplayableImageUrl(imageUrl) && !failed;

  if (showImage) {
    const alt = `Affiche de l'événement ${title}`;

    // Affiche uploadée via le formulaire : optimisée par Next (AVIF/WebP,
    // srcset). Sans cela, une affiche de 5 Mo partait telle quelle vers
    // chaque visiteur, y compris en 3G.
    if (isOptimizableImageUrl(imageUrl)) {
      return (
        <NextImage
          src={imageUrl}
          alt={alt}
          fill
          sizes={SIZES[variant]}
          className="object-cover"
          priority={priority}
          onError={() => setFailed(true)}
        />
      );
    }

    // Affiche distante (Facebook) : URL susceptible d'expirer, on garde le
    // rendu brut et son repli au chargement.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={imgRef}
        src={imageUrl}
        alt={alt}
        className="h-full w-full object-cover"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      className="absolute inset-0"
      style={{ background: `linear-gradient(135deg, ${cat.g1}, ${cat.g2})` }}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{ backgroundImage: style.stripes }}
      />

      <Icon
        name={cat.icon}
        className={style.icon}
        strokeWidth={style.strokeWidth}
        aria-hidden
      />
    </div>
  );
}
