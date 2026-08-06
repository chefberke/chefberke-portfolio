import Image from "next/image";
import Link from "next/link";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toJsxRuntime, type Components } from "hast-util-to-jsx-runtime";
import type { Element, Root } from "hast";
import ArrowLink from "@/components/shared/ArrowLink";
import { MICRO_LABEL } from "@/components/shared/MicroLabel";

/**
 * The body of a post.
 *
 * The tree from `lib/markdown.ts` is turned into React elements here, with a
 * component put in the places markdown cannot reach on its own: a link that
 * knows whether it is leaving the site, and an image that is a real
 * `next/image`. Everything else -- paragraphs, lists, quotes, rules, code --
 * passes through as plain markup and is dressed by `.post` in
 * styles/globals.css.
 *
 * That is the line, and it is worth keeping: CSS dresses what passes through,
 * this file handles what is replaced.
 *
 * The whole body arrives as one `block-in` rather than line by line. The rest
 * of the site writes itself in a line at a time, and a post's header still
 * does -- but the stylesheet numbers a run of siblings up to sixteen, and a
 * post is longer than that, so the seventeenth paragraph onward would land in
 * the wrong order. A page that is in place inside a second is the rule the
 * stagger exists to serve; here one fade serves it better.
 */

/**
 * Markdown has six heading levels. This page has three type sizes, none of
 * which is spare, so the levels are told apart on case, size and color instead
 * -- three axes, no new type:
 *
 *   ##    twelve pixels, uppercase, ink
 *   ###   fourteen pixels, lowercase, faint
 *
 * `##` is a micro label in the darker of the two inks, and that is the one
 * place on the site where a label is not faint. The rule behind it: a label
 * naming a *value* is about the content, so it stands back; a label naming a
 * *section* is the content's own skeleton, so it does not. Set faint, a heading
 * would be quieter than the paragraph it introduces, and a reader skimming a
 * long post would slide straight past the only landmarks it has.
 *
 * `h1` never appears -- `lib/posts.ts` refuses a `#` in a post, because the
 * page has already set the title. `h4` and below are drawn as `h3` rather than
 * given an appearance of their own; two levels is enough for a column this
 * narrow, and a post that needs four is two posts.
 *
 * The space above a heading is larger than the space below it, so a heading
 * sits with what it introduces rather than floating between two sections.
 */
const HEADING_2 = `${MICRO_LABEL} text-primary mt-9 first:mt-0`;
const HEADING_3 = "lowercase text-faint mt-4 first:mt-0";

/** Prose links are underlined on approach and never carry the arrow. */
const LINK = "link-underline text-link hover:text-primary";

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") return Number(value);
  return undefined;
}

/**
 * A paragraph that holds one link off the site and nothing else -- the source,
 * the thing the post is about -- and no markdown of its own to say so.
 *
 * That is the shape `ArrowLink` was written for, so it is read off the tree
 * rather than asked for: a lone `a` in a paragraph, pointing away, with plain
 * text inside it. Anything else -- a link in a sentence, a link carrying code
 * or emphasis, a link that stays here -- is prose and returns null.
 */
function standaloneLink(node: Element | undefined) {
  if (!node) return null;

  const children = node.children.filter(
    (child) => child.type !== "text" || child.value.trim() !== "",
  );
  if (children.length !== 1) return null;

  const [only] = children;
  if (only.type !== "element" || only.tagName !== "a") return null;

  const href = only.properties.href;
  if (typeof href !== "string") return null;
  if (href.startsWith("/") || href.startsWith("#")) return null;

  const [text] = only.children;
  if (only.children.length !== 1 || text.type !== "text") return null;

  return { href, text: text.value };
}

/*
 * `passNode` hands every component in this map the hast node as a prop, which
 * is what lets `p` below read the shape of its own children. It is a prop React
 * knows nothing about, so any component that spreads the rest of its props onto
 * a DOM element has to take `node` out of them first -- left in, it is
 * stringified into the markup as `node="[object Object]"`.
 */
const components: Partial<Components> = {
  h2: ({ node, children, ...props }) => (
    <h2 {...props} className={HEADING_2}>
      {children}
    </h2>
  ),
  h3: ({ node, children, ...props }) => (
    <h3 {...props} className={HEADING_3}>
      {children}
    </h3>
  ),
  h4: ({ node, children, ...props }) => (
    <h4 {...props} className={HEADING_3}>
      {children}
    </h4>
  ),
  h5: ({ node, children, ...props }) => (
    <h5 {...props} className={HEADING_3}>
      {children}
    </h5>
  ),
  h6: ({ node, children, ...props }) => (
    <h6 {...props} className={HEADING_3}>
      {children}
    </h6>
  ),

  /*
   * The paragraph stays a paragraph even when its whole content is one outbound
   * link, so it keeps the column's gap and `.post p` keeps dressing it. Only
   * the anchor inside is swapped for the arrow one.
   */
  p: ({ node, children, ...props }) => {
    const link = standaloneLink(node);

    if (link) {
      return (
        <p>
          <ArrowLink href={link.href}>{link.text}</ArrowLink>
        </p>
      );
    }

    return <p {...props}>{children}</p>;
  },

  /*
   * Two kinds of link, told apart by where they point. One stays on the site
   * and is prefetched like every other internal link; the other opens away and
   * says so to the browser.
   *
   * Neither takes the north-east arrow. That arrow is the page's only ornament
   * and it marks a *standalone* link that leaves the site, which is the one
   * case `p` above has already taken. Inside a sentence it would be a glyph
   * dropped into the middle of a line of mono type, which is what the bio's
   * inline links already refuse.
   */
  a: ({ node, children, href, ...props }) => {
    const target = typeof href === "string" ? href : "";
    const internal = target.startsWith("/") || target.startsWith("#");

    if (internal) {
      return (
        <Link {...props} href={target} className={LINK}>
          {children}
        </Link>
      );
    }

    return (
      <a
        {...props}
        href={target}
        className={LINK}
        target="_blank"
        rel="noreferrer noopener"
      >
        {children}
      </a>
    );
  },

  /*
   * The dimensions were measured off the file at build time by
   * `lib/rehypeImageSize.ts`, so the box is the right shape before the picture
   * arrives. `sizes` is what stops the browser assuming the image fills the
   * window and fetching a candidate three times wider than this column ever
   * gets: 40rem is where the column stops growing.
   *
   * An image with no measurements is one this build could not read -- a remote
   * one -- so it is left as a plain tag rather than handed to a loader that
   * cannot size it.
   */
  img: ({ node, src, alt, width, height, ...props }) => {
    const w = toNumber(width);
    const h = toNumber(height);

    if (typeof src !== "string" || w === undefined || h === undefined) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img {...props} src={src} alt={alt ?? ""} />;
    }

    return (
      <Image
        src={src}
        alt={alt ?? ""}
        width={w}
        height={h}
        quality={90}
        sizes="(min-width: 40rem) 620px, 100vw"
      />
    );
  },

  /* A table is the one thing here wider than the column. It scrolls inside its
     own box, on the same hairline scrollbar the contribution grid uses. */
  table: ({ node, children, ...props }) => (
    <div className="rule-scrollbar overflow-x-auto">
      <table {...props}>{children}</table>
    </div>
  ),
};

export default function PostBody({ hast }: { hast: Root }) {
  return (
    <div className="post block-in">
      {toJsxRuntime(hast, { Fragment, jsx, jsxs, components, passNode: true })}
    </div>
  );
}
