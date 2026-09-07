import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ModeToggle } from "./mode-toggle";
import {
  DEFAULT_VIEW,
  VIEW_CAPABILITY_KEY,
  VIEW_INIT_SCRIPT,
  VIEW_STORAGE_KEY,
  applyView,
  getDocumentView,
  isOrreryCapable,
  setOrreryCapable,
} from "./mode";

function runInitScript() {
  window.eval(VIEW_INIT_SCRIPT);
}

beforeEach(() => {
  window.localStorage.clear();
  delete document.documentElement.dataset.view;
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("VIEW_INIT_SCRIPT", () => {
  it("renders the document by default, because the server cannot detect WebGL2", () => {
    runInitScript();
    expect(document.documentElement.dataset.view).toBe("document");
    expect(DEFAULT_VIEW).toBe("document");
  });

  it("promotes a returning visitor whose browser is known to work", () => {
    window.localStorage.setItem(VIEW_CAPABILITY_KEY, "1");
    runInitScript();
    expect(document.documentElement.dataset.view).toBe("orrery");
  });

  it("respects an explicit preference for the document over the capability flag", () => {
    window.localStorage.setItem(VIEW_CAPABILITY_KEY, "1");
    window.localStorage.setItem(VIEW_STORAGE_KEY, "document");
    runInitScript();
    expect(document.documentElement.dataset.view).toBe("document");
  });

  it("does not promote on the strength of a preference alone", () => {
    // Preferring the orrery is not evidence the browser can render it.
    window.localStorage.setItem(VIEW_STORAGE_KEY, "orrery");
    runInitScript();
    expect(document.documentElement.dataset.view).toBe("document");
  });
});

describe("capability flag", () => {
  it("round-trips and clears", () => {
    expect(isOrreryCapable()).toBe(false);
    setOrreryCapable(true);
    expect(isOrreryCapable()).toBe(true);
    setOrreryCapable(false);
    expect(isOrreryCapable()).toBe(false);
  });
});

describe("applyView", () => {
  it("writes the view to the document element", () => {
    applyView("orrery");
    expect(getDocumentView()).toBe("orrery");
  });

  it("persists an explicit choice but not an automatic one", () => {
    applyView("orrery", { persist: false });
    expect(window.localStorage.getItem(VIEW_STORAGE_KEY)).toBeNull();

    applyView("document");
    expect(window.localStorage.getItem(VIEW_STORAGE_KEY)).toBe("document");
  });

  it("falls back to the default for an unrecognised stored value", () => {
    document.documentElement.dataset.view = "nonsense";
    expect(getDocumentView()).toBe(DEFAULT_VIEW);
  });
});

describe("ModeToggle", () => {
  it("offers the orrery while reading the document", () => {
    applyView("document", { persist: false });
    render(<ModeToggle />);

    expect(screen.getByRole("button", { name: "View as an orrery" })).toBeInTheDocument();
  });

  it("switches the document element on click, and back again", () => {
    applyView("document", { persist: false });
    render(<ModeToggle />);

    fireEvent.click(screen.getByRole("button", { name: "View as an orrery" }));
    expect(getDocumentView()).toBe("orrery");

    fireEvent.click(screen.getByRole("button", { name: "Read as a document" }));
    expect(getDocumentView()).toBe("document");
  });

  it("is reachable and operable by keyboard", () => {
    applyView("document", { persist: false });
    render(<ModeToggle />);

    const button = screen.getByRole("button", { name: "View as an orrery" });
    button.focus();
    expect(button).toHaveFocus();

    fireEvent.click(button);
    expect(getDocumentView()).toBe("orrery");
  });

  it("tracks a change made in another tab", () => {
    applyView("document", { persist: false });
    render(<ModeToggle />);

    fireEvent(window, Object.assign(new Event("storage"), {
      key: VIEW_STORAGE_KEY,
      newValue: "orrery",
    }));

    expect(screen.getByRole("button", { name: "Read as a document" })).toBeInTheDocument();
  });
});
