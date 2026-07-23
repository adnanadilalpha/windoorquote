import "server-only";
import path from "path";
import nodemailer from "nodemailer";
import type { ContactEmailSettings } from "@/lib/content/types";
import {
  buildContactNotificationEmail,
  buildTestEmail,
  EMAIL_LOGO_CID,
  type ContactMessagePayload,
} from "@/lib/email/templates";

export type { ContactMessagePayload };

export const defaultContactEmailSettings: ContactEmailSettings = {
  enabled: false,
  provider: "smtp",
  to_email: "",
  from_email: "",
  from_name: "WinDoor Quote",
  reply_to_submitter: true,
  resend_api_key: "",
  smtp_host: "smtp.gmail.com",
  smtp_port: 587,
  smtp_secure: false,
  smtp_user: "",
  smtp_pass: "",
};

const SMTP_TIMEOUT_MS = 20_000;

const EMAIL_LOGO_PATH = path.join(
  process.cwd(),
  "public/images/logo-email-white.png",
);

function formatSmtpError(error: unknown) {
  if (!(error instanceof Error)) return "Failed to send email.";

  const message = error.message || "Failed to send email.";
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code?: string }).code)
      : "";

  if (
    code === "ETIMEDOUT" ||
    code === "ESOCKET" ||
    message.toLowerCase().includes("timeout")
  ) {
    return "Could not reach the mail server. Check your internet connection, or try again in a moment.";
  }

  if (
    code === "EAUTH" ||
    message.toLowerCase().includes("invalid login") ||
    message.toLowerCase().includes("authentication")
  ) {
    return "Login failed. For Gmail/Yahoo use an App Password (not your normal password). For Outlook, use your Microsoft account password or app password.";
  }

  return message;
}

function createTransport(settings: ContactEmailSettings) {
  const port = Number(settings.smtp_port) || 587;
  const secure = Boolean(settings.smtp_secure) || port === 465;
  const user = (settings.smtp_user || settings.from_email).trim();

  return nodemailer.createTransport({
    host: settings.smtp_host.trim(),
    port,
    secure,
    requireTLS: !secure && port === 587,
    auth: {
      user,
      pass: settings.smtp_pass.replaceAll(" ", ""),
    },
    connectionTimeout: SMTP_TIMEOUT_MS,
    greetingTimeout: SMTP_TIMEOUT_MS,
    socketTimeout: SMTP_TIMEOUT_MS,
  });
}

function isSmtpReady(settings: ContactEmailSettings) {
  const user = (settings.smtp_user || settings.from_email).trim();
  return Boolean(
    settings.to_email.trim() &&
      settings.from_email.trim() &&
      settings.smtp_host.trim() &&
      user &&
      settings.smtp_pass.trim(),
  );
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
  if (!isSmtpReady(settings)) {
    return {
      error:
        "Fill in your email, password, and where messages should be delivered.",
    };
  }

  try {
    const transport = createTransport(settings);
    const fromName = settings.from_name.trim() || "WinDoor Quote";

    await transport.sendMail({
      from: `"${fromName}" <${settings.from_email.trim()}>`,
      to: settings.to_email.trim(),
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: [
        {
          filename: "logo-email-white.png",
          path: EMAIL_LOGO_PATH,
          cid: EMAIL_LOGO_CID,
          contentType: "image/png",
          contentDisposition: "inline",
        },
      ],
    });

    return { success: true };
  } catch (error) {
    return { error: formatSmtpError(error) };
  }
}

export async function sendContactNotification(
  settings: ContactEmailSettings,
  payload: ContactMessagePayload,
): Promise<{ status: "skipped" | "sent" | "failed"; error?: string }> {
  if (!settings.enabled) {
    return { status: "skipped" };
  }

  const email = buildContactNotificationEmail(payload);
  const result = await sendViaSmtp(settings, {
    subject: email.subject,
    text: email.text,
    html: email.html,
    replyTo: settings.reply_to_submitter ? payload.email : undefined,
  });

  if (result.error) {
    return { status: "failed", error: result.error };
  }
  return { status: "sent" };
}

export async function sendTestContactEmail(
  settings: ContactEmailSettings,
): Promise<{ error?: string; success?: boolean }> {
  const email = buildTestEmail();
  return sendViaSmtp(settings, {
    subject: email.subject,
    text: email.text,
    html: email.html,
  });
}
