/**
 * The star, roles, projects and moons: one instanced quad each, drawn twice.
 *
 * Pass one is opaque and writes depth. Pass two is the additive halo over the
 * same instance buffer, larger and depth-tested but not depth-writing, so the
 * body's own depth occludes the hot centre of its glow and only the surrounding
 * falloff survives. That is what replaces a bloom pipeline.
 *
 * Additive blending is order-independent and the opaque pass is depth-tested,
 * so neither pass needs the scene sorted — there is no per-frame CPU sort here.
 */

import { createStaticBuffer, getUniforms, linkProgram } from "../gl";
import { BODY_FRAGMENT, BODY_UNIFORMS, BODY_VERTEX } from "../shaders/body";
import type { FrameContext, RenderPass } from "../frame";
import type { SceneBody } from "../scene";

/**
 * center(3) + radius(1) + colourObservation(3) + colourSchematic(3)
 * + surface(1) + filled(1) + seed(1) + orbit(4)
 *
 * Both theme colours ride in the buffer so that switching theme is a uniform
 * change rather than a re-upload, and the orbit travels with the instance so
 * that moons move without the buffer ever being rewritten.
 */
const FLOATS_PER_INSTANCE = 17;
const STRIDE = FLOATS_PER_INSTANCE * 4;

/** How far the halo extends past the body it surrounds. */
const GLOW_SCALE = 2.8;

const QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

export function createBodiesPass(
  gl: WebGL2RenderingContext,
  bodies: readonly SceneBody[],
): RenderPass {
  const program = linkProgram(gl, BODY_VERTEX, BODY_FRAGMENT);
  const uniforms = getUniforms(gl, program, BODY_UNIFORMS);

  const instances = new Float32Array(bodies.length * FLOATS_PER_INSTANCE);
  bodies.forEach((body, index) => {
    const offset = index * FLOATS_PER_INSTANCE;
    instances[offset] = body.position[0];
    instances[offset + 1] = body.position[1];
    instances[offset + 2] = body.position[2];
    instances[offset + 3] = body.radius;
    instances[offset + 4] = body.colorObservation[0];
    instances[offset + 5] = body.colorObservation[1];
    instances[offset + 6] = body.colorObservation[2];
    instances[offset + 7] = body.colorSchematic[0];
    instances[offset + 8] = body.colorSchematic[1];
    instances[offset + 9] = body.colorSchematic[2];
    instances[offset + 10] = body.surface;
    instances[offset + 11] = body.filled ? 1 : 0;
    instances[offset + 12] = body.seed;
    instances[offset + 13] = body.orbit?.radius ?? 0;
    instances[offset + 14] = body.orbit?.phase ?? 0;
    instances[offset + 15] = body.orbit?.speed ?? 0;
    instances[offset + 16] = body.orbit?.lift ?? 0;
  });

  const quadBuffer = createStaticBuffer(gl, QUAD);
  const instanceBuffer = createStaticBuffer(gl, instances);
  const vao = gl.createVertexArray();

  const cornerLocation = gl.getAttribLocation(program, "aCorner");

  gl.bindVertexArray(vao);

  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.enableVertexAttribArray(cornerLocation);
  gl.vertexAttribPointer(cornerLocation, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
  const perInstance = [
    { name: "aCenter", size: 3, offset: 0 },
    { name: "aRadius", size: 1, offset: 12 },
    { name: "aColorObservation", size: 3, offset: 16 },
    { name: "aColorSchematic", size: 3, offset: 28 },
    { name: "aSurface", size: 1, offset: 40 },
    { name: "aFilled", size: 1, offset: 44 },
    { name: "aSeed", size: 1, offset: 48 },
    { name: "aOrbit", size: 4, offset: 52 },
  ];

  perInstance.forEach(({ name, size, offset }) => {
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, STRIDE, offset);
    gl.vertexAttribDivisor(location, 1);
  });

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return {
    draw(context, frame: FrameContext) {
      context.useProgram(program);
      context.bindVertexArray(vao);

      context.uniformMatrix4fv(uniforms.uViewProjection, false, frame.viewProjection);
      context.uniform3fv(uniforms.uRight, frame.right);
      context.uniform3fv(uniforms.uUp, frame.up);
      context.uniform3fv(uniforms.uForward, frame.forward);
      context.uniform3fv(uniforms.uInk, frame.palette.ink);
      context.uniform1f(uniforms.uSchematic, frame.palette.schematic);
      context.uniform1f(uniforms.uIgnition, frame.ignition);
      context.uniform1f(uniforms.uTime, frame.timeSeconds);

      // Bodies: depth on and writing, straight alpha for the limb.
      //
      // SAMPLE_ALPHA_TO_COVERAGE was the first choice here and produced a
      // visible screen-door dither across each body, because four MSAA samples
      // give only four coverage levels. Ordinary alpha blending costs nothing
      // extra: the interior is opaque, so only the one-pixel limb actually
      // blends, and it blends against a starfield that is already drawn.
      context.enable(context.BLEND);
      context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);
      context.depthMask(true);
      context.uniform1f(uniforms.uGlowPass, 0);
      context.uniform1f(uniforms.uGlowScale, 1);
      context.drawArraysInstanced(context.TRIANGLE_STRIP, 0, 4, bodies.length);

      // Halo: additive, depth-tested but not depth-writing.
      context.depthMask(false);
      context.enable(context.BLEND);
      context.blendFunc(context.ONE, context.ONE);
      context.uniform1f(uniforms.uGlowPass, 1);
      context.uniform1f(uniforms.uGlowScale, GLOW_SCALE);
      context.drawArraysInstanced(context.TRIANGLE_STRIP, 0, 4, bodies.length);

      context.bindVertexArray(null);
    },

    destroy(context) {
      context.deleteVertexArray(vao);
      context.deleteBuffer(quadBuffer);
      context.deleteBuffer(instanceBuffer);
      context.deleteProgram(program);
    },
  };
}
