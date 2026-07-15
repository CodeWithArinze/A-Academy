import Link from "next/link";
import { GraduationCap } from "lucide-react";

const links = [
  { href: "/", label: "Apply" },
  { href: "/vip-enrollment", label: "Enrollment" },
  { href: "/student", label: "Student" },
  { href: "/admin", label: "Admin" }
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-night/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-cyanGlow/30 bg-cyanGlow/10 text-cyanGlow">
              <GraduationCap size={22} />
            </span>
            <span>
              <span className="block text-base font-black tracking-normal text-white">Arizon Academy</span>
              <span className="block text-xs font-semibold text-slate-400">Code. Learn. Grow.</span>
            </span>
          </Link>
          <nav className="flex flex-wrap justify-end gap-2 text-sm font-bold text-slate-300">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 hover:bg-white/10 hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      {children}
    </main>
  );
}
