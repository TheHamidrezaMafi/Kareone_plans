import { api } from "./api.js";
import { $, $$, escapeHtml, fa, money, serviceIcon, toast } from "./shared.js";

const CART_KEY = "kareone_cart";
const DEFAULT_MAX_QUANTITY = 999;
const SLIDER_STEPS = 1000;
const state = { services: [], categories: {}, filter: "all", cart: loadCart() };

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return []; }
}
function saveCart() { localStorage.setItem(CART_KEY, JSON.stringify(state.cart)); }
function serviceById(id) { return state.services.find(service => service.id === id); }
function cartCount() { return state.cart.reduce((sum, item) => sum + item.qty, 0); }
function selected(id) { return state.cart.find(item => item.serviceId === id); }
function quantityLimits(id) { const service = serviceById(id); return { minimum: service?.minQuantity || 1, maximum: service?.maxQuantity || DEFAULT_MAX_QUANTITY }; }
function quantityFor(id) { return selected(id)?.qty || quantityLimits(id).minimum; }
function clampQuantity(value, serviceId) { const { minimum, maximum } = quantityLimits(serviceId); return Math.min(maximum, Math.max(minimum, Math.round(Number(value) || minimum))); }
function sliderPosition(quantity, minimum, maximum) { if (maximum <= minimum) return 0; const safeQuantity = Math.min(maximum, Math.max(minimum, Number(quantity) || minimum)); return Math.round((Math.log(safeQuantity / minimum) / Math.log(maximum / minimum)) * SLIDER_STEPS); }
function quantityFromSlider(position, minimum, maximum) { if (maximum <= minimum) return minimum; return Math.min(maximum, Math.max(minimum, Math.round(minimum * Math.exp((Math.max(0, Math.min(SLIDER_STEPS, Number(position))) / SLIDER_STEPS) * Math.log(maximum / minimum))))); }
function setRangeProgress(range, position) { range.style.setProperty("--progress", `${(Number(position) / SLIDER_STEPS) * 100}%`); }

function renderFilters() {
  $("#categoryFilters").innerHTML = Object.entries(state.categories).map(([key, label]) => `<button class="filter-button ${key === state.filter ? "active" : ""}" data-filter="${key}" type="button">${label}</button>`).join("");
  $$("[data-filter]").forEach(button => button.addEventListener("click", () => { state.filter = button.dataset.filter; renderFilters(); renderServices(); }));
}

function renderServices() {
  const visible = state.filter === "all" ? state.services : state.services.filter(service => service.category === state.filter);
  $("#catalogCount").textContent = `${fa(visible.length)} خدمت`;
  $("#serviceGrid").innerHTML = visible.map((service, index) => {
    const isSelected = Boolean(selected(service.id));
    const quantity = quantityFor(service.id);
    const minimum = service.minQuantity || 1;
    const maximum = service.maxQuantity || DEFAULT_MAX_QUANTITY;
    const hasPublicPrice = service.priceVisible && Number(service.price) > 0;
    const publicPrice = hasPublicPrice ? `<div class="service-public-price"><span>قیمت هر مورد</span><strong>${money(service.price)}</strong></div>` : "";
    const englishTitle = service.titleEn ? `<div class="service-english-title" dir="ltr">${escapeHtml(service.titleEn)}</div>` : "";
    const detail = service.detail ? `<p class="service-detail">${escapeHtml(service.detail)}</p>` : "";
    const quantityPolicy = service.minQuantity || service.maxQuantity ? `<div class="service-quantity-policy">تعداد قابل انتخاب: ${fa(minimum)} تا ${fa(maximum)}</div>` : "";
    const selectedControls = `<div class="selected-actions"><div class="quantity-control"><div class="quantity-head"><span>تعداد خروجی</span><div class="quantity-number-wrap"><input class="quantity-number" data-number="${service.id}" type="number" min="${minimum}" max="${maximum}" step="1" value="${quantity}" aria-label="تعداد دقیق ${escapeHtml(service.title)}" /><span>مورد</span></div></div><div class="quantity-adjuster"><button class="quantity-step" data-card-step="${service.id}" data-delta="-1" type="button" aria-label="کم کردن تعداد">−</button><input class="quantity-range" data-range="${service.id}" data-minimum="${minimum}" data-maximum="${maximum}" type="range" min="0" max="${SLIDER_STEPS}" step="1" value="${sliderPosition(quantity, minimum, maximum)}" aria-label="نوار انتخاب تعداد ${escapeHtml(service.title)}" aria-valuetext="${quantity} مورد" /><button class="quantity-step" data-card-step="${service.id}" data-delta="1" type="button" aria-label="زیاد کردن تعداد">+</button></div></div><button class="card-remove-button" data-remove-card="${service.id}" type="button">حذف</button></div>`;
    const addControl = `<div class="service-bottom"><span class="price-note">${hasPublicPrice ? "قیمت عمومی فعال" : "قیمت پس از بررسی نیاز"}</span><button class="add-button" data-add="${service.id}" type="button">افزودن به سبد</button></div>`;
    return `<article class="service-card ${isSelected ? "selected" : ""}"><div class="service-top"><div class="service-icon">${serviceIcon(index)}</div><span class="service-index">${fa(state.services.indexOf(service) + 1).padStart(2, "۰")}</span></div><div class="service-category">${escapeHtml(state.categories[service.category])}</div><h3>${escapeHtml(service.title)}</h3>${englishTitle}<p>${escapeHtml(service.short)}</p>${detail}<div class="deliverables">${service.deliverables.map(item => `<span>${escapeHtml(item)}</span>`).join("")}</div>${quantityPolicy}${publicPrice}${isSelected ? selectedControls : addControl}</article>`;
  }).join("");
  $$('[data-add]').forEach(button => button.addEventListener("click", () => toggleCart(button.dataset.add)));
  $$('[data-remove-card]').forEach(button => button.addEventListener("click", () => toggleCart(button.dataset.removeCard)));
  $$('[data-card-step]').forEach(button => button.addEventListener("click", () => updateCardQuantity(button.dataset.cardStep, Number(button.dataset.delta))));
  $$('[data-range]').forEach(range => {
    const update = () => {
      updateCardQuantity(range.dataset.range, quantityFromSlider(range.value, Number(range.dataset.minimum), Number(range.dataset.maximum)), true);
    };
    setRangeProgress(range, Number(range.value)); range.addEventListener("input", update); range.addEventListener("change", update);
  });
  $$('[data-number]').forEach(input => {
    const update = () => { if (input.value !== "") updateCardQuantity(input.dataset.number, Number(input.value), true); };
    input.addEventListener("input", update); input.addEventListener("change", update);
  });
}

function toggleCart(serviceId) {
  const existing = selected(serviceId);
  if (existing) state.cart = state.cart.filter(item => item.serviceId !== serviceId);
  else state.cart.push({ serviceId, qty: quantityLimits(serviceId).minimum });
  saveCart(); renderServices(); renderCart();
  if (!existing) toast("خدمت به سبد درخواست اضافه شد.");
}

function renderCart() {
  $("#cartCount").textContent = fa(cartCount());
  if (!state.cart.length) {
    $("#cartContent").innerHTML = `<div class="empty-state"><div><strong>سبد شما هنوز خالی است</strong><span>از فهرست خدمات، اقلام مورد نیازتان را انتخاب کنید.</span></div></div>`;
    $("#drawerFoot").innerHTML = "";
    return;
  }
  $("#cartContent").innerHTML = state.cart.map(item => { const service = serviceById(item.serviceId); const hasPublicPrice = service.priceVisible && Number(service.price) > 0; return `<div class="cart-item"><div><h3>${escapeHtml(service.title)}</h3><small>${escapeHtml(state.categories[service.category])} · ${hasPublicPrice ? `${money(service.price)} برای هر مورد` : "قیمت‌گذاری اختصاصی"}</small>${hasPublicPrice ? `<b class="cart-line-price">جمع این خدمت: ${money(service.price * item.qty)}</b>` : ""}<button class="remove-button" data-remove="${service.id}" type="button">حذف از سبد</button></div><div class="cart-item-actions"><button class="qty-button" data-qty="${service.id}" data-delta="-1" type="button">−</button><span class="qty-value">${fa(item.qty)}</span><button class="qty-button" data-qty="${service.id}" data-delta="1" type="button">+</button></div></div>`; }).join("");
  const pricedItems = state.cart.filter(item => { const service = serviceById(item.serviceId); return service.priceVisible && Number(service.price) > 0; });
  const publicTotal = pricedItems.reduce((sum, item) => sum + Number(serviceById(item.serviceId).price) * item.qty, 0);
  const priceSummary = pricedItems.length ? `<strong>${money(publicTotal)}</strong>` : `<strong>قیمت پس از بررسی</strong>`;
  const priceCaption = pricedItems.length ? `<div class="drawer-price-caption">${pricedItems.length === state.cart.length ? "جمع کل سبد" : "جمع خدمات دارای قیمت عمومی"}</div>` : "";
  $("#drawerFoot").innerHTML = `<div class="drawer-summary"><span>${fa(state.cart.length)} نوع خدمت · ${fa(cartCount())} خروجی</span>${priceSummary}</div>${priceCaption}<button class="primary-button" id="requestButton" type="button">ثبت درخواست قیمت <span>←</span></button><div class="drawer-hint">قیمت هر مورد بر اساس دامنه و تعداد خروجی‌ها توسط تیم ما تعیین می‌شود.</div>`;
  $$('[data-remove]').forEach(button => button.addEventListener("click", () => { state.cart = state.cart.filter(item => item.serviceId !== button.dataset.remove); saveCart(); renderServices(); renderCart(); }));
  $$('[data-qty]').forEach(button => button.addEventListener("click", () => changeQty(button.dataset.qty, Number(button.dataset.delta))));
  $("#requestButton").addEventListener("click", openRequestModal);
}

function changeQty(serviceId, delta) {
  const item = selected(serviceId); if (!item) return;
  item.qty = clampQuantity(item.qty + delta, serviceId); saveCart(); renderCart(); syncCardQuantity(serviceId);
}

function updateCardQuantity(serviceId, valueOrDelta, isAbsolute = false) {
  const item = selected(serviceId); if (!item) return;
  const quantity = clampQuantity(isAbsolute ? valueOrDelta : item.qty + valueOrDelta, serviceId);
  item.qty = quantity; saveCart(); syncCardQuantity(serviceId); renderCart();
}

function syncCardQuantity(serviceId) {
  const item = selected(serviceId); const quantity = item?.qty || quantityLimits(serviceId).minimum; const range = $(`[data-range="${serviceId}"]`); const number = $(`[data-number="${serviceId}"]`);
  if (range) { const { minimum, maximum } = quantityLimits(serviceId); const position = sliderPosition(quantity, minimum, maximum); range.value = position; range.setAttribute("aria-valuetext", `${quantity} مورد`); setRangeProgress(range, position); }
  if (number) number.value = quantity;
}

function openCart() { $("#cartDrawer").classList.remove("hidden"); $("#drawerBackdrop").classList.remove("hidden"); document.body.classList.add("locked"); }
function closeCart() { $("#cartDrawer").classList.add("hidden"); $("#drawerBackdrop").classList.add("hidden"); document.body.classList.remove("locked"); }

function renderRequestPreview() { $("#requestPreview").innerHTML = `<div class="request-preview-head"><span>خلاصه سبد شما</span><span>${fa(cartCount())} خروجی</span></div><ul>${state.cart.map(item => `<li>${escapeHtml(serviceById(item.serviceId).title)} <small>× ${fa(item.qty)}</small></li>`).join("")}</ul><div class="request-preview-note">قیمت نهایی بعد از بررسی و گفت‌وگوی کوتاه با شما تعیین می‌شود.</div>`; }
function openRequestModal() { closeCart(); renderRequestPreview(); $("#requestForm").reset(); $("#requestError").textContent = ""; $("#requestFormView").classList.remove("hidden"); $("#requestSuccess").classList.add("hidden"); $("#requestModal").classList.remove("hidden"); $("#requestBackdrop").classList.remove("hidden"); document.body.classList.add("locked"); }
function closeRequestModal() { $("#requestModal").classList.add("hidden"); $("#requestBackdrop").classList.add("hidden"); document.body.classList.remove("locked"); }

async function submitRequest(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget); const name = String(data.get("name") || "").trim(); const email = String(data.get("email") || "").trim();
  $$(".field", event.currentTarget).forEach(field => field.classList.remove("invalid"));
  if (!name) { $("#customerName").parentElement.classList.add("invalid"); $("#requestError").textContent = "لطفاً نام و نام خانوادگی را وارد کنید."; return; }
  if (!/^\S+@\S+\.\S+$/.test(email)) { $("#customerEmail").parentElement.classList.add("invalid"); $("#requestError").textContent = "لطفاً یک ایمیل معتبر وارد کنید."; return; }
  const button = $("#requestForm button[type=submit]"); button.disabled = true; button.textContent = "در حال ارسال…";
  try {
    const response = await api.createRequest({ name, email, company: String(data.get("company") || ""), phone: String(data.get("phone") || ""), note: String(data.get("note") || ""), items: state.cart });
    $("#successReference").textContent = response.request.id; $("#requestFormView").classList.add("hidden"); $("#requestSuccess").classList.remove("hidden"); state.cart = []; saveCart(); renderServices(); renderCart();
  } catch (error) { $("#requestError").textContent = error.message; } finally { button.disabled = false; button.innerHTML = "ارسال درخواست <span>←</span>"; }
}

async function boot() {
  try { const data = await api.getServices(); state.services = data.services; state.categories = data.categories; renderFilters(); renderServices(); renderCart(); }
  catch (error) { $("#serviceGrid").innerHTML = `<div class="loading-card">${escapeHtml(error.message)}</div>`; toast(error.message, "error"); }
}

$("#cartToggle").addEventListener("click", openCart); $("#heroCartButton").addEventListener("click", openCart); $("#cartClose").addEventListener("click", closeCart); $("#drawerBackdrop").addEventListener("click", closeCart);
$("#requestClose").addEventListener("click", closeRequestModal); $("#requestCancel").addEventListener("click", closeRequestModal); $("#requestBackdrop").addEventListener("click", closeRequestModal); $("#successDone").addEventListener("click", closeRequestModal); $("#requestForm").addEventListener("submit", submitRequest);
document.addEventListener("keydown", event => { if (event.key === "Escape") { closeCart(); closeRequestModal(); } });
boot();
