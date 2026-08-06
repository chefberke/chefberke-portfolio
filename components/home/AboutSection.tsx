import Highlight from "@/components/shared/Highlight";

/**
 * The bio. The only prose on the page, and the only place the accent color
 * appears inside a sentence rather than beside one.
 *
 * Only the first paragraph carries any color, because only the first paragraph
 * names things -- the two places the work happened. The second one is a
 * statement of how the work is done and has nothing in it to pick out; putting
 * a highlight on a phrase there would turn the accent into emphasis, which is
 * not what it means anywhere else on the page.
 *
 * The two paragraphs arrive one step apart, and they are wrapped rather than
 * staggered in place because the heading above them is `sr-only`: it is still a
 * child, so it would take the first slot in the count and push both paragraphs
 * a step late for nobody's benefit. The wrapper is absorbed by the flex column
 * around it -- `sr-only` is absolutely positioned, so it was never taking any
 * space here to begin with.
 */
export default function AboutSection() {
  return (
    <section
      className="flex flex-col gap-5 text-primary"
      aria-labelledby="about-heading"
    >
      <h2 id="about-heading" className="sr-only">
        About
      </h2>
      {/* Three rules set these two paragraphs, and not one of them changes a
          word of the text. They are here because the column is 620px of
          monospace: every glyph is one width, so a ragged edge has no
          variation to hide behind and every fault in it is plainly visible.

          `text-justify` squares both edges. It is the one place on the page
          where text is justified, and it is justified for the same reason the
          rest of the page is not -- prose is the only thing here long enough
          to hold a shape, and left ragged it read as broken lines drifting
          down the column rather than as a block.

          `text-pretty` still does its half of the work under justification:
          it looks ahead over the last lines and breaks earlier, so no word is
          left alone on the final line, and it spreads the slack more evenly
          instead of dumping it into one loose line. Unsupported, the
          paragraph simply justifies without that pass.

          Then the two things justification makes worse rather than better,
          both stopped in the markup below:

          - A hyphen is a break opportunity, so "next-generation" was being
            cut into "next-" and "generation". The three hyphenated compounds
            are wrapped in `whitespace-nowrap` and stay whole.
          - A one-letter word at the end of a line ("Turkiye. I" / "on a") is
            the fault a stretched line shows off most. Every "I" and "a" is
            bound to the word after it with `&nbsp;`, which is the same
            character to a reader and an unbreakable one to the browser. */}
      <div className="stagger-in flex flex-col gap-5 text-pretty text-justify">
        <p>
          I&apos;m Berke, a&nbsp;Full Stack Software Developer based in Izmir,
          Turkiye. I&nbsp;currently work at{" "}
          <Highlight>Mavera Technology</Highlight>, where I&nbsp;build web and
          mobile products from idea to production. Before that, I&nbsp;worked on
          a&nbsp;<span className="whitespace-nowrap">next-generation</span>{" "}
          <Highlight>
            <span className="whitespace-nowrap">e-commerce</span> platform
          </Highlight>
          , helping turn product ideas and designs into{" "}
          <span className="whitespace-nowrap">production-ready</span> features.
        </p>
        <p>
          I enjoy building products that solve real problems and continue to
          improve after they&apos;re shipped. I&apos;m always looking for simple
          solutions, clean implementations, and the small details that make
          software feel complete.
        </p>
      </div>
    </section>
  );
}
