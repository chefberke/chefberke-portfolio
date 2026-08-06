import { ImageResponse } from "next/og";
import { formatPostDate, getPost, getPostSlugs } from "@/lib/posts";
import { tokens } from "@/lib/tokens";

/**
 * The card for one post: the site's own card with the post's title in it.
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

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function PostOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

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
          // for a monospace face and takes whatever the renderer has -- the
          // same trade the site card makes. See app/opengraph-image.tsx.
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
          berkekanber.com / blog
        </div>
        {/* A title is as long as it is. It wraps to a third line rather than
            being cut, since half a sentence on a card is worse than a small
            one. `display: flex` is Satori's requirement for a wrapping box. */}
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 56,
            lineHeight: 1.2,
          }}
        >
          {post?.meta.title ?? "berke kanber"}
        </div>
        {post ? (
          <div
            style={{
              marginTop: 16,
              fontSize: 30,
              color: tokens.faint,
            }}
          >
            {formatPostDate(post.meta.date)}
          </div>
        ) : null}
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
