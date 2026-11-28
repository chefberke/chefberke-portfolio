import type { MetadataRoute } from "next";
import { getPostList } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

// Written as a file, not answered as a route: `output: "export"` draws a
// metadata route at build time only if the route says it is static.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPostList();

  return [
    /*
     * No `lastModified` on the home page. The only date there is to give it is
     * the build's, and a page stamped as changed on every deploy teaches a
     * crawler that this site's dates mean nothing -- including the true ones on
     * the posts below. Leaving it out says nothing rather than something false.
     */
    {
      url: `${SITE_URL}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    /*
     * The shelf changes when a note is added to it, so its date is the newest
     * note's. `getPostList` is newest first.
     */
    {
      url: `${SITE_URL}/blog`,
      ...(posts[0] && { lastModified: new Date(posts[0].date) }),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    /*
     * Every published post. Drafts are already gone -- `getPostList` drops them
     * -- so there is no second place to remember.
     *
     * `yearly`, unlike the two pages above it: a note is written once and then
     * stands, and telling a crawler it changes every week is the same kind of
     * mismatch as the build date above. The date is the post's own, not the
     * build's, so rebuilding the site does not claim every note was rewritten.
     */
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
