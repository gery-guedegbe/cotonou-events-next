import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase service_role — contourne le RLS. À n'utiliser que dans des
 * Server Actions ("use server"), jamais importé depuis un composant client.
 */
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false },
    },
  );
}
