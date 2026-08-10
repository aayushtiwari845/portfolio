"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { ProjectArchitectureVisual } from "@/components/visuals";
import type { VisualKind } from "@/data/portfolio";

export function ProjectVisual({
  kind,
  labelled = false,
}: {
  kind: VisualKind;
  labelled?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const reducedMotion = Boolean(useReducedMotion());

  useEffect(() => {
    const node = container.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "120px", threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={container}>
      <ProjectArchitectureVisual
        active={active}
        decorative={!labelled}
        kind={kind}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}
