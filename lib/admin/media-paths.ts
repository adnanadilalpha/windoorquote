const BUCKET = "media";
const PUBLIC_MARKER = `/storage/v1/object/public/${BUCKET}/`;

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

export function canonicalStoragePath(folder: string, filename: string) {
  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
  const cleanName = filename.replace(/^\/+/g, "");
  return `${cleanFolder}/${cleanName}`;
}
