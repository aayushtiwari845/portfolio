"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { getDocumentView, VIEW_CHANGE_EVENT } from "@/components/orrery/mode";
import { readMotionEnvironment } from "@/lib/motion";
import { DocumentMotif, type DocumentMotifKind } from "./document-motifs";

const chapters = ["main-content", "experience", "work", "capabilities", "background", "contact"];
const artwork: { kind: DocumentMotifKind; x: number; y: number; turn: number }[] = [
  { kind: "prism", x: 70, y: -100, turn: 18 },
  { kind: "connections", x: -40, y: -70, turn: -8 },
  { kind: "planes", x: 60, y: -120, turn: 12 },
  { kind: "helix", x: -50, y: -100, turn: -16 },
  { kind: "ribbon", x: 80, y: -60, turn: 20 },
  { kind: "fan", x: -30, y: -110, turn: -12 },
];
const companion = [5, 3, 4, 1, 2, 0];

/** Static SVGs travel as HTML compositor layers; their paths never animate. */
export function DocumentBackdrop() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    const environment = readMotionEnvironment();
    const nativeScroll = typeof CSS !== "undefined" && CSS.supports("animation-timeline", "scroll()");
    let frame = 0;
    let disposed = false;
    let activeChapter = -1;
    let lastProgress = -1;
    let stops: number[] = [];
    let range = 1;
    const enabled = () => getDocumentView() === "document"
      && !document.hidden && environment.canAnimate();

    const selectChapter = (index: number) => {
      if (index === activeChapter) return;
      activeChapter = index;
      field.dataset.scene = chapters[index];
      layerRefs.current.forEach((layer, layerIndex) => {
        if (!layer) return;
        const role = layerIndex === index ? "active" : layerIndex === companion[index] ? "ambient" : "hidden";
        if (layer.dataset.role !== role) layer.dataset.role = role;
      });
    };
    const chapterAtReadingLine = () => {
      const line = window.scrollY + window.innerHeight * 0.4;
      let index = 0;
      for (let candidate = 1; candidate < stops.length; candidate += 1) {
        if (stops[candidate] > line) break;
        index = candidate;
      }
      selectChapter(index);
    };
    // Fallback: two transform writes, with no SVG changes or layout reads.
    const updateFallback = () => {
      frame = 0;
      if (disposed || !enabled()) return;
      chapterAtReadingLine();
      const progress = Math.min(1, Math.max(0, window.scrollY / range));
      if (Math.abs(progress - lastProgress) < 0.0002) return;
      lastProgress = progress;
      for (const index of [activeChapter, companion[activeChapter]]) {
        const layer = layerRefs.current[index];
        if (!layer) continue;
        const shape = artwork[index];
        layer.style.transform = `translate3d(calc(-50% + ${(shape.x * progress).toFixed(1)}px), calc(-50% + ${(shape.y * progress).toFixed(1)}px), 0) rotate(${(shape.turn * progress).toFixed(2)}deg)`;
      }
    };
    const scheduleFallback = () => {
      if (!frame && enabled()) frame = window.requestAnimationFrame(updateFallback);
    };
    const measure = () => {
      if (disposed || !enabled()) return;
      stops = chapters.map((id, index) => {
        const node = index === 0 ? document.querySelector(".titleblock") : document.getElementById(id);
        return node ? node.getBoundingClientRect().top + window.scrollY : Infinity;
      });
      range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      chapterAtReadingLine();
      if (!nativeScroll) {
        lastProgress = -1;
        scheduleFallback();
      }
    };
    const preferencesChanged = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      const animated = enabled();
      field.dataset.animated = String(animated);
      field.dataset.driver = animated ? (nativeScroll ? "css" : "fallback") : "static";
      if (animated) measure();
      else {
        selectChapter(0);
        layerRefs.current.forEach((layer) => layer?.style.removeProperty("transform"));
      }
    };
    // Chapter selection changes only at boundaries; modern browsers handle
    // between-boundary movement on the compositor thread.
    const chapterObserver = nativeScroll && typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(() => { if (enabled()) chapterAtReadingLine(); }, {
          rootMargin: "-28% 0px -55% 0px", threshold: 0,
        })
      : null;
    chapters.forEach((id, index) => {
      const node = index === 0 ? document.querySelector(".titleblock") : document.getElementById(id);
      if (node) chapterObserver?.observe(node);
    });
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    resizeObserver?.observe(document.body);
    const unsubscribe = environment.subscribe(preferencesChanged);
    if (!nativeScroll) window.addEventListener("scroll", scheduleFallback, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener(VIEW_CHANGE_EVENT, preferencesChanged);
    document.addEventListener("visibilitychange", preferencesChanged);
    void document.fonts?.ready.then(() => { if (!disposed) measure(); });
    preferencesChanged();
    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      chapterObserver?.disconnect();
      resizeObserver?.disconnect();
      unsubscribe();
      if (!nativeScroll) window.removeEventListener("scroll", scheduleFallback);
      window.removeEventListener("resize", measure);
      window.removeEventListener(VIEW_CHANGE_EVENT, preferencesChanged);
      document.removeEventListener("visibilitychange", preferencesChanged);
    };
  }, []);

  return (
    <div aria-hidden="true" className="document-backdrop" data-driver="static" data-scene="main-content" ref={fieldRef}>
      {artwork.map((shape, index) => (
        <div
          className="document-backdrop__layer"
          data-motif={shape.kind}
          data-role={index === 0 ? "active" : index === 5 ? "ambient" : "hidden"}
          key={shape.kind}
          ref={(node) => { layerRefs.current[index] = node; }}
          style={{
            "--field-travel-x": `${shape.x}px`,
            "--field-travel-y": `${shape.y}px`,
            "--field-turn": `${shape.turn}deg`,
          } as CSSProperties}
        >
          <DocumentMotif kind={shape.kind} />
        </div>
      ))}
    </div>
  );
}
