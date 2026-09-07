/**
 * Which presentation the page is in.
 *
 * Deliberately the same shape as `components/theme/theme.ts`: a storage key, a
 * pre-paint init script, a change event, and an `apply` that writes to
 * `documentElement`. State lives on the DOM rather than in React because
 * `react-hooks/set-state-in-effect` is an error in this repo and because CSS,
 * not a re-render, is what actually switches the layout.
 *
 * ## Why the default is `document`
 *
 * The server cannot know whether a visitor's browser has WebGL2. Shipping
 * `orrery` as the SSR default would mean every visitor without it — and every
 * visitor with JavaScript disabled — gets a flash of a layout built around a
 * canvas that never arrives. So the document is what the server sends, and the
 * client *promotes* to the orrery only once a real context has been created.
 *
 * A returning visitor skips that wait: a successful init records a capability
 * flag, and the pre-paint script trusts it on the next visit. The flag is
 * cleared the moment the orrery fails, so a machine that has started failing
 * stops being promoted.
 */

export const VIEW_STORAGE_KEY = "portfolio-view";
export const VIEW_CAPABILITY_KEY = "portfolio-orrery-ok";
export const VIEW_CHANGE_EVENT = "portfolio-view-change";

export const views = ["orrery", "document"] as const;
export type View = (typeof views)[number];

/** What the server renders. See the note above. */
export const DEFAULT_VIEW: View = "document";

export function isView(value: unknown): value is View {
  return typeof value === "string" && views.includes(value as View);
}

export function getDocumentView(): View {
  if (typeof document === "undefined") return DEFAULT_VIEW;
  const view = document.documentElement.dataset.view;
  return isView(view) ? view : DEFAULT_VIEW;
}

/** The reader's explicit choice, or null if they have not made one. */
export function getStoredView(): View | null {
  if (typeof window === "undefined") return null;

  try {
    const view = window.localStorage.getItem(VIEW_STORAGE_KEY);
    return isView(view) ? view : null;
  } catch {
    return null;
  }
}

/** Whether this browser has previously created a WebGL2 context here. */
export function isOrreryCapable(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(VIEW_CAPABILITY_KEY) === "1";
  } catch {
    return false;
  }
}

export function setOrreryCapable(capable: boolean) {
  if (typeof window === "undefined") return;

  try {
    if (capable) window.localStorage.setItem(VIEW_CAPABILITY_KEY, "1");
    else window.localStorage.removeItem(VIEW_CAPABILITY_KEY);
  } catch {
    // The current session still works when storage is blocked; only the
    // first-paint shortcut on the next visit is lost.
  }
}

interface ApplyViewOptions {
  readonly broadcast?: boolean;
  /**
   * Only an explicit choice by the reader should persist. Automatic promotion
   * and automatic fallback both pass `false`, so a temporary failure never
   * overwrites what the reader asked for.
   */
  readonly persist?: boolean;
}

export function applyView(
  view: View,
  { broadcast = true, persist = true }: ApplyViewOptions = {},
) {
  if (typeof document === "undefined") return;

  document.documentElement.dataset.view = view;

  if (persist) {
    try {
      window.localStorage.setItem(VIEW_STORAGE_KEY, view);
    } catch {
      // The visual preference still applies when storage is blocked.
    }
  }

  if (broadcast) {
    window.dispatchEvent(new CustomEvent<View>(VIEW_CHANGE_EVENT, { detail: view }));
  }
}

// Synchronous and dependency-free: this runs while <head> is parsed, before
// the browser paints anything that depends on the view.
export const VIEW_INIT_SCRIPT = `(()=>{var v=${JSON.stringify(DEFAULT_VIEW)},k=${JSON.stringify(VIEW_STORAGE_KEY)},c=${JSON.stringify(VIEW_CAPABILITY_KEY)};try{var p=localStorage.getItem(k);if(p!=="document"&&localStorage.getItem(c)==="1")v="orrery"}catch(e){}document.documentElement.dataset.view=v})()`;
