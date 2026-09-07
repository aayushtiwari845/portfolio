/**
 * The sky: `gl.POINTS` at one to three pixels.
 *
 * This is the one place point sprites are the right tool — none of the failure
 * modes that rule them out for bodies (size caps, centre clipping, y-down
 * sprite coordinates) matter at this scale.
 *
 * Drawn only in the dark theme. The light theme is a schematic, and a technical
 * drawing has no sky.
 */

export const STARFIELD_VERTEX = `#version 300 es

in vec3 aPosition;
in float aBrightness;

uniform mat4 uViewProjection;
uniform float uPixelRatio;

out float vBrightness;

void main() {
  vBrightness = aBrightness;
  gl_Position = uViewProjection * vec4(aPosition, 1.0);
  // Device pixels, so the ratio has to be applied here by hand.
  //
  // Never below ~1.4px: a point smaller than a pixel lands on a different
  // fragment each frame as the camera drifts, and a sky full of those reads as
  // static rather than as stars.
  gl_PointSize = (1.4 + aBrightness * 2.0) * uPixelRatio;
}
`;

export const STARFIELD_FRAGMENT = `#version 300 es
precision highp float;

in float vBrightness;

uniform vec3 uColor;
uniform float uOpacity;

out vec4 outColor;

void main() {
  // gl_PointCoord is y-down, but a radial falloff is symmetric so it does not
  // matter here — unlike lighting, which is why bodies do not use points.
  vec2 offset = gl_PointCoord - 0.5;
  // A soft-edged disc rather than a hard one: the falloff is what antialiases
  // a star, since MSAA cannot help a point sprite.
  float falloff = 1.0 - smoothstep(0.08, 0.5, length(offset));

  outColor = vec4(uColor * falloff * vBrightness * uOpacity, 1.0);
}
`;

export const STARFIELD_UNIFORMS = [
  "uViewProjection",
  "uPixelRatio",
  "uColor",
  "uOpacity",
] as const;
