import { SITE_URL } from "@/lib/site";
import type { PostMeta } from "@/lib/posts";

/**
 * The structured data for one post.
 *
 * It describes only the post. The author and the site are not described again
 * -- they are pointed at, by the two ids `lib/jsonLd.ts` already publishes on
 * the home page, which is the whole reason those ids are stable. A crawler that
 * has read either page knows who `#person` is.
 *
 * Every field comes from the same `PostMeta` the page renders. Structured data
 * that disagrees with the page it sits on is worse than none, and one source is
 * the only way to keep them in step.
 */
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
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
}
