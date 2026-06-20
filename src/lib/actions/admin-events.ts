"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

type ActionResult = { ok: true } | { ok: false; error: string };

async function setStatut(
  id: string,
  statut: "publie" | "rejete" | "en_attente",
): Promise<ActionResult> {
  await requireAdminUser();

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("events")
    .update({ statut })
    .eq("id", id);

  if (error) {
    console.error("setStatut:", error.message);
    return { ok: false, error: "Erreur lors de la mise à jour. Réessayez." };
  }

  revalidatePath("/admin");
  revalidatePath("/evenements");
  revalidatePath("/");
  return { ok: true };
}

/** Publie un événement en attente. */
export async function approveEvent(id: string): Promise<ActionResult> {
  return setStatut(id, "publie");
}

/** Rejette un événement en attente. */
export async function rejectEvent(id: string): Promise<ActionResult> {
  return setStatut(id, "rejete");
}

/** Retire un événement publié du site public (repasse en attente de validation). */
export async function unpublishEvent(id: string): Promise<ActionResult> {
  return setStatut(id, "en_attente");
}
