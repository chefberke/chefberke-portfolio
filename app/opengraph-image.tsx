import { ImageResponse } from "next/og";
import profile from "@/data/profile.json";
import { Card, CARD_SIZE, cardFonts } from "@/lib/ogCard";

export const size = CARD_SIZE;
export const alt = `${profile.name}, ${profile.title.toLowerCase()}`;
// Written as a file, not answered as a route: `output: "export"` draws a
// metadata route at build time only if the route says it is static.
export const dynamic = "force-static";
export const contentType = "image/png";

/** The site's card: the name at the prompt, and what the name does under it. */
export default async function OpenGraphImage() {
  const fonts = await cardFonts();

  return new ImageResponse(<Card line={profile.name} sub={profile.title} />, {
    ...CARD_SIZE,
    fonts,
  });
}
