"use client";

import { FormEvent, useState, useTransition } from "react";
import { upsertSetting } from "@/lib/actions/cms";
import type { HomeAbout } from "@/lib/content/types";

function normalizeAbout(initial: HomeAbout): HomeAbout {
  return {
    location: initial.location ?? "",
    title: initial.title ?? "ABOUT US",
    mission_lead: initial.mission_lead ?? "",
    body: initial.body ?? "",
    process: Array.isArray(initial.process) ? initial.process : [],
  };
}

export default function AboutEditor({ initial }: { initial: HomeAbout }) {
  const [values, setValues] = useState(() => normalizeAbout(initial));
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      setMessage(null);
      setError(null);
      const payload = normalizeAbout(values);
      const result = await upsertSetting("home_about", payload);
      if (result.error) setError(result.error);
      else {
        setValues(payload);
        setMessage("Saved.");
      }
    });
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      {message && <div className="admin-flash admin-flash-ok">{message}</div>}
      {error && <div className="admin-flash admin-flash-err">{error}</div>}

      <div className="admin-field">
        <label>Location line</label>
        <input
          value={values.location}
          onChange={(e) => setValues({ ...values, location: e.target.value })}
        />
      </div>
      <div className="admin-field">
        <label>Title</label>
        <input
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
        />
      </div>
      <div className="admin-field">
        <label>Mission lead (bold italic prefix)</label>
        <input
          value={values.mission_lead}
          onChange={(e) =>
            setValues({ ...values, mission_lead: e.target.value })
          }
        />
      </div>
      <div className="admin-field">
        <label>Body</label>
        <textarea
          rows={8}
          value={values.body}
          onChange={(e) => setValues({ ...values, body: e.target.value })}
        />
      </div>

      <div className="admin-field">
        <label>Process steps (comma-separated)</label>
        <input
          value={values.process.join(", ")}
          onChange={(e) =>
            setValues({
              ...values,
              process: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
        />
      </div>

      <div className="admin-actions">
        <button
          type="submit"
          className="admin-btn admin-btn-primary"
          disabled={pending}
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
