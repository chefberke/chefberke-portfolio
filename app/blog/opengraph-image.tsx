import { ImageResponse } from "next/og";
import { Card, CARD_SIZE, cardFonts } from "@/lib/ogCard";
import { getPostList } from "@/lib/posts";

export const size = CARD_SIZE;
export const alt = "Notes on what I am building, by Berke Kanber";
// Written as a file, not answered as a route: `output: "export"` draws a
// metadata route at build time only if the route says it is static.
export const dynamic = "force-static";
export const contentType = "image/png";

/**
 * The shelf's card: the shelf's own line, and a count under it.
 *
 * The count is the one thing this page has that the post cards do not, and it
 * is read at build time from the same folder the index is, so it cannot drift
 * from the list.
 */
export default async function BlogOpenGraphImage() {
  const fonts = await cardFonts();
  const count = getPostList().length;

  return new ImageResponse(
    count > 0 ? (
      <Card
        line="Notes on what I am building"
        sub={`${count} ${count === 1 ? "note" : "notes"}`}
      />
    ) : (
      <Card line="Nothing published yet" />
    ),
    { ...CARD_SIZE, fonts }
  );
}
