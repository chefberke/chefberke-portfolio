/**
 * The one drawn mark on the page: a four-point spark.
 *
 * Everything else here is type, so a mark that is going to sit in a line of
 * type has to be built like a glyph rather than like a logo. No box around it,
 * no second color, no stroke -- one filled path whose points run out to the
 * edges of its own square and whose sides pinch all the way back to the center.
 * That pinch is what keeps it sharp at 12px, where a rounder star would close
 * up into a blob.
 *
 * It takes its color from `currentColor`, so it is the parent's `text-link`
 * that makes it blue and nothing in here names a color at all.
 */

/**
 * The path, on a 24-unit square, exported so the favicon route can draw the
 * same shape. Each arm is one quadratic curve with its control point set just
 * off center, which is what gives the waist its small amount of body.
 */
export const STAR_PATH =
  "M12 1.5 Q12.6 11.4 22.5 12 Q12.6 12.6 12 22.5 Q11.4 12.6 1.5 12 Q11.4 11.4 12 1.5 Z";

/**
 * The same star with a wider waist, for the favicon and nothing else.
 *
 * A browser tab draws this mark at about 16px, and at 16px the arms above are
 * thinner than a pixel for most of their length -- the renderer turns them into
 * a gray haze and the shape stops being a star. So the small size gets its own
 * cut: the control points are pushed out from the center, which puts body into
 * the arms without moving a single point.
 *
 * This is optical sizing, the same reason a typeface has a caption cut. It is
 * not a second shape, it is this shape drawn to survive being small.
 */
export const STAR_PATH_SMALL =
  "M12 1.5 Q13.5 10.5 22.5 12 Q13.5 13.5 12 22.5 Q10.5 13.5 1.5 12 Q10.5 10.5 12 1.5 Z";

type StarProps = {
  /** Edge of the square it is drawn in, in px. */
  size?: number;
  className?: string;
};

export default function Star({ size = 13, className = "" }: StarProps) {
  return (
    <svg
      // Decorative. It stands where a micro label used to, and the header's
      // name and role already say who this is.
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
    >
      <path d={STAR_PATH} />
    </svg>
  );
}
