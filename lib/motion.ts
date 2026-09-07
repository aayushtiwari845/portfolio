/**
 * Environment gates shared by every progressive enhancement on this site.
 *
 * These live here rather than inside a component because two consumers need
 * them and they need them differently. `MotionActivator` owns the `data-motion`
 * attribute and deletes it on unmount, so nothing else can safely read that
 * attribute to decide what it is allowed to do — it has to ask the environment
 * directly.
 *
 * The two gates are deliberately not the same gate:
 *
 * - Entrance and diagram motion needs `canAnimate()`: an IntersectionObserver to
 *   drive it, no reduced-motion preference, and no save-data hint.
 * - The orrery only treats `savesData()` as disqualifying, because that gate is
 *   about bytes and the renderer is the bytes. A reduced-motion preference means
 *   no *motion*, not no *graphics*, so the orrery answers it by drawing a single
 *   static frame rather than by disappearing.
 */

interface SaveDataConnection extends EventTarget {
  readonly saveData?: boolean;
}

interface NavigatorWithConnection extends Navigator {
  readonly connection?: SaveDataConnection;
}

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export interface MotionEnvironment {
  /** Live query. Read `.matches`; it updates as the preference changes. */
  readonly reducedMotion: MediaQueryList;
  /** Absent on browsers without the Network Information API, which is most. */
  readonly connection: SaveDataConnection | undefined;
  /** Entrance and diagram motion may run. */
  canAnimate(): boolean;
  /** The reader has asked for less data. Disqualifies the orrery entirely. */
  savesData(): boolean;
  /** Re-run `listener` whenever either signal changes. Returns an unsubscribe. */
  subscribe(listener: () => void): () => void;
}

/**
 * Read the current environment. Call inside an effect — it touches `window`.
 */
export function readMotionEnvironment(): MotionEnvironment {
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
  const connection = (navigator as NavigatorWithConnection).connection;

  return {
    reducedMotion,
    connection,
    canAnimate: () => (
      "IntersectionObserver" in window
      && !reducedMotion.matches
      && !connection?.saveData
    ),
    savesData: () => Boolean(connection?.saveData),
    subscribe: (listener: () => void) => {
      reducedMotion.addEventListener("change", listener);
      connection?.addEventListener("change", listener);

      return () => {
        reducedMotion.removeEventListener("change", listener);
        connection?.removeEventListener("change", listener);
      };
    },
  };
}
