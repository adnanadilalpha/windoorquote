import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { MEDIA_FOLDERS, isMediaFolder } from "@/lib/content/cms-tables";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_MEDIA_UPLOAD_BYTES,
  canonicalStoragePath,
  publicUrlToStoragePath,
  sanitizePathSegment,
  sanitizeReplaceStoragePath,
} from "@/lib/admin/media-paths";

const BUCKET = "media";
const ALLOWED_FOLDER_SET = new Set<string>(MEDIA_FOLDERS);

export type UploadedMedia = {
  id: string;
  publicUrl: string;
  storagePath: string;
};

type UploadOptions = {
  folder: string;
  filename?: string;
  replaceStoragePath?: string;
  altText?: string;
  userId?: string;
};

function assertImageFile(file: File) {
  if (file.size <= 0) {
    throw new Error("File is required.");
  }
  if (file.size > MAX_MEDIA_UPLOAD_BYTES) {
    throw new Error("File is too large. Maximum size is 10 MB.");
  }
  const mime = (file.type || "").toLowerCase();
  if (!ALLOWED_IMAGE_MIME_TYPES.has(mime)) {
    throw new Error(
      "Unsupported file type. Please upload a JPEG, PNG, GIF, WebP, or AVIF image.",
    );
  }
  return mime;
}

function resolvePath(options: UploadOptions, file: File) {
  if (!isMediaFolder(options.folder.trim())) {
    throw new Error("Folder is not allowed.");
  }

  if (options.replaceStoragePath) {
    return sanitizeReplaceStoragePath(
      options.replaceStoragePath,
      ALLOWED_FOLDER_SET,
    );
  }

  if (options.filename) {
    return canonicalStoragePath(options.folder, options.filename);
  }

  const rawExt = file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf("."))
    : "";
  const ext = sanitizePathSegment(rawExt.replace(/^\./, ""));
  const base = sanitizePathSegment(
    file.name.includes(".")
      ? file.name.slice(0, file.name.lastIndexOf("."))
      : file.name,
  );
  const folder = sanitizePathSegment(options.folder);
  const name = `${Date.now()}-${base || "image"}${ext ? `.${ext}` : ""}`;
  return `${folder}/${name}`;
}

export async function uploadMediaAsset(
  file: File,
  options: UploadOptions,
): Promise<UploadedMedia> {
  const mime = assertImageFile(file);
  const supabase = createAdminClient();
  const storagePath = resolvePath(options, file);
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      upsert: true,
      contentType: mime,
      cacheControl: "3600",
    });

  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

  const bustedUrl = `${publicUrl}?v=${Date.now()}`;

  const existingPath = options.replaceStoragePath
    ? sanitizeReplaceStoragePath(options.replaceStoragePath, ALLOWED_FOLDER_SET)
    : null;

  let mediaId: string | null = null;
  if (existingPath) {
    const { data: existing } = await supabase
      .from("media_assets")
      .select("id")
      .ilike("path", `%${existingPath}%`)
      .maybeSingle();
    mediaId = existing?.id ?? null;
  }

  if (mediaId) {
    const { data, error } = await supabase
      .from("media_assets")
      .update({
        path: bustedUrl,
        alt: options.altText ?? "",
        mime,
        size: file.size,
      })
      .eq("id", mediaId)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: data.id, publicUrl: bustedUrl, storagePath };
  }

  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      path: bustedUrl,
      bucket: BUCKET,
      alt: options.altText ?? "",
      mime,
      size: file.size,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return { id: data.id, publicUrl: bustedUrl, storagePath };
}

export { publicUrlToStoragePath };
