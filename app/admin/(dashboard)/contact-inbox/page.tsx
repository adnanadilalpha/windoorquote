import { createClient } from "@/lib/supabase/server";
import ContactInbox from "@/components/admin/ContactInbox";
import type { ContactSubmission } from "@/lib/content/types";

export default async function ContactInboxPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-5">
      <header>
        <h1 className="admin-page-title">Contact inbox</h1>
        <p className="admin-page-desc">
          Messages from the website contact form.
        </p>
      </header>
      <ContactInbox submissions={(data as ContactSubmission[]) ?? []} />
    </div>
  );
}
