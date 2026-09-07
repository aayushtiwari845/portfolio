import { describe, expect, it } from "vitest";

import {
  cross,
  easeLift,
  identity,
  invert,
  lerp,
  lookAt,
  multiply,
  normalize,
  perspective,
  rotationY,
  transformPoint,
  type Mat4,
} from "./math";

/** A matrix with no symmetry, so a transpose bug cannot hide behind one. */
const arbitrary: Mat4 = [
  2, 7, -3, 0,
  1, -4, 5, 0,
  9, 2, 6, 0,
  -8, 3, 11, 1,
];

describe("layout", () => {
  it("stores element (row, column) at index column * 4 + row", () => {
    // lookAt's translation column is column 3, so it must land at 12..14 —
    // the single assertion that catches a transposed convention.
    const view = lookAt([0, 0, 5], [0, 0, 0], [0, 1, 0]);

    expect(view[12]).toBeCloseTo(0, 10);
    expect(view[13]).toBeCloseTo(0, 10);
    expect(view[14]).toBeCloseTo(-5, 10);
    expect(view[15]).toBeCloseTo(1, 10);
  });

  it("puts the perspective divide term at index 11, not index 14", () => {
    const projection = perspective(Math.PI / 2, 1, 1, 100);

    expect(projection[11]).toBeCloseTo(-1, 10);
    expect(projection[15]).toBeCloseTo(0, 10);
  });
});

describe("multiply", () => {
  it("leaves a matrix unchanged when multiplied by the identity", () => {
    expect(multiply(arbitrary, identity())).toEqual(arbitrary);
    expect(multiply(identity(), arbitrary)).toEqual(arbitrary);
  });

  it("composes so that the left matrix is applied last", () => {
    // Rotate a point on +X a quarter turn about +Y, then read it back.
    const rotated = transformPoint(rotationY(Math.PI / 2), [1, 0, 0]);

    expect(rotated[0]).toBeCloseTo(0, 10);
    expect(rotated[2]).toBeCloseTo(-1, 10);
  });
});

describe("invert", () => {
  it("cancels the original matrix", () => {
    const inverse = invert(arbitrary);
    expect(inverse).not.toBeNull();

    const product = multiply(arbitrary, inverse as Mat4);
    identity().forEach((expected, index) => {
      expect(product[index]).toBeCloseTo(expected, 10);
    });
  });

  it("returns null for a singular matrix", () => {
    // Two identical columns: rank 3, no inverse.
    const degenerate: Mat4 = [
      1, 0, 0, 0,
      1, 0, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ];

    expect(invert(degenerate)).toBeNull();
  });
});

describe("perspective", () => {
  it("matches the hand-computed matrix for a 90 degree vertical field", () => {
    const projection = perspective(Math.PI / 2, 1, 1, 100);

    expect(projection[0]).toBeCloseTo(1, 10);
    expect(projection[5]).toBeCloseTo(1, 10);
    expect(projection[10]).toBeCloseTo(-101 / 99, 10);
    expect(projection[14]).toBeCloseTo(-200 / 99, 10);
  });

  it("narrows the horizontal term as the viewport widens", () => {
    const wide = perspective(Math.PI / 2, 2, 1, 100);
    expect(wide[0]).toBeCloseTo(0.5, 10);
    expect(wide[5]).toBeCloseTo(1, 10);
  });
});

describe("lookAt", () => {
  it("places a point at the target in front of the camera on -Z", () => {
    const view = lookAt([0, 0, 5], [0, 0, 0], [0, 1, 0]);
    const seen = transformPoint(view, [0, 0, 0]);

    expect(seen[2]).toBeCloseTo(-5, 10);
  });

  it("builds an orthonormal basis when looking down from above", () => {
    const view = lookAt([0, 10, 0], [0, 0, 0], [0, 0, -1]);
    const seen = transformPoint(view, [0, 0, 0]);

    expect(seen[2]).toBeCloseTo(-10, 10);
  });
});

describe("vectors", () => {
  it("crosses right-handed", () => {
    expect(cross([1, 0, 0], [0, 1, 0])).toEqual([0, 0, 1]);
  });

  it("normalizes the zero vector to zero rather than NaN", () => {
    expect(normalize([0, 0, 0])).toEqual([0, 0, 0]);
  });

  it("interpolates endpoints exactly", () => {
    expect(lerp([0, 0, 0], [2, 4, 6], 0)).toEqual([0, 0, 0]);
    expect(lerp([0, 0, 0], [2, 4, 6], 1)).toEqual([2, 4, 6]);
  });
});

describe("easeLift", () => {
  it("pins both endpoints", () => {
    expect(easeLift(0)).toBe(0);
    expect(easeLift(1)).toBe(1);
  });

  it("clamps outside the unit interval", () => {
    expect(easeLift(-4)).toBe(0);
    expect(easeLift(9)).toBe(1);
  });

  it("rises monotonically and front-loads the travel", () => {
    let previous = 0;
    for (let t = 0.05; t <= 1; t += 0.05) {
      const value = easeLift(t);
      expect(value).toBeGreaterThan(previous);
      previous = value;
    }

    expect(easeLift(0.5)).toBeGreaterThan(0.5);
  });
});
