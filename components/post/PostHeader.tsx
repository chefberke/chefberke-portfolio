import Link from "next/link";
import MicroLabel from "@/components/shared/MicroLabel";
import Whereabouts from "@/components/shared/Whereabouts";
import { formatPostDate, type PostMeta } from "@/lib/posts";

/**
 * A post opens the way the shelf opens: the word `blog`, then the thing it
 * names, then what is known about it. Three lines, one behind the other.
 *
 * The first of those three is also the way back. It was already a label saying
 * what this page is, and the shelf it belongs to is at that name -- so the
 * label is the link, and the page gains a way out without gaining a row, a
 * glyph, or a control that exists only to be pressed. It wears exactly what a
 * closed page name wears in the gutter: faint, underlining on approach, ink on
 * hover.
 *
 * That is also why there is no arrow beside it. The one arrow on this site
 * points north-east and means the link leaves the site; a second one pointing
 * back would be a second ornament saying something else. See
 * `components/shared/ArrowLink.tsx`.
 *
 * The date and the reading time are one line because they answer one question.
 * The reading time is deliberately unqualified -- no clock glyph, no "approx" --
 * since it is metadata, and metadata here is a micro label and nothing else.
 */
export default function PostHeader({ title, date, readingMinutes }: PostMeta) {
  return (
    // The same two-column corner the home page and the shelf open with: what
    // this page is on the left, where it is written from on the right. The
    // header is a plain flex row so each column runs its own cascade -- one
    // `.stagger-in` inside another would move its subtree twice.
    <header className="flex items-start justify-between gap-4">
      <div className="stagger-in flex flex-col gap-2">
        <MicroLabel as="p">
          {/* `w-fit` so the underline is as wide as the word, not as wide as the
              column -- the label is a block-level paragraph. */}
          <Link
            href="/blog"
            className="link-underline block w-fit hover:text-primary"
          >
            blog
          </Link>
        </MicroLabel>
        <h1 className="text-pretty text-primary">{title}</h1>
        <p className="flex flex-wrap items-baseline gap-x-3">
          <MicroLabel>
            <time dateTime={date}>{formatPostDate(date)}</time>
          </MicroLabel>
          <MicroLabel>{readingMinutes} min read</MicroLabel>
        </p>
      </div>
      <Whereabouts />
    </header>
  );
}
