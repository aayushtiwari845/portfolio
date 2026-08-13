import type { ElementType, HTMLAttributes, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li";
} & Pick<HTMLAttributes<HTMLElement>, "id">;

export function Reveal({
  children,
  className,
  as = "div",
  id,
}: RevealProps) {
  const Component: ElementType = as;

  return (
    <Component className={className} id={id}>
      {children}
    </Component>
  );
}
