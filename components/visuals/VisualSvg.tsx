import type { ReactNode } from "react";
import clsx from "clsx";

import styles from "./visuals.module.css";
import type { ProjectVisualProps } from "./types";

interface VisualSvgProps extends ProjectVisualProps {
  children: ReactNode;
  description: string;
  kindClassName: string;
}

export function VisualSvg({
  active = true,
  children,
  className,
  decorative = true,
  description,
  kindClassName,
  reducedMotion = false,
}: VisualSvgProps) {
  return (
    <svg
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : description}
      className={clsx(
        styles.visual,
        kindClassName,
        active && styles.isActive,
        reducedMotion && styles.isReduced,
        className,
      )}
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      role={decorative ? undefined : "img"}
      viewBox="0 0 640 360"
      width="640"
      height="360"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}
