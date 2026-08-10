import {
  portfolio,
  projects,
  type Project,
  type ProjectSlug,
} from "@/data/portfolio";

const projectsBySlug = new Map<ProjectSlug, Project>(
  projects.map((project) => [project.slug, project]),
);

export const projectSlugs = projects.map((project) => project.slug);

export function isProjectSlug(slug: string): slug is ProjectSlug {
  return projectsBySlug.has(slug as ProjectSlug);
}

export function getProject(slug: string): Project | undefined {
  if (!isProjectSlug(slug)) {
    return undefined;
  }

  return projectsBySlug.get(slug);
}

export function getNextProject(slug: string): Project | undefined {
  const currentIndex = projects.findIndex((project) => project.slug === slug);

  if (currentIndex === -1) {
    return undefined;
  }

  return projects[(currentIndex + 1) % projects.length];
}

export function getPreviousProject(slug: string): Project | undefined {
  const currentIndex = projects.findIndex((project) => project.slug === slug);

  if (currentIndex === -1) {
    return undefined;
  }

  return projects[(currentIndex - 1 + projects.length) % projects.length];
}

export function getProjectStaticParams(): { slug: ProjectSlug }[] {
  return projectSlugs.map((slug) => ({ slug }));
}

export function getProjectMetadata(slug: string):
  | {
      title: string;
      description: string;
      canonicalUrl: string;
    }
  | undefined {
  const project = getProject(slug);

  if (!project) {
    return undefined;
  }

  return {
    title: `${project.title} — Aayush Tiwari`,
    description: project.seoDescription,
    canonicalUrl: `${portfolio.metadata.siteUrl}/projects/${project.slug}`,
  };
}
