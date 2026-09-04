/**
 * Shared tokens and font loading for the generated social images, so a link
 * preview is set in the same ink and the same face as the document it points
 * at. Values mirror the light theme in `app/globals.css`.
 */
export const og = {
  stock: "#fcfbf8",
  stock2: "#f4f2ec",
  ink: "#1a1815",
  ink2: "#4c483f",
  ink3: "#767166",
  rule: "#dcd8ce",
  mark: "#efc93d",
} as const;

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 600;
  style: "normal";
};

/**
 * Resolve Archivo through the Google Fonts CSS API at build time. Wrapped so a
 * network failure degrades the preview to the platform sans rather than
 * failing the production build — the layout carries the design either way.
 */
export async function loadDocFonts(): Promise<OgFont[]> {
  const weights = [400, 600] as const;

  const results = await Promise.all(
    weights.map(async (weight) => {
      try {
        const css = await fetch(
          `https://fonts.googleapis.com/css2?family=Archivo:wght@${weight}`,
          { headers: { "User-Agent": "Mozilla/5.0" } },
        ).then((response) => response.text());

        const source = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype)'\)/)
          ?? css.match(/src:\s*url\(([^)]+)\)/);
        const url = source?.[1];
        if (!url) return null;

        const data = await fetch(url).then((response) => response.arrayBuffer());
        return { name: "Archivo", data, weight, style: "normal" as const };
      } catch {
        return null;
      }
    }),
  );

  return results.filter((font): font is OgFont => font !== null);
}

export const ogFontFamily = "Archivo, Helvetica, Arial, sans-serif";
