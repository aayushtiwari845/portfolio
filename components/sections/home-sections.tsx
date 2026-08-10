import { ArrowRight, ArrowUpRight, Code2, ContactRound, Mail } from "lucide-react";
import Link from "next/link";

import { AnimatedNumber } from "@/components/motion/animated-number";
import { Reveal } from "@/components/motion/reveal";
import { CopyEmail } from "@/components/ui/copy-email";
import { ExternalLink } from "@/components/ui/external-link";
import { ProjectVisual } from "@/components/work/project-visual";
import { portfolio, projects } from "@/data/portfolio";

const metricParts: Record<string, { value: number; decimals?: number; suffix?: string }> = {
  "80M+": { value: 80, suffix: "M+" },
  "3,285/s": { value: 3285, suffix: "/s" },
  "26.53 ms": { value: 26.53, decimals: 2, suffix: " ms" },
  "9.71": { value: 9.71, decimals: 2 },
};

const capabilityAnchors = [
  {
    index: "A / 01",
    title: "Systems",
    description: "Backends, APIs, distributed workflows, and the infrastructure that keeps them observable and reliable.",
    technologies: ["FastAPI", "Spring Boot", "Node.js", "PostgreSQL", "Redis", "Docker", "Kubernetes"],
  },
  {
    index: "A / 02",
    title: "Data",
    description: "Streaming, transformation, analytical models, and storage designed around the shape of the workload.",
    technologies: ["Kafka", "Apache Spark", "PySpark", "Pandas", "NumPy", "Data Warehousing", "ETL"],
  },
  {
    index: "A / 03",
    title: "Intelligence",
    description: "Applied ML and LLM systems whose behavior can be evaluated, traced, and integrated into products.",
    technologies: ["PyTorch", "TensorFlow", "LangChain", "MLflow", "Spark MLlib", "LLM systems"],
  },
] as const;

export function HeroSection({ visual }: { visual: React.ReactNode }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="page-shell hero-inner">
        <div className="hero-copy">
          <div>
            <p className="eyebrow hero-identity">
              {portfolio.identity.displayName} / {portfolio.identity.descriptor}
            </p>
          </div>
          <div>
            <h1 className="hero-title" id="hero-title">
              I build intelligent systems that <span className="signal-word">hold up</span> under real workloads.
            </h1>
          </div>
          <div>
            <p className="hero-description">{portfolio.identity.introduction}</p>
            <div className="hero-actions">
              <Link className="primary-cta" href="#work">
                Explore selected work <ArrowRight aria-hidden="true" size={16} />
              </Link>
              <Link className="secondary-cta" href="/resume">View résumé</Link>
            </div>
            <div className="hero-socials">
              <ExternalLink href={portfolio.links.github}><Code2 aria-hidden="true" size={13} /> GitHub</ExternalLink>
              <ExternalLink href={portfolio.links.linkedin}><ContactRound aria-hidden="true" size={13} /> LinkedIn</ExternalLink>
            </div>
          </div>
        </div>

        <div className="hero-visual" aria-label="A living software-system topology" role="img">
          {visual}
        </div>

        <div className="hero-proof" aria-label="Selected proof points" role="list">
          {portfolio.heroMetrics.map((metric) => {
            const parts = metricParts[metric.value];
            return (
              <div className="metric-cell" key={metric.value} role="listitem" title={metric.detail}>
                <p className="metric-value">
                  {parts ? (
                    <AnimatedNumber
                      decimals={parts.decimals}
                      suffix={parts.suffix}
                      value={parts.value}
                    />
                  ) : metric.value}
                </p>
                <p className="metric-context">{metric.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function WorkSection() {
  return (
    <section className="section" id="work" aria-labelledby="work-heading">
      <div className="page-shell">
        <Reveal className="section-heading">
          <div>
            <p className="section-kicker">01 / Selected systems</p>
            <h2 className="section-title" id="work-heading">Systems with evidence, not just interfaces.</h2>
          </div>
          <p className="section-intro">
            Five projects spanning multi-agent decisions, incident investigation, streaming inference, civic infrastructure, and applied analytics.
          </p>
        </Reveal>

        <div className="project-grid">
          {projects.map((project, index) => (
            <Reveal as="div" className="project-card" delay={Math.min(index * 0.035, 0.14)} key={project.slug}>
              <div className="project-card-header">
                <span className="project-index">SYS / {project.index}</span>
                <span className="project-domain">{project.domain}</span>
              </div>
              <div className="project-visual-shell">
                <ProjectVisual kind={project.visualKind} />
              </div>
              <div className="project-card-copy">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-subtitle">{project.subtitle}</p>
                <div className="project-meta" aria-label={`${project.title} technologies`} role="list">
                  {project.stack.slice(0, 5).map((technology) => (
                    <span className="tech-chip" key={technology} role="listitem">{technology}</span>
                  ))}
                </div>
                <div className="project-card-footer">
                  <span className="project-metric">
                    {project.metrics[0]?.value} / {project.metrics[0]?.label}
                  </span>
                  <Link className="project-arrow" href={`/projects/${project.slug}`}>
                    Explore system <ArrowUpRight aria-hidden="true" size={16} />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ExperienceSection() {
  return (
    <section className="section" id="experience" aria-labelledby="experience-heading">
      <div className="page-shell">
        <Reveal className="section-heading">
          <div>
            <p className="section-kicker">02 / Experience</p>
            <h2 className="section-title" id="experience-heading">Increasing scope. Production constraints.</h2>
          </div>
          <p className="section-intro">
            A progression from analytical infrastructure to backend product systems and high-volume operational workflows.
          </p>
        </Reveal>

        <div className="experience-layout">
          <aside className="timeline-years" aria-hidden="true">
            <span>2024 / DATA</span>
            <span>2025 / BACKEND</span>
            <span>2026 / SYSTEMS</span>
          </aside>
          <div className="experience-list">
            {[...portfolio.experiences].reverse().map((experience, index) => (
              <Reveal className="experience-item" delay={index * 0.05} key={experience.id}>
                <div className="experience-date">{experience.period}</div>
                <div>
                  <h3 className="experience-company">{experience.company}</h3>
                  <p className="experience-role">{experience.role}</p>
                  <p className="experience-summary">{experience.summary}</p>
                  <div className="experience-proofs">
                    {experience.highlights.slice(0, 3).map((highlight) => (
                      <span className="experience-proof" key={highlight}>{highlight}</span>
                    ))}
                  </div>
                </div>
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
            <h2 className="section-title" id="capabilities-heading">Connected domains, not a logo cloud.</h2>
          </div>
          <p className="section-intro">
            The useful work happens at the boundaries: services carrying data, data becoming evidence, and models behaving inside real products.
          </p>
        </Reveal>

        <Reveal className="capability-map">
          {capabilityAnchors.map((anchor) => (
            <article className="capability-column" key={anchor.title}>
              <span className="capability-index">{anchor.index}</span>
              <h3 className="capability-title">{anchor.title}</h3>
              <p className="capability-description">{anchor.description}</p>
              <div className="capability-tech">
                {anchor.technologies.map((technology) => <span key={technology}>{technology}</span>)}
              </div>
            </article>
          ))}
        </Reveal>

        <div className="capability-groups">
          {portfolio.capabilities.groups.map((group, index) => (
            <Reveal className="capability-group" delay={index * 0.025} key={group.id}>
              <h3>{group.label}</h3>
              <p>{group.technologies.join(" · ")}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section className="section" id="about" aria-labelledby="about-heading">
      <div className="page-shell">
        <Reveal className="section-heading">
          <div>
            <p className="section-kicker">04 / About</p>
            <h2 className="section-title" id="about-heading">Engineering across the seams.</h2>
          </div>
        </Reveal>
        <div className="about-grid">
          <Reveal>
            <p className="about-statement">
              I work where <em>models</em>, APIs, streaming data, and production constraints have to work together—not exist as isolated demos.
            </p>
          </Reveal>
          <Reveal className="education-card" delay={0.08}>
            <p className="technical-label">EDU / ACTIVE</p>
            <h3>{portfolio.education.institution}</h3>
            <p>{portfolio.education.degree} — {portfolio.education.field}</p>
            <p>{portfolio.education.location}</p>
            <div className="education-meta">
              <div><span className="technical-label">Period</span><strong>{portfolio.education.period.replace("Aug ", "").replace("Jul ", "")}</strong></div>
              <div><span className="technical-label">CGPA</span><strong>{portfolio.education.cgpa}</strong></div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section className="section" id="contact" aria-labelledby="contact-heading">
      <div className="page-shell">
        <Reveal className="contact-panel">
          <div className="contact-inner">
            <p className="section-kicker" style={{ justifyContent: "center" }}>05 / Contact</p>
            <h2 className="contact-title" id="contact-heading">{portfolio.contact.heading}</h2>
            <p className="contact-copy">{portfolio.contact.copy}</p>
            <div className="contact-actions">
              <a className="email-link" href={portfolio.links.email}>
                <Mail aria-hidden="true" size={17} /> {portfolio.identity.email}
              </a>
              <CopyEmail email={portfolio.identity.email} />
            </div>
            <div className="hero-socials" style={{ justifyContent: "center" }}>
              <ExternalLink href={portfolio.links.github}><Code2 aria-hidden="true" size={13} /> GitHub</ExternalLink>
              <ExternalLink href={portfolio.links.linkedin}><ContactRound aria-hidden="true" size={13} /> LinkedIn</ExternalLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
