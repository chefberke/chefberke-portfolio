import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fade, tokens } from "@/lib/tokens";
import { STAR_PATH } from "@/components/shared/Star";
import profile from "@/data/profile.json";

/**
 * The share card: the top of a page of this site, drawn at card scale.
 *
 * Everything a card is allowed to say is already said by the page it stands
 * for, so this file builds the page's own frame rather than a picture beside
 * it -- the hairline across the top, the rule down the left margin with the two
 * page names hanging off it, the open one in blue, and the corner that answers
 * where the site is written from. What changes between one card and the next is
 * only the block in the middle.
 *
 * Two things are deliberately not carried over. The clock under the location is
 * live on the page and would be frozen at build time here, so the corner keeps
 * the place and drops the hour. And the type is bigger than the site's: a page
 * is read at arm's length and a card is read as a thumbnail in a feed, so the
 * one thing a card has to do -- be legible at 500px wide -- is the one place it
 * is allowed to disagree with the page.
 */

export const CARD_SIZE = { width: 1200, height: 630 };

/**
 * The card's own measurements, all of them in px, since a card has no reader
 * to move `--type-scale` for and nothing on it can reflow.
 *
 * They are one scale of the page: the site's 1px hairline is 2px here and its
 * 12px micro label is 26px, which is the ratio between a 14px column and a
 * card read at half size. The name is the exception, and `Card` says why.
 */
const RULE = 2;
/** Left edge of the gutter rule. The page names hang to the left of it. */
const GUTTER_X = 150;
/** Where the column starts, measured from the same rule the page measures from. */
const COLUMN_X = 224;
const COLUMN_RIGHT = 96;
const TOP = 92;
const BOTTOM = 80;
/** One row of the gutter nav, and so also the height of the open-page tick. */
const NAV_ROW = 44;
/** Top of the nav, set so its first name sits on the same line as the corner. */
const NAV_TOP = TOP - (NAV_ROW - 34) / 2;

export const MICRO = {
  fontSize: 26,
  letterSpacing: "1.3px",
  textTransform: "uppercase",
  color: tokens.faint,
} as const;

/** The pages, in the order the gutter draws them. Mirrors `SiteNav`. */
const PAGES = ["home", "blog"] as const;
export type CardPage = (typeof PAGES)[number];

/**
 * The two faces, as TrueType.
 *
 * The site loads both as `woff2`, which is what a browser wants and the one
 * thing Satori cannot open -- so the card used to render in whatever sans the
 * renderer had lying around, which is why it never looked like this site. These
 * are the same two files decompressed and then cut down to Latin-1, Latin
 * Extended-A and general punctuation: enough for English and Turkish, and 53KB
 * for the pair instead of 2MB. A post whose title reaches outside that range is
 * the one thing that would come out blank, and would need the subset widened.
 *
 * Read from disk rather than imported, because both card routes are rendered at
 * build time -- the same place `lib/posts.ts` reads `content/posts`.
 */
let fontsPromise: Promise<
  { name: string; data: Buffer; weight: 400; style: "normal" }[]
> | null = null;

export function cardFonts() {
  fontsPromise ??= Promise.all([
    readFile(join(process.cwd(), "app/fonts/IoskeleyMono-Regular-card.ttf")),
    readFile(join(process.cwd(), "app/fonts/GeistPixel-Square-card.ttf")),
  ]).then(([mono, pixel]) => [
    { name: "Ioskeley Mono", data: mono, weight: 400 as const, style: "normal" as const },
    { name: "Geist Pixel", data: pixel, weight: 400 as const, style: "normal" as const },
  ]);

  return fontsPromise;
}

/**
 * The one photograph on the site, inlined.
 *
 * Satori has no network and no filesystem, so the file is read here and handed
 * over as a data URI. It is 72KB, which is a string built once at build time
 * and never shipped to anyone.
 */
export async function cardPhoto() {
  const file = await readFile(
    join(process.cwd(), "public/images/chefberke.jpg")
  );

  return `data:image/jpeg;base64,${file.toString("base64")}`;
}

/**
 * The frame every card is drawn inside, with the page's own block passed in.
 *
 * `children` is the middle of the column and nothing else -- it is centered in
 * the space left between the corner at the top and the signature at the bottom,
 * so a two-line post title and a one-line name both sit on the card's optical
 * center without either card having to know the other's height.
 */
export function Card({
  page,
  children,
}: {
  page: CardPage;
  children: React.ReactNode;
}) {
  const openIndex = PAGES.indexOf(page);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: tokens.surface,
        color: tokens.primary,
        fontFamily: "Ioskeley Mono",
      }}
    >
      {/* The top rule: where the page begins. Full bleed, as on the site. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: CARD_SIZE.width,
          height: RULE,
          backgroundColor: tokens.rule,
        }}
      />

      {/* The gutter rule: where the column is measured from. It runs 64% of the
          height and is already fading at 45% of that, the same numbers
          `.gutter-rule` uses, so it reads as a margin ruled by hand rather than
          as a border drawn around a panel.

          The last stop is the rule's own color at zero and not the keyword
          `transparent`, which is transparent black -- Satori interpolates
          without premultiplying, so that spelling turns the middle of this
          hairline gray and draws it darker than the rule at the top of the
          card. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: GUTTER_X,
          width: RULE,
          height: Math.round(CARD_SIZE.height * 0.64),
          backgroundImage: `linear-gradient(to bottom, ${tokens.rule} 0%, ${
            tokens.rule
          } 45%, ${fade(tokens.rule, 0)} 100%)`,
        }}
      />

      {/* The tick beside the open page name, just inside the rule. It is the
          only reason this card carries a nav at all: it puts the site's one
          saturated color on the one thing it means everywhere else -- where you
          are and what you can act on. */}
      <div
        style={{
          position: "absolute",
          left: GUTTER_X - 8 - RULE * 2,
          top: NAV_TOP + openIndex * NAV_ROW,
          width: RULE * 2,
          height: NAV_ROW,
          backgroundColor: tokens.link,
        }}
      />

      {/* The page names, hung off the rule and right-aligned against it. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: NAV_TOP,
          width: GUTTER_X - 28,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        {PAGES.map((name) => (
          <div
            key={name}
            style={{
              ...MICRO,
              display: "flex",
              alignItems: "center",
              height: NAV_ROW,
              color: name === page ? tokens.link : tokens.faint,
            }}
          >
            {name}
          </div>
        ))}
      </div>

      {/* The column. Three bands: the corner, the block, the signature. */}
      <div
        style={{
          position: "absolute",
          left: COLUMN_X,
          top: TOP,
          width: CARD_SIZE.width - COLUMN_X - COLUMN_RIGHT,
          height: CARD_SIZE.height - TOP - BOTTOM,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Where the page is written from. It stands opposite the open page
            name in the gutter, so the top of the card is the same line read
            across that the top of every page here is. */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={MICRO}>{profile.location}</div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {children}
        </div>

        {/* The signature: the site's one drawn mark, and the address. The star
            is the favicon's shape at the favicon's color, so a tab and a card
            are recognisably the same thing. */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={tokens.link}>
            <path d={STAR_PATH} />
          </svg>
          <div style={MICRO}>berkekanber.com</div>
        </div>
      </div>
    </div>
  );
}
