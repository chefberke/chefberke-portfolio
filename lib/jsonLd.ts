import profile from "@/data/profile.json";
import { PROFILE_URLS } from "@/lib/social";
import { SITE_URL } from "@/lib/site";

/**
 * The structured data for the page: one `Person`, one `WebSite`, in one graph.
 *
 * Meta tags describe a document. This describes a person, which is the thing a
 * portfolio is actually about -- it is what lets a search engine tie the name
 * on this page to the GitHub, LinkedIn, and X accounts in the footer, and treat
 * the four as one entity rather than four strangers who share a name.
 *
 * Every field is derived from `data/profile.json` and `lib/social.ts` rather
 * than restated here. Structured data that disagrees with the page it sits on
 * is the one failure mode that costs more than having none, and the only way to
 * keep the two in step is to give them one source.
 */

/**
 * A graph, written out for the one place it is ever put: inside a `<script>`.
 *
 * `JSON.stringify` escapes what JSON needs escaped -- quotes and backslashes --
 * and `<` is not one of them. So a string anywhere in the graph holding
 * `</script>` closes the tag it is sitting in, and everything after it is read
 * by the HTML parser as markup rather than as data. The values here are written
 * in this repository rather than sent by anyone, which makes that a typo away
 * rather than an attack away, and the typo is not a strange one: a post about
 * HTML that quotes a closing tag, or writes `<!--`, is enough to break the rest
 * of the document's parse for good.
 *
 * `<` is the same character to anything reading the JSON and nothing at
 * all to the HTML tokenizer, so the structured data a crawler sees is
 * unchanged. Both scripts on the site go through here -- this graph on the home
 * page, and `lib/postJsonLd.ts` on a post.
 */
export function safeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/** "Izmir, Turkiye" -> "Izmir". The country is fixed below. */
const locality = profile.location.split(",")[0].trim();

/**
 * The current employer: the company holding a role that has not ended. The
 * dates are written for a reader ("Sep 2025 - Present"), so "Present" is the
 * marker, and if nothing is current the field is dropped rather than guessed.
 */
const currentEmployer = profile.experiences.find((experience) =>
  experience.roles.some((role) => role.date.toLowerCase().endsWith("present"))
)?.company;

/**
 * What he works with, taken from the stacks the projects are built on. The
 * badges are not rendered on the page any more, but they are still the most
 * honest list of tools here -- each one is claimed by a shipped project.
 */
const knowsAbout = [
  ...new Set(profile.projects.flatMap((project) => project.badges)),
];

const person = {
  "@type": "Person",
  // A stable id, so the WebSite node below can point at this one instead of
  // describing the same person a second time.
  "@id": `${SITE_URL}/#person`,
  name: profile.name,
  url: SITE_URL,
  image: `${SITE_URL}/images/chefberke.jpg`,
  jobTitle: profile.title,
  // The same sentence the page's meta description carries, and for the same
  // reason it names no framework: `knowsAbout` below is where a tool asks what
  // the work is done with, and it is filled from shipped projects rather than
  // from a claim written in prose.
  description:
    "Full stack developer building web and mobile products from idea to production, based in Izmir, Turkiye.",
  address: {
    "@type": "PostalAddress",
    addressLocality: locality,
    addressCountry: "TR",
  },
  knowsAbout,
  ...(currentEmployer && {
    worksFor: { "@type": "Organization", name: currentEmployer },
  }),
  sameAs: PROFILE_URLS,
};

const website = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: profile.name,
  inLanguage: "en",
  publisher: { "@id": `${SITE_URL}/#person` },
};

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [person, website],
};
