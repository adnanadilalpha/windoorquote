import "server-only";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import type { ContactEmailSettings } from "@/lib/content/types";

/** Shared Resend sender — works without domain verification. */
export const RESEND_SHARED_FROM = "WinDoor Quote <onboarding@resend.dev>";

export const defaultContactEmailSettings: ContactEmailSettings = {
  enabled: false,
  provider: "resend",
  to_email: "",
  from_email: "",
  from_name: "WinDoor Quote",
  reply_to_submitter: true,
  resend_api_key: "",
  smtp_host: "",
  smtp_port: 587,
  smtp_secure: false,
  smtp_user: "",
  smtp_pass: "",
};

export type ContactMessagePayload = {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  source_page: string;
};

const SMTP_TIMEOUT_MS = 15_000;

export function resolveResendApiKey(settings: ContactEmailSettings) {
  return (
    settings.resend_api_key.trim() ||
    process.env.RESEND_API_KEY?.trim() ||
    ""
  );
}

export function hasPlatformResendKey() {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildNotificationContent(payload: ContactMessagePayload) {
  const lines = [
    `Name: ${payload.name}`,
    `Company: ${payload.company || "—"}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "—"}`,
    `Source: ${payload.source_page}`,
    "",
    "Message:",
    payload.message,
  ];

  const text = lines.join("\n");
  const html = `
    <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:#0f1c2a">
      <p><strong>New contact form submission</strong></p>
      <p>
        <strong>Name:</strong> ${escapeHtml(payload.name)}<br />
        <strong>Company:</strong> ${escapeHtml(payload.company || "—")}<br />
        <strong>Email:</strong> ${escapeHtml(payload.email)}<br />
        <strong>Phone:</strong> ${escapeHtml(payload.phone || "—")}<br />
        <strong>Source:</strong> ${escapeHtml(payload.source_page)}
      </p>
      <p><strong>Message</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>
    </div>
  `;

  return { text, html };
}

function formatFrom(settings: ContactEmailSettings) {
  const name = settings.from_name.trim() || "WinDoor Quote";
  const email = settings.from_email.trim();
  // Custom from only if they provided a verified domain address; otherwise shared Resend sender.
  if (email && !email.endsWith("@resend.dev")) {
    return `${name} <${email}>`;
  }
  return `${name} <onboarding@resend.dev>`;
}

async function sendViaResend(
  settings: ContactEmailSettings,
  options: {
    subject: string;
    text: string;
    html: string;
    replyTo?: string;
  },
): Promise<{ error?: string; success?: boolean }> {
  const apiKey = resolveResendApiKey(settings);
  if (!apiKey) {
    return {
      error:
        "Add a Resend API key on this page (or ask your site host to set RESEND_API_KEY).",
    };
  }
  if (!settings.to_email.trim()) {
    return { error: "Enter the email address that should receive notifications." };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: formatFrom(settings),
      to: [settings.to_email.trim()],
      subject: options.subject,
      text: options.text,
      html: options.html,
      replyTo: options.replyTo,
    });

    if (error) {
      return { error: error.message };
    }
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to send with Resend.",
    };
  }
}

async function sendViaSmtp(
  settings: ContactEmailSettings,
  options: {
    subject: string;
    text: string;
    html: string;
    replyTo?: string;
  },
): Promise<{ error?: string; success?: boolean }> {
  if (
    !settings.to_email.trim() ||
    !settings.from_email.trim() ||
    !settings.smtp_host.trim() ||
    !settings.smtp_user.trim() ||
    !settings.smtp_pass.trim()
  ) {
    return { error: "SMTP settings are incomplete." };
  }

  try {
    const port = Number(settings.smtp_port) || 587;
    const secure = Boolean(settings.smtp_secure) || port === 465;
    const transport = nodemailer.createTransport({
      host: settings.smtp_host.trim(),
      port,
      secure,
      requireTLS: !secure && port === 587,
      auth: {
        user: settings.smtp_user.trim(),
        pass: settings.smtp_pass.replaceAll(" ", ""),
      },
      connectionTimeout: SMTP_TIMEOUT_MS,
      greetingTimeout: SMTP_TIMEOUT_MS,
      socketTimeout: SMTP_TIMEOUT_MS,
    });

    const fromName = settings.from_name.trim() || "WinDoor Quote";
    await transport.sendMail({
      from: `"${fromName}" <${settings.from_email.trim()}>`,
      to: settings.to_email.trim(),
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "SMTP send failed.",
    };
  }
}

export async function sendContactNotification(
  settings: ContactEmailSettings,
  payload: ContactMessagePayload,
): Promise<{ status: "skipped" | "sent" | "failed"; error?: string }> {
  if (!settings.enabled) {
    return { status: "skipped" };
  }

  const { text, html } = buildNotificationContent(payload);
  const replyTo = settings.reply_to_submitter
    ? payload.email
    : undefined;

  const result =
    settings.provider === "smtp"
      ? await sendViaSmtp(settings, {
          subject: `New contact message from ${payload.name}`,
          text,
          html,
          replyTo,
        })
      : await sendViaResend(settings, {
          subject: `New contact message from ${payload.name}`,
          text,
          html,
          replyTo,
        });

  if (result.error) {
    return { status: "failed", error: result.error };
  }
  return { status: "sent" };
}

export async function sendTestContactEmail(
  settings: ContactEmailSettings,
): Promise<{ error?: string; success?: boolean }> {
  const result =
    settings.provider === "smtp"
      ? await sendViaSmtp(settings, {
          subject: "WinDoor Quote — test email",
          text: "This is a test email from your WinDoor Quote email setup. Delivery is working.",
          html: "<p>This is a test email from your WinDoor Quote email setup. <strong>Delivery is working.</strong></p>",
        })
      : await sendViaResend(settings, {
          subject: "WinDoor Quote — test email",
          text: "This is a test email from your WinDoor Quote email setup. Delivery is working.",
          html: "<p>This is a test email from your WinDoor Quote email setup. <strong>Delivery is working.</strong></p>",
        });

  return result;
}
