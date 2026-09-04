"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Checkpoints, in ms, at which the target's position is re-asserted. */
const SETTLE_CHECKPOINTS = [0, 120, 400, 900] as const;

/**
 * Honour a `#section` in the URL on load and after a client-side navigation.
 *
 * Three things move the page out from under a hash jump, and any one of them
 * left the reader at the top of the document instead of at the section they
 * asked for:
 *
 * - the App Router resets scroll on a soft navigation and does not act on the
 *   hash, so `/#experience` from a case study landed at the top;
 * - scroll restoration runs after hydration and can undo an early jump;
 * - both faces load with `font-display: swap`, so the target moves when
 *   Archivo replaces the fallback.
 *
 * So the position is re-asserted at a few checkpoints rather than once, and
 * abandoned immediately if the reader starts scrolling themselves.
 */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.replace("#", ""));
    if (!id) return;

    let cancelled = false;
    const release = () => { cancelled = true; };
    const events = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    events.forEach((event) => window.addEventListener(event, release, { passive: true }));

    const padding = Number.parseFloat(
      getComputedStyle(document.documentElement).scrollPaddingTop,
    ) || 0;

    const timers = SETTLE_CHECKPOINTS.map((delay) => window.setTimeout(() => {
      if (cancelled) return;
      const target = document.getElementById(id);
      if (!target) return;
      if (Math.abs(target.getBoundingClientRect().top - padding) < 4) return;
      target.scrollIntoView({ behavior: "instant", block: "start" });
    }, delay));

    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
      events.forEach((event) => window.removeEventListener(event, release));
    };
  }, [pathname]);

  return null;
}
