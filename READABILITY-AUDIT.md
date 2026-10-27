# Readability and presentation audit

27 October 2026 — Document and Orrery, phone and desktop.

## Findings and changes

| Observed issue | Change |
| --- | --- |
| The server rendered Document, then WebGL silently promoted visitors to Orrery. Cached capability flags also selected Orrery before paint. | Document now opens on every full arrival, regardless of stale preferences. Orrery requires an explicit click. |
| A floating scene caption could compete with the page text as the layout and caption changed. | Removed the floating caption and its measurement/update machinery. Scene interpretation is available in a collapsed explanation in the normal reading flow. |
| The fixed full-screen canvas, labels, and reading column occupied the same space. | Physically separated the scene and prose: right-hand panel on wide screens, bounded illustration above content on smaller screens. |
| Alternating left/right reading columns made scanning unpredictable. | One consistent reading column. |
| Viewport-based grids were too dense inside the narrower Orrery column. | Orrery overrides for experience, capabilities, reference projects, contact, and metadata prevent multi-column compression. |
| Forced 62–84vh entries created long empty gaps and excessive scrolling. | Content determines section and entry height. |
| Numerous small uppercase labels and dense metadata competed with headings. | Larger navigation and support text, clearer heading hierarchy, reduced hero metadata, and more consistent spacing. |
| The introduction and section copy required too much interpretation. | Plain-language headline, introduction, section headings, project summaries, and contact copy, preserving facts and limitations. |
| Detailed project alternatives and diagrams were always open. | Native disclosures reveal contributions, architecture, and trade-offs on demand; findings remain visible. |
| Scene labels collided or became nearly transparent. | Opaque labels with pane-local edge/collision checks; only relevant labels remain visible. Hidden links are not keyboard targets. |
| WebGL could keep rendering while Document was selected. | Deferred initialization and renderer suspension in Document, offscreen, and hidden tabs. |
| Continuous decorative motion lacked a local pause control. | Independent Pause/Play controls for the document sculpture and Orrery; reduced-motion support in both. |
| Case-study transparency could reduce contrast. | Opaque reading panels, bounded prose widths, and larger supporting text. |
| Orrery mode could affect layouts after client navigation. | Homepage-only CSS scoping prevents case studies and résumé from inheriting the split layout. |

## Visual direction

Cosmic imagery remains prominent but has dedicated space. The default document combines an editorial reading layout with a quiet dimensional orbital illustration. Orrery provides a more immersive scene without placing text over the graphic. Both light and dark themes are retained.

## Verification

Browser checks cover 320, 390, 768, 1024, 1280, and 1440px widths, both themes, both views, old stored view preferences, and JavaScript-disabled rendering. Additional checks cover expanded disclosures, keyboard mode selection, pause controls, reduced motion, mobile navigation, and project/résumé routes. Reports and screenshots for this working session are in the local `qa/` directory.

Completed verification: 209 tests across 15 suites; TypeScript and ESLint passed; production build generated all 18 pages. Browser review passed 62 layout states and 40 interaction checks with no runtime errors. The final delivery message records publication state.
