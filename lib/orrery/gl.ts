/**
 * The thin WebGL2 layer: context, programs, buffers. No scene knowledge.
 *
 * Kept deliberately small because none of it can be unit-tested — jsdom has no
 * GL implementation — so everything that *can* be tested lives in the pure
 * modules instead and this file stays close to boilerplate.
 */

/**
 * `alpha: false` is required, not cosmetic. With the default
 * `premultipliedAlpha: true`, an additive shader emitting `vec4(colour, 0.0)`
 * produces canvas pixels with zero alpha, which the browser compositor then
 * makes transparent — every glow in the scene silently disappears. The scene is
 * opaque in both themes anyway, so opting out is also one less compositing step.
 *
 * `failIfMajorPerformanceCaveat` returns null on software renderers rather than
 * handing back a context that would run the tour as a slideshow. That null
 * routes into document mode, which is the better page on such a machine.
 *
 * `powerPreference` stays at the default: `"high-performance"` forces the
 * discrete GPU on dual-GPU laptops, which burns battery and can itself trigger
 * a context loss when the system switches GPUs.
 */
export const CONTEXT_ATTRIBUTES: WebGLContextAttributes = {
  alpha: false,
  antialias: true,
  depth: true,
  stencil: false,
  premultipliedAlpha: false,
  preserveDrawingBuffer: false,
  powerPreference: "default",
  failIfMajorPerformanceCaveat: true,
};

/** The renderer's whole capability check. Null means: stay in document mode. */
export function createContext(canvas: HTMLCanvasElement): WebGL2RenderingContext | null {
  // Never `instanceof WebGL2RenderingContext` — that identifier does not exist
  // in jsdom and throws ReferenceError rather than returning false.
  return canvas.getContext("webgl2", CONTEXT_ATTRIBUTES);
}

export interface LoseContextExtension {
  loseContext(): void;
  restoreContext(): void;
}

export function getLoseContext(gl: WebGL2RenderingContext): LoseContextExtension | null {
  return gl.getExtension("WEBGL_lose_context");
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: GLenum,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create shader");

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // Only ask for the log on failure: an unconditional getShaderInfoLog forces a
  // synchronous stall waiting on the GPU driver.
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader failed to compile: ${log ?? "no log"}`);
  }

  return shader;
}

export function linkProgram(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string,
): WebGLProgram {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  // Shaders are reference-counted by the program; detaching lets the driver
  // free their sources once linking is done.
  gl.detachShader(program, vertex);
  gl.detachShader(program, fragment);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program failed to link: ${log ?? "no log"}`);
  }

  return program;
}

/**
 * Uniform locations, keyed by name.
 *
 * Null values are kept rather than treated as errors. A uniform that only one
 * branch of the theme uniform reads can be stripped entirely by the GLSL
 * compiler, and `gl.uniform*` accepts null and no-ops — which is exactly the
 * behaviour wanted. Throwing here would crash the renderer on a theme toggle.
 */
export type UniformMap = Readonly<Record<string, WebGLUniformLocation | null>>;

export function getUniforms(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  names: readonly string[],
): UniformMap {
  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  names.forEach((name) => {
    uniforms[name] = gl.getUniformLocation(program, name);
  });

  return uniforms;
}

export function createStaticBuffer(
  gl: WebGL2RenderingContext,
  data: BufferSource,
  target: GLenum = gl.ARRAY_BUFFER,
): WebGLBuffer {
  const buffer = gl.createBuffer();
  gl.bindBuffer(target, buffer);
  gl.bufferData(target, data, gl.STATIC_DRAW);
  gl.bindBuffer(target, null);

  return buffer;
}

/**
 * Size the backing store to the element's CSS box.
 *
 * DPR is capped at 2: a 3x phone at fullscreen triples fragment cost for no
 * visible gain. Returns false when nothing changed, so the caller can skip a
 * needless viewport call.
 */
export function resizeCanvas(canvas: HTMLCanvasElement, cssWidth: number, cssHeight: number): boolean {
  const ratio = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.max(1, Math.round(cssWidth * ratio));
  const height = Math.max(1, Math.round(cssHeight * ratio));

  if (canvas.width === width && canvas.height === height) return false;

  canvas.width = width;
  canvas.height = height;
  return true;
}
