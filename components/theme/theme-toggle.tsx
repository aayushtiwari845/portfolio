"use client";

import { Moon, Sun } from "lucide-react";
import { useLayoutEffect, useSyncExternalStore } from "react";

import {
  applyTheme,
  DEFAULT_THEME,
  getDocumentTheme,
  getStoredTheme,
  isTheme,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  type Theme,
} from "./theme";

interface ThemeToggleProps {
  readonly className?: string;
}

function subscribeToTheme(onStoreChange: () => void) {
  const handleThemeChange = () => onStoreChange();
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    const nextTheme = isTheme(event.newValue) ? event.newValue : DEFAULT_THEME;
    applyTheme(nextTheme, { broadcast: false, persist: false });
    onStoreChange();
  };

  window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    window.removeEventListener("storage", handleStorage);
  };
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getDocumentTheme,
    () => DEFAULT_THEME,
  );

  useLayoutEffect(() => {
    // React Strict Mode can restore the server's <html> attributes on its
    // development remount, so re-apply the saved preference before paint.
    applyTheme(getStoredTheme() ?? getDocumentTheme(), {
      broadcast: true,
      persist: false,
    });
  }, []);

  const nextTheme: Theme = theme === "dark" ? "light" : "dark";
  const label = `Switch to ${nextTheme} theme`;

  return (
    <button
      aria-label={label}
      className={["theme-toggle", className].filter(Boolean).join(" ")}
      data-theme={theme}
      onClick={() => {
        const currentTheme = getDocumentTheme();
        applyTheme(currentTheme === "dark" ? "light" : "dark");
      }}
      title={label}
      type="button"
    >
      <span aria-hidden="true" className="theme-toggle__track">
        <Sun className="theme-toggle__icon theme-toggle__icon--sun" size={15} />
        <Moon className="theme-toggle__icon theme-toggle__icon--moon" size={15} />
      </span>
      <span aria-hidden="true" className="theme-toggle__label">
        {nextTheme === "light" ? "Light" : "Dark"}
      </span>
    </button>
  );
}
