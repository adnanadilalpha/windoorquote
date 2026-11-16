import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSiteSecuritySettingsCached } from "@/lib/security/load-settings";
import { getRequestCountry } from "@/lib/security/request-country";
import { isCountryAllowed } from "@/lib/security/settings";
import { isSearchEngineCrawler } from "@/lib/seo/crawler";
import { shouldReturnGone } from "@/lib/seo/spam-gone";

const MARKETING_HOSTS = new Set([
  "www.windoorquote.com",
  "windoorquote.com",
  "localhost",
  "127.0.0.1",
]);

function isCountryBlockExempt(path: string) {
  return (
    path.startsWith("/admin") ||
    path === "/blocked" ||
    path.startsWith("/api/") ||
    path === "/robots.txt" ||
    path === "/sitemap.xml" ||
    path === "/sitemap_index.xml" ||
    path.startsWith("/sitemap/")
  );
}

function requestHost(request: NextRequest): string {
  return (request.headers.get("host") ?? "").split(":")[0]?.toLowerCase() ?? "";
}

/** App / client subdomains must not appear in search results. */
function isAppOrClientSubdomain(host: string): boolean {
  if (!host || MARKETING_HOSTS.has(host)) return false;
  if (host.endsWith(".vercel.app")) return false;
  return (
    host.endsWith(".windoorquote.com") ||
    host === "wdq.windoorquote.com"
  );
}

function goneResponse(): NextResponse {
  return new NextResponse("Gone", {
    status: 410,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

function stripTrailingSlash(request: NextRequest): NextResponse | null {
  const { pathname, search } = request.nextUrl;
  if (pathname === "/" || !pathname.endsWith("/")) return null;
  // Keep extension-like paths alone (unlikely with trailing slash).
  if (/\.[a-z0-9]{1,8}\/$/i.test(pathname)) return null;

  // Use plain URL — NextURL can re-apply trailingSlash normalization.
  const cleanPath = pathname.replace(/\/+$/, "") || "/";
  const dest = new URL(cleanPath + search, request.nextUrl.origin);
  return NextResponse.redirect(dest, 308);
}

export async function updateSession(request: NextRequest) {
  const host = requestHost(request);
  const path = request.nextUrl.pathname;

  // 0) sitemap_index → sitemap (explicit 301; Next permanent redirects use 308).
  if (path === "/sitemap_index.xml" || path === "/sitemap_index.xml/") {
    const dest = new URL("/sitemap.xml", request.nextUrl.origin);
    return NextResponse.redirect(dest, 301);
  }

  // 1) Spam / hacked WP paths → 410 Gone (check before slash strip so
  //    /pinkcupid.../ and ?et_blog are caught either way).
  if (shouldReturnGone(path, request.nextUrl.searchParams)) {
    return goneResponse();
  }

  // 2) Trailing slash → no-slash (308), one hop.
  const slashRedirect = stripTrailingSlash(request);
  if (slashRedirect) {
    if (isAppOrClientSubdomain(host)) {
      slashRedirect.headers.set("X-Robots-Tag", "noindex, nofollow");
    }
    return slashRedirect;
  }

  // 3) Apex → www one-hop (also covers any request that missed next.config).
  if (host === "windoorquote.com") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = "www.windoorquote.com";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = path.startsWith("/admin");
  const isLoginRoute = path === "/admin/login";

  // 4) Country block — never apply to verified search crawlers.
  if (!isCountryBlockExempt(path)) {
    const isCrawler = await isSearchEngineCrawler(request);
    if (!isCrawler) {
      try {
        const security = await getSiteSecuritySettingsCached();
        if (security.country_block_enabled) {
          const country = getRequestCountry(request);
          if (!isCountryAllowed(security, country)) {
            const url = request.nextUrl.clone();
            url.pathname = "/blocked";
            url.search = "";
            return NextResponse.redirect(url);
          }
        }
      } catch {
        // Fail open — never take the site down if settings fetch fails.
      }
    }
  }

  if (isAdminRoute && !isLoginRoute) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }

    const { data: admin } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!admin) {
      await supabase.auth.signOut();
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("error", "not_admin");
      return NextResponse.redirect(url);
    }
  }

  if (isLoginRoute && user) {
    const { data: admin } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (admin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/home";
      return NextResponse.redirect(url);
    }
  }

  if (isAppOrClientSubdomain(host)) {
    supabaseResponse.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return supabaseResponse;
}
