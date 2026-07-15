"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Eye, LogOut, Mail, RefreshCw, Shield, Trash2, X } from "lucide-react";
import { AdminPayload, Application, Payment } from "@/types/admissions";

type LoginState = "checking" | "signed-out" | "signed-in";

export function AdminDashboard() {
  const [loginState, setLoginState] = useState<LoginState>("checking");
  const [password, setPassword] = useState("");
  const [payload, setPayload] = useState<AdminPayload | null>(null);
  const [selected, setSelected] = useState<Application | Payment | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const response = await fetch("/api/admin");
      if (response.status === 401) {
        setLoginState("signed-out");
        return;
      }
      const data = await response.json();
      setPayload(data);
      setLoginState("signed-in");
    } catch {
      setPayload(null);
      setLoginState("signed-out");
      setMessage("Unable to reach the admin service right now.");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        setMessage("Invalid admin password.");
        return;
      }

      setPassword("");
      await load();
    } catch {
      setMessage("Unable to sign in right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function appAction(id: string, action: string) {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      const data = await response.json();
      if (response.status === 401) {
        setLoginState("signed-out");
        setPayload(null);
        setMessage("Please sign in again.");
        return;
      }
      setMessage(data.message || (response.ok ? "Action completed." : "Action failed."));
      if (response.ok) {
        setSelected(null);
        await load();
      }
    } catch {
      setMessage("Unable to complete that action right now.");
    } finally {
      setBusy(false);
    }
  }

  async function paymentAction(id: string, action: string) {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/payments/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      const data = await response.json();
      if (response.status === 401) {
        setLoginState("signed-out");
        setPayload(null);
        setMessage("Please sign in again.");
        return;
      }
      setMessage(data.message || (response.ok ? "Action completed." : "Action failed."));
      if (response.ok) {
        setSelected(null);
        await load();
      }
    } catch {
      setMessage("Unable to complete that action right now.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
    setPayload(null);
    setSelected(null);
    setLoginState("signed-out");
    setBusy(false);
  }

  const applications = payload?.applications ?? [];
  const payments = payload?.payments ?? [];
  const awaiting = useMemo(() => payments.filter((payment) => payment.status === "Awaiting Verification"), [payments]);

  if (loginState === "checking") {
    return <div className="glass rounded-2xl p-6 text-slate-300">Checking admin session...</div>;
  }

  if (loginState === "signed-out") {
    return (
      <form onSubmit={login} className="glass mx-auto max-w-md rounded-2xl p-6">
        <div className="grid h-12 w-12 place-items-center rounded-xl border border-cyanGlow/30 bg-cyanGlow/10 text-cyanGlow">
          <Shield size={24} />
        </div>
        <h1 className="mt-5 text-2xl font-black text-white">Admin Login</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">Use the password from your environment settings.</p>
        <label className="mt-5 grid gap-2 text-sm font-bold text-slate-300">
          Password
          <input className="field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        {message && <p className="mt-4 rounded-xl border border-coralGlow/30 bg-coralGlow/10 p-3 text-sm font-semibold text-red-200">{message}</p>}
        <button className="btn btn-primary mt-5 w-full" disabled={busy}>
          {busy ? "Signing in..." : "Sign In"}
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="badge border-cyanGlow/30 bg-cyanGlow/10 text-cyanGlow">Secure Admin</span>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">Admissions Dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-secondary" onClick={load} disabled={busy}>
            <RefreshCw size={18} />
            Refresh
          </button>
          <button className="btn btn-secondary" onClick={logout} disabled={busy}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>

      {message && <p className="rounded-xl border border-cyanGlow/20 bg-cyanGlow/10 p-3 text-sm font-semibold text-cyanGlow">{message}</p>}

      {payload && (
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <Stat label="Total Applications" value={payload.stats.totalApplications} />
          <Stat label="Pending" value={payload.stats.pendingApplications} />
          <Stat label="Approved" value={payload.stats.approvedApplications} />
          <Stat label="Rejected" value={payload.stats.rejectedApplications} />
          <Stat label="Awaiting Verification" value={payload.stats.awaitingPaymentVerification} />
          <Stat label="Enrolled" value={payload.stats.enrolledStudents} />
        </div>
      )}

      {payload && (
        <div className="grid gap-4 md:grid-cols-3">
          <Stat label="Verified Payments" value={payload.stats.verifiedPayments} />
          <Stat label="Revenue Collected" value={`NGN ${payload.stats.revenueCollected.toLocaleString()}`} />
          <Stat label="Pending Payments" value={payload.stats.awaitingPaymentVerification} />
        </div>
      )}

      <section className="glass rounded-2xl p-4 sm:p-6">
        <h2 className="text-xl font-black text-white">Payment Confirmations</h2>
        <div className="table-scroll mt-4">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-3">Student</th>
                <th className="px-3 py-3">Amount</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Receipt</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {awaiting.concat(payments.filter((payment) => payment.status !== "Awaiting Verification")).map((payment) => (
                <tr key={payment.id}>
                  <td className="px-3 py-3">
                    <button className="text-left font-bold text-white hover:text-cyanGlow" onClick={() => setSelected(payment)}>{payment.fullName}</button>
                    <p className="text-xs text-slate-500">{payment.email}</p>
                  </td>
                  <td className="px-3 py-3 text-slate-300">NGN {payment.amountPaid.toLocaleString()}</td>
                  <td className="px-3 py-3"><StatusBadge value={payment.status} /></td>
                  <td className="px-3 py-3">
                    {payment.receiptPath ? <a className="font-bold text-cyanGlow hover:underline" href={payment.receiptPath} target="_blank">View</a> : "None"}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <IconButton label="Approve payment" onClick={() => paymentAction(payment.id, "approve")} disabled={busy}><Check size={16} /></IconButton>
                      <IconButton label="Reject payment" onClick={() => paymentAction(payment.id, "reject")} disabled={busy}><X size={16} /></IconButton>
                      <IconButton label="Request info" onClick={() => paymentAction(payment.id, "request-info")} disabled={busy}><Mail size={16} /></IconButton>
                    </div>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && <tr><td className="px-3 py-6 text-slate-400" colSpan={5}>No payment confirmations yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="glass rounded-2xl p-4 sm:p-6">
        <h2 className="text-xl font-black text-white">Applicants</h2>
        <div className="table-scroll mt-4">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-3">Applicant</th>
                <th className="px-3 py-3">Phone</th>
                <th className="px-3 py-3">University</th>
                <th className="px-3 py-3">Application</th>
                <th className="px-3 py-3">Payment</th>
                <th className="px-3 py-3">Date Applied</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {applications.map((app) => (
                <tr key={app.id}>
                  <td className="px-3 py-3">
                    <button className="text-left font-bold text-white hover:text-cyanGlow" onClick={() => setSelected(app)}>{app.fullName}</button>
                    <p className="text-xs text-slate-500">{app.email}</p>
                  </td>
                  <td className="px-3 py-3 text-slate-300">{app.phone}</td>
                  <td className="px-3 py-3 text-slate-300">{app.university}</td>
                  <td className="px-3 py-3"><StatusBadge value={app.status} /></td>
                  <td className="px-3 py-3"><StatusBadge value={app.paymentStatus} /></td>
                  <td className="px-3 py-3 text-slate-400">{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <IconButton label="View" onClick={() => setSelected(app)} disabled={busy}><Eye size={16} /></IconButton>
                      <IconButton label="Approve" onClick={() => appAction(app.id, "approve")} disabled={busy}><Check size={16} /></IconButton>
                      <IconButton label="Reject" onClick={() => appAction(app.id, "reject")} disabled={busy}><X size={16} /></IconButton>
                      <IconButton label="Send email" onClick={() => appAction(app.id, "send-email")} disabled={busy}><Mail size={16} /></IconButton>
                      <IconButton label="Delete" onClick={() => appAction(app.id, "delete")} disabled={busy} danger><Trash2 size={16} /></IconButton>
                    </div>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && <tr><td className="px-3 py-6 text-slate-400" colSpan={7}>No applications yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function IconButton({ label, children, onClick, danger, disabled }: { label: string; children: React.ReactNode; onClick: () => void; danger?: boolean; disabled?: boolean }) {
  return (
    <button aria-label={label} title={label} onClick={onClick} disabled={disabled} className={`grid h-9 w-9 place-items-center rounded-lg border disabled:cursor-not-allowed disabled:opacity-50 ${danger ? "border-coralGlow/30 bg-coralGlow/10 text-red-200" : "border-white/10 bg-white/[0.04] text-slate-200 hover:text-cyanGlow"}`}>
      {children}
    </button>
  );
}

function StatusBadge({ value }: { value: string }) {
  const tone = value === "Approved" || value === "Verified" || value === "Enrolled"
    ? "border-mintGlow/30 bg-mintGlow/10 text-mintGlow"
    : value === "Rejected"
      ? "border-coralGlow/30 bg-coralGlow/10 text-red-200"
      : value === "More Info Requested"
        ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
        : "border-cyanGlow/30 bg-cyanGlow/10 text-cyanGlow";
  return <span className={`badge ${tone}`}>{value}</span>;
}

function DetailModal({ item, onClose }: { item: Application | Payment; onClose: () => void }) {
  const entries = Object.entries(item).filter(([key]) => !["id", "applicationId"].includes(key));
  const receiptPath = "receiptPath" in item ? item.receiptPath : null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="glass max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-black text-white">Details</h3>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>

        {receiptPath && (
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-xs font-black uppercase text-slate-500">Receipt Preview</p>
            <a href={receiptPath} target="_blank" rel="noreferrer" className="mt-3 inline-block rounded-xl border border-cyanGlow/30 bg-cyanGlow/10 px-3 py-2 text-sm font-bold text-cyanGlow hover:underline">
              Open full receipt
            </a>
            <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-slate-950/60">
              <img src={receiptPath} alt="Payment receipt preview" className="max-h-[360px] w-full object-contain" />
            </div>
          </div>
        )}

        <dl className="mt-5 grid gap-3">
          {entries.map(([key, value]) => (
            <div key={key} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
              <dt className="text-xs font-black uppercase text-slate-500">{key}</dt>
              <dd className="mt-1 break-words text-sm leading-6 text-slate-200">{String(value ?? "None")}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
