import Highlight from "@/components/shared/Highlight";

/**
 * The bio. The only prose on the page, and the only place the accent color
 * appears inside a sentence rather than beside one.
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
      <div className="stagger-in flex flex-col gap-5">
        <p>
          I&apos;m Berke, a full stack developer based in Izmir, Turkiye.
          Currently I build web and mobile products at{" "}
          <Highlight>Mavera Technology</Highlight>. I care about accessibility,
          design, and the small details that decide whether software feels
          finished.
        </p>
        <p>
          I mostly reach for <Highlight>React</Highlight>,{" "}
          <Highlight>Next.js</Highlight>, and{" "}
          <Highlight>React Native</Highlight>, but I choose tools to fit the
          project rather than the other way round. On the side I build{" "}
          <Highlight>Gitcord</Highlight>, a dashboard for reading GitHub
          activity, and <Highlight>Dataprism</Highlight>, an open-source web
          analytics platform.
        </p>
      </div>
    </section>
  );
}
