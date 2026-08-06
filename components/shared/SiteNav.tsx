"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ReadingHead from "@/components/shared/ReadingHead";

/**
 * The pages this site has.
 *
 * The order here is the order they are drawn in, and the index of the open one
 * is what the gutter marker rides on -- so a third page is one line in this
 * list and nothing else.
 */
const PAGES = [
  { href: "/", label: "home" },
  { href: "/blog", label: "blog" },
] as const;

/** `/blog/a-post` is still the blog. `/` is only ever itself. */
function isOpen(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/**
 * A post, and only a post -- `/blog` itself is a shelf, not a piece.
 *
 * This is what the gutter's reading head is drawn for. A page has to be one
 * long thing read top to bottom before "where you are in it" is a question
 * worth answering in the margin; the home page is a column of separate blocks
 * and the shelf is a short list, and on both of those a light tracking the
 * scroll would be saying something the page does not mean.
 */
function isReading(pathname: string) {
  return pathname.startsWith("/blog/");
}

/**
 * A page name is a micro label, the same as every tab and every section title
 * on the page. Navigation is not a new kind of type; it is the page's own.
 */
const NAME = "text-micro uppercase leading-none tracking-[0.05em]";

/**
 * The left gutter: one hairline down the page with the site's pages hanging
 * off it.
 *
 * It is the second half of the frame. The top rule says where the page begins;
 * this one says where the column is measured from, and it is the only thing on
 * the site that stays put while the column scrolls under it. It fades out
 * before it reaches the bottom of the window, so it reads as a margin rule
 * ruled by hand rather than as a border on a panel.
 *
 * On load it draws downward out of the top corner, just after the top rule has
 * started across -- the two together are one corner being ruled -- and a single
 * pass of light runs down it as it draws. That pass is the only thing on the
 * site that is decoration and nothing else. It happens once.
 *
 * Which page is open is said twice, in two registers: the name turns blue, the
 * same blue that means "you can act on this" everywhere else, and a short tick
 * stands beside it just inside the rule. The tick is one element for the whole
 * nav, not one per row, so switching pages slides it from the old row to the
 * new one instead of blinking it off and on.
 *
 * Drawn from `xl` up only. Below that there is no margin wide enough to rule
 * -- see `--gutter-x` in styles/globals.css -- and the same two names are set
 * as a strip at the top of the column instead. See `InlineNav`.
 */
export function GutterNav() {
  const pathname = usePathname();
  const openIndex = PAGES.findIndex((page) => isOpen(pathname, page.href));

  return (
    // The aside covers the whole left margin, so it is transparent to the
    // pointer and only the names inside it are not. Otherwise it would eat a
    // text selection dragged in from the edge of the window.
    <aside className="pointer-events-none fixed inset-y-0 left-0 z-10 hidden w-[var(--gutter-x)] pt-24 xl:block">
      {/* The rule stands on the aside's right edge and starts at the very top
          of the window -- `top: 0` is measured from the border edge, so the
          padding that holds the names down does not move it. */}
      <div aria-hidden="true" className="gutter-rule">
        <div className="gutter-rule__base" />
        <div className="gutter-rule__shine" />
        {/* On a post, the pass of light comes back and stays -- travelling
            toward where the reader stands, moving only when they scroll. It is
            mounted only where it means something, so no other page carries a
            fixed element it never shows, and no other page runs its loop. */}
        {isReading(pathname) ? <ReadingHead /> : null}
      </div>

      <nav
        aria-label="Pages"
        className="pointer-events-auto relative [--enter-delay:340ms]"
        style={{ "--nav-index": Math.max(openIndex, 0) } as React.CSSProperties}
      >
        {openIndex >= 0 ? (
          <span aria-hidden="true" className="gutter-marker block-in" />
        ) : null}
        {/* The rows arrive after the rule has been drawn for them, one step
            apart, like every other run of lines on the site. */}
        <ul className="stagger-in flex flex-col items-end pr-4">
          {PAGES.map((page) => {
            const open = isOpen(pathname, page.href);

            return (
              // The row height is the marker's step. See `.gutter-marker` in
              // styles/globals.css -- the two are the same number.
              <li key={page.href} className="flex h-7 items-center">
                <Link
                  href={page.href}
                  // What draws the open name is what tells a screen reader
                  // which page it is on, so the two cannot drift apart.
                  aria-current={open ? "page" : undefined}
                  className={`${NAME} ${
                    open
                      ? "text-link"
                      : "link-underline text-faint hover:text-primary"
                  }`}
                >
                  {page.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

/**
 * The same two names on a narrow window, set as a strip at the top of the
 * column.
 *
 * There is no margin to hang a rule in at this width, so the open page is
 * marked the way the tab strip further down marks its open tab: the rule that
 * every link on the site wipes in on hover, held open under the name. One
 * mechanism, two places.
 */
export function InlineNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Pages"
      className="stagger-in flex items-center gap-5 xl:hidden"
    >
      {PAGES.map((page) => {
        const open = isOpen(pathname, page.href);

        return (
          <Link
            key={page.href}
            href={page.href}
            aria-current={open ? "page" : undefined}
            className={`tab-underline ${NAME} ${
              open ? "text-link" : "text-faint hover:text-primary"
            }`}
          >
            {page.label}
          </Link>
        );
      })}
    </nav>
  );
}
