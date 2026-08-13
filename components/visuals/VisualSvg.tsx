import type { ReactNode } from "react";
import clsx from "clsx";

import styles from "./visuals.module.css";
import type { ProjectVisualProps } from "./types";

interface VisualSvgProps extends ProjectVisualProps {
  children: ReactNode;
  compactChildren: ReactNode;
  description: string;
  kindClassName: string;
}

export function VisualSvg({
  active = true,
  children,
  className,
  compactChildren,
  decorative = true,
  description,
  kindClassName,
  reducedMotion = false,
}: VisualSvgProps) {
  return (
    <div
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : description}
      className={clsx(
        styles.visual,
        kindClassName,
        active && styles.isActive,
        reducedMotion && styles.isReduced,
        className,
      )}
      role={decorative ? undefined : "img"}
    >
      <svg
        aria-hidden="true"
        className={styles.desktopCanvas}
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 640 360"
        width="640"
        height="360"
        xmlns="http://www.w3.org/2000/svg"
      >
        {children}
      </svg>
      <svg
        aria-hidden="true"
        className={styles.compactCanvas}
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 340 480"
        width="340"
        height="480"
        xmlns="http://www.w3.org/2000/svg"
      >
        {compactChildren}
      </svg>
    </div>
  );
}
