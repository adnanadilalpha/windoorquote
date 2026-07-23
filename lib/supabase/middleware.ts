import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSiteSecuritySettingsCached } from "@/lib/security/load-settings";
import { getRequestCountry } from "@/lib/security/request-country";
import { isCountryAllowed } from "@/lib/security/settings";

function isCountryBlockExempt(path: string) {
  return (
    path.startsWith("/admin") ||
    path === "/blocked" ||
    path.startsWith("/api/")
  );
}

export async function updateSession(request: NextRequest) {
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

  // Refresh session — getUser validates JWT with Auth server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAdminRoute = path.startsWith("/admin");
  const isLoginRoute = path === "/admin/login";

  // When on: block every country except US (+ any admin-allowed countries).
  if (!isCountryBlockExempt(path)) {
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

  return supabaseResponse;
}
