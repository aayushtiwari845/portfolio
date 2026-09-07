import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/reveal";
import { OrreryBackdrop } from "@/components/orrery/orrery-backdrop";
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

  // Section numbers stay contiguous when a project carries no measured evidence,
  // so a cross-reference in the copy always resolves to the section it names.
  const order = [
    "brief",
    "architecture",
    "decisions",
    "validation",
    ...(project.metrics.length > 0 ? ["evidence"] : []),
    "limits",
    "technology",
  ] as const;
  const section = (name: (typeof order)[number]) => String(order.indexOf(name) + 1);

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
      <OrreryBackdrop slug={project.slug} />
      <main className="case-shell" id="main-content">
        <div className="case-titleblock">
          <Link className="case-breadcrumb" href="/#work">
            <ArrowLeft aria-hidden="true" size={13} /> §2 Selected work
          </Link>

          <div className="titleblock-grid">
            <Reveal>
              <h1 className="case-title">{project.title}</h1>
              <p className="case-subtitle">{project.subtitle}</p>
            </Reveal>

            <Reveal delay={0.06}>
              <dl className="titleblock-meta">
                <div className="meta-row">
                  <dt>Status</dt>
                  <dd>{project.status}</dd>
                </div>
                <div className="meta-row">
                  <dt>Role</dt>
                  <dd>{project.role}</dd>
                </div>
                <div className="meta-row">
                  <dt>Domain</dt>
                  <dd>{project.domain}</dd>
                </div>
                <div className="meta-row">
                  <dt>Source</dt>
                  <dd>
                    <ExternalLink className="link" href={project.repository}>Repository</ExternalLink>
                    {project.demoUrl ? (
                      <> · <ExternalLink className="link" href={project.demoUrl}>Live demo</ExternalLink></>
                    ) : null}
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            <figure className="figure">
              <div className="figure-frame">
                <ProjectVisual kind={project.visualKind} labelled />
              </div>
              <figcaption className="figure-caption">
                <b>Figure 1</b>
                {project.figureCaption}
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <section aria-labelledby="brief-heading" className="doc-section" id="brief">
          <div className="doc-rail">
            <span className="doc-num">§{section("brief")}</span>
            <span className="doc-rail-label">Brief</span>
          </div>
          <div className="doc-body">
            <Reveal>
              <h2 className="doc-title" id="brief-heading">The problem this had to solve.</h2>
            </Reveal>
            <Reveal className="prose doc-block">
              <p>{project.problem}</p>
              {project.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </Reveal>
            {project.ownershipNote ? <p className="note">{project.ownershipNote}</p> : null}

            <div className="doc-block">
              <p className="technical-label">Constraints</p>
              <ol className="rule-list rule-list--limits">
                {project.constraints.map((constraint) => <li key={constraint}>{constraint}</li>)}
              </ol>
            </div>
          </div>
        </section>

        <section aria-labelledby="architecture-heading" className="doc-section" id="architecture">
          <div className="doc-rail">
            <span className="doc-num">§{section("architecture")}</span>
            <span className="doc-rail-label">Architecture</span>
          </div>
          <div className="doc-body">
            <Reveal>
              <h2 className="doc-title" id="architecture-heading">How the system is put together.</h2>
            </Reveal>
            <Reveal as="div" className="doc-block stage-list">
              {project.architecture.map((step) => (
                <div className="stage" key={step.id}>
                  <h3 className="stage-label">{step.label}</h3>
                  <p className="stage-detail">{step.detail ?? ""}</p>
                  <span className="stage-kind">{step.kind}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="decisions-heading" className="doc-section" id="decisions">
          <div className="doc-rail">
            <span className="doc-num">§{section("decisions")}</span>
            <span className="doc-rail-label">Decisions</span>
          </div>
          <div className="doc-body">
            <Reveal>
              <h2 className="doc-title" id="decisions-heading">What was chosen, and what it cost.</h2>
            </Reveal>
            <div className="doc-block">
              {project.decisions.map((decision, index) => (
                <Reveal as="div" className="decision" delay={index * 0.03} key={decision.title}>
                  <h3 className="decision-title">{decision.title}</h3>
                  <dl className="decision-fields">
                    <div className="decision-field">
                      <dt>Choice</dt>
                      <dd>{decision.choice}</dd>
                    </div>
                    <div className="decision-field">
                      <dt>Rationale</dt>
                      <dd>{decision.rationale}</dd>
                    </div>
                    {decision.tradeoff ? (
                      <div className="decision-field decision-field--cost">
                        <dt>Cost</dt>
                        <dd>{decision.tradeoff}</dd>
                      </div>
                    ) : null}
                  </dl>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="validation-heading" className="doc-section" id="validation">
          <div className="doc-rail">
            <span className="doc-num">§{section("validation")}</span>
            <span className="doc-rail-label">Validation</span>
          </div>
          <div className="doc-body">
            <Reveal>
              <h2 className="doc-title" id="validation-heading">How it was checked.</h2>
            </Reveal>
            <Reveal as="div" className="doc-block">
              <ul className="rule-list rule-list--limits">
                {project.validation.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </Reveal>

            {project.artifact ? (
              <Reveal as="div" className="doc-block" delay={0.05}>
                <figure className="figure">
                  <div className="figure-frame">
                    <Image
                      alt={project.artifact.alt}
                      height={900}
                      loading="lazy"
                      sizes="(max-width: 860px) calc(100vw - 40px), 880px"
                      src={project.artifact.src}
                      width={1600}
                    />
                  </div>
                  <figcaption className="figure-caption">
                    <b>Figure 2 · Repository artifact</b>
                    {project.artifact.caption}{" "}
                    <ExternalLink className="link" href={project.artifact.sourceUrl}>Inspect the source</ExternalLink>
                  </figcaption>
                </figure>
              </Reveal>
            ) : null}
          </div>
        </section>

        {project.metrics.length > 0 ? (
          <section aria-labelledby="evidence-heading" className="doc-section" id="evidence">
            <div className="doc-rail">
              <span className="doc-num">§{section("evidence")}</span>
              <span className="doc-rail-label">Evidence</span>
            </div>
            <div className="doc-body">
              <Reveal>
                <h2 className="doc-title" id="evidence-heading">What was measured.</h2>
                <p className="doc-lede">
                  Each figure states the conditions it was measured under. None of them describe
                  production traffic.
                </p>
              </Reveal>
              <Reveal as="div" className="doc-block evidence-grid">
                {project.metrics.map((metric) => (
                  <div className="evidence" key={`${metric.value}-${metric.label}`}>
                    <p className="evidence-value">{metric.value}</p>
                    <div>
                      <p className="evidence-label">{metric.label}</p>
                      {metric.detail ? <p className="evidence-detail">{metric.detail}</p> : null}
                    </div>
                  </div>
                ))}
              </Reveal>
            </div>
          </section>
        ) : null}

        <section aria-labelledby="limits-heading" className="doc-section" id="limits">
          <div className="doc-rail">
            <span className="doc-num">§{section("limits")}</span>
            <span className="doc-rail-label">Limits</span>
          </div>
          <div className="doc-body">
            <Reveal>
              <h2 className="doc-title" id="limits-heading">Where this stops being true.</h2>
            </Reveal>
            <Reveal as="div" className="doc-block">
              <ul className="rule-list rule-list--limits">
                {project.limitations.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="technology-heading" className="doc-section" id="technology">
          <div className="doc-rail">
            <span className="doc-num">§{section("technology")}</span>
            <span className="doc-rail-label">Technology</span>
          </div>
          <div className="doc-body">
            <Reveal>
              <h2 className="doc-title" id="technology-heading">What it is built with.</h2>
            </Reveal>
            <Reveal as="div" className="doc-block tech-groups">
              {groupedTechnology.map((group) => (
                <div className="tech-group" key={group.label}>
                  <h3>{group.label}</h3>
                  <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              ))}
            </Reveal>
            <div className="work-links doc-block">
              <ExternalLink href={project.repository}>Explore the repository</ExternalLink>
              {project.demoUrl ? <ExternalLink href={project.demoUrl}>Open the live demo</ExternalLink> : null}
            </div>
          </div>
        </section>

        {nextProject ? (
          <Link className="next-doc" href={`/projects/${nextProject.slug}`}>
            <span className="next-doc-label">Next document</span>
            <span className="next-doc-title">{nextProject.title}</span>
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
