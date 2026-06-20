import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Client Supabase lié aux cookies de session, pour les Server Components et Server Actions de l'admin. */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Appelé depuis un Server Component (lecture seule) : le middleware
          // se charge déjà de rafraîchir la session sur la requête suivante.
        }
      },
    },
  });
}

/**
 * Vérifie qu'un admin est bien connecté. À appeler en première ligne de
 * chaque Server Action privilégiée (service_role) : le middleware protège la
 * navigation, mais une Server Action est un endpoint à part qui doit se
 * vérifier lui-même plutôt que de dépendre uniquement du middleware.
 */
export async function requireAdminUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autorisé.");
  return user;
}
