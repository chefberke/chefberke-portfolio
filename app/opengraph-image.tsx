import { ImageResponse } from "next/og";
import profile from "@/data/profile.json";
import { tokens } from "@/lib/tokens";
import { Card, CARD_SIZE, cardFonts, cardPhoto } from "@/lib/ogCard";

export const size = CARD_SIZE;
export const contentType = "image/png";

/**
 * The site's card: the top-left corner of the home page.
 *
 * Same three pieces in the same order the header sets them -- the photograph,
 * the name beside it, the role under that -- inside the frame `lib/ogCard.tsx`
 * draws. Someone who clicks this lands on the thing they were just looking at.
 *
 * The name is the one measurement the card does not scale from the page. On the
 * site it is 18px, quiet, because every other word around it is 14px and being
 * set on a different grid is the whole of its emphasis. Here there is nothing
 * around it and the card is read at half size, so it is the only thing that
 * carries -- and a pixel face is what it has to carry with.
 */
export default async function OpenGraphImage() {
  const [fonts, photo] = await Promise.all([cardFonts(), cardPhoto()]);

  return new ImageResponse(
    (
      <Card page="home">
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {/* The hairline around the photo is the frame's own color, so it sits
              in the card rather than on top of it -- as on the page. */}
          <div
            style={{
              display: "flex",
              border: `2px solid ${tokens.rule}`,
            }}
          >
            <img src={photo} width={124} height={124} alt="" />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div
              style={{
                fontFamily: "Geist Pixel",
                fontSize: 76,
                lineHeight: 1,
                letterSpacing: "-1.9px",
                textTransform: "lowercase",
                color: tokens.primary,
              }}
            >
              {profile.name}
            </div>
            <div
              style={{
                fontSize: 26,
                lineHeight: 1,
                letterSpacing: "1.3px",
                textTransform: "lowercase",
                color: tokens.faint,
              }}
            >
              {profile.title}
            </div>
          </div>
        </div>
      </Card>
    ),
    { ...CARD_SIZE, fonts }
  );
}
