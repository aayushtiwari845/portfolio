"use client";

import { useEffect, useRef } from "react";

import { readMotionEnvironment } from "@/lib/motion";
import { THEME_CHANGE_EVENT } from "@/components/theme/theme";
import { COMPACT_SCENE, DESKTOP_SCENE, buildScene, sideForWaypoint } from "@/lib/orrery/scene";
import { ORRERY_CAPTION, planetAppearance } from "@/data/orrery";
import type { ProjectSlug } from "@/data/portfolio";
import { applyView, getStoredView, setOrreryCapable } from "./mode";
import { OrreryTargets } from "./orrery-targets";

/** `#rrggbb` to the `R G B` triple a modern `rgb()` colour takes. */
function hexToRgbTriple(hex: string): string {
  const value = Number.parseInt(hex.replace("#", ""), 16);
  return `${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255}`;
}

/** Below this, the scene drops its moons and its sky. */
const COMPACT_QUERY = "(max-width: 767px)";

/**
 * Hosts the canvas and promotes the page to the orrery once — and only once —
 * a real WebGL2 context exists.
 *
 * The server renders the document. This component is what upgrades it. Every
 * failure mode (no JavaScript, no WebGL2, a blocklisted GPU, a lost context
 * that will not come back, a save-data hint) simply leaves the page in the mode
 * the server already sent, which is a complete and readable document.
 *
 * No React state is used for any of this. Mode lives on `documentElement` and
 * CSS does the switching: `react-hooks/set-state-in-effect` is an error in this
 * repo, and re-rendering a tree at 60Hz to move eight buttons would be the
 * wrong shape even if it were allowed.
 */
export function OrreryStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const moonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = document.documentElement;
    if (!canvas) return;

    const environment = readMotionEnvironment();

    // Save-data is the one preference that disqualifies the orrery outright:
    // that gate is about bytes, and the renderer is the bytes.
    if (environment.savesData()) {
      root.dataset.orrery = "unavailable";
      return;
    }

    let disposed = false;
    let handle: { destroy(): void; invalidate(): void } | null = null;

    // Where each target sat last frame, so sub-pixel jitter does not cause a
    // style write on every single frame.
    const lastPositions = new Map<string, { x: number; y: number }>();

    const fallBackToDocument = () => {
      root.dataset.orrery = "unavailable";
      setOrreryCapable(false);
      // persist: false — an automatic fallback must never overwrite what the
      // reader actually asked for.
      applyView("document", { persist: false });
    };

    /**
     * Where each scroll stop sits, and which camera waypoint it holds.
     *
     * Cached rather than measured per frame: `getBoundingClientRect` in a 60Hz
     * loop forces a layout read every frame. The cache is rebuilt whenever the
     * document changes size, which is the only thing that can invalidate it.
     */
    let stops: { top: number; waypoint: number }[] = [];

    const measureStops = () => {
      stops = [...document.querySelectorAll<HTMLElement>("[data-orrery-waypoint]")]
        .map((element) => {
          const box = element.getBoundingClientRect();
          return {
            // The stop's *middle*, not its top. Anchoring on the top edge made
            // the camera arrive while the text was still most of a viewport
            // below it — the body had already been and gone by the time you
            // could read about it.
            top: box.top + window.scrollY + box.height / 2,
            waypoint: Number(element.dataset.orreryWaypoint),
          };
        })
        .filter((stop) => Number.isFinite(stop.waypoint))
        .sort((a, b) => a.top - b.top);
    };

    /**
     * The camera position the reader is currently at, in waypoint units.
     *
     * Driven by which stop is under the middle of the viewport rather than by
     * `scrollY / scrollHeight`. Sections differ in height by a factor of five,
     * so a raw scroll fraction put the camera on one body while the text beside
     * it described another — which is the bug this replaces.
     */
    const waypointProgress = () => {
      if (stops.length === 0) return 0;

      // Middle of the viewport, matched against the middle of each stop.
      const focusLine = window.scrollY + window.innerHeight / 2;

      if (focusLine <= stops[0].top) return stops[0].waypoint;

      for (let i = 0; i < stops.length - 1; i += 1) {
        const current = stops[i];
        const next = stops[i + 1];
        if (focusLine >= next.top) continue;

        const span = next.top - current.top;
        const t = span <= 0 ? 0 : (focusLine - current.top) / span;

        return current.waypoint + (next.waypoint - current.waypoint) * t;
      }

      return stops[stops.length - 1].waypoint;
    };

    measureStops();

    // A five-inch screen cannot legibly carry eight orbits, seventy moons and a
    // starfield, so it gets the eight bodies and nothing else.
    const compact = window.matchMedia(COMPACT_QUERY).matches;
    const scene = buildScene(compact ? COMPACT_SCENE : DESKTOP_SCENE);

    // The GL code is the only heavy part, and it stays off the critical path.
    void import("@/lib/orrery/renderer")
      .then((renderer) => {
        const element = canvasRef.current;
        if (disposed || !element) return;

        handle = renderer.mount(element, {
          scene,
          reducedMotion: environment.reducedMotion.matches,

          getTheme: () => root.dataset.theme ?? "light",

          getProgress: () => waypointProgress() / Math.max(1, scene.waypoints.length - 1),

          getLensSide: () => (
            sideForWaypoint(Math.round(waypointProgress())) === "left" ? -1 : 1
          ),

          onProject: (targets) => {
            const container = rootRef.current;
            if (!container) return;

            const stageWidth = container.clientWidth;
            // A body can orbit behind the reading column, where its label is
            // unreadable and collides with the prose. Past this edge the label
            // is dropped until the body comes back out.
            const columnEdge = stageWidth >= 1000 ? stageWidth * 0.46 : 0;

            // Once the camera settles on a body, the rest stand down: eight
            // other names competing with the one being described is the mess
            // this is here to avoid.
            container.dataset.focusing = targets.some((target) => target.focus > 0.5)
              ? "true"
              : "false";

            targets.forEach((target) => {
              const node = container.querySelector<HTMLElement>(
                `[data-orrery-target="${target.id}"]`,
              );
              if (!node) return;

              node.dataset.visible = target.visible ? "true" : "false";
              if (!target.visible) return;

              const previous = lastPositions.get(target.id);
              if (
                previous
                && Math.abs(previous.x - target.x) < 0.5
                && Math.abs(previous.y - target.y) < 0.5
              ) {
                return;
              }

              lastPositions.set(target.id, { x: target.x, y: target.y });
              // transform only: never left/top, which would force layout.
              node.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
              node.style.setProperty("--target-radius", `${target.radius}px`);
              // The star is never withdrawn: it carries the author's name and
              // is the way to the résumé, so it has to stay reachable.
              const occluded = target.id !== "star" && target.x < columnEdge;
              node.dataset.occluded = occluded ? "true" : "false";
              // A nearer planet is sitting where this name would be drawn.
              node.dataset.covered = target.covered ? "true" : "false";
              node.dataset.focused = target.focus > 0.5 ? "true" : "false";
            });
          },

          onReady: () => {
            root.dataset.orrery = "ready";
            setOrreryCapable(true);

            // A reader who explicitly chose the document keeps it.
            if (getStoredView() !== "document") {
              applyView("orrery", { persist: false });
            }
          },

          onMoons: (moons) => {
            const slots = moonsRef.current?.children;
            if (!slots) return;

            for (let index = 0; index < slots.length; index += 1) {
              const slot = slots[index] as HTMLElement;
              const moon = moons[index];

              if (!moon || !moon.visible) {
                slot.dataset.visible = "false";
                continue;
              }

              slot.dataset.visible = "true";
              if (slot.textContent !== moon.label) slot.textContent = moon.label;
              slot.style.transform = `translate3d(${moon.x}px, ${moon.y}px, 0)`;
            }
          },

          onFocus: (slug, caption) => {
            // The page takes a wash of the focused project's domain hue.
            const appearance = slug
              ? planetAppearance[slug as ProjectSlug]
              : undefined;
            root.style.setProperty(
              "--spill-rgb",
              appearance ? hexToRgbTriple(appearance.observation) : "255 210 74",
            );

            const node = captionRef.current;
            if (!node) return;

            // Falls back to the standing caption for the orrery as a whole,
            // which is the one that says which quantities are measured and
            // which are merely ordinal.
            node.textContent = caption ?? ORRERY_CAPTION;
            node.dataset.focused = caption ? "true" : "false";
          },

          onLost: fallBackToDocument,
        });

        if (!handle) fallBackToDocument();
      })
      .catch(fallBackToDocument);

    const handleThemeChange = () => handle?.invalidate();
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);

    // Fonts swapping in and images loading both move the stops.
    const documentObserver = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(measureStops);
    documentObserver?.observe(document.body);
    window.addEventListener("resize", measureStops);

    return () => {
      disposed = true;
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
      window.removeEventListener("resize", measureStops);
      documentObserver?.disconnect();
      handle?.destroy();
      handle = null;
      root.style.removeProperty("--spill-rgb");
      delete root.dataset.orrery;
    };
  }, []);

  return (
    <div className="orrery-stage" ref={rootRef}>
      {/*
        Inert by design. All input is routed through the anchors in
        OrreryTargets, so nothing here can fight page scroll on a touch device
        and there is no canvas hit-testing to make accessible.
      */}
      <canvas aria-hidden="true" className="orrery-canvas" ref={canvasRef} />
      <OrreryTargets />

      {/*
        The focused body's moons, named. aria-hidden because these are the same
        technologies the panel beside the scene already lists as text: a screen
        reader should hear that list once, not twice.
      */}
      <div aria-hidden="true" className="orrery-moons" ref={moonsRef}>
        {Array.from({ length: 6 }, (_, index) => (
          <span className="orrery-moon" data-visible="false" key={index} />
        ))}
      </div>

      {/*
        Rule 3 of this design system, carried over: every figure states what it
        measures and what it does not. The orrery is a figure, so it carries a
        caption too — the standing one by default, and the focused project's
        evidence caption once the camera settles on a body.
      */}
      <p className="orrery-caption" data-focused="false" ref={captionRef}>
        {ORRERY_CAPTION}
      </p>
    </div>
  );
}
