import { z } from "zod";

export const applicationSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email().max(180),
  phone: z.string().min(7).max(30),
  university: z.string().min(2).max(160),
  courseOfStudy: z.string().min(2).max(160),
  programmingExperience: z.string().min(2).max(600),
  device: z.string().min(2).max(120),
  whyJoin: z.string().min(15).max(1400)
});

export const paymentSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email().max(180),
  phone: z.string().min(7).max(30),
  amountPaid: z.coerce.number().min(1000).max(1000000),
  dateOfPayment: z.string().min(6).max(40),
  paymentReference: z.string().max(160).optional().nullable()
});

export function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || "there";
}
