# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary — engineering hiring managers and senior engineers, deep-reading.** They arrive from a résumé, referral, LinkedIn, or GitHub and are deciding whether this person exercises real engineering judgment. They will open a case study and read it. They are looking for evidence of reasoning under constraint, not a list of technologies.

**Secondary — recruiters and non-technical screeners, scanning in under a minute.** They need role, stack, companies, education, and availability without scrolling or interpretation.

Both audiences share one page. The first screen must be fully legible to the recruiter; everything below it must reward the engineer who keeps scrolling. Depth is never the price of legibility, and legibility is never the price of depth.

## Product Purpose

A standing professional credential for Aayush Kumar Tiwari, a backend / data-infrastructure / applied-AI engineer graduating July 2027.

Two outcomes, in order:

1. Convert qualified readers into conversations about 2027 new-grad software engineering roles.
2. Hold durable credibility between those conversations — a stable, accurate public record that stays true as the work grows.

Success is a hiring conversation that starts from the work, not from a screening question the site should have already answered.

## Positioning

Most engineering portfolios present outcomes. This one presents **the boundary of what the evidence supports** — and does it even when the evidence is unflattering.

The differentiating mechanism is that every project ships with the baseline it was measured against, the trade-off that was accepted, and the limitation that remains true. Concretely, and verifiably:

- TracePilot's deterministic baseline beat the learned ranker, so the model was held back from promotion.
- Conclave's persisted study found a directional but *not statistically significant* advantage over a simple baseline.
- The fraud pipeline's compact three-feature model retained most AUC-ROC but produced materially more false positives.

A neighboring portfolio cannot truthfully copy this, because copying it means publishing your own negative results. The claim is not "I build AI systems." It is "I build systems where a model is one component, and I can show you exactly where its authority ends."

## Operating Context

- Almost always reached as the *second* artifact, after a résumé or a profile. The visitor arrives with a partial impression and is looking to confirm or discard it.
- Read on a laptop during a screening pass, and on a phone between other tasks. Neither is the secondary case.
- Often skimmed with other tabs open, sometimes on institutional networks and locked-down browsers.
- The `/resume` route is a web-readable résumé generated from the same data source; a PDF download is expected by recruiters as a takeaway.
- Evaluation is comparative. The visitor has seen many portfolios in the same session, and most of them look the same.

## Capabilities and Constraints

**Confirmed functionality:** homepage with experience, selected work, capabilities, about, contact; five case-study routes at `/projects/[slug]`; a web résumé at `/resume`; generated Open Graph images per project; sitemap and robots; dark and light themes with a pre-paint script; command palette; copy-to-clipboard email; local Mumbai clock.

**Technical constraints that must survive any redesign:**

- Static-first Next.js 16 App Router, React 19, strict TypeScript. No CMS, no database, no API server, no runtime environment variables.
- All content lives in `data/portfolio.ts` as a typed, single source of truth. Routes, metadata, sitemap, and OG images derive from it. Content is never duplicated into JSX.
- Tailwind CSS v4 with a custom semantic design-token layer. Motion is CSS-native; no general-purpose animation runtime ships.
- Server Components by default; Client Components only for genuine browser state (theme, palette, clipboard, clock, mobile nav).
- CI gates on `pnpm lint` (zero warnings), `pnpm typecheck`, `pnpm test`, `pnpm build`. All four must pass.
- Deployed on Vercel. Canonical origin `https://aayushktiwari.tech`; `www` redirects to apex. `portfolio.metadata.siteUrl` and `portfolio.links.website` stay aligned to it.
- Node 22, pnpm 11.16.0.

**Terminology:** "evidence", "baseline", "boundary", "trade-off", and "limitation" are load-bearing product vocabulary, not decoration. They describe what the site is actually organized around.

**Undecided:** whether the résumé PDF is committed to the repository or hosted elsewhere. The file exists but is not yet in `public/resume/`.

## Brand Commitments

- Name: Aayush Tiwari (full: Aayush Kumar Tiwari). Location: Mumbai, India (Asia/Kolkata).
- Voice: precise, plain, unhurried. States what was built, what it was measured against, and where it stops. No hype, no superlatives, no growth-marketing register, no exclamation marks.
- **Hard evidence boundaries that public copy and structured data must never cross:**
  - Barclays copy stays at résumé-level scope and never implies Barclays endorsement.
  - CivicLens is a credentialed Supabase-to-Storacha/IPFS archival utility plus a deployed static archive dashboard. It is **not** a municipal issue-submission or case-management platform.
  - The real-time fraud pipeline is an academic collaboration with Aditya Ravi and Atharva Indulkar. Throughput and latency come from a **simulated local streaming benchmark**, not a deployed payment system. The public repository is owned by Aditya Ravi.
  - The B.Tech is in progress through July 2027. Structured data uses a *current* educational affiliation, never `alumniOf`.
- The site does not claim traffic, users, uptime, awards, or performance figures it cannot source.

## Evidence on Hand

**Real and usable:**

- Three committed product screenshots: `public/project-artifacts/conclave-dashboard.png`, `fraud-streaming-latency.png`, `ipo-analysis-overview.png`.
- Five public repositories, one per project.
- One live deployment: CivicLens at `https://civic-issues-dashboard.vercel.app`.
- Measured project metrics, decisions, and stated limitations already captured in `data/portfolio.ts`.
- Three real roles with dated periods: Barclays (Jun–Aug 2026), Makeflow India (Sep–Nov 2025), Segmentriq Analytics (Dec 2024–Jan 2025).
- Education: K.J. Somaiya School of Engineering, B.Tech AI & Data Science, CGPA 9.71.
- A current résumé PDF **exists but is not yet in the repository**. Target path `public/resume/`. The download must not be shown until the file is present.

**Explicitly absent — must not be fabricated or substituted:**

- No headshot or photography of any kind. The visual layer is built from typography, layout, and code-authored graphics.
- No product screenshots beyond the three above.
- No testimonials, references, endorsements, press, customers, or usage numbers.
- No logo or wordmark beyond the name itself.

## Product Principles

1. **Two reading speeds, one page.** A recruiter gets a complete answer in the first screen; an engineer gets the reasoning by scrolling. Neither audience is served a degraded version.
2. **Every claim carries its boundary.** Where a result is qualified, the qualification travels with it. Removing a limitation to make a project look stronger is a product regression, not a copy edit.
3. **Negative results are the proof.** The findings that went against the interesting hypothesis are the most persuasive content on the site. They lead; they are not buried.
4. **Content is data.** `data/portfolio.ts` is the only source of truth. Anything a redesign wants to say must be expressible there.
5. **Restraint reads as competence.** The audience judges engineering judgment. Ornament that a working engineer would not ship reads as a lack of it.

## Accessibility & Inclusion

- Semantic landmarks, logical heading order, a skip link, visible keyboard focus, and full keyboard operation of navigation, theme, and command palette.
- Descriptive link text; status never communicated by color alone.
- Sufficient contrast independently verified in **both** themes — light is not a mechanical inversion of dark.
- `prefers-reduced-motion` removes continuous and pointer-dependent motion.
- No hover-dependent content; touch targets sized for small screens; no horizontal overflow at target viewports.
- Must remain readable server-rendered, before client enhancement runs, on constrained or locked-down browsers.
