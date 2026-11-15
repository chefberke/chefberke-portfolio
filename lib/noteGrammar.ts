import type { LanguageRegistration } from "shiki";

/**
 * A code block that is not code: a list, a checklist, a bar.
 *
 * A post sometimes wants a small picture between two paragraphs, and most of
 * the ones it wants are made of text -- the questions you have before you
 * start, the boxes ticked since, how far a number moved. Drawn as images they
 * would be files to keep in step with the prose; written in a ```note block
 * they are the prose, and they are set in the same mono face as everything
 * around them.
 *
 * The grammar only marks a handful of glyphs, and it marks them with scopes
 * `lib/codeTheme.ts` already colors, so this file holds no color of its own:
 *
 *   ?      at the start of a line   faint   (comment)
 *   [ ]                             faint   (comment)
 *   [x]                             blue    (keyword)
 *   █                               blue    (string)
 *   ░                               faint   (comment)
 *
 * Everything else is ink. A bar is written as a run of full blocks followed by
 * a run of light shade, so the two halves read as "done" and "left".
 */
export const noteGrammar: LanguageRegistration = {
  name: "note",
  scopeName: "text.note",
  patterns: [
    { match: "^\\s*\\?", name: "comment.note.question" },
    { match: "\\[x\\]", name: "keyword.other.note.done" },
    { match: "\\[ \\]", name: "comment.note.open" },
    { match: "█+", name: "string.other.note.filled" },
    { match: "░+", name: "comment.note.empty" },
  ],
  repository: {},
};
