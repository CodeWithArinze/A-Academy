import { NextRequest, NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/security";

export async function POST(request: NextRequest) {
  clearAdminSession(request.cookies.get("arizon_admin")?.value);
  const response = NextResponse.json({ ok: true });
  response.cookies.set("arizon_admin", "", { path: "/", maxAge: 0 });
  return response;
}
