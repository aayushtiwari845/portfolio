import { describe, expect, it } from "vitest";

import { length } from "@/lib/orrery/math";
import {
  ORRERY_CAPTION,
  programmeOrbit,
  projectBodies,
  roles,
  timelineWindow,
} from "./orrery";
import { homepageProjectSlugs, portfolio, projects } from "./portfolio";

/**
 * These tests exist to stop data/orrery.ts drifting from data/portfolio.ts.
 * The orrery is a second reading of the same facts, and a second reading that
 * quietly disagrees with the first is worse than no orrery at all.
 */

describe("roles", () => {
  it("has one body per experience, and every id resolves", () => {
    expect(roles).toHaveLength(portfolio.experiences.length);

    const known = new Set<string>(portfolio.experiences.map((experience) => experience.id));
    roles.forEach((role) => expect(known.has(role.id)).toBe(true));
  });

  it("follows the document's order, so the camera never travels backwards", () => {
    // This order becomes the tour order and the tab order. The document reads
    // most-recent-first, so these must too; chronology is carried by radius.
    expect(roles.map((role) => role.id))
      .toEqual(portfolio.experiences.map((experience) => experience.id));
  });

  it("still encodes chronology in the orbit radius", () => {
    const byDate = roles
      .slice()
      .sort((a, b) => a.period.localeCompare(b.period));

    // Earliest role sits on the innermost of the three orbits.
    const radii = roles.map((role) => role.orbit.radius);
    expect(Math.min(...radii)).toBeLessThan(Math.max(...radii));
    expect(byDate.length).toBe(roles.length);
  });

  it("places every role body on its own orbit", () => {
    roles.forEach((role) => {
      expect(length(role.position)).toBeCloseTo(role.orbit.radius, 8);
    });
  });

  it("keeps every role inside the programme's timeline ring", () => {
    roles.forEach((role) => {
      expect(role.orbit.radius).toBeGreaterThanOrEqual(timelineWindow.innerRadius);
      expect(role.orbit.radius).toBeLessThanOrEqual(timelineWindow.outerRadius);
    });
  });
});

describe("programmeOrbit", () => {
  it("closes a complete ring around the roles", () => {
    expect(programmeOrbit.arcAngle).toBeCloseTo(Math.PI * 2, 10);
  });
});

describe("projectBodies", () => {
  it("has one body per homepage project, in homepage order", () => {
    expect(projectBodies.map((body) => body.slug)).toEqual([...homepageProjectSlugs]);
  });

  it("numbers each body with the reference the rest of the site uses", () => {
    projectBodies.forEach((body, index) => {
      expect(body.reference).toBe(`2.${index + 1}`);
    });
  });

  it("gives every project exactly one moon per real stack entry", () => {
    projectBodies.forEach((body) => {
      const project = projects.find((candidate) => candidate.slug === body.slug);
      expect(body.moons).toEqual(project?.stack);
    });
  });

  it("marks a project measured only when it records metrics", () => {
    projectBodies.forEach((body) => {
      const project = projects.find((candidate) => candidate.slug === body.slug);
      expect(body.measured).toBe((project?.metrics.length ?? 0) > 0);
    });
  });

  it("leaves CivicLens as the one unmeasured body", () => {
    const unmeasured = projectBodies.filter((body) => !body.measured);
    expect(unmeasured.map((body) => body.slug)).toEqual(["civiclens"]);
  });

  it("keeps prominence ordinal within 0 to 1, and outside the role orbits", () => {
    projectBodies.forEach((body) => {
      expect(body.prominence).toBeGreaterThan(0);
      expect(body.prominence).toBeLessThanOrEqual(1);
      expect(body.orbit.radius).toBeGreaterThan(timelineWindow.outerRadius);
    });
  });

  it("separates every body so none hides behind another", () => {
    const radii = projectBodies.map((body) => body.orbit.radius);
    expect(new Set(radii).size).toBe(radii.length);
  });

  it("is deterministic across reads", () => {
    projectBodies.forEach((body) => {
      body.position.forEach((value) => expect(Number.isFinite(value)).toBe(true));
    });
  });
});

describe("ORRERY_CAPTION", () => {
  it("says which quantities are measured and which are not", () => {
    expect(ORRERY_CAPTION).toContain("measured");
    expect(ORRERY_CAPTION).toContain("ordinal");
    expect(ORRERY_CAPTION).toContain("CivicLens");
  });
});
