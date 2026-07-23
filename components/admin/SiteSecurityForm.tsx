"use client";

import { FormEvent, useMemo, useState } from "react";
import { saveSiteSecuritySettings } from "@/lib/actions/cms";
import { COUNTRIES, countryName } from "@/lib/security/countries";
import { ALWAYS_ALLOWED_COUNTRY } from "@/lib/security/settings";
import type { SiteSecuritySettings } from "@/lib/content/types";
import { cn } from "@/lib/utils";

type Props = {
  initial: SiteSecuritySettings;
};

export default function SiteSecurityForm({ initial }: Props) {
  const [values, setValues] = useState<SiteSecuritySettings>(initial);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = COUNTRIES.filter((c) => c.code !== ALWAYS_ALLOWED_COUNTRY);
    if (!q) return pool.slice(0, 12);
    return pool
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q),
      )
      .slice(0, 20);
  }, [query]);

  function update<K extends keyof SiteSecuritySettings>(
    key: K,
    value: SiteSecuritySettings[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function toggleAllowedCountry(code: string) {
    if (code === ALWAYS_ALLOWED_COUNTRY) return;
    setValues((current) => {
      const set = new Set(current.allowed_countries);
      if (set.has(code)) set.delete(code);
      else set.add(code);
      return {
        ...current,
        allowed_countries: [...set].sort(),
      };
    });
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setBusy(true);
    try {
      const result = await saveSiteSecuritySettings(values);
      if (result.error) {
        setError(result.error);
        return;
      }
      setMessage("Security settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSave} className="space-y-5">
      {message ? (
        <div className="rounded-[10px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <div className="admin-card">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="mb-1!">Country blocking</h2>
            <p className="text-sm text-body-muted">
              When active, every country is blocked except the United States.
              Unblock extra countries below if you want them to access the site.
              Admin stays available.
            </p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-navy-800">
            <input
              type="checkbox"
              className="size-4 accent-[#12689b]"
              checked={values.country_block_enabled}
              onChange={(e) =>
                update("country_block_enabled", e.target.checked)
              }
            />
            Active
          </label>
        </div>

        <div
          className={cn(
            "space-y-4",
            !values.country_block_enabled && "opacity-55",
          )}
        >
          <div className="rounded-[10px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            <span className="font-semibold">United States (US)</span> is always
            allowed and cannot be blocked.
          </div>

          <div className="admin-field">
            <label htmlFor="country-search">Unblock another country</label>
            <input
              id="country-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or code (e.g. Canada, CA)"
              disabled={!values.country_block_enabled}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filtered.map((country) => {
              const allowed = values.allowed_countries.includes(country.code);
              return (
                <button
                  key={country.code}
                  type="button"
                  disabled={!values.country_block_enabled}
                  onClick={() => toggleAllowedCountry(country.code)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    allowed
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-navy-800/12 bg-white text-navy-800 hover:border-[#12689b]/40",
                  )}
                >
                  {allowed ? "Unblocked: " : "Allow "}
                  {country.name} ({country.code})
                </button>
              );
            })}
          </div>

          {values.allowed_countries.length > 0 ? (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-body-muted">
                Also allowed ({values.allowed_countries.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {values.allowed_countries.map((code) => (
                  <button
                    key={code}
                    type="button"
                    disabled={!values.country_block_enabled}
                    onClick={() => toggleAllowedCountry(code)}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-900"
                    title="Click to block again"
                  >
                    {countryName(code)} ({code}) ×
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-body-muted">
              With blocking on, only the United States can visit unless you
              unblock more countries here.
            </p>
          )}
        </div>
      </div>

      <div className="admin-card">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="mb-1!">Contact form spam protection</h2>
            <p className="text-sm text-body-muted">
              Stops bots before junk hits your inbox. The visitor email field is
              only contact info — notifications still send from your own mailbox.
            </p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-navy-800">
            <input
              type="checkbox"
              className="size-4 accent-[#12689b]"
              checked={values.spam_protection_enabled}
              onChange={(e) =>
                update("spam_protection_enabled", e.target.checked)
              }
            />
            Active
          </label>
        </div>

        <div
          className={cn(
            "space-y-4",
            !values.spam_protection_enabled && "opacity-55",
          )}
        >
          <label className="flex items-start gap-3 text-sm text-navy-800">
            <input
              type="checkbox"
              className="mt-0.5 size-4 accent-[#12689b]"
              checked={values.honeypot_enabled}
              disabled={!values.spam_protection_enabled}
              onChange={(e) => update("honeypot_enabled", e.target.checked)}
            />
            <span>
              <span className="font-medium">Honeypot field</span>
              <span className="mt-0.5 block text-body-muted">
                Hidden field that bots fill in — those submissions are dropped
                quietly.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 text-sm text-navy-800">
            <input
              type="checkbox"
              className="mt-0.5 size-4 accent-[#12689b]"
              checked={values.rate_limit_enabled}
              disabled={!values.spam_protection_enabled}
              onChange={(e) => update("rate_limit_enabled", e.target.checked)}
            />
            <span>
              <span className="font-medium">Rate limit by visitor IP</span>
              <span className="mt-0.5 block text-body-muted">
                Caps how many form submits one visitor IP can send in a time
                window (not based on the email they type in).
              </span>
            </span>
          </label>

          <div className="admin-row">
            <div className="admin-field">
              <label htmlFor="rate_max">Max messages</label>
              <input
                id="rate_max"
                type="number"
                min={1}
                max={50}
                value={values.rate_limit_max}
                disabled={
                  !values.spam_protection_enabled || !values.rate_limit_enabled
                }
                onChange={(e) =>
                  update("rate_limit_max", Number(e.target.value) || 1)
                }
              />
            </div>
            <div className="admin-field">
              <label htmlFor="rate_window">Window (minutes)</label>
              <input
                id="rate_window"
                type="number"
                min={1}
                max={1440}
                value={values.rate_limit_window_minutes}
                disabled={
                  !values.spam_protection_enabled || !values.rate_limit_enabled
                }
                onChange={(e) =>
                  update(
                    "rate_limit_window_minutes",
                    Number(e.target.value) || 1,
                  )
                }
              />
            </div>
          </div>

          <div className="admin-row">
            <div className="admin-field">
              <label htmlFor="min_seconds">Minimum fill time (seconds)</label>
              <input
                id="min_seconds"
                type="number"
                min={0}
                max={120}
                value={values.min_submit_seconds}
                disabled={!values.spam_protection_enabled}
                onChange={(e) =>
                  update("min_submit_seconds", Number(e.target.value) || 0)
                }
              />
              <p className="text-xs text-body-muted">
                Instant bot submits under this time are rejected. Use 0 to
                disable.
              </p>
            </div>
            <div className="admin-field">
              <label htmlFor="max_links">Max links in message</label>
              <input
                id="max_links"
                type="number"
                min={0}
                max={20}
                value={values.max_links_in_message}
                disabled={!values.spam_protection_enabled}
                onChange={(e) =>
                  update("max_links_in_message", Number(e.target.value) || 0)
                }
              />
              <p className="text-xs text-body-muted">
                Messages with more links than this are blocked.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-10 items-center rounded-lg bg-[#12689b] px-5 text-sm font-semibold text-white transition hover:bg-[#0f5a86] disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save security settings"}
        </button>
      </div>
    </form>
  );
}
