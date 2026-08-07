import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * The posts, read off disk.
 *
 * A post is one markdown file in `content/posts`, and the filename is the slug
 * -- there is no index, no manifest, and nothing to keep in step with the
 * folder. Adding a post is adding a file.
 *
 * Everything here runs at build time and only at build time. Every blog route
 * is prerendered (see `app/blog/[slug]/page.tsx`), so `node:fs` is touched
 * while `next build` is running and never while anyone is reading. That is not
 * a nicety: the deploy target refuses server functions, so a route that reached
 * for the filesystem on request would not run at all.
 *
 * A malformed post throws, and the message names the file. This is the opposite
 * of what `lib/github.ts` does, and deliberately so -- that file swallows its
 * failures because the shape it parses is GitHub's to change without warning.
 * A post is yours, in your repository, and a missing `description` is a typo you
 * made a minute ago. Skipping it would mean the only signal is a post quietly
 * absent from a page. Failing the build says which file and which field, at the
 * one moment you are looking. To leave a post out on purpose, mark it a draft.
 */
const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/** The slug is a URL, so it is held to what a URL can say plainly. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * A prose reader does about 200 words a minute. Medium's 265 is tuned for
 * magazine copy and reads as optimistic on a page with code in it.
 */
const WORDS_PER_MINUTE = 200;

export interface PostMeta {
  /** The filename, without `.md`. */
  slug: string;
  title: string;
  /** One sentence. It is the meta description, the card, and the index line. */
  description: string;
  /** ISO date, "2026-08-06". */
  date: string;
  readingMinutes: number;
  wordCount: number;
  draft: boolean;
}

export interface Post {
  meta: PostMeta;
  /** The markdown body, frontmatter already removed. */
  body: string;
}

/** The one form a written-out date may take. Anything else is refused. */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * YAML parses an unquoted `2026-08-06` into a Date, and a quoted one into a
 * string. Both are reasonable things to write, so both are accepted and pinned
 * back to the one form the rest of the site uses.
 *
 * A Date is read in UTC. It was written with no time in it, so reading it in
 * the build machine's zone would move a post published near midnight to the day
 * before.
 *
 * A string has to already be exactly `2026-08-06`, checked before anything is
 * cut off it rather than after. `Date.parse` alone would take `August 6, 2026`,
 * and slicing ten characters off that gives `August 6, ` -- a string that is not
 * a date, passes every check after this one, sorts by its first letter, and
 * prints as 5 August 2001. A wrong date that looks right is worse than a build
 * that stops, which is the whole argument of this file.
 *
 * The round trip is what catches `2026-02-31`. The shape is right and `Date` is
 * happy to take it: V8 rolls the extra days over and hands back the third of
 * March, quietly moving a post five days. Reading the date back out and asking
 * whether it is still the one that was written is the only test that says no.
 */
function toIsoDate(value: unknown): string | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? null
      : value.toISOString().slice(0, 10);
  }

  if (typeof value === "string") {
    const written = value.trim();

    if (ISO_DATE.test(written)) {
      // A date-only string is read as UTC midnight, so this comes back in the
      // zone it went in as.
      const read = new Date(written);

      if (!Number.isNaN(read.getTime()) && read.toISOString().startsWith(written)) {
        return written;
      }
    }
  }

  return null;
}

/**
 * `draft` is the one key a post may leave out, so it is also the one key whose
 * absence has to be told apart from a value that is wrong.
 *
 * The test cannot be `data.draft === true` on its own. YAML 1.2 reads `yes`,
 * `on` and `'true'` as strings, so all three would fail that test quietly and
 * publish the post -- the exact outcome the key exists to prevent, arrived at by
 * a keystroke. It is refused by name instead.
 */
function readDraft(value: unknown, file: string): boolean {
  if (value === undefined || value === null) return false;

  if (typeof value !== "boolean") {
    throw new Error(
      `content/posts/${file}: "draft" is ${JSON.stringify(value)}. It has to be true or false -- YAML reads yes, on and 'true' as text, not as a flag.`
    );
  }

  return value;
}

function requireString(
  value: unknown,
  field: string,
  file: string
): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(
      `content/posts/${file}: "${field}" is missing. A post needs a title, a description, and a date.`
    );
  }

  return value.trim();
}

/**
 * Code is not read at prose speed. A forty-line snippet would otherwise triple
 * the estimate for a post that takes no longer to get through, so fenced blocks
 * are dropped before the words are counted.
 */
function countWords(body: string): number {
  const prose = body.replace(/^```[\s\S]*?^```/gm, " ");
  return prose.split(/\s+/).filter(Boolean).length;
}

/**
 * The one heading a post does not get to write is its own `h1` -- that is the
 * title, and the page has already set it. Two of them is a defect in the
 * document outline rather than a matter of taste, so it is refused rather than
 * quietly demoted; a heading that renders a level below what was typed is a
 * surprise every single time.
 *
 * Fenced blocks are cut out first, or a shell comment in a code sample would
 * read as a heading.
 */
function assertHeadings(body: string, file: string): void {
  const prose = body.replace(/^```[\s\S]*?^```/gm, "");
  const offender = prose.match(/^# .+/m);

  if (offender) {
    throw new Error(
      `content/posts/${file}: "# " headings are not allowed -- the h1 is the post title. Start at "## ".`
    );
  }
}

/**
 * Frontmatter is YAML, and gray-matter has to be told so.
 *
 * Left to its defaults it dispatches on whatever word is written after the
 * opening `---`, and one of the languages it will dispatch to is JavaScript --
 * an engine that is a literal `eval`. A file beginning `---js` is then not a
 * document with a header on it, it is a program, and it runs with the build's
 * own reach before a single check in this file has looked at it. That is a
 * post's header executing `child_process`, which is not a thing a post's header
 * should be able to spell.
 *
 * `js` and `javascript` both resolve to the one entry replaced here, so the
 * alias is closed along with the name. `json` is replaced too -- it is only
 * `JSON.parse` and nothing about it is unsafe, but a header has one form on
 * this site, and a second accepted form is a second thing to remember. Every
 * other language gray-matter knows a name for is unregistered already and
 * throws on its own.
 *
 * It is refused by name, in the voice the rest of this file refuses things in,
 * rather than parsed as YAML anyway: a header written as JavaScript is not a
 * header with a typo in it, it is a file that was expecting to be run.
 */
function yamlOnly(file: string) {
  const refuse = (): never => {
    throw new Error(
      `content/posts/${file}: frontmatter has to be YAML. Open it with "---" and nothing written after it.`
    );
  };

  return { engines: { javascript: refuse, json: refuse } };
}

function readPost(file: string): Post {
  const slug = file.replace(/\.md$/, "");

  if (!SLUG.test(slug)) {
    throw new Error(
      `content/posts/${file}: the filename is the URL, so it may hold only lowercase letters, digits and single hyphens.`
    );
  }

  const { data, content } = matter(
    readFileSync(path.join(POSTS_DIR, file), "utf8"),
    yamlOnly(file)
  );
  const date = toIsoDate(data.date);

  if (!date) {
    throw new Error(
      `content/posts/${file}: "date" is missing or unreadable. Write it as 2026-08-06.`
    );
  }

  assertHeadings(content, file);

  const wordCount = countWords(content);

  return {
    meta: {
      slug,
      title: requireString(data.title, "title", file),
      description: requireString(data.description, "description", file),
      date,
      wordCount,
      readingMinutes: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
      draft: readDraft(data.draft, file),
    },
    body: content,
  };
}

/**
 * A draft is kept out of the built site but stays readable at its own URL while
 * you are writing it, so `bun dev` shows you the real page rather than a
 * preview of one.
 */
function isPublished(post: Post): boolean {
  return !post.meta.draft || process.env.NODE_ENV !== "production";
}

function readAll(): Post[] {
  return readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map(readPost)
    .filter(isPublished)
    .sort((a, b) => {
      const byDate = b.meta.date.localeCompare(a.meta.date);
      // Two posts on one day would otherwise sit in whatever order the
      // filesystem handed them over, which is not the same order twice.
      return byDate !== 0 ? byDate : a.meta.slug.localeCompare(b.meta.slug);
    });
}

/** Every published slug, newest first. Feeds `generateStaticParams`. */
export function getPostSlugs(): string[] {
  return readAll().map((post) => post.meta.slug);
}

/** Every published post's front matter, newest first. No bodies. */
export function getPostList(): PostMeta[] {
  return readAll().map((post) => post.meta);
}

/** One post, or nothing. Unknown slugs cannot be reached in a built site. */
export function getPost(slug: string): Post | undefined {
  return readAll().find((post) => post.meta.slug === slug);
}

/**
 * The date said aloud, in the same voice `Contributions` uses for a day in the
 * grid. It lives here rather than beside its two call sites because the module
 * that decided the date's shape is the one that should say how it is read.
 *
 * `timeZone: "UTC"` is load-bearing. `new Date("2026-08-06")` is UTC midnight,
 * so a renderer anywhere west of Greenwich would print the fifth.
 */
const postDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatPostDate(date: string): string {
  return postDate.format(new Date(date));
}
