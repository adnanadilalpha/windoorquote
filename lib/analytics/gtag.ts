declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackGtagEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>,
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", eventName, params);
}

/** Google Ads lead-form conversion (AW-…/label). */
export function trackGoogleAdsConversion() {
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim();
  const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL?.trim();
  if (!adsId || !label) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", "conversion", {
    send_to: `${adsId}/${label}`,
    transport_type: "beacon",
  });
}
