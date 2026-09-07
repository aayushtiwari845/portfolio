import { describe, expect, it } from "vitest";

import { length } from "./math";
import {
  arcPoints,
  bodyPosition,
  monthsBetween,
  orbitFor,
  parseMonth,
  positionOnOrbit,
  ringPoints,
  type TimelineWindow,
} from "./orbit";

const TAU = Math.PI * 2;

/** The real programme span from data/portfolio.ts: 2023-08 to 2027-07. */
const window: TimelineWindow = {
  anchor: "2023-08",
  spanMonths: 48,
  innerRadius: 4,
  outerRadius: 12,
};

describe("parseMonth", () => {
  it("orders months across a year boundary", () => {
    expect(parseMonth("2025-01") - parseMonth("2024-12")).toBe(1);
  });

  it("throws on a malformed date rather than yielding NaN", () => {
    expect(() => parseMonth("2026")).toThrow();
    expect(() => parseMonth("2026-6")).toThrow();
    expect(() => parseMonth("2026-13")).toThrow();
  });
});

describe("monthsBetween", () => {
  it("measures the real engagement lengths", () => {
    expect(monthsBetween("2026-06", "2026-08")).toBe(2);
    expect(monthsBetween("2025-09", "2025-11")).toBe(2);
    expect(monthsBetween("2024-12", "2025-01")).toBe(1);
    expect(monthsBetween("2023-08", "2027-07")).toBe(47);
  });
});

describe("orbitFor", () => {
  it("orders radius by chronology", () => {
    const segmentriq = orbitFor("2024-12", "2025-01", window, 0);
    const makeflow = orbitFor("2025-09", "2025-11", window, 0);
    const barclays = orbitFor("2026-06", "2026-08", window, 0);

    expect(segmentriq.radius).toBeLessThan(makeflow.radius);
    expect(makeflow.radius).toBeLessThan(barclays.radius);
  });

  it("keeps every orbit inside the ring the timeline defines", () => {
    const orbits = [
      orbitFor("2024-12", "2025-01", window, 0),
      orbitFor("2026-06", "2026-08", window, 0),
      // Before the anchor and long after it: both must clamp.
      orbitFor("2020-01", "2020-02", window, 0),
      orbitFor("2099-01", "2099-02", window, 0),
    ];

    orbits.forEach((orbit) => {
      expect(orbit.radius).toBeGreaterThanOrEqual(window.innerRadius);
      expect(orbit.radius).toBeLessThanOrEqual(window.outerRadius);
    });
  });

  it("gives the four-year programme a complete ring and a role a short arc", () => {
    const programme = orbitFor("2023-08", "2027-07", window, 0);
    const barclays = orbitFor("2026-06", "2026-08", window, 0);

    expect(programme.arcAngle).toBeCloseTo(TAU, 10);
    expect(barclays.arcAngle).toBeCloseTo((2 / 12) * TAU, 10);
    expect(barclays.arcAngle).toBeLessThan(programme.arcAngle);
  });

  it("places the same month of different years at the same angle", () => {
    const summer2025 = orbitFor("2025-06", "2025-08", window, 0);
    const summer2026 = orbitFor("2026-06", "2026-08", window, 0);

    expect(summer2025.startAngle).toBeCloseTo(summer2026.startAngle, 10);
    expect(summer2025.radius).not.toBeCloseTo(summer2026.radius, 3);
  });

  it("produces finite geometry for a zero-length window", () => {
    const orbit = orbitFor("2026-06", "2026-06", window, 0.2);

    expect(Number.isFinite(orbit.radius)).toBe(true);
    expect(Number.isFinite(orbit.arcAngle)).toBe(true);
    expect(orbit.arcAngle).toBeGreaterThan(0);
  });

  it("produces finite geometry for a reversed window", () => {
    const orbit = orbitFor("2026-08", "2026-06", window, 0.2);

    expect(Number.isFinite(orbit.arcAngle)).toBe(true);
    expect(orbit.arcAngle).toBeGreaterThan(0);
  });

  it("never divides by a zero span", () => {
    const orbit = orbitFor("2026-06", "2026-08", { ...window, spanMonths: 0 }, 0);
    expect(Number.isFinite(orbit.radius)).toBe(true);
  });
});

describe("positionOnOrbit", () => {
  const orbit = orbitFor("2026-06", "2026-08", window, 0.35);

  it("closes on itself after a full turn", () => {
    const start = positionOnOrbit(orbit, 0);
    const wrapped = positionOnOrbit(orbit, TAU);

    start.forEach((value, index) => {
      expect(wrapped[index]).toBeCloseTo(value, 10);
    });
  });

  it("keeps every point at the orbit's radius regardless of inclination", () => {
    for (let i = 0; i < 12; i += 1) {
      expect(length(positionOnOrbit(orbit, (i / 12) * TAU))).toBeCloseTo(orbit.radius, 10);
    }
  });

  it("lifts points out of the XZ plane when inclined, and not when flat", () => {
    const flat = orbitFor("2026-06", "2026-08", window, 0);

    expect(positionOnOrbit(flat, TAU / 4)[1]).toBeCloseTo(0, 10);
    expect(Math.abs(positionOnOrbit(orbit, TAU / 4)[1])).toBeGreaterThan(0.1);
  });
});

describe("bodyPosition", () => {
  it("sits at the midpoint of the engagement, on the orbit", () => {
    const orbit = orbitFor("2026-06", "2026-08", window, 0.35);
    expect(length(bodyPosition(orbit))).toBeCloseTo(orbit.radius, 10);
  });
});

describe("ringPoints and arcPoints", () => {
  const orbit = orbitFor("2026-06", "2026-08", window, 0.35);

  it("returns segments + 1 points", () => {
    expect(ringPoints(orbit, 64)).toHaveLength(65);
    expect(arcPoints(orbit, 32)).toHaveLength(33);
  });

  it("closes the full ring but not the partial arc", () => {
    const ring = ringPoints(orbit, 64);
    expect(ring[64][0]).toBeCloseTo(ring[0][0], 10);
    expect(ring[64][2]).toBeCloseTo(ring[0][2], 10);

    const arc = arcPoints(orbit, 32);
    expect(length([arc[32][0] - arc[0][0], 0, arc[32][2] - arc[0][2]])).toBeGreaterThan(0.1);
  });

  it("starts the arc where the engagement starts", () => {
    const arc = arcPoints(orbit, 32);
    const expected = positionOnOrbit(orbit, orbit.startAngle);

    expected.forEach((value, index) => {
      expect(arc[0][index]).toBeCloseTo(value, 10);
    });
  });
});
