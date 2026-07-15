import { AdminDashboard } from "@/components/AdminDashboard";
import { SiteShell } from "@/components/SiteShell";

export default function AdminPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <AdminDashboard />
      </section>
    </SiteShell>
  );
}
