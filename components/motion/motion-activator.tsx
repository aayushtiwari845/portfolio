"use client";

import { useEffect } from "react";
import { readMotionEnvironment } from "@/lib/motion";

const motionTargetSelector = "[data-reveal], [data-motion-visual]";
const REVEAL_AHEAD = 80;

/** Progressive motion: one-shot reveals use cached positions, never scroll-time layout reads. */
export function MotionActivator() {
  useEffect(() => {
    const root = document.documentElement;
    const environment = readMotionEnvironment();
    const targets = new Set<HTMLElement>();
    const intersectingTargets = new WeakSet<HTMLElement>();
    const revealedTargets = new WeakSet<HTMLElement>();
    let pending: { target: HTMLElement; top: number }[] = [];
    let cursor = 0;
    let frame = 0;
    let needsMeasurement = false;
    let disposed = false;
    let eligible = environment.canAnimate();
    let intersectionObserver: IntersectionObserver | null = null;

    const updateTarget = (target: HTMLElement) => {
      const isVisual = target.hasAttribute("data-motion-visual");
      if (isVisual) {
        const next = eligible && document.visibilityState === "visible"
          && intersectingTargets.has(target) ? "active" : "idle";
        if (target.dataset.motionState !== next) target.dataset.motionState = next;
      } else if (target.hasAttribute("data-reveal")) {
        const next = revealedTargets.has(target) ? "visible" : "pending";
        if (target.dataset.motionState !== next) target.dataset.motionState = next;
      }
    };

    const reveal = (target: HTMLElement, immediate = false) => {
      if (!target.hasAttribute("data-reveal")) return;
      if (immediate) target.dataset.motionImmediate = "true";
      if (!revealedTargets.has(target)) {
        revealedTargets.add(target);
        updateTarget(target);
        if (!target.hasAttribute("data-motion-visual")) intersectionObserver?.unobserve(target);
      }
    };

    const revealFromCache = () => {
      if (!eligible) return;
      const line = window.scrollY + window.innerHeight + REVEAL_AHEAD;
      while (cursor < pending.length && pending[cursor].top <= line) {
        const target = pending[cursor++].target;
        if (target.isConnected) reveal(target);
      }
    };

    const measureTargets = () => {
      // Collect all reads before changing any animation states. Closed details
      // have no box and are revealed explicitly when the reader opens them.
      const scrollY = window.scrollY;
      pending = [...targets].flatMap((target) => {
        if (!target.hasAttribute("data-reveal") || revealedTargets.has(target)) return [];
        const box = target.getBoundingClientRect();
        return box.height > 0 ? [{ target, top: box.top + scrollY }] : [];
      }).sort((a, b) => a.top - b.top);
      cursor = 0;
      revealFromCache();
    };

    const schedule = (measure = false) => {
      if (disposed || !eligible) return;
      needsMeasurement ||= measure;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (disposed) return;
        if (needsMeasurement) {
          needsMeasurement = false;
          measureTargets();
        } else revealFromCache();
      });
    };
    const scheduleMeasurement = () => schedule(true);
    const scheduleReveal = () => schedule();

    const registerTree = (node: ParentNode) => {
      const candidates = node instanceof HTMLElement && node.matches(motionTargetSelector)
        ? [node, ...node.querySelectorAll<HTMLElement>(motionTargetSelector)]
        : [...node.querySelectorAll<HTMLElement>(motionTargetSelector)];
      let changed = false;
      candidates.forEach((target) => {
        if (targets.has(target)) return;
        changed = true;
        targets.add(target);
        if (!eligible || target.dataset.motionState === "visible") revealedTargets.add(target);
        updateTarget(target);
        if (target.hasAttribute("data-motion-visual") || !revealedTargets.has(target)) {
          intersectionObserver?.observe(target);
        }
      });
      return changed;
    };

    const revealAncestors = (node: HTMLElement) => {
      let current: HTMLElement | null = node;
      while (current) {
        if (current.hasAttribute("data-reveal")) reveal(current, true);
        current = current.parentElement;
      }
    };

    const handleFocus = (event: FocusEvent) => {
      if (event.target instanceof HTMLElement) revealAncestors(event.target);
    };
    const handleDetails = (event: Event) => {
      if (!(event.target instanceof HTMLDetailsElement) || !event.target.open) return;
      revealAncestors(event.target);
      event.target.querySelectorAll<HTMLElement>("[data-reveal]").forEach((target) => reveal(target, true));
      scheduleMeasurement();
    };
    const handleAnchor = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || !link.hash || link.origin !== window.location.origin
        || link.pathname !== window.location.pathname) return;
      try {
        const destination = document.getElementById(decodeURIComponent(link.hash.slice(1)));
        if (destination) revealAncestors(destination);
      } catch { /* An invalid fragment still follows normal browser behavior. */ }
      scheduleMeasurement();
    };

    const updateEligibility = () => {
      eligible = environment.canAnimate();
      root.dataset.motion = eligible ? "on" : "off";
      if (!eligible) targets.forEach((target) => reveal(target, true));
      targets.forEach(updateTarget);
      scheduleMeasurement();
    };

    if ("IntersectionObserver" in window) {
      intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (!targets.has(target)) return;
          if (entry.isIntersecting) {
            intersectingTargets.add(target);
            reveal(target);
          } else intersectingTargets.delete(target);
          updateTarget(target);
        });
      }, { rootMargin: "80px 0px 80px 0px", threshold: 0 });
    }

    registerTree(document);
    measureTargets();
    root.dataset.motion = eligible ? "on" : "off";

    const handleVisibilityChange = () => {
      targets.forEach((target) => {
        if (target.hasAttribute("data-motion-visual")) updateTarget(target);
      });
      if (document.visibilityState === "visible") scheduleMeasurement();
    };
    const mutationObserver = typeof MutationObserver === "undefined" ? null : new MutationObserver((records) => {
      let changed = false;
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) changed = registerTree(node) || changed;
      }));
      targets.forEach((target) => {
        if (!target.isConnected) {
          targets.delete(target);
          intersectionObserver?.unobserve(target);
          changed = true;
        }
      });
      if (changed) scheduleMeasurement();
    });
    mutationObserver?.observe(document.body, { childList: true, subtree: true });
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(scheduleMeasurement);
    resizeObserver?.observe(document.body);
    window.addEventListener("scroll", scheduleReveal, { passive: true });
    window.addEventListener("resize", scheduleMeasurement);
    window.addEventListener("hashchange", scheduleMeasurement);
    document.addEventListener("focusin", handleFocus);
    document.addEventListener("toggle", handleDetails, true);
    document.addEventListener("click", handleAnchor);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    const unsubscribe = environment.subscribe(updateEligibility);
    void document.fonts?.ready.then(() => { if (!disposed) scheduleMeasurement(); });

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      intersectionObserver?.disconnect();
      mutationObserver?.disconnect();
      resizeObserver?.disconnect();
      unsubscribe();
      targets.clear();
      pending = [];
      window.removeEventListener("scroll", scheduleReveal);
      window.removeEventListener("resize", scheduleMeasurement);
      window.removeEventListener("hashchange", scheduleMeasurement);
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("toggle", handleDetails, true);
      document.removeEventListener("click", handleAnchor);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      delete root.dataset.motion;
    };
  }, []);

  return null;
}
