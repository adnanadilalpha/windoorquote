export type SiteSettingKey =
  | "site_meta"
  | "header"
  | "footer"
  | "home_hero"
  | "home_about"
  | "home_contact"
  | "home_section_labels"
  | "manufacturing_meta"
  | "manufacturing_hero"
  | "manufacturing_one_app"
  | "manufacturing_cut_once"
  | "manufacturing_ctas"
  | "privacy_meta";

export type NavLink = {
  id: string;
  label: string;
  href: string;
  sort_order: number;
};

export type Feature = {
  id: string;
  title: string;
  description: string;
  image_path: string;
  sort_order: number;
};

export type Client = {
  id: string;
  name: string;
  logo_path: string;
  href: string;
  sort_order: number;
};

export type Testimonial = {
  id: string;
  author: string;
  role: string;
  quote: string;
  logo_path: string;
  sort_order: number;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_path: string;
  sort_order: number;
};

export type Video = {
  id: string;
  title: string;
  youtube_url: string;
  thumb_path: string;
  sort_order: number;
};

export type ManufacturingPartner = {
  id: string;
  name: string;
  logo_path: string;
  sort_order: number;
};

export type ManufacturingCard = {
  id: string;
  section: "one_app" | "cut_once";
  title: string;
  body: string;
  icon: string;
  sort_order: number;
};

export type PrivacySection = {
  id: string;
  section_key: string;
  title: string | null;
  sort_order: number;
};

export type PrivacyBlock = {
  id: string;
  section_id: string;
  block_type: "p" | "short" | "list" | "plink";
  payload: Record<string, unknown>;
  sort_order: number;
};

export type ContactSubmission = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  source_page: string;
  created_at: string;
  read_at: string | null;
  email_status?: "skipped" | "sent" | "failed";
  email_error?: string | null;
};

export type ContactEmailSettings = {
  enabled: boolean;
  /** Always "smtp" for custom mailbox delivery. */
  provider: "smtp" | "resend" | "brevo";
  to_email: string;
  from_email: string;
  from_name: string;
  reply_to_submitter: boolean;
  resend_api_key: string;
  smtp_host: string;
  smtp_port: number;
  smtp_secure: boolean;
  smtp_user: string;
  smtp_pass: string;
};

export type MediaAsset = {
  id: string;
  path: string;
  bucket: string;
  alt: string;
  mime: string;
  size: number;
  created_at: string;
};

export type SiteMeta = {
  title: string;
  description: string;
};

export type HeaderSettings = {
  logo_path: string;
  logo_alt: string;
  cta_label: string;
  cta_href: string;
};

export type FooterSettings = {
  copyright_year: string;
  brand_name: string;
  brand_href: string;
  manufacturing_label: string;
  manufacturing_href: string;
  privacy_label: string;
  privacy_href: string;
};

export type HomeHero = {
  image: string;
  title: string;
  lead: string;
  cta_label: string;
  cta_href: string;
  scroll_href: string;
};

export type HomeAbout = {
  location: string;
  title: string;
  mission_lead: string;
  body: string;
  process: string[];
};

export type HomeContact = {
  kicker: string;
  title: string;
  body: string;
  points: string[];
  form_heading: string;
  submit_label: string;
  hint: string;
  success_message: string;
};

export type HomeSectionLabels = {
  features_kicker: string;
  features_title: string;
  clients_kicker: string;
  clients_title: string;
  testimonials_kicker: string;
  testimonials_title: string;
  team_kicker: string;
  team_title: string;
  videos_kicker: string;
  videos_title: string;
};

export type ManufacturingHero = {
  title: string;
  body: string;
  cta: string;
  image: string;
};

export type ManufacturingSection = {
  title: string;
  body: string;
  image: string;
};

export type ManufacturingCtas = {
  videos: { title: string; body: string; cta: string; href: string };
  contact: {
    title: string;
    body: string;
    cta: string;
    href: string;
    phone_image: string;
  };
};

export type PrivacyMetaSettings = {
  title: string;
  description: string;
  hero_title: string;
  hero_body: string;
};
