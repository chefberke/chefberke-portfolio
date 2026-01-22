import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "96px 100px",
          backgroundColor: "#0a0a0a",
          color: "#f5f5f5",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: "1.5px",
            color: "#9ca3af",
          }}
        >
          berkekanber.com
        </div>
        <div
          style={{
            marginTop: 22,
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            display: "flex",
            alignItems: "baseline",
            gap: 12,
          }}
        >
          Berke Kanber{" "}
          <span style={{ fontWeight: 400, color: "#d1d5db" }}>
            | Software Developer
          </span>
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    }
  );
}
