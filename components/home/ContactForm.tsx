"use client";

import { FormEvent, useState, useTransition } from "react";
import { submitContactForm } from "@/lib/actions/cms";

type ContactFormProps = {
  className?: string;
  submitLabel?: string;
  showHint?: boolean;
  hint?: string;
  successMessage?: string;
  sourcePage?: string;
};

export default function ContactForm({
  className = "",
  submitLabel = "Send",
  showHint = false,
  hint = "No spam. Just a clear next step.",
  successMessage = "Thank you. Your message has been received.",
  sourcePage = "/",
}: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("source_page", sourcePage);

    startTransition(async () => {
      setError(null);
      const result = await submitContactForm(formData);
      if (result.error) {
        setStatus("error");
        setError(result.error);
        return;
      }
      setStatus("sent");
      form.reset();
    });
  }

  return (
    <form
      className={`contact-desk-form ${className}`.trim()}
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="source_page" value={sourcePage} />
      <div className="contact-desk-row">
        <label>
          Name
          <input type="text" name="name" required autoComplete="name" />
        </label>
        <label>
          Company
          <input type="text" name="company" autoComplete="organization" />
        </label>
      </div>

      <div className="contact-desk-row">
        <label>
          Email Address
          <input type="email" name="email" required autoComplete="email" />
        </label>
        <label>
          Phone
          <input type="tel" name="phone" autoComplete="tel" />
        </label>
      </div>

      <label>
        Message
        <textarea name="message" rows={4} required />
      </label>

      <div className="contact-desk-actions">
        <button type="submit" disabled={pending}>
          {pending ? "Sending…" : submitLabel}
        </button>
        {status === "sent" ? (
          <p className="form-success">{successMessage}</p>
        ) : status === "error" ? (
          <p className="form-success" style={{ color: "#b42318" }}>
            {error ?? "Something went wrong. Please try again."}
          </p>
        ) : showHint ? (
          <p className="contact-desk-hint">{hint}</p>
        ) : null}
      </div>
    </form>
  );
}
