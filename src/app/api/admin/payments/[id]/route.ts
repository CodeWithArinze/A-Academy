import { NextRequest, NextResponse } from "next/server";
import { getApplication, getPayment, updateApplicationPayment, updatePaymentStatus } from "@/lib/db";
import { sendMoreInfoRequested, sendPaymentVerified } from "@/lib/email";
import { requireAdmin } from "@/lib/security";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  const { action } = await request.json().catch(() => ({ action: "" }));
  const payment = getPayment(id);
  if (!payment) return NextResponse.json({ message: "Payment not found." }, { status: 404 });

  if (action === "approve") {
    const updatedPayment = updatePaymentStatus(id, "Verified");
    if (payment.applicationId) {
      const app = updateApplicationPayment(payment.applicationId, "Verified", true);
      if (app) await sendPaymentVerified(app);
    }
    return NextResponse.json({ payment: updatedPayment, message: "Payment verified. Student enrolled and welcome email sent." });
  }

  if (action === "reject") {
    const updatedPayment = updatePaymentStatus(id, "Rejected");
    if (payment.applicationId) updateApplicationPayment(payment.applicationId, "Rejected");
    return NextResponse.json({ payment: updatedPayment, message: "Payment rejected." });
  }

  if (action === "request-info") {
    const updatedPayment = updatePaymentStatus(id, "More Info Requested");
    if (payment.applicationId) updateApplicationPayment(payment.applicationId, "More Info Requested");
    await sendMoreInfoRequested(payment);
    return NextResponse.json({ payment: updatedPayment, message: "Additional information request sent." });
  }

  if (action === "view-application" && payment.applicationId) {
    return NextResponse.json({ application: getApplication(payment.applicationId) });
  }

  return NextResponse.json({ message: "Unknown action." }, { status: 400 });
}
