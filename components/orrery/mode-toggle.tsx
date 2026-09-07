"use client";

import { FileText, Orbit } from "lucide-react";
import { useLayoutEffect, useSyncExternalStore } from "react";

import {
  applyView,
  DEFAULT_VIEW,
  getDocumentView,
  getStoredView,
  isView,
  VIEW_CHANGE_EVENT,
  VIEW_STORAGE_KEY,
  type View,
} from "./mode";

interface ModeToggleProps {
  readonly className?: string;
}

function subscribeToView(onStoreChange: () => void) {
  const handleViewChange = () => onStoreChange();
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== VIEW_STORAGE_KEY) return;
    applyView(isView(event.newValue) ? event.newValue : DEFAULT_VIEW, {
      broadcast: false,
      persist: false,
    });
    onStoreChange();
  };

  window.addEventListener(VIEW_CHANGE_EVENT, handleViewChange);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(VIEW_CHANGE_EVENT, handleViewChange);
    window.removeEventListener("storage", handleStorage);
  };
}

/**
 * Switches between the orrery and the document.
 *
 * Rendered only on the home page — the header gates it on the pathname, since
 * there is no orrery on a case study or the résumé. CSS hides it entirely when
 * the renderer has reported that this browser cannot run the orrery at all.
 */
export function ModeToggle({ className = "" }: ModeToggleProps) {
  const view = useSyncExternalStore(subscribeToView, getDocumentView, () => DEFAULT_VIEW);

  useLayoutEffect(() => {
    // React Strict Mode restores the server's <html> attributes on its
    // development remount, which would drop a promotion that already happened.
    applyView(getStoredView() ?? getDocumentView(), { broadcast: true, persist: false });
  }, []);

  const nextView: View = view === "orrery" ? "document" : "orrery";
  const label = nextView === "document"
    ? "Read as a document"
    : "View as an orrery";

  return (
    <button
      aria-label={label}
      className={["mode-toggle", className].filter(Boolean).join(" ")}
      data-view={view}
      onClick={() => {
        applyView(getDocumentView() === "orrery" ? "document" : "orrery");
      }}
      title={label}
      type="button"
    >
      <span aria-hidden="true" className="mode-toggle__track">
        <Orbit className="mode-toggle__icon mode-toggle__icon--orrery" size={15} />
        <FileText className="mode-toggle__icon mode-toggle__icon--document" size={15} />
      </span>
      <span aria-hidden="true" className="mode-toggle__label">
        {nextView === "document" ? "Document" : "Orrery"}
      </span>
    </button>
  );
}
