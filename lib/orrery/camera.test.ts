import { describe, expect, it } from "vitest";

import {
  beginFlight,
  blendPoses,
  flightProgress,
  isFlightComplete,
  poseAlongPath,
  poseAt,
  viewMatrix,
  type CameraPose,
} from "./camera";

const from: CameraPose = { eye: [0, 0, 20], target: [0, 0, 0] };
const to: CameraPose = { eye: [6, 3, 8], target: [4, 0, 0] };

describe("poseAt", () => {
  it("returns the origin pose at the start", () => {
    const flight = beginFlight(from, to, 1000, 800);
    expect(poseAt(flight, 1000)).toEqual(from);
  });

  it("returns the destination pose at the end", () => {
    const flight = beginFlight(from, to, 1000, 800);
    expect(poseAt(flight, 1800)).toEqual(to);
  });

  it("holds the destination after the flight has finished", () => {
    const flight = beginFlight(from, to, 1000, 800);
    expect(poseAt(flight, 99999)).toEqual(to);
  });

  it("holds the origin for a timestamp before the flight began", () => {
    const flight = beginFlight(from, to, 1000, 800);
    expect(poseAt(flight, 0)).toEqual(from);
  });

  it("is driven by elapsed milliseconds, not by call count", () => {
    const flight = beginFlight(from, to, 0, 1000);

    // Called many times at a fixed instant, the pose must not advance.
    const first = poseAt(flight, 400);
    for (let i = 0; i < 20; i += 1) poseAt(flight, 400);
    const afterManyCalls = poseAt(flight, 400);

    expect(afterManyCalls).toEqual(first);

    // Same elapsed time reached in one step or many gives the same pose.
    expect(poseAt(flight, 700)).toEqual(poseAt(beginFlight(from, to, 100, 1000), 800));
  });

  it("advances monotonically along each axis", () => {
    const flight = beginFlight(from, to, 0, 1000);
    let previous = poseAt(flight, 0).eye[0];

    for (let now = 50; now <= 1000; now += 50) {
      const value = poseAt(flight, now).eye[0];
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }

    expect(previous).toBeCloseTo(to.eye[0], 10);
  });
});

describe("flightProgress", () => {
  it("clamps to the unit interval", () => {
    const flight = beginFlight(from, to, 1000, 500);

    expect(flightProgress(flight, 500)).toBe(0);
    expect(flightProgress(flight, 1250)).toBeCloseTo(0.5, 10);
    expect(flightProgress(flight, 5000)).toBe(1);
  });

  it("completes immediately for a zero-duration flight, the reduced-motion cut", () => {
    const flight = beginFlight(from, to, 1000, 0);

    expect(flightProgress(flight, 1000)).toBe(1);
    expect(poseAt(flight, 1000)).toEqual(to);
    expect(isFlightComplete(flight, 1000)).toBe(true);
  });

  it("never produces a negative duration", () => {
    expect(beginFlight(from, to, 0, -500).durationMs).toBe(0);
  });
});

describe("blendPoses", () => {
  it("pins both endpoints", () => {
    expect(blendPoses(from, to, 0)).toEqual(from);
    expect(blendPoses(from, to, 1)).toEqual(to);
  });
});

describe("poseAlongPath", () => {
  const a: CameraPose = { eye: [0, 0, 10], target: [0, 0, 0] };
  const b: CameraPose = { eye: [10, 0, 10], target: [1, 0, 0] };
  const c: CameraPose = { eye: [20, 0, 10], target: [2, 0, 0] };

  it("returns the first and last waypoints at the extremes", () => {
    expect(poseAlongPath([a, b, c], 0)).toEqual(a);
    expect(poseAlongPath([a, b, c], 1)).toEqual(c);
  });

  it("passes exactly through an interior waypoint", () => {
    expect(poseAlongPath([a, b, c], 0.5)).toEqual(b);
  });

  it("clamps beyond either end", () => {
    expect(poseAlongPath([a, b, c], -3)).toEqual(a);
    expect(poseAlongPath([a, b, c], 4)).toEqual(c);
  });

  it("advances monotonically across the whole path", () => {
    let previous = -Infinity;

    for (let t = 0; t <= 1.0001; t += 0.02) {
      const x = poseAlongPath([a, b, c], t).eye[0];
      expect(x).toBeGreaterThanOrEqual(previous - 1e-9);
      previous = x;
    }
  });

  it("survives degenerate paths", () => {
    expect(poseAlongPath([], 0.5).eye).toEqual([0, 0, 1]);
    expect(poseAlongPath([a], 0.5)).toEqual(a);
  });
});

describe("viewMatrix", () => {
  it("builds a matrix that puts the target in front of the camera", () => {
    const view = viewMatrix({ eye: [0, 0, 12], target: [0, 0, 0] });
    expect(view[14]).toBeCloseTo(-12, 10);
  });
});
