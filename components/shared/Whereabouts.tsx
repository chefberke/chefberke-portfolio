import profile from "@/data/profile.json";
import MicroLabel from "@/components/shared/MicroLabel";
import LocalTime from "@/components/home/LocalTime";

/**
 * The top-right corner of every page: where Berke is, and what time it is
 * there.
 *
 * It stands opposite whatever names the page -- `home` and the photograph on
 * the home page, `blog` and the title on the other two. That pairing is the
 * page's first line read across: this is the page, and this is where it is
 * written from. A corner that answered on one page and was empty on the next
 * would read as the clock having stopped rather than as it never having been
 * asked.
 *
 * The location is read straight out of `data/profile.json` rather than passed
 * in, because it is a fact about the site and not about the page. Nothing that
 * mounts this has to know it, so nothing that mounts this can disagree with it.
 *
 * The clock is the one live thing on the site that is not a link, so it stays
 * in the faint gray -- see `components/home/LocalTime.tsx`.
 */
export default function Whereabouts() {
  return (
    // `shrink-0` because the thing beside it is a post title that can run to
    // three lines. The title takes the wrapping; the corner keeps its two.
    <div className="stagger-in flex shrink-0 flex-col items-end gap-2 text-right">
      <MicroLabel>{profile.location}</MicroLabel>
      <LocalTime />
    </div>
  );
}
