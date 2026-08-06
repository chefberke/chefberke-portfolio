import type { ThemeRegistration } from "shiki";
import { tokens } from "@/lib/tokens";

/**
 * The syntax theme, built out of the page's own colors.
 *
 * Every ready-made theme is ten or more colors that came from somewhere else.
 * This page has two inks and one blue, and a code block is not a good enough
 * reason to open a second palette -- so the theme is written here, from
 * `lib/tokens.ts`, and it has three colors:
 *
 *   faint     comments
 *   link      strings, numbers, keywords, tag names
 *   primary   everything else, inherited from `fg`
 *
 * The rule behind the split: the two things worth catching a skimming eye are
 * what the code says it *is* -- a keyword -- and what it *contains* -- a string
 * or a number. Identifiers, punctuation and operators are structure, and
 * structure in mono type is already legible from its shape. This is the code
 * equivalent of `Highlight` in the bio: one accent, used sparingly, on the words
 * that carry the sentence.
 *
 * Two deliberate omissions, so nobody adds them back as a fix:
 *
 * - `keyword.operator` is not blue. `=`, `+` and `=>` set in the accent color is
 *   noise on every line; only the operators that are words (`new`, `typeof`)
 *   read as keywords, and those sit under `keyword.operator.expression`.
 * - A diff is not green and red. There is no green and no red in this palette.
 *   Added and removed lines are told apart by the `+` and `-` in the gutter,
 *   which a monospace face has already aligned into a column.
 *
 * TextMate matches scopes by longest prefix, so `string` covers
 * `string.quoted.double.ts` and the rest without listing them.
 *
 * One fragility worth knowing: `tokens.faint`, `tokens.primary` and
 * `tokens.link` must stay hex strings. If one of them is ever changed to a
 * `fade()` value it becomes `rgb(... / ...)`, which TextMate does not
 * understand, and code would silently lose its color rather than fail.
 */
export const codeTheme: ThemeRegistration = {
  // Shiki writes this onto the <pre> as a second class. It is never styled --
  // `styles/globals.css` dresses the block through `.post pre`.
  name: "portfolio",
  type: "light",
  fg: tokens.primary,
  // Discarded: `rootStyle: false` in lib/markdown.ts stops Shiki writing a
  // background at all, so the block sits on the page's paper. It is set anyway
  // so the theme is whole if it is ever handed to `codeToHtml` directly.
  bg: tokens.surface,
  settings: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: tokens.faint },
    },
    {
      scope: [
        "string",
        "constant.numeric",
        "constant.language",
        "constant.character.escape",
        "keyword",
        "keyword.control",
        "keyword.operator.expression",
        "keyword.operator.new",
        "storage",
        "storage.type",
        "storage.modifier",
        "support.type.property-name.json",
        "entity.name.tag",
        "markup.inserted",
        "markup.deleted",
      ],
      settings: { foreground: tokens.link },
    },
  ],
};
