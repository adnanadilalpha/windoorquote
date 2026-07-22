import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminsManager from "@/components/admin/AdminsManager";
import type { AdminRow } from "@/lib/actions/admins";
import { redirect } from "next/navigation";

export default async function AdminsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("admins")
    .select("user_id, email, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <div className="space-y-2">
        <h1 className="admin-page-title">Admins</h1>
        <p className="text-sm text-red-700">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="admin-page-title">Admins</h1>
        <p className="admin-page-desc">
          Manage who can sign in to the CMS. No public signup — only accounts
          listed here.
        </p>
      </header>
      <AdminsManager
        admins={(data as AdminRow[]) ?? []}
        currentUserId={user.id}
      />
    </div>
  );
}
