/** Tables the CMS row CRUD actions may touch. */
export const CMS_ROW_TABLES = [
  "features",
  "clients",
  "testimonials",
  "team_members",
  "videos",
  "manufacturing_partners",
  "manufacturing_cards",
  "nav_links",
  "privacy_sections",
  "privacy_blocks",
] as const;

export type CmsRowTable = (typeof CMS_ROW_TABLES)[number];

const CMS_ROW_TABLE_SET = new Set<string>(CMS_ROW_TABLES);

export function isCmsRowTable(table: string): table is CmsRowTable {
  return CMS_ROW_TABLE_SET.has(table);
}

/** Keys allowed for site_settings upserts via upsertSetting. */
export const CMS_SETTING_KEYS = [
  "site_meta",
  "header",
  "footer",
  "home_hero",
  "home_section_labels",
  "home_about",
  "home_contact",
  "home_faq",
  "privacy_meta",
  "manufacturing_meta",
  "manufacturing_hero",
  "manufacturing_one_app",
  "manufacturing_cut_once",
  "manufacturing_ctas",
] as const;

export type CmsSettingKey = (typeof CMS_SETTING_KEYS)[number];

const CMS_SETTING_KEY_SET = new Set<string>(CMS_SETTING_KEYS);

export function isCmsSettingKey(key: string): key is CmsSettingKey {
  return CMS_SETTING_KEY_SET.has(key);
}

/** Storage folders admin uploads may write into. */
export const MEDIA_FOLDERS = [
  "hero",
  "features",
  "clients",
  "testimonials",
  "team",
  "videos",
  "manufacturing",
  "brand",
  "uploads",
] as const;

export type MediaFolder = (typeof MEDIA_FOLDERS)[number];

const MEDIA_FOLDER_SET = new Set<string>(MEDIA_FOLDERS);

export function isMediaFolder(folder: string): folder is MediaFolder {
  return MEDIA_FOLDER_SET.has(folder);
}
