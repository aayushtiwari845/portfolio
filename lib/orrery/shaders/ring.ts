/**
 * Orbits: plain `gl.LINE_STRIP`.
 *
 * Driver line width is capped at 1 essentially everywhere, which is normally a
 * nuisance and here is exactly right — the light theme wants hairlines, and a
 * one-pixel additive line is all the dark theme needs.
 */

export const RING_VERTEX = `#version 300 es

in vec3 aPosition;

uniform mat4 uViewProjection;

void main() {
  gl_Position = uViewProjection * vec4(aPosition, 1.0);
}
`;

export const RING_FRAGMENT = `#version 300 es
precision highp float;

uniform vec3 uColor;
uniform float uOpacity;

out vec4 outColor;

void main() {
  // Premultiplied, so one output serves both blend modes: ONE/ONE adds the
  // ring to a dark sky, and ONE/ONE_MINUS_SRC_ALPHA draws it over white paper.
  // Additive alone is a no-op on a white ground, which is how the rings
  // disappeared from the schematic the first time.
  outColor = vec4(uColor * uOpacity, uOpacity);
}
`;

export const RING_UNIFORMS = [
  "uViewProjection",
  "uColor",
  "uOpacity",
] as const;
