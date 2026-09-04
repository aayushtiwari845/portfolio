---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/projects/[slug]/page.tsx","app/resume/page.tsx"]
---

Scope: the homepage, the five case-study routes, and the résumé route.

Visitor mode: Persuade on the homepage; Read on the case studies and résumé.

Audience: engineering hiring managers and senior engineers deep-reading (primary); recruiters scanning under a minute (secondary). Job: decide whether this person exercises real engineering judgment, then start a conversation about 2027 new-grad roles.

Action: read a case study, then email or open the résumé.

Proof: five repositories, three real screenshots, one live deployment, dated roles, and — the load-bearing proof — three negative or qualified findings the site states plainly.

Constraints: static-first Next.js 16, all content from `data/portfolio.ts`, CSS-native motion only, both themes, CI must stay green.

## Direction contract

THESIS: this site is the engineering design doc for one engineer — numbered, dated, with Non-goals and Alternatives Considered — because that is the artifact this audience already trusts to judge thinking. It refuses the dark-terminal accent portfolio and the centered full-bleed hero.

OWN-WORLD: document stock, ink black, rule grey, and one review-amber that owns whole regions and is never a scattered accent. Archivo Expanded for titles, Archivo at a fixed measure for argument, Martian Mono for every figure. No cards, no boxes, no gradients, no glow: separation is white space and one hairline rule.

STORY: a recruiter reads the title block and knows role, stack, status, and availability in one glance. An engineer reads the numbered outline, opens a section, and finds a decision standing next to the baseline that beat it.

FIRST VIEWPORT: a document title block on stock, full width. Rule. Title left in wide Archivo Expanded over two lines; to its right a tabular STATUS / AUTHOR / DATE / REVIEWERS block giving role, location, availability, and current position. Rule. Below it the numbered outline of the whole site — 1 Summary, 2 Experience, 3 Selected Work, 4 Non-goals, 5 Capabilities, 6 Contact — as the primary navigation, page numbers right-aligned in mono. Primary action sits inline in the title block as a ruled link, not a button.

FORM: The Design Doc; candidate 1 of 7 on the grounded list, presented as IMPECCABLE'S PICK and taken by the user over the roll's assigned index 6 (The Wall Label); seed key 761ee8ee.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Recorded deviations

- FIRST VIEWPORT promised the status block as `STATUS / AUTHOR / DATE / REVIEWERS`.
  REVIEWERS is dropped: PRODUCT.md records under "Explicitly absent" that no
  testimonials, references or endorsements exist, and a reviewers field would
  invite one. DATE moved to the masthead as `UPDATED <metadata.lastUpdated>`,
  where a document's date belongs, and the freed rows carry DISCIPLINE,
  LOCATION, EDUCATION and MOST RECENT — the facts the recruiter scan needs.

- The build is code-led, so `build-phase.mjs start` prints the contract step and
  writes no `.impeccable/build/state.json`. The seed key lives in FORM above and
  in `.impeccable/config.local.json`; there is no state file to cite.

- FIRST VIEWPORT promised the title "over two lines". Measured against the real
  headline (66 characters), two lines is only reachable at a 40px display size,
  which is too small to carry the first viewport. Built at 58px over three lines
  with an even rag (776/678/680 at 1440). The contract over-specified; the
  deviation is recorded here rather than by rewriting the promise.

## Carried disciplines

Donations kept from the challengers weighed against the assigned direction, applied to this world:

- No cards. Nothing is enclosed in a bordered box; separation is space and one hairline. (cracktro)
- Every figure carries a caption stating what it measures and what it does not. (gyaru spread)
- Colour is the sheet, never the mark: amber owns a whole region or does not appear. (copy-shop zine)
- Superseded decisions and their costs stay visible rather than cleaned away. (orizuru)

## Unresolved

- Résumé PDF exists but is not in the repository; the download must stay hidden until `public/resume/` holds it.
- No headshot and no imagery beyond three screenshots; the visual layer is typography and code-authored graphics only.
