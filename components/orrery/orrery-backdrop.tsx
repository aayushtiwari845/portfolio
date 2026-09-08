"use client";

import { useEffect, useRef } from "react";

import { readMotionEnvironment } from "@/lib/motion";
import { THEME_CHANGE_EVENT } from "@/components/theme/theme";
import {
  COMPACT_SCENE,
  DESKTOP_SCENE,
  backdropPose,
  buildScene,
  waypointForTarget,
} from "@/lib/orrery/scene";

interface OrreryBackdropProps {
  /**
   * The body this page is about, which is what the camera frames.
   *
   * Omitted on a page that is not about any one body, such as the 404, where
   * the camera falls back to the establishing shot of the whole system.
   */
  readonly slug?: string;
}

/** Below this the scene drops its moons and its sky. */
const COMPACT_QUERY = "(max-width: 767px)";

/**
 * A single still frame of the orrery, parked on one body, behind a case study.
 *
 * It draws **once** and then stops. That is not a compromise, it is the point:
 * the glass panel over it uses a real `backdrop-filter`, and sampling a live
 * WebGL canvas every frame forces a compositor readback that can halve the
 * frame rate on mobile Safari. Over a still canvas it costs nothing. A case
 * study is also for reading, and the camera has no business moving under
 * fifteen paragraphs of validation numbers.
 *
 * The renderer needs no new mode for this: `reducedMotion` already means "draw
 * one frame, no loop, no easing", and a fixed `getProgress` parks the camera on
 * this project's waypoint. Because the camera sits exactly at that stop, the
 * project's own evidence cloud is at full strength behind the text.
 */
export function OrreryBackdrop({ slug }: OrreryBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = document.documentElement;
    if (!canvas) return;

    const environment = readMotionEnvironment();
    if (environment.savesData()) return;

    let disposed = false;
    let handle: { destroy(): void; invalidate(): void } | null = null;

    const compact = window.matchMedia(COMPACT_QUERY).matches;
    const scene = buildScene(compact ? COMPACT_SCENE : DESKTOP_SCENE);

    const pose = slug === undefined ? null : backdropPose(slug);
    const waypoint = slug === undefined ? undefined : waypointForTarget[slug];
    const progress = waypoint === undefined
      ? 0
      : waypoint / Math.max(1, scene.waypoints.length - 1);

    void import("@/lib/orrery/renderer")
      .then((renderer) => {
        const element = canvasRef.current;
        if (disposed || !element) return;

        handle = renderer.mount(element, {
          scene,
          // Always a single frame here, whatever the motion preference.
          reducedMotion: true,
          getTheme: () => root.dataset.theme ?? "light",
          getProgress: () => progress,
          // Parked, not travelling: close in on the body, star behind us.
          // A null pose leaves the camera on the waypoint `progress` names,
          // which for a page about no particular body is the establishing shot.
          getPose: () => pose,
          // Centred: the reading column sits over the middle of the scene.
          getLensSide: () => 0,
          // No hit targets on a case study; the body is scenery, not navigation.
          onProject: () => undefined,
          onMoons: () => undefined,
          onFocus: () => undefined,
          onReady: () => {
            canvas.dataset.ready = "true";
          },
          onLost: () => {
            canvas.dataset.ready = "false";
          },
        });
      })
      .catch(() => {
        // No backdrop is a fine outcome: the page is a readable document
        // without it, which is the whole point of the panel being opaque
        // enough to stand on its own.
      });

    const handleThemeChange = () => handle?.invalidate();
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);

    return () => {
      disposed = true;
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
      handle?.destroy();
      handle = null;
    };
  }, [slug]);

  return (
    <div aria-hidden="true" className="orrery-backdrop">
      <canvas className="orrery-backdrop__canvas" data-ready="false" ref={canvasRef} />
    </div>
  );
}
