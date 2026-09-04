import type { ReactNode } from "react";
import Link from "next/link";

import { SectionLink } from "@/components/layout/section-link";
import { Reveal } from "@/components/motion/reveal";
import { CopyEmail } from "@/components/ui/copy-email";
import { ExternalLink } from "@/components/ui/external-link";
import { ProjectVisual } from "@/components/work/project-visual";
import {
  homepageProjectEvidence,
  homepageProjectSlugs,
  portfolio,
  projects,
  type ProjectSlug,
} from "@/data/portfolio";

function getHomepageProject(slug: ProjectSlug) {
  const project = projects.find((candidate) => candidate.slug === slug);

  if (!project) {
    throw new Error(`Missing homepage project: ${slug}`);
  }

  return project;
}

const homepageProjects = homepageProjectSlugs.map(getHomepageProject);
const featuredProjects = homepageProjects.slice(0, 3);
const referencedProjects = homepageProjects.slice(3);

const capabilityDomains = [
  {
    key: "systems",
    title: "Systems",
    description:
      "Typed APIs, authentication, failure handling, and operational workflows with explicit boundaries.",
    technologies: ["FastAPI", "Spring Boot", "Node.js", "PostgreSQL", "Redis"],
  },
  {
    key: "data",
    title: "Data",
    description:
      "Batch and streaming pipelines designed around workload, lineage, replay, and measurable behavior.",
    technologies: ["Kafka", "Spark", "PySpark", "Pandas", "Warehousing"],
  },
  {
    key: "intelligence",
    title: "Intelligence",
    description:
      "ML and LLM workflows evaluated against baselines before they are trusted inside a product.",
    technologies: ["PyTorch", "TensorFlow", "MLflow", "Spark MLlib", "LLM systems"],
  },
] as const;

/**
 * Resolve a non-goal reference id to the section it points at. Project slugs
 * take their §2.n position from the homepage running order, so the numbering a
 * reader sees in §2 is the numbering a cross-reference names.
 */
function resolveReference(id: string) {
  const projectIndex = homepageProjectSlugs.indexOf(id as ProjectSlug);

  if (projectIndex >= 0) {
    const project = homepageProjects[projectIndex];
    return {
      label: `§2.${projectIndex + 1}`,
      title: project.title,
      href: `/projects/${project.slug}`,
    };
  }

  const section = documentSections.find((entry) => entry.id === id);
  return section
    ? { label: `§${section.number}`, title: section.label, href: `#${section.id}` }
    : null;
}

const domainNames = {
  systems: "Systems",
  data: "Data",
  intelligence: "Intelligence",
  product: "Product",
} as const;

/** The document's numbered outline. It is also the primary navigation. */
export const documentSections = [
  { id: "experience", number: "1", label: "Experience", note: `${portfolio.experiences.length} roles` },
  { id: "work", number: "2", label: "Selected work", note: `${projects.length} systems` },
  { id: "non-goals", number: "3", label: "Non-goals", note: `${portfolio.nonGoals.length} boundaries` },
  { id: "capabilities", number: "4", label: "Capabilities", note: `${capabilityDomains.length} domains` },
  { id: "background", number: "5", label: "Background", note: "Education" },
  { id: "contact", number: "6", label: "Contact", note: "Direct" },
] as const;

function DocSection({
  id,
  number,
  rail,
  title,
  lede,
  children,
}: {
  id: string;
  number: string;
  rail: string;
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-heading`} className="doc-section" id={id}>
      <div className="doc-rail">
        <span className="doc-num">§{number}</span>
        <span className="doc-rail-label">{rail}</span>
      </div>
      <div className="doc-body">
        <Reveal>
          <h2 className="doc-title" id={`${id}-heading`}>{title}</h2>
          {lede ? <p className="doc-lede">{lede}</p> : null}
        </Reveal>
        {children}
      </div>
    </section>
  );
}

export function TitleBlock() {
  const current = portfolio.experiences[0];
  const { education, identity } = portfolio;

  return (
    <section aria-labelledby="doc-title" className="titleblock">
        <p className="titleblock-doctype">
          <span>Engineering portfolio</span>
          <span className="figure-value">Updated {portfolio.metadata.lastUpdated}</span>
        </p>

        <div className="titleblock-grid">
          <Reveal>
            <h1 className="titleblock-title" id="doc-title">{identity.headline}</h1>
            <p className="titleblock-abstract">{identity.introduction}</p>
            <div className="titleblock-actions">
              <Link className="link" href="#work">Read the selected work</Link>
              <Link className="secondary-cta" href="/resume">Résumé</Link>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <dl className="titleblock-meta">
              <div className="meta-row meta-row--status">
                <dt>Status</dt>
                <dd>{identity.availability}</dd>
              </div>
              <div className="meta-row">
                <dt>Author</dt>
                <dd>{identity.fullName}</dd>
              </div>
              <div className="meta-row">
                <dt>Discipline</dt>
                <dd>{identity.descriptor}</dd>
              </div>
              <div className="meta-row">
                <dt>Location</dt>
                <dd>{identity.location} <span className="figure-value">· {identity.timezone}</span></dd>
              </div>
              <div className="meta-row">
                <dt>Education</dt>
                <dd>
                  {education.degree}, {education.field} — {education.institution}
                  <br />
                  <span className="figure-value">{education.period} · CGPA {education.cgpa}</span>
                </dd>
              </div>
              <div className="meta-row">
                <dt>Most recent</dt>
                <dd>
                  {current.role}, {current.company}
                  <br />
                  <span className="figure-value">{current.period}</span>
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <nav aria-label="Document contents" className="contents">
            {documentSections.map((section) => (
              <SectionLink className="contents-row" href={`#${section.id}`} key={section.id}>
                <span className="contents-num">§{section.number}</span>
                <span className="contents-label">{section.label}</span>
                <span className="contents-note">{section.note}</span>
              </SectionLink>
            ))}
          </nav>
        </Reveal>
    </section>
  );
}

export function ExperienceSection() {
  return (
    <DocSection
      id="experience"
      lede="Three roles across production software, backend product systems, and analytical infrastructure. Scope notes state what each engagement did and did not cover."
      number="1"
      rail="Experience"
      title="Built inside real operating constraints."
    >
      <div className="doc-block">
        {portfolio.experiences.map((experience, index) => (
          <Reveal as="div" className="entry" delay={index * 0.04} key={experience.id}>
            <div>
              <p className="entry-when figure-value">{experience.period}</p>
              <h3 className="entry-org">{experience.company}</h3>
              <p className="entry-role">{experience.role}</p>
            </div>
            <div>
              <p className="entry-summary">{experience.summary}</p>
              <ol className="entry-points">
                {experience.highlights.slice(0, index === 0 ? 3 : 2).map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ol>
              <ul className="entry-stack">
                {experience.stack.map((technology) => <li key={technology}>{technology}</li>)}
              </ul>
              {experience.note ? <p className="note">{experience.note}</p> : null}
            </div>
          </Reveal>
        ))}
      </div>
    </DocSection>
  );
}

export function WorkSection() {
  return (
    <DocSection
      id="work"
      lede="Each system is written up as its own document: the brief, the architecture, the decisions with their costs, what was measured, and where the result stops being true."
      number="2"
      rail="Selected work"
      title="Systems with the evidence left in."
    >
      <div className="doc-block">
        {featuredProjects.map((project, index) => {
          const evidence = homepageProjectEvidence[project.slug];
          // The decision that carries an explicit cost: the design doc's
          // "Alternatives Considered", stood next to the result it produced.
          // Not every decision records a trade-off, so normalise the shape.
          const alternative = project.decisions
            .map((decision) => ({
              title: decision.title,
              choice: decision.choice,
              cost: "tradeoff" in decision ? decision.tradeoff : undefined,
            }))
            .find((decision) => Boolean(decision.cost));
          const collaborative = project.slug === "real-time-fraud-detection";
          const reference = `2.${index + 1}`;

          return (
            <Reveal as="div" className="work-entry" delay={index * 0.03} key={project.slug}>
              <article>
                <div className="work-head">
                  <span className="figure-value">§{reference}</span>
                  <span>{collaborative ? "Collaborative project" : project.domain}</span>
                </div>

                <div className={`work-grid${index % 2 === 1 ? " work-grid--flip" : ""}`}>
                  <figure className="figure work-figure">
                    <div className="figure-frame">
                      <ProjectVisual kind={project.visualKind} />
                    </div>
                    <figcaption className="figure-caption">
                      <b>Figure {reference}</b>
                      {project.figureCaption}
                    </figcaption>
                  </figure>

                  <div>
                    <h3 className="work-title">
                      <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                    </h3>
                    <p className="work-sub">{project.subtitle}</p>
                    <p className="work-summary">{project.summary}</p>

                    <div className="work-finding">
                      <p className="work-finding-label">{evidence.label}</p>
                      <p className="work-finding-text">{evidence.statement}</p>
                    </div>

                    {alternative ? (
                      <dl className="alternative">
                        <div className="alternative-row">
                          <dt>Alternative considered</dt>
                          <dd>{alternative.title}</dd>
                        </div>
                        <div className="alternative-row">
                          <dt>Chosen</dt>
                          <dd>{alternative.choice}</dd>
                        </div>
                        <div className="alternative-row alternative-row--cost">
                          <dt>Cost</dt>
                          <dd>{alternative.cost}</dd>
                        </div>
                      </dl>
                    ) : null}

                    <ul className="work-stack">
                      {project.stack.slice(0, 5).map((technology) => (
                        <li key={technology}>{technology}</li>
                      ))}
                    </ul>

                    <div className="work-links">
                      <Link href={`/projects/${project.slug}`}>Read the case study</Link>
                      <ExternalLink href={project.repository}>Source</ExternalLink>
                      {"demoUrl" in project && project.demoUrl ? (
                        <ExternalLink href={project.demoUrl}>Live demo</ExternalLink>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <div className="doc-block">
        <p className="technical-label">Also documented</p>
        <div className="reflist">
          {referencedProjects.map((project, index) => (
            <Reveal as="div" delay={index * 0.03} key={project.slug}>
              <article className="reflist-row">
                <span className="reflist-num figure-value">§2.{featuredProjects.length + index + 1}</span>
                <h3 className="reflist-title">
                  <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                </h3>
                <p className="reflist-desc">{project.summary}</p>
                <div className="reflist-links">
                  <Link href={`/projects/${project.slug}`}>Case study</Link>
                  <ExternalLink href={project.repository}>Source</ExternalLink>
                  {"demoUrl" in project && project.demoUrl ? (
                    <ExternalLink href={project.demoUrl}>Demo</ExternalLink>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </DocSection>
  );
}

export function NonGoalsSection() {
  return (
    <DocSection
      id="non-goals"
      lede="A design doc says what it is not for. These boundaries hold everywhere on this site, including in the structured data search engines read."
      number="3"
      rail="Non-goals"
      title="What this work does not claim."
    >
      <div className="doc-block nongoals">
        {portfolio.nonGoals.map((nonGoal, index) => {
          const references = nonGoal.refs
            .map(resolveReference)
            .filter((reference): reference is NonNullable<typeof reference> => reference !== null);

          return (
            <Reveal as="div" className="nongoal" delay={index * 0.03} key={nonGoal.title}>
              <p className="nongoal-refs">
                {references.map((reference) => (
                  <SectionLink href={reference.href} key={reference.href}>
                    {reference.label}
                    <span className="sr-only"> — {reference.title}</span>
                  </SectionLink>
                ))}
              </p>
              <p><strong>Not {nonGoal.title.toLowerCase()}.</strong> {nonGoal.detail}</p>
            </Reveal>
          );
        })}
      </div>
    </DocSection>
  );
}

export function CapabilitiesSection() {
  return (
    <DocSection
      id="capabilities"
      lede="I work across the seams: APIs expose workflows, data preserves evidence, and models are tested against explicit baselines before anything depends on them."
      number="4"
      rail="Capabilities"
      title="Systems, data, and models with stated boundaries."
    >
      <div className="doc-block cap-table">
        {capabilityDomains.map((domain, index) => (
          <Reveal as="div" className="cap-row" delay={index * 0.03} key={domain.key}>
            <h3 className="cap-domain">{domain.title}</h3>
            <p className="cap-desc">{domain.description}</p>
            <ul className="cap-tech">
              {domain.technologies.map((technology) => <li key={technology}>{technology}</li>)}
            </ul>
          </Reveal>
        ))}
      </div>

      <div className="doc-block">
        <p className="technical-label">Where the domains meet</p>
        <div className="seam-list">
          {portfolio.capabilities.relationships.map((relationship) => (
            <Reveal
              as="div"
              className="seam"
              key={`${relationship.technology}-${relationship.to}`}
            >
              <p className="seam-path">
                <span>{domainNames[relationship.from]}</span>
                <span aria-hidden="true">→</span>
                <strong>{relationship.technology}</strong>
                <span aria-hidden="true">→</span>
                <span>{domainNames[relationship.to]}</span>
              </p>
              <p className="seam-rationale">{relationship.rationale}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </DocSection>
  );
}

export function BackgroundSection() {
  const { education } = portfolio;

  return (
    <DocSection
      id="background"
      number="5"
      rail="Background"
      title="The model is only one part of the system."
    >
      <div className="doc-block">
        <Reveal className="prose">
          <p>{portfolio.about}</p>
          <p>
            My work spans backend services, data infrastructure, and applied AI — not as isolated
            demos, but as systems that can be tested, reviewed, and understood by someone who did
            not build them.
          </p>
        </Reveal>

        <Reveal className="doc-block" delay={0.05}>
          <dl className="titleblock-meta">
            <div className="meta-row">
              <dt>Institution</dt>
              <dd>{education.institution}</dd>
            </div>
            <div className="meta-row">
              <dt>Programme</dt>
              <dd>{education.degree} — {education.field}</dd>
            </div>
            <div className="meta-row">
              <dt>Period</dt>
              <dd className="figure-value">{education.period} · In progress</dd>
            </div>
            <div className="meta-row">
              <dt>CGPA</dt>
              <dd className="figure-value">{education.cgpa}</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </DocSection>
  );
}

export function ContactSection() {
  return (
    <section aria-labelledby="contact-heading" className="close-field" id="contact">
      <div className="page-shell close-inner">
        <div>
          <h2 className="close-title" id="contact-heading">{portfolio.contact.heading}</h2>
          <p className="close-copy">{portfolio.contact.copy}</p>
        </div>
        <div className="close-actions">
          <a className="close-email" href={portfolio.links.email}>{portfolio.identity.email}</a>
          <div className="close-secondary">
            <CopyEmail email={portfolio.identity.email} />
            <ExternalLink href={portfolio.links.github}>GitHub</ExternalLink>
            <ExternalLink href={portfolio.links.linkedin}>LinkedIn</ExternalLink>
          </div>
        </div>
      </div>
    </section>
  );
}
