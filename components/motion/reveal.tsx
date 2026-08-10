"use client";

import { motion, useReducedMotion } from "motion/react";
import type { HTMLAttributes, ReactNode } from "react";
import { useEffect, useState } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li";
} & Pick<HTMLAttributes<HTMLElement>, "id">;

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  id,
}: RevealProps) {
  const Component = motion[as];
  const [enhanced, setEnhanced] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const frame = window.requestAnimationFrame(() => setEnhanced(true));
    return () => window.cancelAnimationFrame(frame);
  }, [reduceMotion]);

  const visible = { opacity: 1, y: 0 };

  return (
    <Component
      id={id}
      className={className}
      animate={enhanced ? { opacity: 0, y: 24 } : visible}
      initial={false}
      whileInView={visible}
      viewport={{ once: true, amount: 0.16 }}
      transition={enhanced
        ? { duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] }
        : { duration: 0 }}
    >
      {children}
    </Component>
  );
}
