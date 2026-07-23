import { createClient } from "@/lib/supabase/server";
import SiteSecurityForm from "@/components/admin/SiteSecurityForm";
import {
  defaultSiteSecuritySettings,
  normalizeSiteSecuritySettings,
  SITE_SECURITY_KEY,
} from "@/lib/security/settings";
import type { SiteSecuritySettings } from "@/lib/content/types";

export default async function SecuritySettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", SITE_SECURITY_KEY)
    .maybeSingle();

  const settings = normalizeSiteSecuritySettings(
    (data?.value as Partial<SiteSecuritySettings> | null) ??
      defaultSiteSecuritySettings,
  );

  return (
    <div className="space-y-5">
      <header>
        <h1 className="admin-page-title">Security</h1>
        <p className="admin-page-desc">
          Block countries site-wide and keep spam out of the contact form.
        </p>
      </header>

      <SiteSecurityForm initial={settings} />
    </div>
  );
}
