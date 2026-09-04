import { portfolio } from "@/data/portfolio";
import { ExternalLink } from "@/components/ui/external-link";
import { MumbaiClock } from "./mumbai-clock";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-inner">
        <p className="footer-identity">
          <strong>{portfolio.identity.displayName}</strong> — {portfolio.identity.descriptor}
        </p>
        <p className="footer-time">
          <span aria-hidden="true" className="signal-dot" />
          <span>Mumbai / IST</span>
          <MumbaiClock />
        </p>
        <div className="footer-links">
          <ExternalLink href={portfolio.links.github}>GitHub</ExternalLink>
          <ExternalLink href={portfolio.links.linkedin}>LinkedIn</ExternalLink>
          <a href={portfolio.links.email}>Email</a>
        </div>
      </div>
    </footer>
  );
}
