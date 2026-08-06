import profile from "@/data/profile.json";
import ProfileHeader from "@/components/home/ProfileHeader";
import AboutSection from "@/components/home/AboutSection";
// Parked, not deleted. components/home/Contributions.tsx and lib/github.ts are
// both still here and still work -- uncomment this import and the block below
// to put the graph back.
// import Contributions from "@/components/home/Contributions";
import Tabs from "@/components/shared/Tabs";
import {
  ExperienceList,
  ProjectList,
} from "@/components/shared/ProfileSections";
import SiteFooter from "@/components/home/SiteFooter";
import { jsonLd } from "@/lib/jsonLd";

// const GITHUB_LOGIN = "chefberke";

export default function Home() {
  return (
    /*
     * The frame this column is written inside -- the two rules, the centered
     * measure, the page strip -- is in app/layout.tsx, because it is drawn once
     * and shared with every other page. What is left here is the column.
     *
     * The wrappers below carry no animation of their own; they only say when
     * their block begins. What actually moves is the lines inside them, each
     * one a step behind the last, which is what keeps the page from arriving as
     * one sheet.
     *
     * So these four numbers are starting pistols, not durations. Each block runs
     * on past its own number by however many lines it holds:
     *
     *    40ms   header   label, photo, name, role      -> ends 160ms
     *   140ms   bio      two paragraphs                -> ends 180ms
     *   220ms   tabs     strip, then the rows at +80   -> ends 380ms
     *   400ms   footer   links, last updated           -> ends 440ms
     *
     * They are set to overlap: a block starts while the one above it is still
     * arriving, and no line ever waits on a line that is not moving. Push them
     * apart and the page comes back in slabs.
     */
    <>
      {/* Who this page is about, said in the one form a crawler reads without
          having to infer it. See lib/jsonLd.ts -- it is built from the same
          profile data the column below renders, so the two cannot disagree.
          A script tag is display:none, so it is not a flex item here and lays
          out nothing. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="[--enter-delay:40ms]">
        {/* The location is not passed down. It is a fact about the site rather
            than about this page, so `Whereabouts` reads it itself -- which is
            what lets the blog pages carry the same corner. */}
        <ProfileHeader name={profile.name} title={profile.title} />
      </div>
      <div className="[--enter-delay:140ms]">
        <AboutSection />
      </div>
      {/* The lists are rendered here, on the server, and handed to the client
          component already built. Tabs only decides which one is on screen --
          it never has to know what a project is. */}
      <div className="[--enter-delay:220ms]">
        <Tabs
          label="Experience and projects"
          tabs={[
            {
              id: "experience",
              label: "experience",
              content: <ExperienceList experiences={profile.experiences} />,
            },
            {
              id: "projects",
              label: "projects",
              content: <ProjectList projects={profile.projects} />,
            },
          ]}
        />
      </div>
      {/* <div className="stagger-in [--enter-delay:380ms]">
        <Contributions login={GITHUB_LOGIN} year={new Date().getFullYear()} />
      </div> */}
      <div className="[--enter-delay:400ms]">
        <SiteFooter />
      </div>
      {/*
        Note for whoever puts the graph back: the graph's fetch is what gave
        this page its hourly revalidate. Without it the page is fully static, so
        the footer's "last updated" date now moves only on deploy. That is still
        true to the label, but it is no longer live.

        The graph also goes in ahead of the footer, so push the footer's start
        from 400ms to 480ms when it comes back.
      */}
    </>
  );
}
