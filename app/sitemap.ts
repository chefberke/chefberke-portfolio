import type { MetadataRoute } from "next";
import { getPostList } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

// Written as a file, not answered as a route: `output: "export"` draws a
// metadata route at build time only if the route says it is static.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    /*
     * Every published post. Drafts are already gone -- `getPostList` drops them
     * -- so there is no second place to remember.
     *
     * `yearly`, unlike the two pages above it: a note is written once and then
     * stands, and telling a crawler it changes every week is the same kind of
     * mismatch lib/site.ts warns about. The date is the post's own, not the
     * build's, so rebuilding the site does not claim every note was rewritten.
     */
    ...getPostList().map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
