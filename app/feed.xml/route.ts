import profile from "@/data/profile.json";
import { getPostList } from "@/lib/posts";
import { FEED_PATH, SITE_URL } from "@/lib/site";

// Written as a file, not answered as a route: `output: "export"` draws a
// route handler at build time only if the route says it is static.
export const dynamic = "force-static";

/**
 * The blog as RSS 2.0: every published note, newest first.
 *
 * Each item carries the note's title, its one-sentence description and its
 * date -- the same three things the index line shows -- and not the body. The
 * markdown pipeline stops at a tree and builds no HTML string on purpose (see
 * `lib/markdown.ts`), and a feed is a way to hear that a note exists, not a
 * second place to read it.
 *
 * Drafts are already gone: `getPostList` drops them, as it does for the index
 * and the sitemap.
 */
export function GET() {
  const posts = getPostList();
  const blogUrl = `${SITE_URL}/blog`;

  const items = posts
    .map((post) => {
      const url = `${blogUrl}/${post.slug}`;

      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${escapeXml(post.description)}</description>`,
        `      <pubDate>${rfc822(post.date)}</pubDate>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(profile.name)}</title>`,
    `    <link>${blogUrl}</link>`,
    `    <description>Notes on what I am building.</description>`,
    "    <language>en</language>",
    `    <atom:link href="${SITE_URL}${FEED_PATH}" rel="self" type="application/rss+xml"/>`,
    // The newest note's date rather than the build's, for the same reason the
    // sitemap gives one: a feed that changes date on every deploy is a feed
    // whose dates mean nothing.
    ...(posts[0]
      ? [`    <lastBuildDate>${rfc822(posts[0].date)}</lastBuildDate>`]
      : []),
    items,
    "  </channel>",
    "</rss>",
    "",
  ]
    .filter(Boolean)
    .join("\n");

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}

/** "2026-08-06" -> "Thu, 06 Aug 2026 00:00:00 GMT", the date RSS asks for. */
function rfc822(isoDate: string): string {
  return new Date(isoDate).toUTCString();
}

/** The five characters XML text may not hold as themselves. */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
