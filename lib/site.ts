/**
 * The canonical origin, written once.
 *
 * `metadataBase`, the sitemap, the robots file, and the structured data all
 * have to agree on this string -- a canonical tag pointing at one host and a
 * sitemap listing another is the kind of mismatch a crawler resolves by
 * ignoring both. No trailing slash: everything below joins onto it.
 */
export const SITE_URL = "https://berkekanber.com";
