/**
 * The three things a reader is allowed to change about this site, and the one
 * place they are named.
 *
 * `components/shared/ReaderPanel.tsx` writes them and `app/layout.tsx` applies
 * them before the first paint. Both read this file, so a key can only ever be
 * spelled one way.
 */

/** The size the site is set at when nobody has said otherwise. */
export const BASE_TYPE = 14;

/**
 * The sizes on offer, in px of body text.
 *
 * Three steps and no slider: the site has one text size by design, and this is
 * that size moved, not a free control over it. `--type-scale` is what the page
 * actually reads -- see styles/globals.css -- and it is this number over 14.
 *
 * They are offered as words rather than as numbers. A reader choosing how to
 * read is not setting a value, and `16` is a fact about the page that means
 * nothing until you have seen it; `medium` is the thing they actually want.
 * Every other label on this site names a thing rather than measuring it, and
 * these are labels like any other.
 */
export const TYPE_STEPS = [
  { px: 14, label: "small" },
  { px: 16, label: "medium" },
  { px: 18, label: "large" },
] as const;

/** How wide the column may be set, in px. The first is the site's own. */
export const MEASURE_STEPS = [
  { px: 620, label: "narrow" },
  { px: 760, label: "wide" },
] as const;

export const STORAGE = {
  type: "reading:type",
  measure: "reading:measure",
  motion: "reading:motion",
} as const;

/**
 * The preferences, put on the document before anything is drawn.
 *
 * This runs as a blocking inline script in the head. Every page here is
 * prerendered, so the HTML that arrives is written at the site's own size --
 * read the preference after hydration and the reader watches their page arrive
 * at 14px and then jump to 18.
 *
 * The sizes it will accept are written out of `TYPE_STEPS` rather than typed
 * again, so a fourth step is a line in the list above and nothing else.
 *
 * `try/catch` around the whole of it because `localStorage` throws rather than
 * returning null in some privacy modes, and a throw in the head is a page that
 * never paints. A reader who has set nothing, and a reader whose browser will
 * not say, both get the site as it is written.
 */
export const BOOT_SCRIPT = `try{var d=document.documentElement,s=localStorage,t=+s.getItem(${JSON.stringify(
  STORAGE.type,
)});if(${JSON.stringify(
  TYPE_STEPS.map((step) => step.px),
)}.indexOf(t)>-1)d.style.setProperty("--type-scale",String(t/${BASE_TYPE}));if(s.getItem(${JSON.stringify(
  STORAGE.measure,
)})==="wide")d.setAttribute("data-measure","wide");if(s.getItem(${JSON.stringify(
  STORAGE.motion,
)})==="still")d.setAttribute("data-motion","still")}catch(e){}`;
