import { ImageResponse } from "next/og";

import { portfolio } from "@/data/portfolio";
import { loadDocFonts, og, ogFontFamily } from "@/lib/og";

export const alt =
  "Aayush Tiwari: software engineering, AI systems, and data infrastructure";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const siteLabel = portfolio.metadata.siteUrl.replace(/^https?:\/\//, "");
  const fonts = await loadDocFonts();
  const current = portfolio.experiences[0];

  const metaRows: readonly (readonly [string, string])[] = [
    ["Author", portfolio.identity.fullName],
    ["Discipline", portfolio.identity.descriptor],
    ["Location", portfolio.identity.location],
    ["Most recent", `${current.role}, ${current.company}`],
  ];

  return new ImageResponse(
    (
      <div
        style={{
          background: og.stock,
          color: og.ink,
          display: "flex",
          flexDirection: "column",
          fontFamily: ogFontFamily,
          height: "100%",
          justifyContent: "space-between",
          padding: "56px 64px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              borderBottom: `2px solid ${og.ink}`,
              color: og.ink3,
              display: "flex",
              fontSize: 20,
              gap: 28,
              letterSpacing: "0.1em",
              paddingBottom: 14,
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: og.ink }}>Engineering portfolio</span>
            <span>Updated {portfolio.metadata.lastUpdated}</span>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 66,
              fontWeight: 600,
              letterSpacing: "-0.035em",
              lineHeight: 1.02,
              marginTop: 44,
              maxWidth: 900,
            }}
          >
            {portfolio.identity.headline}
          </div>
        </div>

        <div style={{ display: "flex", gap: 32, justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", width: 645 }}>
            {metaRows.map(([label, value]) => (
              <div
                key={label}
                style={{
                  borderTop: `1px solid ${og.rule}`,
                  display: "flex",
                  gap: 22,
                  paddingBottom: 9,
                  paddingTop: 9,
                }}
              >
                <span
                  style={{
                    color: og.ink3,
                    display: "flex",
                    flexShrink: 0,
                    fontSize: 15,
                    letterSpacing: "0.09em",
                    textTransform: "uppercase",
                    width: 145,
                  }}
                >
                  {label}
                </span>
                <span style={{ display: "flex", fontSize: 19 }}>{value}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              alignItems: "flex-end",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              width: 355,
            }}
          >
            <div
              style={{
                background: og.mark,
                color: og.ink,
                display: "flex",
                fontSize: 20,
                fontWeight: 600,
                lineHeight: 1.3,
                maxWidth: 355,
                padding: "12px 18px",
                textAlign: "right",
              }}
            >
              {portfolio.identity.availability}
            </div>
            <div style={{ color: og.ink3, display: "flex", fontSize: 18, marginTop: 18 }}>
              {siteLabel}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length > 0 ? fonts : undefined },
  );
}
