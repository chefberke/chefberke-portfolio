import ArrowLink from "@/components/shared/ArrowLink";
import { SOCIAL_LINKS } from "@/lib/social";

/**
 * The links are set as words, not glyphs.
 *
 * A row of brand icons is a row of little boxes, and this page has no boxes in
 * it. Spelled out, the links sit on the same baseline as everything else and
 * read in the same voice.
 *
 * The list itself lives in `lib/social.ts`, because the structured data reads
 * the same array to say which accounts belong to the same person.
 */

export default function SocialLinks() {
  return (
    <nav aria-label="Social links">
      <ul className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {SOCIAL_LINKS.map((link, index) => (
          <li key={link.label} className="flex items-center gap-2">
            {/* A slash between the links, in the faint color, so the row reads
                as one line of text rather than as separate buttons. */}
            {index > 0 && (
              <span aria-hidden="true" className="text-faint">
                /
              </span>
            )}
            <ArrowLink href={link.href} rel={link.me ? "me" : undefined}>
              {link.label}
            </ArrowLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
