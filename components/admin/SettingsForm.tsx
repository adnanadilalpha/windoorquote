"use client";

import { FormEvent, useState, useTransition } from "react";
import { upsertSetting } from "@/lib/actions/cms";
import { MediaField } from "@/components/admin/MediaField";

type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "url" | "image";
  rows?: number;
  folder?: string;
  imageVariant?: "default" | "logo" | "icon";
};

type Props = {
  settingKey: string;
  initial: Record<string, unknown>;
  fields: Field[];
};

const IMAGE_HINTS = [
  "image",
  "logo",
  "thumb",
  "cover",
  "photo",
  "phone_image",
];

function isImageField(field: Field) {
  if (field.type === "image") return true;
  const key = field.name.toLowerCase();
  return IMAGE_HINTS.some((h) => key === h || key.endsWith(`_${h}`) || key.endsWith(`.${h}`));
}

function getValue(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur && typeof cur === "object") {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return "";
    }
  }
  return cur == null ? "" : String(cur);
}

function setValue(
  obj: Record<string, unknown>,
  path: string,
  value: string,
): Record<string, unknown> {
  const parts = path.split(".");
  if (parts.length === 1) return { ...obj, [path]: value };
  const [head, ...rest] = parts;
  const child = (obj[head] as Record<string, unknown>) ?? {};
  return { ...obj, [head]: setValue(child, rest.join("."), value) };
}

export default function SettingsForm({
  settingKey,
  initial,
  fields,
}: Props) {
  const [values, setValues] = useState(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      setMessage(null);
      setError(null);
      const result = await upsertSetting(settingKey, values);
      if (result.error) setError(result.error);
      else setMessage("Saved.");
    });
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {message ? (
        <div className="rounded-[10px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {fields.map((field) =>
        isImageField(field) ? (
          <MediaField
            key={field.name}
            label={field.label}
            value={getValue(values, field.name)}
            onChange={(url) => setValues(setValue(values, field.name, url))}
            folder={field.folder ?? settingKey}
            variant={field.imageVariant ?? (field.name.includes("logo") ? "logo" : "default")}
          />
        ) : (
          <label key={field.name} className="flex flex-col gap-1.5">
            <span className="text-sm text-navy-800/80">{field.label}</span>
            {field.type === "textarea" ? (
              <textarea
                rows={field.rows ?? 4}
                value={getValue(values, field.name)}
                onChange={(e) =>
                  setValues(setValue(values, field.name, e.target.value))
                }
                className="rounded-[10px] border border-navy-800/12 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            ) : (
              <input
                type={field.type === "url" ? "url" : "text"}
                value={getValue(values, field.name)}
                onChange={(e) =>
                  setValues(setValue(values, field.name, e.target.value))
                }
                className="h-11 rounded-lg border border-navy-800/12 bg-white px-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            )}
          </label>
        ),
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-deep disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
