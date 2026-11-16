import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/** Every real public marketing page — absolute www URLs, no trailing slash. */
const PUBLIC_PATHS: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  {
    path: "/window-and-door-manufacturing-software",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PUBLIC_PATHS.map(({ path, changeFrequency, priority }) => ({
    url: path ? `${SITE_URL}${path}` : SITE_URL,
    lastModified,
    changeFrequency,
    priority,
  }));
}
