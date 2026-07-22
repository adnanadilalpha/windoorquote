import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  canonicalStoragePath,
  publicUrlToStoragePath,
} from "@/lib/admin/media-paths";

const BUCKET = "media";

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

function resolvePath(options: UploadOptions, file: File) {
  if (options.replaceStoragePath) {
    return options.replaceStoragePath.replace(/^\/+/, "");
  }
  if (options.filename) {
    return canonicalStoragePath(options.folder, options.filename);
  }
  const ext = file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf("."))
    : "";
  const base = file.name
    .replace(ext, "")
    .replace(/[^a-z0-9.-]+/gi, "-")
    .toLowerCase();
  return `${options.folder.replace(/^\/+|\/+$/g, "")}/${Date.now()}-${base}${ext}`;
}

export async function uploadMediaAsset(
  file: File,
  options: UploadOptions,
): Promise<UploadedMedia> {
  const supabase = createAdminClient();
  const storagePath = resolvePath(options, file);
  const buffer = Buffer.from(await file.arrayBuffer());
  const mime = file.type || "application/octet-stream";

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
    ? options.replaceStoragePath
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
