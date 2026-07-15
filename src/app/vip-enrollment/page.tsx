import { CheckCircle2, HelpCircle, Layers3, Star, WalletCards } from "lucide-react";
import { CopyAccountButton } from "@/components/CopyAccountButton";
import { PaymentConfirmationForm } from "@/components/PaymentConfirmationForm";
import { SiteShell } from "@/components/SiteShell";

const overview = [
  "A practical, cohort-based web development program built for ambitious beginners and career switchers.",
  "Learn how to build responsive websites, connect APIs, and ship portfolio-ready projects with confidence.",
  "The VIP stream combines live teaching, guided support, and a tight student community for faster momentum."
];
const curriculum = ["HTML, CSS, and responsive layouts", "JavaScript fundamentals", "React and Next.js", "APIs, deployment, and portfolio projects"];
const benefits = ["Live mentorship", "VIP Telegram community", "Hands-on assignments", "Portfolio-ready projects", "Class reminders and resources"];
const faqs = [
  ["Do I need prior coding experience?", "No. The cohort starts from fundamentals and grows into practical projects."],
  ["How is payment verified?", "Submit your Opay receipt after payment. Admin will review and email your enrollment confirmation."],
  ["What device do I need?", "A laptop is recommended for the best learning experience."]
];
const testimonials = [
  ["Chidinma", "The lessons were practical and helped me finally understand how websites are built."],
  ["Favour", "The VIP group made it easy to ask questions and stay consistent."],
  ["Daniel", "I finished with projects I could show people."]
];

export default function VipEnrollmentPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.98fr_1.02fr]">
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6 sm:p-8">
              <span className="badge border-violetGlow/30 bg-violetGlow/10 text-violet-200">Approved Applicants</span>
              <h1 className="mt-5 text-3xl font-black tracking-normal text-white sm:text-5xl">Complete Your VIP Enrollment</h1>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                Join the Arizon Academy Web Development VIP Cohort and move from beginner-friendly foundations to real portfolio projects.
              </p>
              <div className="mt-6 rounded-2xl border border-cyanGlow/30 bg-cyanGlow/10 p-5">
                <p className="text-sm font-bold uppercase text-cyanGlow">Registration Fee</p>
                <p className="mt-1 text-4xl font-black text-white">NGN 50,000</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Limited-time discount: from <span className="line-through">NGN 150,000</span> to <span className="font-bold text-white">NGN 50,000</span>.
                  After 25 July, the fee returns to its normal price of <span className="font-bold text-white">NGN 150,000</span>.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InfoBlock icon={<CheckCircle2 />} title="Program Overview" items={overview} />
              <InfoBlock icon={<Layers3 />} title="Curriculum" items={curriculum} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InfoBlock icon={<Star />} title="Benefits" items={benefits} />
              <InfoBlock icon={<Layers3 />} title="Student Testimonials" items={testimonials.map(([name, quote]) => `${name}: ${quote}`)} />
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="flex items-center gap-2 text-xl font-black text-white">
                <HelpCircle className="text-mintGlow" size={22} />
                Frequently Asked Questions
              </h2>
              <div className="mt-4 grid gap-3">
                {faqs.map(([question, answer]) => (
                  <div key={question} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <h3 className="font-bold text-white">{question}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{answer}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {testimonials.map(([name, quote]) => (
                <div key={name} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <Star className="text-cyanGlow" size={18} />
                  <p className="mt-3 text-sm leading-6 text-slate-300">{quote}</p>
                  <p className="mt-3 text-sm font-black text-white">{name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-2xl p-6 sm:p-8">
              <h2 className="flex items-center gap-2 text-2xl font-black text-white">
                <WalletCards className="text-cyanGlow" size={24} />
                Make Your Payment
              </h2>
              <dl className="mt-5 grid gap-4">
                <PaymentDetail label="Bank Name" value="Opay" />
                <PaymentDetail label="Account Name" value="Obi Arinze Miracle" />
                <PaymentDetail label="Account Number" value="9135739518" />
              </dl>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <CopyAccountButton />
                <div className="grid h-20 w-20 place-items-center rounded-xl border border-cyanGlow/30 bg-slate-950/70 p-2">
                  <div className="grid grid-cols-5 gap-1">
                    {Array.from({ length: 25 }, (_, index) => (
                      <span key={index} className={index % 3 === 0 ? "h-1.5 w-1.5 rounded-sm bg-cyanGlow" : "h-1.5 w-1.5 rounded-sm bg-slate-600"} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-5 rounded-xl border border-mintGlow/20 bg-mintGlow/10 p-4 text-sm leading-6 text-slate-200">
                Include your full name as the payment reference where possible. After payment, submit the form below with a receipt or screenshot.
              </p>
            </div>
            <PaymentConfirmationForm />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function PaymentDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <dt className="text-xs font-black uppercase text-slate-500">{label}</dt>
      <dd className="mt-1 text-xl font-black text-white">{value}</dd>
    </div>
  );
}

function InfoBlock({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="glass rounded-2xl p-5">
      <h2 className="flex items-center gap-2 text-lg font-black text-white">
        <span className="text-cyanGlow">{icon}</span>
        {title}
      </h2>
      <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-300">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <CheckCircle2 className="mt-1 shrink-0 text-mintGlow" size={16} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
