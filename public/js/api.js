const jsonHeaders = { "Content-Type": "application/json" };

async function request(path, options = {}) {
  const response = await fetch(path, { ...options, headers: { ...jsonHeaders, ...(options.headers || {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.error || "خطایی در ارتباط با سرور رخ داد.");
    error.status = response.status;
    error.body = body;
    throw error;
  }
  return body;
}

export const api = {
  getServices: () => request("/api/services"),
  createRequest: payload => request("/api/requests", { method: "POST", body: JSON.stringify(payload) }),
  login: payload => request("/api/admin/login", { method: "POST", body: JSON.stringify(payload) }),
  getStats: token => request("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } }),
  getServicePricing: token => request("/api/admin/service-pricing", { headers: { Authorization: `Bearer ${token}` } }),
  saveServicePricing: (token, items) => request("/api/admin/service-pricing", { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ items }) }),
  getRequests: token => request("/api/admin/requests", { headers: { Authorization: `Bearer ${token}` } }),
  saveQuote: (token, id, payload) => request(`/api/admin/requests/${encodeURIComponent(id)}/quote`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) }),
  sendQuote: (token, id) => request(`/api/admin/requests/${encodeURIComponent(id)}/send-quote`, { method: "POST", headers: { Authorization: `Bearer ${token}` } }),
  getQuote: token => request(`/api/quotes/${encodeURIComponent(token)}`)
};
