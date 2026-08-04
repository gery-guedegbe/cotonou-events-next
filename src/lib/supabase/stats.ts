import { createServiceClient } from "@/lib/supabase/service";
import { beninStartOfTodayISO } from "@/lib/utils/format-date";

export interface PublicStats {
  /** Abonnés WhatsApp actifs. */
  subscribers: number;
  /** Événements publiés dont la date n'est pas passée. */
  upcomingEvents: number;
}

/**
 * Compteurs affichés sur la page d'accueil.
 *
 * `subscribers` passe par le client service_role : la table `subscribers` n'a
 * aucune policy RLS, donc elle est invisible au client anonyme.
 *
 * NE JAMAIS importer ce module depuis un composant "use client" : il embarque
 * SUPABASE_SERVICE_ROLE_KEY. Réservé aux Server Components et Server Actions.
 * (Le package `server-only` rendrait cette règle vérifiable à la compilation ;
 * il n'est pas installé dans ce projet.)
 *
 * En cas d'erreur, on renvoie 0 plutôt que de faire échouer le rendu : un
 * compteur absent dégrade la page, une exception la supprime.
 */
export async function getPublicStats(): Promise<PublicStats> {
  const supabase = createServiceClient();

  const [subscribersResult, eventsResult] = await Promise.all([
    supabase
      .from("subscribers")
      .select("id", { count: "exact", head: true })
      .eq("actif", true),
    supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("statut", "publie")
      .gte("date_debut", beninStartOfTodayISO()),
  ]);

  if (subscribersResult.error) {
    console.error("getPublicStats subscribers:", subscribersResult.error.message);
  }
  if (eventsResult.error) {
    console.error("getPublicStats events:", eventsResult.error.message);
  }

  return {
    subscribers: subscribersResult.count ?? 0,
    upcomingEvents: eventsResult.count ?? 0,
  };
}
