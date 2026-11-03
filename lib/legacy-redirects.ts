import type { Redirect } from "next/dist/lib/load-custom-routes";

/**
 * Permanent redirects for retired WordPress URLs.
 * Destination is the closest matching live page — never bare homepage
 * when a more specific page exists.
 *
 * Spam / compromised WP paths (e.g. /main casino posts) are intentionally
 * omitted so they keep returning 404.
 */

/** Closest live topical page; form lives on this page for conversion. */
const MFG = "/window-and-door-manufacturing-software";
const DEALERS = "https://wdq.windoorquote.com/dealers/login";

/** Consumer / industry articles → manufacturing software (closest topical page). */
const ARTICLE_SLUGS = [
  "2021-best-of-houzz-award",
  "benefits-of-insulated-front-doors-energy-efficient-doors-explained",
  "best-windows-for-canadian-winters",
  "best-windows-for-the-living-room",
  "canada-greener-homes-grant-the-new-home-retrofit-program",
  "cost-benefit-analysis-of-the-retrofit-home-program",
  "double-hung-vs-casement-everything-you-need-to-know",
  "eco-choice-windows-doors-awarded-best-of-homestars-2021",
  "eco-choice-windows-doors-crowned-2020-homestars-best-of-award-winner",
  "fabulous-fensterbau",
  "february-5-2022",
  "fiberglass-vs-steel-door-what-is-a-better-entry-door-option",
  "frequent-problems-caused-by-poor-window-installation",
  "greener-homes-grant-windows-doors",
  "how-energy-efficient-windows-help-during-summers",
  "how-much-will-energy-efficient-windows-save-you",
  "increase-the-value-of-your-home-with-new-doors-find-out-how",
  "january-28-2022",
  "missing-one-of-our-own",
  "must-watch-home-improvement-shows-on-hgtv-netflix-and-amazon",
  "questions-you-need-to-ask-your-window-company",
  "school-days",
  "soaking-in-43-years-of-wisdom",
  "tips-for-choosing-your-next-sliding-patio-doors",
  "tips-to-winterize-your-windows",
  "top-5-hidden-benefits-of-getting-new-windows",
  "top-8-questions-about-window-replacement-answered",
  "ultimate-replacement-window-buying-guide",
  "update-window-and-door-replacement-during-covid-19",
  "what-a-difference-a-space-makes",
  "your-guide-to-selecting-the-right-patio-door",
] as const;

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
  const redirects: Redirect[] = [
    // Apex host → www (308). Complements the Vercel project domain redirect.
    {
      source: "/:path*",
      has: [{ type: "host", value: "windoorquote.com" }],
      destination: "https://www.windoorquote.com/:path*",
      permanent: true,
    },

    ...withOptionalTrailingSlash("/dealers", DEALERS),
    ...withOptionalTrailingSlash("/dealer", DEALERS),
    ...withOptionalTrailingSlash("/blog", MFG),
    ...withOptionalTrailingSlash("/development-updates", MFG),
    ...withOptionalTrailingSlash("/category/windows", MFG),
    ...withOptionalTrailingSlash("/category/doors", MFG),
    ...withOptionalTrailingSlash("/category/window-and-door", MFG),
    ...withOptionalTrailingSlash("/category/uncategorized", MFG),
  ];

  for (const slug of ARTICLE_SLUGS) {
    redirects.push(...withOptionalTrailingSlash(`/${slug}`, MFG));
  }

  return redirects;
}
