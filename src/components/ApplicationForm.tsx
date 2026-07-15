"use client";

import { useState } from "react";
import { Send } from "lucide-react";

const initial = {
  fullName: "",
  email: "",
  phone: "",
  university: "",
  courseOfStudy: "",
  programmingExperience: "",
  device: "",
  whyJoin: ""
};

export function ApplicationForm() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await response.json();

    if (!response.ok) {
      setStatus("error");
      setMessage(data.message || "We could not submit your application.");
      return;
    }

    setStatus("success");
    setForm(initial);
    setMessage("Application received. Check your email for confirmation.");
  }

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <form onSubmit={submit} className="glass grid gap-4 rounded-2xl p-5 sm:p-6">
      <div>
        <h2 className="text-xl font-black text-white">Student Application</h2>
        <p className="mt-1 text-sm leading-6 text-slate-400">Apply for the Web Development VIP Cohort.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-slate-300">
          Full Name
          <input className="field" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} required />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-300">
          Email Address
          <input className="field" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-300">
          Phone Number
          <input className="field" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-300">
          University
          <input className="field" value={form.university} onChange={(e) => update("university", e.target.value)} required />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-300">
          Course of Study
          <input className="field" value={form.courseOfStudy} onChange={(e) => update("courseOfStudy", e.target.value)} required />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-300">
          Device
          <input className="field" placeholder="Laptop, desktop, tablet..." value={form.device} onChange={(e) => update("device", e.target.value)} required />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-bold text-slate-300">
        Programming Experience
        <textarea className="field min-h-28 resize-y" value={form.programmingExperience} onChange={(e) => update("programmingExperience", e.target.value)} required />
      </label>
      <label className="grid gap-2 text-sm font-bold text-slate-300">
        Why do you want to join?
        <textarea className="field min-h-32 resize-y" value={form.whyJoin} onChange={(e) => update("whyJoin", e.target.value)} required />
      </label>
      {message && (
        <p className={`rounded-xl border px-4 py-3 text-sm font-semibold ${status === "success" ? "border-mintGlow/30 bg-mintGlow/10 text-mintGlow" : "border-coralGlow/30 bg-coralGlow/10 text-red-200"}`}>
          {message}
        </p>
      )}
      <button className="btn btn-primary w-full sm:w-fit" disabled={status === "loading"}>
        <Send size={18} />
        {status === "loading" ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}
