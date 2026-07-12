export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
export const fa = value => new Intl.NumberFormat("fa-IR").format(Number(value) || 0);
export const money = value => `${fa(value)} تومان`;
export const dateText = value => new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(new Date(value));
export const escapeHtml = value => String(value ?? "").replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));

let toastTimer;
export function toast(message, type = "success") {
  const node = $("#toast");
  if (!node) return;
  node.textContent = message;
  node.classList.toggle("error", type === "error");
  node.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove("show"), 3400);
}

export const statusLabel = status => status === "quoted" ? "قیمت‌گذاری‌شده" : "در انتظار بررسی";
export const serviceIcon = index => {
  const icons = [
    '<path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="7"/>',
    '<path d="m12 3 2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z"/>',
    '<path d="M4 5h16v11H8l-4 4V5Z"/><path d="M8 9h8M8 12h5"/>',
    '<path d="m12 3 8 5-8 5-8-5 8-5Z"/><path d="m4 13 8 5 8-5"/>',
    '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/>'
  ];
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icons[index % icons.length]}</svg>`;
};
