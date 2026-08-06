import MicroLabel from "@/components/shared/MicroLabel";
import SocialLinks from "@/components/home/SocialLinks";

/**
 * The bottom of the page, built as the mirror of the header: content on the
 * left, a micro label over its value on the right.
 *
 * The right half is the colophon the first version of this site signed off
 * with -- "built with Next.js" -- split across the label and its value so it
 * reads the same way as every other pair on the page.
 */
export default function SiteFooter() {
  return (
    <footer className="stagger-in flex flex-wrap items-end justify-between gap-x-6 gap-y-5">
      <SocialLinks />
      {/* Right-aligned only once the two halves share a line. Wrapped onto its
          own row on a phone, a right-aligned block would sit adrift. */}
      <div className="flex flex-col items-start gap-2 text-left sm:items-end sm:text-right">
        <MicroLabel>built with</MicroLabel>
        <span className="text-micro leading-[1.625] tracking-[0.05em] text-faint">
          Next.js
        </span>
      </div>
    </footer>
  );
}
