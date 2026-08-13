# Aayush Tiwari — Portfolio

A production-oriented portfolio for [Aayush Tiwari](https://aayushktiwari.tech), a software and AI engineer working across backend systems, real-time data infrastructure, ML platforms, and applied AI. He is currently pursuing a B.Tech in Artificial Intelligence & Data Science at K.J. Somaiya School of Engineering, with an expected completion date of July 2027.

The experience uses a “living systems / telemetry” visual language to turn architecture, system behavior, and verified engineering metrics into the primary storytelling layer. It is built as a static-first Next.js application and does not require a CMS, database, API server, or runtime environment variables.

## Technology

- Next.js App Router, React, and strict TypeScript
- Tailwind CSS v4 with a custom design-token layer
- Native CSS motion and lightweight SVG system graphics
- Radix primitives and `cmdk` for accessible interactive controls
- Vitest and Testing Library for focused automated coverage
- ESLint flat config and GitHub Actions for delivery checks

## Architecture

Server Components render the core portfolio, project diagrams, and case studies. Client Components are reserved for behavior that needs browser state, such as navigation, the command palette, copy-to-clipboard, and the local clock.

All verified portfolio content lives in [`data/portfolio.ts`](data/portfolio.ts). The home page, `/resume`, project routes, metadata, sitemap, and generated social images consume that source instead of duplicating content in JSX.

```text
app/                    Routes, layouts, metadata, sitemap, and social images
components/             Section, layout, interaction, and visual components
data/portfolio.ts       Typed identity, links, experience, projects, and metrics
lib/                    Portfolio selectors and shared utilities
public/                 Static assets and an optional supplied résumé PDF
.github/workflows/      Continuous-integration checks
```

Each project is rendered at `/projects/[slug]` and has its own system-specific visual language. Open Graph images are generated with Next.js image routes, so no checked-in social preview bitmap is required.

## Local development

Requirements:

- Node.js 22 (64-bit)
- pnpm 11.16.0 (the version declared in `package.json`)

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Production metadata never uses the local URL; its canonical origin comes from `portfolio.metadata.siteUrl`.

## Quality commands

```bash
pnpm lint       # ESLint, with warnings treated as failures
pnpm typecheck  # Strict TypeScript without emitting files
pnpm test       # Vitest suite
pnpm build      # Optimized Next.js production build
pnpm start      # Serve a completed production build
```

The CI workflow runs install, lint, type-check, tests, and the production build for pull requests and pushes to `main`.

## Editing portfolio content

Update `data/portfolio.ts` for identity details, social links, navigation, experience, education, capabilities, project content, contact copy, and SEO metadata. Keep claims and metrics source-backed; the site intentionally avoids inferred traffic, users, uptime, awards, or performance claims.

To add a project:

1. Add a fully typed project entry to the `projects` collection in `data/portfolio.ts` with a unique URL-safe slug.
2. Supply its overview, architecture stages, engineering highlights, stack, repository URL, and only verified metrics.
3. Map its `visualKind` to a purposeful project visualization when the existing visual registry does not cover it.
4. Run all quality commands. The case-study route, sitemap entry, and project Open Graph image are generated from the data entry.

Social and contact destinations are also data-driven. Change them in `portfolio.links`; do not duplicate URLs inside components.

The `/resume` route is a web-readable résumé generated from the same portfolio data. A PDF download should only be enabled when a current PDF has been supplied: place it under `public/resume/`, then point the configured résumé link to that file. Do not add an empty or placeholder download.

Keep these evidence boundaries intact when editing public copy or structured data:

- CivicLens is a credentialed Supabase-to-Storacha/IPFS archival utility plus a deployed static archive dashboard. It is not a municipal issue-submission or case-management platform.
- The real-time fraud pipeline is an academic collaboration with Aditya Ravi and Atharva Indulkar. Its throughput and latency come from a simulated local streaming benchmark, not a deployed payment system; the public repository is owned by Aditya Ravi.
- Aayush’s B.Tech is in progress through July 2027. Use a current educational affiliation in structured data, not `alumniOf`.

## Performance and progressive enhancement

- Core content is server-rendered and remains readable before client enhancement runs.
- The hero uses a lightweight SVG topology on capable screens and keeps the mobile first view focused on the thesis and actions.
- Reduced-motion and touch states remove continuous or pointer-dependent visual work.
- Decorative graphics are code-native, avoiding heavyweight stock images and large texture downloads.
- Static project graphics and CSS-native motion avoid shipping a general-purpose animation runtime.

The hero thesis, calls to action, and current professional context remain complete even when decorative graphics or JavaScript do not run.

## Accessibility

The interface is designed around semantic landmarks, a logical heading order, a skip link, visible keyboard focus, keyboard-operable navigation and command palette behavior, descriptive link labels, sufficient contrast, and non-color-only status communication. Motion honors `prefers-reduced-motion`; touch targets and project flows adapt for small screens without requiring hover.

Before release, manually verify keyboard navigation, command palette focus handling, responsive navigation, external links, copy-email feedback, reduced-motion behavior, and horizontal overflow at the target viewport sizes.

## SEO

Canonical metadata targets `https://aayushktiwari.tech`. Next.js metadata routes provide:

- `/sitemap.xml`, including every data-defined project
- `/robots.txt`
- a generated favicon
- a branded root Open Graph image
- a data-driven Open Graph image for every project case study

Project page metadata should use each entry’s `seoDescription`, while structured data must remain limited to verifiable Person and CreativeWork facts.

## Vercel deployment

The canonical production site is currently served by Vercel at `https://aayushktiwari.tech`; `https://www.aayushktiwari.tech` redirects to the apex hostname. The repository’s GitHub Actions workflow performs quality checks only. Production deployment is managed through the Vercel project or its Git integration, not a deployment workflow committed here.

To link or recreate the Vercel project:

1. Import `aayushtiwari845/portfolio` from GitHub into Vercel.
2. Keep the repository root as the project root and let Vercel detect Next.js.
3. Use `pnpm install --frozen-lockfile` for installation and `pnpm build` for the build; keep the default Next.js output settings.
4. Do not add environment variables for the core site—none are required.
5. Keep `aayushktiwari.tech` as the primary production domain and redirect `www` to it. If the project is recreated, use the DNS records Vercel reports for that project rather than copying hard-coded values.
6. Keep `portfolio.metadata.siteUrl` and `portfolio.links.website` aligned with the primary hostname.
7. Re-run the production checks and verify canonical URLs, social previews, `robots.txt`, and `sitemap.xml` on the production domain.

## License

This repository is available under the [MIT License](LICENSE).
