import { createClient } from "@/lib/supabase/server";
import SettingsForm from "@/components/admin/SettingsForm";
import CollectionEditor from "@/components/admin/CollectionEditor";
import { fallbacks } from "@/lib/content/queries";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("*");
  const map = Object.fromEntries(
    (settings ?? []).map((s) => [s.key, s.value]),
  );

  const siteMeta = (map.site_meta as typeof fallbacks.siteMeta) ?? fallbacks.siteMeta;
  const header = (map.header as typeof fallbacks.header) ?? fallbacks.header;
  const footer = (map.footer as typeof fallbacks.footer) ?? fallbacks.footer;

  const { data: navLinks } = await supabase
    .from("nav_links")
    .select("*")
    .order("sort_order");

  return (
    <>
      <h1 className="admin-page-title">Site & Navigation</h1>
      <p className="admin-page-desc">
        Global metadata, header, footer, and main navigation links.
      </p>

      <div className="admin-card">
        <h2>Site metadata</h2>
        <SettingsForm
          settingKey="site_meta"
          initial={siteMeta}
          fields={[
            { name: "title", label: "Page title" },
            { name: "description", label: "Meta description", type: "textarea" },
          ]}
        />
      </div>

      <div className="admin-card">
        <h2>Header</h2>
        <SettingsForm
          settingKey="header"
          initial={header}
          fields={[
            { name: "logo_path", label: "Logo", type: "image", folder: "brand", imageVariant: "logo" },
            { name: "logo_alt", label: "Logo alt text" },
            { name: "cta_label", label: "CTA label" },
            { name: "cta_href", label: "CTA href" },
          ]}
        />
      </div>

      <div className="admin-card">
        <h2>Footer</h2>
        <SettingsForm
          settingKey="footer"
          initial={footer}
          fields={[
            { name: "copyright_year", label: "Copyright year" },
            { name: "brand_name", label: "Brand name" },
            { name: "brand_href", label: "Brand href" },
            { name: "manufacturing_label", label: "Manufacturing link label" },
            { name: "manufacturing_href", label: "Manufacturing link href" },
            { name: "privacy_label", label: "Privacy link label" },
            { name: "privacy_href", label: "Privacy link href" },
          ]}
        />
      </div>

      <h2 className="admin-page-title" style={{ fontSize: 18, marginTop: 24 }}>
        Navigation links
      </h2>
      <CollectionEditor
        table="nav_links"
        items={navLinks ?? []}
        titleKey="label"
        fields={[
          { name: "label", label: "Label" },
          { name: "href", label: "Href" },
        ]}
      />
    </>
  );
}
