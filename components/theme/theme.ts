export const THEME_STORAGE_KEY = "portfolio-theme";
export const THEME_CHANGE_EVENT = "portfolio-theme-change";

export const themes = ["dark", "light"] as const;
export type Theme = (typeof themes)[number];

export const DEFAULT_THEME: Theme = "dark";

export const THEME_COLORS: Readonly<Record<Theme, string>> = {
  dark: "#050606",
  light: "#f3f1ea",
};

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && themes.includes(value as Theme);
}

export function getDocumentTheme(): Theme {
  if (typeof document === "undefined") return DEFAULT_THEME;
  const theme = document.documentElement.dataset.theme;
  return isTheme(theme) ? theme : DEFAULT_THEME;
}

export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;

  try {
    const theme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(theme) ? theme : null;
  } catch {
    return null;
  }
}

interface ApplyThemeOptions {
  readonly broadcast?: boolean;
  readonly persist?: boolean;
}

export function applyTheme(
  theme: Theme,
  { broadcast = true, persist = true }: ApplyThemeOptions = {},
) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute("content", THEME_COLORS[theme]));

  if (persist) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // The visual preference still applies when storage is blocked.
    }
  }

  if (broadcast) {
    window.dispatchEvent(
      new CustomEvent<Theme>(THEME_CHANGE_EVENT, { detail: theme }),
    );
  }
}

// Keep this synchronous and dependency-free: it runs while <head> is parsed,
// before the browser paints any theme-dependent UI.
export const THEME_INIT_SCRIPT = `(()=>{var t=${JSON.stringify(DEFAULT_THEME)},k=${JSON.stringify(THEME_STORAGE_KEY)},c=${JSON.stringify(THEME_COLORS)};try{var s=localStorage.getItem(k);if(s==="dark"||s==="light")t=s}catch(e){}var d=document.documentElement;d.dataset.theme=t;d.style.colorScheme=t;document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.setAttribute("content",c[t])})})()`;
