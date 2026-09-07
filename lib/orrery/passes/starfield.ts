/**
 * The sky. Drawn first, with depth testing off, behind everything.
 *
 * This is the one place point sprites are the right tool: none of the failure
 * modes that rule them out for bodies matter at one to three pixels.
 *
 * Skipped entirely in the schematic theme, and on compact screens where the
 * scene is built with a star count of zero.
 */

import { createStaticBuffer, getUniforms, linkProgram } from "../gl";
import {
  STARFIELD_FRAGMENT,
  STARFIELD_UNIFORMS,
  STARFIELD_VERTEX,
} from "../shaders/starfield";
import type { FrameContext, RenderPass } from "../frame";

/** position(3) + brightness(1) */
const STRIDE = 16;

export function createStarfieldPass(
  gl: WebGL2RenderingContext,
  starfield: Float32Array<ArrayBuffer>,
): RenderPass {
  const count = starfield.length / 4;
  const program = linkProgram(gl, STARFIELD_VERTEX, STARFIELD_FRAGMENT);
  const uniforms = getUniforms(gl, program, STARFIELD_UNIFORMS);

  const buffer = createStaticBuffer(gl, starfield);
  const vao = gl.createVertexArray();
  const positionLocation = gl.getAttribLocation(program, "aPosition");
  const brightnessLocation = gl.getAttribLocation(program, "aBrightness");

  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, STRIDE, 0);
  gl.enableVertexAttribArray(brightnessLocation);
  gl.vertexAttribPointer(brightnessLocation, 1, gl.FLOAT, false, STRIDE, 12);
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return {
    draw(context, frame: FrameContext) {
      // A technical drawing has no sky.
      if (count === 0 || frame.palette.schematic > 0.5) return;

      context.useProgram(program);
      context.bindVertexArray(vao);
      context.uniformMatrix4fv(uniforms.uViewProjection, false, frame.viewProjection);
      context.uniform1f(uniforms.uPixelRatio, frame.pixelRatio);
      context.uniform3fv(uniforms.uColor, frame.palette.ink);
      context.uniform1f(uniforms.uOpacity, 0.55 * frame.ignition);

      context.depthMask(false);
      context.disable(context.DEPTH_TEST);
      context.enable(context.BLEND);
      context.blendFunc(context.ONE, context.ONE);
      context.drawArrays(context.POINTS, 0, count);
      context.enable(context.DEPTH_TEST);

      context.bindVertexArray(null);
    },

    destroy(context) {
      context.deleteVertexArray(vao);
      context.deleteBuffer(buffer);
      context.deleteProgram(program);
    },
  };
}
