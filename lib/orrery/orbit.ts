/**
 * The chronology axis: ISO year-months to orbital geometry.
 *
 * What each quantity is allowed to mean is constrained by what the data
 * actually supports (see `data/orrery.ts`):
 *
 * - **Radius encodes date.** Months elapsed since the anchor — the start of the
 *   degree programme — normalised across the programme's span. This is real:
 *   every role in `data/portfolio.ts` carries a `startDate`.
 * - **Arc length encodes duration**, one full turn to twelve months. The three
 *   roles run 3, 3 and 2 months, so their arcs differ only slightly; the
 *   four-year programme closes a complete ring around them. That contrast is
 *   the point, and it is the reason orbital *period* encodes nothing at all —
 *   three near-identical durations would have been an encoding carrying no
 *   information.
 * - **Angle encodes season.** Position around the ring is month-of-year, so a
 *   summer internship sits where a summer internship sat the year before.
 */

import type { Vec3 } from "./math";

const MONTHS_PER_TURN = 12;
const TAU = Math.PI * 2;

/**
 * A visible minimum, in radians. A one-month engagement would otherwise draw an
 * arc too short to read as an arc at all.
 */
const MIN_ARC = TAU / 48;

export interface Orbit {
  /** Distance from the star, in world units. */
  readonly radius: number;
  /** Tilt about +X, in radians, so the system reads as a volume not a disc. */
  readonly inclination: number;
  /** Where the engagement begins, in radians. */
  readonly startAngle: number;
  /** How far it runs, in radians. */
  readonly arcAngle: number;
}

/**
 * `"2026-06"` to an absolute month index. Throws on anything else: these values
 * come from a checked-in data file, so a malformed one is a bug to surface at
 * test time rather than a NaN to propagate into the scene.
 */
export function parseMonth(iso: string): number {
  const match = /^(\d{4})-(\d{2})$/.exec(iso);
  if (!match) throw new Error(`Expected a YYYY-MM date, received "${iso}"`);

  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) throw new Error(`Month out of range in "${iso}"`);

  return year * MONTHS_PER_TURN + (month - 1);
}

/** Whole months from `from` to `to`. Negative when `to` precedes `from`. */
export function monthsBetween(from: string, to: string): number {
  return parseMonth(to) - parseMonth(from);
}

export interface TimelineWindow {
  /** The month radius 0 maps to. */
  readonly anchor: string;
  /** The span, in months, that fills `innerRadius` to `outerRadius`. */
  readonly spanMonths: number;
  readonly innerRadius: number;
  readonly outerRadius: number;
}

/**
 * Build the orbit for an engagement running `start` to `end`.
 *
 * A zero-length or reversed window still produces finite geometry: the arc
 * clamps to `MIN_ARC` and the radius clamps into the ring, so bad data degrades
 * to something visible and wrong rather than to NaN.
 */
export function orbitFor(
  start: string,
  end: string,
  window: TimelineWindow,
  inclination: number,
): Orbit {
  const elapsed = monthsBetween(window.anchor, start);
  const duration = Math.max(0, monthsBetween(start, end));
  const span = window.spanMonths > 0 ? window.spanMonths : 1;

  const progress = Math.min(1, Math.max(0, elapsed / span));
  const radius = window.innerRadius
    + (window.outerRadius - window.innerRadius) * progress;

  return {
    radius,
    inclination,
    startAngle: ((parseMonth(start) % MONTHS_PER_TURN) / MONTHS_PER_TURN) * TAU,
    arcAngle: Math.max(MIN_ARC, Math.min(1, duration / MONTHS_PER_TURN) * TAU),
  };
}

/**
 * A point on the orbit at `angle`: the ring lies in the XZ plane, then tilts
 * about +X by the orbit's inclination.
 */
export function positionOnOrbit(orbit: Orbit, angle: number): Vec3 {
  const { radius, inclination } = orbit;
  const flatX = Math.cos(angle) * radius;
  const flatZ = Math.sin(angle) * radius;
  const sin = Math.sin(inclination);
  const cos = Math.cos(inclination);

  return [flatX, -flatZ * sin, flatZ * cos];
}

/** Where the body sits: the midpoint of its engagement. */
export function bodyAngle(orbit: Orbit): number {
  return orbit.startAngle + orbit.arcAngle / 2;
}

/** Where the body sits, in world space. */
export function bodyPosition(orbit: Orbit): Vec3 {
  return positionOnOrbit(orbit, bodyAngle(orbit));
}

/**
 * `segments + 1` points tracing the full ring, for the faint complete orbit.
 */
export function ringPoints(orbit: Orbit, segments: number): Vec3[] {
  const points: Vec3[] = [];

  for (let i = 0; i <= segments; i += 1) {
    points.push(positionOnOrbit(orbit, (i / segments) * TAU));
  }

  return points;
}
