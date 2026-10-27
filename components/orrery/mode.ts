/**
 * Document is the entry point on every full page load. The current DOM keeps
 * an explicit choice during client navigation; browser storage never chooses
 * the presentation for a new visit.
 */
export const VIEW_CHANGE_EVENT = "portfolio-view-change";

// Legacy keys are kept here so regression tests can cover returning visitors.
export const VIEW_STORAGE_KEY = "portfolio-view";
export const VIEW_CAPABILITY_KEY = "portfolio-orrery-ok";

export const views = ["document", "orrery"] as const;
export type View = (typeof views)[number];
export const DEFAULT_VIEW: View = "document";

export function isView(value: unknown): value is View {
  return typeof value === "string" && views.includes(value as View);
}

export function getDocumentView(): View {
  if (typeof document === "undefined") return DEFAULT_VIEW;
  const view = document.documentElement.dataset.view;
  return isView(view) ? view : DEFAULT_VIEW;
}

export function applyView(view: View) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.view = view;
  window.dispatchEvent(new CustomEvent<View>(VIEW_CHANGE_EVENT, { detail: view }));
}

// Runs before paint, including for visitors with an old Orrery preference.
export const VIEW_INIT_SCRIPT = `document.documentElement.dataset.view=${JSON.stringify(DEFAULT_VIEW)}`;
