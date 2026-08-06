import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type ArrowLinkProps = {
  href: string;
  children: string;
  /**
   * Accessible name. Worth setting when the visible text repeats down the page
   * -- half a dozen links all reading "github" tell a screen reader nothing.
   */
  label?: string;
  /**
   * Extra relationship tokens, added to the `noreferrer noopener` every link
   * here carries. `me` is the one in use: it marks a URL as another profile of
   * the same person, which is what verifies the link back on Mastodon and on
   * GitHub, and one of the signals that ties these accounts to this site.
   */
  rel?: string;
};

/**
 * A standalone link: lowercase, faint, with a trailing north-east arrow.
 *
 * The arrow is the page's only ornament, and it earns its place by carrying
 * meaning -- it marks every link that leaves the site. Inline links inside the
 * bio never take it, so the two kinds of link stay distinct.
 *
 * It is a drawn icon rather than the arrow character. Mono faces set every
 * glyph on the same fixed advance, so the typed arrow came out heavy, boxy,
 * and sitting off the baseline. A stroked icon can be given its own weight and
 * size, and 1.75 keeps it lighter than the text it follows.
 *
 * It shares the wiping underline with the tab strip, so everything on the page
 * that can be clicked answers the pointer the same way -- and, since the bio's
 * accent words do not move at all, that reaction is what separates a link from
 * a highlight here.
 */
export default function ArrowLink({
  href,
  children,
  label,
  rel,
}: ArrowLinkProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="link-underline inline-flex items-center gap-1 lowercase text-faint hover:text-primary"
      target="_blank"
      rel={["noreferrer", "noopener", rel].filter(Boolean).join(" ")}
    >
      {children}
      <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
    </Link>
  );
}
