# Portfolio presentation

Updated 27 October 2026. This specification replaces the earlier full-screen, alternating-column Orrery composition.

## Reading experience

Document is the landing presentation on every full page load, on mobile and desktop. Old local-storage view preferences do not change that. The reader can explicitly open Orrery, and that choice lasts through client navigation in the current document. Light and dark theme preferences remain independently persistent.

The first screen answers who Aayush is, what he builds, and his availability. The headline, concise introduction, primary project link, and résumé link lead. A full-viewport SVG background uses wireframe planes and connections that evolve with reading position. The graphic stays behind the page and does not occupy a hero card. Location, recent experience, and education are supporting information.

The homepage follows experience, selected projects, capabilities, background, and contact. Section labels and navigation use plain language. Project findings and their qualifications remain visible; detailed contributions, architecture diagrams, and trade-offs are expandable. Native details elements work without a client runtime.

## Type and hierarchy

Space Grotesk is the display face, Inter Tight is the reading face, and JetBrains Mono is reserved for short metadata. Body copy is generally 17–18px with 1.65–1.75 line height. Labels are at least 12px, normal controls at least 14px, and supporting prose generally 15–16px. Long prose stays within roughly 60–66 characters per line.

Headings use a restrained hierarchy and enough line height to avoid cramped wrapping. Navigation uses sentence-case reading text rather than small uppercase telemetry. Touch controls have 44px targets. A single blue-violet accent distinguishes actions and findings; semantic project colors remain in the scene.

## Orrery

The scene and the reading surface never overlap.

- At 1100px and above, the scene occupies a fixed panel on the right; the reading column stays on the left.
- Below 1100px, the scene is a bounded illustration above the document. It scrolls away naturally.
- No floating bottom caption, alternating text columns, forced viewport-height rows, or prose scrim remains.
- A collapsed explanation in the reading flow preserves the scene's measurement boundaries.
- Labels are opaque, collision-checked, and clipped to the scene's own dimensions. Hidden targets leave the keyboard and accessibility tree.
- Dense moon labels and evidence clouds are omitted from the homepage scene. The corresponding information stays available as readable text and case studies.

Orrery-specific layout rules require the homepage stage to exist. Navigating to a case study or résumé cannot inherit the narrow homepage column.

## Motion and rendering

Document uses six oversized static SVG motifs: prisms, circuits, layered planes, a helix, ribbons, and a fan. Each chapter selects a primary motif and one subdued companion. Only those two HTML wrappers are promoted for compositing. Native CSS scroll timelines animate their transforms in supporting browsers; a two-transform animation-frame fallback supports older browsers. SVG paths, gradients, and inherited progress variables never change during scrolling. Reduced motion, data saving, hidden tabs, and Orrery mode stop the motion; the document retains a static composition.

The WebGL renderer loads only after the reader chooses Orrery. It pauses in Document mode, offscreen, and in hidden tabs. The scene has a separate Pause/Play motion control. Reduced motion renders static frames and removes transitions. Graphics failure returns the reader to Document.

Section entrances are short, subtle, and progressive: content is visible before enhancement and remains accessible without JavaScript. Case-study reading panels are opaque so the backdrop cannot reduce text contrast.

## Source ownership

- `data/portfolio.ts`: facts, project descriptions, homepage copy, and evidence boundaries.
- `app/globals.css`: base document, route, dialog, and component styling.
- `app/presentation.css`: current shared presentation and responsive refinements.
- `app/orrery.css`: scene targets, scene panel, and Orrery-specific layout.
- `components/orrery/`: explicit mode selection and scene lifecycle.
- `app/document.css`: homepage Document-only chapter rhythm and soft surfaces.
- `components/visuals/document-backdrop.tsx`: scroll-driven SVG background.

Preserve the existing factual qualifications. The fraud pipeline is an academic collaboration measured in a simulated local benchmark; CivicLens is an archive utility and dashboard; the B.Tech is in progress; negative evaluation results stay attached to their claims.

## Document section rhythm

The Document homepage follows one visual style: chapter numbers in the margin, soft rounded reading surfaces, and a single chapter gap (88px desktop, 56px phone). Heading-to-content spacing is 28px desktop and 24px phone; adjacent entries use 20px. Full-width section rules, animated rule backgrounds, and repeated entry/disclosure borders are removed in this view. Metadata, projects, experience, capabilities, and contact share the same surface language. These rules are scoped to the homepage Document and do not restyle Orrery or project/resume routes.

## Scroll performance and content reveals

Document blocks reveal once with a short opacity/10px translation transition. An 80px positive observer margin starts reveals before tall cards enter the screen. Initial content is visible immediately. Keyboard focus and opened disclosures reveal their content without waiting for a transition. Reduced motion, data saving, and JavaScript-disabled states keep content visible.

Pending reveal positions are measured on layout changes and consumed from a sorted cache during scrolling. Scrolling does not call element bounding-box APIs. Artwork chapter changes are observed separately, and supporting browsers run the continuous background movement through native CSS scroll timelines rather than JavaScript style updates. Hidden artwork is neither animated nor promoted into persistent GPU layers.
