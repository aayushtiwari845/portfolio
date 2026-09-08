import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { OrreryBackdrop } from "@/components/orrery/orrery-backdrop";

/**
 * Set on the same glass panel the case studies and the résumé use, over the
 * establishing shot of the whole system rather than over any one body: this is
 * the one page that is about nothing in the catalogue.
 */
export default function NotFound() {
  return (
    <>
      <OrreryBackdrop />
      <main className="case-shell not-found-page" id="main-content">
        <p className="not-found-code">404 · Nothing at that address</p>
        <h1 className="not-found-title">There is no such page here.</h1>
        <p className="not-found-copy">
          The link you followed does not resolve to anything in this portfolio. All of
          the work is reachable from the home page, either as the orrery or as a plain
          numbered document, whichever you prefer to read.
        </p>
        <div className="not-found-actions">
          <Link className="secondary-cta" href="/">
            <ArrowLeft aria-hidden="true" size={15} /> Back to the contents
          </Link>
          <Link className="secondary-cta" href="/resume">
            Read the résumé <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </main>
    </>
  );
}
