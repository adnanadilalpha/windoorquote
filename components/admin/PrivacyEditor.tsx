"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createRow,
  deleteRow,
  updateRow,
} from "@/lib/actions/cms";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import type { PrivacyBlock, PrivacySection } from "@/lib/content/types";

type SectionWithBlocks = {
  section: PrivacySection;
  blocks: PrivacyBlock[];
};

export default function PrivacyEditor({
  initial,
  metaForm,
}: {
  initial: SectionWithBlocks[];
  metaForm: React.ReactNode;
}) {
  const router = useRouter();
  const [sections, setSections] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const confirm = useConfirm();

  function updateBlockPayload(
    sectionId: string,
    blockId: string,
    payload: Record<string, unknown>,
  ) {
    setSections((prev) =>
      prev.map((s) =>
        s.section.id !== sectionId
          ? s
          : {
              ...s,
              blocks: s.blocks.map((b) =>
                b.id === blockId ? { ...b, payload } : b,
              ),
            },
      ),
    );
  }

  function saveBlock(block: PrivacyBlock) {
    startTransition(async () => {
      setError(null);
      const result = await updateRow("privacy_blocks", block.id, {
        payload: block.payload,
        block_type: block.block_type,
      });
      if (result.error) setError(result.error);
      else setMessage("Block saved.");
    });
  }

  function saveSectionTitle(section: PrivacySection, title: string) {
    startTransition(async () => {
      const result = await updateRow("privacy_sections", section.id, {
        title: title || null,
      });
      if (result.error) setError(result.error);
      else {
        setSections((prev) =>
          prev.map((s) =>
            s.section.id === section.id
              ? { ...s, section: { ...s.section, title } }
              : s,
          ),
        );
        setMessage("Section saved.");
      }
    });
  }

  function addSection(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const section_key = String(fd.get("section_key") ?? "").trim();
    const title = String(fd.get("title") ?? "").trim();
    if (!section_key) return;
    startTransition(async () => {
      const result = await createRow("privacy_sections", {
        section_key,
        title: title || null,
        sort_order: sections.length,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function addBlock(sectionId: string, block_type: PrivacyBlock["block_type"]) {
    const payload =
      block_type === "list"
        ? { items: [""] }
        : block_type === "plink"
          ? {
              before: "",
              link: { href: "", label: "" },
              after: "",
            }
          : { text: "" };

    startTransition(async () => {
      const section = sections.find((s) => s.section.id === sectionId);
      const result = await createRow("privacy_blocks", {
        section_id: sectionId,
        block_type,
        payload,
        sort_order: section?.blocks.length ?? 0,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  async function removeBlock(id: string) {
    const ok = await confirm({
      title: "Delete block?",
      description: "This privacy content block will be permanently removed.",
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    startTransition(async () => {
      await deleteRow("privacy_blocks", id);
      router.refresh();
    });
  }

  return (
    <div>
      {metaForm}
      {message && <div className="admin-flash admin-flash-ok">{message}</div>}
      {error && <div className="admin-flash admin-flash-err">{error}</div>}

      {sections.map(({ section, blocks }) => (
        <div className="admin-card" key={section.id}>
          <h2>
            Section: <code>{section.section_key}</code>
          </h2>
          <div className="admin-field">
            <label>Title (optional)</label>
            <input
              defaultValue={section.title ?? ""}
              onBlur={(e) => saveSectionTitle(section, e.target.value)}
            />
          </div>

          {blocks.map((block) => (
            <div
              key={block.id}
              style={{
                borderTop: "1px solid #e4ebf2",
                paddingTop: 12,
                marginTop: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span className="admin-badge">{block.block_type}</span>
                <button
                  type="button"
                  className="admin-btn admin-btn-danger"
                  onClick={() => removeBlock(block.id)}
                  disabled={pending}
                >
                  Delete block
                </button>
              </div>

              {(block.block_type === "p" || block.block_type === "short") && (
                <div className="admin-field">
                  <label>Text</label>
                  <textarea
                    rows={4}
                    value={String(block.payload.text ?? "")}
                    onChange={(e) =>
                      updateBlockPayload(section.id, block.id, {
                        text: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              {block.block_type === "list" && (
                <div className="admin-field">
                  <label>Items (one per line)</label>
                  <textarea
                    rows={5}
                    value={((block.payload.items as string[]) ?? []).join("\n")}
                    onChange={(e) =>
                      updateBlockPayload(section.id, block.id, {
                        items: e.target.value.split("\n"),
                      })
                    }
                  />
                </div>
              )}

              {block.block_type === "plink" && (
                <>
                  <div className="admin-field">
                    <label>Before link</label>
                    <textarea
                      rows={2}
                      value={String(block.payload.before ?? "")}
                      onChange={(e) =>
                        updateBlockPayload(section.id, block.id, {
                          ...block.payload,
                          before: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="admin-row">
                    <div className="admin-field">
                      <label>Link label</label>
                      <input
                        value={String(
                          (block.payload.link as { label?: string })?.label ??
                            "",
                        )}
                        onChange={(e) =>
                          updateBlockPayload(section.id, block.id, {
                            ...block.payload,
                            link: {
                              ...((block.payload.link as object) ?? {}),
                              label: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="admin-field">
                      <label>Link href</label>
                      <input
                        value={String(
                          (block.payload.link as { href?: string })?.href ?? "",
                        )}
                        onChange={(e) =>
                          updateBlockPayload(section.id, block.id, {
                            ...block.payload,
                            link: {
                              ...((block.payload.link as object) ?? {}),
                              href: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="admin-field">
                    <label>After link</label>
                    <input
                      value={String(block.payload.after ?? "")}
                      onChange={(e) =>
                        updateBlockPayload(section.id, block.id, {
                          ...block.payload,
                          after: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}

              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                disabled={pending}
                onClick={() => saveBlock(block)}
              >
                Save block
              </button>
            </div>
          ))}

          <div className="admin-actions" style={{ marginTop: 16 }}>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => addBlock(section.id, "p")}
            >
              + Paragraph
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => addBlock(section.id, "short")}
            >
              + Short
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => addBlock(section.id, "list")}
            >
              + List
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => addBlock(section.id, "plink")}
            >
              + Linked paragraph
            </button>
          </div>
        </div>
      ))}

      <div className="admin-card">
        <h2>Add section</h2>
        <form className="admin-form" onSubmit={addSection}>
          <div className="admin-row">
            <div className="admin-field">
              <label>Section key</label>
              <input name="section_key" required placeholder="intro" />
            </div>
            <div className="admin-field">
              <label>Title</label>
              <input name="title" placeholder="Optional title" />
            </div>
          </div>
          <button type="submit" className="admin-btn admin-btn-primary">
            Add section
          </button>
        </form>
      </div>
    </div>
  );
}
