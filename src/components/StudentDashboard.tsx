"use client";

import { useState } from "react";
import { Award, BookOpen, ExternalLink, Search, WalletCards } from "lucide-react";
import { Application } from "@/types/admissions";

export function StudentDashboard() {
  const [email, setEmail] = useState("");
  const [student, setStudent] = useState<Application | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function lookup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setStudent(null);
    setBusy(true);

    try {
      const response = await fetch(`/api/student?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Student record not found.");
        return;
      }
      setStudent(data.application);
    } catch {
      setMessage("Unable to search right now. Please try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={lookup} className="glass h-fit rounded-2xl p-6">
        <span className="badge border-mintGlow/30 bg-mintGlow/10 text-mintGlow">Student Portal</span>
        <h1 className="mt-4 text-3xl font-black text-white">Check Enrollment Status</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">Enter the email address used for your application.</p>
        <label className="mt-5 grid gap-2 text-sm font-bold text-slate-300">
          Email Address
          <input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        {message && <p className="mt-4 rounded-xl border border-coralGlow/30 bg-coralGlow/10 p-3 text-sm font-semibold text-red-200">{message}</p>}
        <button className="btn btn-primary mt-5 w-full" disabled={busy}>
          <Search size={18} />
          {busy ? "Searching..." : "Search"}
        </button>
      </form>

      <section className="glass rounded-2xl p-6">
        {!student ? (
          <div className="grid min-h-80 place-items-center text-center">
            <div>
              <BookOpen className="mx-auto text-cyanGlow" size={36} />
              <h2 className="mt-4 text-xl font-black text-white">Your dashboard appears here</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">Applicants and enrolled students can view review status, payment progress, class details, resources, assignments, and certificate eligibility.</p>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-black text-white">Welcome, {student.fullName}</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Panel title="Profile" lines={[student.email, student.phone, student.university, student.courseOfStudy]} />
              <Panel title="Enrollment Status" lines={[`Application: ${student.status}`, `Payment: ${student.paymentStatus}`, `Student: ${student.studentStatus}`]} />
              <Panel title="Class Schedule" lines={["Orientation: Saturday, 10:00 AM", "Live classes: Tuesday and Thursday", "Project clinic: Saturday"]} />
              <Panel title="Course Resources" lines={student.studentStatus === "Enrolled" ? ["Starter toolkit", "HTML/CSS notes", "JavaScript practice set", "React project guide"] : ["Resources unlock after payment verification."]} />
              <Panel title="Assignments" lines={student.studentStatus === "Enrolled" ? ["Personal profile page", "Responsive landing page", "React dashboard"] : ["Assignments unlock after enrollment."]} />
              <Panel title="Certificate Eligibility" lines={student.studentStatus === "Enrolled" ? ["Complete required assignments and final project to qualify."] : ["Available after enrollment and course completion."]} />
            </div>
            {student.status === "Approved" && student.paymentStatus !== "Verified" && (
              <a className="btn btn-secondary mt-5" href="/vip-enrollment">
                <WalletCards size={18} />
                Complete Payment
              </a>
            )}
            {student.studentStatus === "Enrolled" && (
              <div className="mt-5 flex flex-wrap gap-3">
                <a className="btn btn-primary" href={process.env.NEXT_PUBLIC_TELEGRAM_VIP_LINK || "https://t.me/your-vip-community"} target="_blank">
                  <ExternalLink size={18} />
                  Open Telegram VIP Link
                </a>
                <span className="btn btn-secondary">
                  <Award size={18} />
                  Certificate Track Active
                </span>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function Panel({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <h3 className="font-black text-white">{title}</h3>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-300">
        {lines.map((line) => <li key={line}>{line}</li>)}
      </ul>
    </div>
  );
}
