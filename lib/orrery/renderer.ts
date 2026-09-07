/**
 * The frame loop, and nothing else.
 *
 * Two rules shape this file:
 *
 * 1. **No GL handle escapes `createResources`.** Every buffer, program and VAO
 *    is owned by a pass, and every pass is created together and dropped
 *    together. That is what makes context-loss recovery mechanical: restoring
 *    is destroy-then-create, with no bookkeeping to get wrong.
 * 2. **No React.** State lives in this closure and on `documentElement`.
 *    `react-hooks/set-state-in-effect` is an error in this repo, and a 60Hz
 *    re-render would be the wrong shape regardless.
 */

import { createContext, getLoseContext, resizeCanvas } from "./gl";
import { multiply, normalize, perspective, subtract, type Mat4, type Vec3 } from "./math";
import { poseAlongPath, viewMatrix, type CameraPose } from "./camera";
import { paletteFor } from "./palette";
import { projectToScreen, projectedRadius } from "./project";
import { createBodiesPass } from "./passes/bodies";
import { createOrbitsPass } from "./passes/orbits";
import { createStarfieldPass } from "./passes/starfield";
import { createEvidencePass } from "./passes/evidence";
import { focusAt } from "./focus";
import type { FrameContext, RenderPass } from "./frame";
import type { Scene } from "./scene";

const FIELD_OF_VIEW = Math.PI / 3.6;
const NEAR = 0.35;
const FAR = 400;
const IGNITION_MS = 1500;
/** How far the system drifts while idle, in radians per second. */
const IDLE_SPIN = 0.021;
/**
 * A lens shift, in normalised device coordinates, applied once the viewport is
 * wide enough to carry the reading column beside the scene. Shifting the
 * frustum rather than the camera keeps the camera's position honest — the
 * system simply sits to the right of the text instead of behind it.
 */
const WIDE_VIEWPORT = 1000;
const LENS_SHIFT = 0.17;


export interface ProjectedTarget {
  readonly id: string;
  /** CSS pixels from the canvas top-left corner. */
  readonly x: number;
  readonly y: number;
  readonly radius: number;
  readonly visible: boolean;
}

export interface MountOptions {
  readonly scene: Scene;
  /** Current theme name, read fresh each frame so a toggle repaints. */
  getTheme(): string;
  /** Tour progress, 0 to 1. */
  getProgress(): number;
  /**
   * A fixed pose that overrides the tour entirely. Used by the case-study
   * backdrop, which parks on one body rather than travelling.
   */
  getPose?(): CameraPose | null;
  /**
   * Which side the scene should sit on: -1 puts it to the right of a reading
   * column on the left, +1 the other way. Eased rather than cut, so the system
   * glides across the viewport as the reader moves between stops.
   */
  getLensSide(): number;
  /** Called every frame with where each focusable body now is on screen. */
  onProject(targets: readonly ProjectedTarget[]): void;
  /** A context was created and the first frame drew. */
  onReady(): void;
  /** The orrery cannot continue; the page should fall back to the document. */
  onLost(): void;
  /**
   * The camera has settled on a different body. The caption states what the
   * evidence cloud shows and what it does not, which is the same rule every
   * other figure on this site follows.
   */
  onFocus(slug: string | null, caption: string | null): void;
  /**
   * Reduced motion draws a single static frame instead of running a loop.
   * Reduced motion means no motion, not no graphics.
   */
  readonly reducedMotion: boolean;
}

export interface OrreryHandle {
  destroy(): void;
  /** Force a repaint when something outside the loop changed. */
  invalidate(): void;
}

export function mount(canvas: HTMLCanvasElement, options: MountOptions): OrreryHandle | null {
  const gl = createContext(canvas);
  if (!gl) return null;

  const { scene } = options;

  let passes: RenderPass[] = [];
  let frameId = 0;
  let disposed = false;
  let lossCount = 0;
  let startedAt = 0;
  let width = 1;
  let height = 1;
  let lastFocusSlug: string | null = null;
  let lensShift = -1;
  let lastFrameAt = 0;

  function createResources() {
    if (!gl || disposed) return;

    passes = [
      createStarfieldPass(gl, scene.starfield),
      createBodiesPass(gl, scene.bodies),
      createOrbitsPass(gl, scene.rings),
      createEvidencePass(gl, scene.evidenceCloud, scene.evidenceRanges),
    ];
  }

  function destroyResources(deleteObjects: boolean) {
    // After a context loss the objects are already gone; deleting them then is
    // meaningless, so the caller says which situation this is.
    if (gl && deleteObjects) passes.forEach((pass) => pass.destroy(gl));
    passes = [];
  }

  function currentPose(elapsed: number): CameraPose {
    const fixed = options.getPose?.();
    if (fixed) return fixed;

    const pose = poseAlongPath(scene.waypoints, options.getProgress());
    if (options.reducedMotion) return pose;

    // A slow drift so the system reads as alive while the tour is not moving.
    const angle = elapsed * IDLE_SPIN;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const [x, y, z] = pose.eye;

    return { eye: [x * cos + z * sin, y, z * cos - x * sin], target: pose.target };
  }

  function drawFrame(now: number) {
    if (!gl || disposed || passes.length === 0) return;

    if (startedAt === 0) startedAt = now;
    const elapsed = (now - startedAt) / 1000;
    const ignition = options.reducedMotion
      ? 1
      : Math.min(1, (now - startedAt) / IGNITION_MS);

    const pose = currentPose(elapsed);
    const view = viewMatrix(pose);
    const projection = perspective(FIELD_OF_VIEW, width / height, NEAR, FAR).slice();

    // Element (0, 2). A negative value moves the scene to the right, clear of
    // a reading column on the left; positive moves it the other way. On a
    // narrow screen the column is full width, so the scene stays centred.
    if (width >= WIDE_VIEWPORT) {
      const target = options.getLensSide() >= 0 ? 1 : -1;
      // Eased on elapsed time, so the glide is the same speed at any refresh
      // rate and never snaps when the reader crosses between stops.
      const dt = lastFrameAt === 0 ? 0 : Math.min(0.1, (now - lastFrameAt) / 1000);
      lensShift += (target - lensShift) * Math.min(1, dt * 2.6);
      projection[8] = lensShift * LENS_SHIFT;
    }

    lastFrameAt = now;

    const viewProjection: Mat4 = multiply(projection, view);

    // The view matrix rows are the camera basis in world space, which is what
    // the billboards and the fake sphere normals need.
    const right: Vec3 = [view[0], view[4], view[8]];
    const up: Vec3 = [view[1], view[5], view[9]];
    const forward: Vec3 = normalize(subtract(pose.eye, pose.target));

    const focus = focusAt(
      scene.evidenceRanges,
      scene.waypoints.length,
      options.getProgress(),
    );
    if (focus.slug !== lastFocusSlug) {
      lastFocusSlug = focus.slug;
      const range = scene.evidenceRanges.find((entry) => entry.slug === focus.slug);
      options.onFocus(focus.slug, range?.caption ?? null);
    }

    const palette = paletteFor(options.getTheme());
    const frame: FrameContext = {
      viewProjection,
      right,
      up,
      forward,
      palette,
      pixelRatio: Math.min(2, window.devicePixelRatio || 1),
      ignition,
      timeSeconds: elapsed,
      focus,
    };

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(palette.background[0], palette.background[1], palette.background[2], 1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    gl.depthMask(true);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    passes.forEach((pass) => pass.draw(gl, frame));

    // One projection serves both the scene and the DOM hit targets layered over
    // it, so a body and its button can never disagree about where it is.
    options.onProject(scene.targets.map((target) => {
      const point = projectToScreen(viewProjection, target.position, { width, height });

      if (!point) {
        return { id: target.id, x: 0, y: 0, radius: 0, visible: false };
      }

      return {
        id: target.id,
        x: point.x,
        y: point.y,
        radius: projectedRadius(projection, target.radius, point.depth, height),
        visible: true,
      };
    }));
  }

  function loop(now: number) {
    if (disposed) return;
    frameId = window.requestAnimationFrame(loop);
    drawFrame(now);
  }

  function start() {
    if (disposed || frameId !== 0) return;

    if (options.reducedMotion) {
      // A single frame. No loop, nothing moves, everything stays legible.
      frameId = window.requestAnimationFrame((now) => {
        frameId = 0;
        drawFrame(now);
      });
      return;
    }

    frameId = window.requestAnimationFrame(loop);
  }

  function stop() {
    if (frameId !== 0) window.cancelAnimationFrame(frameId);
    frameId = 0;
  }

  function measure() {
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    resizeCanvas(canvas, width, height);
  }

  const handleContextLost = (event: Event) => {
    // Mandatory: without preventDefault the browser never fires a restore.
    event.preventDefault();
    stop();
    destroyResources(false);
    lossCount += 1;

    // One recovery attempt. A second loss in the same session means this
    // machine cannot sustain the scene, so stop trying and hand back the
    // document rather than thrashing.
    if (lossCount > 1) options.onLost();
  };

  const handleContextRestored = () => {
    if (disposed || lossCount > 1) return;
    startedAt = 0;
    createResources();
    measure();
    start();
  };

  const handleVisibility = () => {
    // A background tab must not keep a render loop warm: it drains battery and
    // gets the page thermally throttled.
    if (document.visibilityState === "visible") start();
    else stop();
  };

  function detach() {
    canvas.removeEventListener("webglcontextlost", handleContextLost);
    canvas.removeEventListener("webglcontextrestored", handleContextRestored);
    document.removeEventListener("visibilitychange", handleVisibility);
    observer?.disconnect();
  }

  canvas.addEventListener("webglcontextlost", handleContextLost);
  canvas.addEventListener("webglcontextrestored", handleContextRestored);
  document.addEventListener("visibilitychange", handleVisibility);

  const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => {
    measure();
    // A static frame has no loop to pick the new size up, so redraw it.
    if (options.reducedMotion) start();
  });
  observer?.observe(canvas);

  try {
    createResources();
    measure();
  } catch {
    // A shader that will not compile on this driver is not recoverable.
    destroyResources(true);
    detach();
    getLoseContext(gl)?.loseContext();
    return null;
  }

  start();
  options.onReady();

  return {
    invalidate() {
      measure();
      if (options.reducedMotion) start();
    },

    destroy() {
      disposed = true;
      stop();
      destroyResources(true);
      detach();

      // Strict Mode double-invokes effects in development. Dropping the canvas
      // does not free the context promptly, and browsers cap live contexts at
      // around sixteen, so release it explicitly.
      getLoseContext(gl)?.loseContext();
    },
  };
}
