import { createClient } from "@supabase/supabase-js";

/**
 * Cookie-free Supabase client for public CMS reads.
 * Avoids cookies()/headers() so marketing pages can use ISR caching.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}
