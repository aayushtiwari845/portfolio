import { ImageResponse } from "next/og";

import { portfolio } from "@/data/portfolio";

export const alt =
  "Aayush Tiwari — software engineering, AI systems, and data infrastructure";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function SystemGraph() {
  return (
    <svg
      aria-hidden="true"
      height="390"
      viewBox="0 0 390 390"
      width="390"
    >
      <g fill="none" stroke="#28404a" strokeWidth="1.5">
        <path d="M46 96L146 48L257 83L342 38" />
        <path d="M46 96L113 188L224 154L332 229" />
        <path d="M113 188L62 309L181 337L332 229" />
        <path d="M224 154L181 337" />
        <path d="M257 83L224 154L342 38" />
      </g>
      <g fill="#07090b" stroke="#6c8a95" strokeWidth="2">
        <circle cx="46" cy="96" r="8" />
        <circle cx="146" cy="48" r="6" />
        <circle cx="257" cy="83" r="7" />
        <circle cx="342" cy="38" r="5" />
        <circle cx="113" cy="188" r="7" />
        <circle cx="224" cy="154" r="10" />
        <circle cx="332" cy="229" r="7" />
        <circle cx="62" cy="309" r="5" />
        <circle cx="181" cy="337" r="8" />
      </g>
      <g fill="#a6fbff">
        <circle cx="224" cy="154" r="4" />
        <circle cx="332" cy="229" r="3" />
      </g>
      <g fill="#c7ff61">
        <circle cx="257" cy="83" r="3" />
      </g>
    </svg>
  );
}

export default function OpenGraphImage() {
  const siteLabel = portfolio.metadata.siteUrl.replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          backgroundColor: "#07090b",
          backgroundImage:
            "linear-gradient(rgba(85, 111, 122, 0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(85, 111, 122, 0.10) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          color: "#f3f1e9",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          overflow: "hidden",
          padding: "64px 70px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "68%",
          }}
        >
          <div
            style={{
              color: "#9da8aa",
              display: "flex",
              fontSize: 18,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {portfolio.identity.displayName} / Portfolio
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                color: "#a6fbff",
                display: "flex",
                fontSize: 17,
                letterSpacing: "0.16em",
                marginBottom: 24,
                textTransform: "uppercase",
              }}
            >
              Software / AI systems / Data
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 64,
                fontWeight: 600,
                letterSpacing: "-0.045em",
                lineHeight: 1.02,
                maxWidth: 760,
              }}
            >
              I build backend and data systems that keep AI behavior inspectable.
            </div>
          </div>

          <div
            style={{
              alignItems: "center",
              color: "#9da8aa",
              display: "flex",
              fontSize: 18,
              justifyContent: "space-between",
              letterSpacing: "0.08em",
              width: 710,
            }}
          >
            <span>{siteLabel}</span>
            <span style={{ color: "#c7ff61" }}>SYS / ACTIVE</span>
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            display: "flex",
            height: "100%",
            justifyContent: "center",
            position: "absolute",
            right: 22,
            top: 0,
            width: 430,
          }}
        >
          <SystemGraph />
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
