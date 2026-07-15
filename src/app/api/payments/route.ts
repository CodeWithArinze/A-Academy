import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { createPayment } from "@/lib/db";
import { notifyAdminPayment, sendPaymentReceived } from "@/lib/email";
import { rateLimit } from "@/lib/security";
import { paymentSchema } from "@/lib/validation";

const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp", "application/pdf"]);
const maxUploadBytes = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, "payments", 5, 60_000);
  if (limited) return limited;

  try {
    const formData = await request.formData();
    const parsed = paymentSchema.safeParse({
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      amountPaid: formData.get("amountPaid"),
      dateOfPayment: formData.get("dateOfPayment"),
      paymentReference: formData.get("paymentReference") || null
    });

    if (!parsed.success) {
      return NextResponse.json({ message: "Please complete the payment form correctly." }, { status: 400 });
    }

    const receipt = formData.get("receipt");
    if (!(receipt instanceof File)) {
      return NextResponse.json({ message: "Payment receipt or screenshot is required." }, { status: 400 });
    }
    if (!allowedTypes.has(receipt.type)) {
      return NextResponse.json({ message: "Upload a PNG, JPG, WEBP, or PDF receipt." }, { status: 400 });
    }
    if (receipt.size > maxUploadBytes) {
      return NextResponse.json({ message: "Receipt must be 5MB or smaller." }, { status: 400 });
    }

    const ext = receipt.name.split(".").pop()?.toLowerCase() || "bin";
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "receipts");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, fileName), Buffer.from(await receipt.arrayBuffer()));

    const payment = createPayment({
      ...parsed.data,
      paymentReference: parsed.data.paymentReference || null,
      receiptPath: `/uploads/receipts/${fileName}`
    });
    await sendPaymentReceived(payment);
    await notifyAdminPayment(payment);

    return NextResponse.json({ payment }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to submit payment evidence right now." }, { status: 500 });
  }
}
