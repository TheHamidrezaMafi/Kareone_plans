import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import helmet from "helmet";
import { services, categories, serviceMap } from "./services.js";
import { authenticate, requireAdmin } from "./auth.js";
import { createRequest, getRequest, getQuoteByToken, getServicePricing, getStats, listRequests, saveQuote, updateServicePricing, validateItems } from "./db.js";
import { isEmailConfigured, sendQuoteEmail } from "./mailer.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");
const app = express();
const port = Number(process.env.PORT || 3000);
const publicUrl = (process.env.PUBLIC_URL || `http://localhost:${port}`).replace(/\/$/, "");

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "kareone" }));
app.get("/api/services", (_req, res) => {
  const pricing = new Map(getServicePricing().map(item => [item.serviceId, item]));
  const publicServices = services.map(service => {
    const setting = pricing.get(service.id);
    return { ...service, priceVisible: Boolean(setting?.isVisible), price: setting?.isVisible ? setting.price : null };
  });
  res.json({ services: publicServices, categories });
});

app.post("/api/requests", (req, res) => {
  const { name, company, email, phone, note, items } = req.body || {};
  if (!String(name || "").trim()) return res.status(400).json({ error: "نام و نام خانوادگی الزامی است." });
  if (!/^\S+@\S+\.\S+$/.test(String(email || "").trim())) return res.status(400).json({ error: "ایمیل معتبر وارد کنید." });
  if (!validateItems(items)) return res.status(400).json({ error: "حداقل یک خدمت معتبر انتخاب کنید." });
  const request = createRequest({ name, company, email, phone, note, items });
  res.status(201).json({ request: { id: request.id, status: request.status, createdAt: request.createdAt } });
});

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  const token = authenticate(String(username || ""), String(password || ""));
  if (!token) return res.status(401).json({ error: "نام کاربری یا رمز عبور صحیح نیست." });
  res.json({ token });
});

app.get("/api/admin/stats", requireAdmin, (_req, res) => res.json(getStats()));
app.get("/api/admin/service-pricing", requireAdmin, (_req, res) => res.json({ pricing: getServicePricing() }));
app.put("/api/admin/service-pricing", requireAdmin, (req, res) => {
  const items = req.body?.items;
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ error: "تنظیمات قیمت معتبر نیست." });
  try { res.json({ pricing: updateServicePricing(items) }); }
  catch (error) { res.status(400).json({ error: error.message }); }
});
app.get("/api/admin/requests", requireAdmin, (_req, res) => res.json({ requests: listRequests() }));
app.get("/api/admin/requests/:id", requireAdmin, (req, res) => {
  const request = getRequest(req.params.id);
  if (!request) return res.status(404).json({ error: "درخواست پیدا نشد." });
  res.json({ request });
});

app.post("/api/admin/requests/:id/quote", requireAdmin, (req, res) => {
  const request = getRequest(req.params.id);
  if (!request) return res.status(404).json({ error: "درخواست پیدا نشد." });
  const prices = req.body?.prices || {};
  if (!Object.keys(prices).some(id => serviceMap.has(id) && Number(prices[id]) > 0)) return res.status(400).json({ error: "حداقل یک قیمت معتبر وارد کنید." });
  try {
    const updated = saveQuote(req.params.id, req.body);
    res.json({ request: updated, quoteUrl: `${publicUrl}/quote.html?token=${updated.quoteToken}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/admin/requests/:id/send-quote", requireAdmin, async (req, res) => {
  const request = getRequest(req.params.id);
  if (!request?.quote) return res.status(404).json({ error: "ابتدا پیشنهاد قیمت را ذخیره کنید." });
  const quoteUrl = `${publicUrl}/quote.html?token=${request.quoteToken}`;
  try {
    const result = await sendQuoteEmail({ request, quoteUrl });
    if (!result.sent) return res.status(503).json({ error: "تنظیمات ایمیل سرور کامل نیست.", emailConfigured: false, quoteUrl });
    res.json({ sent: true, emailConfigured: true, quoteUrl });
  } catch (error) {
    res.status(502).json({ error: "ارسال ایمیل ناموفق بود.", details: error.message });
  }
});

app.get("/api/quotes/:token", (req, res) => {
  const quote = getQuoteByToken(req.params.token);
  if (!quote) return res.status(404).json({ error: "این پیشنهاد پیدا نشد یا منقضی شده است." });
  res.json({ quote });
});

app.get("/admin", (_req, res) => res.sendFile(path.join(publicDir, "admin.html")));
app.get("/admin.html", (_req, res) => res.redirect(301, "/admin"));
app.use(express.static(publicDir));
app.use((_req, res) => res.sendFile(path.join(publicDir, "index.html")));

app.listen(port, () => console.log(`KareOne server running at ${publicUrl}`));
