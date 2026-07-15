import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import { ApplicationForm } from "@/components/ApplicationForm";
import { SiteShell } from "@/components/SiteShell";

export default function Home() {
  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-16">
        <div className="flex flex-col justify-center">
          <span className="badge w-fit border-cyanGlow/30 bg-cyanGlow/10 text-cyanGlow">Web Development VIP Cohort</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-normal text-white sm:text-6xl">
            Arizon Academy
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Apply, get reviewed, complete your manual Opay payment, and receive your VIP community access after verification.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/vip-enrollment" className="btn btn-secondary">
              <WalletCards size={18} />
              Payment Details
            </Link>
            <Link href="/student" className="btn btn-secondary">
              <ArrowRight size={18} />
              Student Dashboard
            </Link>
          </div>
          <div className="mt-8 rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 p-4">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-cyanGlow">Limited-time VIP offer</p>
            <p className="mt-2 text-lg font-black text-white">NGN 50,000</p>
            <p className="mt-1 text-sm leading-6 text-slate-300">
              Save from <span className="line-through">NGN 150,000</span> to <span className="font-bold text-white">NGN 50,000</span>.
              After 25 July, the fee returns to <span className="font-bold text-white">NGN 150,000</span>.
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ["Apply", "Submit your details for review."],
              ["Pay", "Use Opay after approval."],
              ["Enroll", "Get verified and join VIP."]
            ].map(([title, copy]) => (
              <div key={title} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <Sparkles className="mb-3 text-mintGlow" size={18} />
                <h3 className="font-black text-white">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">{copy}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-400">
            <ShieldCheck size={18} className="text-cyanGlow" />
            Secure review, receipt upload, and admin verification workflow.
          </p>
        </div>
        <ApplicationForm />
      </section>
    </SiteShell>
  );
}
