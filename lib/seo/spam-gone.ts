/**
 * Old hacked WordPress / spam paths — respond with HTTP 410 Gone.
 * Matching is path + query only (no visual page).
 */

const SPAM_PATH_RE =
  /casino|slot|gambling|roulette|pinkcupid|dating/i;

const EXACT_GONE_PATHS = new Set([
  "/main",
  "/main/feed",
  "/homepage",
  "/thank-you",
  "/development-updates",
]);

export function shouldReturnGone(pathname: string, searchParams: URLSearchParams): boolean {
  const path = pathname.replace(/\/+$/, "") || "/";
  const lower = path.toLowerCase();

  if (searchParams.has("et_blog")) return true;

  if (EXACT_GONE_PATHS.has(lower)) return true;

  if (lower.startsWith("/main/")) return true;
  if (lower.startsWith("/development-updates/")) return true;
  if (lower.startsWith("/homepage/")) return true;
  if (lower.startsWith("/thank-you/")) return true;

  // Any WordPress feed URL, e.g. /foo/feed/ or /feed
  if (lower === "/feed" || lower.endsWith("/feed") || lower.includes("/feed/")) {
    return true;
  }

  if (SPAM_PATH_RE.test(lower)) return true;

  return false;
}
