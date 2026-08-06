import MicroLabel from "@/components/shared/MicroLabel";
import SectionHeading from "@/components/shared/SectionHeading";
import { fetchContributions } from "@/lib/github";

/**
 * Tailwind only generates the classes it can see written out, so the five
 * levels are listed literally. Indexing this array is what turns GitHub's 0-4
 * into a color; no component ever names a shade.
 */
const LEVEL_COLOR = [
  "bg-grid-0",
  "bg-grid-1",
  "bg-grid-2",
  "bg-grid-3",
  "bg-grid-4",
] as const;

const CELL = "size-[10px] shrink-0 rounded-[2px]";

const dayLabel = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

type ContributionsProps = {
  login: string;
  year: number;
};

export default async function Contributions({ login, year }: ContributionsProps) {
  const calendar = await fetchContributions(login, year);

  // GitHub was unreachable, or changed its markup. Drop the section entirely
  // rather than leave an empty labelled box on the page.
  if (!calendar) return null;

  return (
    <section className="flex flex-col gap-4" aria-labelledby="section-contributions">
      <SectionHeading
        label="contributions"
        id="section-contributions"
        meta={`${calendar.total.toLocaleString("en-US")} in ${calendar.year}`}
      />

      {/* The year is ~53 columns wide and the text column is not, so the grid
          scrolls by itself instead of squeezing the page. */}
      <div className="rule-scrollbar -mx-1 overflow-x-auto px-1 pb-2">
        <div className="flex w-max gap-[3px]" role="img"
          aria-label={`${calendar.total} GitHub contributions in ${calendar.year}`}
        >
          {calendar.weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[3px]">
              {week.map((day, dayIndex) =>
                day ? (
                  <span
                    key={day.date}
                    className={`${CELL} ${LEVEL_COLOR[day.level] ?? LEVEL_COLOR[0]}`}
                    title={`${day.count} contribution${
                      day.count === 1 ? "" : "s"
                    } on ${dayLabel.format(new Date(day.date))}`}
                  />
                ) : (
                  // Padding before the first and after the last day of the
                  // year. It holds the column square without drawing a day.
                  <span key={`${weekIndex}-${dayIndex}`} className={CELL} />
                )
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-1.5">
        <MicroLabel>less</MicroLabel>
        {LEVEL_COLOR.map((color) => (
          <span key={color} aria-hidden="true" className={`${CELL} ${color}`} />
        ))}
        <MicroLabel>more</MicroLabel>
      </div>
    </section>
  );
}
