/**
 * The single source of truth for every color in this project.
 *
 * This is the ONLY file allowed to contain a raw hex value. ESLint blocks hex
 * literals everywhere else, so to change the theme you edit this file and
 * nothing else.
 *
 * - `palette` is the raw set of colors. Change these to change how the site
 *   looks.
 * - `tokens` maps a role onto a color. Change these to re-assign which color a
 *   role uses, without touching any component.
 *
 * Components never name a palette entry. They use the semantic Tailwind classes
 * generated from `tokens`: bg-surface, text-primary, text-faint, text-link,
 * border-rule, and the five bg-grid-* steps.
 */

/**
 * Five colors, and that is the whole site.
 *
 * The neutrals are warm rather than blue-gray: `paper` is an off-white with a
 * little yellow left in it, so it reads as paper under a lamp instead of as a
 * screen turned all the way up, and `rule` is the same warmth one shade down.
 * Against those two, `blue` is the only saturated thing on the page, which is
 * what lets it mean something wherever it appears.
 */
export const palette = {
  paper: "#f7f6f5",
  rule: "#e3e1da",
  ink: "#0a0a0a",
  inkFaint: "#6b6b6b",
  blue: "#2200ff",
} as const;

/**
 * `blue` at partial strength, for the contribution grid.
 *
 * The steps are one color at four opacities rather than four hand-picked
 * shades. That guarantees they stay a single ramp: change `palette.blue` and
 * the whole grid follows it, still evenly spaced, with nothing to re-tune.
 */
function fade(hex: string, opacity: number): string {
  const value = Number.parseInt(hex.slice(1), 16);
  const channels = [(value >> 16) & 255, (value >> 8) & 255, value & 255];
  return `rgb(${channels.join(" ")} / ${opacity})`;
}

export const tokens = {
  /** Page background. */
  surface: palette.paper,
  /** Hairline that draws the page frame: the top edge and the left gutter. */
  rule: palette.rule,
  /** Everything that is content: the name, the prose, titles. */
  primary: palette.ink,
  /** Everything that is about the content: micro labels, dates, companies. */
  faint: palette.inkFaint,
  /** Links, the open tab, and anything else the reader can act on. */
  link: palette.blue,
  /**
   * Text selection. The same blue as a link, because selecting text is the one
   * thing a reader does to the page, and it should answer in the page's own
   * color rather than in the browser's default.
   */
  accent: palette.blue,

  /*
   * The five steps of the contribution grid, from an empty day to the busiest.
   * Step 0 is the rule color, not a pale blue, so "nothing happened" reads as
   * an absence of color rather than as a very small amount of it.
   */
  "grid-0": palette.rule,
  "grid-1": fade(palette.blue, 0.3),
  "grid-2": fade(palette.blue, 0.55),
  "grid-3": fade(palette.blue, 0.8),
  "grid-4": palette.blue,
} as const;

export type ColorToken = keyof typeof tokens;

/**
 * The `:root` rule that publishes the tokens as CSS variables.
 *
 * `app/layout.tsx` writes this into the document head, and `styles/globals.css`
 * points its Tailwind theme at these variables. That is what lets a change here
 * reach every component.
 */
export const rootStyle = `:root{${Object.entries(tokens)
  .map(([name, value]) => `--${name}:${value}`)
  .join(";")}}`;
