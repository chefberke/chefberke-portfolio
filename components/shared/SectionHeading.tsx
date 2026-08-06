import MicroLabel from "@/components/shared/MicroLabel";

type SectionHeadingProps = {
  label: string;
  /** Ties the heading to its section through aria-labelledby. */
  id: string;
  /** Optional counter or note pinned to the right edge, such as "1490 in 2026". */
  meta?: string;
};

/**
 * The standard heading for every top-level section on the page.
 *
 * It is a label on the left and, when there is one, a number on the right --
 * the same shape as a row in a ledger. The header at the top of the page and
 * the footer at the bottom are built the same way, so the whole page is one
 * repeated gesture instead of a stack of unrelated blocks.
 */
export default function SectionHeading({ label, id, meta }: SectionHeadingProps) {
  return (
    <h2 id={id} className="flex items-baseline justify-between gap-4">
      <MicroLabel>{label}</MicroLabel>
      {meta ? <MicroLabel>{meta}</MicroLabel> : null}
    </h2>
  );
}
