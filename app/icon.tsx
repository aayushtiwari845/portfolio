import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#07090b",
          border: "1px solid #34464d",
          color: "#f3f1e9",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          fontSize: 24,
          fontWeight: 700,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "-0.08em",
          position: "relative",
          width: "100%",
        }}
      >
        AT
        <div
          style={{
            background: "#c7ff61",
            borderRadius: 999,
            display: "flex",
            height: 7,
            position: "absolute",
            right: 7,
            top: 7,
            width: 7,
          }}
        />
      </div>
    ),
    size,
  );
}
