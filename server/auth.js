import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { findAdminByUsername } from "./db.js";

const secret = process.env.JWT_SECRET || "development-only-kareone-secret";

export function authenticate(username, password) {
  const admin = findAdminByUsername(username);
  if (!admin || !bcrypt.compareSync(password, admin.password_hash)) return null;
  return jwt.sign({ sub: String(admin.id), username: admin.username, role: admin.role }, secret, { expiresIn: "8h" });
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  try {
    if (!token) throw new Error("missing token");
    req.admin = jwt.verify(token, secret);
    next();
  } catch {
    res.status(401).json({ error: "دسترسی مدیر لازم است." });
  }
}
