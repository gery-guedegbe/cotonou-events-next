import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/** Client Supabase anon, pour les lectures publiques côté serveur (RLS applique le filtrage). */
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
