import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeToggle } from "./theme-toggle";
import {
  THEME_COLORS,
  THEME_INIT_SCRIPT,
  THEME_STORAGE_KEY,
} from "./theme";

function runThemeInitializer() {
  window.eval(THEME_INIT_SCRIPT);
}

describe("theme controls", () => {
  let themeColorMeta: HTMLMetaElement;

  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.dataset.theme = "dark";
    document.documentElement.style.colorScheme = "";
    themeColorMeta = document.createElement("meta");
    themeColorMeta.name = "theme-color";
    themeColorMeta.content = THEME_COLORS.dark;
    document.head.append(themeColorMeta);
  });

  afterEach(() => {
    cleanup();
    themeColorMeta.remove();
    vi.restoreAllMocks();
  });

  it("uses dark on a first visit and restores a valid saved preference", () => {
    runThemeInitializer();

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(themeColorMeta).toHaveAttribute("content", THEME_COLORS.dark);

    window.localStorage.setItem(THEME_STORAGE_KEY, "light");
    runThemeInitializer();

    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(document.documentElement.style.colorScheme).toBe("light");
    expect(themeColorMeta).toHaveAttribute("content", THEME_COLORS.light);
  });

  it("toggles the document theme, label, browser chrome and saved preference", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const toggle = screen.getByRole("button", {
      name: "Switch to light theme",
    });
    await user.click(toggle);

    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(document.documentElement.style.colorScheme).toBe("light");
    expect(themeColorMeta).toHaveAttribute("content", THEME_COLORS.light);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(toggle).toHaveAccessibleName("Switch to dark theme");
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
      name: "Switch to light theme",
    });
    await user.click(toggles[0]);

    expect(
      screen.getAllByRole("button", { name: "Switch to dark theme" }),
    ).toHaveLength(2);
  });

  it("can be operated entirely from the keyboard", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const toggle = screen.getByRole("button", {
      name: "Switch to light theme",
    });

    toggle.focus();
    await user.keyboard("{Enter}");
    expect(toggle).toHaveAccessibleName("Switch to dark theme");

    await user.keyboard(" ");
    expect(toggle).toHaveAccessibleName("Switch to light theme");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("still applies a theme when browser storage is blocked", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage is blocked", "SecurityError");
    });
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(
      screen.getByRole("button", { name: "Switch to light theme" }),
    );

    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(themeColorMeta).toHaveAttribute("content", THEME_COLORS.light);
  });

  it("falls back safely when reading browser storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Storage is blocked", "SecurityError");
    });
    document.documentElement.dataset.theme = "light";

    expect(runThemeInitializer).not.toThrow();
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });
});
