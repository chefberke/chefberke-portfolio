type HighlightProps = {
  children: React.ReactNode;
};

/**
 * A word in the bio picked out in the accent color.
 *
 * These are not links. They name the tools and the products worth catching a
 * skimming eye, and nothing more -- there is no hover state and nothing to
 * click, because clicking a technology's name to land on its marketing site is
 * not something a reader of this page came here to do.
 *
 * That does put color on something inert, which everywhere else on the page
 * means "actionable". It reads as a highlighter rather than as a link because
 * it never underlines and never reacts to the pointer: the things you can
 * actually click all move when you approach them.
 */
export default function Highlight({ children }: HighlightProps) {
  return <span className="text-link">{children}</span>;
}
