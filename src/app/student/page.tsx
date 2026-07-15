import { SiteShell } from "@/components/SiteShell";
import { StudentDashboard } from "@/components/StudentDashboard";

export default function StudentPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <StudentDashboard />
      </section>
    </SiteShell>
  );
}
