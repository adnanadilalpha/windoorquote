/**
 * Create first CMS admin (Auth user + admins row).
 * Usage:
 *   npx tsx --env-file=.env.local scripts/create-admin.ts you@example.com 'YourPassword'
 */
import { createClient } from "@supabase/supabase-js";

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error(
    "Usage: npx tsx --env-file=.env.local scripts/create-admin.ts <email> <password>",
  );
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SERVICE_ROLE_KEY!;

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: listed } = await supabase.auth.admin.listUsers();
  const existing = listed?.users?.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );

  let userId = existing?.id;

  if (!userId) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) throw error;
    userId = data.user.id;
    console.log(`Created auth user ${email}`);
  } else {
    console.log(`Auth user already exists: ${email}`);
    await supabase.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
    });
  }

  const { error } = await supabase.from("admins").upsert({
    user_id: userId,
    email,
  });
  if (error) throw error;
  console.log(`Admin row ready for ${email}`);
  console.log("Sign in at /admin/login");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
