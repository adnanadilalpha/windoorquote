import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ConfirmProvider } from "@/components/admin/ConfirmDialog";
import "../admin.css";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase
    .from("admins")
    .select("email")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) redirect("/admin/login?error=not_admin");

  return (
    <ConfirmProvider>
      <div className="min-h-dvh bg-paper-50 text-navy-800">
        <AdminSidebar email={admin.email} />
        <div className="lg:pl-56">
          <main className="px-5 py-6 sm:px-8 sm:py-8">{children}</main>
        </div>
      </div>
    </ConfirmProvider>
  );
}
