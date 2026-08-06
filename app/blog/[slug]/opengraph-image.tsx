import { ImageResponse } from "next/og";
import { formatPostDate, getPost, getPostSlugs } from "@/lib/posts";
import { tokens } from "@/lib/tokens";
import { Card, CARD_SIZE, MICRO, cardFonts } from "@/lib/ogCard";

/**
 * The card for one post: the top of that post, in the site's frame.
 *
 * `generateStaticParams` is exported from this file rather than inherited from
 * the page beside it, and it is what makes the difference between a set of PNGs
 * written at build time and a function that renders one per request. Next
 * compiles a metadata image into its own route handler and re-exports the named
 * exports it finds here; without this one, the `[slug]` segment has no params
 * to fill and the route stays dynamic -- which the deploy target refuses.
 *
 * One thing this file cannot say: `dynamicParams = false`. The same loader
 * strips it, so the route keeps a blocking fallback for slugs that do not
 * exist, and `bun run build` reports `fallback=null` for it in
 * `.next/prerender-manifest.json`. Every real card is a finished PNG, and the
 * page beside this one 404s before an unknown slug could ever reach the image,
 * so nothing links to that path. If the deploy ever refuses the route for
 * having it, delete this file and name the site-wide card in the page's
 * `openGraph.images` instead; the cost is that every post shares one picture.
 * `dynamic = "force-static"` and a segment layout were both tried and neither
 * closes it.
 */
export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export const size = CARD_SIZE;
export const contentType = "image/png";

export default async function PostOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  const fonts = await cardFonts();

  return new ImageResponse(
    (
      // The gutter says `blog` in blue, which is the same thing the label above
      // a post title says on the page -- so the column here opens on the title
      // itself rather than repeating the word two inches to its right.
      <Card page="blog">
        {/* A title is as long as it is. It wraps rather than being cut, since
            half a sentence on a card is worse than a small one, and it is set
            at the page's own body color and case. `display: flex` is Satori's
            requirement for a box whose text has to wrap. */}
        <div
          style={{
            display: "flex",
            fontSize: 52,
            lineHeight: 1.25,
            color: tokens.primary,
          }}
        >
          {post?.meta.title ?? "Notes on what I am building."}
        </div>

        {/* What is known about it, in the one line the page sets it on: the
            date and the reading time, both micro labels, neither qualified. */}
        {post ? (
          <div style={{ display: "flex", gap: 34, marginTop: 34 }}>
            <div style={MICRO}>{formatPostDate(post.meta.date)}</div>
            {/* One string, not a number beside a word: Satori counts JSX
                children, and a box holding two of them has to declare a
                display. */}
            <div style={MICRO}>{`${post.meta.readingMinutes} min read`}</div>
          </div>
        ) : null}
      </Card>
    ),
    { ...CARD_SIZE, fonts }
  );
}
