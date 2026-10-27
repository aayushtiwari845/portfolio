"use client";

import { FileText, Orbit } from "lucide-react";
import { useSyncExternalStore } from "react";

import {
  applyView,
  DEFAULT_VIEW,
  getDocumentView,
  VIEW_CHANGE_EVENT,
  type View,
} from "./mode";

interface ModeToggleProps {
  readonly className?: string;
}

function subscribeToView(onStoreChange: () => void) {
  const handleViewChange = () => onStoreChange();
  window.addEventListener(VIEW_CHANGE_EVENT, handleViewChange);
  return () => {
    window.removeEventListener(VIEW_CHANGE_EVENT, handleViewChange);
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

  const nextView: View = view === "orrery" ? "document" : "orrery";
  const label = nextView === "document"
    ? "Read as a document"
    : "View as an orrery";

  return (
    <button
      aria-label={label}
      aria-pressed={view === "orrery"}
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
