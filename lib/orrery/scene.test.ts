import { describe, expect, it } from "vitest";

import { projectBodies, roles } from "@/data/orrery";
import { projects } from "@/data/portfolio";
import {
  COMPACT_SCENE,
  DESKTOP_SCENE,
  SURFACE,
  buildScene,
  buildStarfield,
} from "./scene";

const scene = buildScene();

describe("bodies", () => {
  it("has exactly one star, three roles and five projects", () => {
    const count = (kind: string) => scene.bodies.filter((body) => body.kind === kind).length;

    expect(count("star")).toBe(1);
    expect(count("role")).toBe(3);
    expect(count("project")).toBe(5);
  });

  it("gives every project exactly one moon per real stack entry", () => {
    projectBodies.forEach((project) => {
      const moons = scene.bodies.filter(
        (body) => body.kind === "moon" && body.id.startsWith(`${project.slug}-moon-`),
      );
      const source = projects.find((candidate) => candidate.slug === project.slug);

      expect(moons).toHaveLength(source?.stack.length ?? -1);
    });
  });

  it("gives every body a unique id", () => {
    const ids = scene.bodies.map((body) => body.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("leaves the unmeasured project unfilled and every other body filled", () => {
    const unfilled = scene.bodies.filter((body) => !body.filled);
    expect(unfilled.map((body) => body.id)).toEqual(["civiclens"]);
  });

  it("sizes project bodies by ordinal prominence", () => {
    const tracepilot = scene.bodies.find((body) => body.id === "tracepilot");
    const civiclens = scene.bodies.find((body) => body.id === "civiclens");

    expect(tracepilot?.radius).toBeGreaterThan(civiclens?.radius ?? Infinity);
  });

  it("marks the star with the surface code the shader treats as emissive", () => {
    expect(scene.bodies.find((body) => body.kind === "star")?.surface).toBe(SURFACE.star);
  });

  it("gives every project a distinct domain hue", () => {
    const projects = scene.bodies.filter((body) => body.kind === "project");
    const hues = projects.map((body) => body.colorObservation.join(","));

    expect(new Set(hues).size).toBe(projects.length);
  });

  it("carries both theme colours so a theme switch needs no re-upload", () => {
    scene.bodies.forEach((body) => {
      expect(body.colorObservation).toHaveLength(3);
      expect(body.colorSchematic).toHaveLength(3);
      body.colorObservation.forEach((channel) => {
        expect(channel).toBeGreaterThanOrEqual(0);
        expect(channel).toBeLessThanOrEqual(1);
      });
    });
  });

  it("varies the surface across the belt rather than repeating one sphere", () => {
    const surfaces = scene.bodies
      .filter((body) => body.kind === "project")
      .map((body) => body.surface);

    expect(new Set(surfaces).size).toBeGreaterThan(1);
  });

  it("gives the ringed planet its ring system in its own hue", () => {
    const tinted = scene.rings.filter((ring) => ring.colorObservation !== undefined);
    const tracepilot = scene.bodies.find((body) => body.id === "tracepilot");

    expect(tinted.length).toBeGreaterThan(0);
    tinted.forEach((ring) => {
      expect(ring.colorObservation).toEqual(tracepilot?.colorObservation);
    });
  });

  it("produces only finite coordinates", () => {
    scene.bodies.forEach((body) => {
      body.position.forEach((value) => expect(Number.isFinite(value)).toBe(true));
      expect(body.radius).toBeGreaterThan(0);
    });
  });
});

describe("moon orbits", () => {
  const moons = scene.bodies.filter((body) => body.kind === "moon");

  it("gives every moon an orbit and nothing else one", () => {
    expect(moons.length).toBeGreaterThan(30);
    moons.forEach((moon) => expect(moon.orbit).toBeDefined());

    scene.bodies
      .filter((body) => body.kind !== "moon")
      .forEach((body) => expect(body.orbit).toBeUndefined());
  });

  it("parks a moon on its parent's centre, since the shader adds the orbit", () => {
    projectBodies.forEach((project) => {
      const parent = scene.bodies.find((body) => body.id === project.slug);
      scene.bodies
        .filter((body) => body.id.startsWith(`${project.slug}-moon-`))
        .forEach((moon) => expect(moon.position).toEqual(parent?.position));
    });
  });

  it("staggers moons across lanes so they do not travel as one ring", () => {
    const tracepilot = moons.filter((moon) => moon.id.startsWith("tracepilot-moon-"));
    const radii = new Set(tracepilot.map((moon) => moon.orbit?.radius));
    const speeds = new Set(tracepilot.map((moon) => moon.orbit?.speed));

    expect(radii.size).toBeGreaterThan(1);
    expect(speeds.size).toBeGreaterThan(1);
  });

  it("moves inner lanes faster than outer ones", () => {
    const tracepilot = moons
      .filter((moon) => moon.id.startsWith("tracepilot-moon-"))
      .map((moon) => moon.orbit)
      .filter((orbit) => orbit !== undefined);

    const inner = tracepilot.reduce((a, b) => (a.radius <= b.radius ? a : b));
    const outer = tracepilot.reduce((a, b) => (a.radius >= b.radius ? a : b));

    expect(inner.speed).toBeGreaterThan(outer.speed);
  });

  it("keeps every orbit finite and non-zero", () => {
    moons.forEach((moon) => {
      expect(moon.orbit?.radius).toBeGreaterThan(0);
      expect(Number.isFinite(moon.orbit?.speed ?? NaN)).toBe(true);
      expect(Number.isFinite(moon.orbit?.phase ?? NaN)).toBe(true);
    });
  });
});

describe("targets", () => {
  it("caps focusable targets at the eight that carry content", () => {
    expect(scene.targets).toHaveLength(8);

    // The scene carries ~70 moons; none of them may become a tab stop.
    const moonIds = new Set(
      scene.bodies.filter((body) => body.kind === "moon").map((body) => body.id),
    );
    expect(moonIds.size).toBeGreaterThan(30);
    scene.targets.forEach((target) => expect(moonIds.has(target.id)).toBe(false));
  });

  it("lists roles chronologically before projects, matching reading order", () => {
    expect(scene.targets.slice(0, 3).map((target) => target.id))
      .toEqual(roles.map((role) => role.id));
    expect(scene.targets.slice(3).map((target) => target.id))
      .toEqual(projectBodies.map((project) => project.slug));
  });

  it("gives every project target a case-study href and roles none", () => {
    scene.targets.forEach((target) => {
      if (target.kind === "project") {
        expect(target.href).toBe(`/projects/${target.id}`);
      } else {
        expect(target.href).toBeUndefined();
      }
    });
  });

  it("points every target at a real section of the document", () => {
    scene.targets.forEach((target) => {
      expect(["experience", "work"]).toContain(target.sectionId);
    });
  });
});

describe("rings", () => {
  it("draws a faint ring and a bright arc for the programme and each role", () => {
    const emphasised = scene.rings.filter((ring) => ring.emphasis === 1);
    // The programme plus three roles carry an engagement arc; projects do not.
    expect(emphasised).toHaveLength(4);
  });

  it("never emits an empty ring", () => {
    scene.rings.forEach((ring) => expect(ring.points.length).toBeGreaterThan(2));
  });
});

describe("starfield", () => {
  it("is byte-identical for the same seed", () => {
    expect(buildStarfield(500, 1234)).toEqual(buildStarfield(500, 1234));
  });

  it("differs for a different seed", () => {
    expect(buildStarfield(500, 1234)).not.toEqual(buildStarfield(500, 9999));
  });

  it("packs four floats per star", () => {
    expect(buildStarfield(250, 7).length).toBe(1000);
  });

  it("keeps every star finite, outside the belt, and visible", () => {
    const buffer = buildStarfield(400, 42);

    for (let i = 0; i < 400; i += 1) {
      const x = buffer[i * 4];
      const y = buffer[i * 4 + 1];
      const z = buffer[i * 4 + 2];
      const brightness = buffer[i * 4 + 3];

      expect(Number.isFinite(x + y + z)).toBe(true);
      expect(Math.hypot(x, y, z)).toBeGreaterThan(50);
      expect(brightness).toBeGreaterThan(0);
      expect(brightness).toBeLessThanOrEqual(1);
    }
  });
});

describe("scene options", () => {
  it("drops the starfield and the moons on compact screens", () => {
    const compact = buildScene(COMPACT_SCENE);

    expect(compact.starfield.length).toBe(0);
    expect(compact.bodies.some((body) => body.kind === "moon")).toBe(false);
  });

  it("keeps all eight targets on compact screens", () => {
    expect(buildScene(COMPACT_SCENE).targets).toHaveLength(8);
  });

  it("carries the figure caption into the scene", () => {
    expect(buildScene(DESKTOP_SCENE).caption).toContain("ordinal");
  });
});

describe("evidence clouds", () => {
  it("draws one point per record, for every project that has records", () => {
    const expected = scene.evidenceRanges.reduce((sum, range) => sum + range.count, 0);
    expect(scene.evidenceCloud.length).toBe(expected * 4);
    expect(expected).toBeGreaterThan(280000);
  });

  it("gives the fraud dataset its real shape: 492 marked in 284,807", () => {
    // The single most load-bearing assertion in this file. The claim the scene
    // makes is that you are looking at the actual dataset, so the actual counts
    // have to be there.
    const range = scene.evidenceRanges.find(
      (entry) => entry.slug === "real-time-fraud-detection",
    );

    expect(range?.count).toBe(284807);

    let marked = 0;
    for (let i = 0; i < (range?.count ?? 0); i += 1) {
      if (scene.evidenceCloud[((range?.first ?? 0) + i) * 4 + 3] > 0.5) marked += 1;
    }

    expect(marked).toBe(492);
  });

  it("marks nothing in the projects whose data marks no subset", () => {
    scene.evidenceRanges
      .filter((range) => range.slug !== "real-time-fraud-detection")
      .forEach((range) => {
        let marked = 0;
        for (let i = 0; i < range.count; i += 1) {
          if (scene.evidenceCloud[(range.first + i) * 4 + 3] > 0.5) marked += 1;
        }
        expect(marked).toBe(0);
      });
  });

  it("gives the unmeasured project no cloud at all", () => {
    expect(scene.evidenceRanges.some((range) => range.slug === "civiclens")).toBe(false);
  });

  it("packs ranges contiguously and without overlap", () => {
    let cursor = 0;
    scene.evidenceRanges.forEach((range) => {
      expect(range.first).toBe(cursor);
      cursor += range.count;
    });
  });

  it("points every range at the waypoint that frames its body", () => {
    scene.evidenceRanges.forEach((range) => {
      // Waypoints are [establishing, star, ...targets, establishing].
      const targetIndex = scene.targets.findIndex((target) => target.id === range.slug);
      expect(range.waypoint).toBe(targetIndex + 2);
      expect(scene.waypoints[range.waypoint]).toBeDefined();
    });
  });

  it("keeps every record finite", () => {
    // Scanned in a loop and asserted once: a million individual expectations
    // takes tens of seconds and tells you nothing extra.
    let nonFinite = 0;
    for (let i = 0; i < scene.evidenceCloud.length; i += 1) {
      if (!Number.isFinite(scene.evidenceCloud[i])) nonFinite += 1;
    }

    expect(nonFinite).toBe(0);
  });

  it("carries a caption stating what each cloud shows", () => {
    scene.evidenceRanges.forEach((range) => {
      expect(range.caption.length).toBeGreaterThan(20);
    });
  });

  it("drops the clouds entirely on compact screens", () => {
    const compact = buildScene(COMPACT_SCENE);
    expect(compact.evidenceCloud.length).toBe(0);
    expect(compact.evidenceRanges).toHaveLength(0);
  });

  it("is deterministic for a given seed", () => {
    // Sampled and summed rather than compared element by element: a deep equal
    // over 1.1 million floats takes long enough to trip the test timeout, and
    // proves nothing a strided sample plus a checksum does not.
    const rebuilt = buildScene().evidenceCloud;
    expect(rebuilt.length).toBe(scene.evidenceCloud.length);

    let checksum = 0;
    let rebuiltChecksum = 0;
    for (let i = 0; i < scene.evidenceCloud.length; i += 977) {
      checksum += scene.evidenceCloud[i];
      rebuiltChecksum += rebuilt[i];
      expect(rebuilt[i]).toBe(scene.evidenceCloud[i]);
    }

    expect(rebuiltChecksum).toBe(checksum);
  });
});
