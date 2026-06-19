"use server";

import {
  CATEGORY_NAME_TO_SLUG,
  CATEGORY_SLUG_TO_NAME,
} from "@/lib/constants/categories";
import { toWhatsAppNumber, isValidBeninPhone } from "@/lib/utils/format-phone";
import { createServiceClient } from "@/lib/supabase/service";
import type { CategoryName } from "@/lib/types/event.types";

type ActionResult = { ok: true } | { ok: false; error: string };

interface SubscribeInput {
  prenom: string;
  phone: string;
  categories: string[];
}

const ALL_SLUGS = Object.keys(CATEGORY_SLUG_TO_NAME);

/** Inscrit ou met à jour un abonné WhatsApp (upsert sur le numéro). */
export async function subscribeToAlerts(
  input: SubscribeInput,
): Promise<ActionResult> {
  const prenom = input.prenom.trim();
  if (prenom.length < 2)
    return { ok: false, error: "Votre prénom est requis." };

  if (!isValidBeninPhone(input.phone))
    return { ok: false, error: "Numéro béninois invalide." };
  const telephone = toWhatsAppNumber(input.phone);

  // Formulaire rapide (sans sélection) ou "Tout recevoir" -> toutes les catégories.
  const wantsAll =
    input.categories.length === 0 || input.categories.includes("Tout recevoir");
  const categories = wantsAll
    ? ALL_SLUGS
    : input.categories
        .map((c) => CATEGORY_NAME_TO_SLUG[c as CategoryName])
        .filter(Boolean);

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("subscribers")
    .upsert(
      { telephone, prenom, categories, actif: true },
      { onConflict: "telephone" },
    );

  if (error) {
    console.error("subscribeToAlerts:", error.message);
    return { ok: false, error: "Erreur lors de l'inscription. Réessayez." };
  }

  return { ok: true };
}
