"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyAccountButton() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText("9135739518");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button className="btn btn-secondary" onClick={copy} type="button">
      {copied ? <Check size={18} /> : <Copy size={18} />}
      {copied ? "Copied" : "Copy Account Number"}
    </button>
  );
}
