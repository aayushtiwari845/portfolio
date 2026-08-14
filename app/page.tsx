import { HeroSystemGraphic } from "@/components/hero/HeroSystemGraphic";
import {
  AboutSection,
  CapabilitiesSection,
  ContactSection,
  ExperienceSection,
  HeroSection,
  WorkSection,
} from "@/components/sections/home-sections";
import { portfolio, projects } from "@/data/portfolio";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: portfolio.identity.fullName,
  alternateName: portfolio.identity.displayName,
  url: portfolio.metadata.siteUrl,
  email: portfolio.links.email,
  homeLocation: {
    "@type": "Place",
    name: portfolio.identity.location,
  },
  sameAs: [portfolio.links.github, portfolio.links.linkedin],
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: portfolio.education.institution,
  },
  knowsAbout: [
    "Software engineering",
    "Distributed systems",
    "Data infrastructure",
    "Applied artificial intelligence",
    "Machine learning systems",
  ],
  subjectOf: projects.map((project) => ({
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.summary,
    codeRepository: project.repository,
    url: `${portfolio.metadata.siteUrl}/projects/${project.slug}`,
  })),
};

export default function Home() {
  return (
    <>
      <main className="site-main" id="main-content">
        <HeroSection visual={<HeroSystemGraphic />} />
        <div className="section-rule" aria-hidden="true" />
        <ExperienceSection />
        <div className="section-rule" aria-hidden="true" />
        <WorkSection />
        <div className="section-rule" aria-hidden="true" />
        <CapabilitiesSection />
        <div className="section-rule" aria-hidden="true" />
        <AboutSection />
        <ContactSection />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
