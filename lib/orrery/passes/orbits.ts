/**
 * Orbit rings and engagement arcs.
 *
 * Every ring lives in one buffer and is drawn with its own `drawArrays` range
 * so each can carry its own colour and weight. Around twenty draw calls, which
 * is nothing, and far simpler than packing per-vertex colour.
 *
 * Driver line width is capped at one pixel almost everywhere. That is usually a
 * nuisance; here it is exactly right, since the schematic wants hairlines and a
 * one-pixel additive line is all the observation needs.
 *
 * Drawn after the bodies with depth testing on but depth writing off, so a ring
 * passing behind a body is correctly hidden by it.
 */

import { createStaticBuffer, getUniforms, linkProgram } from "../gl";
import { RING_FRAGMENT, RING_UNIFORMS, RING_VERTEX } from "../shaders/ring";
import type { FrameContext, RenderPass } from "../frame";
import type { SceneRing } from "../scene";
import type { Vec3 } from "../math";

interface RingRange {
  readonly first: number;
  readonly count: number;
  /** A planetary ring carries its planet's hue instead of the palette's. */
  readonly colorObservation?: Vec3;
  readonly colorSchematic?: Vec3;
}

const ORBIT_OPACITY = 0.5;
/** Hairlines on paper need more weight than glowing lines in space. */
const SCHEMATIC_ORBIT_OPACITY = 0.62;

export function createOrbitsPass(
  gl: WebGL2RenderingContext,
  rings: readonly SceneRing[],
): RenderPass {
  const program = linkProgram(gl, RING_VERTEX, RING_FRAGMENT);
  const uniforms = getUniforms(gl, program, RING_UNIFORMS);

  const total = rings.reduce((sum, ring) => sum + ring.points.length, 0);
  const vertices = new Float32Array(total * 3);
  const ranges: RingRange[] = [];

  let cursor = 0;
  rings.forEach((ring) => {
    ranges.push({
      first: cursor,
      count: ring.points.length,
      colorObservation: ring.colorObservation,
      colorSchematic: ring.colorSchematic,
    });

    ring.points.forEach((point) => {
      vertices[cursor * 3] = point[0];
      vertices[cursor * 3 + 1] = point[1];
      vertices[cursor * 3 + 2] = point[2];
      cursor += 1;
    });
  });

  const buffer = createStaticBuffer(gl, vertices);
  const vao = gl.createVertexArray();
  const positionLocation = gl.getAttribLocation(program, "aPosition");

  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return {
    draw(context, frame: FrameContext) {
      context.useProgram(program);
      context.bindVertexArray(vao);
      context.uniformMatrix4fv(uniforms.uViewProjection, false, frame.viewProjection);

      context.depthMask(false);
      context.enable(context.BLEND);

      // The observation adds light to a dark sky; the schematic draws ink onto
      // white paper. The shader emits premultiplied colour either way, so only
      // the destination factor changes.
      if (frame.palette.schematic > 0.5) {
        context.blendFunc(context.ONE, context.ONE_MINUS_SRC_ALPHA);
      } else {
        context.blendFunc(context.ONE, context.ONE);
      }

      const schematic = frame.palette.schematic > 0.5;

      const opacity = schematic ? SCHEMATIC_ORBIT_OPACITY : ORBIT_OPACITY;

      ranges.forEach((range) => {
        const own = schematic ? range.colorSchematic : range.colorObservation;
        context.uniform3fv(uniforms.uColor, own ?? frame.palette.ring);
        context.uniform1f(uniforms.uOpacity, opacity * frame.ignition);
        context.drawArrays(context.LINE_STRIP, range.first, range.count);
      });

      context.bindVertexArray(null);
    },

    destroy(context) {
      context.deleteVertexArray(vao);
      context.deleteBuffer(buffer);
      context.deleteProgram(program);
    },
  };
}
