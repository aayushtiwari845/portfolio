import { portfolio } from "@/data/portfolio";
import { ExternalLink } from "@/components/ui/external-link";
import { MumbaiClock } from "./mumbai-clock";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-inner">
        <div className="footer-identity">
          <span>Aayush Tiwari</span><br />
          <span style={{ color: "var(--text-dim)" }}>Software / Systems / AI / Data</span>
        </div>
        <div className="footer-time">
          <span className="signal-dot" aria-hidden="true" />
          <span>Mumbai / IST</span>
          <MumbaiClock />
        </div>
        <div className="footer-links">
          <ExternalLink href={portfolio.links.github}>GitHub</ExternalLink>
          <ExternalLink href={portfolio.links.linkedin}>LinkedIn</ExternalLink>
          <a href={portfolio.links.email}>Email</a>
        </div>
      </div>
    </footer>
  );
}
