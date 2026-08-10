"use client";

import { useEffect, useRef, useState } from "react";

interface SceneActivityOptions {
  disabled?: boolean;
  rootMargin?: string;
}
export function useReducedMotionPreference(forceReduced = false) {
  const [systemReduced, setSystemReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystemReduced(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return forceReduced || systemReduced;
}

export function useSceneActivity({
  disabled = false,
  rootMargin = "120px",
}: SceneActivityOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inViewport, setInViewport] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(true);

  useEffect(() => {
    const updateVisibility = () => {
      setDocumentVisible(document.visibilityState === "visible");
    };

    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);

    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    const element = containerRef.current;

    if (!element || typeof IntersectionObserver === "undefined") {
      setInViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInViewport(entry?.isIntersecting ?? false),
      { rootMargin, threshold: 0.04 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin]);

  return {
    active: !disabled && inViewport && documentVisible,
    containerRef,
  };
}
