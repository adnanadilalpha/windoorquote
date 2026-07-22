"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type AdminRow = {
  user_id: string;
  email: string;
  created_at: string;
};

async function requireAdminActor() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id, email")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) throw new Error("Not an admin");
  return { user, admin };
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function validatePassword(password: string) {
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  return null;
}

export async function listAdmins(): Promise<AdminRow[]> {
  await requireAdminActor();
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("admins")
    .select("user_id, email, created_at")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as AdminRow[]) ?? [];
}

export async function createAdmin(input: {
  email: string;
  password: string;
}): Promise<{ error?: string; success?: boolean }> {
  try {
    await requireAdminActor();
  } catch {
    return { error: "Not authorized." };
  }

  const email = normalizeEmail(input.email);
  const password = input.password;

  if (!email || !email.includes("@")) {
    return { error: "Enter a valid email address." };
  }

  const passwordError = validatePassword(password);
  if (passwordError) return { error: passwordError };

  const adminClient = createAdminClient();

  const { data: existingAdmin } = await adminClient
    .from("admins")
    .select("user_id")
    .ilike("email", email)
    .maybeSingle();

  if (existingAdmin) {
    return { error: "An admin with this email already exists." };
  }

  const { data: listed, error: listError } =
    await adminClient.auth.admin.listUsers({ perPage: 1000 });
  if (listError) return { error: listError.message };

  const existingUser = listed.users.find(
    (u) => u.email?.toLowerCase() === email,
  );

  let userId = existingUser?.id;

  if (!userId) {
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) return { error: error.message };
    userId = data.user.id;
  } else {
    const { error } = await adminClient.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
    });
    if (error) return { error: error.message };
  }

  const { error: upsertError } = await adminClient.from("admins").upsert({
    user_id: userId,
    email,
  });

  if (upsertError) return { error: upsertError.message };

  revalidatePath("/admin/admins");
  return { success: true };
}

export async function resetAdminPassword(input: {
  userId: string;
  password: string;
}): Promise<{ error?: string; success?: boolean }> {
  try {
    await requireAdminActor();
  } catch {
    return { error: "Not authorized." };
  }

  const passwordError = validatePassword(input.password);
  if (passwordError) return { error: passwordError };

  const adminClient = createAdminClient();

  const { data: target } = await adminClient
    .from("admins")
    .select("user_id")
    .eq("user_id", input.userId)
    .maybeSingle();

  if (!target) return { error: "Admin not found." };

  const { error } = await adminClient.auth.admin.updateUserById(input.userId, {
    password: input.password,
    email_confirm: true,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/admins");
  return { success: true };
}

export async function removeAdmin(
  userId: string,
): Promise<{ error?: string; success?: boolean }> {
  let actor;
  try {
    actor = await requireAdminActor();
  } catch {
    return { error: "Not authorized." };
  }

  if (actor.user.id === userId) {
    return { error: "You cannot remove your own admin access." };
  }

  const adminClient = createAdminClient();

  const { data: admins, error: listError } = await adminClient
    .from("admins")
    .select("user_id");

  if (listError) return { error: listError.message };

  if ((admins?.length ?? 0) <= 1) {
    return { error: "Cannot remove the last admin." };
  }

  const { data: target } = await adminClient
    .from("admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!target) return { error: "Admin not found." };

  const { error: deleteRowError } = await adminClient
    .from("admins")
    .delete()
    .eq("user_id", userId);

  if (deleteRowError) return { error: deleteRowError.message };

  const { error: deleteUserError } =
    await adminClient.auth.admin.deleteUser(userId);

  if (deleteUserError) {
    // Row already removed; surface auth cleanup failure so it can be retried.
    return {
      error: `Admin access removed, but auth user cleanup failed: ${deleteUserError.message}`,
    };
  }

  revalidatePath("/admin/admins");
  return { success: true };
}
