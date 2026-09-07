import { describe, expect, it } from "vitest";

import { lookAt, multiply, perspective, type Mat4 } from "./math";
import { isOnScreen, projectToScreen, projectedRadius, type Viewport } from "./project";

const viewport: Viewport = { width: 800, height: 600 };

const projection = perspective(Math.PI / 3, viewport.width / viewport.height, 0.1, 500);
/** Camera 10 units out on +Z, looking back at the origin. */
const view = lookAt([0, 0, 10], [0, 0, 0], [0, 1, 0]);
const viewProjection: Mat4 = multiply(projection, view);

describe("projectToScreen", () => {
  it("puts the camera's target at the centre of the viewport", () => {
    const point = projectToScreen(viewProjection, [0, 0, 0], viewport);

    expect(point).not.toBeNull();
    expect(point?.x).toBeCloseTo(400, 6);
    expect(point?.y).toBeCloseTo(300, 6);
  });

  it("reports depth as the distance in front of the camera", () => {
    expect(projectToScreen(viewProjection, [0, 0, 0], viewport)?.depth).toBeCloseTo(10, 6);
    expect(projectToScreen(viewProjection, [0, 0, -5], viewport)?.depth).toBeCloseTo(15, 6);
  });

  it("returns null for a point behind the camera rather than mirroring it", () => {
    // 20 units behind the eye, on the axis the camera is looking away from.
    // A missing w > 0 check would place this dead centre, exactly where the
    // target in front of the camera also lands.
    expect(projectToScreen(viewProjection, [0, 0, 30], viewport)).toBeNull();
  });

  it("returns null for a point at the eye", () => {
    expect(projectToScreen(viewProjection, [0, 0, 10], viewport)).toBeNull();
  });

  it("flips y so that up in the world is up on the screen", () => {
    const above = projectToScreen(viewProjection, [0, 1, 0], viewport);
    const below = projectToScreen(viewProjection, [0, -1, 0], viewport);

    // Smaller CSS y is nearer the top of the page.
    expect(above?.y).toBeLessThan(300);
    expect(below?.y).toBeGreaterThan(300);
    expect(above?.y).toBeCloseTo(600 - (below?.y ?? 0), 6);
  });

  it("maps +X in the world to the right of the screen", () => {
    expect(projectToScreen(viewProjection, [1, 0, 0], viewport)?.x).toBeGreaterThan(400);
  });

  it("works in CSS pixels, independent of device pixel ratio", () => {
    // The same world point in the same CSS-sized viewport must project to the
    // same coordinate no matter what the backing store is scaled by.
    const point = projectToScreen(viewProjection, [1, 0, 0], viewport);
    const again = projectToScreen(viewProjection, [1, 0, 0], { width: 800, height: 600 });

    expect(point?.x).toBeCloseTo(again?.x ?? 0, 10);
  });

  it("returns null rather than NaN coordinates for a degenerate matrix", () => {
    const singular: Mat4 = new Array<number>(16).fill(0);
    expect(projectToScreen(singular, [1, 2, 3], viewport)).toBeNull();
  });
});

describe("projectedRadius", () => {
  it("shrinks with distance", () => {
    const near = projectedRadius(projection, 1, 10, viewport.height);
    const far = projectedRadius(projection, 1, 40, viewport.height);

    expect(near).toBeGreaterThan(far);
    expect(near / far).toBeCloseTo(4, 6);
  });

  it("scales linearly with world radius", () => {
    const single = projectedRadius(projection, 1, 10, viewport.height);
    const triple = projectedRadius(projection, 3, 10, viewport.height);

    expect(triple).toBeCloseTo(single * 3, 6);
  });

  it("is zero at or behind the eye", () => {
    expect(projectedRadius(projection, 1, 0, viewport.height)).toBe(0);
    expect(projectedRadius(projection, 1, -5, viewport.height)).toBe(0);
  });
});

describe("isOnScreen", () => {
  it("accepts a point inside the viewport and rejects one outside", () => {
    expect(isOnScreen({ x: 400, y: 300, depth: 1 }, viewport)).toBe(true);
    expect(isOnScreen({ x: -20, y: 300, depth: 1 }, viewport)).toBe(false);
  });

  it("keeps a point alive within the margin", () => {
    expect(isOnScreen({ x: -20, y: 300, depth: 1 }, viewport, 40)).toBe(true);
  });
});
