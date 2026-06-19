"use server";

import { randomUUID } from "crypto";
import {
  eventStep1Schema,
  eventStep2Schema,
  eventStep3Schema,
} from "@/lib/validations/event.schema";
import { CATEGORY_NAME_TO_SLUG } from "@/lib/constants/categories";
import type { CategoryName } from "@/lib/types/event.types";
import { toISODateTime } from "@/lib/utils/format-date";
import { createServiceClient } from "@/lib/supabase/service";

const serverEventSchema = eventStep1Schema
  .merge(eventStep2Schema)
  .merge(eventStep3Schema.omit({ consent1: true, consent2: true }));

type ActionResult = { ok: true } | { ok: false; error: string };

function field(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

/** Valide, uploade l'affiche (si présente) et insère l'événement soumis par un organisateur. */
export async function submitEvent(formData: FormData): Promise<ActionResult> {
  const raw = {
    title: field(formData, "title"),
    category: field(formData, "category"),
    description: field(formData, "description"),
    priceType: field(formData, "priceType"),
    amount: field(formData, "amount") || undefined,
    link: field(formData, "link") || undefined,
    dateStart: field(formData, "dateStart"),
    timeStart: field(formData, "timeStart"),
    dateEnd: field(formData, "dateEnd") || undefined,
    timeEnd: field(formData, "timeEnd") || undefined,
    address: field(formData, "address"),
    quartier: field(formData, "quartier"),
    org: field(formData, "org"),
    phone: field(formData, "phone"),
    email: field(formData, "email") || undefined,
    orgFb: field(formData, "orgFb") || undefined,
  };

  const parsed = serverEventSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Formulaire invalide.",
    };
  }
  const v = parsed.data;

  const supabase = createServiceClient();

  let imageUrl: string | null = null;
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    const ext = imageFile.name.split(".").pop() || "jpg";
    const path = `${randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("event-images")
      .upload(path, imageFile, { contentType: imageFile.type });
    if (uploadError) {
      console.error("submitEvent upload:", uploadError.message);
      return { ok: false, error: "Échec de l'upload de l'image." };
    }
    imageUrl = supabase.storage.from("event-images").getPublicUrl(path)
      .data.publicUrl;
  }

  const dateDebut = toISODateTime(v.dateStart, v.timeStart);
  const dateFin =
    v.dateEnd && v.timeEnd ? toISODateTime(v.dateEnd, v.timeEnd) : null;
  // Modération semi-automatique : date future => publication immédiate, sinon validation manuelle.
  const statut =
    new Date(dateDebut).getTime() > Date.now() ? "publie" : "en_attente";

  const { error: insertError } = await supabase.from("events").insert({
    titre: v.title,
    description: v.description,
    date_debut: dateDebut,
    date_fin: dateFin,
    lieu_texte: v.address,
    quartier: v.quartier,
    categorie: CATEGORY_NAME_TO_SLUG[v.category as CategoryName],
    prix: v.priceType,
    montant: v.priceType === "payant" ? Number(v.amount) || null : null,
    image_url: imageUrl,
    url_source: v.link || null,
    source_type: "formulaire",
    statut,
    organisateur_nom: v.org,
    organisateur_contact: v.phone,
    organisateur_email: v.email || null,
    organisateur_contact_fb: v.orgFb || null,
  });

  if (insertError) {
    console.error("submitEvent insert:", insertError.message);
    return { ok: false, error: "Erreur lors de l'enregistrement. Réessayez." };
  }

  return { ok: true };
}
