"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";

export function PaymentConfirmationForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/payments", {
      method: "POST",
      body: new FormData(event.currentTarget)
    });
    const data = await response.json();

    if (!response.ok) {
      setStatus("error");
      setMessage(data.message || "We could not submit your payment confirmation.");
      return;
    }

    event.currentTarget.reset();
    setStatus("success");
    setMessage("Payment evidence submitted. The admin team will verify it shortly.");
  }

  return (
    <form onSubmit={submit} className="glass grid gap-4 rounded-2xl p-5 sm:p-6">
      <div>
        <h2 className="text-xl font-black text-white">Payment Confirmation</h2>
        <p className="mt-1 text-sm leading-6 text-slate-400">Upload your payment receipt or screenshot after paying via Opay.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-slate-300">
          Full Name
          <input name="fullName" className="field" required />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-300">
          Email Address
          <input name="email" type="email" className="field" required />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-300">
          Phone Number
          <input name="phone" className="field" required />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-300">
          Amount Paid
          <input name="amountPaid" type="number" min="1000" className="field" defaultValue="50000" required />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-300">
          Date of Payment
          <input name="dateOfPayment" type="date" className="field" required />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-300">
          Payment Reference
          <input name="paymentReference" className="field" placeholder="Optional" />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-bold text-slate-300">
        Upload Payment Receipt or Screenshot
        <input name="receipt" type="file" className="field" accept="image/png,image/jpeg,image/webp,application/pdf" required />
      </label>
      {message && (
        <p className={`rounded-xl border px-4 py-3 text-sm font-semibold ${status === "success" ? "border-mintGlow/30 bg-mintGlow/10 text-mintGlow" : "border-coralGlow/30 bg-coralGlow/10 text-red-200"}`}>
          {message}
        </p>
      )}
      <button className="btn btn-primary w-full sm:w-fit" disabled={status === "loading"}>
        <UploadCloud size={18} />
        {status === "loading" ? "Submitting..." : "Submit Payment Evidence"}
      </button>
    </form>
  );
}
