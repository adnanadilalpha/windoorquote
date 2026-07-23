import { createClient } from "@/lib/supabase/server";
import ContactEmailSettingsForm from "@/components/admin/ContactEmailSettingsForm";
import EmailTemplatePreview from "@/components/admin/EmailTemplatePreview";
import { defaultContactEmailSettings } from "@/lib/email/contact-notify";
import type { ContactEmailSettings } from "@/lib/content/types";

export default async function EmailSetupPage() {
  const supabase = await createClient();
  const { data: emailSettings } = await supabase
    .from("contact_email_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  const row = emailSettings as
    | (Partial<ContactEmailSettings> & { smtp_pass?: string })
    | null;

  const settings: ContactEmailSettings = {
    ...defaultContactEmailSettings,
    ...row,
    provider: "smtp",
    resend_api_key: "",
    smtp_pass: "",
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="admin-page-title">Email setup</h1>
        <p className="admin-page-desc">
          Connect your own email so contact form messages arrive in your inbox.
        </p>
      </header>

      <ContactEmailSettingsForm
        initial={settings}
        hasSavedPassword={Boolean(row?.smtp_pass)}
      />

      <EmailTemplatePreview />
    </div>
  );
}
