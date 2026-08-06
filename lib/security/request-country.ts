import type { NextRequest } from "next/server";

/** Resolve visitor country from platform-set CDN headers (ISO 3166-1 alpha-2). */
export function getRequestCountry(request: NextRequest): string | null {
  // Only trust headers set by the hosting edge (Vercel / Cloudflare).
  // Do not trust client-spoofable custom headers like x-country-code.
  const fromHeader =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry");

  const code = (fromHeader || "").trim().toUpperCase();
  if (!code || code === "XX" || code === "T1") return null;
  if (!/^[A-Z]{2}$/.test(code)) return null;
  return code;
}

export function getClientIp(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip") || headers.get("cf-connecting-ip") || null;
}
