import { NextRequest, NextResponse } from "next/server";
import { adminCookie, createAdminSession, rateLimit } from "@/lib/security";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, "admin-login", 6, 60_000);
  if (limited) return limited;

  const { password } = await request.json().catch(() => ({ password: "" }));
  const expected = process.env.ADMIN_PASSWORD || "arizon-admin";

  if (password !== expected) {
    return NextResponse.json({ message: "Invalid password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookie(createAdminSession()));
  return response;
}
