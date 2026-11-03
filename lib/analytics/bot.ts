/**
 * Detect automated traffic that should never enter audience analytics.
 * Real browsers still get through; scrapers / uptime bots / headless suites do not.
 */

const BOT_UA_PATTERN =
  /bot|crawl|spider|slurp|facebookexternalhit|embedly|quora link preview|whatsapp|telegram|discordbot|preview|monitor|uptimerobot|pingdom|statuscake|headless|phantomjs|selenium|playwright|puppeteer|lighthouse|pagespeed|gtmetrix|ahrefs|semrush|mj12bot|dotbot|petalbot|bytespider|gptbot|claudebot|anthropic|chatgpt|bingpreview|yandexbot|baiduspider|duckduckbot|applebot|twitterbot|linkedinbot|pinterest|redditbot|httpclient|python-requests|go-http|java\/|okhttp|curl\/|wget\/|libwww|scrapy|aiohttp|node-fetch|axios\//i;

/**
 * Cloud / crawler exit nodes that dominate junk on this property.
 * Only unengaged hits from these cities are dropped in reporting —
 * a real visitor from Seattle who stays 10s+ still counts.
 */
const AUTOMATED_HUB_CITIES = new Set([
  "ashburn",
  "boardman",
  "the dalles",
  "council bluffs",
  "sterling",
  "manassas",
  "seattle",
  "dallas",
  "newark",
  "singapore",
]);

/** Hard cap for time-on-page (tabs left open overnight). */
export const MAX_SESSION_DURATION_SECONDS = 30 * 60;

/** Minimum dwell to count as engaged (GA4-style). */
export const ENGAGED_SESSION_SECONDS = 10;

export function isBotUserAgent(userAgent: string | null | undefined): boolean {
  const ua = (userAgent ?? "").trim();
  if (!ua) return true;
  if (ua.length < 20) return true;
  return BOT_UA_PATTERN.test(ua);
}

export function clampAnalyticsDuration(
  value: number | null | undefined,
): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const rounded = Math.round(value);
  if (rounded <= 0) return null;
  return Math.min(MAX_SESSION_DURATION_SECONDS, Math.max(1, rounded));
}

export function isAutomatedHubCity(city: string | null | undefined): boolean {
  if (!city) return false;
  return AUTOMATED_HUB_CITIES.has(city.trim().toLowerCase());
}

/**
 * Historical junk signal: crawler hubs with no real dwell time.
 * Do not trust is_bounce — that flag was wrong for a long stretch.
 */
export function isLikelyAutomatedView(view: {
  city?: string | null;
  duration_seconds?: number | null;
}): boolean {
  if (!isAutomatedHubCity(view.city)) return false;
  return (view.duration_seconds ?? 0) < ENGAGED_SESSION_SECONDS;
}
