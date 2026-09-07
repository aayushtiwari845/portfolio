import { describe, expect, it } from "vitest";

import { FOCUS_RANGE, NO_FOCUS, focusAt } from "./focus";
import { buildScene } from "./scene";
import type { EvidenceRange } from "./scene";

const scene = buildScene();
const ranges = scene.evidenceRanges;
const waypoints = scene.waypoints.length;

/** Scroll progress that puts the camera exactly on waypoint `index`. */
function progressFor(index: number) {
  return index / (waypoints - 1);
}

describe("focusAt", () => {
  it("reports no focus when there are no clouds to draw", () => {
    expect(focusAt([], waypoints, 0.5)).toEqual(NO_FOCUS);
  });

  it("reaches full strength exactly at each body's stop", () => {
    ranges.forEach((range) => {
      const focus = focusAt(ranges, waypoints, progressFor(range.waypoint));

      expect(focus.slug).toBe(range.slug);
      expect(focus.strength).toBeCloseTo(1, 6);
    });
  });

  it("selects one body at a time, never two at once", () => {
    // Walk the whole tour and confirm the winner is always the nearest stop.
    for (let step = 0; step <= 200; step += 1) {
      const progress = step / 200;
      const focus = focusAt(ranges, waypoints, progress);
      if (!focus.slug) continue;

      const scaled = progress * (waypoints - 1);
      const nearest = ranges.reduce((best, range) => (
        Math.abs(scaled - range.waypoint) < Math.abs(scaled - best.waypoint) ? range : best
      ));

      expect(focus.slug).toBe(nearest.slug);
    }
  });

  it("fades out between stops rather than cutting", () => {
    const first = ranges[0];
    const atStop = focusAt(ranges, waypoints, progressFor(first.waypoint));
    const halfway = focusAt(
      ranges,
      waypoints,
      progressFor(first.waypoint - FOCUS_RANGE / 2),
    );

    expect(halfway.strength).toBeGreaterThan(0);
    expect(halfway.strength).toBeLessThan(atStop.strength);
  });

  it("shows nothing at the establishing shot, where the whole system is in view", () => {
    // Waypoint 0 is the wide shot and waypoint 1 is the star; the nearest
    // project stop is far enough away that no cloud should be drawn.
    expect(focusAt(ranges, waypoints, 0).strength).toBe(0);
    expect(focusAt(ranges, waypoints, 1).strength).toBe(0);
  });

  it("clamps progress outside the unit interval", () => {
    expect(focusAt(ranges, waypoints, -5)).toEqual(focusAt(ranges, waypoints, 0));
    expect(focusAt(ranges, waypoints, 5)).toEqual(focusAt(ranges, waypoints, 1));
  });

  it("never returns a strength outside 0 to 1", () => {
    for (let step = 0; step <= 100; step += 1) {
      const focus = focusAt(ranges, waypoints, step / 100);
      expect(focus.strength).toBeGreaterThanOrEqual(0);
      expect(focus.strength).toBeLessThanOrEqual(1);
    }
  });

  it("survives a degenerate waypoint list", () => {
    const single: EvidenceRange[] = [
      { slug: "x", first: 0, count: 1, waypoint: 0, caption: "c" },
    ];
    expect(focusAt(single, 1, 0.5)).toEqual(NO_FOCUS);
  });
});
