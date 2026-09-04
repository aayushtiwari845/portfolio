import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page page-shell" id="main-content">
      <p className="not-found-code">404 / No such section</p>
      <h1 className="not-found-title">That section is not in this document.</h1>
      <p className="not-found-copy">
        The address you followed does not resolve to a section of this portfolio. The
        numbered contents are on the home page.
      </p>
      <Link className="secondary-cta" href="/">
        <ArrowLeft aria-hidden="true" size={15} /> Return to the contents
      </Link>
    </main>
  );
}
