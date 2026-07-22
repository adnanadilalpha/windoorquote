import { createClient } from "@supabase/supabase-js";

async function main() {
  const s = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { error } = await s.from("contact_submissions").insert({
    name: "CMS Test",
    company: "Test Co",
    email: "test@example.com",
    phone: "555-0100",
    message: "Hello from verification",
    source_page: "/",
  });
  console.log(error ? `contact insert fail: ${error.message}` : "contact insert ok");

  const { data: auth, error: authErr } = await s.auth.signInWithPassword({
    email: "admin@windoorquote.com",
    password: "WdqAdmin2026!",
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
