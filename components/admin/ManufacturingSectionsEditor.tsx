"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SettingsForm from "@/components/admin/SettingsForm";
import CollectionEditor from "@/components/admin/CollectionEditor";
import { cn } from "@/lib/utils";
import type {
  ManufacturingCard,
  ManufacturingCtas,
  ManufacturingHero,
  ManufacturingPartner,
  ManufacturingSection,
  SiteMeta,
} from "@/lib/content/types";

const TABS = [
  { id: "seo", label: "SEO" },
  { id: "hero", label: "Hero" },
  { id: "partners", label: "Partners" },
  { id: "one_app", label: "One App" },
  { id: "cut_once", label: "Cut Once" },
  { id: "ctas", label: "CTAs" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const ICON_OPTIONS = [
  { value: "layers", label: "layers" },
  { value: "spark", label: "spark" },
  { value: "sliders", label: "sliders" },
  { value: "check", label: "check" },
];

type Props = {
  initialTab?: string;
  meta: SiteMeta;
  hero: ManufacturingHero;
  partners: ManufacturingPartner[];
  oneApp: ManufacturingSection;
  oneAppCards: ManufacturingCard[];
  cutOnce: ManufacturingSection;
  cutOnceCards: ManufacturingCard[];
  ctas: ManufacturingCtas;
};

export default function ManufacturingSectionsEditor({
  initialTab,
  meta,
  hero,
  partners,
  oneApp,
  oneAppCards,
  cutOnce,
  cutOnceCards,
  ctas,
}: Props) {
  const router = useRouter();
  const validTab = useMemo(() => {
    const match = TABS.find((t) => t.id === initialTab);
    return match?.id ?? "hero";
  }, [initialTab]);

  const [tab, setTab] = useState<TabId>(validTab);

  function selectTab(id: TabId) {
    setTab(id);
    router.replace(`/admin/manufacturing?tab=${id}`, { scroll: false });
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="admin-page-title">Manufacturing page</h1>
        <p className="admin-page-desc">
          Edit each manufacturing section from the tabs below.
        </p>
      </header>

      <div className="flex flex-wrap gap-1.5 rounded-xl border border-navy-800/8 bg-white p-1.5">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectTab(item.id)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              tab === item.id
                ? "bg-[#12689b] text-white!"
                : "text-body-muted hover:bg-paper-200 hover:text-navy-800",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "seo" ? (
        <div className="admin-card">
          <h2>SEO metadata</h2>
          <SettingsForm
            settingKey="manufacturing_meta"
            initial={meta}
            fields={[
              { name: "title", label: "Title" },
              { name: "description", label: "Description", type: "textarea" },
            ]}
          />
        </div>
      ) : null}

      {tab === "hero" ? (
        <div className="admin-card">
          <h2>Hero</h2>
          <SettingsForm
            settingKey="manufacturing_hero"
            initial={hero}
            fields={[
              { name: "title", label: "Title" },
              { name: "body", label: "Body", type: "textarea" },
              { name: "cta", label: "CTA label" },
              {
                name: "image",
                label: "Hero image",
                type: "image",
                folder: "manufacturing",
              },
            ]}
          />
        </div>
      ) : null}

      {tab === "partners" ? (
        <CollectionEditor
          table="manufacturing_partners"
          items={partners}
          titleKey="name"
          fields={[
            { name: "name", label: "Name" },
            {
              name: "logo_path",
              label: "Logo",
              type: "image",
              folder: "manufacturing",
              imageVariant: "logo",
            },
          ]}
        />
      ) : null}

      {tab === "one_app" ? (
        <div className="space-y-4">
          <div className="admin-card">
            <h2>Section copy</h2>
            <SettingsForm
              settingKey="manufacturing_one_app"
              initial={oneApp}
              fields={[
                { name: "title", label: "Title" },
                { name: "body", label: "Body", type: "textarea" },
                {
                  name: "image",
                  label: "Section image",
                  type: "image",
                  folder: "manufacturing",
                },
              ]}
            />
          </div>
          <CollectionEditor
            table="manufacturing_cards"
            items={oneAppCards}
            defaults={{ section: "one_app", icon: "layers" }}
            fields={[
              { name: "title", label: "Title" },
              { name: "body", label: "Body", type: "textarea" },
              {
                name: "icon",
                label: "Icon",
                type: "select",
                options: ICON_OPTIONS,
              },
            ]}
          />
        </div>
      ) : null}

      {tab === "cut_once" ? (
        <div className="space-y-4">
          <div className="admin-card">
            <h2>Section copy</h2>
            <SettingsForm
              settingKey="manufacturing_cut_once"
              initial={cutOnce}
              fields={[
                { name: "title", label: "Title" },
                { name: "body", label: "Body", type: "textarea" },
                {
                  name: "image",
                  label: "Section image",
                  type: "image",
                  folder: "manufacturing",
                },
              ]}
            />
          </div>
          <CollectionEditor
            table="manufacturing_cards"
            items={cutOnceCards}
            defaults={{ section: "cut_once", icon: "sliders" }}
            fields={[
              { name: "title", label: "Title" },
              { name: "body", label: "Body", type: "textarea" },
              {
                name: "icon",
                label: "Icon",
                type: "select",
                options: ICON_OPTIONS,
              },
            ]}
          />
        </div>
      ) : null}

      {tab === "ctas" ? (
        <div className="admin-card">
          <h2>CTAs</h2>
          <p className="mb-3 text-sm text-body-muted">
            Videos and contact call-to-action blocks near the bottom of the page.
          </p>
          <SettingsForm
            settingKey="manufacturing_ctas"
            initial={ctas}
            fields={[
              { name: "videos.title", label: "Videos CTA title" },
              { name: "videos.body", label: "Videos CTA body", type: "textarea" },
              { name: "videos.cta", label: "Videos CTA label" },
              { name: "videos.href", label: "Videos CTA href" },
              { name: "contact.title", label: "Contact CTA title" },
              { name: "contact.body", label: "Contact CTA body", type: "textarea" },
              { name: "contact.cta", label: "Contact CTA label" },
              { name: "contact.href", label: "Contact CTA href" },
              {
                name: "contact.phone_image",
                label: "Phone image",
                type: "image",
                folder: "manufacturing",
              },
            ]}
          />
        </div>
      ) : null}
    </div>
  );
}
