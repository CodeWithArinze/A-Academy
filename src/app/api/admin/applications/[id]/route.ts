import { NextRequest, NextResponse } from "next/server";
import { deleteApplication, getApplication, updateApplicationStatus } from "@/lib/db";
import { sendApplicationApproved, sendApplicationRejected } from "@/lib/email";
import { requireAdmin } from "@/lib/security";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  const { action } = await request.json().catch(() => ({ action: "" }));
  const existing = getApplication(id);
  if (!existing) return NextResponse.json({ message: "Application not found." }, { status: 404 });

  if (action === "approve") {
    const updated = updateApplicationStatus(id, "Approved")!;
    await sendApplicationApproved(updated);
    return NextResponse.json({ application: updated, message: "Application approved and email sent." });
  }

  if (action === "reject") {
    const updated = updateApplicationStatus(id, "Rejected")!;
    await sendApplicationRejected(updated);
    return NextResponse.json({ application: updated, message: "Application rejected and email sent." });
  }

  if (action === "send-email") {
    if (existing.status === "Approved") {
      await sendApplicationApproved(existing);
      return NextResponse.json({ message: "Approval email sent again." });
    }
    if (existing.status === "Rejected") {
      await sendApplicationRejected(existing);
      return NextResponse.json({ message: "Rejection email sent again." });
    }
    return NextResponse.json({ message: "No status email sent. Approve or reject the applicant first." }, { status: 400 });
  }

  if (action === "delete") {
    deleteApplication(id);
    return NextResponse.json({ message: "Application deleted." });
  }

  return NextResponse.json({ message: "Unknown action." }, { status: 400 });
}
