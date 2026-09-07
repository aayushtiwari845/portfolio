/**
 * The render-ready scene, assembled from `data/orrery.ts`.
 *
 * Everything here is deterministic. The starfield is generated from a seeded
 * PRNG rather than `Math.random()` for three reasons: the same visitor sees the
 * same sky on every load, `react-hooks/purity` forbids randomness in render,
 * and a test can assert the buffer is byte-identical for a given seed.
 */

import {
  ORRERY_CAPTION,
  evidence,
  programmeOrbit,
  projectBodies,
  roles,
  type PlanetSurface,
} from "@/data/orrery";
import { arcPoints, positionOnOrbit, ringPoints } from "./orbit";
import { add, cross, normalize, scale, type Vec3 } from "./math";
import type { CameraPose } from "./camera";

export type BodyKind = "star" | "role" | "project" | "moon";

/**
 * Surface codes, matching the branch in the body fragment shader.
 *
 * A wireframe is not in this list: an unmeasured body is expressed by
 * `filled: false`, so that the one visual distinction carrying a fact stays
 * separate from the four that are only editorial.
 */
export const SURFACE = {
  star: 0,
  plain: 1,
  banded: 2,
  rocky: 3,
  icy: 4,
} as const;

function surfaceCode(surface: PlanetSurface): number {
  if (surface === "banded") return SURFACE.banded;
  if (surface === "rocky") return SURFACE.rocky;
  if (surface === "icy") return SURFACE.icy;
  return SURFACE.plain;
}

/** `#rrggbb` to linear-ish 0..1 components. */
function hexToVec3(hex: string): Vec3 {
  const value = Number.parseInt(hex.replace("#", ""), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

export interface SceneBody {
  readonly id: string;
  readonly kind: BodyKind;
  readonly position: Vec3;
  readonly radius: number;
  /**
   * False only for a project that records no measurements. It draws as an
   * unfilled outline: the scene declines to give it mass it has not earned.
   */
  readonly filled: boolean;
  /** One of `SURFACE`. */
  readonly surface: number;
  /** Both themes are carried so a theme switch needs no buffer rebuild. */
  readonly colorObservation: Vec3;
  readonly colorSchematic: Vec3;
  /** Stable per-body noise offset, so a surface never shimmers between loads. */
  readonly seed: number;
  /**
   * Present only for moons. When set, `position` is the *parent's* centre and
   * the moon's own position is computed in the vertex shader from the clock.
   * Orbiting on the GPU costs nothing and keeps the instance buffer static.
   */
  readonly orbit?: MoonOrbit;
}

export interface MoonOrbit {
  readonly radius: number;
  readonly phase: number;
  /** Radians per second. */
  readonly speed: number;
  /** How far the orbit rises and falls out of plane. */
  readonly lift: number;
}

export interface SceneRing {
  readonly points: readonly Vec3[];
  /** 0 for the faint complete orbit, 1 for the bright engagement arc. */
  readonly emphasis: number;
  /** A planetary ring paints in its planet's hue rather than the palette's. */
  readonly colorObservation?: Vec3;
  readonly colorSchematic?: Vec3;
}

/**
 * A focusable body. Capped at the eight that carry content — three roles and
 * five projects. Moons are not targets: seventy-odd extra tab stops over a
 * canvas is an accessibility failure, and the stack is already readable as text.
 */
export interface SceneTarget {
  readonly id: string;
  readonly kind: "role" | "project";
  readonly label: string;
  readonly detail: string;
  /** Present for projects, which have a case study to open. */
  readonly href?: string;
  readonly sectionId: string;
  readonly position: Vec3;
  readonly radius: number;
}

export interface Scene {
  readonly bodies: readonly SceneBody[];
  readonly rings: readonly SceneRing[];
  /** Interleaved x, y, z, brightness per star. */
  readonly starfield: Float32Array<ArrayBuffer>;
  /** Interleaved x, y, z, marked-flag per evidence record. */
  readonly evidenceCloud: Float32Array<ArrayBuffer>;
  readonly evidenceRanges: readonly EvidenceRange[];
  readonly targets: readonly SceneTarget[];
  /**
   * The camera path the scroll tour travels: an establishing shot, then each
   * body in reading order, then a final wide shot. Scroll interpolates along
   * this, which is what keeps a reader who only ever scrolls from getting
   * stranded in a 3D scene with no idea how to advance.
   */
  readonly waypoints: readonly CameraPose[];
  readonly caption: string;
}

export interface SceneOptions {
  /** 0 disables the starfield entirely, as on small screens. */
  readonly starCount: number;
  /** Moons are dropped on small screens, where they cannot be read anyway. */
  readonly includeMoons: boolean;
  /**
   * The evidence clouds total roughly 285,000 points — about 4.5MB of buffer.
   * Worth it on a desktop, not on a phone.
   */
  readonly includeEvidence: boolean;
  readonly seed: number;
}

/** Where one project's records sit inside the shared evidence buffer. */
export interface EvidenceRange {
  readonly slug: string;
  readonly first: number;
  readonly count: number;
  /** Which waypoint the camera is at when this cloud is in view. */
  readonly waypoint: number;
  readonly caption: string;
}

export const DESKTOP_SCENE: SceneOptions = {
  starCount: 2600,
  includeMoons: true,
  includeEvidence: true,
  seed: 0x5eed,
};

export const COMPACT_SCENE: SceneOptions = {
  starCount: 0,
  includeMoons: false,
  includeEvidence: false,
  seed: 0x5eed,
};

const STAR_RADIUS = 2.05;
const ROLE_RADIUS = 0.46;
const PROJECT_RADIUS_MIN = 0.72;
const PROJECT_RADIUS_MAX = 1.42;
const MOON_RADIUS = 0.125;
const RING_SEGMENTS = 96;
const ARC_SEGMENTS = 48;
const STARFIELD_INNER = 60;
const STARFIELD_OUTER = 130;

/** The star and the neutral bodies. Projects carry their own domain hue. */
const STAR_COLOR: readonly [Vec3, Vec3] = [[1, 0.82, 0.29], [0.94, 0.75, 0.23]];
const ROLE_COLOR: readonly [Vec3, Vec3] = [[0.78, 0.79, 0.84], [0.36, 0.38, 0.43]];
const MOON_COLOR: readonly [Vec3, Vec3] = [[0.52, 0.54, 0.6], [0.62, 0.63, 0.67]];

/** Mulberry32: small, fast, and good enough for a sky. */
function seededRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Stars on a shell far outside the belt, distributed so they do not clump at
 * the poles the way naive spherical sampling does.
 */
export function buildStarfield(count: number, seed: number): Float32Array<ArrayBuffer> {
  const buffer = new Float32Array(count * 4);
  const random = seededRandom(seed);

  for (let i = 0; i < count; i += 1) {
    const u = random() * 2 - 1;
    const theta = random() * Math.PI * 2;
    const planar = Math.sqrt(Math.max(0, 1 - u * u));
    const distance = STARFIELD_INNER + random() * (STARFIELD_OUTER - STARFIELD_INNER);

    buffer[i * 4] = Math.cos(theta) * planar * distance;
    buffer[i * 4 + 1] = u * distance;
    buffer[i * 4 + 2] = Math.sin(theta) * planar * distance;
    // Skewed dim so a few stars read as bright rather than all of them.
    buffer[i * 4 + 3] = 0.18 + Math.pow(random(), 2.4) * 0.82;
  }

  return buffer;
}

/**
 * Concentric tilted loops around a planet. Drawn by the orbit pass, so a ring
 * system costs a few more line strips and no new machinery at all.
 */
function planetRings(centre: Vec3, radius: number): Vec3[][] {
  const loops: Vec3[][] = [];
  const tilt = 0.42;
  const sin = Math.sin(tilt);
  const cos = Math.cos(tilt);

  for (let band = 0; band < 5; band += 1) {
    const ringRadius = radius * (1.9 + band * 0.28);
    const points: Vec3[] = [];

    for (let i = 0; i <= 72; i += 1) {
      const angle = (i / 72) * Math.PI * 2;
      const x = Math.cos(angle) * ringRadius;
      const z = Math.sin(angle) * ringRadius;

      points.push([
        centre[0] + x,
        centre[1] - z * sin,
        centre[2] + z * cos,
      ]);
    }

    loops.push(points);
  }

  return loops;
}

/**
 * Moons ride a small ring around their project, and actually travel it.
 *
 * Three staggered radii rather than one, so a stack of thirteen reads as a
 * system rather than as a single necklace, and so moons at different distances
 * separate visibly as they move.
 */
function moonOrbits(parentRadius: number, count: number): MoonOrbit[] {
  const orbits: MoonOrbit[] = [];

  for (let i = 0; i < count; i += 1) {
    const lane = i % 3;
    const radius = parentRadius * (1.95 + lane * 0.42);

    orbits.push({
      radius,
      phase: (i / Math.max(1, count)) * Math.PI * 2,
      // Inner lanes travel faster, which is both true of orbits and the thing
      // that stops the whole set moving as one rigid ring.
      speed: 0.34 / (1 + lane * 0.55),
      lift: parentRadius * 0.34,
    });
  }

  return orbits;
}

/**
 * A project's records, scattered as a flattened disc around its body.
 *
 * The spread grows with the logarithm of the count so that 63 IPOs and 284,807
 * transactions both read as a cloud rather than one reading as a speck and the
 * other as a wall. Marked records come first in the buffer, but their positions
 * are drawn from the same distribution as everything else, so they are scattered
 * through the cloud rather than clustered at one edge.
 */
function writeEvidenceCloud(
  target: Float32Array<ArrayBuffer>,
  offset: number,
  centre: Vec3,
  bodyRadius: number,
  count: number,
  highlighted: number,
  seed: number,
) {
  const random = seededRandom(seed);
  const spread = bodyRadius * (2.6 + Math.log10(Math.max(10, count)) * 2.4);

  for (let i = 0; i < count; i += 1) {
    const angle = random() * Math.PI * 2;
    // sqrt keeps the disc evenly dense instead of piling up at the centre.
    const radius = Math.sqrt(random()) * spread;
    const lift = (random() + random() - 1) * spread * 0.14;
    const slot = offset + i * 4;

    target[slot] = centre[0] + Math.cos(angle) * radius;
    target[slot + 1] = centre[1] + lift;
    target[slot + 2] = centre[2] + Math.sin(angle) * radius;
    target[slot + 3] = i < highlighted ? 1 : 0;
  }
}

/**
 * Frame a body from between it and the star, so the lit face is toward the
 * camera and the star's own glare stays out of shot.
 */
function frameBody(position: Vec3, radius: number): CameraPose {
  const outward = normalize(position);
  const tangent = normalize(cross(position, [0, 1, 0]));
  // A floor as well as a scale. The role bodies are small, and framing them
  // purely by their own radius put the camera close enough that a neighbouring
  // glow filled the screen; every stop needs enough distance to show the body
  // in its system rather than as an abstract wash of colour.
  const distance = Math.max(9.5, radius * 5.5 + 2.4);

  return {
    eye: add(
      add(scale(outward, Math.max(0, radius * -1.6) + distance * 0.35), position),
      add(scale(tangent, distance), [0, radius * 3.4 + 1.6, 0]),
    ),
    target: position,
  };
}

/**
 * A close pose for a case study backdrop.
 *
 * Unlike `frameBody`, which frames a body in its system for the tour, this
 * places the camera *inside* the body's orbit looking outward — so the star is
 * behind the viewer, the body is fully lit, and the star's own glare stays out
 * of frame. It sits close enough that the planet reads as a large soft
 * presence behind frosted glass rather than a distant speck beside it.
 */
export function backdropPose(slug: string): CameraPose | null {
  const target = sceneTargets.find((entry) => entry.id === slug);
  if (!target) return null;

  const outward = normalize(target.position);
  const tangent = normalize(cross(target.position, [0, 1, 0]));
  // Close enough that the planet fills the frame. The reading panel sits over
  // the middle, so a body framed at tour distance would be hidden behind it
  // entirely; at this range its limb, rings and glow surround the panel instead.
  const reach = target.radius * 1.5 + 0.7;

  return {
    eye: add(
      add(scale(outward, -reach), target.position),
      // Near the equator, so banded surfaces read as bands.
      add(scale(tangent, reach * 0.7), [0, target.radius * 0.45, 0]),
    ),
    target: target.position,
  };
}

/** The whole system in frame, looking slightly down onto the orbital plane. */
export const ESTABLISHING: CameraPose = {
  eye: [0, 13.5, 34.5],
  target: [0, 0, 0],
};

export function buildScene(options: SceneOptions = DESKTOP_SCENE): Scene {
  const bodies: SceneBody[] = [{
    id: "star",
    kind: "star",
    position: [0, 0, 0],
    radius: STAR_RADIUS,
    filled: true,
    surface: SURFACE.star,
    colorObservation: STAR_COLOR[0],
    colorSchematic: STAR_COLOR[1],
    seed: 0,
  }];

  const rings: SceneRing[] = [
    { points: ringPoints(programmeOrbit, RING_SEGMENTS), emphasis: 0 },
    { points: arcPoints(programmeOrbit, ARC_SEGMENTS), emphasis: 1 },
  ];

  const targets: SceneTarget[] = [];

  roles.forEach((role) => {
    bodies.push({
      id: role.id,
      kind: "role",
      position: role.position,
      radius: ROLE_RADIUS,
      filled: true,
      surface: SURFACE.rocky,
      colorObservation: ROLE_COLOR[0],
      colorSchematic: ROLE_COLOR[1],
      seed: hashSeed(role.id) % 997,
    });

    rings.push({ points: ringPoints(role.orbit, RING_SEGMENTS), emphasis: 0 });
    rings.push({ points: arcPoints(role.orbit, ARC_SEGMENTS), emphasis: 1 });

    targets.push({
      id: role.id,
      kind: "role",
      label: role.label,
      detail: role.period,
      sectionId: "experience",
      position: role.position,
      radius: ROLE_RADIUS,
    });
  });

  projectBodies.forEach((project) => {
    const radius = PROJECT_RADIUS_MIN
      + project.prominence * (PROJECT_RADIUS_MAX - PROJECT_RADIUS_MIN);

    const observation = hexToVec3(project.appearance.observation);
    const schematic = hexToVec3(project.appearance.schematic);

    bodies.push({
      id: project.slug,
      kind: "project",
      position: project.position,
      radius,
      filled: project.measured,
      surface: surfaceCode(project.appearance.surface),
      colorObservation: observation,
      colorSchematic: schematic,
      seed: hashSeed(project.slug) % 997,
    });

    rings.push({ points: ringPoints(project.orbit, RING_SEGMENTS), emphasis: 0 });

    // A ring system, drawn as concentric tilted loops around the planet in its
    // own hue. Cheap: it reuses the orbit pass rather than needing geometry.
    if (project.appearance.ringed) {
      planetRings(project.position, radius).forEach((points) => {
        rings.push({
          points,
          emphasis: 0,
          colorObservation: observation,
          colorSchematic: schematic,
        });
      });
    }

    if (options.includeMoons) {
      moonOrbits(radius, project.moons.length).forEach((orbit, index) => {
        bodies.push({
          id: `${project.slug}-moon-${index}`,
          kind: "moon",
          // The parent's centre; the shader adds the orbit each frame.
          position: project.position,
          radius: MOON_RADIUS,
          filled: true,
          surface: SURFACE.plain,
          colorObservation: MOON_COLOR[0],
          colorSchematic: MOON_COLOR[1],
          seed: index,
          orbit,
        });
      });
    }

    targets.push({
      id: project.slug,
      kind: "project",
      label: project.label,
      detail: `§${project.reference}`,
      href: `/projects/${project.slug}`,
      sectionId: "work",
      position: project.position,
      radius,
    });
  });

  const waypoints: CameraPose[] = [
    ESTABLISHING,
    { eye: [0, 3.4, 9.5], target: [0, 0, 0] },
    ...targets.map((target) => frameBody(target.position, target.radius)),
    ESTABLISHING,
  ];

  const evidenceRanges: EvidenceRange[] = [];
  let evidenceTotal = 0;

  if (options.includeEvidence) {
    projectBodies.forEach((project) => {
      const record = evidence[project.slug];
      if (record) evidenceTotal += record.count;
    });
  }

  const evidenceCloud = new Float32Array(evidenceTotal * 4);
  let evidenceCursor = 0;

  if (options.includeEvidence) {
    projectBodies.forEach((project) => {
      const record = evidence[project.slug];
      if (!record) return;

      const body = bodies.find((candidate) => candidate.id === project.slug);
      if (!body) return;

      writeEvidenceCloud(
        evidenceCloud,
        evidenceCursor * 4,
        body.position,
        body.radius,
        record.count,
        record.highlighted,
        options.seed ^ hashSeed(project.slug),
      );

      // The waypoint list is [establishing, star, ...targets, establishing],
      // so a target at index n is reached at waypoint n + 2.
      const targetIndex = targets.findIndex((entry) => entry.id === project.slug);

      evidenceRanges.push({
        slug: project.slug,
        first: evidenceCursor,
        count: record.count,
        waypoint: targetIndex + 2,
        caption: record.caption,
      });

      evidenceCursor += record.count;
    });
  }

  return {
    bodies,
    rings,
    starfield: buildStarfield(options.starCount, options.seed),
    evidenceCloud,
    evidenceRanges,
    targets,
    waypoints,
    caption: ORRERY_CAPTION,
  };
}

/** A stable per-project seed, so every cloud is identical on every load. */
function hashSeed(id: string): number {
  let hash = 2166136261;
  for (let i = 0; i < id.length; i += 1) {
    hash ^= id.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * The focusable targets on their own, with no starfield allocated.
 *
 * Rendered as DOM at module scope, so it must not touch `window`. The target
 * list is identical for the desktop and compact scenes, so either produces it.
 */
export const sceneTargets: readonly SceneTarget[] = buildScene(COMPACT_SCENE).targets;

/**
 * Body id to camera waypoint.
 *
 * The waypoint list is [establishing, star, ...targets, establishing], so a
 * target at index n is framed at waypoint n + 2. The homepage stamps these onto
 * its scroll stops, which is what stops the camera drifting out of step with
 * the section being read — the two now derive from the same list rather than
 * from a scroll fraction that assumed every section was the same height.
 */
export const waypointForTarget: Readonly<Record<string, number>> = Object.fromEntries(
  sceneTargets.map((target, index) => [target.id, index + 2]),
);

/** The wide shot the tour opens and closes on. */
export const ESTABLISHING_WAYPOINT = 0;
export const CLOSING_WAYPOINT = sceneTargets.length + 2;

/** Which side the reading column takes at a given stop. */
export function sideForWaypoint(waypoint: number): "left" | "right" {
  return waypoint % 2 === 0 ? "left" : "right";
}

/** A point on a ring, for animating a marker along an orbit. */
export { positionOnOrbit };
