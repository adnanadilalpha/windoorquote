import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID?.trim();
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim();

/** Primary ID used to load the gtag.js library (GA4 preferred, else Ads). */
const LOADER_ID = GA_ID || ADS_ID;

export default function GoogleAnalytics() {
  if (!LOADER_ID) return null;

  const configLines = [
    GA_ID ? `gtag('config', '${GA_ID}');` : null,
    ADS_ID ? `gtag('config', '${ADS_ID}');` : null,
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
