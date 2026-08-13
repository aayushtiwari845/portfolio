import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from "react";

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
  const Component: ElementType = as;
  const revealStyle = {
    "--reveal-delay": `${Math.max(0, delay)}s`,
  } as CSSProperties;

  return (
    <Component
      className={className}
      data-motion-state="pending"
      data-reveal="true"
      id={id}
      style={revealStyle}
    >
      {children}
    </Component>
  );
}
