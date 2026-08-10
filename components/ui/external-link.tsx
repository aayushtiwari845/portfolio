import { ArrowUpRight } from "lucide-react";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  showIcon?: boolean;
};

export function ExternalLink({
  children,
  className,
  showIcon = true,
  ...props
}: ExternalLinkProps) {
  return (
    <a
      {...props}
      className={className}
      target="_blank"
      rel="noreferrer"
    >
      <span>{children}</span>
      {showIcon ? <ArrowUpRight aria-hidden="true" size={15} strokeWidth={1.6} /> : null}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
