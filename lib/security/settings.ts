import type { SiteSecuritySettings } from "@/lib/content/types";

export const SITE_SECURITY_KEY = "site_security";

/** Always allowed when country blocking is on — site is US-focused. */
export const ALWAYS_ALLOWED_COUNTRY = "US";

export const defaultSiteSecuritySettings: SiteSecuritySettings = {
  country_block_enabled: false,
  allowed_countries: [],
  spam_protection_enabled: true,
  honeypot_enabled: true,
  min_submit_seconds: 3,
  rate_limit_enabled: true,
  rate_limit_max: 5,
  rate_limit_window_minutes: 60,
  max_links_in_message: 3,
};

export function normalizeSiteSecuritySettings(
  row: Partial<SiteSecuritySettings> & {
    /** @deprecated old blocklist shape */
    blocked_countries?: string[];
    block_disposable_emails?: boolean;
  } | null | undefined,
): SiteSecuritySettings {
  const allowed = Array.isArray(row?.allowed_countries)
    ? row.allowed_countries
        .map((code) => String(code).trim().toUpperCase())
        .filter((code) => /^[A-Z]{2}$/.test(code))
        .filter((code) => code !== ALWAYS_ALLOWED_COUNTRY)
    : [];

  return {
    country_block_enabled: Boolean(row?.country_block_enabled),
    allowed_countries: [...new Set(allowed)].sort(),
    spam_protection_enabled:
      row?.spam_protection_enabled === undefined
        ? true
        : Boolean(row.spam_protection_enabled),
    honeypot_enabled:
      row?.honeypot_enabled === undefined
        ? true
        : Boolean(row.honeypot_enabled),
    min_submit_seconds: Math.max(
      0,
      Number(
        row?.min_submit_seconds ??
          defaultSiteSecuritySettings.min_submit_seconds,
      ) || 0,
    ),
    rate_limit_enabled:
      row?.rate_limit_enabled === undefined
        ? true
        : Boolean(row.rate_limit_enabled),
    rate_limit_max: Math.max(
      1,
      Number(row?.rate_limit_max ?? defaultSiteSecuritySettings.rate_limit_max) ||
        1,
    ),
    rate_limit_window_minutes: Math.max(
      1,
      Number(
        row?.rate_limit_window_minutes ??
          defaultSiteSecuritySettings.rate_limit_window_minutes,
      ) || 1,
    ),
    max_links_in_message: Math.max(
      0,
      Number(
        row?.max_links_in_message ??
          defaultSiteSecuritySettings.max_links_in_message,
      ) || 0,
    ),
  };
}

/** True when this visitor may see the public site. */
export function isCountryAllowed(
  settings: SiteSecuritySettings,
  countryCode: string | null,
): boolean {
  if (!settings.country_block_enabled) return true;
  // No geo signal (local/dev) — do not lock out the site.
  if (!countryCode) return true;
  if (countryCode === ALWAYS_ALLOWED_COUNTRY) return true;
  return settings.allowed_countries.includes(countryCode);
}
