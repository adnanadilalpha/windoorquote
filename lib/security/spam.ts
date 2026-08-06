import type { SiteSecuritySettings } from "@/lib/content/types";

const URL_PATTERN = /https?:\/\/|www\./gi;

export function countLinksInMessage(message: string) {
  return (message.match(URL_PATTERN) || []).length;
}

/**
 * Spam checks for contact form bots.
 * Visitor email is only lead info — delivery uses the site owner's SMTP —
 * so we do not judge or rate-limit by the submitted email address.
 */
export function evaluateContactSpam(options: {
  settings: SiteSecuritySettings;
  message: string;
  honeypot: string;
  formStartedAt: string;
}): { blocked: boolean; reason?: string; silent?: boolean } {
  const { settings, message, honeypot, formStartedAt } = options;

  if (!settings.spam_protection_enabled) {
    return { blocked: false };
  }

  if (settings.honeypot_enabled && honeypot.trim()) {
    return { blocked: true, silent: true, reason: "honeypot" };
  }

  if (settings.min_submit_seconds > 0) {
    const started = Number(formStartedAt);
    if (!formStartedAt || !Number.isFinite(started)) {
      return {
        blocked: true,
        reason: "Please wait a moment and try again.",
      };
    }
    const elapsedSec = (Date.now() - started) / 1000;
    if (elapsedSec < 0 || elapsedSec < settings.min_submit_seconds) {
      return {
        blocked: true,
        reason: "Please wait a moment and try again.",
      };
    }
  }

  if (settings.max_links_in_message >= 0) {
    const links = countLinksInMessage(message);
    if (links > settings.max_links_in_message) {
      return {
        blocked: true,
        reason:
          "Your message has too many links. Please shorten it and try again.",
      };
    }
  }

  return { blocked: false };
}

type IpBucket = { timestamps: number[] };

declare global {
  // eslint-disable-next-line no-var
  var __wdqContactIpBuckets: Map<string, IpBucket> | undefined;
}

function getIpBuckets() {
  if (!globalThis.__wdqContactIpBuckets) {
    globalThis.__wdqContactIpBuckets = new Map();
  }
  return globalThis.__wdqContactIpBuckets;
}

/** Rate-limit contact spam by visitor IP (not by the email field). */
export function isIpRateLimited(
  ip: string | null,
  settings: SiteSecuritySettings,
): boolean {
  if (!settings.spam_protection_enabled || !settings.rate_limit_enabled) {
    return false;
  }
  // Missing IP still rates against a shared bucket so bots can't skip limits.
  const key = ip || "unknown";

  const buckets = getIpBuckets();
  const now = Date.now();
  const windowMs = settings.rate_limit_window_minutes * 60_000;
  const bucket = buckets.get(key) ?? { timestamps: [] };
  const recent = bucket.timestamps.filter((t) => now - t < windowMs);

  if (recent.length >= settings.rate_limit_max) {
    buckets.set(key, { timestamps: recent });
    return true;
  }

  recent.push(now);
  buckets.set(key, { timestamps: recent });
  return false;
}
