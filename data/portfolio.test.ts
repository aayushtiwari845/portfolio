import { describe, expect, it } from "vitest";

import {
  homepageProjectEvidence,
  homepageProjectSlugs,
  portfolio,
  projects,
} from "@/data/portfolio";
import {
  getNextProject,
  getProject,
  getProjectMetadata,
  getProjectStaticParams,
  isProjectSlug,
} from "@/lib/portfolio";

const expectedSlugs = [
  "conclave",
  "tracepilot",
  "real-time-fraud-detection",
  "civiclens",
  "indian-ipo-analytics",
] as const;

function expectValidUrl(value: string, protocols: readonly string[]): void {
  const url = new URL(value);

  expect(protocols).toContain(url.protocol);
  expect(url.href).toBeTruthy();
}

describe("portfolio data", () => {
  it("contains exactly five projects with stable, unique slugs", () => {
    const slugs = projects.map((project) => project.slug);

    expect(projects).toHaveLength(5);
    expect(slugs).toEqual(expectedSlugs);
    expect(new Set(slugs).size).toBe(projects.length);
    expect(getProjectStaticParams()).toEqual(
      expectedSlugs.map((slug) => ({ slug })),
    );
  });

  it("uses valid URLs for the site, contact links, and repositories", () => {
    expectValidUrl(portfolio.metadata.siteUrl, ["https:"]);
    expectValidUrl(portfolio.links.website, ["https:"]);
    expectValidUrl(portfolio.links.github, ["https:"]);
    expectValidUrl(portfolio.links.linkedin, ["https:"]);
    expectValidUrl(portfolio.links.email, ["mailto:"]);

    for (const project of projects) {
      expectValidUrl(project.repository, ["https:"]);

      if ("demoUrl" in project && project.demoUrl) {
        expectValidUrl(project.demoUrl as string, ["https:"]);
      }

      if ("artifact" in project && project.artifact) {
        expectValidUrl(project.artifact.sourceUrl, ["https:"]);
      }
    }
  });

  it("keeps project artifacts local, descriptive, and source-linked", () => {
    const projectsWithArtifacts = projects.filter(
      (project) => "artifact" in project && project.artifact,
    );

    expect(projectsWithArtifacts.map(({ slug }) => slug)).toEqual([
      "conclave",
      "real-time-fraud-detection",
      "indian-ipo-analytics",
    ]);

    for (const project of projectsWithArtifacts) {
      if (!("artifact" in project) || !project.artifact) continue;

      expect(project.artifact.src).toMatch(/^\/project-artifacts\/.+\.png$/);
      expect(project.artifact.alt.length).toBeGreaterThan(30);
      expect(project.artifact.caption.length).toBeGreaterThan(70);
      expectValidUrl(project.artifact.sourceUrl, ["https:"]);
      expect(project.artifact.sourceUrl).toBe(project.repository);
    }
  });

  it("provides complete site and project metadata", () => {
    expect(portfolio.metadata.title).toContain(portfolio.identity.displayName);
    expect(portfolio.metadata.description.length).toBeGreaterThan(80);
    expect(portfolio.metadata.titleTemplate).toContain("%s");

    for (const project of projects) {
      const metadata = getProjectMetadata(project.slug);

      expect(project.seoDescription.length).toBeGreaterThan(80);
      expect(metadata).toEqual({
        title: `${project.title} — Aayush Tiwari`,
        description: project.seoDescription,
        canonicalUrl: `${portfolio.metadata.siteUrl}/projects/${project.slug}`,
      });
    }
  });

  it("looks projects up safely and preserves cyclic next-project ordering", () => {
    for (const [index, slug] of expectedSlugs.entries()) {
      expect(isProjectSlug(slug)).toBe(true);
      expect(getProject(slug)?.slug).toBe(slug);
      expect(getNextProject(slug)?.slug).toBe(
        expectedSlugs[(index + 1) % expectedSlugs.length],
      );
    }

    expect(isProjectSlug("not-a-project")).toBe(false);
    expect(getProject("not-a-project")).toBeUndefined();
    expect(getNextProject("not-a-project")).toBeUndefined();
  });

  it("keeps project rendering data complete and visual kinds unique", () => {
    const visualKinds = projects.map((project) => project.visualKind);

    expect(new Set(visualKinds).size).toBe(projects.length);

    for (const project of projects) {
      expect(project.stack.length).toBeGreaterThan(0);
      expect(project.overview.length).toBeGreaterThan(0);
      expect(project.highlights.length).toBeGreaterThanOrEqual(3);
      expect(project.architecture.length).toBeGreaterThanOrEqual(4);
      expect(project.status.length).toBeGreaterThan(0);
      expect(project.role.length).toBeGreaterThan(0);
      expect(project.problem.length).toBeGreaterThan(0);
      expect(project.constraints.length).toBeGreaterThanOrEqual(3);
      expect(project.decisions.length).toBeGreaterThanOrEqual(2);
      expect(project.validation.length).toBeGreaterThanOrEqual(2);
      expect(project.limitations.length).toBeGreaterThanOrEqual(2);

      for (const decision of project.decisions) {
        expect(decision.title.length).toBeGreaterThan(0);
        expect(decision.choice.length).toBeGreaterThan(0);
        expect(decision.rationale.length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps top-level identity free of decontextualized proof metrics", () => {
    expect("heroMetrics" in portfolio).toBe(false);
    expect(portfolio.identity.introduction).not.toMatch(/\d/);
    expect(portfolio.navigation.slice(0, 2).map(({ label }) => label)).toEqual([
      "Experience",
      "Work",
    ]);
  });

  it("uses a homepage-only project order without changing canonical routes", () => {
    expect(homepageProjectSlugs).toEqual([
      "tracepilot",
      "conclave",
      "real-time-fraud-detection",
      "civiclens",
      "indian-ipo-analytics",
    ]);
    expect(new Set(homepageProjectSlugs)).toEqual(new Set(expectedSlugs));
    expect(projects.map(({ slug }) => slug)).toEqual(expectedSlugs);
    expect(getNextProject("conclave")?.slug).toBe("tracepilot");
  });

  it("gives every homepage project a contextual finding instead of its first metric", () => {
    expect(Object.keys(homepageProjectEvidence).sort()).toEqual(
      [...expectedSlugs].sort(),
    );

    for (const project of projects) {
      const evidence = homepageProjectEvidence[project.slug];

      expect(evidence.label.length).toBeGreaterThan(3);
      expect(evidence.statement.length).toBeGreaterThan(60);

      const firstMetric = project.metrics[0]?.value;
      if (firstMetric) {
        expect(evidence.statement).not.toContain(firstMetric);
      }
    }

    expect(homepageProjectEvidence.tracepilot.statement).toContain(
      "remained ineligible for promotion",
    );
    expect(homepageProjectEvidence.conclave.statement).toContain(
      "not statistically significant",
    );
    expect(
      homepageProjectEvidence["real-time-fraud-detection"].statement,
    ).toContain("more false positives");
  });

  it("keeps experience newest-first", () => {
    const starts = portfolio.experiences.map(({ startDate }) => startDate);

    expect(starts).toEqual([...starts].sort().reverse());
  });

  it("labels collaborative work and experimental evidence honestly", () => {
    const fraud = projects.find(
      ({ slug }) => slug === "real-time-fraud-detection",
    );
    const civic = projects.find(({ slug }) => slug === "civiclens");

    expect(
      fraud && "ownershipNote" in fraud ? fraud.ownershipNote : undefined,
    ).toContain("Aditya Ravi and Atharva Indulkar");
    expect(fraud?.status).toContain("simulated streaming benchmark");
    expect(fraud?.limitations.join(" ")).toContain("not a deployed");
    expect(civic && "demoUrl" in civic ? civic.demoUrl : undefined).toBe(
      "https://civic-issues-dashboard.vercel.app",
    );
    expect(civic?.stack).not.toContain("FastAPI");
    expect(civic?.metrics).toEqual([]);
  });
});
