import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

type Hit = { count: number; resetAt: number };
const hits = new Map<string, Hit>();

export function rateLimit(request: NextRequest, key: string, limit = 8, windowMs = 60_000) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";
  const mapKey = `${key}:${ip}`;
  const now = Date.now();
  const current = hits.get(mapKey);

  if (!current || current.resetAt < now) {
    hits.set(mapKey, { count: 1, resetAt: now + windowMs });
    return null;
  }

  current.count += 1;
  if (current.count > limit) {
    return NextResponse.json(
      { message: "Too many attempts. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  return null;
}

export function createAdminSession() {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 8;
  const signature = sign(String(expiresAt));
  return `${expiresAt}.${signature}`;
}

export function clearAdminSession(token?: string) {
  void token;
}

export function isAdmin(request: NextRequest) {
  const token = request.cookies.get("arizon_admin")?.value;
  if (!token) return false;
  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature || Number(expiresAt) < Date.now()) return false;
  return safeEqual(signature, sign(expiresAt));
}

export function requireAdmin(request: NextRequest) {
  if (isAdmin(request)) return null;
  return NextResponse.json({ message: "Admin authentication required." }, { status: 401 });
}

export function adminCookie(token: string) {
  return {
    name: "arizon_admin",
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  };
}

function sign(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "arizon-dev-secret";
  return createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
