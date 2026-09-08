/**
 * Which body the camera has settled on.
 *
 * Extracted from the renderer so it can be tested without a GL context: this is
 * what decides whether a project's evidence cloud is drawn at all, and getting
 * it wrong means either the clouds never appear or several appear at once.
 */

import type { FocusStop } from "./scene";

export interface FocusState {
  /** The id of the body in view, or null while travelling between stops. */
  readonly slug: string | null;
  /** 0 while travelling, rising to 1 as the camera arrives. */
  readonly strength: number;
}

export const NO_FOCUS: FocusState = { slug: null, strength: 0 };

/**
 * How near the camera must be to a stop, measured in waypoints, before that
 * body's evidence begins to appear. Wide enough that a cloud fades in as the
 * camera arrives rather than snapping on.
 */
export const FOCUS_RANGE = 0.85;

/**
 * `progress` runs 0 to 1 across the whole waypoint list, so scaling it by the
 * number of segments gives a position in waypoint units that compares directly
 * against each range's stop.
 */
export function focusAt(
  stops: readonly FocusStop[],
  waypointCount: number,
  progress: number,
): FocusState {
  if (stops.length === 0 || waypointCount < 2) return NO_FOCUS;

  const clamped = progress <= 0 ? 0 : progress >= 1 ? 1 : progress;
  const scaled = clamped * (waypointCount - 1);

  let best = NO_FOCUS;

  stops.forEach((stop) => {
    const strength = Math.max(0, 1 - Math.abs(scaled - stop.waypoint) / FOCUS_RANGE);
    if (strength > best.strength) best = { slug: stop.slug, strength };
  });

  return best;
}
