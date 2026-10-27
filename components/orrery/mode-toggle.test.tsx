import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mount, type MountOptions } from "@/lib/orrery/renderer";
import { sceneTargets } from "@/lib/orrery/scene";
import { ModeToggle } from "./mode-toggle";
import { OrreryStage } from "./orrery-stage";
import {
  DEFAULT_VIEW,
  VIEW_CAPABILITY_KEY,
  VIEW_INIT_SCRIPT,
  VIEW_STORAGE_KEY,
  applyView,
  getDocumentView,
} from "./mode";

vi.mock("@/lib/orrery/renderer", () => ({ mount: vi.fn() }));

const handle = {
  destroy: vi.fn(),
  invalidate: vi.fn(),
  setActive: vi.fn(),
  setReducedMotion: vi.fn(),
};
let mountedOptions: MountOptions | undefined;

function runInitScript() {
  window.eval(VIEW_INIT_SCRIPT);
}

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
  delete document.documentElement.dataset.view;
  delete document.documentElement.dataset.orrery;
  mountedOptions = undefined;
  vi.mocked(mount).mockImplementation((_canvas, options) => {
    mountedOptions = options;
    options.onReady();
    return handle;
  });
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("page arrival", () => {
  it("starts in Document on a new visit", () => {
    runInitScript();
    expect(getDocumentView()).toBe("document");
    expect(DEFAULT_VIEW).toBe("document");
  });

  it.each([null, "document", "orrery", "invalid"])(
    "ignores an old %s preference and capability flag", (preference) => {
      window.localStorage.setItem(VIEW_CAPABILITY_KEY, "1");
      if (preference) window.localStorage.setItem(VIEW_STORAGE_KEY, preference);
      runInitScript();
      render(<ModeToggle />);
      expect(getDocumentView()).toBe("document");
      expect(screen.getByRole("button", { name: "View as an orrery" })).toBeInTheDocument();
    },
  );

  it("resets to Document on a new page load after an explicit Orrery choice", () => {
    applyView("orrery");
    runInitScript();
    expect(getDocumentView()).toBe("document");
  });
});

describe("ModeToggle", () => {
  it("switches in both directions without saving a future landing preference", () => {
    runInitScript();
    render(<ModeToggle />);
    fireEvent.click(screen.getByRole("button", { name: "View as an orrery" }));
    expect(getDocumentView()).toBe("orrery");
    expect(screen.getByRole("button", { name: "Read as a document" })).toHaveAttribute("aria-pressed", "true");
    expect(window.localStorage.getItem(VIEW_STORAGE_KEY)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Read as a document" }));
    expect(getDocumentView()).toBe("document");
  });

  it("preserves the current explicit choice when the toggle remounts during navigation", () => {
    applyView("orrery");
    const { unmount } = render(<ModeToggle />);
    unmount();
    render(<ModeToggle />);
    expect(screen.getByRole("button", { name: "Read as a document" })).toBeInTheDocument();
  });

  it("is operable using Tab and Enter", async () => {
    const user = userEvent.setup();
    render(<ModeToggle />);
    await user.tab();
    expect(screen.getByRole("button", { name: "View as an orrery" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(getDocumentView()).toBe("orrery");
  });

  it("does not change the current reading mode when another tab writes an old preference", () => {
    runInitScript();
    render(<ModeToggle />);
    fireEvent(window, new StorageEvent("storage", { key: VIEW_STORAGE_KEY, newValue: "orrery" }));
    expect(getDocumentView()).toBe("document");
  });
});

describe("Orrery lifecycle", () => {
  it("can pause and resume the scene without leaving Orrery", async () => {
    render(<><ModeToggle /><OrreryStage /></>);
    fireEvent.click(screen.getByRole("button", { name: "View as an orrery" }));
    await waitFor(() => expect(mount).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByRole("button", { name: "Pause motion" }));
    expect(handle.setReducedMotion).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole("button", { name: "Play motion" })).toHaveAttribute("aria-pressed", "true");
    expect(getDocumentView()).toBe("orrery");
    fireEvent.click(screen.getByRole("button", { name: "Play motion" }));
    expect(handle.setReducedMotion).toHaveBeenLastCalledWith(false);
  });

  it("defers graphics until explicitly selected, pauses in Document, and reuses the renderer", async () => {
    const { container } = render(<><ModeToggle /><OrreryStage /></>);
    const stage = container.querySelector<HTMLElement>(".orrery-stage")!;
    expect(mount).not.toHaveBeenCalled();
    expect(stage).toHaveAttribute("aria-hidden", "true");
    expect(stage.inert).toBe(true);
    expect(container.querySelector(".orrery-caption")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "View as an orrery" }));
    await waitFor(() => expect(mount).toHaveBeenCalledOnce());
    expect(stage.inert).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Read as a document" }));
    expect(handle.setActive).toHaveBeenLastCalledWith(false);
    expect(stage.inert).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "View as an orrery" }));
    expect(handle.setActive).toHaveBeenLastCalledWith(true);
    expect(mount).toHaveBeenCalledOnce();
  });

  it("keeps clipped and overlapping labels out of the keyboard and accessibility tree", async () => {
    const { container } = render(<><ModeToggle /><OrreryStage /></>);
    const stage = container.querySelector<HTMLElement>(".orrery-stage")!;
    Object.defineProperties(stage, {
      clientWidth: { value: 500 },
      clientHeight: { value: 500 },
    });
    fireEvent.click(screen.getByRole("button", { name: "View as an orrery" }));
    await waitFor(() => expect(mountedOptions).toBeDefined());
    const [first, second, third] = sceneTargets;
    act(() => mountedOptions!.onProject([
      { id: first.id, x: 250, y: 150, radius: 20, labelY: 180, visible: true, covered: false, focus: 0 },
      { id: second.id, x: 255, y: 155, radius: 20, labelY: 185, visible: true, covered: false, focus: 0 },
      { id: third.id, x: 495, y: 150, radius: 20, labelY: 180, visible: true, covered: false, focus: 0 },
    ]));
    const firstLink = container.querySelector(`[data-orrery-target="${first.id}"]`)!;
    const secondLink = container.querySelector(`[data-orrery-target="${second.id}"]`)!;
    const thirdLink = container.querySelector(`[data-orrery-target="${third.id}"]`)!;
    expect(firstLink).toHaveAttribute("tabindex", "0");
    for (const node of [secondLink, thirdLink]) {
      expect(node).toHaveAttribute("tabindex", "-1");
      expect(node).toHaveAttribute("aria-hidden", "true");
      expect(node).toHaveAttribute("data-visible", "false");
    }
  });

  it("returns to the complete Document when graphics are unavailable", async () => {
    vi.mocked(mount).mockReturnValue(null);
    render(<><ModeToggle /><OrreryStage /></>);
    fireEvent.click(screen.getByRole("button", { name: "View as an orrery" }));
    await waitFor(() => expect(document.documentElement.dataset.orrery).toBe("unavailable"));
    expect(getDocumentView()).toBe("document");
  });
});
