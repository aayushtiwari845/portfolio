"use client";

import { useEffect } from "react";

const motionTargetSelector = "[data-reveal], [data-motion-visual]";

interface SaveDataConnection extends EventTarget {
  readonly saveData?: boolean;
}

interface NavigatorWithConnection extends Navigator {
  readonly connection?: SaveDataConnection;
}

function isInitiallyVisible(element: Element) {
  const bounds = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  return bounds.bottom > 0 && bounds.top < viewportHeight * 0.92;
}

/**
 * A single progressive-enhancement controller for entrance and diagram motion.
 *
 * Server-rendered targets remain visible until this component confirms that
 * motion is safe. Consumers opt in with `data-reveal` or `data-motion-visual`.
 */
export function MotionActivator() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as NavigatorWithConnection).connection;
    const targets = new Set<HTMLElement>();
    const intersectingTargets = new WeakSet<HTMLElement>();
    const revealedTargets = new WeakSet<HTMLElement>();

    let eligible = false;
    let intersectionObserver: IntersectionObserver | null = null;

    const canAnimate = () => (
      "IntersectionObserver" in window
      && !reducedMotionQuery.matches
      && !connection?.saveData
    );

    const updateTarget = (target: HTMLElement) => {
      const isIntersecting = intersectingTargets.has(target);
      const isVisual = target.hasAttribute("data-motion-visual");
      const isReveal = target.hasAttribute("data-reveal");

      if (isReveal && (!eligible || isIntersecting)) {
        revealedTargets.add(target);
      }

      if (isVisual) {
        target.dataset.motionState = eligible
          && document.visibilityState === "visible"
          && isIntersecting
          ? "active"
          : "idle";
        return;
      }

      if (isReveal) {
        target.dataset.motionState = revealedTargets.has(target) ? "visible" : "pending";
      }
    };

    const registerTarget = (target: HTMLElement) => {
      if (targets.has(target)) return;

      targets.add(target);
      if (target.dataset.motionState === "visible") revealedTargets.add(target);
      if (isInitiallyVisible(target)) intersectingTargets.add(target);
      updateTarget(target);
      intersectionObserver?.observe(target);
    };

    const registerTree = (node: ParentNode) => {
      if (node instanceof HTMLElement && node.matches(motionTargetSelector)) {
        registerTarget(node);
      }
      node.querySelectorAll<HTMLElement>(motionTargetSelector).forEach(registerTarget);
    };

    const updateEligibility = () => {
      eligible = canAnimate();
      root.dataset.motion = eligible ? "on" : "off";

      targets.forEach(updateTarget);
    };

    if ("IntersectionObserver" in window) {
      intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;

          if (entry.isIntersecting) intersectingTargets.add(target);
          else intersectingTargets.delete(target);

          updateTarget(target);

          if (
            entry.isIntersecting
            && target.hasAttribute("data-reveal")
            && !target.hasAttribute("data-motion-visual")
          ) {
            intersectionObserver?.unobserve(target);
          }
        });
      }, {
        rootMargin: "80px 0px -8% 0px",
        threshold: 0.12,
      });
    }

    eligible = canAnimate();
    if (eligible) root.dataset.motion = "on";
    registerTree(document);
    root.dataset.motion = eligible ? "on" : "off";

    const handleVisibilityChange = () => {
      targets.forEach((target) => {
        if (target.hasAttribute("data-motion-visual")) updateTarget(target);
      });
    };

    const mutationObserver = typeof MutationObserver === "undefined"
      ? null
      : new MutationObserver((records) => {
          records.forEach((record) => {
            record.addedNodes.forEach((node) => {
              if (node instanceof HTMLElement) registerTree(node);
            });
          });
        });

    mutationObserver?.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotionQuery.addEventListener("change", updateEligibility);
    connection?.addEventListener("change", updateEligibility);

    return () => {
      intersectionObserver?.disconnect();
      mutationObserver?.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotionQuery.removeEventListener("change", updateEligibility);
      connection?.removeEventListener("change", updateEligibility);
      delete root.dataset.motion;
    };
  }, []);

  return null;
}
