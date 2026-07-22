import { createClient } from "@/lib/supabase/server";
import PrivacyEditor from "@/components/admin/PrivacyEditor";
import SettingsForm from "@/components/admin/SettingsForm";
import { fallbacks } from "@/lib/content/queries";
import type { PrivacyBlock, PrivacySection } from "@/lib/content/types";

export default async function PrivacyAdminPage() {
  const supabase = await createClient();
  const { data: sections } = await supabase
    .from("privacy_sections")
    .select("*")
    .order("sort_order");
  const { data: blocks } = await supabase
    .from("privacy_blocks")
    .select("*")
    .order("sort_order");
  const { data: meta } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "privacy_meta")
    .maybeSingle();

  const allBlocks = (blocks as PrivacyBlock[]) ?? [];
  const initial = ((sections as PrivacySection[]) ?? []).map((section) => ({
    section,
    blocks: allBlocks.filter((b) => b.section_id === section.id),
  }));

  return (
    <>
      <h1 className="admin-page-title">Privacy policy</h1>
      <p className="admin-page-desc">Sections and content blocks.</p>
      <PrivacyEditor
        initial={initial}
        metaForm={
          <div className="admin-card">
            <h2>Meta & hero</h2>
            <SettingsForm
              settingKey="privacy_meta"
              initial={
                (meta?.value as typeof fallbacks.privacyMeta) ??
                fallbacks.privacyMeta
              }
              fields={[
                { name: "title", label: "Meta title" },
                {
                  name: "description",
                  label: "Meta description",
                  type: "textarea",
                },
                { name: "hero_title", label: "Hero title" },
                { name: "hero_body", label: "Hero body", type: "textarea" },
              ]}
            />
          </div>
        }
      />
    </>
  );
}
