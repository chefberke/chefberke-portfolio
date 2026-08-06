import { ImageResponse } from "next/og";
import { tokens } from "@/lib/tokens";
import { Card, CARD_SIZE, MICRO, cardFonts } from "@/lib/ogCard";
import { getPostList } from "@/lib/posts";

export const size = CARD_SIZE;
// Written as a file, not answered as a route: `output: "export"` draws a
// metadata route at build time only if the route says it is static.
export const dynamic = "force-static";
export const contentType = "image/png";

/**
 * The shelf's card.
 *
 * It exists because the frame now says which page it is standing for: without
 * a card of its own, `/blog` would share the home page's, and the gutter on it
 * would point at `home` while the reader was being shown the blog. One file is
 * cheaper than a frame that can lie.
 *
 * It carries the shelf's own line and a count under it, which is the only thing
 * this page has that the post cards do not -- and the count is read at build
 * time from the same folder the index is, so it cannot drift from the list.
 */
export default async function BlogOpenGraphImage() {
  const [fonts, posts] = await Promise.all([
    cardFonts(),
    Promise.resolve(getPostList()),
  ]);

  return new ImageResponse(
    (
      <Card page="blog">
        <div
          style={{
            display: "flex",
            fontSize: 52,
            lineHeight: 1.25,
            color: tokens.primary,
          }}
        >
          {posts.length > 0
            ? "Notes on what I am building."
            : "Nothing published yet."}
        </div>
        {posts.length > 0 ? (
          <div style={{ display: "flex", marginTop: 34 }}>
            {/* One string, not a number beside a word. Satori counts JSX
                children, and a box holding two of them has to declare a
                display -- so a label that interpolates is written as one. */}
            <div style={MICRO}>
              {`${posts.length} ${posts.length === 1 ? "note" : "notes"}`}
            </div>
          </div>
        ) : null}
      </Card>
    ),
    { ...CARD_SIZE, fonts }
  );
}
