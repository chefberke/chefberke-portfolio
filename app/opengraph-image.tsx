import { ImageResponse } from "next/og";
import { tokens } from "@/lib/tokens";

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
          backgroundColor: tokens.surface,
          color: tokens.primary,
          // Satori cannot read the vendored Ioskeley woff2, so the card asks
          // for a monospace face and takes whatever the renderer has. It still
          // carries the page's colors and its lowercase voice.
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            color: tokens.faint,
          }}
        >
          berkekanber.com
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 64,
            lineHeight: 1.1,
          }}
        >
          berke kanber
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 30,
            color: tokens.faint,
          }}
        >
          full stack developer
        </div>
        {/* One blue rule, the same accent the page uses for everything live. */}
        <div
          style={{
            marginTop: 40,
            width: 120,
            height: 6,
            backgroundColor: tokens.link,
          }}
        />
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    }
  );
}
