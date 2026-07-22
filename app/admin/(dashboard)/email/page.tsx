import { createClient } from "@/lib/supabase/server";
import ContactEmailSettingsForm from "@/components/admin/ContactEmailSettingsForm";
import {
  defaultContactEmailSettings,
  hasPlatformResendKey,
} from "@/lib/email/contact-notify";
import type { ContactEmailSettings } from "@/lib/content/types";

export default async function EmailSetupPage() {
  const supabase = await createClient();
  const { data: emailSettings } = await supabase
    .from("contact_email_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  const row = emailSettings as
    | (Partial<ContactEmailSettings> & { resend_api_key?: string })
    | null;

  const settings: ContactEmailSettings = {
    ...defaultContactEmailSettings,
    ...row,
    provider: "resend",
    resend_api_key: "",
    smtp_pass: "",
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="admin-page-title">Email setup</h1>
        <p className="admin-page-desc">
          Get contact form messages in your email — no domain or SMTP required.
        </p>
      </header>

      <ContactEmailSettingsForm
        initial={settings}
        hasSavedApiKey={Boolean(row?.resend_api_key)}
        hasPlatformKey={hasPlatformResendKey()}
      />
    </div>
  );
}
