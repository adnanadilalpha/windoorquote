export type ContactMessagePayload = {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  source_page: string;
};

/** Content-ID used when the white logo is attached inline via nodemailer. */
export const EMAIL_LOGO_CID = "wdq-logo";

export type EmailTemplateOptions = {
  /** Override logo src (preview). Defaults to cid: attachment for real sends. */
  logoSrc?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function emailLogoMarkup(logoSrc?: string) {
  const src = logoSrc?.trim() || `cid:${EMAIL_LOGO_CID}`;
  return `
    <img
      src="${escapeHtml(src)}"
      width="174"
      height="44"
      alt="WinDoor Quote"
      style="display:block;border:0;outline:none;text-decoration:none;height:44px;width:auto;max-width:174px;"
    />
  `;
}

function detailRow(label: string, value: string, last = false) {
  const border = last ? "" : "border-bottom:1px solid #e8eef3;";
  return `
    <tr>
      <td style="padding:13px 0;${border}width:110px;vertical-align:top;">
        <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.4;letter-spacing:0.06em;text-transform:uppercase;color:#6b7c8a;font-weight:600;">
          ${escapeHtml(label)}
        </p>
      </td>
      <td style="padding:13px 0;${border}vertical-align:top;">
        <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:#0f1c2a;">
          ${value}
        </p>
      </td>
    </tr>
  `;
}

function emailShell(options: {
  preheader: string;
  bodyHtml: string;
  footerNote?: string;
  logoSrc?: string;
}) {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>WinDoor Quote</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background:#edf2f6;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    ${escapeHtml(options.preheader)}
  </div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#edf2f6;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;background:#ffffff;border:1px solid #d9e4ec;border-radius:14px;overflow:hidden;">
          <tr>
            <td style="background:#0c527a;padding:0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding:22px 28px;">
                    ${emailLogoMarkup(options.logoSrc)}
                  </td>
                </tr>
                <tr>
                  <td style="height:3px;background:#34c6f5;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              ${options.bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 26px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;border-top:1px solid #eef2f5;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#8a97a5;">
                ${escapeHtml(options.footerNote || "Sent from your WinDoor Quote website.")}
              </p>
            </td>
          </tr>
        </table>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;">
          <tr>
            <td align="center" style="padding:18px 8px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              <p style="margin:0;font-size:11px;line-height:1.5;color:#9aa6b2;">
                © ${year} WinDoor Quote
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildContactNotificationEmail(
  payload: ContactMessagePayload,
  options?: EmailTemplateOptions,
) {
  const company = payload.company.trim() || "—";
  const phone = payload.phone.trim() || "—";
  const emailLink = `<a href="mailto:${escapeHtml(payload.email)}" style="color:#12689b;text-decoration:none;font-weight:600;">${escapeHtml(payload.email)}</a>`;
  const phoneLink =
    payload.phone.trim().length > 0
      ? `<a href="tel:${escapeHtml(payload.phone.replaceAll(" ", ""))}" style="color:#0f1c2a;text-decoration:none;">${escapeHtml(payload.phone)}</a>`
      : "—";

  const text = [
    "New website inquiry — WinDoor Quote",
    "",
    `Name: ${payload.name}`,
    `Company: ${company}`,
    `Email: ${payload.email}`,
    `Phone: ${phone}`,
    "",
    "Message:",
    payload.message,
    "",
    "—",
    "Sent from your WinDoor Quote website.",
  ].join("\n");

  const replyHref = `mailto:${escapeHtml(payload.email)}?subject=${encodeURIComponent(`Re: Your WinDoor Quote inquiry`)}`;

  const bodyHtml = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f7fafc;border:1px solid #e6eef4;border-radius:12px;">
      <tr>
        <td style="padding:6px 22px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            ${detailRow("Name", escapeHtml(payload.name))}
            ${detailRow("Company", escapeHtml(company))}
            ${detailRow("Email", emailLink)}
            ${detailRow("Phone", phoneLink, true)}
          </table>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:22px;border:1px solid #e6eef4;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="width:4px;background:#12689b;font-size:0;line-height:0;">&nbsp;</td>
        <td style="padding:18px 20px;background:#ffffff;">
          <p style="margin:0 0 10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.4;letter-spacing:0.06em;text-transform:uppercase;color:#6b7c8a;font-weight:600;">
            Message
          </p>
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.75;color:#0f1c2a;white-space:pre-wrap;">${escapeHtml(payload.message)}</p>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td height="48" style="height:48px;line-height:48px;font-size:0;">&nbsp;</td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:20px;">
      <tr>
        <td align="left">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${replyHref}" style="height:44px;v-text-anchor:middle;width:220px;" arcsize="12%" stroke="f" fillcolor="#12689b">
            <w:anchorlock/>
            <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">
              Reply to ${escapeHtml(payload.name)}
            </center>
          </v:roundrect>
          <![endif]-->
          <!--[if !mso]><!-- -->
          <a href="${replyHref}"
             style="display:inline-block;background:#12689b;border-radius:10px;padding:13px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.2;font-weight:650;color:#ffffff !important;text-decoration:none;">
            Reply to ${escapeHtml(payload.name)}
          </a>
          <!--<![endif]-->
        </td>
      </tr>
    </table>
  `;

  const html = emailShell({
    preheader: `New inquiry from ${payload.name}${payload.company ? ` · ${payload.company}` : ""}`,
    bodyHtml,
    logoSrc: options?.logoSrc,
  });

  return {
    subject: `New inquiry from ${payload.name}${payload.company.trim() ? ` · ${payload.company.trim()}` : ""}`,
    text,
    html,
  };
}

export function buildTestEmail(options?: EmailTemplateOptions) {
  const text = [
    "WinDoor Quote — email delivery test",
    "",
    "This is a test message from your website email setup.",
    "If you received this, delivery is working correctly.",
  ].join("\n");

  const bodyHtml = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #e6eef4;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="width:4px;background:#12689b;font-size:0;line-height:0;">&nbsp;</td>
        <td style="padding:20px;background:#f7fafc;">
          <p style="margin:0 0 6px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#6b7c8a;font-weight:600;">
            Status
          </p>
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.4;color:#0f1c2a;font-weight:650;">
            Email delivery verified
          </p>
        </td>
      </tr>
    </table>
  `;

  const html = emailShell({
    preheader: "Your WinDoor Quote email setup is working.",
    bodyHtml,
    footerNote: "Sent from Email setup in your WinDoor Quote CMS.",
    logoSrc: options?.logoSrc,
  });

  return {
    subject: "WinDoor Quote — email delivery test",
    text,
    html,
  };
}
