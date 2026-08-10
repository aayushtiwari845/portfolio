"use client";

import { useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

type AnimatedNumberProps = {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
};

export function AnimatedNumber({
  value,
  decimals = 0,
  suffix = "",
  prefix = "",
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.7 });
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 72, damping: 24 });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (inView || reduceMotion) motionValue.set(value);
  }, [inView, motionValue, reduceMotion, value]);

  useEffect(() => {
    return spring.on("change", (latest) => setDisplay(latest));
  }, [spring]);

  const formattedValue = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  return (
    <span ref={ref}>
      <span className="sr-only">
        {prefix}
        {formattedValue}
        {suffix}
      </span>
      <span aria-hidden="true">
        {prefix}
        {new Intl.NumberFormat("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(display)}
        {suffix}
      </span>
    </span>
  );
}
