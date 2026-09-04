import { ImageResponse } from "next/og";

import { loadDocFonts, og, ogFontFamily } from "@/lib/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * The section mark, not a monogram. PRODUCT.md records that no logo or
 * wordmark beyond the name itself exists, so the icon uses the document's own
 * notation — the character the whole site is organised around — rather than
 * inventing initials or a brand device.
 *
 * It is set in the site's own Archivo, loaded the same way the Open Graph
 * routes load it. Falling back to whichever face the build container happens
 * to ship would make the glyph unpredictable and put a face outside the type
 * system on the one asset that appears in every browser tab.
 */
export default async function Icon() {
  const fonts = await loadDocFonts();

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: og.ink,
          color: og.stock,
          display: "flex",
          fontFamily: ogFontFamily,
          fontSize: 40,
          fontWeight: 600,
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        §
      </div>
    ),
    { ...size, fonts: fonts.length > 0 ? fonts : undefined },
  );
}
