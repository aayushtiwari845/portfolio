/**
 * The minimum 3D maths the orrery needs, and nothing else.
 *
 * Matrices are **column-major**, 16 numbers, laid out exactly the way
 * `gl.uniformMatrix4fv(location, false, m)` expects to receive them: the
 * element at row `r`, column `c` lives at index `c * 4 + r`. A transposed
 * matrix produces a plausible-looking but wrong scene and reports no error, so
 * `math.test.ts` asserts the layout directly rather than only asserting that
 * round-trips cancel.
 *
 * Values are plain `number[]` (doubles) rather than `Float32Array`. WebGL2
 * accepts either, and keeping full precision through `invert` matters more than
 * saving an allocation on eight bodies.
 */

export type Mat4 = readonly number[];
export type Vec3 = readonly [number, number, number];
/** A point after projection, before the perspective divide. */
export type Vec4 = readonly [number, number, number, number];

export function vec3(x: number, y: number, z: number): Vec3 {
  return [x, y, z];
}

export function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function subtract(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function scale(a: Vec3, k: number): Vec3 {
  return [a[0] * k, a[1] * k, a[2] * k];
}

export function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

export function length(a: Vec3): number {
  return Math.hypot(a[0], a[1], a[2]);
}

/** Returns the zero vector unchanged rather than dividing by zero. */
export function normalize(a: Vec3): Vec3 {
  const len = length(a);
  return len === 0 ? [0, 0, 0] : [a[0] / len, a[1] / len, a[2] / len];
}

export function lerp(a: Vec3, b: Vec3, t: number): Vec3 {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

export function identity(): Mat4 {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

/** `a * b`, applied to a column vector as `a * (b * v)`. */
export function multiply(a: Mat4, b: Mat4): Mat4 {
  const out = new Array<number>(16);

  for (let c = 0; c < 4; c += 1) {
    for (let r = 0; r < 4; r += 1) {
      out[c * 4 + r] = a[r] * b[c * 4]
        + a[4 + r] * b[c * 4 + 1]
        + a[8 + r] * b[c * 4 + 2]
        + a[12 + r] * b[c * 4 + 3];
    }
  }

  return out;
}

/** Right-handed perspective onto the WebGL clip volume, depth in [-1, 1]. */
export function perspective(
  fovYRadians: number,
  aspect: number,
  near: number,
  far: number,
): Mat4 {
  const f = 1 / Math.tan(fovYRadians / 2);
  const nf = 1 / (near - far);

  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ];
}

/**
 * A view matrix looking from `eye` at `center`. Its rows are the camera's
 * right, up and backward axes, so column 0 is `(right.x, up.x, backward.x)`.
 */
export function lookAt(eye: Vec3, center: Vec3, up: Vec3): Mat4 {
  const backward = normalize(subtract(eye, center));
  const right = normalize(cross(up, backward));
  const trueUp = cross(backward, right);

  return [
    right[0], trueUp[0], backward[0], 0,
    right[1], trueUp[1], backward[1], 0,
    right[2], trueUp[2], backward[2], 0,
    -dot(right, eye), -dot(trueUp, eye), -dot(backward, eye), 1,
  ];
}

/** Rotation about +Y, used for the system's idle spin. */
export function rotationY(radians: number): Mat4 {
  const s = Math.sin(radians);
  const c = Math.cos(radians);

  return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
}

/** Transform a point (implicit w = 1). Returns clip-space xyzw, undivided. */
export function transformPoint(m: Mat4, v: Vec3): Vec4 {
  const [x, y, z] = v;

  return [
    m[0] * x + m[4] * y + m[8] * z + m[12],
    m[1] * x + m[5] * y + m[9] * z + m[13],
    m[2] * x + m[6] * y + m[10] * z + m[14],
    m[3] * x + m[7] * y + m[11] * z + m[15],
  ];
}

/** The inverse, or `null` when `m` is singular. */
export function invert(m: Mat4): Mat4 | null {
  const b00 = m[0] * m[5] - m[1] * m[4];
  const b01 = m[0] * m[6] - m[2] * m[4];
  const b02 = m[0] * m[7] - m[3] * m[4];
  const b03 = m[1] * m[6] - m[2] * m[5];
  const b04 = m[1] * m[7] - m[3] * m[5];
  const b05 = m[2] * m[7] - m[3] * m[6];
  const b06 = m[8] * m[13] - m[9] * m[12];
  const b07 = m[8] * m[14] - m[10] * m[12];
  const b08 = m[8] * m[15] - m[11] * m[12];
  const b09 = m[9] * m[14] - m[10] * m[13];
  const b10 = m[9] * m[15] - m[11] * m[13];
  const b11 = m[10] * m[15] - m[11] * m[14];

  const det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (det === 0) return null;

  const d = 1 / det;

  return [
    (m[5] * b11 - m[6] * b10 + m[7] * b09) * d,
    (m[2] * b10 - m[1] * b11 - m[3] * b09) * d,
    (m[13] * b05 - m[14] * b04 + m[15] * b03) * d,
    (m[10] * b04 - m[9] * b05 - m[11] * b03) * d,
    (m[6] * b08 - m[4] * b11 - m[7] * b07) * d,
    (m[0] * b11 - m[2] * b08 + m[3] * b07) * d,
    (m[14] * b02 - m[12] * b05 - m[15] * b01) * d,
    (m[8] * b05 - m[10] * b02 + m[11] * b01) * d,
    (m[4] * b10 - m[5] * b08 + m[7] * b06) * d,
    (m[1] * b08 - m[0] * b10 - m[3] * b06) * d,
    (m[12] * b04 - m[13] * b02 + m[15] * b00) * d,
    (m[9] * b02 - m[8] * b04 - m[11] * b00) * d,
    (m[5] * b07 - m[4] * b09 - m[6] * b06) * d,
    (m[0] * b09 - m[1] * b07 + m[2] * b06) * d,
    (m[13] * b01 - m[12] * b03 - m[14] * b00) * d,
    (m[8] * b03 - m[9] * b01 + m[10] * b00) * d,
  ];
}

/** Clamp to [0, 1]. */
export function saturate(t: number): number {
  if (t < 0) return 0;
  if (t > 1) return 1;
  return t;
}

/**
 * The site's one easing curve, matching the `--lift`
 * `cubic-bezier(0.16, 1, 0.3, 1)` used everywhere in CSS, so a camera flight
 * and a DOM transition that start together stay together.
 */
export function easeLift(t: number): number {
  const clamped = saturate(t);
  return 1 - Math.pow(1 - clamped, 3);
}
