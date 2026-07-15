import { NextRequest, NextResponse } from "next/server";
import { adminPayload } from "@/lib/db";
import { requireAdmin } from "@/lib/security";

export async function GET(request: NextRequest) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  return NextResponse.json(adminPayload());
}
