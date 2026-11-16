"use client";

import { FormEvent, useState, useTransition } from "react";
import { upsertSetting } from "@/lib/actions/cms";
import type { HomeFaq, HomeFaqItem } from "@/lib/content/types";

function emptyItem(): HomeFaqItem {
  return { question: "", answer: "" };
}

export default function FaqEditor({ initial }: { initial: HomeFaq }) {
  const [values, setValues] = useState<HomeFaq>({
    ...initial,
    items: initial.items.length ? initial.items : [emptyItem()],
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function updateItem(index: number, patch: Partial<HomeFaqItem>) {
    setValues((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    }));
  }

  function addItem() {
    setValues((prev) => ({ ...prev, items: [...prev.items, emptyItem()] }));
  }

  function removeItem(index: number) {
    setValues((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }

  function moveItem(index: number, direction: -1 | 1) {
    setValues((prev) => {
      const next = [...prev.items];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, items: next };
    });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      setMessage(null);
      setError(null);

      const cleaned: HomeFaq = {
        ...values,
        kicker: values.kicker.trim(),
        title: values.title.trim(),
        lead: values.lead.trim(),
        cta_label: values.cta_label.trim(),
        cta_href: values.cta_href.trim() || "#contactus",
        items: values.items
          .map((item) => ({
            question: item.question.trim(),
            answer: item.answer.trim(),
          }))
          .filter((item) => item.question && item.answer),
      };

      if (!cleaned.title) {
        setError("Section title is required.");
        return;
      }
      if (cleaned.items.length === 0) {
        setError("Add at least one question and answer.");
        return;
      }

      const result = await upsertSetting("home_faq", cleaned);
      if (result.error) {
        setError(result.error);
        return;
      }
      setValues(cleaned);
      setMessage("Saved.");
    });
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      {message ? <div className="admin-flash admin-flash-ok">{message}</div> : null}
      {error ? <div className="admin-flash admin-flash-err">{error}</div> : null}

      <div className="admin-field">
        <label>Kicker</label>
        <input
          value={values.kicker}
          onChange={(e) => setValues({ ...values, kicker: e.target.value })}
          placeholder="FAQ"
        />
      </div>
      <div className="admin-field">
        <label>Title</label>
        <input
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          placeholder="Frequently asked questions"
          required
        />
      </div>
      <div className="admin-field">
        <label>Lead</label>
        <textarea
          rows={3}
          value={values.lead}
          onChange={(e) => setValues({ ...values, lead: e.target.value })}
          placeholder="Short intro under the title"
        />
      </div>
      <div className="admin-row">
        <div className="admin-field">
          <label>CTA label</label>
          <input
            value={values.cta_label}
            onChange={(e) =>
              setValues({ ...values, cta_label: e.target.value })
            }
            placeholder="Talk with the team"
          />
        </div>
        <div className="admin-field">
          <label>CTA link</label>
          <input
            value={values.cta_href}
            onChange={(e) => setValues({ ...values, cta_href: e.target.value })}
            placeholder="#contactus"
          />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-navy-800">Questions</h3>
          <button
            type="button"
            className="admin-btn"
            onClick={addItem}
          >
            Add question
          </button>
        </div>

        {values.items.map((item, index) => (
          <div
            key={`faq-${index}`}
            className="rounded-xl border border-navy-800/10 bg-paper-50 p-4"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-body-muted">
                Question {index + 1}
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  className="admin-btn"
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                >
                  Up
                </button>
                <button
                  type="button"
                  className="admin-btn"
                  onClick={() => moveItem(index, 1)}
                  disabled={index === values.items.length - 1}
                >
                  Down
                </button>
                <button
                  type="button"
                  className="admin-btn"
                  onClick={() => removeItem(index)}
                  disabled={values.items.length <= 1}
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="admin-field">
              <label>Question</label>
              <input
                value={item.question}
                onChange={(e) =>
                  updateItem(index, { question: e.target.value })
                }
                placeholder="What is WinDoor Quote?"
              />
            </div>
            <div className="admin-field">
              <label>Answer</label>
              <textarea
                rows={4}
                value={item.answer}
                onChange={(e) => updateItem(index, { answer: e.target.value })}
                placeholder="Clear answer for manufacturers…"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="admin-actions">
        <button
          type="submit"
          className="admin-btn admin-btn-primary"
          disabled={pending}
        >
          {pending ? "Saving…" : "Save FAQ"}
        </button>
      </div>
    </form>
  );
}
