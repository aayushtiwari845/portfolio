import { ImageResponse } from "next/og";

import { portfolio, projects } from "@/data/portfolio";

export const alt = "Aayush Tiwari portfolio project case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type ProjectImageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectOpenGraphImage({
  params,
}: ProjectImageProps) {
  const { slug } = await params;
  const project = projects.find((entry) => entry.slug === slug);

  const index = project?.index ?? "SYS / 00";
  const title = project?.title ?? "Selected System";
  const subtitle = project?.subtitle ?? "Engineering case study";
  const domain = project?.domain ?? "Software / AI systems / Data";
  const siteLabel = portfolio.metadata.siteUrl.replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "#07090b",
          backgroundImage:
            "linear-gradient(rgba(85, 111, 122, 0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(85, 111, 122, 0.10) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          color: "#f3f1e9",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          justifyContent: "space-between",
          overflow: "hidden",
          padding: "64px 70px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            color: "#9da8aa",
            display: "flex",
            fontSize: 17,
            justifyContent: "space-between",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            width: "100%",
          }}
        >
          <span>Aayush Tiwari / Selected systems</span>
          <span style={{ color: "#c7ff61" }}>{index}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
          <div
            style={{
              color: "#a6fbff",
              display: "flex",
              fontSize: 18,
              letterSpacing: "0.15em",
              marginBottom: 24,
              textTransform: "uppercase",
            }}
          >
            {domain}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 78,
              fontWeight: 600,
              letterSpacing: "-0.05em",
              lineHeight: 0.95,
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: "#aeb8b9",
              display: "flex",
              fontSize: 29,
              lineHeight: 1.25,
              marginTop: 26,
              maxWidth: 940,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            color: "#8b979a",
            display: "flex",
            fontSize: 17,
            justifyContent: "space-between",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            width: "100%",
          }}
        >
          <span>{siteLabel}</span>
          <span>Architecture / Metrics / Engineering</span>
        </div>

        <div
          style={{
            background: "#a6fbff",
            display: "flex",
            height: 2,
            left: 0,
            position: "absolute",
            top: 0,
            width: 190,
          }}
        />
      </div>
    ),
    size,
  );
}
