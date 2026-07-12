import { api } from "./api.js";
import { $, dateText, escapeHtml, fa, money } from "./shared.js";

const page = $("#quotePage");
const token = new URLSearchParams(location.search).get("token");

function render(payload, services) {
  const { requestId, customer, items, quote } = payload;
  const serviceNames = new Map(services.map(service => [service.id, service]));
  const rows = quote.items.map(item => { const service = serviceNames.get(item.serviceId); return `<tr><td><strong>${escapeHtml(service?.title || item.serviceId)}</strong><small>${escapeHtml(service?.short || "خدمت توسعه بازار KareOne")}</small></td><td>${fa(item.qty)}</td><td>${money(item.unitPrice)}</td><td><strong>${money(item.lineTotal)}</strong></td></tr>`; }).join("");
  page.innerHTML = `<div class="quote-shell"><div class="quote-header"><a class="brand" href="/"><span class="brand-mark">K</span><span class="brand-copy"><strong>KAREONE</strong><small>استودیوی رشد بازار</small></span></a><span class="quote-label">پیشنهاد اختصاصی · ${escapeHtml(requestId)}</span></div><article class="quote-paper"><div class="quote-paper-top"><div><div class="section-kicker">پیشنهاد همکاری KareOne</div><h1>برای <span>${escapeHtml(customer.name)}</span></h1><p class="quote-intro">با توجه به درخواست ثبت‌شده، پیشنهاد زیر برای خدمات توسعه بازار و برندینگ کسب‌وکار شما آماده شده است. جزئیات این پیشنهاد متناسب با اقلام انتخابی شما تنظیم شده است.</p></div><div class="quote-meta-box"><span>تاریخ صدور</span><strong>${dateText(quote.updatedAt || quote.createdAt)}</strong><span style="margin-top:9px">اعتبار تا</span><strong>${dateText(quote.validUntil)}</strong></div></div><table class="quote-table"><thead><tr><th>خدمت</th><th>تعداد</th><th>قیمت واحد</th><th>جمع</th></tr></thead><tbody>${rows}</tbody></table><div class="quote-totals"><div class="quote-total-row"><span>جمع خدمات</span><strong>${money(quote.subtotal)}</strong></div><div class="quote-total-row"><span>تخفیف همکاری</span><strong>${money(quote.discount)}</strong></div><div class="quote-total-row final"><span>قیمت نهایی</span><strong>${money(quote.total)}</strong></div></div><div class="quote-details"><div class="quote-detail"><span>مخاطب پیشنهاد</span><strong>${escapeHtml(customer.company || customer.name)}</strong></div><div class="quote-detail"><span>شرایط پرداخت</span><strong>${escapeHtml(quote.paymentTerms || "طبق توافق طرفین")}</strong></div></div>${quote.note ? `<div class="quote-note"><b>یادداشت تیم KareOne</b><br>${escapeHtml(quote.note)}</div>` : ""}<div class="quote-footer"><strong>KAREONE · استودیوی رشد بازار</strong><span>در صورت تأیید، برای هماهنگی شروع همکاری به ایمیل ارسال‌شده پاسخ دهید.</span></div></article></div>`;
}

async function boot() {
  if (!token) { page.innerHTML = `<div class="quote-error"><h1>لینک پیشنهاد ناقص است</h1><p>برای مشاهده پیشنهاد، لینک کامل را باز کنید.</p></div>`; return; }
  try { const [response, serviceData] = await Promise.all([api.getQuote(token), api.getServices()]); render(response.quote, serviceData.services); } catch (error) { page.innerHTML = `<div class="quote-error"><h1>این پیشنهاد قابل نمایش نیست</h1><p>${escapeHtml(error.message)}</p></div>`; }
}
boot();
