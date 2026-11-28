import profile from "@/data/profile.json";
import { SITE_URL } from "@/lib/site";
import type { PostMeta } from "@/lib/posts";

/**
 * The structured data for one post.
 *
 * It describes the post, and points at the site by the id `lib/jsonLd.ts`
 * publishes on the home page. The author is the one thing it also names in
 * place: Google reads a post's structured data one page at a time and does not
 * follow an `@id` to another page, so an author given only as `#person` is an
 * article with no author's name on it. The id stays beside the name, so a
 * crawler that has read both pages still knows the two are the same person.
 *
 * Every field comes from the same `PostMeta` the page renders. Structured data
 * that disagrees with the page it sits on is worse than none, and one source is
 * the only way to keep them in step.
 */
const author = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: profile.name,
  url: SITE_URL,
};

export function postJsonLd(meta: PostMeta) {
  const url = `${SITE_URL}/blog/${meta.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: meta.title,
    description: meta.description,
    // A post is written once and stands. When one is genuinely revised, the two
    // dates part company and this is where the second one goes.
    datePublished: meta.date,
    dateModified: meta.date,
    wordCount: meta.wordCount,
    inLanguage: "en",
    image: `${url}/opengraph-image`,
    author,
    publisher: author,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
}
