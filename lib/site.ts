/**
 * The canonical origin, written once.
 *
 * `metadataBase`, the sitemap, the robots file, and the structured data all
 * have to agree on this string -- a canonical tag pointing at one host and a
 * sitemap listing another is the kind of mismatch a crawler resolves by
 * ignoring both. No trailing slash: everything below joins onto it.
 */
export const SITE_URL = "https://berkekanber.com";

/**
 * The parts of a page's share tags that are about the site, not the page.
 *
 * Next merges metadata key by key, and a page that sets `openGraph`, `twitter`
 * or `alternates` replaces the root layout's object whole rather than adding to
 * it. So a field set only in the layout is on the home page and silently gone
 * from every page that names its own title -- which is how the blog and every
 * post went out without a site name, a locale, the X handle or the feed link.
 * Every route that sets one of these objects spreads the matching piece in.
 *
 * The locale is the language the site is written in, not where it is written
 * from: `<html lang>` and the structured data both say English.
 */
export const OPEN_GRAPH_BASE = {
  siteName: "Berke Kanber",
  locale: "en_US",
} as const;

export const TWITTER_BASE = {
  card: "summary_large_image",
  // The handle as it is on X -- and as the footer links to it. A card
  // attributed to an account that does not exist is dropped, not guessed at.
  creator: "@chef_berke",
} as const;

/** The RSS feed, `app/feed.xml/route.ts`, announced in every page's head. */
export const FEED_PATH = "/feed.xml";

export const FEED_ALTERNATE = {
  "application/rss+xml": [{ url: FEED_PATH, title: "Berke Kanber" }],
};
