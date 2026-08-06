/**
 * The off-site links, in one place, because two different things read them.
 *
 * The footer renders them as words. The Person schema in `lib/jsonLd.ts` hands
 * the profile URLs to Google as `sameAs`, which is how a search engine is told
 * that this site and those accounts are the same person. Kept as two lists they
 * drift, and a `sameAs` pointing at an account that is no longer linked from the
 * page is worse than no `sameAs` at all.
 */
export type SocialLink = {
  label: string;
  href: string;
  /**
   * True when the URL is a profile Berke owns, rather than a file this site
   * serves. Only these get `rel="me"` in the markup and only these are listed
   * as `sameAs` in the structured data -- the CV is a document, not an
   * identity.
   */
  me?: boolean;
};

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "x (twitter)", href: "https://x.com/chef_berke", me: true },
  { label: "github", href: "https://github.com/chefberke", me: true },
  {
    label: "linkedin",
    href: "https://www.linkedin.com/in/berkekanber",
    me: true,
  },
  { label: "cv", href: "/documents/berke-kanber-cv.pdf" },
];

/** The `me` links only -- the set that identifies the person behind the site. */
export const PROFILE_URLS = SOCIAL_LINKS.filter((link) => link.me).map(
  (link) => link.href
);
