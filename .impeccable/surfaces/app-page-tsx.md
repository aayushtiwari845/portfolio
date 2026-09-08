---
version: 2
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/projects/[slug]/page.tsx","app/resume/page.tsx","app/not-found.tsx","components/orrery/orrery-stage.tsx","lib/orrery/renderer.ts"]
---

Scope: the homepage, the five case-study routes, and the résumé route.

Visitor mode: Persuade on the homepage; Read on the case studies and résumé.

Audience: engineering hiring managers and senior engineers deep-reading (primary); recruiters scanning under a minute (secondary). Job: decide whether this person exercises real engineering judgment, then start a conversation about 2027 new-grad roles.

Action: read a case study, then email or open the résumé.

Proof: five repositories, three real screenshots, one live deployment, dated roles, and — the load-bearing proof — three negative or qualified findings the site states plainly.

Constraints: static-first Next.js 16, all content from `data/portfolio.ts`, zero runtime dependencies, both themes, CI must stay green.

## Direction contract, v2: The Orrery

THESIS: this site is one engineer's career drawn as a solar system, in hand-written WebGL2, over a numbered document that stays complete underneath it. The scene is the argument rather than the wallpaper: every property a viewer can see answers to a field in `data/portfolio.ts`, and the single property that is hand-authored says so in its own caption. It refuses ornament that carries no fact.

OWN-WORLD: two authored renderings of one scene. Dark is the observation, a blue-violet near-black lifted off pure black, lit bodies and a corona. Light is the schematic, paper with hairline orbits, the same geometry as an engineering line drawing. Five domain hues are shared between the page and the planets so that a colour always means the same thing in both. One amber owns whole regions and is also the star. Space Grotesk for headings, Inter Tight for argument, JetBrains Mono for every figure. No cards, no boxes, one radius token, and that one belongs to the reading panel alone.

STORY: a recruiter reads the title block and knows role, stack, status and availability in one glance, or switches to the plain document and reads it as a page. An engineer scrolls, the camera flies through the system, and each body arrives beside the text that describes it: a decision standing next to the baseline that beat it.

FIRST VIEWPORT: the document title block on the left, the system in frame on the right, star centred and the outer bodies in perspective. Rule. Title in Space Grotesk over three lines; beneath it the tabular STATUS / AUTHOR / DISCIPLINE / LOCATION / EDUCATION / MOST RECENT block. Below that the numbered outline of the whole site as primary navigation. The scene's caption sits bottom-right, stating what the orrery measures and what it does not. Primary action is inline as a ruled link, not a button.

FORM: The Orrery, canvas-first, hand-rolled WebGL2, no three.js and no runtime dependencies. Supersedes The Design Doc (v1 below), whose document layer survives intact underneath as the fallback and as the reader's own choice.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Overrides of v1

Three promises in the v1 contract are deliberately broken. They are recorded here rather than deleted, because one of the disciplines this build carries is that superseded decisions and their costs stay visible.

- **"It refuses the dark-terminal accent portfolio and the centered full-bleed hero."** Half of this stands and half does not. There is still no accent system: amber owns regions and the five hues are notation. But the homepage is now a rendered scene, which is the thing that promise was written to rule out. The cost is a WebGL dependency for the headline experience, paid down by the document mode that every failure path lands on.
- **"No gradients, no glow."** The star has a corona, the bodies have an analytic halo, and the scene carries a scrim gradient so text stays readable over it. All three are confined to the scene. A glow on a heading, a rule or a control remains forbidden, and DESIGN.md states it that way.
- **"CSS-native motion only."** The camera is driven by a requestAnimationFrame loop against scroll position. The document's own motion is still CSS-native, and reduced motion draws the scene as a single static frame rather than falling back to no scene at all.

Not overridden, and load-bearing: the audience, and the three negative or qualified findings the site states plainly. The secondary audience is exactly why document mode and the scroll-as-tour exist rather than being bolted on afterwards.

## Direction contract, v1: The Design Doc (superseded)

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

- v2's "No cards" discipline gains exactly one exception: the reading panel on
  case studies, the résumé and the 404. Fifteen paragraphs set directly on a
  starfield are not readable, and a panel is the honest way to say "this is a
  document resting on the scene" rather than pretending it floats there. The
  exception is one radius token, `--radius-panel`, and it never reaches content
  inside the panel, a figure, or a control.

- v2's non-goals section is removed rather than re-rendered. An earlier draft
  drew it as a particle shell around the system, which was wrong twice over: a
  boundary of influence is not the same shape as a claim deliberately not made,
  and it turned the site's most credibility-earning content into the least
  legible thing on screen. The Alternatives Considered blocks inside each case
  study carry that work now.

## Carried disciplines

Donations kept from the challengers weighed against the assigned direction, applied to this world:

- No cards. Nothing is enclosed in a bordered box; separation is space and one hairline. (cracktro)
- Every figure carries a caption stating what it measures and what it does not. (gyaru spread)
- Colour is the sheet, never the mark: amber owns a whole region or does not appear. (copy-shop zine)
- Superseded decisions and their costs stay visible rather than cleaned away. (orizuru)

## Unresolved

- Résumé PDF exists but is not in the repository; the download must stay hidden until `public/resume/` holds it.
- No headshot and no imagery beyond three screenshots, two company marks and one generic placeholder mark; the visual layer is otherwise typography, the scene, and code-authored graphics only.
- `app/icon.tsx` and the OG routes stay typographic. Satori cannot render the scene, so a social card can either describe the document underneath, which is true, or approximate the orrery by hand, which would be a drawing of something the site does not contain. It describes the document.
