import MicroLabel from "@/components/shared/MicroLabel";
import SocialLinks from "@/components/home/SocialLinks";

const stamp = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  timeZone: "Europe/Istanbul",
});

/**
 * The bottom of the page, built as the mirror of the header: content on the
 * left, a micro label over its value on the right.
 *
 * "Last updated" is the time this page was rendered. Nothing on the page
 * fetches any more, so the page is fully static and the date moves only on
 * deploy -- which is still what the label claims. Put the contribution graph
 * back and its hourly revalidate makes this date move on its own again.
 */
export default function SiteFooter() {
  return (
    <footer className="stagger-in flex flex-wrap items-end justify-between gap-x-6 gap-y-5">
      <SocialLinks />
      {/* Right-aligned only once the two halves share a line. Wrapped onto its
          own row on a phone, a right-aligned block would sit adrift. */}
      <div className="flex flex-col items-start gap-2 text-left sm:items-end sm:text-right">
        <MicroLabel>last updated</MicroLabel>
        <span className="text-[12px] leading-[1.625] tracking-[0.05em] text-faint">
          {stamp.format(new Date())}
        </span>
      </div>
    </footer>
  );
}
