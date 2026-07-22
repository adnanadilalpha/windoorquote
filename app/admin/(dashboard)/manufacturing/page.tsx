import { createClient } from "@/lib/supabase/server";
import ManufacturingSectionsEditor from "@/components/admin/ManufacturingSectionsEditor";
import { fallbacks } from "@/lib/content/queries";
import type {
  ManufacturingCtas,
  ManufacturingHero,
  ManufacturingSection,
  SiteMeta,
} from "@/lib/content/types";

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function ManufacturingAdminPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const supabase = await createClient();

  const [
    { data: metaRow },
    { data: heroRow },
    { data: oneAppRow },
    { data: cutOnceRow },
    { data: ctasRow },
    { data: partners },
    { data: oneAppCards },
    { data: cutOnceCards },
  ] = await Promise.all([
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "manufacturing_meta")
      .maybeSingle(),
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "manufacturing_hero")
      .maybeSingle(),
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "manufacturing_one_app")
      .maybeSingle(),
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "manufacturing_cut_once")
      .maybeSingle(),
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "manufacturing_ctas")
      .maybeSingle(),
    supabase.from("manufacturing_partners").select("*").order("sort_order"),
    supabase
      .from("manufacturing_cards")
      .select("*")
      .eq("section", "one_app")
      .order("sort_order"),
    supabase
      .from("manufacturing_cards")
      .select("*")
      .eq("section", "cut_once")
      .order("sort_order"),
  ]);

  return (
    <ManufacturingSectionsEditor
      initialTab={tab}
      meta={(metaRow?.value as SiteMeta) ?? fallbacks.manufacturingMeta}
      hero={
        (heroRow?.value as ManufacturingHero) ?? fallbacks.manufacturingHero
      }
      partners={partners ?? []}
      oneApp={
        (oneAppRow?.value as ManufacturingSection) ??
        fallbacks.manufacturingOneApp
      }
      oneAppCards={oneAppCards ?? []}
      cutOnce={
        (cutOnceRow?.value as ManufacturingSection) ??
        fallbacks.manufacturingCutOnce
      }
      cutOnceCards={cutOnceCards ?? []}
      ctas={
        (ctasRow?.value as ManufacturingCtas) ?? fallbacks.manufacturingCtas
      }
    />
  );
}
