import type { Redirect } from "next/dist/lib/load-custom-routes";

/**
 * Permanent redirects that should stay (dealers + apex → www).
 * Old blog/article URLs are intentionally NOT redirected — they 404
 * (or 410 when they match spam patterns in middleware).
 */

const DEALERS = "https://wdq.windoorquote.com/dealers/login";

function withOptionalTrailingSlash(
  path: string,
  destination: string,
): Redirect[] {
  const base = path.replace(/\/$/, "");
  return [
    { source: base, destination, permanent: true },
    { source: `${base}/`, destination, permanent: true },
  ];
}

export function getLegacyRedirects(): Redirect[] {
  return [
    // Apex host → www in one hop (308). Complements Vercel HTTPS.
    {
      source: "/:path*",
      has: [{ type: "host", value: "windoorquote.com" }],
      destination: "https://www.windoorquote.com/:path*",
      permanent: true,
    },

    // sitemap_index → sitemap is handled in middleware as HTTP 301.

    ...withOptionalTrailingSlash("/dealers", DEALERS),
    ...withOptionalTrailingSlash("/dealer", DEALERS),
  ];
}
