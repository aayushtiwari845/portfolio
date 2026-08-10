import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { ExternalLink } from "@/components/ui/external-link";
import { portfolio, projects } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Web résumé for ${portfolio.identity.fullName}, covering software engineering, AI systems, data infrastructure, projects, and education.`,
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <main className="resume-page" id="main-content">
      <div className="page-shell">
        <Link className="case-breadcrumb resume-back" href="/">
          <ArrowLeft aria-hidden="true" size={14} /> Return to portfolio
        </Link>
        <header className="resume-header">
          <div>
            <p className="technical-label">Web résumé / Current</p>
            <h1 className="resume-title">{portfolio.identity.displayName}</h1>
            <p className="section-intro" style={{ marginTop: 22 }}>{portfolio.identity.descriptor}</p>
          </div>
          <div className="resume-contact">
            <span>{portfolio.identity.location}</span>
            <a href={portfolio.links.email}>{portfolio.identity.email}</a>
            <ExternalLink href={portfolio.links.github}>GitHub</ExternalLink>
            <ExternalLink href={portfolio.links.linkedin}>LinkedIn</ExternalLink>
          </div>
        </header>

        <section className="resume-section" aria-labelledby="resume-profile">
          <h2 id="resume-profile">Profile</h2>
          <div className="resume-entry"><p>{portfolio.about}</p></div>
        </section>

        <section className="resume-section" aria-labelledby="resume-experience">
          <h2 id="resume-experience">Experience</h2>
          <div>
            {portfolio.experiences.map((experience) => (
              <article className="resume-entry" key={experience.id}>
                <div className="resume-entry-head">
                  <h3>{experience.company} — {experience.role}</h3>
                  <span className="technical-label">{experience.period}</span>
                </div>
                <p>{experience.summary}</p>
                <ul>{experience.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section className="resume-section" aria-labelledby="resume-projects">
          <h2 id="resume-projects">Selected projects</h2>
          <div>
            {projects.map((project) => (
              <article className="resume-entry" key={project.slug}>
                <div className="resume-entry-head">
                  <h3><Link href={`/projects/${project.slug}`}>{project.title}</Link></h3>
                  <ExternalLink href={project.repository}>Repository</ExternalLink>
                </div>
                <p>{project.summary}</p>
                <p className="technical-label">{project.stack.join(" / ")}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="resume-section" aria-labelledby="resume-capabilities">
          <h2 id="resume-capabilities">Capabilities</h2>
          <div className="capability-groups" style={{ marginTop: 0 }}>
            {portfolio.capabilities.groups.map((group) => (
              <div className="capability-group" key={group.id}>
                <h3>{group.label}</h3>
                <p>{group.technologies.join(" · ")}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="resume-section" aria-labelledby="resume-education">
          <h2 id="resume-education">Education</h2>
          <article className="resume-entry">
            <div className="resume-entry-head">
              <h3>{portfolio.education.institution}</h3>
              <span className="technical-label">{portfolio.education.period}</span>
            </div>
            <p>{portfolio.education.degree} — {portfolio.education.field}</p>
            <p>CGPA {portfolio.education.cgpa} · {portfolio.education.location}</p>
          </article>
        </section>

        <div style={{ paddingTop: 44 }}>
          <Link className="secondary-cta" href="/#contact">
            Start a conversation <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </div>
    </main>
  );
}
