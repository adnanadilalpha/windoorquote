/** Resolve image paths for public or Supabase Storage URLs. Safe for client+server. */
export function mediaUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/media/${path}`;
}
