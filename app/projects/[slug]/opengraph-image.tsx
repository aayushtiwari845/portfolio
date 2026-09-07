import { ImageResponse } from "next/og";

import { portfolio, projects } from "@/data/portfolio";
import { getProjectStaticParams } from "@/lib/portfolio";
import { loadDocFonts, og, ogFontFamily } from "@/lib/og";

export const alt = "Aayush Tiwari portfolio project case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type ProjectImageProps = {
  params: Promise<{ slug: string }>;
};

// Prerender one preview per case study; the site ships no on-demand routes.
export function generateStaticParams() {
  return getProjectStaticParams();
}

export default async function ProjectOpenGraphImage({ params }: ProjectImageProps) {
  const { slug } = await params;
  const project = projects.find((entry) => entry.slug === slug);
  const fonts = await loadDocFonts();

  const title = project?.title ?? "Selected system";
  const subtitle = project?.subtitle ?? "Engineering case study";
  const domain = project?.domain ?? "Software / AI systems / Data";
  const status = project?.status ?? "Engineering case study";
  const siteLabel = portfolio.metadata.siteUrl.replace(/^https?:\/\//, "");

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
        <div
          style={{
            borderBottom: `2px solid ${og.ink}`,
            color: og.ink3,
            display: "flex",
            fontSize: 20,
            justifyContent: "space-between",
            letterSpacing: "0.1em",
            paddingBottom: 14,
            textTransform: "uppercase",
            width: "100%",
          }}
        >
          <span style={{ color: og.ink }}>{portfolio.identity.displayName} · Selected work</span>
          <span>{domain}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
          <div
            style={{
              display: "flex",
              fontSize: 82,
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 0.98,
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: og.ink2,
              display: "flex",
              fontSize: 30,
              lineHeight: 1.28,
              marginTop: 24,
              maxWidth: 900,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            alignItems: "flex-end",
            borderTop: `1px solid ${og.rule}`,
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 18,
            width: "100%",
          }}
        >
          <span style={{ color: og.ink3, display: "flex", fontSize: 19 }}>{siteLabel}</span>
          <span
            style={{
              background: og.mark,
              color: og.ink,
              display: "flex",
              fontSize: 19,
              fontWeight: 600,
              padding: "10px 16px",
            }}
          >
            {status}
          </span>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length > 0 ? fonts : undefined },
  );
}
