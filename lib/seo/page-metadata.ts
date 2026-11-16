import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";

type PageMetaInput = {
  title: string;
  description: string;
  /** Path without domain, no trailing slash (except home → "/"). */
  path: string;
};

/** Per-page title/description/canonical + matching Open Graph / Twitter. */
export function buildPageMetadata({
  title,
  description,
  path,
}: PageMetaInput): Metadata {
  const canonicalPath = path === "/" ? "/" : path.replace(/\/+$/, "");
  const url = absoluteUrl(canonicalPath);

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: absoluteUrl("/images/hero.jpg"),
          width: 1200,
          height: 630,
          alt: "WinDoor Quote manufacturing software",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    // Ensure pages don't inherit a homepage-only robots override later.
    metadataBase: new URL(SITE_URL),
  };
}
