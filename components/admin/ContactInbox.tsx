"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteContact, markContactRead } from "@/lib/actions/cms";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import type { ContactSubmission } from "@/lib/content/types";

function EmailStatusBadge({
  status,
  error,
}: {
  status?: ContactSubmission["email_status"];
  error?: string | null;
}) {
  if (!status || status === "skipped") {
    return (
      <span className="rounded-full bg-paper-200 px-2 py-0.5 text-[11px] font-medium text-body-muted">
        Inbox only
      </span>
    );
  }
  if (status === "sent") {
    return (
      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
        Emailed
      </span>
    );
  }
  return (
    <span
      className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700"
      title={error ?? "Email failed"}
    >
      Email failed
    </span>
  );
}

export default function ContactInbox({
  submissions,
}: {
  submissions: ContactSubmission[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const confirm = useConfirm();

  async function onDelete(id: string, name: string) {
    const ok = await confirm({
      title: "Delete submission?",
      description: `Remove the message from ${name}? This cannot be undone.`,
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    startTransition(async () => {
      await deleteContact(id);
      router.refresh();
    });
  }

  return (
    <div className="admin-card">
      <h2>Inbox</h2>
      {!submissions.length && (
        <p className="text-sm text-body-muted">No contact submissions yet.</p>
      )}
      {submissions.map((row) => (
        <div className="admin-list-item" key={row.id}>
          <div className="admin-list-meta">
            <strong>
              {row.name}
              {!row.read_at && (
                <>
                  {" "}
                  <span className="admin-badge admin-badge-unread">New</span>
                </>
              )}{" "}
              <EmailStatusBadge
                status={row.email_status}
                error={row.email_error}
              />
            </strong>
            <span>
              {row.email}
              {row.company ? ` · ${row.company}` : ""}
              {row.phone ? ` · ${row.phone}` : ""}
            </span>
            <p style={{ margin: "8px 0 0", whiteSpace: "pre-wrap" }}>
              {row.message}
            </p>
            <span>
              {new Date(row.created_at).toLocaleString()} · {row.source_page}
              {row.email_status === "failed" && row.email_error
                ? ` · ${row.email_error}`
                : ""}
            </span>
          </div>
          <div className="admin-list-actions">
            {!row.read_at && (
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await markContactRead(row.id);
                    router.refresh();
                  })
                }
              >
                Mark read
              </button>
            )}
            <button
              type="button"
              className="admin-btn admin-btn-danger"
              disabled={pending}
              onClick={() => void onDelete(row.id, row.name)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
