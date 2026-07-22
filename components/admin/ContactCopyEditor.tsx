"use client";

import { FormEvent, useState, useTransition } from "react";
import { upsertSetting } from "@/lib/actions/cms";
import type { HomeContact } from "@/lib/content/types";

export default function ContactCopyEditor({
  initial,
}: {
  initial: HomeContact;
}) {
  const [values, setValues] = useState(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      setMessage(null);
      setError(null);
      const result = await upsertSetting("home_contact", values);
      if (result.error) setError(result.error);
      else setMessage("Saved.");
    });
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      {message && <div className="admin-flash admin-flash-ok">{message}</div>}
      {error && <div className="admin-flash admin-flash-err">{error}</div>}
      <div className="admin-field">
        <label>Title</label>
        <input
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
        />
      </div>
      <div className="admin-field">
        <label>Body</label>
        <textarea
          rows={5}
          value={values.body}
          onChange={(e) => setValues({ ...values, body: e.target.value })}
        />
      </div>
      <div className="admin-field">
        <label>Bullet points (one per line)</label>
        <textarea
          rows={4}
          value={values.points.join("\n")}
          onChange={(e) =>
            setValues({
              ...values,
              points: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
            })
          }
        />
      </div>
      <div className="admin-field">
        <label>Form heading</label>
        <input
          value={values.form_heading}
          onChange={(e) =>
            setValues({ ...values, form_heading: e.target.value })
          }
        />
      </div>
      <div className="admin-row">
        <div className="admin-field">
          <label>Submit label</label>
          <input
            value={values.submit_label}
            onChange={(e) =>
              setValues({ ...values, submit_label: e.target.value })
            }
          />
        </div>
        <div className="admin-field">
          <label>Hint</label>
          <input
            value={values.hint}
            onChange={(e) => setValues({ ...values, hint: e.target.value })}
          />
        </div>
      </div>
      <div className="admin-field">
        <label>Success message</label>
        <input
          value={values.success_message}
          onChange={(e) =>
            setValues({ ...values, success_message: e.target.value })
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
