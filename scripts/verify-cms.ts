import { createClient } from "@supabase/supabase-js";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    process.exit(1);
  }

  const s = createClient(url, anon);

  const { error } = await s.from("contact_submissions").insert({
    name: "CMS Test",
    company: "Test Co",
    email: "test@example.com",
    phone: "555-0100",
    message: "Hello from verification",
    source_page: "/",
  });
  console.log(error ? `contact insert fail: ${error.message}` : "contact insert ok");

  const email = process.env.VERIFY_ADMIN_EMAIL;
  const password = process.env.VERIFY_ADMIN_PASSWORD;
  if (!email || !password) {
    console.log(
      "skip login: set VERIFY_ADMIN_EMAIL and VERIFY_ADMIN_PASSWORD to test admin auth",
    );
    return;
  }

  const { data: auth, error: authErr } = await s.auth.signInWithPassword({
    email,
    password,
  });
  console.log(
    authErr
      ? `login fail: ${authErr.message}`
      : `login ok: ${auth.user?.email}`,
  );
  if (!auth.user) return;

  const { data: admin } = await s
    .from("admins")
    .select("*")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  console.log("admin row:", admin?.email ?? "missing");

  const { data: feats, error: fErr } = await s
    .from("features")
    .select("id, title")
    .limit(1);
  console.log(
    fErr ? `features read fail: ${fErr.message}` : `features read: ${feats?.[0]?.title}`,
  );

  if (feats?.[0]) {
    const { error: upErr } = await s
      .from("features")
      .update({ title: feats[0].title })
      .eq("id", feats[0].id);
    console.log(upErr ? `admin update fail: ${upErr.message}` : "admin update ok");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
