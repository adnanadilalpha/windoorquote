"use client";

import { FormEvent, useState } from "react";
import { ExternalLink, Eye, EyeOff, Send } from "lucide-react";
import {
  saveContactEmailSettings,
  testContactEmailSettings,
} from "@/lib/actions/cms";
import type { ContactEmailSettings } from "@/lib/content/types";

type Props = {
  initial: ContactEmailSettings;
  hasSavedApiKey: boolean;
  hasPlatformKey: boolean;
};

type Busy = "save" | "test" | null;

export default function ContactEmailSettingsForm({
  initial,
  hasSavedApiKey,
  hasPlatformKey,
}: Props) {
  const [values, setValues] = useState({
    ...initial,
    provider: "resend" as const,
    resend_api_key: "",
  });
  const [showKey, setShowKey] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<Busy>(null);

  function update<K extends keyof ContactEmailSettings>(
    key: K,
    value: ContactEmailSettings[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setBusy("save");
    try {
      const keepExistingApiKey = !values.resend_api_key.trim() && hasSavedApiKey;
      const result = await saveContactEmailSettings(
        { ...values, provider: "resend" },
        { keepExistingApiKey },
      );
      if (result.error) {
        setError(result.error);
        return;
      }
      setMessage("Email settings saved.");
      if (!keepExistingApiKey) {
        setValues((current) => ({ ...current, resend_api_key: "" }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings.");
    } finally {
      setBusy(null);
    }
  }

  async function onTest() {
    setMessage(null);
    setError(null);
    setBusy("test");
    try {
      const keepExistingApiKey = !values.resend_api_key.trim() && hasSavedApiKey;
      const result = await testContactEmailSettings(
        { ...values, provider: "resend", enabled: true },
        { keepExistingApiKey },
      );
      if (result.error) {
        setError(result.error);
        return;
      }
      setMessage(
        "Test email sent. Check your inbox (and spam folder) in a minute.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Test email failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-navy-800/8 bg-white p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-navy-800">Easy setup</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-body-muted">
          <li>
            Create a free account at{" "}
            <a
              href="https://resend.com/signup"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-[#12689b] underline"
            >
              resend.com
              <ExternalLink className="size-3.5" />
            </a>
          </li>
          <li>
            Open{" "}
            <a
              href="https://resend.com/api-keys"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-[#12689b] underline"
            >
              API Keys
              <ExternalLink className="size-3.5" />
            </a>{" "}
            and create a key (copy it once).
          </li>
          <li>
            Paste the key below, enter the email that should receive contact
            messages, save, then send a test.
          </li>
        </ol>
        <p className="mt-3 text-sm text-body-muted">
          No domain setup needed. Messages are sent from Resend’s shared address
          and arrive in your normal inbox.
        </p>
      </div>

      <div className="admin-card">
        <h2>Notification settings</h2>

        {busy === "test" ? (
          <div className="mb-4 rounded-[10px] border border-navy-800/10 bg-paper-50 px-3 py-2 text-sm text-navy-800">
            Sending test email…
          </div>
        ) : null}
        {message ? (
          <div className="mb-4 rounded-[10px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {message}
          </div>
        ) : null}
        {error ? (
          <div className="mb-4 rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={onSave}>
          <label className="flex items-center gap-2 text-sm text-navy-800">
            <input
              type="checkbox"
              checked={values.enabled}
              onChange={(e) => update("enabled", e.target.checked)}
              className="size-4 rounded border-navy-800/20"
            />
            Email me when someone submits the contact form
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-navy-800/80">
              Where should messages go?
            </span>
            <input
              type="email"
              value={values.to_email}
              onChange={(e) => update("to_email", e.target.value)}
              placeholder="you@company.com"
              required={values.enabled}
              className="h-11 rounded-lg border border-navy-800/12 bg-white px-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>

          {hasPlatformKey ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Email delivery is already set up by your site host. You only need
              the address above.
            </div>
          ) : (
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-navy-800/80">
                Resend API key
                {hasSavedApiKey ? (
                  <span className="text-body-muted">
                    {" "}
                    (leave blank to keep the saved key)
                  </span>
                ) : null}
              </span>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={values.resend_api_key}
                  onChange={(e) => update("resend_api_key", e.target.value)}
                  placeholder={
                    hasSavedApiKey ? "••••••••••••••••" : "re_xxxxxxxx"
                  }
                  autoComplete="off"
                  className="h-11 w-full rounded-lg border border-navy-800/12 bg-white py-2 pr-11 pl-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((v) => !v)}
                  className="absolute top-1/2 right-2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-body-muted hover:bg-paper-200"
                  aria-label={showKey ? "Hide API key" : "Show API key"}
                >
                  {showKey ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </label>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-navy-800/80">
              From name{" "}
              <span className="text-body-muted">(optional)</span>
            </span>
            <input
              type="text"
              value={values.from_name}
              onChange={(e) => update("from_name", e.target.value)}
              placeholder="WinDoor Quote"
              className="h-11 rounded-lg border border-navy-800/12 bg-white px-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-navy-800">
            <input
              type="checkbox"
              checked={values.reply_to_submitter}
              onChange={(e) => update("reply_to_submitter", e.target.checked)}
              className="size-4 rounded border-navy-800/20"
            />
            Let me reply directly to the visitor
          </label>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="submit"
              disabled={busy !== null}
              className="rounded-lg bg-[#12689b] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c527a] disabled:opacity-60"
            >
              {busy === "save" ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => void onTest()}
              className="inline-flex items-center gap-2 rounded-lg border border-navy-800/12 bg-white px-4 py-2 text-sm font-medium text-navy-800 hover:bg-paper-50 disabled:opacity-60"
            >
              <Send className="size-4" />
              {busy === "test" ? "Sending…" : "Send test email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
