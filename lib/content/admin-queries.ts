import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Client,
  Feature,
  ManufacturingCard,
  ManufacturingPartner,
  NavLink,
  PrivacyBlock,
  PrivacySection,
  TeamMember,
  Testimonial,
  Video,
} from "./types";

export async function getSettingAdmin<T>(
  key: string,
  fallback: T,
): Promise<T> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (!data?.value) return fallback;
  return data.value as T;
}

export async function getNavLinksAdmin(): Promise<NavLink[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("nav_links")
    .select("*")
    .order("sort_order");
  return (data as NavLink[]) ?? [];
}

export async function getFeaturesAdmin(): Promise<Feature[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("features")
    .select("*")
    .order("sort_order");
  return (data as Feature[]) ?? [];
}

export async function getClientsAdmin(): Promise<Client[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("clients")
    .select("*")
    .order("sort_order");
  return (data as Client[]) ?? [];
}

export async function getTestimonialsAdmin(): Promise<Testimonial[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order");
  return (data as Testimonial[]) ?? [];
}

export async function getTeamMembersAdmin(): Promise<TeamMember[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .order("sort_order");
  return (data as TeamMember[]) ?? [];
}

export async function getVideosAdmin(): Promise<Video[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("videos")
    .select("*")
    .order("sort_order");
  return (data as Video[]) ?? [];
}

export async function getManufacturingPartnersAdmin(): Promise<
  ManufacturingPartner[]
> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("manufacturing_partners")
    .select("*")
    .order("sort_order");
  return (data as ManufacturingPartner[]) ?? [];
}

export async function getManufacturingCardsAdmin(
  section: "one_app" | "cut_once",
): Promise<ManufacturingCard[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("manufacturing_cards")
    .select("*")
    .eq("section", section)
    .order("sort_order");
  return (data as ManufacturingCard[]) ?? [];
}

export async function getPrivacyContentAdmin(): Promise<
  { section: PrivacySection; blocks: PrivacyBlock[] }[]
> {
  const supabase = createAdminClient();
  const { data: sections } = await supabase
    .from("privacy_sections")
    .select("*")
    .order("sort_order");
  const { data: blocks } = await supabase
    .from("privacy_blocks")
    .select("*")
    .order("sort_order");
  const allBlocks = (blocks as PrivacyBlock[]) ?? [];
  return ((sections as PrivacySection[]) ?? []).map((section) => ({
    section,
    blocks: allBlocks.filter((b) => b.section_id === section.id),
  }));
}
