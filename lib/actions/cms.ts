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
  const provider =
    row?.provider === "smtp" || row?.provider === "resend"
      ? row.provider
      : "resend";

  return {
    ...defaultContactEmailSettings,
    ...row,
    provider,
    smtp_port: Number(row?.smtp_port ?? defaultContactEmailSettings.smtp_port),
    enabled: Boolean(row?.enabled),
    smtp_secure: Boolean(row?.smtp_secure),
    reply_to_submitter:
      row?.reply_to_submitter === undefined
        ? true
        : Boolean(row.reply_to_submitter),
    resend_api_key: String(row?.resend_api_key ?? ""),
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
  options?: { keepExistingPassword?: boolean; keepExistingApiKey?: boolean },
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
    .select("smtp_pass, resend_api_key")
    .eq("id", 1)
    .maybeSingle();

  if (
    (options?.keepExistingPassword || !next.smtp_pass.trim()) &&
    existing?.smtp_pass
  ) {
    next.smtp_pass = existing.smtp_pass;
  }
  if (
    (options?.keepExistingApiKey || !next.resend_api_key.trim()) &&
    existing?.resend_api_key
  ) {
    next.resend_api_key = existing.resend_api_key;
  }

  if (next.enabled) {
    if (!next.to_email.trim()) {
      return { error: "Enter the email address that should receive messages." };
    }
    if (next.provider === "resend") {
      const key =
        next.resend_api_key.trim() || process.env.RESEND_API_KEY?.trim() || "";
      if (!key) {
        return {
          error:
            "Paste your Resend API key, or ask your site host to set RESEND_API_KEY.",
        };
      }
    } else if (
      !next.from_email.trim() ||
      !next.smtp_host.trim() ||
      !next.smtp_user.trim() ||
      !next.smtp_pass.trim()
    ) {
      return { error: "SMTP settings are incomplete." };
    }
  }

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
  options?: { keepExistingPassword?: boolean; keepExistingApiKey?: boolean },
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
    .select("smtp_pass, resend_api_key")
    .eq("id", 1)
    .maybeSingle();

  if (
    (options?.keepExistingPassword || !settings.smtp_pass.trim()) &&
    existing?.smtp_pass
  ) {
    settings = { ...settings, smtp_pass: existing.smtp_pass };
  }
  if (
    (options?.keepExistingApiKey || !settings.resend_api_key.trim()) &&
    existing?.resend_api_key
  ) {
    settings = { ...settings, resend_api_key: existing.resend_api_key };
  }

  return sendTestContactEmail(settings);
}
