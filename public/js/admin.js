import { api } from "./api.js";
import { $, $$, dateText, escapeHtml, fa, money, statusLabel, toast } from "./shared.js";

const TOKEN_KEY = "kareone_admin_token";
const state = { token: sessionStorage.getItem(TOKEN_KEY), requests: [], services: [], categories: {}, pricing: [], status: "all", activeId: null };
const serviceById = id => state.services.find(service => service.id === id);

function setToken(token) { state.token = token; if (token) sessionStorage.setItem(TOKEN_KEY, token); else sessionStorage.removeItem(TOKEN_KEY); }

async function login(event) {
  event.preventDefault(); $("#loginError").textContent = "";
  try { const response = await api.login({ username: $("#loginUsername").value.trim(), password: $("#loginPassword").value }); setToken(response.token); await loadDashboard(); }
  catch (error) { $("#loginError").textContent = error.message; }
}

async function loadDashboard() {
  try {
    const [stats, requestData, serviceData, pricingData] = await Promise.all([api.getStats(state.token), api.getRequests(state.token), api.getServices(), api.getServicePricing(state.token)]);
    state.requests = requestData.requests; state.services = serviceData.services; state.categories = serviceData.categories; state.pricing = pricingData.pricing;
    $("#loginPanel").classList.add("hidden"); $("#dashboard").classList.remove("hidden"); $("#logoutButton").classList.remove("hidden"); renderStats(stats); renderPricing(); renderRequests();
  } catch (error) {
    if (error.status === 401) { setToken(null); $("#loginPanel").classList.remove("hidden"); $("#dashboard").classList.add("hidden"); $("#logoutButton").classList.add("hidden"); }
    else toast(error.message, "error");
  }
}

function renderStats(stats) { $("#adminStats").innerHTML = `<div class="stat-card"><span>کل درخواست‌ها</span><strong>${fa(stats.total)}</strong></div><div class="stat-card"><span>در انتظار بررسی</span><strong>${fa(stats.pending)}</strong></div><div class="stat-card"><span>پیشنهادهای ارسال‌شده</span><strong>${fa(stats.quoted)}</strong></div><div class="stat-card"><span>خدمات در کاتالوگ</span><strong>${fa(state.services.length)}</strong></div>`; }

function renderPricing() {
  const pricingMap = new Map(state.pricing.map(item => [item.serviceId, item]));
  $("#servicePricingList").innerHTML = state.services.map(service => {
    const setting = pricingMap.get(service.id) || { price: 0, isVisible: false };
    return `<div class="service-pricing-row"><div class="service-pricing-title"><strong>${escapeHtml(service.title)}</strong><span>${service.titleEn ? `${escapeHtml(service.titleEn)} · ` : ""}${escapeHtml(state.categories[service.category] || "")}</span></div><label class="catalog-price-field"><input data-catalog-price="${service.id}" type="number" min="0" step="1000" value="${setting.price || ""}" placeholder="مبلغ واحد" /><span>تومان</span></label><label class="visibility-toggle"><input data-price-visible="${service.id}" type="checkbox" ${setting.isVisible ? "checked" : ""} /><span class="toggle-track"></span><span class="visibility-label">${setting.isVisible ? "نمایش" : "مخفی"}</span></label></div>`;
  }).join("");
  $$('[data-price-visible]').forEach(input => input.addEventListener("change", () => { const label = input.closest(".visibility-toggle").querySelector(".visibility-label"); label.textContent = input.checked ? "نمایش" : "مخفی"; }));
}

async function saveCatalogPricing() {
  const items = state.services.map(service => ({ serviceId: service.id, price: Number($(`[data-catalog-price="${service.id}"]`).value) || 0, isVisible: $(`[data-price-visible="${service.id}"]`).checked }));
  const invalid = items.find(item => item.isVisible && item.price <= 0);
  if (invalid) { toast("برای خدمات قابل نمایش، مبلغ بیشتر از صفر وارد کنید.", "error"); return; }
  const button = $("#saveServicePricing"); button.disabled = true; button.textContent = "در حال ذخیره…";
  try { const response = await api.saveServicePricing(state.token, items); state.pricing = response.pricing; renderPricing(); toast("تنظیمات نمایش قیمت خدمات ذخیره شد."); }
  catch (error) { toast(error.message, "error"); }
  finally { button.disabled = false; button.textContent = "ذخیره تنظیمات قیمت"; }
}

function hideAllCatalogPrices() {
  $$('[data-price-visible]').forEach(input => { input.checked = false; input.closest(".visibility-toggle").querySelector(".visibility-label").textContent = "مخفی"; });
}

function renderRequests() {
  const requests = state.status === "all" ? state.requests : state.requests.filter(request => state.status === "quoted" ? request.status === "quoted" : request.status !== "quoted");
  $("#requestList").innerHTML = requests.length ? requests.map(request => `<article class="request-card"><div><div class="request-card-head"><h3>${escapeHtml(request.customer.name)}</h3><span class="request-id">${request.id}</span><span class="status-badge ${request.status === "quoted" ? "status-quoted" : "status-new"}">${statusLabel(request.status)}</span></div><div class="request-card-meta"><span>${escapeHtml(request.customer.company || "بدون نام شرکت")}</span><span class="ltr">${escapeHtml(request.customer.email)}</span><span>${dateText(request.createdAt)}</span></div><div class="request-card-items">${request.items.map(item => `<span>${escapeHtml(serviceById(item.serviceId)?.title || item.serviceId)}${item.qty > 1 ? ` × ${fa(item.qty)}` : ""}</span>`).join("")}</div></div><div class="request-card-action"><button class="${request.status === "quoted" ? "secondary-button" : "primary-button"}" data-open-request="${request.id}" type="button">${request.status === "quoted" ? "مشاهده پیشنهاد" : "بررسی و قیمت‌گذاری"}</button></div></article>`).join("") : `<div class="empty-state"><div><strong>درخواستی در این بخش وجود ندارد</strong><span>وقتی مشتری سبد خود را ثبت کند، اینجا نمایش داده می‌شود.</span></div></div>`;
  $$('[data-open-request]').forEach(button => button.addEventListener("click", () => openEditor(button.dataset.openRequest)));
}

function openEditor(id) {
  const request = state.requests.find(item => item.id === id); if (!request) return;
  state.activeId = id; const quote = request.quote; const priceMap = Object.fromEntries((quote?.items || []).map(item => [item.serviceId, item.unitPrice]));
  $("#adminModalTitle").textContent = request.status === "quoted" ? "پیشنهاد قیمت مشتری" : "بررسی و قیمت‌گذاری"; $("#adminModalSub").textContent = `${escapeHtml(request.customer.name)} · ${request.id}`;
  $("#adminModalBody").innerHTML = `<div class="admin-detail-grid"><div class="detail-block"><h3>اطلاعات مشتری</h3><p><b>${escapeHtml(request.customer.name)}</b><br>${escapeHtml(request.customer.company || "بدون نام شرکت")}<br><span class="ltr">${escapeHtml(request.customer.email)}</span>${request.customer.phone ? `<br><span class="ltr">${escapeHtml(request.customer.phone)}</span>` : ""}</p></div><div class="detail-block"><h3>توضیح مشتری</h3><p>${escapeHtml(request.note || "توضیحی ثبت نشده است.")}</p></div><div class="detail-block full"><h3>قیمت هر خدمت را وارد کنید</h3><div class="admin-items">${request.items.map(item => { const service = serviceById(item.serviceId); return `<div class="admin-item-row"><div><strong>${escapeHtml(service?.title || item.serviceId)}</strong><small>${escapeHtml(state.categories[service?.category] || "")}</small></div><div class="qty">× ${fa(item.qty)}</div><input class="price-input" data-price-id="${item.serviceId}" type="number" min="0" step="1000" value="${priceMap[item.serviceId] || ""}" placeholder="قیمت واحد" /></div>`; }).join("")}</div></div><div class="detail-block"><h3>شرایط پیشنهاد</h3><div class="field"><label for="quoteDiscount">تخفیف (تومان)</label><input id="quoteDiscount" class="admin-compact-input" type="number" min="0" step="1000" value="${quote?.discount || 0}" /></div><div class="field"><label for="quoteValidDays">مدت اعتبار (روز)</label><input id="quoteValidDays" class="admin-compact-input" type="number" min="1" value="${quote?.validDays || 10}" /></div><div class="field"><label for="quotePayment">شرایط پرداخت</label><input id="quotePayment" class="admin-compact-input" value="${escapeHtml(quote?.paymentTerms || "طبق توافق طرفین")}" /></div></div><div class="detail-block"><h3>یادداشت برای مشتری</h3><textarea class="admin-compact-input" id="quoteNote" style="min-height:155px;margin-top:9px;resize:vertical">${escapeHtml(quote?.note || "")}</textarea></div><div class="full"><div class="admin-summary" id="adminSummary"></div></div></div><div id="quoteLinkArea"></div><div class="modal-actions"><button class="secondary-button" id="adminCancel" type="button">بستن</button><button class="primary-button" id="saveQuote" type="button">${request.status === "quoted" ? "ذخیره تغییرات" : "ذخیره و ساخت لینک پیشنهاد"} <span>←</span></button></div>`;
  $$(".price-input, #quoteDiscount", $("#adminModalBody")).forEach(input => input.addEventListener("input", renderSummary)); $("#adminCancel").addEventListener("click", closeEditor); $("#saveQuote").addEventListener("click", saveQuote); renderSummary();
  if (request.quoteToken) renderQuoteLink(`/quote.html?token=${encodeURIComponent(request.quoteToken)}`, request);
  $("#adminModal").classList.remove("hidden"); $("#adminBackdrop").classList.remove("hidden"); document.body.classList.add("locked");
}

function calculate() {
  const request = state.requests.find(item => item.id === state.activeId); const prices = Object.fromEntries($$(".price-input", $("#adminModalBody")).map(input => [input.dataset.priceId, Math.max(0, Number(input.value) || 0)]));
  const subtotal = request.items.reduce((sum, item) => sum + (prices[item.serviceId] || 0) * item.qty, 0); const discount = Math.min(subtotal, Math.max(0, Number($("#quoteDiscount").value) || 0));
  return { prices, subtotal, discount, total: subtotal - discount };
}
function renderSummary() { const result = calculate(); $("#adminSummary").innerHTML = `<div class="admin-summary-row"><span>جمع خدمات</span><strong>${money(result.subtotal)}</strong></div><div class="admin-summary-row"><span>تخفیف</span><strong>${money(result.discount)}</strong></div><div class="admin-summary-row total"><span>قیمت نهایی پیشنهادی</span><strong>${money(result.total)}</strong></div>`; }

async function saveQuote() {
  const result = calculate(); if (result.total <= 0) { toast("برای ساخت پیشنهاد، حداقل یک قیمت وارد کنید.", "error"); return; }
  const button = $("#saveQuote"); button.disabled = true; button.textContent = "در حال ذخیره…";
  try {
    const response = await api.saveQuote(state.token, state.activeId, { prices: result.prices, discount: result.discount, validDays: Number($("#quoteValidDays").value) || 10, paymentTerms: $("#quotePayment").value.trim(), note: $("#quoteNote").value.trim() });
    state.requests = state.requests.map(request => request.id === state.activeId ? response.request : request); renderQuoteLink(response.quoteUrl, response.request); $("#adminModalTitle").textContent = "پیشنهاد قیمت مشتری"; button.textContent = "ذخیره تغییرات ←"; renderRequests(); toast("پیشنهاد قیمت ذخیره شد و لینک اختصاصی ساخته شد.");
  } catch (error) { toast(error.message, "error"); button.textContent = "تلاش دوباره"; } finally { button.disabled = false; }
}

function renderQuoteLink(url, request) {
  $("#quoteLinkArea").innerHTML = `<div class="quote-link-box"><strong>لینک اختصاصی پیشنهاد برای ${escapeHtml(request.customer.name)}</strong><span class="quote-link">${escapeHtml(url)}</span><div class="quote-link-actions"><button id="copyQuoteLink" type="button">کپی لینک</button><button id="emailQuoteLink" type="button">ارسال با ایمیل</button><button id="openQuoteLink" type="button">مشاهده صفحه</button></div></div>`;
  $("#copyQuoteLink").addEventListener("click", async () => { await navigator.clipboard?.writeText(new URL(url, location.origin).href); toast("لینک پیشنهاد کپی شد."); });
  $("#emailQuoteLink").addEventListener("click", async () => { try { const result = await api.sendQuote(state.token, request.id); toast(result.sent ? "ایمیل پیشنهاد ارسال شد." : "تنظیمات ایمیل سرور کامل نیست.", result.sent ? "success" : "error"); } catch (error) { toast(error.message, "error"); } });
  $("#openQuoteLink").addEventListener("click", () => window.open(new URL(url, location.origin).href, "_blank", "noopener"));
}

function closeEditor() { $("#adminModal").classList.add("hidden"); $("#adminBackdrop").classList.add("hidden"); document.body.classList.remove("locked"); state.activeId = null; }

$("#loginForm").addEventListener("submit", login); $("#logoutButton").addEventListener("click", () => { setToken(null); location.reload(); }); $("#adminClose").addEventListener("click", closeEditor); $("#adminBackdrop").addEventListener("click", closeEditor);
$("#saveServicePricing").addEventListener("click", saveCatalogPricing); $("#hideAllPrices").addEventListener("click", hideAllCatalogPrices);
$$('#statusFilter button').forEach(button => button.addEventListener("click", () => { state.status = button.dataset.status; $$("#statusFilter button").forEach(item => item.classList.toggle("active", item === button)); renderRequests(); }));
if (state.token) loadDashboard();
