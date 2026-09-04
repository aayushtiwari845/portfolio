import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeToggle } from "./theme-toggle";
import {
  DEFAULT_THEME,
  THEME_COLORS,
  THEME_INIT_SCRIPT,
  THEME_STORAGE_KEY,
} from "./theme";

// The opposite of whatever the design system currently defaults to, so these
// assertions follow the default instead of pinning a colour scheme.
const OTHER_THEME = DEFAULT_THEME === "dark" ? "light" : "dark";

function runThemeInitializer() {
  window.eval(THEME_INIT_SCRIPT);
}

describe("theme controls", () => {
  let themeColorMeta: HTMLMetaElement;

  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.dataset.theme = DEFAULT_THEME;
    document.documentElement.style.colorScheme = "";
    themeColorMeta = document.createElement("meta");
    themeColorMeta.name = "theme-color";
    themeColorMeta.content = THEME_COLORS[DEFAULT_THEME];
    document.head.append(themeColorMeta);
  });

  afterEach(() => {
    cleanup();
    themeColorMeta.remove();
    vi.restoreAllMocks();
  });

  it("uses the default theme on a first visit and restores a valid saved preference", () => {
    runThemeInitializer();

    expect(document.documentElement).toHaveAttribute("data-theme", DEFAULT_THEME);
    expect(document.documentElement.style.colorScheme).toBe(DEFAULT_THEME);
    expect(themeColorMeta).toHaveAttribute("content", THEME_COLORS[DEFAULT_THEME]);

    window.localStorage.setItem(THEME_STORAGE_KEY, OTHER_THEME);
    runThemeInitializer();

    expect(document.documentElement).toHaveAttribute("data-theme", OTHER_THEME);
    expect(document.documentElement.style.colorScheme).toBe(OTHER_THEME);
    expect(themeColorMeta).toHaveAttribute("content", THEME_COLORS[OTHER_THEME]);
  });

  it("toggles the document theme, label, browser chrome and saved preference", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const toggle = screen.getByRole("button", {
      name: `Switch to ${OTHER_THEME} theme`,
    });
    await user.click(toggle);

    expect(document.documentElement).toHaveAttribute("data-theme", OTHER_THEME);
    expect(document.documentElement.style.colorScheme).toBe(OTHER_THEME);
    expect(themeColorMeta).toHaveAttribute("content", THEME_COLORS[OTHER_THEME]);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe(OTHER_THEME);
    expect(toggle).toHaveAccessibleName(`Switch to ${DEFAULT_THEME} theme`);
  });

  it("keeps multiple controls synchronized", async () => {
    const user = userEvent.setup();
    render(
      <>
        <ThemeToggle />
        <ThemeToggle />
      </>,
    );

    const toggles = screen.getAllByRole("button", {
      name: `Switch to ${OTHER_THEME} theme`,
    });
    await user.click(toggles[0]);

    expect(
      screen.getAllByRole("button", { name: `Switch to ${DEFAULT_THEME} theme` }),
    ).toHaveLength(2);
  });

  it("can be operated entirely from the keyboard", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const toggle = screen.getByRole("button", {
      name: `Switch to ${OTHER_THEME} theme`,
    });

    toggle.focus();
    await user.keyboard("{Enter}");
    expect(toggle).toHaveAccessibleName(`Switch to ${DEFAULT_THEME} theme`);

    await user.keyboard(" ");
    expect(toggle).toHaveAccessibleName(`Switch to ${OTHER_THEME} theme`);
    expect(document.documentElement).toHaveAttribute("data-theme", DEFAULT_THEME);
  });

  it("still applies a theme when browser storage is blocked", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage is blocked", "SecurityError");
    });
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(
      screen.getByRole("button", { name: `Switch to ${OTHER_THEME} theme` }),
    );

    expect(document.documentElement).toHaveAttribute("data-theme", OTHER_THEME);
    expect(themeColorMeta).toHaveAttribute("content", THEME_COLORS[OTHER_THEME]);
  });

  it("falls back safely when reading browser storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Storage is blocked", "SecurityError");
    });
    document.documentElement.dataset.theme = OTHER_THEME;

    expect(runThemeInitializer).not.toThrow();
    expect(document.documentElement).toHaveAttribute("data-theme", DEFAULT_THEME);
  });
});
