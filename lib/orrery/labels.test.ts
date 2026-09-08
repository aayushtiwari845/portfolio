import { describe, expect, it } from "vitest";

import { LABEL_HALF_WIDTH, LABEL_HEIGHT, intersects, labelIsBlocked, labelRect } from "./labels";

/** Stands in for the caption, which sits in the bottom-right of the stage. */
const caption = { left: 1114, top: 643, right: 1390, bottom: 868 };

describe("labelRect", () => {
  it("hangs the box from the anchor rather than centring on it", () => {
    const rect = labelRect(500, 300);

    expect(rect.top).toBe(300);
    expect(rect.bottom).toBe(300 + LABEL_HEIGHT);
    expect(rect.left).toBe(500 - LABEL_HALF_WIDTH);
    expect(rect.right).toBe(500 + LABEL_HALF_WIDTH);
  });
});

describe("intersects", () => {
  it("does not count two boxes that merely share an edge", () => {
    const a = { left: 0, top: 0, right: 10, bottom: 10 };
    const b = { left: 10, top: 0, right: 20, bottom: 10 };

    expect(intersects(a, b)).toBe(false);
  });

  it("counts a one-pixel overlap", () => {
    const a = { left: 0, top: 0, right: 10, bottom: 10 };
    const b = { left: 9, top: 9, right: 20, bottom: 20 };

    expect(intersects(a, b)).toBe(true);
  });
});

describe("labelIsBlocked", () => {
  it("blocks a name drawn over the caption", () => {
    expect(labelIsBlocked(1250, 700, [caption])).toBe(true);
  });

  it("blocks a wide name whose centre is clear but whose left edge is not", () => {
    // This is the case the bare anchor-point test missed: the body sits to the
    // right of the caption while its name reaches back across it.
    const x = caption.left + LABEL_HALF_WIDTH - 8;

    expect(x).toBeGreaterThan(caption.left);
    expect(labelIsBlocked(x, 700, [caption])).toBe(true);
  });

  it("leaves a name alone once it has cleared the caption's top edge", () => {
    expect(labelIsBlocked(1250, caption.top - LABEL_HEIGHT, [caption])).toBe(false);
  });

  it("treats an unmeasured region as no constraint", () => {
    expect(labelIsBlocked(1250, 700, [null])).toBe(false);
  });
});
