import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li";
  /**
   * Orrery stop metadata. In orrery mode each of these elements is a scroll
   * stop, and `waypoint` is the camera position it corresponds to — which is
   * what keeps the body on screen and the text beside it in agreement. `side`
   * says which side of the viewport the text takes at that stop.
   */
  waypoint?: number;
  side?: "left" | "right";
} & Pick<HTMLAttributes<HTMLElement>, "id">;

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  id,
  waypoint,
  side,
}: RevealProps) {
  const Component: ElementType = as;
  const revealStyle = {
    "--reveal-delay": `${Math.max(0, delay)}s`,
  } as CSSProperties;

  return (
    <Component
      className={className}
      data-motion-state="pending"
      data-orrery-side={side}
      data-orrery-waypoint={waypoint}
      data-reveal="true"
      id={id}
      style={revealStyle}
    >
      {children}
    </Component>
  );
}
