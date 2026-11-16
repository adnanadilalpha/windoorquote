import type { NextConfig } from "next";
import { getLegacyRedirects } from "./lib/legacy-redirects";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHost = (() => {
  try {
    return supabaseUrl ? new URL(supabaseUrl).host : "qxnmltomzpdqkmhvedmu.supabase.co";
  } catch {
    return "qxnmltomzpdqkmhvedmu.supabase.co";
  }
})();

const contentSecurityPolicy = [
  "default-src 'self'",
  // Next.js needs inline/eval in practice for App Router hydration without nonces
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.clarity.ms https://scripts.clarity.ms",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://${supabaseHost} https://*.basemaps.cartocdn.com https://tile.openstreetmap.org https://*.tile.openstreetmap.org https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://www.googleadservices.com https://www.google.com https://googleads.g.doubleclick.net https://ad.doubleclick.net https://*.clarity.ms`,
  "font-src 'self' data:",
  `connect-src 'self' https://${supabaseHost} wss://${supabaseHost} https://*.basemaps.cartocdn.com https://tile.openstreetmap.org https://*.tile.openstreetmap.org https://geocoding-api.open-meteo.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://www.googleadservices.com https://www.google.com https://googleads.g.doubleclick.net https://ad.doubleclick.net https://www.clarity.ms https://*.clarity.ms`,
  "frame-src https://www.youtube.com https://youtube.com",
  `media-src 'self' https://${supabaseHost}`,
  // Leaflet map tiles need worker/blob; keep object blocked
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Canonical URLs have no trailing slash. Middleware owns the 308 strip so
  // spam paths can return 410 in one hop (Next's built-in slash redirect
  // would otherwise run first and hide the Gone response).
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHost,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return getLegacyRedirects();
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/apple-touch-icon.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
