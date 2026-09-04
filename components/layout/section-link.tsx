"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

/**
 * Scroll to a section of the current document.
 *
 * Two problems this works around, both of which made in-page navigation
 * unreliable:
 *
 * 1. A Next `<Link href="/#id">` clicked while already on `/` performs a soft
 *    navigation to the same route. The hash is dropped and nothing scrolls, so
 *    the header's section links did nothing on the home page.
 * 2. Both display faces load with `font-display: swap`. When Archivo swaps in
 *    it re-flows the page, and a smooth scroll already in flight keeps
 *    travelling to the offset the target used to occupy — which is why the jump
 *    landed short some of the time and correctly the rest.
 *
 * So the scroll is issued directly, and then verified once it has settled. The
 * correction is abandoned the moment the reader takes over.
 */
export function scrollToSection(id: string, immediate = false): boolean {
  const target = document.getElementById(id);
  if (!target) return false;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const padding = Number.parseFloat(
    getComputedStyle(document.documentElement).scrollPaddingTop,
  ) || 0;

  const animate = !immediate && !reducedMotion;
  target.scrollIntoView({ behavior: animate ? "smooth" : "instant", block: "start" });
  history.replaceState(null, "", `#${id}`);

  if (!animate) return true;

  let cancelled = false;
  const release = () => { cancelled = true; };
  const events = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
  events.forEach((event) => window.addEventListener(event, release, { passive: true, once: true }));

  window.setTimeout(() => {
    events.forEach((event) => window.removeEventListener(event, release));
    if (cancelled) return;

    // Where the target actually ended up, against where it was asked to be.
    const drift = target.getBoundingClientRect().top - padding;
    if (Math.abs(drift) > 4) {
      target.scrollIntoView({ behavior: "instant", block: "start" });
    }
  }, 700);

  return true;
}

interface SectionLinkProps {
  readonly href: string;
  readonly className?: string;
  readonly children: ReactNode;
  readonly "aria-current"?: "page" | "location";
  readonly "data-active"?: boolean;
  readonly onNavigate?: () => void;
}

/**
 * A link to a section of the home page. Falls back to ordinary Next routing
 * whenever the target is on another page, or the reader is opening it in a new
 * tab or window.
 */
export function SectionLink({
  href,
  className,
  children,
  onNavigate,
  ...rest
}: SectionLinkProps) {
  const pathname = usePathname();
  const id = href.includes("#") ? href.split("#")[1] : "";

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!id || pathname !== "/") return;
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    if (scrollToSection(id)) {
      event.preventDefault();
      onNavigate?.();
    }
  };

  return (
    <Link className={className} href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
