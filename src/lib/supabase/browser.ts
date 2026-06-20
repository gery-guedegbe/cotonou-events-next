import { createBrowserClient } from "@supabase/ssr";

/** Client Supabase navigateur — pour la connexion admin (synchronise les cookies de session). */
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
