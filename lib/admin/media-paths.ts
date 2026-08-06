const BUCKET = "media";
const PUBLIC_MARKER = `/storage/v1/object/public/${BUCKET}/`;

export const MAX_MEDIA_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
]);

export function formatFileSize(bytes: number) {
  if (!bytes || bytes < 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function publicUrlToStoragePath(url: string): string | null {
  if (!url) return null;
  try {
    if (url.includes(PUBLIC_MARKER)) {
      return decodeURIComponent(url.split(PUBLIC_MARKER)[1]?.split("?")[0] ?? "");
    }
  } catch {
    return null;
  }
  return null;
}

/** Reject path traversal and unsafe characters in a single path segment. */
export function sanitizePathSegment(segment: string): string {
  return segment
    .replace(/\\/g, "/")
    .split("/")
    .filter((part) => part && part !== "." && part !== "..")
    .join("-")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export function canonicalStoragePath(folder: string, filename: string) {
  const cleanFolder = sanitizePathSegment(folder.replace(/^\/+|\/+$/g, ""));
  const cleanName = sanitizePathSegment(filename.replace(/^\/+/g, ""));
  if (!cleanFolder || !cleanName) {
    throw new Error("Invalid storage path.");
  }
  return `${cleanFolder}/${cleanName}`;
}

/**
 * Ensure a replace path stays inside an allowlisted folder with no traversal.
 */
export function sanitizeReplaceStoragePath(
  path: string,
  allowedFolders: ReadonlySet<string>,
): string {
  const cleaned = path.replace(/^\/+/, "").replace(/\\/g, "/");
  if (!cleaned || cleaned.includes("..") || cleaned.startsWith("/")) {
    throw new Error("Invalid replace path.");
  }

  const parts = cleaned.split("/").filter(Boolean);
  if (parts.length < 2) {
    throw new Error("Invalid replace path.");
  }

  const folder = parts[0];
  if (!allowedFolders.has(folder)) {
    throw new Error("Folder is not allowed.");
  }

  const safeParts = parts.map((part) => sanitizePathSegment(part));
  if (safeParts.some((part) => !part)) {
    throw new Error("Invalid replace path.");
  }

  return safeParts.join("/");
}
