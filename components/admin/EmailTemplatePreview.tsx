"use client";

import { useMemo, useState } from "react";
import {
  buildContactNotificationEmail,
  buildTestEmail,
} from "@/lib/email/templates";
import { cn } from "@/lib/utils";

const SAMPLE_INQUIRY = {
  name: "Alex Rivera",
  company: "Prairie View Windows",
  email: "alex@prairieview.com",
  phone: "(402) 555-0148",
  message:
    "We're quoting vinyl and fiberglass daily and want to see how WDQ would fit our shop floor and sales team. Looking for a short demo next week.",
  source_page: "/",
};

type PreviewKind = "inquiry" | "test";

export default function EmailTemplatePreview() {
  const [kind, setKind] = useState<PreviewKind>("inquiry");

  const preview = useMemo(() => {
    if (kind === "test") return buildTestEmail();
    return buildContactNotificationEmail(SAMPLE_INQUIRY);
  }, [kind]);

  return (
    <div className="overflow-hidden rounded-[14px] border border-navy-800/8 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-800/6 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-navy-800">
            Email template preview
          </h2>
          <p className="mt-0.5 text-xs text-body-muted">
            Live preview — no need to send a test to check the design.
          </p>
        </div>
        <div className="flex rounded-lg border border-navy-800/10 bg-paper-50 p-1">
          {(
            [
              { id: "inquiry", label: "Inquiry email" },
              { id: "test", label: "Test email" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setKind(item.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition",
                kind === item.id
                  ? "bg-[#12689b] text-white"
                  : "text-body-muted hover:text-navy-800",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-b border-navy-800/6 bg-paper-50 px-5 py-3">
        <p className="text-xs text-body-muted">
          <span className="font-medium text-navy-800">Subject:</span>{" "}
          {preview.subject}
        </p>
      </div>

      <div className="bg-[#edf2f6] p-4 sm:p-5">
        <iframe
          title="Email template preview"
          srcDoc={preview.html}
          className="h-[640px] w-full rounded-xl border border-navy-800/10 bg-white shadow-sm"
          sandbox=""
        />
      </div>
    </div>
  );
}
