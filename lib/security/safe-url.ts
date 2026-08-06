/**
 * Sanitize user/CMS-controlled URLs for use in href attributes.
 * Allows relative paths, hash links, and http(s) absolute URLs.
 */
export function safeHref(
  href: string | null | undefined,
  fallback = "#",
): string {
  if (!href || typeof href !== "string") return fallback;
  const trimmed = href.trim();
  if (!trimmed) return fallback;

  // Relative site path (not protocol-relative //evil.com)
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    if (/[\s<>"'`]/.test(trimmed) || trimmed.includes("\\")) return fallback;
    return trimmed;
  }

  // In-page hash
  if (trimmed.startsWith("#")) {
    if (/[\s<>"'`]/.test(trimmed)) return fallback;
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return trimmed;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

/**
 * Post-login redirect must stay on same-origin admin paths only.
 */
export function safeAdminNextPath(
  next: string | null | undefined,
  fallback = "/admin/home",
): string {
  if (!next || typeof next !== "string") return fallback;
  const trimmed = next.trim();
  if (!trimmed) return fallback;

  if (!trimmed.startsWith("/admin")) return fallback;
  if (trimmed.startsWith("//")) return fallback;
  if (trimmed.includes("://") || trimmed.includes("\\")) return fallback;
  if (/[\s<>"'`]/.test(trimmed)) return fallback;

  try {
    const decoded = decodeURIComponent(trimmed);
    if (!decoded.startsWith("/admin")) return fallback;
    if (decoded.startsWith("//") || decoded.includes("://")) return fallback;
  } catch {
    return fallback;
  }

  // Path + optional query only (no open-redirect tricks)
  if (!/^\/admin(?:\/[\w./-]*)?(?:\?[\w=&%.+-]*)?$/.test(trimmed)) {
    return fallback;
  }

  return trimmed;
}
