/**
 * The orrery's geometry, derived from `data/portfolio.ts`.
 *
 * ## What is measured and what is not
 *
 * This file exists so that the scene cannot quietly make a claim the portfolio
 * data does not support. Every quantity below is labelled at its definition,
 * and `ORRERY_CAPTION` states the same thing to the reader — the site's own
 * rule that every figure says what it measures and what it does not.
 *
 * **Measured**, straight from the data:
 * - Orbit radius: months elapsed since the degree programme began.
 * - Arc length: the engagement's duration, one full turn to twelve months.
 * - Angle: month of the year, so seasons line up across years.
 * - Moons: one per entry in a project's real `stack`.
 *
 * **Not measured**, and deliberately so:
 * - Body size is an *ordinal* editorial ranking. It is tempting to derive it
 *   from `ProjectMetric.value`, but those values are free text — `"3,285/s"`,
 *   `"26.53 ms"`, `"99.2%"`, `"20+"`, `"Auditable"`. They are not commensurable
 *   and one of them is a word. Parsing them into a radius would invent a
 *   quantitative comparison between projects that no measurement supports.
 * - Orbital *period* encodes nothing. The three roles ran 3, 3 and 2 months;
 *   an encoding with no variance carries no information, so there is none.
 */

import {
  bodyPosition,
  orbitFor,
  parseMonth,
  type Orbit,
  type TimelineWindow,
} from "@/lib/orrery/orbit";
import type { Vec3 } from "@/lib/orrery/math";
import {
  homepageProjectSlugs,
  portfolio,
  projects,
  type ProjectSlug,
} from "./portfolio";

const TAU = Math.PI * 2;

/**
 * The chronology axis. Radius 0 sits at the star; the programme's start and end
 * bound the ring the roles are placed within.
 */
export const timelineWindow: TimelineWindow = {
  anchor: portfolio.education.startDate,
  spanMonths: parseMonth(portfolio.education.endDate)
    - parseMonth(portfolio.education.startDate),
  innerRadius: 3.6,
  outerRadius: 9.4,
};

/** Where the project belt begins, outside every role orbit. */
const BELT_INNER = 11.5;
const BELT_SPACING = 2.7;

/**
 * ORDINAL. An editorial ranking of prominence on a 0–1 scale, hand-authored.
 * Not derived from any metric, and not a claim that one project is larger,
 * faster or better-evidenced than another. See the file header.
 */
const projectProminence: Record<ProjectSlug, number> = {
  tracepilot: 1,
  "real-time-fraud-detection": 0.92,
  conclave: 0.86,
  "indian-ipo-analytics": 0.71,
  civiclens: 0.63,
};

/**
 * Deterministic, so the scene is identical on every load and in every test.
 * A hash of the id rather than a random seed.
 */
function hashUnit(id: string): number {
  let hash = 2166136261;

  for (let i = 0; i < id.length; i += 1) {
    hash ^= id.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return ((hash >>> 0) % 100000) / 100000;
}

/**
 * How each planet looks, and why.
 *
 * Every visual property here now has a source in data/portfolio.ts. That was
 * not true when this file was written: hue carried the domain, but surface and
 * rings were decoration, which made the scene look like it was saying something
 * it was not. The legend below is stated to the reader in `ORRERY_CAPTION`.
 *
 *   hue      the project's `domain`
 *   surface  its `status`, categorised into four levels of maturity
 *   rings    an `ownershipNote` — work that is not solely the author's
 *   moons    one per entry in its real `stack`
 *   unfilled no `metrics` at all
 *
 * Two hues per project because the two themes are two different grounds: the
 * vibrant one glows against deep space, the darker one has to hold contrast
 * against white paper.
 */
export type PlanetSurface = "banded" | "rocky" | "icy" | "wireframe";

export interface PlanetAppearance {
  /** The domain this hue stands for, named so the mapping is auditable. */
  readonly domain: string;
  readonly observation: string;
  readonly schematic: string;
  /**
   * Maturity, categorised from `status`. The status text each level was read
   * from is quoted at the definition, so the categorisation can be checked.
   */
  readonly surface: PlanetSurface;
  /** True where the project carries an ownership note. Not an award. */
  readonly ringed: boolean;
}

export const planetAppearance: Record<ProjectSlug, PlanetAppearance> = {
  tracepilot: {
    domain: "Observability / Distributed Systems",
    observation: "#35d6d0",
    schematic: "#0c8d88",
    // "Feature-complete local system and hosted-demo template" — the most
    // developed of the five, and the only one at this level.
    surface: "banded",
    ringed: false,
  },
  conclave: {
    domain: "Applied AI / Multi-Agent Systems",
    observation: "#9b6cf0",
    schematic: "#6b3fd4",
    // "Research prototype"
    surface: "rocky",
    ringed: false,
  },
  "real-time-fraud-detection": {
    domain: "Streaming Data / Machine Learning",
    observation: "#ff6b5a",
    schematic: "#cf3a26",
    // "Academic prototype with a simulated streaming benchmark"
    surface: "rocky",
    // The only project with an ownership note: an academic collaboration on a
    // repository owned by someone else. The ring marks shared work, and it is
    // the reason this is the one body in the belt that carries one.
    ringed: true,
  },
  civiclens: {
    domain: "Civic Technology / Data Archival",
    observation: "#3fc98a",
    schematic: "#12855a",
    // "Deployed static prototype" — but it records no measurements at all, and
    // that takes precedence over maturity. Unfilled is the honest surface.
    surface: "wireframe",
    ringed: false,
  },
  "indian-ipo-analytics": {
    domain: "Data Analytics / Applied Statistics",
    observation: "#6d8dff",
    schematic: "#3352cc",
    // "Reproducible exploratory analysis"
    surface: "icy",
    ringed: false,
  },
};

/**
 * How each role looks.
 *
 * Roles are a different class of body from projects — the places rather than
 * the things — so they take a separate, metallic family of hues instead of
 * borrowing the five domain colours. Reading a steel body as "observability"
 * because it happens to be blue would be worse than reading nothing.
 *
 * ORDINAL. Size and surface here are an editorial ranking, not a measurement,
 * exactly as project size is. Barclays is the largest and the only banded body
 * among the three because it is the most substantial engagement; that is a
 * judgement, and the caption says so rather than dressing it as data.
 */
export interface RoleAppearance {
  readonly observation: string;
  readonly schematic: string;
  readonly surface: PlanetSurface;
  /** ORDINAL, 0–1. */
  readonly prominence: number;
}

export const roleAppearance: Record<string, RoleAppearance> = {
  "barclays-technology-developer": {
    observation: "#8fb3d9",
    schematic: "#3f6a99",
    surface: "banded",
    prominence: 1,
  },
  "makeflow-backend-developer": {
    observation: "#d9a86b",
    schematic: "#9c6f2c",
    surface: "rocky",
    prominence: 0.62,
  },
  "segmentriq-data-analytics": {
    observation: "#86bfae",
    schematic: "#2f7f6b",
    surface: "icy",
    prominence: 0.56,
  },
};

export interface OrreryRole {
  /** Matches an `Experience.id` in data/portfolio.ts. */
  readonly id: string;
  readonly label: string;
  readonly role: string;
  readonly period: string;
  readonly orbit: Orbit;
  readonly position: Vec3;
  /** One moon per entry, the same rule the projects follow. */
  readonly moons: readonly string[];
  readonly appearance: RoleAppearance;
}

export interface OrreryProject {
  readonly slug: ProjectSlug;
  readonly label: string;
  /** The §2.n the rest of the site refers to this project by. */
  readonly reference: string;
  readonly orbit: Orbit;
  readonly position: Vec3;
  /** ORDINAL prominence, 0–1. Not a measured magnitude. */
  readonly prominence: number;
  /** One per real stack entry. */
  readonly moons: readonly string[];
  /**
   * False when the project records no measurements at all. CivicLens is the
   * only one, and it draws unfilled rather than being given invented mass.
   */
  readonly measured: boolean;
  readonly appearance: PlanetAppearance;
}

/** The degree programme: a complete ring enclosing every role. */
export const programmeOrbit: Orbit = orbitFor(
  portfolio.education.startDate,
  portfolio.education.endDate,
  timelineWindow,
  0.06,
);

export const roles: readonly OrreryRole[] = portfolio.experiences
  .map((experience) => {
    const orbit = orbitFor(
      experience.startDate,
      experience.endDate,
      timelineWindow,
      0.05 + hashUnit(experience.id) * 0.16,
    );

    return {
      id: experience.id,
      label: experience.company,
      role: experience.role,
      period: experience.period,
      orbit,
      position: bodyPosition(orbit),
      moons: experience.stack,
      appearance: roleAppearance[experience.id],
    };
  });
// Deliberately NOT re-sorted. The order here becomes the camera's tour order
// and the tab order of the hit targets, and both have to match the order the
// document reads in — which is most-recent-first, the résumé convention.
// Sorting these chronologically sent the camera backwards through the roles
// and then jumped it forward to the belt.
// Chronology is still carried, by orbit radius, where it belongs.

export const projectBodies: readonly OrreryProject[] = homepageProjectSlugs.map(
  (slug, index) => {
    const project = projects.find((candidate) => candidate.slug === slug);
    if (!project) throw new Error(`Missing project for orrery body: ${slug}`);

    const orbit: Orbit = {
      radius: BELT_INNER + index * BELT_SPACING,
      inclination: 0.04 + hashUnit(slug) * 0.2,
      // Spread around the belt so no two bodies line up behind each other.
      startAngle: hashUnit(`${slug}-phase`) * TAU,
      arcAngle: TAU,
    };

    return {
      slug,
      label: project.title,
      reference: `2.${index + 1}`,
      orbit,
      position: bodyPosition(orbit),
      prominence: projectProminence[slug],
      moons: project.stack,
      measured: project.metrics.length > 0,
      appearance: planetAppearance[slug],
    };
  },
);

/**
 * The evidence cloud a project renders when the camera settles on it.
 *
 * Every count here is a real quantity stated in that project's case study, and
 * the cloud draws exactly that many points — not a stylised approximation. The
 * fraud dataset is the reason this exists at all: 284,807 transactions with 492
 * frauds is a ratio you can describe in a sentence and not really feel, and the
 * whole point of drawing it is that 492 amber points among 284,807 is a
 * different kind of statement than "577:1".
 *
 * `highlighted` is only set where the data genuinely marks a subset. Padding it
 * out for visual interest on the other projects would be inventing evidence,
 * so three of the five draw an unmarked cloud and CivicLens draws nothing.
 */
export interface OrreryEvidence {
  readonly count: number;
  readonly highlighted: number;
  readonly caption: string;
}

export const evidence: Readonly<Partial<Record<ProjectSlug, OrreryEvidence>>> = {
  // "284,807 historical transactions and 492 fraud cases" — data/portfolio.ts
  "real-time-fraud-detection": {
    count: 284807,
    highlighted: 492,
    caption: "284,807 transactions. Every amber point is one of the 492 frauds.",
  },
  // "A generated 180-incident laboratory dataset"
  tracepilot: {
    count: 180,
    highlighted: 0,
    caption: "180 laboratory incidents. The learned ranker scored Top-1 0.854 "
      + "against the deterministic baseline's 1.0, and stayed ineligible for promotion.",
  },
  // "The current 86-fund snapshot"
  conclave: {
    count: 86,
    highlighted: 0,
    caption: "86 funds, subject to survivorship bias. The paired study found a "
      + "directional but not statistically significant advantage over a simple baseline.",
  },
  // "63 IPOs across 27 sectors from April 2019 through November 2024"
  "indian-ipo-analytics": {
    count: 63,
    highlighted: 0,
    caption: "63 IPOs across 27 sectors, 2019 to 2024. Scoped to that dataset; not a forecast.",
  },
  // CivicLens is deliberately absent. It records no measurements, so it has no
  // cloud to draw — the same refusal that leaves its body unfilled.
};

/**
 * The figure caption. Rendered with the orrery, in both views.
 */
export const ORRERY_CAPTION =
  "Orbit radius is months elapsed since the degree programme began; each body "
  + "carries one moon per entry in its real stack. A planet's hue is its "
  + "domain, its surface is how far the work got, and a ring marks work that "
  + "is not solely mine. CivicLens is drawn unfilled because it records no "
  + "measurements at all. Body size is an ordinal ranking of prominence, not a "
  + "measured magnitude. The project metrics are not commensurable with "
  + "one another.";
