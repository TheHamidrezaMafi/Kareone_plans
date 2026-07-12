import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { services, serviceMap } from "./services.js";

const databaseFile = path.resolve(process.cwd(), process.env.DATABASE_FILE || "./data/kareone.sqlite");
fs.mkdirSync(path.dirname(databaseFile), { recursive: true });

export const db = new Database(databaseFile);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS requests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    note TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new', 'quoted')),
    quote_token TEXT UNIQUE,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS request_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id TEXT NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    service_id TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK(quantity > 0)
  );
  CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id TEXT NOT NULL UNIQUE REFERENCES requests(id) ON DELETE CASCADE,
    subtotal INTEGER NOT NULL,
    discount INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL,
    valid_days INTEGER NOT NULL,
    valid_until TEXT NOT NULL,
    payment_terms TEXT NOT NULL DEFAULT '',
    note TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS quote_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote_id INTEGER NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    service_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price INTEGER NOT NULL,
    line_total INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS service_pricing (
    service_id TEXT PRIMARY KEY,
    price INTEGER NOT NULL DEFAULT 0 CHECK(price >= 0),
    is_visible INTEGER NOT NULL DEFAULT 0 CHECK(is_visible IN (0, 1)),
    updated_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
  CREATE INDEX IF NOT EXISTS idx_requests_created ON requests(created_at DESC);
`);

const adminColumns = db.prepare("PRAGMA table_info(admins)").all();
if (!adminColumns.some(column => column.name === "username")) db.exec("ALTER TABLE admins ADD COLUMN username TEXT");
db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_admins_username ON admins(username)");

const now = () => new Date().toISOString();
const requestId = () => `KO-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
const quoteToken = () => crypto.randomBytes(24).toString("base64url");

const seedPricing = db.transaction(() => {
  const insert = db.prepare("INSERT OR IGNORE INTO service_pricing (service_id, price, is_visible, updated_at) VALUES (?, ?, 0, ?)");
  const timestamp = now();
  services.forEach(service => insert.run(service.id, Math.max(0, Number(service.defaultPrice) || 0), timestamp));
});
seedPricing();

function hydrateRequest(row) {
  if (!row) return null;
  const items = db.prepare("SELECT service_id AS serviceId, quantity AS qty FROM request_items WHERE request_id = ? ORDER BY id").all(row.id);
  const quote = db.prepare("SELECT * FROM quotes WHERE request_id = ?").get(row.id);
  if (quote) quote.items = db.prepare("SELECT service_id AS serviceId, quantity AS qty, unit_price AS unitPrice, line_total AS lineTotal FROM quote_items WHERE quote_id = ? ORDER BY id").all(quote.id);
  return {
    id: row.id,
    customer: { name: row.name, company: row.company, email: row.email, phone: row.phone },
    note: row.note,
    status: row.status,
    quoteToken: row.quote_token,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items,
    quote: quote ? {
      subtotal: quote.subtotal, discount: quote.discount, total: quote.total, validDays: quote.valid_days,
      validUntil: quote.valid_until, paymentTerms: quote.payment_terms, note: quote.note,
      createdAt: quote.created_at, updatedAt: quote.updated_at, items: quote.items
    } : null
  };
}

export function seedAdmin() {
  const username = (process.env.ADMIN_USERNAME || "admin").trim();
  const password = process.env.ADMIN_PASSWORD || "KareOne@2026!";
  const existing = db.prepare("SELECT id FROM admins ORDER BY id LIMIT 1").get();
  const passwordHash = bcrypt.hashSync(password, 12);
  const seed = db.transaction(() => {
    if (existing) {
      db.prepare("DELETE FROM admins WHERE id <> ?").run(existing.id);
      db.prepare("UPDATE admins SET username = ?, password_hash = ? WHERE id = ?").run(username, passwordHash, existing.id);
    } else {
      db.prepare("INSERT INTO admins (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)").run(username, `${username}@local.kareone`, passwordHash, now());
    }
  });
  seed();
}

export function findAdminByUsername(username) { return db.prepare("SELECT * FROM admins WHERE username = ?").get(username.trim()); }

export function createRequest({ name, company = "", email, phone = "", note = "", items }) {
  const cleanItems = items.map(item => {
    const service = serviceMap.get(item.serviceId);
    const minimum = service?.minQuantity || 1;
    const maximum = service?.maxQuantity || 999;
    return { serviceId: item.serviceId, qty: Math.max(minimum, Math.min(maximum, Math.round(Number(item.qty) || minimum))) };
  });
  const id = requestId(); const timestamp = now();
  const insert = db.transaction(() => {
    db.prepare("INSERT INTO requests (id, name, company, email, phone, note, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'new', ?, ?)").run(id, name.trim(), company.trim(), email.trim().toLowerCase(), phone.trim(), note.trim(), timestamp, timestamp);
    const stmt = db.prepare("INSERT INTO request_items (request_id, service_id, quantity) VALUES (?, ?, ?)");
    cleanItems.forEach(item => stmt.run(id, item.serviceId, item.qty));
  });
  insert();
  return getRequest(id);
}

export function getRequest(id) { return hydrateRequest(db.prepare("SELECT * FROM requests WHERE id = ?").get(id)); }

export function listRequests() { return db.prepare("SELECT * FROM requests ORDER BY created_at DESC").all().map(hydrateRequest); }

export function getStats() {
  const row = db.prepare("SELECT COUNT(*) AS total, SUM(status = 'new') AS pending, SUM(status = 'quoted') AS quoted FROM requests").get();
  return { total: row.total || 0, pending: row.pending || 0, quoted: row.quoted || 0 };
}

export function getServicePricing() {
  return db.prepare("SELECT service_id AS serviceId, price, is_visible AS isVisible, updated_at AS updatedAt FROM service_pricing ORDER BY rowid").all().map(item => ({ ...item, isVisible: Boolean(item.isVisible) }));
}

export function updateServicePricing(items) {
  const update = db.transaction(() => {
    const statement = db.prepare("UPDATE service_pricing SET price = ?, is_visible = ?, updated_at = ? WHERE service_id = ?");
    const timestamp = now();
    items.forEach(item => {
      if (!serviceMap.has(item.serviceId)) throw new Error("خدمت نامعتبر است.");
      const price = Math.max(0, Math.round(Number(item.price) || 0));
      const isVisible = Boolean(item.isVisible);
      if (isVisible && price <= 0) throw new Error("برای نمایش قیمت، مبلغ خدمت باید بیشتر از صفر باشد.");
      statement.run(price, isVisible ? 1 : 0, timestamp, item.serviceId);
    });
  });
  update();
  return getServicePricing();
}

export function saveQuote(requestIdValue, { prices, discount = 0, validDays = 10, paymentTerms = "", note = "" }) {
  const request = getRequest(requestIdValue);
  if (!request) throw new Error("درخواست پیدا نشد.");
  const items = request.items.map(item => {
    const unitPrice = Math.max(0, Math.round(Number(prices[item.serviceId]) || 0));
    return { serviceId: item.serviceId, qty: item.qty, unitPrice, lineTotal: unitPrice * item.qty };
  });
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const safeDiscount = Math.min(subtotal, Math.max(0, Math.round(Number(discount) || 0)));
  const safeValidDays = Math.max(1, Math.min(365, Math.round(Number(validDays) || 10)));
  const timestamp = now();
  const validUntil = new Date(Date.now() + safeValidDays * 86400000).toISOString();
  const token = request.quoteToken || quoteToken();
  const save = db.transaction(() => {
    db.prepare("UPDATE requests SET status = 'quoted', quote_token = ?, updated_at = ? WHERE id = ?").run(token, timestamp, requestIdValue);
    const existing = db.prepare("SELECT id FROM quotes WHERE request_id = ?").get(requestIdValue);
    let quoteId;
    if (existing) {
      quoteId = existing.id;
      db.prepare("UPDATE quotes SET subtotal = ?, discount = ?, total = ?, valid_days = ?, valid_until = ?, payment_terms = ?, note = ?, updated_at = ? WHERE id = ?").run(subtotal, safeDiscount, subtotal - safeDiscount, safeValidDays, validUntil, paymentTerms.trim(), note.trim(), timestamp, quoteId);
      db.prepare("DELETE FROM quote_items WHERE quote_id = ?").run(quoteId);
    } else {
      const result = db.prepare("INSERT INTO quotes (request_id, subtotal, discount, total, valid_days, valid_until, payment_terms, note, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(requestIdValue, subtotal, safeDiscount, subtotal - safeDiscount, safeValidDays, validUntil, paymentTerms.trim(), note.trim(), timestamp, timestamp);
      quoteId = result.lastInsertRowid;
    }
    const stmt = db.prepare("INSERT INTO quote_items (quote_id, service_id, quantity, unit_price, line_total) VALUES (?, ?, ?, ?, ?)");
    items.forEach(item => stmt.run(quoteId, item.serviceId, item.qty, item.unitPrice, item.lineTotal));
  });
  save();
  return getRequest(requestIdValue);
}

export function getQuoteByToken(token) {
  const row = db.prepare("SELECT * FROM requests WHERE quote_token = ? AND status = 'quoted'").get(token);
  if (!row) return null;
  const request = hydrateRequest(row);
  return { requestId: request.id, customer: request.customer, items: request.items, quote: request.quote };
}

export function validateItems(items) {
  return Array.isArray(items) && items.length > 0 && items.every(item => {
    const service = serviceMap.get(item.serviceId);
    if (!service) return false;
    const quantity = Number(item.qty);
    return Number.isInteger(quantity) && quantity >= (service.minQuantity || 1) && quantity <= (service.maxQuantity || 999);
  });
}

seedAdmin();
