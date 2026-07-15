import { NextRequest, NextResponse } from "next/server";
import { getApplicationByEmail } from "@/lib/db";
import { rateLimit } from "@/lib/security";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, "student-lookup", 20, 60_000);
  if (limited) return limited;

  const email = request.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ message: "Email address is required." }, { status: 400 });

  const application = getApplicationByEmail(email);
  if (!application) return NextResponse.json({ message: "No application found for that email address." }, { status: 404 });

  return NextResponse.json({ application });
}
