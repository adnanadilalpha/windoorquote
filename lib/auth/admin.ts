import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Ensure the current session belongs to an admins row. */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id, email")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) redirect("/admin/login?error=not_admin");

  return { supabase, user, admin };
}
