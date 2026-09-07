/**
 * World space to CSS pixels.
 *
 * This module is small and load-bearing: the same projection both draws the
 * scene and positions the real DOM buttons layered over it, so an error here
 * does not merely look wrong — it puts a body's hit target somewhere the body
 * is not, and the page becomes unusable with a keyboard or a mouse alike.
 *
 * Two rules it exists to enforce:
 *
 * 1. **Points behind the camera return `null`.** Dividing by a negative `w`
 *    mirrors a point through the origin and yields a perfectly plausible
 *    on-screen coordinate for something that is behind the viewer. That is the
 *    classic bug this module is written to make impossible.
 * 2. **Results are CSS pixels, never device pixels.** The backing store is
 *    scaled by DPR; `style.transform` is not. Applying DPR here would offset
 *    every label on a retina display.
 */

import { transformPoint, type Mat4, type Vec3 } from "./math";

export interface Viewport {
  /** CSS pixels, matching `getBoundingClientRect()`. */
  readonly width: number;
  readonly height: number;
}

export interface ScreenPoint {
  /** CSS pixels from the left edge of the canvas. */
  readonly x: number;
  /** CSS pixels from the top edge of the canvas. */
  readonly y: number;
  /**
   * Clip-space `w`, which for a standard perspective matrix is the distance in
   * front of the camera. Useful for depth-ordering DOM overlays and for scaling
   * a hit target with its body.
   */
  readonly depth: number;
}

/** Anything closer than this counts as at or behind the eye. */
const MIN_DEPTH = 1e-6;

/**
 * Project a world point. Returns `null` when the point is at or behind the
 * camera, or when the transform produced a non-finite result.
 */
export function projectToScreen(
  viewProjection: Mat4,
  world: Vec3,
  viewport: Viewport,
): ScreenPoint | null {
  const clip = transformPoint(viewProjection, world);
  const w = clip[3];

  // Written as a negated comparison so NaN falls through to null.
  if (!(w > MIN_DEPTH)) return null;

  const x = (clip[0] / w * 0.5 + 0.5) * viewport.width;
  // Clip space is y-up; CSS is y-down.
  const y = (0.5 - clip[1] / w * 0.5) * viewport.height;

  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

  return { x, y, depth: w };
}

/**
 * The on-screen radius, in CSS pixels, of a sphere of `worldRadius` at `depth`.
 *
 * Derived from the projection's vertical term rather than by projecting a
 * second point, so it stays correct as the field of view changes.
 */
export function projectedRadius(
  projection: Mat4,
  worldRadius: number,
  depth: number,
  viewportHeight: number,
): number {
  if (!(depth > MIN_DEPTH)) return 0;

  return Math.abs(worldRadius * projection[5] * viewportHeight * 0.5 / depth);
}

/**
 * Whether a projected point is worth positioning a DOM node for. `margin`
 * keeps targets alive slightly outside the frame so they do not pop as the
 * camera pans.
 */
export function isOnScreen(
  point: ScreenPoint,
  viewport: Viewport,
  margin = 0,
): boolean {
  return point.x >= -margin
    && point.y >= -margin
    && point.x <= viewport.width + margin
    && point.y <= viewport.height + margin;
}
