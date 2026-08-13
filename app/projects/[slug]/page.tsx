import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Code2, ExternalLink as ExternalLinkIcon } from "lucide-react";
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
  "Python", "JavaScript", "TypeScript", "FastAPI", "Next.js", "React", "Streamlit", "Dash", "Node.js", "HTML/CSS",
]);
const dataTechnologies = new Set([
  "Pandas", "NumPy", "SciPy", "Scikit-learn", "Statsmodels", "Spark MLlib", "PostgreSQL", "pgvector", "Redis", "MLflow", "yfinance", "Supabase",
]);
const programmingLanguages = new Set(["Python", "JavaScript", "TypeScript", "Java", "C++", "SQL"]);

function technologyGroups(stack: readonly string[]) {
  const runtime = stack.filter((item) => runtimeTechnologies.has(item));
  const data = stack.filter((item) => dataTechnologies.has(item));
  const infrastructure = stack.filter((item) => !runtimeTechnologies.has(item) && !dataTechnologies.has(item));
  return [
    { label: "Runtime & interface", items: runtime },
    { label: "Data & evaluation", items: data },
    { label: "Infrastructure & providers", items: infrastructure },
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
      images: [{ url: `${canonical}/opengraph-image`, width: 1200, height: 630, alt: `${project.title} engineering case study` }],
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
  const isCollaborative = project.slug === "real-time-fraud-detection";
  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.summary,
    url: `${portfolio.metadata.siteUrl}/projects/${project.slug}`,
    codeRepository: project.repository,
    programmingLanguage: project.stack.filter((item) => programmingLanguages.has(item)),
    author: isCollaborative
      ? ["Aayush Kumar Tiwari", "Aditya Ravi", "Atharva Indulkar"].map((name) => ({ "@type": "Person", name }))
      : { "@type": "Person", name: portfolio.identity.fullName, url: portfolio.metadata.siteUrl },
  };

  return (
    <>
      <main id="main-content">
        <section className="case-hero">
          <div className="page-shell">
            <Link className="case-breadcrumb" href="/#work">
              <ArrowLeft aria-hidden="true" size={14} /> Selected work
            </Link>
            <div className="case-heading-grid">
              <Reveal>
                <p className="case-index">PROJECT / {project.index} · {project.status}</p>
                <h1 className="case-title">{project.title}</h1>
                <p className="case-subtitle">{project.subtitle}</p>
              </Reveal>
              <Reveal delay={0.06}>
                <p className="case-summary">{project.summary}</p>
                <div className="case-meta-list">
                  <div className="case-meta-row"><span>Status</span><span>{project.status}</span></div>
                  <div className="case-meta-row"><span>Role</span><span>{project.role}</span></div>
                  <div className="case-meta-row"><span>Domain</span><span>{project.domain}</span></div>
                  <div className="case-meta-row">
                    <span>Evidence</span>
                    <span>
                      <ExternalLink className="project-arrow" href={project.repository}>Repository</ExternalLink>
                      {project.demoUrl ? <> · <ExternalLink className="project-arrow" href={project.demoUrl}>Live demo</ExternalLink></> : null}
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>
            <Reveal className="case-visual" delay={0.08}>
              <ProjectVisual kind={project.visualKind} labelled />
            </Reveal>
          </div>
        </section>

        <section className="section">
          <div className="page-shell case-content-grid">
            <div className="case-section-label"><p className="section-kicker">01 / Brief</p></div>
            <div>
              <Reveal className="case-prose">
                <p>{project.problem}</p>
                {project.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {project.ownershipNote ? <p className="ownership-note">{project.ownershipNote}</p> : null}
              </Reveal>
              <Reveal className="case-facts" delay={0.04}>
                {project.constraints.map((constraint, index) => (
                  <article className="case-fact" key={constraint}>
                    <span className="technical-label">Constraint / {String(index + 1).padStart(2, "0")}</span>
                    <h3>{index === 0 ? "Operating boundary" : "Constraint"}</h3>
                    <p>{constraint}</p>
                  </article>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="page-shell case-content-grid">
            <div className="case-section-label"><p className="section-kicker">02 / Architecture</p></div>
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
        </section>

        <section className="section">
          <div className="page-shell case-content-grid">
            <div className="case-section-label"><p className="section-kicker">03 / Decisions</p></div>
            <div className="decision-grid">
              {project.decisions.map((decision, index) => (
                <Reveal as="div" className="decision-card" delay={index * 0.035} key={decision.title}>
                  <span className="technical-label">Decision / {String(index + 1).padStart(2, "0")}</span>
                  <h3>{decision.title}</h3>
                  <p><strong>Choice:</strong> {decision.choice}</p>
                  <p><strong>Why:</strong> {decision.rationale}</p>
                  {decision.tradeoff ? <p><strong>Tradeoff:</strong> {decision.tradeoff}</p> : null}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="page-shell case-content-grid">
            <div className="case-section-label"><p className="section-kicker">04 / Validation</p></div>
            <Reveal as="div">
              <ul className="validation-list">
                {project.validation.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </Reveal>
          </div>
        </section>

        {project.metrics.length > 0 ? (
          <section className="section" aria-label="Project evidence and benchmark context">
            <div className="page-shell case-content-grid">
              <div className="case-section-label"><p className="section-kicker">05 / Evidence</p></div>
              <div className={`case-metrics case-metrics--${project.metrics.length}`}>
                {project.metrics.map((metric) => (
                  <div className="case-metric" key={`${metric.value}-${metric.label}`}>
                    <span className="technical-label">{/\d/.test(metric.value) ? "Evidence / context" : "System property"}</span>
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                    {metric.detail ? <small className="case-metric-detail">{metric.detail}</small> : null}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="section">
          <div className="page-shell case-content-grid">
            <div className="case-section-label"><p className="section-kicker">{project.metrics.length > 0 ? "06" : "05"} / Limits</p></div>
            <Reveal as="div">
              <ul className="limitations-list">
                {project.limitations.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </Reveal>
          </div>
        </section>

        <section className="section">
          <div className="page-shell case-content-grid">
            <div className="case-section-label"><p className="section-kicker">{project.metrics.length > 0 ? "07" : "06"} / Technology</p></div>
            <div>
              <div className="technology-groups">
                {groupedTechnology.map((group) => (
                  <div className="technology-group" key={group.label}>
                    <h3>{group.label}</h3>
                    <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                ))}
              </div>
              <div className="hero-actions repository-cta">
                <ExternalLink className="primary-cta" href={project.repository}>
                  <Code2 aria-hidden="true" size={16} /> Explore repository
                </ExternalLink>
                {project.demoUrl ? (
                  <ExternalLink className="secondary-cta" href={project.demoUrl}>
                    <ExternalLinkIcon aria-hidden="true" size={16} /> Open live demo
                  </ExternalLink>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {nextProject ? (
          <Link className="next-project" href={`/projects/${nextProject.slug}`}>
            <span className="technical-label">Next project / {nextProject.index}</span>
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
