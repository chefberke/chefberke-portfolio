import { ImageResponse } from "next/og";
import { tokens } from "@/lib/tokens";
import { STAR_PATH_SMALL } from "@/components/shared/Star";

// Drawn at 64 and handed to the browser to scale down, not drawn at 16. A tab
// icon is displayed anywhere from 16px to 32px depending on the screen, and a
// clean downscale of a large raster keeps the points of the star far better
// than rasterizing the curves straight onto a 16-pixel grid does.
export const size = { width: 64, height: 64 };
// Written as a file, not answered as a route: `output: "export"` draws a
// metadata route at build time only if the route says it is static.
export const dynamic = "force-static";
export const contentType = "image/png";

/**
 * The favicon: the same spark the header wears, and nothing behind it.
 *
 * No background plate. The PNG is left transparent so the mark sits on
 * whatever the browser puts behind it -- a light tab strip or a dark one --
 * the same way it sits on the page itself.
 *
 * It uses `STAR_PATH_SMALL`, the wider-waisted cut, because the header's star
 * is drawn as live vector at 13px while this one is a raster the browser
 * squeezes to about 16px. Same shape, drawn with more body so the small size
 * keeps its four points instead of blurring into a dot.
 *
 * It is generated rather than checked in as a file, for the reason every other
 * color on this site is generated -- so `lib/tokens.ts` stays the only place a
 * color is written down. A hand-drawn icon.svg would have the blue baked into
 * it and would quietly drift the day the palette moves.
 *
 * The star runs to 56 of the 64px square, so there is a hair of air on each
 * side. A mark that reaches its own edges reads as cropped once the tab strip
 * puts it next to other icons.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="56" height="56" viewBox="0 0 24 24" fill={tokens.link}>
          <path d={STAR_PATH_SMALL} />
        </svg>
      </div>
    ),
    { width: size.width, height: size.height }
  );
}
