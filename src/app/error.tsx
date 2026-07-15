"use client";

import Link from "next/link";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="glass max-w-lg rounded-2xl p-6 text-center">
        <p className="badge border-coralGlow/30 bg-coralGlow/10 text-red-200">Something went wrong</p>
        <h1 className="mt-4 text-3xl font-black text-white">The page hit an unexpected error.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          This usually happens when a request fails or a dashboard component crashes during render.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button className="btn btn-primary" onClick={() => reset()} type="button">
            Try again
          </button>
          <Link href="/" className="btn btn-secondary">
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}
