import { ArrowRight, ArrowUpRight, Code2, ContactRound, Mail } from "lucide-react";
import Link from "next/link";

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

const capabilityAnchors = [
  {
    key: "systems",
    index: "01",
    title: "Systems",
    description: "Typed APIs, authentication, failure handling, and operational workflows with explicit boundaries.",
    technologies: ["FastAPI", "Spring Boot", "Node.js", "PostgreSQL", "Redis"],
  },
  {
    key: "data",
    index: "02",
    title: "Data",
    description: "Batch and streaming pipelines designed around workload, lineage, replay, and measurable behavior.",
    technologies: ["Kafka", "Spark", "PySpark", "Pandas", "Warehousing"],
  },
  {
    key: "intelligence",
    index: "03",
    title: "Intelligence",
    description: "ML and LLM workflows evaluated against baselines before they are trusted inside a product.",
    technologies: ["PyTorch", "TensorFlow", "MLflow", "Spark MLlib", "LLM systems"],
  },
] as const;

const domainNames = {
  systems: "Systems",
  data: "Data",
  intelligence: "Intelligence",
  product: "Product",
} as const;

export function HeroSection({ visual }: { visual: React.ReactNode }) {
  const latestExperience = portfolio.experiences[0];

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="page-shell hero-inner">
        <div className="hero-copy">
          <p className="eyebrow hero-identity">
            {portfolio.identity.displayName} <span aria-hidden="true">·</span> Software Engineer
          </p>
          <h1 aria-label={portfolio.identity.headline} className="hero-title" id="hero-title">
            <span className="hero-title-line"><span>I build backend and data systems</span></span>{" "}
            <span className="hero-title-line"><span>that keep AI behavior inspectable.</span></span>
          </h1>
          <p className="hero-description">{portfolio.identity.introduction}</p>
          <p className="hero-disciplines">Backend platforms <span>/</span> Data infrastructure <span>/</span> Applied AI</p>
          <div className="hero-actions">
            <Link className="primary-cta" href="#work">
              View selected work <ArrowRight aria-hidden="true" size={16} />
            </Link>
            <Link className="secondary-cta" href="#experience">Experience</Link>
            <Link className="text-link" href="/resume">Résumé</Link>
          </div>
          <div className="hero-socials" aria-label="Professional profiles">
            <ExternalLink href={portfolio.links.github}><Code2 aria-hidden="true" size={14} /> GitHub</ExternalLink>
            <ExternalLink href={portfolio.links.linkedin}><ContactRound aria-hidden="true" size={14} /> LinkedIn</ExternalLink>
          </div>
        </div>

        <div className="hero-visual" aria-label="A restrained map of connected software, data, and intelligence systems" role="img">
          {visual}
        </div>

        <aside className="hero-context" aria-label="Most recent experience">
          <span className="technical-label">Most recently</span>
          <div>
            <strong>{latestExperience.role}</strong>
            <span>{latestExperience.company} · {latestExperience.period}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

export function ExperienceSection() {
  return (
    <section className="section section--experience" id="experience" aria-labelledby="experience-heading">
      <div className="page-shell">
        <Reveal className="section-heading">
          <div>
            <p className="section-kicker">01 / Experience</p>
            <h2 className="section-title" id="experience-heading">Built inside real operating constraints.</h2>
          </div>
          <p className="section-intro">
            Three roles across production software, backend product systems, and analytical infrastructure.
          </p>
        </Reveal>

        <div className="experience-list">
          {portfolio.experiences.map((experience, index) => (
            <Reveal as="div" className="experience-item" delay={index * 0.04} key={experience.id}>
              <div className="experience-index" aria-hidden="true">0{index + 1}</div>
              <div className="experience-identity">
                <p className="experience-date">{experience.period}</p>
                <h3 className="experience-company">{experience.company}</h3>
                <p className="experience-role">{experience.role}</p>
              </div>
              <div className="experience-body">
                <p className="experience-summary">{experience.summary}</p>
                <ul className="experience-proofs">
                  {experience.highlights.slice(0, index === 0 ? 3 : 2).map((highlight) => (
                    <li className="experience-proof" key={highlight}>{highlight}</li>
                  ))}
                </ul>
                {experience.note ? <p className="experience-note">{experience.note}</p> : null}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WorkSection() {
  const featuredProjects = homepageProjects.slice(0, 3);
  const supportingProjects = homepageProjects.slice(3);

  return (
    <section className="section" id="work" aria-labelledby="work-heading">
      <div className="page-shell">
        <Reveal className="section-heading">
          <div>
            <p className="section-kicker">02 / Selected work</p>
            <h2 className="section-title" id="work-heading">Systems with the evidence left in.</h2>
          </div>
          <p className="section-intro">
            Design choices, evaluation results, and limitations stay visible instead of being reduced to demo claims.
          </p>
        </Reveal>

        <div className="featured-projects">
          {featuredProjects.map((project, index) => {
            const collaborative = project.slug === "real-time-fraud-detection";
            const evidence = homepageProjectEvidence[project.slug];
            return (
              <Reveal
                as="div"
                className={`project-feature project-feature--${project.visualKind}`}
                delay={index * 0.04}
                key={project.slug}
              >
                <article>
                  <div className="project-feature-head">
                    <span className="project-index">FEATURED / {String(index + 1).padStart(2, "0")}</span>
                    <span className="project-domain">{collaborative ? "Collaborative project" : project.domain}</span>
                  </div>
                  <div className="project-feature-grid">
                    <div className="project-visual-shell">
                      <ProjectVisual kind={project.visualKind} />
                    </div>
                    <div className="project-card-copy">
                      <p className="project-subtitle">{project.subtitle}</p>
                      <h3 className="project-title">
                        <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                      </h3>
                      <p className="project-summary">{project.summary}</p>
                      <div className="project-meta" aria-label={`${project.title} technologies`} role="list">
                        {project.stack.slice(0, 4).map((technology) => (
                          <span className="tech-chip" key={technology} role="listitem">{technology}</span>
                        ))}
                      </div>
                      <div className="project-card-footer">
                        <div className="project-evidence">
                          <span className="project-evidence-label">{evidence.label}</span>
                          <strong className="project-evidence-copy">{evidence.statement}</strong>
                        </div>
                        <div className="project-card-actions">
                          <Link className="project-arrow" href={`/projects/${project.slug}`}>
                            Case study <ArrowUpRight aria-hidden="true" size={16} />
                          </Link>
                          <ExternalLink className="project-arrow project-source-link" href={project.repository}>
                            Source
                          </ExternalLink>
                          {"demoUrl" in project && project.demoUrl ? (
                            <ExternalLink className="project-arrow project-demo-link" href={project.demoUrl}>
                              Live demo
                            </ExternalLink>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <div className="supporting-work">
          <div className="supporting-work-label">
            <span className="technical-label">More work</span>
            <p>Additional systems with focused scopes and complete project pages.</p>
          </div>
          <div className="supporting-work-list">
            {supportingProjects.map((project, index) => (
              <Reveal as="div" delay={index * 0.04} key={project.slug}>
                <article className="supporting-project">
                  <div>
                    <span className="project-index">PROJECT / {project.index}</span>
                    <h3><Link href={`/projects/${project.slug}`}>{project.title}</Link></h3>
                    <p>{project.summary}</p>
                    <span className="supporting-project-status">{project.status}</span>
                  </div>
                  <div className="supporting-project-meta">
                    <span>{project.domain}</span>
                    <div className="supporting-project-actions">
                      <Link className="project-arrow" href={`/projects/${project.slug}`}>
                        Case study <ArrowUpRight aria-hidden="true" size={15} />
                      </Link>
                      <ExternalLink className="project-arrow project-source-link" href={project.repository}>
                        Source
                      </ExternalLink>
                      {"demoUrl" in project && project.demoUrl ? (
                        <ExternalLink className="project-arrow project-demo-link" href={project.demoUrl}>
                          Live demo
                        </ExternalLink>
                      ) : null}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CapabilitiesSection() {
  return (
    <section className="section" id="capabilities" aria-labelledby="capabilities-heading">
      <div className="page-shell">
        <Reveal className="section-heading">
          <div>
            <p className="section-kicker">03 / Capabilities</p>
            <h2 className="section-title" id="capabilities-heading">Systems, data, and models—with clear boundaries.</h2>
          </div>
          <p className="section-intro">
            I work across the seams: APIs expose workflows, data preserves evidence, and models are tested against explicit baselines.
          </p>
        </Reveal>

        <Reveal className="capability-map">
          <div className="capability-anchors">
            {capabilityAnchors.map((anchor) => (
              <article className="capability-column" data-domain={anchor.key} key={anchor.title}>
                <span className="capability-index">{anchor.index}</span>
                <h3 className="capability-title">{anchor.title}</h3>
                <p className="capability-description">{anchor.description}</p>
                <div className="capability-tech">
                  {anchor.technologies.map((technology) => <span key={technology}>{technology}</span>)}
                </div>
              </article>
            ))}
          </div>
          <div className="capability-relationships" aria-label="Relationships between capability domains">
            {portfolio.capabilities.relationships.map((relationship) => (
              <div className="capability-relationship" key={`${relationship.technology}-${relationship.to}`}>
                <span>{domainNames[relationship.from]}</span>
                <strong>{relationship.technology}</strong>
                <span>{domainNames[relationship.to]}</span>
                <p>{relationship.rationale}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section className="section" id="about" aria-labelledby="about-heading">
      <div className="page-shell">
        <Reveal className="section-heading section-heading--compact">
          <div>
            <p className="section-kicker">04 / About</p>
            <h2 className="section-title" id="about-heading">The model is only one part of the system.</h2>
          </div>
        </Reveal>
        <div className="about-grid">
          <Reveal>
            <p className="about-statement">{portfolio.about}</p>
            <p className="about-copy">
              My work spans backend services, data infrastructure, and applied AI—not as isolated demos, but as systems that can be tested, reviewed, and understood.
            </p>
          </Reveal>
          <Reveal className="education-card" delay={0.06}>
            <p className="technical-label">Education / In progress</p>
            <h3>{portfolio.education.institution}</h3>
            <p>{portfolio.education.degree} — {portfolio.education.field}</p>
            <p>{portfolio.education.location}</p>
            <div className="education-meta">
              <div><span className="technical-label">Period</span><strong>{portfolio.education.period}</strong></div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section className="section section--contact" id="contact" aria-labelledby="contact-heading">
      <div className="page-shell">
        <Reveal className="contact-panel">
          <div className="contact-inner">
            <p className="section-kicker">05 / Contact</p>
            <h2 className="contact-title" id="contact-heading">{portfolio.contact.heading}</h2>
            <p className="contact-copy">{portfolio.contact.copy}</p>
            <div className="contact-actions">
              <a className="email-link" href={portfolio.links.email}>
                <Mail aria-hidden="true" size={17} /> {portfolio.identity.email}
              </a>
              <CopyEmail email={portfolio.identity.email} />
            </div>
            <div className="hero-socials contact-socials">
              <ExternalLink href={portfolio.links.github}><Code2 aria-hidden="true" size={14} /> GitHub</ExternalLink>
              <ExternalLink href={portfolio.links.linkedin}><ContactRound aria-hidden="true" size={14} /> LinkedIn</ExternalLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
