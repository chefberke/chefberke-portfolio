import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import type { BuiltinLanguage, LanguageRegistration } from "shiki";
import type { Root } from "hast";
import { codeTheme } from "@/lib/codeTheme";
import { noteGrammar } from "@/lib/noteGrammar";
import { rehypeImageSize } from "@/lib/rehypeImageSize";

/**
 * Markdown in, a tree out.
 *
 * The tree is the point. Most of the ways to put markdown on a page end at an
 * HTML string, and a string cannot hold a component -- so an image in a post
 * stays an unoptimised `<img>` and a link to another page stays a full page
 * load. This stops one step short of that, at the tree, and
 * `components/post/PostBody.tsx` turns the tree into React elements with its
 * own components in the places that need them.
 *
 * There is no compiler on this pipeline, which is why `run(parse(x))` is used
 * rather than `process(x)` -- `process` would want one. That absence is the
 * real guarantee that no HTML string is ever built here, and it is a stronger
 * thing to be able to say than "we do not call `dangerouslySetInnerHTML`".
 *
 * `remark-rehype` drops raw HTML rather than passing it through, because it is
 * not given `allowDangerousHtml`. So a `<div>` written into a post disappears
 * instead of rendering. That is the correct trade for a site whose markup is
 * its design, and it is worth knowing before wondering where a `<br>` went.
 *
 * The whole thing is built once, at module scope, and frozen. Everything here
 * runs during `next build` and never during a request.
 */

/**
 * The languages a post may use. The default is every grammar Shiki ships --
 * about two hundred of them -- and the ten here are the ones this site is
 * written in. An unknown language falls back to plain text rather than failing
 * the build, since a post is not worth breaking a deploy over.
 *
 * `note` is the one that is not a programming language. It is this site's own,
 * for lists and bars drawn in text -- see `lib/noteGrammar.ts`.
 */
const LANGS: Array<BuiltinLanguage | LanguageRegistration> = [
  noteGrammar,
  "ts",
  "tsx",
  "js",
  "jsx",
  "json",
  "bash",
  "css",
  "html",
  "md",
  "diff",
];

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeImageSize)
  .use(rehypeShiki, {
    theme: codeTheme,
    langs: LANGS,
    fallbackLanguage: "text",
    // Stops Shiki writing `background-color` and `color` onto the <pre>. The
    // block sits on the page's own paper and is ruled by `.post pre` in
    // styles/globals.css; an inline style would have to be fought from there.
    rootStyle: false,
    // The theme has three colors, so neighbouring tokens nearly always share
    // one. Collapsing those into a single span cuts the markup in a long block
    // several times over.
    mergeSameStyleTokens: true,
  })
  .freeze();

export async function markdownToHast(body: string): Promise<Root> {
  return processor.run(processor.parse(body)) as Promise<Root>;
}
