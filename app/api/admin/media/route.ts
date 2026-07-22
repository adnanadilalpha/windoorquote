import { NextResponse } from "next/server";
import { uploadMediaAsset } from "@/lib/admin/media-storage";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  const folderValue = formData.get("folder");
  if (typeof folderValue !== "string" || !folderValue.trim()) {
    return NextResponse.json({ error: "Folder is required." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "File is required." }, { status: 400 });
  }

  try {
    const media = await uploadMediaAsset(file, {
      folder: folderValue.trim(),
      filename:
        typeof formData.get("filename") === "string"
          ? String(formData.get("filename"))
          : undefined,
      replaceStoragePath:
        typeof formData.get("replaceStoragePath") === "string"
          ? String(formData.get("replaceStoragePath"))
          : undefined,
      altText:
        typeof formData.get("altText") === "string"
          ? String(formData.get("altText"))
          : undefined,
      userId: user.id,
    });

    return NextResponse.json(media);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
