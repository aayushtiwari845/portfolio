/**
 * Scene colour, per theme.
 *
 * The renderer uploads an already-resolved palette rather than branching on
 * colour in GLSL, so `uSchematic` controls only *how* things are shaded — lit
 * spheres and glow, or flat fills and drawn edges — and never what colour they
 * are. That keeps one program per pass instead of one per pass per theme.
 *
 * Values track the CSS tokens in `app/globals.css`: the amber mark, the ink,
 * and the stock. Body tints are pre-warmed rather than neutral, because the
 * star is the only light in the scene and everything in it is lit amber.
 */

import type { Vec3 } from "./math";

export interface Palette {
  /** Unmarked points in an evidence cloud. Bodies carry their own colour. */
  readonly record: Vec3;
  readonly ink: Vec3;
  readonly ring: Vec3;
  readonly star: Vec3;
  readonly background: Vec3;
  /** 0 renders the observation, 1 the schematic. */
  readonly schematic: number;
}

function rgb(hex: number): Vec3 {
  return [
    ((hex >> 16) & 255) / 255,
    ((hex >> 8) & 255) / 255,
    (hex & 255) / 255,
  ];
}

/** Dark: the observation. A photograph of the system. */
export const OBSERVATION: Palette = {
  record: rgb(0x8b95ab),
  ink: rgb(0xf4f6fa),
  ring: rgb(0x3a4152),
  star: rgb(0xffd24a),
  background: rgb(0x101420),
  schematic: 0,
};

/** Light: the schematic. An engineering drawing of the same geometry. */
export const SCHEMATIC: Palette = {
  record: rgb(0x676e7d),
  ink: rgb(0x14161c),
  ring: rgb(0xbdb9ad),
  star: rgb(0xd99e00),
  background: rgb(0xfbfaf7),
  schematic: 1,
};

export function paletteFor(theme: string): Palette {
  return theme === "dark" ? OBSERVATION : SCHEMATIC;
}
