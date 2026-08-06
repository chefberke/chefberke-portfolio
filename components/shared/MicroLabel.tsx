type MicroLabelProps = {
  children: React.ReactNode;
  /** Renders as a different element, so a heading can still be an h2. */
  as?: "span" | "p";
  className?: string;
};

/**
 * The smallest type on the page: 12px, uppercase, lightly tracked, faint.
 *
 * Every piece of metadata wears it -- section names, the location, dates, the
 * legend, "last updated". That is the whole grammar of the page: a micro label
 * says what a thing is, and the line next to it says what it holds. Because
 * only one style does this job, a label never competes with content.
 *
 * The text is written in normal case at the call site and uppercased here, so
 * screen readers and the page source read as words rather than as shouting.
 *
 * The tracking is 0.05em. Uppercase mono is already wide, so it needs only
 * enough extra to stop the caps closing up -- pushed further, a label starts
 * reading as a logo. The leading matches the body text, so a tech-stack line
 * that wraps on a phone still sets on the page's rhythm.
 */
export default function MicroLabel({
  children,
  as: Tag = "span",
  className = "",
}: MicroLabelProps) {
  return (
    <Tag
      className={`text-[12px] uppercase leading-[1.625] tracking-[0.05em] text-faint ${className}`}
    >
      {children}
    </Tag>
  );
}
