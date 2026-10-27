"use client";

import { useEffect, useRef } from "react";

import { readMotionEnvironment } from "@/lib/motion";
import { THEME_CHANGE_EVENT } from "@/components/theme/theme";
import { COMPACT_SCENE, DESKTOP_SCENE, buildScene } from "@/lib/orrery/scene";
import type { OrreryHandle } from "@/lib/orrery/renderer";
import { planetAppearance } from "@/data/orrery";
import type { ProjectSlug } from "@/data/portfolio";
import { applyView, getDocumentView, VIEW_CHANGE_EVENT } from "./mode";
import { OrreryTargets } from "./orrery-targets";

function hexToRgbTriple(hex: string): string {
  const value = Number.parseInt(hex.replace("#", ""), 16);
  return `${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255}`;
}

interface LabelBox {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

function overlaps(a: LabelBox, b: LabelBox) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

/** A separate illustration pane. Rendering starts only after an explicit choice. */
export function OrreryStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const motionButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = rootRef.current;
    if (!canvas || !container) return;

    const root = document.documentElement;
    const environment = readMotionEnvironment();
    let disposed = false;
    let loading = false;
    let motionPaused = false;
    let handle: OrreryHandle | null = null;
    let stageWidth = 0;
    let stageHeight = 0;
    let controlBox: LabelBox | null = null;
    let stops: { top: number; waypoint: number }[] = [];
    const lastPositions = new Map<string, { x: number; y: number; radius: number }>();
    const targetNodes = new Map<string, HTMLElement>();
    const labelSizes = new Map<string, { width: number; height: number }>();

    container.querySelectorAll<HTMLElement>("[data-orrery-target]").forEach((node) => {
      targetNodes.set(node.dataset.orreryTarget!, node);
      node.dataset.visible = "false";
      node.tabIndex = -1;
      node.setAttribute("aria-hidden", "true");
    });

    const measure = () => {
      stageWidth = container.clientWidth;
      stageHeight = container.clientHeight;
      const control = motionButtonRef.current;
      const stageBounds = container.getBoundingClientRect();
      const controlBounds = control?.getBoundingClientRect();
      controlBox = controlBounds && controlBounds.width > 0 ? {
        left: controlBounds.left - stageBounds.left - 8,
        right: controlBounds.right - stageBounds.left + 8,
        top: controlBounds.top - stageBounds.top - 8,
        bottom: controlBounds.bottom - stageBounds.top + 8,
      } : null;
      targetNodes.forEach((node, id) => {
        const label = node.querySelector<HTMLElement>(".orrery-target__label");
        labelSizes.set(id, {
          width: label?.offsetWidth || 160,
          height: label?.offsetHeight || 48,
        });
      });
      stops = [...document.querySelectorAll<HTMLElement>("[data-orrery-waypoint]")]
        .map((element) => {
          const box = element.getBoundingClientRect();
          return {
            top: box.top + window.scrollY + box.height / 2,
            waypoint: Number(element.dataset.orreryWaypoint),
          };
        })
        .filter((stop) => Number.isFinite(stop.waypoint))
        .sort((a, b) => a.top - b.top);
    };

    const waypointProgress = () => {
      // On small screens the illustration stays above the reading content.
      if (window.innerWidth < 1100 || stops.length === 0) return 0;
      const focusLine = window.scrollY + window.innerHeight / 2;
      if (focusLine <= stops[0].top) return stops[0].waypoint;
      for (let index = 0; index < stops.length - 1; index += 1) {
        const current = stops[index];
        const next = stops[index + 1];
        if (focusLine >= next.top) continue;
        const span = next.top - current.top;
        const fraction = span <= 0 ? 0 : (focusLine - current.top) / span;
        return current.waypoint + (next.waypoint - current.waypoint) * fraction;
      }
      return stops[stops.length - 1].waypoint;
    };

    const fallBackToDocument = () => {
      if (disposed) return;
      root.dataset.orrery = "unavailable";
      container.setAttribute("aria-busy", "false");
      applyView("document");
    };

    const startRenderer = async () => {
      if (disposed || loading || handle || root.dataset.orrery === "unavailable") return;
      if (environment.savesData()) {
        fallBackToDocument();
        return;
      }
      loading = true;
      root.dataset.orrery = "loading";
      container.setAttribute("aria-busy", "true");
      try {
        const renderer = await import("@/lib/orrery/renderer");
        if (disposed || getDocumentView() !== "orrery") return;
        measure();
        // The smaller pane does not need thousands of evidence points or moon labels.
        const scene = buildScene(window.innerWidth < 1100
          ? COMPACT_SCENE
          : { ...DESKTOP_SCENE, starCount: 900, includeEvidence: false });
        handle = renderer.mount(canvas, {
          scene,
          reducedMotion: environment.reducedMotion.matches || motionPaused,
          getTheme: () => root.dataset.theme ?? "light",
          getProgress: () => waypointProgress() / Math.max(1, scene.waypoints.length - 1),
          getLensSide: () => 0,
          onProject: (targets) => {
            const occupied: LabelBox[] = controlBox ? [controlBox] : [];
            const focusing = targets.some((target) => target.focus > 0.5);
            container.dataset.focusing = focusing ? "true" : "false";
            // Prioritize the selected body when deciding which labels fit.
            [...targets].sort((a, b) => b.focus - a.focus).forEach((target) => {
              const node = targetNodes.get(target.id);
              if (!node) return;
              const size = labelSizes.get(target.id) ?? { width: 160, height: 48 };
              const box = {
                left: target.x - size.width / 2 - 8,
                right: target.x + size.width / 2 + 8,
                top: target.labelY - 6,
                bottom: target.labelY + size.height + 6,
              };
              const visible = target.visible
                && (!focusing || target.focus > 0.5)
                && !target.covered
                && box.left >= 8 && box.right <= stageWidth - 8
                && target.y >= 22 && box.bottom <= stageHeight - 8
                && !occupied.some((other) => overlaps(box, other));
              node.dataset.visible = visible ? "true" : "false";
              node.dataset.focused = target.focus > 0.5 ? "true" : "false";
              node.tabIndex = visible ? 0 : -1;
              node.setAttribute("aria-hidden", visible ? "false" : "true");
              if (!visible) return;
              occupied.push(box);
              const previous = lastPositions.get(target.id);
              if (!previous || Math.abs(previous.x - target.x) >= 0.5
                || Math.abs(previous.y - target.y) >= 0.5
                || Math.abs(previous.radius - target.radius) >= 0.5) {
                node.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
                node.style.setProperty("--target-radius", `${target.radius}px`);
                lastPositions.set(target.id, { x: target.x, y: target.y, radius: target.radius });
              }
            });
          },
          onReady: () => {
            root.dataset.orrery = "ready";
            container.setAttribute("aria-busy", "false");
          },
          // Technologies are already readable in the adjacent document.
          onMoons: () => undefined,
          onFocus: (slug) => {
            const appearance = slug ? planetAppearance[slug as ProjectSlug] : undefined;
            root.style.setProperty("--spill-rgb", appearance
              ? hexToRgbTriple(appearance.observation) : "255 210 74");
          },
          onLost: fallBackToDocument,
        });
        if (!handle) fallBackToDocument();
        else handle.setActive(getDocumentView() === "orrery");
      } catch {
        fallBackToDocument();
      } finally {
        loading = false;
      }
    };

    const handleViewChange = () => {
      const active = getDocumentView() === "orrery";
      container.inert = !active;
      container.setAttribute("aria-hidden", active ? "false" : "true");
      if (active) {
        measure();
        if (handle) handle.setActive(true);
        else void startRenderer();
      } else {
        handle?.setActive(false);
      }
    };
    const remeasure = () => {
      measure();
      handle?.invalidate();
    };
    const handleScroll = () => {
      if (environment.reducedMotion.matches || motionPaused) handle?.invalidate();
    };
    const motionButton = motionButtonRef.current;
    const toggleMotion = () => {
      motionPaused = !motionPaused;
      handle?.setReducedMotion(environment.reducedMotion.matches || motionPaused);
      if (motionButton) {
        motionButton.textContent = motionPaused ? "Play motion" : "Pause motion";
        motionButton.setAttribute("aria-pressed", String(motionPaused));
      }
    };
    motionButton?.addEventListener("click", toggleMotion);
    const unsubscribeEnvironment = environment.subscribe(() => {
      if (environment.savesData()) fallBackToDocument();
      else handle?.setReducedMotion(environment.reducedMotion.matches || motionPaused);
    });
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(remeasure);
    observer?.observe(document.body);
    observer?.observe(container);
    window.addEventListener(VIEW_CHANGE_EVENT, handleViewChange);
    window.addEventListener(THEME_CHANGE_EVENT, remeasure);
    window.addEventListener("resize", remeasure);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleViewChange();

    return () => {
      disposed = true;
      window.removeEventListener(VIEW_CHANGE_EVENT, handleViewChange);
      window.removeEventListener(THEME_CHANGE_EVENT, remeasure);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("scroll", handleScroll);
      unsubscribeEnvironment();
      observer?.disconnect();
      motionButton?.removeEventListener("click", toggleMotion);
      handle?.destroy();
      root.style.removeProperty("--spill-rgb");
      delete root.dataset.orrery;
    };
  }, []);

  return (
    <div aria-hidden="true" aria-label="Interactive project orrery" className="orrery-stage" inert ref={rootRef} role="region">
      <canvas aria-hidden="true" className="orrery-canvas" ref={canvasRef} />
      <OrreryTargets />
      <button aria-pressed="false" className="orrery-motion-toggle" ref={motionButtonRef} type="button">
        Pause motion
      </button>
    </div>
  );
}
