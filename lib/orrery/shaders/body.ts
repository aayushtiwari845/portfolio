/**
 * Bodies: instanced billboard quads, shaded as spheres with procedural surfaces.
 *
 * Instanced quads rather than `gl.POINTS` because point sprites break in four
 * separate ways at this scale: `gl_PointSize` is capped as low as 255 on some
 * Apple and Mali drivers (a silently-too-small star, with no error), a point is
 * clipped on its *centre* so a large star vanishes the moment its centre leaves
 * the frame, `gl_PointSize` is in device pixels so DPR has to be applied by
 * hand, and `gl_PointCoord` is y-down which mirrors the lighting.
 *
 * One program serves both passes. `uGlowPass` switches between the opaque lit
 * sphere and the larger additive halo, so the analytic glow costs a second draw
 * over the same instance buffer rather than a bloom pipeline with its own
 * framebuffers, resize path and restore path.
 *
 * Surfaces are generated here rather than sampled from a texture: five distinct
 * planets for no bytes and no image decode. The fake normal is built from the
 * *world-space* camera basis, so a surface stays fixed in space and the planet
 * turns under the camera as it should, instead of the pattern following the
 * viewer around.
 */

export const BODY_VERTEX = `#version 300 es

in vec2 aCorner;
in vec3 aCenter;
in float aRadius;
in vec3 aColorObservation;
in vec3 aColorSchematic;
in float aSurface;
in float aFilled;
in float aSeed;
in vec4 aOrbit;

uniform mat4 uViewProjection;
uniform vec3 uRight;
uniform vec3 uUp;
uniform float uGlowScale;
uniform float uSchematic;
uniform float uTime;

out vec2 vCorner;
out vec3 vColor;
out float vSurface;
out float vFilled;
out float vSeed;
out vec3 vCenter;

void main() {
  vCorner = aCorner;
  // Both themes travel in the buffer, so switching theme needs no re-upload.
  vColor = mix(aColorObservation, aColorSchematic, uSchematic);
  vSurface = aSurface;
  vFilled = aFilled;
  vSeed = aSeed;

  // Moons carry their parent's centre plus an orbit, and travel it on the GPU.
  // aOrbit.x is zero for everything else, so this costs one branch and keeps
  // the whole instance buffer static.
  vec3 centre = aCenter;
  if (aOrbit.x > 0.0) {
    float angle = aOrbit.y + uTime * aOrbit.z;
    centre += vec3(
      cos(angle) * aOrbit.x,
      sin(angle * 2.0) * aOrbit.w,
      sin(angle) * aOrbit.x
    );
  }

  vCenter = centre;

  float radius = aRadius * uGlowScale;
  vec3 world = centre + uRight * (aCorner.x * radius) + uUp * (aCorner.y * radius);

  gl_Position = uViewProjection * vec4(world, 1.0);

  // The halo is a billboard in the *same plane* as the body it surrounds, so
  // every pixel where they overlap produces an identical depth value. Against
  // depthFunc(LESS) that comparison sits exactly on the boundary, and ordinary
  // interpolation jitter flips it from frame to frame — which is the flicker.
  // Pushing the halo a hair further from the camera makes the test decisive.
  if (uGlowScale > 1.5) gl_Position.z += 0.0018 * gl_Position.w;
}
`;

export const BODY_FRAGMENT = `#version 300 es
precision highp float;

in vec2 vCorner;
in vec3 vColor;
in float vSurface;
in float vFilled;
in float vSeed;
in vec3 vCenter;

uniform vec3 uRight;
uniform vec3 uUp;
uniform vec3 uForward;
uniform vec3 uInk;
uniform float uSchematic;
uniform float uGlowPass;
uniform float uIgnition;
uniform float uTime;

out vec4 outColor;

float hash31(vec3 p) {
  return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
}

/** Value noise. Enough for weather; not trying to be Perlin. */
float noise3(vec3 p) {
  vec3 cell = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float n000 = hash31(cell);
  float n100 = hash31(cell + vec3(1.0, 0.0, 0.0));
  float n010 = hash31(cell + vec3(0.0, 1.0, 0.0));
  float n110 = hash31(cell + vec3(1.0, 1.0, 0.0));
  float n001 = hash31(cell + vec3(0.0, 0.0, 1.0));
  float n101 = hash31(cell + vec3(1.0, 0.0, 1.0));
  float n011 = hash31(cell + vec3(0.0, 1.0, 1.0));
  float n111 = hash31(cell + vec3(1.0, 1.0, 1.0));

  return mix(
    mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
    mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
    f.z
  );
}

vec3 surfaceOf(float surface, vec3 normal, vec3 base, float seed) {
  vec3 p = normal * 2.0 + seed;

  if (surface > 3.5) {
    // Icy: smooth, with polar caps.
    float cap = smoothstep(0.58, 0.84, abs(normal.y));
    float grain = noise3(p * 1.6) * 0.16;
    return mix(base * (0.86 + grain), mix(base, vec3(1.0), 0.82), cap);
  }

  if (surface > 2.5) {
    // Rocky: mottled at two scales.
    float coarse = noise3(p * 2.4);
    float fine = noise3(p * 6.5);
    return base * (0.7 + coarse * 0.42 + fine * 0.16);
  }

  if (surface > 1.5) {
    // Banded: latitude bands warped by noise, so they read as weather rather
    // than as ruled lines, plus the occasional brighter storm.
    float warp = noise3(p * 1.8) * 1.6;
    float bands = sin(normal.y * 8.5 + warp);
    float weight = smoothstep(-0.45, 0.45, bands);
    float storm = smoothstep(0.72, 0.95, noise3(p * 3.4));
    vec3 banded = mix(base * 0.68, mix(base, vec3(1.0), 0.2), weight);
    return mix(banded, mix(base, vec3(1.0), 0.42), storm * 0.5);
  }

  return base;
}

void main() {
  float r2 = dot(vCorner, vCorner);
  if (r2 > 1.0) discard;

  float d = sqrt(r2);
  bool isStar = vSurface < 0.5;

  if (uGlowPass > 0.5) {
    // The analytic halo, in place of a bloom pass. Its inner region is occluded
    // by the body's own depth write, so the core is never washed out.
    float falloff = pow(1.0 - d, 3.5);
    float strength = isStar ? 1.55 : 0.6;
    // The schematic has no glow: a technical drawing does not bloom.
    outColor = vec4(vColor * falloff * strength * uIgnition * (1.0 - uSchematic), 1.0);
    return;
  }

  // Ignition fades alpha, never colour. Fading colour toward zero is fading
  // toward black, which on the white schematic makes bodies darker instead of
  // fainter — the opposite of an entrance.
  float alpha = (1.0 - smoothstep(0.97, 1.0, d)) * uIgnition;

  // A project with no measurements draws as an outline. It is not given mass it
  // has not earned, in either theme.
  if (vFilled < 0.5) {
    float ring = smoothstep(0.78, 0.86, d) - smoothstep(0.95, 1.0, d);
    if (ring <= 0.002) discard;
    outColor = vec4(vColor * (1.0 - uSchematic * 0.22), ring * uIgnition);
    return;
  }

  // Fake the sphere normal from the billboard coordinate. The star needs it for
  // its granulation, and every other body needs it for lighting.
  float z = sqrt(max(0.0, 1.0 - r2));
  vec3 normal = normalize(uRight * vCorner.x + uUp * vCorner.y + uForward * z);

  // The planet turns under fixed lighting: the surface is sampled from a normal
  // spun about the world Y axis, while the lambert term keeps using the real
  // one. Procedural surfaces make rotation free.
  float spin = uTime * (0.035 + fract(vSeed * 0.017) * 0.03);
  float sinSpin = sin(spin);
  float cosSpin = cos(spin);
  vec3 spun = vec3(
    normal.x * cosSpin - normal.z * sinSpin,
    normal.y,
    normal.x * sinSpin + normal.z * cosSpin
  );

  if (isStar) {
    // Emissive, and graded by temperature rather than filled with one colour.
    // A single flat amber disc was the problem: real stars are white-hot in the
    // middle and fall through yellow to orange at the limb, and that gradient
    // is most of what makes one look like it is emitting rather than painted.
    vec3 hot = mix(vColor, vec3(1.0), 0.78);
    vec3 mid = vColor;
    vec3 limbColor = vColor * vec3(1.0, 0.6, 0.24);

    vec3 surface = mix(hot, mid, smoothstep(0.0, 0.52, d));
    surface = mix(surface, limbColor, smoothstep(0.46, 1.0, d));

    // Granulation, turning slowly with the star, so the disc is not a smooth
    // gradient. Subtle: this should read as texture, never as noise.
    float cells = noise3(spun * 7.0) * 0.5 + noise3(spun * 16.0) * 0.5;
    surface *= 0.93 + cells * 0.16;

    // Breathes, slowly and by very little. A perfectly static star is a decal.
    float pulse = 0.9 + 0.1 * sin(uTime * 0.55);

    // Limb brightening, then an overall overdrive so the middle clips to white.
    surface += limbColor * smoothstep(0.82, 1.0, d) * 0.45 * pulse;
    surface *= (1.32 + 0.12 * pulse);

    outColor = vec4(mix(surface, vColor, uSchematic), alpha);
    return;
  }

  vec3 toStar = normalize(-vCenter);
  vec3 base = surfaceOf(vSurface, spun, vColor, vSeed);

  // A soft terminator. A bare dot() edge reads as a cut; this reads as air.
  float lambert = smoothstep(-0.22, 0.62, dot(normal, toStar));
  vec3 lit = base * (0.2 + lambert * 0.95);

  // Rim light along the lit limb, so a planet separates from the sky behind it.
  float rim = pow(1.0 - abs(dot(normal, uForward)), 3.2);
  lit += base * rim * lambert * 0.55;

  float edge = smoothstep(0.72, 1.0, d);
  vec3 drawn = mix(lit, base * (1.0 - edge * 0.34), uSchematic);

  outColor = vec4(drawn, alpha);
}
`;

export const BODY_UNIFORMS = [
  "uViewProjection",
  "uRight",
  "uUp",
  "uForward",
  "uGlowScale",
  "uInk",
  "uSchematic",
  "uGlowPass",
  "uIgnition",
  "uTime",
] as const;
