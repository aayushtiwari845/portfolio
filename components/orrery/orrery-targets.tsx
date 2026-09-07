import Link from "next/link";

import { sceneTargets } from "@/lib/orrery/scene";

/**
 * The interactive layer of the orrery — and the reason the canvas itself is
 * inert.
 *
 * Every body a reader can act on is a real anchor in the document, positioned
 * over the canvas from the same projection that draws the scene. Because these
 * are ordinary links rather than canvas hit-testing, tab order, focus rings,
 * screen-reader names, middle-click, and "open in new tab" all work without a
 * single line of code spent on them, and the primary action of every body still
 * works with JavaScript disabled.
 *
 * Two rules hold here:
 *
 * - **Only the eight bodies that carry content are targets.** The scene draws
 *   roughly seventy moons; none of them is focusable. Seventy extra tab stops
 *   over a canvas is an accessibility failure, and each moon is already
 *   readable as text in the panel it belongs to.
 * - **DOM order is reading order, and is never re-sorted to match what is in
 *   front.** Focus order has to stay predictable as the system rotates
 *   (WCAG 2.4.3), so the roles come first, chronologically, then the projects
 *   in their published order.
 */
export function OrreryTargets() {
  return (
    <div
      aria-label="Bodies in the orrery"
      className="orrery-targets"
      id="orrery-targets"
      role="group"
    >
      {sceneTargets.map((target) => (
        <Link
          className="orrery-target"
          data-orrery-target={target.id}
          href={target.href ?? `#${target.sectionId}`}
          key={target.id}
        >
          <span aria-hidden="true" className="orrery-target__ring" />
          <span className="orrery-target__label">
            <span className="orrery-target__name">{target.label}</span>
            <span className="orrery-target__detail">{target.detail}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
