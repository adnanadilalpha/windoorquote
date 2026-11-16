import type { NextRequest } from "next/server";
import { getClientIp } from "@/lib/security/request-country";

/** Well-known search crawler user agents (geo-block must never apply). */
const SEARCH_BOT_UA =
  /Googlebot|Google-InspectionTool|Bingbot|DuckDuckBot|Slurp|Applebot|Yandex(Bot|Images)|Baiduspider/i;

function isPrivateOrLocalIp(ip: string): boolean {
  const n = ip.toLowerCase();
  if (!n || n === "::1" || n === "127.0.0.1") return true;
  if (n.startsWith("10.") || n.startsWith("192.168.")) return true;
  const m = /^172\.(\d+)\./.exec(n);
  if (m) {
    const second = Number(m[1]);
    if (second >= 16 && second <= 31) return true;
  }
  return false;
}

function isVerifiedBotHostname(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/\.$/, "");
  return (
    h.endsWith(".googlebot.com") ||
    h.endsWith(".google.com") ||
    h.endsWith(".search.msn.com") ||
    h === "googlebot.com" ||
    h === "google.com" ||
    h === "search.msn.com"
  );
}

/**
 * True when the request looks like a search-engine crawler.
 * Uses UA first; reverse-DNS verifies when Node DNS is available.
 * Fails open on DNS errors so geo-block never hides the site from Google/Bing.
 */
export async function isSearchEngineCrawler(
  request: NextRequest,
): Promise<boolean> {
  const ua = request.headers.get("user-agent") ?? "";
  if (!SEARCH_BOT_UA.test(ua)) return false;

  const ip = getClientIp(request.headers);
  if (!ip || isPrivateOrLocalIp(ip)) return true;

  try {
    const dns = await import("node:dns/promises");
    const hosts = await Promise.race([
      dns.reverse(ip),
      new Promise<string[]>((_, reject) => {
        setTimeout(() => reject(new Error("rdns-timeout")), 400);
      }),
    ]);

    const matched = hosts.some(isVerifiedBotHostname);
    // UA claimed bot but rDNS says otherwise → treat as spoof, do not exempt.
    if (!matched) return false;
    return true;
  } catch {
    // Edge / timeout / no rDNS — UA match is enough for SEO availability.
    return true;
  }
}
