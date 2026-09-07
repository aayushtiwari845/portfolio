import { describe, expect, it } from "vitest";

import { BODY_FRAGMENT, BODY_UNIFORMS, BODY_VERTEX } from "./body";
import { RING_FRAGMENT, RING_UNIFORMS, RING_VERTEX } from "./ring";
import { STARFIELD_FRAGMENT, STARFIELD_UNIFORMS, STARFIELD_VERTEX } from "./starfield";

/**
 * Shaders cannot be compiled in jsdom, so nothing here proves they *run*. What
 * it does prove is the contract between the GLSL and the TypeScript that feeds
 * it — renaming a uniform in one place and not the other is the single most
 * common way this kind of renderer breaks, and it breaks silently, because
 * `gl.uniform*` accepts a null location and quietly does nothing.
 */

const programs = [
  { name: "body", vertex: BODY_VERTEX, fragment: BODY_FRAGMENT, uniforms: BODY_UNIFORMS },
  { name: "ring", vertex: RING_VERTEX, fragment: RING_FRAGMENT, uniforms: RING_UNIFORMS },
  {
    name: "starfield",
    vertex: STARFIELD_VERTEX,
    fragment: STARFIELD_FRAGMENT,
    uniforms: STARFIELD_UNIFORMS,
  },
] as const;

/** Uniform names declared in a GLSL source, array suffixes stripped. */
function declaredUniforms(source: string): string[] {
  return [...source.matchAll(/^\s*uniform\s+\w+\s+(\w+)/gm)].map((match) => match[1]);
}

describe.each(programs)("$name program", ({ vertex, fragment, uniforms }) => {
  it("declares the GLSL ES 3.00 version on the very first line", () => {
    // A leading blank line is a compile error, and one easy to introduce when
    // reformatting a template literal.
    expect(vertex.split("\n")[0]).toBe("#version 300 es");
    expect(fragment.split("\n")[0]).toBe("#version 300 es");
  });

  it("sets a default float precision in the fragment shader", () => {
    expect(fragment).toMatch(/precision\s+(highp|mediump)\s+float\s*;/);
  });

  it("declares an output variable rather than using gl_FragColor", () => {
    expect(fragment).toMatch(/^\s*out\s+vec4\s+\w+/m);
    expect(fragment).not.toContain("gl_FragColor");
  });

  it("exports every uniform the GLSL declares", () => {
    const declared = new Set([...declaredUniforms(vertex), ...declaredUniforms(fragment)]);

    declared.forEach((name) => {
      expect(uniforms as readonly string[]).toContain(name);
    });
  });

  it("declares every uniform it exports", () => {
    const declared = new Set([...declaredUniforms(vertex), ...declaredUniforms(fragment)]);

    uniforms.forEach((name) => {
      expect(declared.has(name)).toBe(true);
    });
  });

  it("passes every varying it reads", () => {
    const outs = [...vertex.matchAll(/^\s*out\s+\w+\s+(v\w+)/gm)].map((match) => match[1]);
    const ins = [...fragment.matchAll(/^\s*in\s+\w+\s+(v\w+)/gm)].map((match) => match[1]);

    ins.forEach((name) => expect(outs).toContain(name));
  });
});

describe("body program", () => {
  it("takes body colour per instance rather than from a shared palette", () => {
    // Each planet carries its own domain hue, and both theme variants ride in
    // the instance buffer so a theme switch is a uniform change, not a
    // re-upload. A shared palette array would defeat both.
    expect(BODY_VERTEX).toContain("in vec3 aColorObservation;");
    expect(BODY_VERTEX).toContain("in vec3 aColorSchematic;");
    expect(BODY_FRAGMENT).not.toContain("uPalette");
  });

  it("generates surfaces from a world-space normal, so they do not follow the camera", () => {
    expect(BODY_FRAGMENT).toContain("uRight * vCorner.x + uUp * vCorner.y + uForward * z");
    expect(BODY_FRAGMENT).toContain("float noise3(vec3 p)");
  });

  it("spins the surface but not the lighting", () => {
    // The planet turns under a fixed star: the surface samples a spun normal
    // while the lambert term keeps the real one. Sampling both from the same
    // vector would rotate the terminator with the planet, which would look
    // like the star orbiting the body rather than the body rotating.
    expect(BODY_FRAGMENT).toContain("surfaceOf(vSurface, spun, vColor, vSeed)");
    expect(BODY_FRAGMENT).toContain("dot(normal, toStar)");
  });

  it("orbits moons on the GPU rather than rewriting the instance buffer", () => {
    expect(BODY_VERTEX).toContain("in vec4 aOrbit;");
    expect(BODY_VERTEX).toContain("uTime * aOrbit.z");
  });

  it("biases the halo in depth so it cannot tie with its own body", () => {
    // Equal depth against depthFunc(LESS) is what made the planets flicker.
    expect(BODY_VERTEX).toContain("gl_Position.z +=");
  });

  it("fades in on alpha, never on colour", () => {
    // Fading colour toward zero is fading toward black, which makes bodies
    // darker rather than fainter on the white schematic.
    expect(BODY_FRAGMENT).toContain("* uIgnition;");
    expect(BODY_FRAGMENT).not.toContain("drawn * uIgnition");
  });

  it("draws an unmeasured body as an outline rather than filling it", () => {
    expect(BODY_FRAGMENT).toContain("vFilled < 0.5");
  });

  it("suppresses the glow in the schematic theme", () => {
    expect(BODY_FRAGMENT).toContain("(1.0 - uSchematic)");
  });
});

describe("starfield program", () => {
  it("scales the point size by the device pixel ratio", () => {
    // gl_PointSize is in device pixels; forgetting this halves the sky on
    // every retina display.
    expect(STARFIELD_VERTEX).toContain("uPixelRatio");
    expect(STARFIELD_VERTEX).toMatch(/gl_PointSize\s*=.*uPixelRatio/);
  });
});
