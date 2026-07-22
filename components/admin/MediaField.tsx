"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, RefreshCw, Trash2 } from "lucide-react";
import { UploadProgressPanel } from "@/components/admin/UploadProgressPanel";
import {
  canonicalStoragePath,
  publicUrlToStoragePath,
} from "@/lib/admin/media-paths";
import { uploadMediaWithProgress } from "@/lib/admin/upload-media-client";
import { cn } from "@/lib/utils";

type MediaFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  filename?: string;
  altText?: string;
  variant?: "default" | "logo" | "icon";
  accept?: string;
};

type UploadState = {
  fileName: string;
  fileSize: number;
  loaded: number;
  total: number;
  percent: number;
  processing: boolean;
};

export function MediaField({
  label,
  value,
  onChange,
  folder = "uploads",
  filename,
  altText,
  variant = "default",
  accept = "image/*",
}: MediaFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<UploadState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const uploading = uploadState !== null;

  async function handleUpload(file: File) {
    setUploadState({
      fileName: file.name,
      fileSize: file.size,
      loaded: 0,
      total: file.size,
      percent: 0,
      processing: false,
    });
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      if (filename) formData.append("filename", filename);
      if (altText) formData.append("altText", altText);

      const replacePath =
        (value ? publicUrlToStoragePath(value) : null) ??
        (filename ? canonicalStoragePath(folder, filename) : null);
      if (replacePath) formData.append("replaceStoragePath", replacePath);

      const media = await uploadMediaWithProgress(formData, (progress) => {
        setUploadState((current) =>
          current
            ? {
                ...current,
                loaded: progress.loaded,
                total: progress.total,
                percent: progress.percent,
                processing: progress.percent >= 100,
              }
            : current,
        );
      });

      onChange(media.publicUrl);
      setUploadState(null);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed.",
      );
      setUploadState(null);
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const frameClass =
    variant === "icon"
      ? "h-20 w-20"
      : variant === "logo"
        ? "h-20 max-w-[200px]"
        : "h-28 max-w-xs";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-navy-800/80">{label}</label>

      <div className="inline-flex max-w-full flex-col overflow-hidden rounded-lg border border-navy-800/10 bg-white">
        {uploadState ? (
          <div className={cn("flex items-center justify-center bg-paper-50 px-3 py-4", frameClass)}>
            <UploadProgressPanel
              fileName={uploadState.fileName}
              fileSize={uploadState.fileSize}
              loaded={uploadState.loaded}
              total={uploadState.total}
              percent={uploadState.percent}
              processing={uploadState.processing}
              className="w-full max-w-55"
            />
          </div>
        ) : value.trim() ? (
          <div
            className={cn(
              "relative flex items-center justify-center bg-paper-50 p-2",
              frameClass,
            )}
          >
            <Image
              key={value}
              src={value}
              alt={altText ?? label}
              width={variant === "icon" ? 56 : variant === "logo" ? 160 : 200}
              height={variant === "icon" ? 56 : variant === "logo" ? 56 : 96}
              className="max-h-full max-w-full object-contain"
              style={{ width: "auto", height: "auto" }}
              unoptimized
            />
          </div>
        ) : (
          <div
            className={cn(
              "flex items-center justify-center bg-paper-50 px-3 text-xs text-body-muted",
              frameClass,
            )}
          >
            No image
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 border-t border-navy-800/8 bg-white p-2">
          {!uploading ? (
            <>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-md border border-navy-800/12 px-2.5 py-1 text-xs font-medium text-navy-800 hover:bg-paper-50"
              >
                {value ? (
                  <RefreshCw className="size-3" />
                ) : (
                  <ImagePlus className="size-3" />
                )}
                {value ? "Replace" : "Upload"}
              </button>
              {value ? (
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="inline-flex items-center gap-1.5 rounded-md border border-navy-800/12 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="size-3" />
                  Remove
                </button>
              ) : null}
            </>
          ) : null}
        </div>
      </div>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleUpload(file);
        }}
      />
    </div>
  );
}
