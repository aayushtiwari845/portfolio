import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page" id="main-content">
      <div className="page-shell">
        <p className="not-found-code">ERROR / 404 / ROUTE NOT FOUND</p>
        <h1 className="not-found-title">SIGNAL LOST</h1>
        <p className="not-found-copy">
          This route is not connected to the system graph. Return to the portfolio and continue exploring.
        </p>
        <Link className="secondary-cta" href="/">
          <ArrowLeft aria-hidden="true" size={16} /> Return home
        </Link>
      </div>
    </main>
  );
}
