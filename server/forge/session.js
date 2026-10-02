import { createHash, randomBytes } from "node:crypto";

export const SESSION_COOKIE = "idea_forge_session";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function newSessionToken() {
  return randomBytes(32).toString("hex");
}

export function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export function sessionExpiry(now = Date.now()) {
  return new Date(now + THIRTY_DAYS_MS).toISOString();
}

export function readCookie(header, name = SESSION_COOKIE) {
  if (!header) return null;
  const parts = header.split(";").map((part) => part.trim());
  const match = parts.find((part) => part.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.slice(name.length + 1));
}

export function sessionCookie(token, { secure = false, maxAge = 60 * 60 * 24 * 30 } = {}) {
  const flags = ["HttpOnly", "Path=/", "SameSite=Lax", `Max-Age=${maxAge}`];
  if (secure) flags.push("Secure");
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; ${flags.join("; ")}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;
}
