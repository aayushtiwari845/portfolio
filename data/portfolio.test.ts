import { describe, expect, it } from "vitest";

import { portfolio, projects } from "@/data/portfolio";
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
