import nodemailer from "nodemailer";

const configured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
const transporter = configured ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
}) : null;

const money = value => `${new Intl.NumberFormat("fa-IR").format(value)} تومان`;

export async function sendQuoteEmail({ request, quoteUrl }) {
  if (!transporter) return { sent: false, configured: false };
  const rows = request.quote.items.map(item => `<tr><td style="padding:8px;border-bottom:1px solid #e1e8e2">${item.serviceId}</td><td style="padding:8px;border-bottom:1px solid #e1e8e2">${item.qty}</td><td style="padding:8px;border-bottom:1px solid #e1e8e2">${money(item.lineTotal)}</td></tr>`).join("");
  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: request.customer.email,
    subject: "پیشنهاد قیمت همکاری با KareOne",
    text: `سلام ${request.customer.name}\n\nپیشنهاد قیمت اختصاصی شما آماده شده است:\n${quoteUrl}\n\nبا احترام، تیم KareOne`,
    html: `<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;color:#172522;line-height:1.9"><h2>سلام ${request.customer.name}</h2><p>پیشنهاد قیمت اختصاصی شما در KareOne آماده شده است.</p><table style="border-collapse:collapse;width:100%"><thead><tr><th style="text-align:right;padding:8px">خدمت</th><th style="text-align:right;padding:8px">تعداد</th><th style="text-align:right;padding:8px">جمع</th></tr></thead><tbody>${rows}</tbody></table><p style="margin-top:24px"><a href="${quoteUrl}" style="display:inline-block;padding:10px 18px;color:#fff;background:#103f38;border-radius:8px;text-decoration:none">مشاهده پیشنهاد کامل</a></p><p>با احترام<br>تیم KareOne</p></div>`
  });
  return { sent: true, configured: true };
}

export const isEmailConfigured = configured;
