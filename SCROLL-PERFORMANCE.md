# Scroll performance review

Document background and content reveals, 27 October 2026.

The previous background changed an inherited CSS progress variable and SVG group transforms on every scroll frame. It also used a viewport-sized mask. The reveal controller read the bounds of pending elements during scrolling, despite Document content being forced visible.

The revised background rasterizes static vector motifs inside HTML compositor layers. Modern browsers use native CSS scroll timelines; the fallback updates only two wrapper transforms. Chapter changes select one primary motif and one faint companion, with no animation or persistent promotion for the other four. Per-frame SVG mutation, inherited progress updates, and the viewport mask are removed.

The six motifs are larger and distinct: nested prisms, connection paths, stacked planes, a helix, a folded ribbon, and a curved fan. The content/layout overview is retained.

Document content now reveals once with a 380ms fade and 10px movement. Positive observer margins and cached top positions reveal tall cards early. Scrolling consumes a sorted cache instead of reading element bounds. Focus, opened disclosures, reduced motion, data saving, no JavaScript, and print keep content readable.

## Controlled comparison

Two runs per configuration, same 3,600px scroll gesture, Chromium, with tracing and requestAnimationFrame sampling. Mobile used a 390px viewport and 4x CPU throttling. Numbers are averages across those runs and describe this test environment, not every device.

| Metric | Previous | Revised | Change |
| --- | ---: | ---: | ---: |
| Desktop p95 frame interval | 39.35ms | 15.45ms | 60.7% shorter |
| Desktop paint work | 111.6ms | 49.4ms | 55.7% less |
| Desktop layout events | 98.5 | 13 | 86.8% fewer |
| Mobile p95 frame interval, 4x CPU | 113.2ms | 41.75ms | 63.1% shorter |
| Mobile paint work, 4x CPU | 288.9ms | 153.4ms | 46.9% less |
| Mobile layout events, 4x CPU | 49 | 11 | 77.6% fewer |

Initial reveal painting still costs more than a warm scroll under CPU throttling. The warm mobile run had a 31.5ms p95 interval and zero long tasks; the first run had six long tasks, down from 10–13 previously. No universal frame-rate guarantee is implied.

## Validation

- Production build, TypeScript, and ESLint passed.
- 216 tests across 15 suites passed, including new tall-card, fast-scroll, focus, disclosure, anchor, reduced-motion, and cleanup regressions.
- 86 responsive/browser states and five focused checks passed with no runtime errors.
- Verified both themes at 320/390/768/1024/1280/1440px, native and forced fallback backgrounds, six motifs, once-only reveals, keyboard access, disclosures, reduced motion, no JavaScript, and Orrery/case-study isolation.

Session reports and traces are stored locally under `qa/profiles/`; screenshots are under `qa/screenshots/scroll-v3-*`. These machine-specific QA artifacts are not application dependencies.
