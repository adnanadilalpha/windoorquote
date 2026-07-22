"use client";

import { FormEvent, useState, useTransition } from "react";
import { Plus, ChevronUp, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { createRow, deleteRow, reorderRows, updateRow } from "@/lib/actions/cms";
import { MediaField } from "@/components/admin/MediaField";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { cn } from "@/lib/utils";

export type CollectionField = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "url" | "select" | "image";
  options?: { value: string; label: string }[];
  rows?: number;
  folder?: string;
  imageVariant?: "default" | "logo" | "icon";
};

type Item = Record<string, unknown> & { id: string; sort_order?: number };

type Props = {
  table: string;
  items: Item[];
  fields: CollectionField[];
  titleKey?: string;
  defaults?: Record<string, unknown>;
};

const IMAGE_NAMES = new Set([
  "image_path",
  "logo_path",
  "thumb_path",
  "cover_path",
  "image",
  "phone_image",
]);

function isImageField(field: CollectionField) {
  return field.type === "image" || IMAGE_NAMES.has(field.name);
}

export default function CollectionEditor({
  table,
  items: initial,
  fields,
  titleKey = "title",
  defaults = {},
}: Props) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<Item | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const confirm = useConfirm();

  function openCreate() {
    const blank: Record<string, string> = {};
    fields.forEach((f) => {
      blank[f.name] = String(defaults[f.name] ?? "");
    });
    setForm(blank);
    setCreating(true);
    setEditing(null);
    setError(null);
    setMessage(null);
  }

  function openEdit(item: Item) {
    const next: Record<string, string> = {};
    fields.forEach((f) => {
      next[f.name] = item[f.name] == null ? "" : String(item[f.name]);
    });
    setForm(next);
    setEditing(item);
    setCreating(false);
    setError(null);
    setMessage(null);
  }

  function closeForm() {
    setEditing(null);
    setCreating(false);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      setError(null);
      setMessage(null);
      const payload: Record<string, unknown> = creating
        ? { ...defaults, ...form }
        : { ...form };
      if (creating) {
        payload.sort_order = items.length;
        const result = await createRow(table, payload);
        if (result.error) {
          setError(result.error);
          return;
        }
        if (result.data) setItems([...items, result.data as Item]);
        setMessage("Created.");
        closeForm();
      } else if (editing) {
        const result = await updateRow(table, editing.id, payload);
        if (result.error) {
          setError(result.error);
          return;
        }
        setItems(
          items.map((it) =>
            it.id === editing.id ? { ...it, ...payload } : it,
          ),
        );
        setMessage("Updated.");
        closeForm();
      }
    });
  }

  async function onDelete(id: string) {
    const ok = await confirm({
      title: "Delete item?",
      description: "This cannot be undone.",
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    startTransition(async () => {
      const result = await deleteRow(table, id);
      if (result.error) {
        setError(result.error);
        return;
      }
      setItems(items.filter((it) => it.id !== id));
      setMessage("Deleted.");
    });
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...items];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    setItems(next);
    startTransition(async () => {
      await reorderRows(
        table,
        next.map((it) => it.id),
      );
    });
  }

  const previewKey =
    fields.find((f) => isImageField(f))?.name ??
    "image_path";

  return (
    <div className="space-y-4">
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

      <div className="flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-deep"
        >
          <Plus className="size-4" />
          Add new
        </button>
      </div>

      {(creating || editing) && (
        <div className="overflow-hidden rounded-[14px] border border-navy-800/8 bg-white">
          <div className="border-b border-navy-800/6 px-5 py-4">
            <h2 className="text-sm font-semibold text-navy-800">
              {creating ? "New item" : "Edit item"}
            </h2>
          </div>
          <form className="space-y-4 px-5 py-5" onSubmit={onSubmit}>
            {fields.map((field) =>
              isImageField(field) ? (
                <MediaField
                  key={field.name}
                  label={field.label}
                  value={form[field.name] ?? ""}
                  onChange={(url) =>
                    setForm({ ...form, [field.name]: url })
                  }
                  folder={field.folder ?? table}
                  variant={field.imageVariant ?? "default"}
                />
              ) : (
                <label key={field.name} className="flex flex-col gap-1.5">
                  <span className="text-sm text-navy-800/80">{field.label}</span>
                  {field.type === "textarea" ? (
                    <textarea
                      rows={field.rows ?? 4}
                      value={form[field.name] ?? ""}
                      onChange={(e) =>
                        setForm({ ...form, [field.name]: e.target.value })
                      }
                      required={
                        field.name === titleKey || field.name === "name"
                      }
                      className="rounded-[10px] border border-navy-800/12 bg-white px-3 py-2.5 text-sm text-navy-800 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  ) : field.type === "select" ? (
                    <select
                      value={form[field.name] ?? ""}
                      onChange={(e) =>
                        setForm({ ...form, [field.name]: e.target.value })
                      }
                      className="h-11 rounded-lg border border-navy-800/12 bg-white px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    >
                      {(field.options ?? []).map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type === "url" ? "url" : "text"}
                      value={form[field.name] ?? ""}
                      onChange={(e) =>
                        setForm({ ...form, [field.name]: e.target.value })
                      }
                      required={
                        field.name === titleKey || field.name === "name"
                      }
                      className="h-11 rounded-lg border border-navy-800/12 bg-white px-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  )}
                </label>
              ),
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="submit"
                disabled={pending}
                className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-deep disabled:opacity-60"
              >
                {pending ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border border-navy-800/12 bg-white px-4 py-2 text-sm font-medium text-navy-800 hover:bg-paper-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-[14px] border border-navy-800/8 bg-white">
        {items.length === 0 ? (
          <p className="px-5 py-8 text-sm text-body-muted">No items yet.</p>
        ) : (
          <ul className="divide-y divide-navy-800/6">
            {items.map((item, index) => {
              const preview = String(item[previewKey] ?? "");
              return (
                <li
                  key={item.id}
                  className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center"
                >
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview}
                      alt=""
                      className="size-11 shrink-0 rounded-md border border-navy-800/8 object-contain bg-paper-50"
                    />
                  ) : (
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-md border border-dashed border-navy-800/15 bg-paper-50 text-[10px] text-body-muted">
                      No img
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy-800">
                      {String(item[titleKey] ?? item.name ?? "Item")}
                    </p>
                    <p className="truncate text-xs text-body-muted">
                      {String(
                        item.description ??
                          item.role ??
                          item.href ??
                          item.youtube_url ??
                          "",
                      ).slice(0, 140)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <IconBtn
                      onClick={() => move(index, -1)}
                      disabled={index === 0 || pending}
                      label="Move up"
                    >
                      <ChevronUp className="size-4" />
                    </IconBtn>
                    <IconBtn
                      onClick={() => move(index, 1)}
                      disabled={index === items.length - 1 || pending}
                      label="Move down"
                    >
                      <ChevronDown className="size-4" />
                    </IconBtn>
                    <IconBtn onClick={() => openEdit(item)} label="Edit">
                      <Pencil className="size-4" />
                    </IconBtn>
                    <IconBtn
                      onClick={() => onDelete(item.id)}
                      label="Delete"
                      danger
                    >
                      <Trash2 className="size-4" />
                    </IconBtn>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
  label,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-full border border-navy-800/12 bg-white text-navy-800 transition hover:bg-paper-50 disabled:opacity-40",
        danger && "text-red-700 hover:bg-red-50",
      )}
    >
      {children}
    </button>
  );
}
