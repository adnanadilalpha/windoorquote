"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "not_admin"
      ? "This account is not an admin."
      : null,
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    const supabase = createClient();
    const { error: signError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signError) {
      setError(signError.message);
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Unable to verify session.");
      setLoading(false);
      return;
    }

    const { data: admin } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!admin) {
      await supabase.auth.signOut();
      setError("This account is not an admin. Add it in Supabase first.");
      setLoading(false);
      return;
    }

    router.push(searchParams.get("next") || "/admin/home");
    router.refresh();
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      {error ? (
        <div className="rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      <label className="flex flex-col gap-1.5">
        <span className="text-sm text-navy-800/80">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@windoorquote.com"
          className="h-11 rounded-lg border border-navy-800/12 bg-white px-4 text-sm text-navy-800 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm text-navy-800/80">Password</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-11 rounded-lg border border-navy-800/12 bg-white px-4 text-sm text-navy-800 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="mt-1 inline-flex h-11 items-center justify-center rounded-lg bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-deep disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
