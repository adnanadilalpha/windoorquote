"use client";

import { FormEvent, useState } from "react";

type ContactFormProps = {
  className?: string;
  submitLabel?: string;
  showHint?: boolean;
};

export default function ContactForm({
  className = "",
  submitLabel = "Send",
  showHint = false,
}: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sent");
    e.currentTarget.reset();
  }

  return (
    <form className={`contact-desk-form ${className}`.trim()} onSubmit={handleSubmit}>
      <div className="contact-desk-row">
        <label>
          Name
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            placeholder="Alex Rivera"
          />
        </label>
        <label>
          Company
          <input
            type="text"
            name="company"
            autoComplete="organization"
            placeholder="Prairie View Windows"
          />
        </label>
      </div>

      <div className="contact-desk-row">
        <label>
          Email Address
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="alex@prairieview.com"
          />
        </label>
        <label>
          Phone
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="(402) 555-0148"
          />
        </label>
      </div>

      <label>
        Message
        <textarea
          name="message"
          rows={4}
          required
          placeholder="We're quoting vinyl and fiberglass daily — curious how WDQ would fit our shop floor and sales team."
        />
      </label>

      <div className="contact-desk-actions">
        <button type="submit">{submitLabel}</button>
        {status === "sent" ? (
          <p className="form-success">
            Thank you. Your message has been received.
          </p>
        ) : showHint ? (
          <p className="contact-desk-hint">No spam. Just a clear next step.</p>
        ) : null}
      </div>
    </form>
  );
}
