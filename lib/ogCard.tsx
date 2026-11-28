import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { tokens } from "@/lib/tokens";

/**
 * The share card: one line typed at a prompt.
 *
 * A card is read as a thumbnail in a feed, for about as long as it takes to
 * scroll past it, so it says one thing -- what the page is -- and the one fact
 * under it. Everything else the page has is left to the page. What is kept of
 * the site is its material: the hairline across the top, the paper, the two
 * inks, the two faces, and blue as the only saturated thing, spent here on the
 * cursor and the prompt mark beside the line under it.
 *
 * The cursor is what makes it a prompt rather than a caption. It stands after
 * the last word, wherever the line wraps, so a long title and a short name both
 * end on it. A single word longer than the column would overflow rather than
 * break -- the words are boxes -- which no title here comes near.
 *
 * Every card is the same frame with two strings in it, and each
 * `opengraph-image.tsx` supplies only those two.
 */

export const CARD_SIZE = { width: 1200, height: 630 };

/**
 * The card's measurements, in px: a card has no reader to move `--type-scale`
 * for and nothing on it reflows. The site's 1px hairline is 2px here and its
 * 12px micro label is 26px -- the ratio between a 14px column and a card read
 * at half size.
 */
const RULE = 2;
const EDGE = 100;
const LINE = 76;
const SUB = 30;
const MICRO = 26;
/** The cursor is a block one character wide and one line tall. */
const CURSOR = { width: 36, height: 72 };
/** Space between the last word and the cursor: tighter than a word space. */
const CURSOR_GAP = 14;

/**
 * The two faces, as TrueType: the pixel face for the line, the mono for
 * everything else -- the same split the site's header makes between the name
 * and the words around it.
 *
 * The site loads both as `woff2`, which is the one thing Satori cannot open.
 * These are the same files decompressed and cut down to the same ranges --
 * Latin-1, Latin Extended-A and general punctuation -- with the hinting
 * stripped: enough for English and Turkish at a fraction of the size. The two
 * must stay cut alike, because a glyph missing from the pixel face is drawn in
 * the mono instead. A post whose title reaches outside that range is the one
 * thing that would come out blank, and would need the subset widened.
 *
 * Read from disk rather than imported, because every card is rendered at build
 * time -- the same place `lib/posts.ts` reads `content/posts`.
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
 * The frame, with the page's line and the fact under it.
 *
 * Both are lowercased here rather than by the caller, since a prompt is typed
 * and the case is part of the frame, not of the content. `sub` is one string:
 * Satori counts JSX children, and a box holding two of them has to declare a
 * display, so every label that interpolates is written as one template string.
 */
export function Card({ line, sub }: { line: string; sub?: string }) {
  const words = line.trim().split(/\s+/);

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

      {/* The address, where a browser would show it. */}
      <div
        style={{
          position: "absolute",
          top: 64,
          right: EDGE,
          fontSize: MICRO,
          letterSpacing: "1.3px",
          textTransform: "uppercase",
          color: tokens.faint,
        }}
      >
        berkekanber.com
      </div>

      {/* The prompt, on the card's vertical center. */}
      <div
        style={{
          position: "absolute",
          left: EDGE,
          right: EDGE,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* One box per word in a wrapping row, the cursor inside the last one.
            Satori has no inline-block, and a cursor beside a wrapped text box
            would stand beside the whole block -- inside the last word's box it
            follows that word down to whichever line it lands on, and cannot be
            wrapped onto a line of its own. Each word but the last carries its
            own no-break space, so the gap is the face's own word space. */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            fontFamily: "Geist Pixel",
            fontSize: LINE,
            lineHeight: 1.2,
            letterSpacing: "-1.5px",
            textTransform: "lowercase",
          }}
        >
          {words.map((word, i) =>
            i < words.length - 1 ? (
              <div key={i} style={{ display: "flex" }}>
                {`${word}\u00a0`}
              </div>
            ) : (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex" }}>{word}</div>
                <div
                  style={{
                    width: CURSOR.width,
                    height: CURSOR.height,
                    marginLeft: CURSOR_GAP,
                    backgroundColor: tokens.link,
                  }}
                />
              </div>
            )
          )}
        </div>

        {sub ? (
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: SUB,
              letterSpacing: "0.5px",
              textTransform: "lowercase",
              color: tokens.faint,
            }}
          >
            <span style={{ color: tokens.link, marginRight: 18 }}>›</span>
            <span>{sub}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
