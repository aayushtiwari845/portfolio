"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function CopyEmail({ email, compact = false }: { email: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button
      type="button"
      className={compact ? "copy-email copy-email--compact" : "copy-email"}
      onClick={copy}
      aria-label={copied ? "Email copied" : `Copy ${email}`}
    >
      {copied ? <Check aria-hidden="true" size={16} /> : <Copy aria-hidden="true" size={16} />}
      <span>{copied ? "COPIED" : compact ? "COPY" : "COPY EMAIL"}</span>
      <span className="sr-only" aria-live="polite">{copied ? "Email address copied to clipboard" : ""}</span>
    </button>
  );
}
