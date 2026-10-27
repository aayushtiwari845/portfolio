import type { ReactNode } from "react";
import Link from "next/link";

import { SectionLink } from "@/components/layout/section-link";
import { Reveal } from "@/components/motion/reveal";
import { CompanyMark } from "@/components/ui/company-mark";
import { CopyEmail } from "@/components/ui/copy-email";
import { ExternalLink } from "@/components/ui/external-link";
import { ProjectVisual } from "@/components/work/project-visual";
import { CosmicAccent } from "@/components/visuals/cosmic-accent";
import { ORRERY_CAPTION } from "@/data/orrery";
import {
  CLOSING_WAYPOINT,
  ESTABLISHING_WAYPOINT,
  sideForWaypoint,
  waypointForTarget,
} from "@/lib/orrery/scene";
import {
  homepageContent,
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

const capabilityDomains = homepageContent.capabilities.domains;

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
  { id: "capabilities", number: "3", label: "Capabilities", note: `${capabilityDomains.length} domains` },
  { id: "background", number: "4", label: "Background", note: "Education" },
  { id: "contact", number: "5", label: "Contact", note: "Direct" },
] as const;

function DocSection({
  id,
  number,
  rail,
  title,
  lede,
  waypoint,
  side,
  children,
}: {
  id: string;
  number: string;
  rail: string;
  title: string;
  lede?: string;
  /** The camera stop this section holds, when its rows do not carry their own. */
  waypoint?: number;
  /** Which side the heading takes; rows below it alternate from there. */
  side?: "left" | "right";
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={`${id}-heading`}
      className="doc-section"
      data-orrery-waypoint={waypoint}
      id={id}
    >
      <div className="doc-rail" data-orrery-side={side}>
        <span className="doc-num">§{number}</span>
        <span className="doc-rail-label">{rail}</span>
      </div>
      <div className="doc-body">
        <Reveal side={side}>
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
    <section
      aria-labelledby="doc-title"
      className="titleblock"
      data-orrery-side="left"
      data-orrery-waypoint={ESTABLISHING_WAYPOINT}
    >
        <p className="titleblock-doctype">
          <span>Engineering portfolio</span>
          <span className="figure-value">Updated {portfolio.metadata.lastUpdated}</span>
        </p>

        <div className="titleblock-grid">
          <Reveal className="titleblock-intro">
            <p className="titleblock-name">{identity.displayName}</p>
            <h1 className="titleblock-title" id="doc-title">{identity.headline}</h1>
            <p className="titleblock-abstract">{identity.introduction}</p>
            <p className="titleblock-status">{identity.availability}</p>
            <div className="titleblock-actions">
              <Link className="link" href="#work">Explore my work</Link>
              <Link className="secondary-cta" href="/resume">Read my résumé</Link>
            </div>
          </Reveal>

          <div className="titleblock-aside">
            <CosmicAccent />
            <Reveal delay={0.06}>
            <dl className="titleblock-meta">
              <div className="meta-row">
                <dt>Based in</dt>
                <dd>{identity.location}</dd>
              </div>
              <div className="meta-row">
                <dt>Recently</dt>
                <dd>
                  {current.role}, {current.company}
                  <br />
                  <span className="figure-value">{current.period}</span>
                </dd>
              </div>
              <div className="meta-row">
                <dt>Education</dt>
                <dd>
                  {education.degree} in {education.field}
                  <br />
                  <span className="figure-value">{education.period} · CGPA {education.cgpa}</span>
                </dd>
              </div>
            </dl>
            </Reveal>
          </div>
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

        <details className="orrery-guide">
          <summary>How to read the orrery</summary>
          <p>{ORRERY_CAPTION}</p>
        </details>
    </section>
  );
}

export function ExperienceSection() {
  return (
    <DocSection
      id="experience"
      lede={homepageContent.experience.introduction}
      number="1"
      rail="Experience"
      side="left"
      title={homepageContent.experience.title}
    >
      <div className="doc-block">
        {portfolio.experiences.map((experience, index) => (
          <Reveal
            as="div"
            className="entry"
            delay={index * 0.04}
            key={experience.id}
            side={sideForWaypoint(waypointForTarget[experience.id] ?? 0)}
            waypoint={waypointForTarget[experience.id]}
          >
            <div>
              <p className="entry-when figure-value">{experience.period}</p>
              <h3 className="entry-org">
                <CompanyMark company={experience.id} />
                {experience.company}
              </h3>
              <p className="entry-role">{experience.role}</p>
            </div>
            <div>
              <p className="entry-summary">{experience.summary}</p>
              <details className="entry-details">
                <summary>{homepageContent.experience.detailsLabel}<span className="sr-only"> at {experience.company}</span></summary>
                <ul className="entry-points">
                  {experience.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <ul aria-label={`${experience.company} technologies`} className="entry-stack">
                  {experience.stack.map((technology) => <li key={technology}>{technology}</li>)}
                </ul>
              </details>
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
      lede={homepageContent.work.introduction}
      number="2"
      rail="Selected work"
      side="right"
      title={homepageContent.work.title}
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
            <Reveal
              as="div"
              className="work-entry"
              delay={index * 0.03}
              key={project.slug}
              side={sideForWaypoint(waypointForTarget[project.slug] ?? 0)}
              waypoint={waypointForTarget[project.slug]}
            >
              <article>
                <div className="work-head">
                  <span className="figure-value">§{reference}</span>
                  <span>{collaborative ? "Collaborative project" : project.domain}</span>
                </div>

                <div className="work-grid work-grid--readable">
                  <div className="work-overview">
                    <h3 className="work-title">
                      <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                    </h3>
                    <p className="work-sub">{project.subtitle}</p>
                    <p className="work-summary">{project.summary}</p>

                    <div className="work-finding">
                      <p className="work-finding-label">{evidence.label}</p>
                      <p className="work-finding-text">{evidence.statement}</p>
                    </div>

                    <ul aria-label={`${project.title} technologies`} className="work-stack">
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

                    <details className="work-details">
                      <summary>{homepageContent.work.detailsLabel}<span className="sr-only"> for {project.title}</span></summary>
                      <div className="work-details-body">
                        <figure className="figure work-figure">
                          <div className="figure-frame">
                            <ProjectVisual kind={project.visualKind} />
                          </div>
                          <figcaption className="figure-caption">
                            <b>Figure {reference}</b>
                            {project.figureCaption}
                          </figcaption>
                        </figure>
                        {alternative ? (
                          <dl className="alternative">
                            <div className="alternative-row">
                              <dt>Decision</dt>
                              <dd>{alternative.title}</dd>
                            </div>
                            <div className="alternative-row">
                              <dt>Approach</dt>
                              <dd>{alternative.choice}</dd>
                            </div>
                            <div className="alternative-row alternative-row--cost">
                              <dt>Trade-off</dt>
                              <dd>{alternative.cost}</dd>
                            </div>
                          </dl>
                        ) : null}
                      </div>
                    </details>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <div className="doc-block">
        <p className="technical-label">{homepageContent.work.moreLabel}</p>
        <div className="reflist">
          {referencedProjects.map((project, index) => (
            <Reveal
              as="div"
              delay={index * 0.03}
              key={project.slug}
              side={sideForWaypoint(waypointForTarget[project.slug] ?? 0)}
              waypoint={waypointForTarget[project.slug]}
            >
              <article className="reflist-row">
                <span className="reflist-num figure-value">§2.{featuredProjects.length + index + 1}</span>
                <h3 className="reflist-title">
                  <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                </h3>
                <div className="reflist-desc">
                  <p>{project.summary}</p>
                  <p className="reflist-boundary">{homepageProjectEvidence[project.slug].statement}</p>
                </div>
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

export function CapabilitiesSection() {
  return (
    <DocSection
      id="capabilities"
      lede={homepageContent.capabilities.introduction}
      number="3"
      rail="Capabilities"
      side="left"
      waypoint={CLOSING_WAYPOINT}
      title={homepageContent.capabilities.title}
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

      <details className="doc-block cap-details">
        <summary>{homepageContent.capabilities.detailsLabel}</summary>
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
      </details>
    </DocSection>
  );
}

export function BackgroundSection() {
  const { education } = portfolio;

  return (
    <DocSection
      id="background"
      number="4"
      rail="Background"
      side="right"
      waypoint={CLOSING_WAYPOINT}
      title={homepageContent.background.title}
    >
      <div className="doc-block">
        <Reveal className="prose">
          <p>{portfolio.about}</p>
          <p>{homepageContent.background.approach}</p>
        </Reveal>

        <Reveal className="doc-block" delay={0.05}>
          <dl className="titleblock-meta">
            <div className="meta-row">
              <dt>Institution</dt>
              <dd>{education.institution}</dd>
            </div>
            <div className="meta-row">
              <dt>Programme</dt>
              <dd>{education.degree} in {education.field}</dd>
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
