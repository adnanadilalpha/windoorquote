"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  defaultContactEmailSettings,
  sendContactNotification,
  sendTestContactEmail,
} from "@/lib/email/contact-notify";
import type { ContactEmailSettings } from "@/lib/content/types";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) throw new Error("Not an admin");
  return supabase;
}

function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/privacy-policy");
  revalidatePath("/window-and-door-manufacturing-software");
  revalidateTag("cms", "max");
}

function normalizeEmailSettings(
  row: Partial<ContactEmailSettings> | null | undefined,
): ContactEmailSettings {
  return {
    ...defaultContactEmailSettings,
    ...row,
    provider: "smtp",
    smtp_port: Number(row?.smtp_port ?? defaultContactEmailSettings.smtp_port),
    enabled: Boolean(row?.enabled),
    smtp_secure: Boolean(row?.smtp_secure),
    reply_to_submitter:
      row?.reply_to_submitter === undefined
        ? true
        : Boolean(row.reply_to_submitter),
    smtp_user: String(row?.smtp_user || row?.from_email || ""),
    resend_api_key: "",
  };
}

export async function upsertSetting(key: string, value: unknown) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("site_settings").upsert({
    key,
    value,
    updated_at: new Date().toISOString(),
  });
  if (error) return { error: error.message };
  revalidateSite();
  return { success: true };
}

export async function createRow(
  table: string,
  row: Record<string, unknown>,
) {
  const supabase = await requireAdmin();
  const { data, error } = await supabase.from(table).insert(row).select().single();
  if (error) return { error: error.message };
  revalidateSite();
  return { data };
}

export async function updateRow(
  table: string,
  id: string,
  row: Record<string, unknown>,
) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from(table).update(row).eq("id", id);
  if (error) return { error: error.message };
  revalidateSite();
  return { success: true };
}

export async function deleteRow(table: string, id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateSite();
  return { success: true };
}

export async function reorderRows(
  table: string,
  orderedIds: string[],
) {
  const supabase = await requireAdmin();
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from(table)
      .update({ sort_order: i })
      .eq("id", orderedIds[i]);
    if (error) return { error: error.message };
  }
  revalidateSite();
  return { success: true };
}

export async function markContactRead(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("contact_submissions")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/contact-inbox");
  return { success: true };
}

export async function deleteContact(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("contact_submissions")
    .delete()
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/contact-inbox");
  return { success: true };
}

export async function submitContactForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const source_page = String(formData.get("source_page") ?? "/").trim();

  if (!name || !email || !message) {
    return { error: "Name, email, and message are required." };
  }

  const payload = {
    name,
    company,
    email,
    phone,
    message,
    source_page,
  };

  // Service role: insert + optional email notify (settings table is admin-only).
  const adminClient = createAdminClient();
  const { data: inserted, error } = await adminClient
    .from("contact_submissions")
    .insert(payload)
    .select("id")
    .single();

  if (error) return { error: error.message };

  const { data: settingsRow } = await adminClient
    .from("contact_email_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  const settings = normalizeEmailSettings(
    settingsRow as ContactEmailSettings | null,
  );
  const delivery = await sendContactNotification(settings, payload);

  if (inserted?.id) {
    await adminClient
      .from("contact_submissions")
      .update({
        email_status: delivery.status,
        email_error: delivery.error ?? null,
      })
      .eq("id", inserted.id);
  }

  revalidatePath("/admin/contact-inbox");
  return { success: true };
}

export async function saveContactEmailSettings(
  input: ContactEmailSettings,
  options?: { keepExistingPassword?: boolean },
) {
  try {
    await requireAdmin();
  } catch {
    return { error: "Not authorized." };
  }

  const adminClient = createAdminClient();
  const next = normalizeEmailSettings(input);

  const { data: existing } = await adminClient
    .from("contact_email_settings")
    .select("smtp_pass")
    .eq("id", 1)
    .maybeSingle();

  if (
    (options?.keepExistingPassword || !next.smtp_pass.trim()) &&
    existing?.smtp_pass
  ) {
    next.smtp_pass = existing.smtp_pass;
  }

  if (next.enabled) {
    if (!next.from_email.trim()) {
      return { error: "Enter your email address." };
    }
    if (!next.to_email.trim()) {
      return { error: "Enter where contact messages should be delivered." };
    }
    if (!next.smtp_host.trim()) {
      return { error: "Choose an email provider (Gmail, Outlook, Yahoo, or Other)." };
    }
    if (!next.smtp_pass.trim()) {
      return {
        error:
          "Enter your email password (for Gmail/Yahoo use an App Password).",
      };
    }
  }

  next.smtp_user = next.smtp_user.trim() || next.from_email.trim();
  next.provider = "smtp";
  next.resend_api_key = "";

  const { error } = await adminClient.from("contact_email_settings").upsert({
    id: 1,
    ...next,
    updated_at: new Date().toISOString(),
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/email");
  return { success: true };
}

export async function testContactEmailSettings(
  input: ContactEmailSettings,
  options?: { keepExistingPassword?: boolean },
) {
  try {
    await requireAdmin();
  } catch {
    return { error: "Not authorized." };
  }

  const adminClient = createAdminClient();
  let settings = normalizeEmailSettings({ ...input, enabled: true });

  const { data: existing } = await adminClient
    .from("contact_email_settings")
    .select("smtp_pass")
    .eq("id", 1)
    .maybeSingle();

  if (
    (options?.keepExistingPassword || !settings.smtp_pass.trim()) &&
    existing?.smtp_pass
  ) {
    settings = { ...settings, smtp_pass: existing.smtp_pass };
  }

  settings.smtp_user =
    settings.smtp_user.trim() || settings.from_email.trim();

  return sendTestContactEmail(settings);
}
