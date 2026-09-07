/**
 * Camera poses and the flights between them.
 *
 * Flights are driven by **elapsed milliseconds**, never by a frame counter. A
 * frame-counted ease runs at a different speed on a 120Hz display than on a
 * 60Hz one and stalls entirely when the tab is throttled; `camera.test.ts`
 * asserts the ms contract so that regression cannot come back.
 *
 * A zero-duration flight is the reduced-motion path: `poseAt` returns the
 * destination on the first call, so the camera cuts instead of easing without
 * needing a separate code path anywhere else.
 */

import { easeLift, lerp, lookAt, type Mat4, type Vec3 } from "./math";

export interface CameraPose {
  readonly eye: Vec3;
  readonly target: Vec3;
}

export interface Flight {
  readonly from: CameraPose;
  readonly to: CameraPose;
  /** Timestamp the flight began, in the same clock passed to `poseAt`. */
  readonly startedAt: number;
  readonly durationMs: number;
}

/** World up. The orrery never rolls, so this is fixed. */
const UP: Vec3 = [0, 1, 0];

export function beginFlight(
  from: CameraPose,
  to: CameraPose,
  startedAt: number,
  durationMs: number,
): Flight {
  return { from, to, startedAt, durationMs: Math.max(0, durationMs) };
}

/** Linear progress through the flight, clamped to [0, 1]. */
export function flightProgress(flight: Flight, now: number): number {
  if (flight.durationMs <= 0) return 1;

  const elapsed = now - flight.startedAt;
  if (elapsed <= 0) return 0;
  if (elapsed >= flight.durationMs) return 1;

  return elapsed / flight.durationMs;
}

export function isFlightComplete(flight: Flight, now: number): boolean {
  return flightProgress(flight, now) >= 1;
}

/** The eased pose at `now`. */
export function poseAt(flight: Flight, now: number): CameraPose {
  const t = easeLift(flightProgress(flight, now));

  return {
    eye: lerp(flight.from.eye, flight.to.eye, t),
    target: lerp(flight.from.target, flight.to.target, t),
  };
}

/** Interpolate two poses directly, for scroll-driven travel between waypoints. */
export function blendPoses(from: CameraPose, to: CameraPose, t: number): CameraPose {
  return {
    eye: lerp(from.eye, to.eye, t),
    target: lerp(from.target, to.target, t),
  };
}

export function viewMatrix(pose: CameraPose): Mat4 {
  return lookAt(pose.eye, pose.target, UP);
}

/**
 * The pose for a position along an ordered list of waypoints, where `progress`
 * runs 0 to 1 across the whole list. Drives the scroll tour.
 */
export function poseAlongPath(waypoints: readonly CameraPose[], progress: number): CameraPose {
  if (waypoints.length === 0) {
    return { eye: [0, 0, 1], target: [0, 0, 0] };
  }

  if (waypoints.length === 1) return waypoints[0];

  const clamped = progress <= 0 ? 0 : progress >= 1 ? 1 : progress;
  const scaled = clamped * (waypoints.length - 1);
  const index = Math.min(waypoints.length - 2, Math.floor(scaled));

  return blendPoses(waypoints[index], waypoints[index + 1], easeLift(scaled - index));
}
