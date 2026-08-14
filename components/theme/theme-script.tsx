import { THEME_INIT_SCRIPT } from "./theme";

export function ThemeScript() {
  return (
    <script
      id="theme-initializer"
      dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
    />
  );
}
