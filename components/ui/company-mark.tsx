/**
 * A company's mark, set beside its name in the experience list.
 *
 * SVG marks are inlined rather than served from `public/`, because `next/image`
 * will not touch an SVG without `dangerouslyAllowSVG` in the config and a plain
 * `<img>` trips `@next/next/no-img-element`, which is fatal under
 * `--max-warnings=0`. Raster marks go through `next/image` normally, where
 * neither problem applies.
 *
 * Gradient ids are namespaced per mark. Two inline SVGs that both define `#A`
 * will silently share whichever the browser parsed last, and the second logo
 * renders in the first one's colours.
 *
 * These are trademarks of their owners, reproduced at small size to identify
 * where the work happened. `data/portfolio.ts` already carries the note that
 * none of it implies endorsement.
 */

import Image from "next/image";

interface CompanyMarkProps {
  /** Matches `Experience.id` in data/portfolio.ts. */
  readonly company: string;
}

function BarclaysMark() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height="20"
      role="presentation"
      viewBox="0 0 64 64"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <radialGradient
        cx="-593.452"
        cy="-25.866"
        gradientTransform="matrix(138.07114,0,0,138.07094,81942.819,3582.5082)"
        gradientUnits="userSpaceOnUse"
        id="barclays-mark-gradient"
        r=".473"
      >
        <stop offset="0" stopColor="#20c4f4" />
        <stop offset=".305" stopColor="#09b4f0" />
        <stop offset=".5" stopColor="#00aeef" />
        <stop offset=".8" stopColor="#0092c8" />
        <stop offset="1" stopColor="#006e98" />
      </radialGradient>
      <path
        d="M59.707 13.728c-.58-1.353-1.547-2.9-3.287-4.06-.773-.58-1.74-1.16-2.707-1.547-.773-.193-1.547-.387-2.514-.387h-.193c-1.16 0-3.287.193-4.447 1.934-.58.58-.773 1.74-.58 2.707.193.773.773 1.547 1.547 1.74 0 0 .193.193.58.193 0 .193-.193.58-.193.58-.58.58-1.547 1.547-4.447 1.547h-.193c-1.547-.193-2.707-.58-4.447-2.32-.967-1.16-1.547-3.287-1.547-6.574 0-1.74-.193-3.094-.58-4.254-.193-.773-.967-1.547-1.547-1.934s-.967-.58-1.934-.967L29.93 0c-1.16 0-1.934.193-2.32.773h-1.16c-.58 0-1.353.193-1.934.193-1.16.193-1.934.773-2.707 1.353-.193.193-.967.967-1.16 1.74 0 .58.193 1.16.193 1.353l.193.193c.387-.387 1.16-.58 2.127-.58 1.353 0 3.287.58 3.674 1.547.967 1.547.58 2.707.58 4.06-.58 3.674-1.934 5.414-4.834 5.8-.58.193-1.16.193-1.547.193-2.127 0-3.674-.58-4.447-1.934v-.387s.193 0 .387-.193c.773-.387 1.353-.967 1.547-1.74.193-.967 0-1.934-.58-2.707-1.16-1.16-2.707-1.934-4.447-1.934-1.16 0-1.934.193-2.707.387-2.32.58-4.447 2.514-5.994 5.607-1.16 2.32-1.934 5.027-2.127 8.12s-.193 5.607 0 7.927c.193 3.867.967 6.187 1.934 8.7s2.127 4.834 3.48 6.96c.387.58.58 1.16.967 1.547l.193-.193c.193-.193.387-.387.58-.773.773-.58 2.127-2.514 2.514-3.094s.967-1.547 1.353-2.514l.193-.387.387.193c.387.387.58.967.58 1.547s-.193 1.16-.58 2.32c-.387 1.353-1.16 2.9-1.934 4.447.193.193.193.58 0 .58-.58.967-.58 1.353-.58 1.74h.193c.193 0 .967-.193 1.547-.773.58-.387 2.127-1.74 4.06-4.447 1.547-1.934 2.514-4.06 3.674-6.38l.193-.387.387.193c.193.193.387.193.58.387.193.387.193.967.193 1.547-.193 1.547-1.16 3.674-1.74 5.22-1.16 2.707-3.287 5.607-4.834 7.734 0 .193-.387.58-.58.58.193.193.387.387.773.58l.58.58c2.127 1.74 4.06 3.094 6.574 4.447 1.934 1.16 5.8 3.094 8.508 3.867 2.707-.58 6.574-2.707 8.508-3.867 2.514-1.353 4.447-2.707 6.574-4.447l.58-.58c.387-.193.58-.58.773-.58.193-.387.193-.58.193-.773l-.193-.193c-1.547-1.934-3.674-5.027-4.834-7.734-.58-1.547-1.547-3.674-1.74-5.22-.193-.58 0-1.16.193-1.547l.387-.387c.193-.193.58-.193.58-.193l.193.387c1.16 2.32 2.32 4.447 3.674 6.38 1.934 2.707 3.48 4.06 4.06 4.447.58.58 1.16.773 1.547.773h.193c.193-.193 0-.58-.58-1.547-.193-.193-.193-.387-.193-.58-.773-1.547-1.547-3.094-1.934-4.447-.387-1.16-.58-1.934-.58-2.32 0-.58.193-1.16.58-1.547l.387-.193.193.387c.387.967 1.16 2.127 1.547 2.707s1.934 2.32 2.32 2.9c.387.387.58.58.58.773l.193.193c.193-.193.387-.58.773-1.353l.193-.193c1.16-1.934 2.32-4.447 3.287-6.96.967-2.32 1.547-4.834 1.934-8.7.193-2.32.387-4.834 0-7.927.193-2.9-.58-5.8-1.547-7.927z"
        fill="url(#barclays-mark-gradient)"
      />
    </svg>
  );
}

/**
 * Segmentriq's mark arrived as a JPEG: line art on an opaque white ground,
 * which on the dark theme would be a white square with a logo sitting in it.
 *
 * The white is removed at render time by CSS rather than baked out into a
 * transparent PNG. There is no image tooling available here to do the keying
 * offline, and moving the converted bytes by hand corrupted the file twice, in
 * ways a chunk-structure check did not catch the first time. Blending is
 * exact, needs no conversion step, and keeps the original asset byte for byte.
 *
 * See `.company-mark__keyed` in orrery.css for how each theme does it.
 */
function SegmentriqMark() {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className="company-mark__keyed"
      height={40}
      src="/logos/segmentriq.jpg"
      width={40}
    />
  );
}

/**
 * Makeflow was a startup and has no mark of its own.
 *
 * This is deliberately generic rather than an invented logo: a plain
 * node-and-edge glyph in the current ink, which reads as a placeholder next to
 * two real marks instead of passing itself off as a brand the company never
 * had. It carries no colour of its own, so it never competes with them.
 */
function GenericMark() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="20"
      role="presentation"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.6"
      viewBox="0 0 24 24"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="5.5" cy="18.5" r="2.4" />
      <circle cx="12" cy="12" r="2.4" />
      <circle cx="18.5" cy="5.5" r="2.4" />
      <path d="M7.5 16.5 L10 14" />
      <path d="M14 10 L16.5 7.5" />
    </svg>
  );
}

const marks: Readonly<Record<string, () => React.JSX.Element>> = {
  "barclays-technology-developer": BarclaysMark,
  "segmentriq-data-analytics": SegmentriqMark,
  "makeflow-backend-developer": GenericMark,
};

/**
 * Renders nothing for a company with no entry at all, so a new role added to
 * the data falls back to its name rather than to a gap.
 */
export function CompanyMark({ company }: CompanyMarkProps) {
  const Mark = marks[company];
  if (!Mark) return null;

  return (
    <span className="company-mark">
      <Mark />
    </span>
  );
}
