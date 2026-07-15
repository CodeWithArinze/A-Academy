import { NextRequest, NextResponse } from "next/server";
import { createApplication, getApplicationByEmail } from "@/lib/db";
import { sendApplicationReceived } from "@/lib/email";
import { rateLimit } from "@/lib/security";
import { applicationSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, "applications", 5, 60_000);
  if (limited) return limited;

  try {
    const parsed = applicationSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ message: "Please complete all required fields correctly." }, { status: 400 });
    }

    const existing = getApplicationByEmail(parsed.data.email);
    if (existing) {
      return NextResponse.json({ message: "An application already exists for this email address." }, { status: 409 });
    }

    const application = createApplication(parsed.data);
    await sendApplicationReceived(application);
    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to submit application right now." }, { status: 500 });
  }
}
