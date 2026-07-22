import { createClient } from "@/lib/supabase/server";
import HomeSectionsEditor from "@/components/admin/HomeSectionsEditor";
import { fallbacks } from "@/lib/content/queries";
import type {
  HomeAbout,
  HomeContact,
  HomeHero,
  HomeSectionLabels,
} from "@/lib/content/types";

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function HomeAdminPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const supabase = await createClient();

  const [
    { data: heroRow },
    { data: labelsRow },
    { data: aboutRow },
    { data: contactRow },
    { data: features },
    { data: clients },
    { data: testimonials },
    { data: team },
    { data: videos },
  ] = await Promise.all([
    supabase.from("site_settings").select("value").eq("key", "home_hero").maybeSingle(),
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "home_section_labels")
      .maybeSingle(),
    supabase.from("site_settings").select("value").eq("key", "home_about").maybeSingle(),
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "home_contact")
      .maybeSingle(),
    supabase.from("features").select("*").order("sort_order"),
    supabase.from("clients").select("*").order("sort_order"),
    supabase.from("testimonials").select("*").order("sort_order"),
    supabase.from("team_members").select("*").order("sort_order"),
    supabase.from("videos").select("*").order("sort_order"),
  ]);

  return (
    <HomeSectionsEditor
      initialTab={tab}
      hero={(heroRow?.value as HomeHero) ?? fallbacks.homeHero}
      sectionLabels={
        (labelsRow?.value as HomeSectionLabels) ?? fallbacks.homeSectionLabels
      }
      features={features ?? []}
      clients={clients ?? []}
      testimonials={testimonials ?? []}
      team={team ?? []}
      videos={videos ?? []}
      about={(aboutRow?.value as HomeAbout) ?? fallbacks.homeAbout}
      contact={(contactRow?.value as HomeContact) ?? fallbacks.homeContact}
    />
  );
}
