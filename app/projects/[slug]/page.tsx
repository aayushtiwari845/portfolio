import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Code2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/reveal";
import { ExternalLink } from "@/components/ui/external-link";
import { ProjectVisual } from "@/components/work/project-visual";
import { portfolio } from "@/data/portfolio";
import { getNextProject, getProject, getProjectStaticParams } from "@/lib/portfolio";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

const runtimeTechnologies = new Set([
  "Python", "FastAPI", "Next.js", "React", "Streamlit", "Dash", "Apache Kafka", "PySpark", "Spark Structured Streaming",
]);
const dataTechnologies = new Set([
  "Pandas", "NumPy", "SciPy", "Scikit-learn", "Statsmodels", "Spark MLlib", "PostgreSQL", "pgvector", "Redis", "PostGIS", "MLflow", "yfinance",
]);

function technologyGroups(stack: readonly string[]) {
  const runtime = stack.filter((item) => runtimeTechnologies.has(item));
  const data = stack.filter((item) => dataTechnologies.has(item));
  const infrastructure = stack.filter((item) => !runtimeTechnologies.has(item) && !dataTechnologies.has(item));
  return [
    { label: "Runtime & services", items: runtime },
    { label: "Data & intelligence", items: data },
    { label: "Infrastructure & interface", items: infrastructure },
  ].filter((group) => group.items.length > 0);
}

export function generateStaticParams() {
  return getProjectStaticParams();
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const canonical = `/projects/${project.slug}`;
  return {
    title: project.title,
    description: project.seoDescription,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: `${project.title} — ${project.subtitle}`,
      description: project.seoDescription,
      images: [{ url: `${canonical}/opengraph-image`, width: 1200, height: 630, alt: `${project.title} project case study` }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.seoDescription,
      images: [`${canonical}/opengraph-image`],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const nextProject = getNextProject(project.slug);
  const groupedTechnology = technologyGroups(project.stack);
  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.summary,
    url: `${portfolio.metadata.siteUrl}/projects/${project.slug}`,
    codeRepository: project.repository,
    programmingLanguage: project.stack,
    author: {
      "@type": "Person",
      name: portfolio.identity.fullName,
      url: portfolio.metadata.siteUrl,
    },
  };

  return (
    <>
      <main id="main-content">
        <section className="case-hero">
          <div className="page-shell">
            <Link className="case-breadcrumb" href="/#work">
              <ArrowLeft aria-hidden="true" size={14} /> Selected systems
            </Link>
            <div className="case-heading-grid">
              <Reveal>
                <p className="case-index">SYSTEM / {project.index}</p>
                <h1 className="case-title">{project.title}</h1>
                <p className="case-subtitle">{project.subtitle}</p>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="case-summary">{project.summary}</p>
                <div className="case-meta-list">
                  <div className="case-meta-row"><span>Domain</span><span>{project.domain}</span></div>
                  <div className="case-meta-row"><span>Stack</span><span>{project.stack.slice(0, 5).join(" / ")}</span></div>
                  <div className="case-meta-row">
                    <span>Source</span>
                    <ExternalLink className="project-arrow" href={project.repository}>Repository</ExternalLink>
                  </div>
                </div>
              </Reveal>
            </div>
            <Reveal className="case-visual" delay={0.1}>
              <ProjectVisual kind={project.visualKind} labelled />
            </Reveal>
          </div>
        </section>

        <section className="section--compact">
          <div className={`page-shell case-metrics case-metrics--${project.metrics.length}`}>
            {project.metrics.map((metric) => (
              <div className="case-metric" key={`${metric.value}-${metric.label}`}>
                <span className="technical-label">Metric / verified</span>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="page-shell case-content-grid">
            <div className="case-section-label">
              <p className="section-kicker">01 / System overview</p>
            </div>
            <Reveal className="case-prose">
              {project.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {project.ownershipNote ? <p className="ownership-note">{project.ownershipNote}</p> : null}
            </Reveal>
          </div>
        </section>

        <section className="section">
          <div className="page-shell case-content-grid">
            <div className="case-section-label">
              <p className="section-kicker">02 / Architecture</p>
            </div>
            <div>
              <Reveal className="architecture-steps">
                {project.architecture.map((step, index) => (
                  <article className="architecture-step" key={step.id}>
                    <div className="architecture-step-index">{String(index + 1).padStart(2, "0")}</div>
                    <div>
                      <h2>{step.label}</h2>
                      {step.detail ? <p>{step.detail}</p> : null}
                    </div>
                    <span className={`architecture-kind architecture-kind--${step.kind}`}>{step.kind}</span>
                  </article>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="page-shell case-content-grid">
            <div className="case-section-label">
              <p className="section-kicker">03 / Engineering highlights</p>
            </div>
            <div className="highlight-grid">
              {project.highlights.map((highlight, index) => (
                <Reveal className="highlight-item" delay={index * 0.035} key={highlight}>
                  <span>HL / {String(index + 1).padStart(2, "0")}</span>
                  <p>{highlight}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="page-shell case-content-grid">
            <div className="case-section-label">
              <p className="section-kicker">04 / Technology</p>
            </div>
            <div>
              <div className="technology-groups">
                {groupedTechnology.map((group) => (
                  <div className="technology-group" key={group.label}>
                    <h3>{group.label}</h3>
                    <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                ))}
              </div>
              <ExternalLink className="primary-cta repository-cta" href={project.repository}>
                <Code2 aria-hidden="true" size={16} /> Explore the repository
              </ExternalLink>
            </div>
          </div>
        </section>

        {nextProject ? (
          <Link className="next-project" href={`/projects/${nextProject.slug}`}>
            <span className="technical-label">Next system / {nextProject.index}</span>
            <strong>{nextProject.title}</strong>
            <span className="project-arrow">Continue exploring <ArrowUpRight aria-hidden="true" size={18} /></span>
          </Link>
        ) : null}
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
