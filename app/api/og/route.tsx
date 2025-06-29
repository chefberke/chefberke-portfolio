import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <h1
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "#404040",
              margin: 0,
              fontFamily: "Poppins",
            }}
          >
            Berke Kanber
          </h1>
          <p
            style={{
              fontSize: "36px",
              color: "#737373",
              margin: 0,
              fontFamily: "Poppins",
            }}
          >
            Software Developer
          </p>
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            <span
              style={{
                background: "#f5f5f5",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "24px",
                color: "#404040",
                fontFamily: "Poppins",
              }}
            >
              React
            </span>
            <span
              style={{
                background: "#f5f5f5",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "24px",
                color: "#404040",
                fontFamily: "Poppins",
              }}
            >
              Next.js
            </span>
            <span
              style={{
                background: "#f5f5f5",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "24px",
                color: "#404040",
                fontFamily: "Poppins",
              }}
            >
              Node.js
            </span>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "24px",
            color: "#a3a3a3",
            fontFamily: "Poppins",
          }}
        >
          berkekanber.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
