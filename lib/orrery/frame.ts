/**
 * Everything a pass needs to draw one frame. Rebuilt each frame by the
 * renderer and passed down; passes hold no per-frame state of their own.
 */

import type { Mat4, Vec3 } from "./math";
import type { Palette } from "./palette";
import type { FocusState } from "./focus";

export interface FrameContext {
  readonly viewProjection: Mat4;
  /** Camera basis in world space, for billboarding and fake sphere normals. */
  readonly right: Vec3;
  readonly up: Vec3;
  readonly forward: Vec3;
  readonly palette: Palette;
  /** Capped device pixel ratio, for point sizes. */
  readonly pixelRatio: number;
  /** 0 to 1 across the opening sequence; the whole scene fades up on it. */
  readonly ignition: number;
  readonly timeSeconds: number;
  /** Which body the camera has settled on, and how completely. */
  readonly focus: FocusState;
}

export interface RenderPass {
  draw(gl: WebGL2RenderingContext, frame: FrameContext): void;
  destroy(gl: WebGL2RenderingContext): void;
}
