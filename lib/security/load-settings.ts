import {
  defaultSiteSecuritySettings,
  normalizeSiteSecuritySettings,
  SITE_SECURITY_KEY,
} from "@/lib/security/settings";
import type { SiteSecuritySettings } from "@/lib/content/types";

type CacheEntry = { at: number; settings: SiteSecuritySettings };

declare global {
  // eslint-disable-next-line no-var
  var __wdqSecuritySettingsCache: CacheEntry | undefined;
}

const CACHE_TTL_MS = 30_000;

async function fetchSecuritySettings(): Promise<SiteSecuritySettings> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return defaultSiteSecuritySettings;

  try {
    const res = await fetch(
      `${url}/rest/v1/site_settings?key=eq.${SITE_SECURITY_KEY}&select=value`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Accept: "application/json",
        },
        // Fresh enough for toggles; middleware cannot use next.revalidate reliably.
        cache: "no-store",
      },
    );

    if (!res.ok) return defaultSiteSecuritySettings;
    const rows = (await res.json()) as Array<{ value?: Partial<SiteSecuritySettings> }>;
    return normalizeSiteSecuritySettings(rows[0]?.value);
  } catch {
    return defaultSiteSecuritySettings;
  }
}

/** Cached read for middleware / edge-friendly country checks. */
export async function getSiteSecuritySettingsCached(): Promise<SiteSecuritySettings> {
  const now = Date.now();
  const cached = globalThis.__wdqSecuritySettingsCache;
  if (cached && now - cached.at < CACHE_TTL_MS) {
    return cached.settings;
  }

  const settings = await fetchSecuritySettings();
  globalThis.__wdqSecuritySettingsCache = { at: now, settings };
  return settings;
}

export function clearSiteSecuritySettingsCache() {
  globalThis.__wdqSecuritySettingsCache = undefined;
}
