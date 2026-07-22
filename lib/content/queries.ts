import { createClient } from "@/lib/supabase/server";
import {
  clients as staticClients,
  features as staticFeatures,
  navLinks as staticNavLinks,
  team as staticTeam,
  testimonials as staticTestimonials,
  videos as staticVideos,
  aboutText,
} from "@/data/home";
import {
  manufacturingCutOnce,
  manufacturingOneApp,
  manufacturingPartners as staticPartners,
} from "@/data/manufacturing";
import type {
  Client,
  Feature,
  HomeAbout,
  HomeContact,
  HomeHero,
  HomeSectionLabels,
  ManufacturingCard,
  ManufacturingCtas,
  ManufacturingHero,
  ManufacturingPartner,
  NavLink,
  PrivacyBlock,
  PrivacyMetaSettings,
  PrivacySection,
  SiteMeta,
  HeaderSettings,
  FooterSettings,
  TeamMember,
  Testimonial,
  Video,
} from "./types";

async function safeQuery<T>(
  run: () => PromiseLike<{ data: T | null }>,
): Promise<T | null> {
  try {
    const { data } = await run();
    return data;
  } catch {
    return null;
  }
}

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const supabase = await createClient();
  const data = await safeQuery<{ value: T }>(() =>
    supabase.from("site_settings").select("value").eq("key", key).maybeSingle(),
  );
  if (!data?.value) return fallback;
  return data.value;
}

export async function getNavLinks(): Promise<NavLink[]> {
  const supabase = await createClient();
  const data = await safeQuery(() =>
    supabase.from("nav_links").select("*").order("sort_order"),
  );
  if (data?.length) return data as NavLink[];
  return fallbacks.navLinks;
}

export async function getFeatures(): Promise<Feature[]> {
  const supabase = await createClient();
  const data = await safeQuery(() =>
    supabase.from("features").select("*").order("sort_order"),
  );
  if (data?.length) return data as Feature[];
  return fallbacks.features;
}

export async function getClients(): Promise<Client[]> {
  const supabase = await createClient();
  const data = await safeQuery(() =>
    supabase.from("clients").select("*").order("sort_order"),
  );
  if (data?.length) return data as Client[];
  return fallbacks.clients;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const data = await safeQuery(() =>
    supabase.from("testimonials").select("*").order("sort_order"),
  );
  if (data?.length) return data as Testimonial[];
  return fallbacks.testimonials;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = await createClient();
  const data = await safeQuery(() =>
    supabase.from("team_members").select("*").order("sort_order"),
  );
  if (data?.length) return data as TeamMember[];
  return fallbacks.team;
}

export async function getVideos(): Promise<Video[]> {
  const supabase = await createClient();
  const data = await safeQuery(() =>
    supabase.from("videos").select("*").order("sort_order"),
  );
  if (data?.length) return data as Video[];
  return fallbacks.videos;
}

export async function getManufacturingPartners(): Promise<
  ManufacturingPartner[]
> {
  const supabase = await createClient();
  const data = await safeQuery(() =>
    supabase.from("manufacturing_partners").select("*").order("sort_order"),
  );
  if (data?.length) return data as ManufacturingPartner[];
  return fallbacks.manufacturingPartners;
}

export async function getManufacturingCards(
  section: "one_app" | "cut_once",
): Promise<ManufacturingCard[]> {
  const supabase = await createClient();
  const data = await safeQuery(() =>
    supabase
      .from("manufacturing_cards")
      .select("*")
      .eq("section", section)
      .order("sort_order"),
  );
  if (data?.length) return data as ManufacturingCard[];
  return fallbacks.manufacturingCards(section);
}

export async function getPrivacyContent(): Promise<
  { section: PrivacySection; blocks: PrivacyBlock[] }[]
> {
  const supabase = await createClient();
  const sections = await safeQuery(() =>
    supabase.from("privacy_sections").select("*").order("sort_order"),
  );
  const blocks = await safeQuery(() =>
    supabase.from("privacy_blocks").select("*").order("sort_order"),
  );

  const allBlocks = (blocks as PrivacyBlock[] | null) ?? [];
  return ((sections as PrivacySection[] | null) ?? []).map((section) => ({
    section,
    blocks: allBlocks.filter((b) => b.section_id === section.id),
  }));
}

export function formatPostDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export { mediaUrl } from "./media";

/* Fallbacks used if DB is empty or unreachable */
export const fallbacks = {
  navLinks: staticNavLinks.map(
    (l, i): NavLink => ({
      id: `nav-${i}`,
      label: l.label,
      href: l.href,
      sort_order: i,
    }),
  ),
  features: staticFeatures.map(
    (f, i): Feature => ({
      id: `feature-${i}`,
      title: f.title,
      description: f.description,
      image_path: f.image,
      sort_order: i,
    }),
  ),
  clients: staticClients.map(
    (c, i): Client => ({
      id: `client-${i}`,
      name: c.name,
      logo_path: c.src,
      href: c.href,
      sort_order: i,
    }),
  ),
  testimonials: [
    {
      id: "testimonial-0",
      author: staticTestimonials[0].author,
      role: staticTestimonials[0].role,
      quote: staticTestimonials[0].quote,
      logo_path: "/images/clients/enerlux.png",
      sort_order: 0,
    },
    {
      id: "testimonial-1",
      author: staticTestimonials[1].author,
      role: staticTestimonials[1].role,
      quote: staticTestimonials[1].quote,
      logo_path: "/images/clients/flexscreen.png",
      sort_order: 1,
    },
  ] satisfies Testimonial[],
  team: staticTeam.map(
    (t, i): TeamMember => ({
      id: `team-${i}`,
      name: t.name,
      role: t.role,
      bio: t.bio,
      image_path: t.image,
      sort_order: i,
    }),
  ),
  videos: staticVideos.map(
    (v, i): Video => ({
      id: `video-${i}`,
      title: v.title,
      youtube_url: v.href,
      thumb_path: v.thumb,
      sort_order: i,
    }),
  ),
  manufacturingPartners: staticPartners.map(
    (p, i): ManufacturingPartner => ({
      id: `partner-${i}`,
      name: p.name,
      logo_path: p.src,
      sort_order: i,
    }),
  ),
  manufacturingCards(section: "one_app" | "cut_once"): ManufacturingCard[] {
    const source =
      section === "one_app" ? manufacturingOneApp.cards : manufacturingCutOnce.cards;
    return source.map(
      (c, i): ManufacturingCard => ({
        id: `${section}-card-${i}`,
        section,
        title: c.title,
        body: c.body,
        icon: c.icon,
        sort_order: i,
      }),
    );
  },
  siteMeta: {
    title: "Cloud Based Window and Door Quoting Software • WinDoor Quote",
    description:
      "Taking the complex and making it simple. WDQ is a cloud based ERP Window and Door Quoting Software for manufacturers that is fast, reliable, and intuitive.",
  } satisfies SiteMeta,
  header: {
    logo_path: "/images/logo.png",
    logo_alt: "WinDoor Quote",
    cta_label: "Contact us",
    cta_href: "/#contactus",
  } satisfies HeaderSettings,
  footer: {
    copyright_year: "2026",
    brand_name: "WinDoorQuote",
    brand_href: "/",
    manufacturing_label: "Manufacturing Software",
    manufacturing_href: "/window-and-door-manufacturing-software",
    privacy_label: "Privacy Policy",
    privacy_href: "/privacy-policy",
  } satisfies FooterSettings,
  homeHero: {
    image: "/images/hero.jpg",
    title: "Taking the complex and making it simple.",
    lead: "Cloud based ERP and quoting software for window, door, and screen manufacturers — fast, reliable, flexible, and intuitive.",
    cta_label: "Contact us",
    cta_href: "/#contactus",
    scroll_href: "#features",
  } satisfies HomeHero,
  homeAbout: {
    location: "Omaha · Nebraska",
    title: "ABOUT US",
    mission_lead: "Taking the complex and making it simple ",
    body: aboutText.replace(/^Taking the complex and making it simple\s*/, ""),
    process: ["Quote", "Order", "Produce", "Ship"],
  } satisfies HomeAbout,
  homeContact: {
    kicker: "Next step",
    title: "CONTACT US",
    body: "If you manufacture fenestration products and are looking for an ERP and Quoting software to tie your entire business together under one software system, contact us to find out how we can help.",
    points: [
      "Cloud ERP & quoting",
      "Built for manufacturers",
      "Based in Omaha, NE",
    ],
    form_heading: "Tell us about your shop",
    submit_label: "Send message",
    hint: "We'll reply within one business day.",
    success_message: "Thank you. Your message has been received.",
  } satisfies HomeContact,
  homeSectionLabels: {
    features_kicker: "Capabilities",
    features_title: "FEATURES",
    clients_kicker: "Partners",
    clients_title: "OUR CLIENTS",
    testimonials_kicker: "Voice",
    testimonials_title: "WHAT OUR CLIENTS SAY",
    team_kicker: "People",
    team_title: "OUR TEAM",
    videos_kicker: "Watch",
    videos_title: "VIDEO DEMOS",
  } satisfies HomeSectionLabels,
  manufacturingMeta: {
    title: "Window and Door Manufacturing Software • WinDoor Quote",
    description:
      "Based in Omaha, Nebraska, WDQ provides cloud based software for window, door, screen, and partition manufacturers.",
  } satisfies SiteMeta,
  manufacturingHero: {
    title: "Window and Door Manufacturing Software",
    body: "Based in Omaha, Nebraska, WDQ provides cloud based software for window, door, screen, and partition manufacturers. WDQ is a fast, reliable, flexible, and intuitive system that will help your company increase sales and process those sales more accurately and efficiently.",
    cta: "Learn More",
    image: "/images/manufacturing/hero-illustration.png",
  } satisfies ManufacturingHero,
  manufacturingOneApp: {
    title: "Manage everything with one app",
    body: "Save time and nerves by managing all parts of your business from just one app! We are constantly updating and modifying our software and there is a lot more upcoming features!",
    image: "/images/manufacturing/one-app-illustration.png",
  } satisfies ManufacturingSection,
  manufacturingCutOnce: {
    title: "With WDQ, you will cut only once!",
    body: "With our precise software you will be able to adjust all the desired parameters and you will never have to cut more than once. Save on time and raw materials!",
    image: "/images/manufacturing/cut-once-illustration.png",
  } satisfies ManufacturingSection,
  manufacturingCtas: {
    videos: {
      title: "Learn more about our software?",
      body: "Click on the button below and check 10+ video demos about using our software in first hand.",
      cta: "CHECK VIDEOS",
      href: "/#demos",
    },
    contact: {
      title: "Intrested in more details?",
      body: "Feel free to contact our team using the Contact Form. We will answer your question within 24 hours.",
      cta: "CONTACT US",
      href: "/#contactus",
      phone_image: "/images/manufacturing/phone-cta.png",
    },
  } satisfies ManufacturingCtas,
  privacyMeta: {
    title: "Privacy Policy • WinDoor Quote",
    description:
      "How WinDoor Quote collects, uses, and protects personal information when you visit our website or use our apps and services.",
    hero_title: "Privacy Policy",
    hero_body:
      "Thank you for visit our website. When you visit our website, you trust us with your personal information. We take your privacy very seriously.",
  } satisfies PrivacyMetaSettings,
};

type ManufacturingSection = {
  title: string;
  body: string;
  image: string;
};
