"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ADMIN_LOGIN_PATH } from "@/lib/constants/admin-path";

export async function signOutAdmin() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect(ADMIN_LOGIN_PATH);
}
