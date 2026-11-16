import Script from "next/script";

/**
 * GA4 (`NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID`, e.g. G-CTRQ2PDM4W) is site analytics only.
 * It is NOT linked to Google Ads — do not rely on GA4 import for conversions.
 *
 * Google Ads conversions use `NEXT_PUBLIC_GOOGLE_ADS_ID` (AW-…) + conversion label,
 * fired from the contact form via trackGoogleAdsConversion().
 */
const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID?.trim();
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim();

/** Prefer AW- so Ads tag scanners see their ID in the script URL. */
const LOADER_ID = ADS_ID || GA_ID;

export default function GoogleAnalytics() {
  if (!LOADER_ID) return null;

  const configLines = [
    ADS_ID ? `gtag('config', '${ADS_ID}');` : null,
    GA_ID ? `gtag('config', '${GA_ID}');` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${LOADER_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${configLines}
        `}
      </Script>
    </>
  );
}
