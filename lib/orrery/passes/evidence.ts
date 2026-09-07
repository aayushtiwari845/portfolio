/**
 * The evidence clouds.
 *
 * Only the project the camera has settled on is drawn, and it fades in with the
 * camera's arrival. Everything else in the scene is a summary; this is the one
 * pass that draws the underlying records themselves, one point each.
 */

import { createStaticBuffer, getUniforms, linkProgram } from "../gl";
import {
  EVIDENCE_FRAGMENT,
  EVIDENCE_UNIFORMS,
  EVIDENCE_VERTEX,
} from "../shaders/evidence";
import type { FrameContext, RenderPass } from "../frame";
import type { EvidenceRange } from "../scene";

/** position(3) + marked flag(1) */
const STRIDE = 16;

export function createEvidencePass(
  gl: WebGL2RenderingContext,
  cloud: Float32Array<ArrayBuffer>,
  ranges: readonly EvidenceRange[],
): RenderPass {
  const program = linkProgram(gl, EVIDENCE_VERTEX, EVIDENCE_FRAGMENT);
  const uniforms = getUniforms(gl, program, EVIDENCE_UNIFORMS);

  const buffer = createStaticBuffer(gl, cloud);
  const vao = gl.createVertexArray();
  const positionLocation = gl.getAttribLocation(program, "aPosition");
  const flagLocation = gl.getAttribLocation(program, "aFlag");

  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, STRIDE, 0);
  gl.enableVertexAttribArray(flagLocation);
  gl.vertexAttribPointer(flagLocation, 1, gl.FLOAT, false, STRIDE, 12);
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return {
    draw(context, frame: FrameContext) {
      if (ranges.length === 0 || frame.focus.strength <= 0.01) return;

      const range = ranges.find((entry) => entry.slug === frame.focus.slug);
      if (!range) return;

      context.useProgram(program);
      context.bindVertexArray(vao);
      context.uniformMatrix4fv(uniforms.uViewProjection, false, frame.viewProjection);
      context.uniform1f(uniforms.uPixelRatio, frame.pixelRatio);
      context.uniform3fv(uniforms.uPlain, frame.palette.record);
      context.uniform3fv(uniforms.uMark, frame.palette.star);
      context.uniform1f(uniforms.uFocus, frame.focus.strength * frame.ignition);
      context.uniform1f(uniforms.uSchematic, frame.palette.schematic);

      // Depth-tested so records behind a body are hidden by it, but not
      // depth-writing: the cloud must not occlude itself.
      context.depthMask(false);
      context.enable(context.BLEND);

      if (frame.palette.schematic > 0.5) {
        context.blendFunc(context.ONE, context.ONE_MINUS_SRC_ALPHA);
      } else {
        context.blendFunc(context.ONE, context.ONE);
      }

      context.drawArrays(context.POINTS, range.first, range.count);
      context.bindVertexArray(null);
    },

    destroy(context) {
      context.deleteVertexArray(vao);
      context.deleteBuffer(buffer);
      context.deleteProgram(program);
    },
  };
}
