/**
 * Where a body's name is drawn, and what it is not allowed to sit on top of.
 *
 * This is geometry, not rendering, so it lives here rather than inside the
 * stage's effect closure: the rule "a name never covers the caption" is worth
 * a test, and a rectangle test buried in a `requestAnimationFrame` callback is
 * only ever checked by looking at the screen.
 */

export interface Rect {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
}

/**
 * The label is centred on its body and wraps to at most two lines at 20ch, so
 * it is treated as a box hanging from `labelY` rather than as a bare point.
 * Anchoring on the point alone let a long name such as "Real-Time Fraud
 * Detection Pipeline" straddle the caption while its centre sat clear of it.
 */
export const LABEL_HALF_WIDTH = 72;
export const LABEL_HEIGHT = 36;

/** The box a name occupies, given where the renderer says its top edge sits. */
export function labelRect(x: number, labelY: number): Rect {
  return {
    left: x - LABEL_HALF_WIDTH,
    top: labelY,
    right: x + LABEL_HALF_WIDTH,
    bottom: labelY + LABEL_HEIGHT,
  };
}

/** Half-open on every edge, so two boxes merely touching do not count. */
export function intersects(a: Rect, b: Rect): boolean {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

/** Whether a name drawn here would land on any region the page has claimed. */
export function labelIsBlocked(
  x: number,
  labelY: number,
  reserved: readonly (Rect | null)[],
): boolean {
  const label = labelRect(x, labelY);
  return reserved.some((region) => region !== null && intersects(label, region));
}
