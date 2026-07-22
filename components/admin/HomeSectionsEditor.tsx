"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SettingsForm from "@/components/admin/SettingsForm";
import CollectionEditor from "@/components/admin/CollectionEditor";
import AboutEditor from "@/components/admin/AboutEditor";
import ContactCopyEditor from "@/components/admin/ContactCopyEditor";
import { cn } from "@/lib/utils";
import type {
  Client,
  Feature,
  HomeAbout,
  HomeContact,
  HomeHero,
  HomeSectionLabels,
  TeamMember,
  Testimonial,
  Video,
} from "@/lib/content/types";

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "features", label: "Features" },
  { id: "clients", label: "Clients" },
  { id: "testimonials", label: "Testimonials" },
  { id: "team", label: "Team" },
  { id: "videos", label: "Videos" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type Props = {
  initialTab?: string;
  hero: HomeHero;
  sectionLabels: HomeSectionLabels;
  features: Feature[];
  clients: Client[];
  testimonials: Testimonial[];
  team: TeamMember[];
  videos: Video[];
  about: HomeAbout;
  contact: HomeContact;
};

export default function HomeSectionsEditor({
  initialTab,
  hero,
  sectionLabels,
  features,
  clients,
  testimonials,
  team,
  videos,
  about,
  contact,
}: Props) {
  const router = useRouter();
  const validTab = useMemo(() => {
    const match = TABS.find((t) => t.id === initialTab);
    return match?.id ?? "hero";
  }, [initialTab]);

  const [tab, setTab] = useState<TabId>(validTab);

  function selectTab(id: TabId) {
    setTab(id);
    router.replace(`/admin/home?tab=${id}`, { scroll: false });
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="admin-page-title">Home page</h1>
        <p className="admin-page-desc">
          Edit each home section from the tabs below.
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

      {tab === "hero" ? (
        <div className="admin-card">
          <h2>Hero</h2>
          <SettingsForm
            settingKey="home_hero"
            initial={hero}
            fields={[
              {
                name: "image",
                label: "Background image",
                type: "image",
                folder: "hero",
              },
              { name: "title", label: "Headline", type: "textarea", rows: 2 },
              { name: "lead", label: "Lead paragraph", type: "textarea" },
              { name: "cta_label", label: "CTA label" },
              { name: "cta_href", label: "CTA href" },
              { name: "scroll_href", label: "Scroll link href" },
            ]}
          />
        </div>
      ) : null}

      {tab === "features" ? (
        <div className="space-y-4">
          <div className="admin-card">
            <h2>Section heading</h2>
            <p className="mb-3 text-sm text-body-muted">
              Title shown above the Features block on the home page.
            </p>
            <SettingsForm
              settingKey="home_section_labels"
              initial={sectionLabels}
              fields={[{ name: "features_title", label: "Title" }]}
            />
          </div>
          <CollectionEditor
            table="features"
            items={features}
            fields={[
              { name: "title", label: "Title" },
              {
                name: "image_path",
                label: "Image",
                type: "image",
                folder: "features",
                imageVariant: "icon",
              },
              {
                name: "description",
                label: "Description",
                type: "textarea",
                rows: 5,
              },
            ]}
          />
        </div>
      ) : null}

      {tab === "clients" ? (
        <div className="space-y-4">
          <div className="admin-card">
            <h2>Section heading</h2>
            <p className="mb-3 text-sm text-body-muted">
              Title shown above the Clients logos on the home page.
            </p>
            <SettingsForm
              settingKey="home_section_labels"
              initial={sectionLabels}
              fields={[{ name: "clients_title", label: "Title" }]}
            />
          </div>
          <CollectionEditor
            table="clients"
            items={clients}
            titleKey="name"
            fields={[
              { name: "name", label: "Name" },
              {
                name: "logo_path",
                label: "Logo",
                type: "image",
                folder: "clients",
                imageVariant: "logo",
              },
              { name: "href", label: "Website URL" },
            ]}
          />
        </div>
      ) : null}

      {tab === "testimonials" ? (
        <div className="space-y-4">
          <div className="admin-card">
            <h2>Section heading</h2>
            <p className="mb-3 text-sm text-body-muted">
              Title shown above the Testimonials block.
            </p>
            <SettingsForm
              settingKey="home_section_labels"
              initial={sectionLabels}
              fields={[{ name: "testimonials_title", label: "Title" }]}
            />
          </div>
          <CollectionEditor
            table="testimonials"
            items={testimonials}
            titleKey="author"
            fields={[
              { name: "author", label: "Author" },
              { name: "role", label: "Role / company" },
              {
                name: "logo_path",
                label: "Logo",
                type: "image",
                folder: "testimonials",
                imageVariant: "logo",
              },
              { name: "quote", label: "Quote", type: "textarea", rows: 6 },
            ]}
          />
        </div>
      ) : null}

      {tab === "team" ? (
        <div className="space-y-4">
          <div className="admin-card">
            <h2>Section heading</h2>
            <p className="mb-3 text-sm text-body-muted">
              Title shown above the Team block.
            </p>
            <SettingsForm
              settingKey="home_section_labels"
              initial={sectionLabels}
              fields={[{ name: "team_title", label: "Title" }]}
            />
          </div>
          <CollectionEditor
            table="team_members"
            items={team}
            titleKey="name"
            fields={[
              { name: "name", label: "Name" },
              { name: "role", label: "Role" },
              {
                name: "image_path",
                label: "Photo",
                type: "image",
                folder: "team",
              },
              { name: "bio", label: "Bio", type: "textarea", rows: 6 },
            ]}
          />
        </div>
      ) : null}

      {tab === "videos" ? (
        <div className="space-y-4">
          <div className="admin-card">
            <h2>Section heading</h2>
            <p className="mb-3 text-sm text-body-muted">
              Title shown above the Videos block.
            </p>
            <SettingsForm
              settingKey="home_section_labels"
              initial={sectionLabels}
              fields={[{ name: "videos_title", label: "Title" }]}
            />
          </div>
          <CollectionEditor
            table="videos"
            items={videos}
            fields={[
              { name: "title", label: "Title" },
              { name: "youtube_url", label: "YouTube URL", type: "url" },
              {
                name: "thumb_path",
                label: "Thumbnail",
                type: "image",
                folder: "videos",
              },
            ]}
          />
        </div>
      ) : null}

      {tab === "about" ? (
        <div className="admin-card">
          <h2>About</h2>
          <AboutEditor initial={about} />
        </div>
      ) : null}

      {tab === "contact" ? (
        <div className="admin-card">
          <h2>Contact copy</h2>
          <ContactCopyEditor initial={contact} />
        </div>
      ) : null}
    </div>
  );
}
