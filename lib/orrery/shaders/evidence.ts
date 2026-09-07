/**
 * Evidence clouds: one point per record in a project's real dataset.
 *
 * This is the pass the instanced-quad machinery elsewhere exists to leave room
 * for. 284,807 points is a single draw call of `gl.POINTS`, and none of the
 * reasons point sprites are wrong for bodies apply at one or two pixels.
 *
 * Colour is emitted premultiplied so the same output works additively over the
 * dark sky and as ordinary source-over on the white schematic.
 */

export const EVIDENCE_VERTEX = `#version 300 es

in vec3 aPosition;
in float aFlag;

uniform mat4 uViewProjection;
uniform float uPixelRatio;

out float vFlag;

void main() {
  vFlag = aFlag;
  gl_Position = uViewProjection * vec4(aPosition, 1.0);
  // Marked records are drawn larger. 492 points among 284,807 would otherwise
  // be findable only in principle.
  gl_PointSize = (vFlag > 0.5 ? 3.2 : 1.7) * uPixelRatio;
}
`;

export const EVIDENCE_FRAGMENT = `#version 300 es
precision highp float;

in float vFlag;

uniform vec3 uPlain;
uniform vec3 uMark;
uniform float uFocus;
uniform float uSchematic;

out vec4 outColor;

void main() {
  vec2 offset = gl_PointCoord - 0.5;
  float falloff = 1.0 - smoothstep(0.0, 0.5, length(offset));
  bool marked = vFlag > 0.5;

  vec3 tint = marked ? uMark : uPlain;
  // Unmarked records sit back so the marked ones carry the figure.
  float weight = marked ? 1.0 : mix(0.42, 0.6, uSchematic);
  float alpha = falloff * uFocus * weight;

  outColor = vec4(tint * alpha, alpha);
}
`;

export const EVIDENCE_UNIFORMS = [
  "uViewProjection",
  "uPixelRatio",
  "uPlain",
  "uMark",
  "uFocus",
  "uSchematic",
] as const;
