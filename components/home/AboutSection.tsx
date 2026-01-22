import RoughHighlight from "@/components/shared/RoughHighlight";

export default function AboutSection() {
  return (
    <section
      className="flex flex-col gap-4 text-neutral-300 text-[14px] leading-6"
      aria-labelledby="about-heading"
    >
      <h2 id="about-heading" className="sr-only">
        About
      </h2>
      <p>
        I'm Berke, a full-stack software developer based in Izmir, Turkiye. I
        build clean, modern web and mobile applications with a strong focus on{" "}
        <RoughHighlight>accessibility</RoughHighlight>, design, and small
        details. My goal is to create products that are practical, easy to use,
        and visually clear.
      </p>
      <p>
        I work with technologies like React, Next.js, Node.js, and React Native,
        but I'm flexible and choose tools based on the needs of the project. I
        enjoy using modern frameworks, learning new technologies, and writing
        clean, readable code.
      </p>
    </section>
  );
}
