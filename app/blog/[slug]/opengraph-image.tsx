import { ImageResponse } from "next/og";
import { formatPostDate, getPost, getPostSlugs } from "@/lib/posts";
import { Card, CARD_SIZE, cardFonts } from "@/lib/ogCard";

/**
 * The card for one post: its title at the prompt, the date and reading time
 * under it.
 *
 * `generateStaticParams` is exported from this file rather than inherited from
 * the page beside it, and it is what makes the difference between a set of PNGs
 * written at build time and a function that renders one per request. Next
 * compiles a metadata image into its own route handler and re-exports the named
 * exports it finds here; without this one, the `[slug]` segment has no params
 * to fill and the route stays dynamic -- which the deploy target refuses.
 *
 * One thing this file cannot say: `dynamicParams = false`. The same loader
 * strips it, so this route alone in the folder cannot state that its list of
 * slugs is the whole list. Under `output: "export"` it does not have to: a
 * build writes one PNG per slug and stops, and a slug that was never listed is
 * a path that does not exist rather than a fallback waiting to be rendered.
 */
export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export const size = CARD_SIZE;
// Written as a file, not answered as a route: `output: "export"` draws a
// metadata route at build time only if the route says it is static.
export const dynamic = "force-static";
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
    // A title is as long as it is: it wraps rather than being cut, and the
    // cursor follows it down to the last word.
    <Card
      line={post?.meta.title ?? "Notes on what I am building"}
      sub={
        post
          ? `${formatPostDate(post.meta.date)} · ${post.meta.readingMinutes} min read`
          : undefined
      }
    />,
    { ...CARD_SIZE, fonts }
  );
}
