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
     * The page is drawn as a frame rather than as a card: one hairline across
     * the top, and nothing else. The column below it is centered on the
     * viewport, so the top rule is the only edge the text measures itself
     * against.
     *
     * On load the rule draws itself out from the left, and the column fills in
     * under it. The wrappers below carry no animation of their own -- they only
     * say when their block begins. What actually moves is the lines inside
     * them, each one a step behind the last, which is what keeps the page from
     * arriving as one sheet.
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
    <div className="flex min-h-screen flex-col bg-surface">
      {/* Who this page is about, said in the one form a crawler reads without
          having to infer it. See lib/jsonLd.ts -- it is built from the same
          profile data the column below renders, so the two cannot disagree.
          A script tag is display:none, so it is not a flex item here and lays
          out nothing. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div
        aria-hidden="true"
        className="rule-draw-x h-px w-full shrink-0 bg-rule"
      />

      <div className="flex w-full flex-1">
        <main className="min-w-0 flex-1 px-6 py-16 sm:px-14 sm:py-24">
          {/* One rhythm down the whole column: every block is separated by the
              same 14 units, so the page has no visual hierarchy of spacing to
              read -- only the labels tell you where you are. */}
          <div className="mx-auto flex w-full max-w-[620px] flex-col gap-14">
            <div className="[--enter-delay:40ms]">
              <ProfileHeader
                name={profile.name}
                title={profile.title}
                location={profile.location}
              />
            </div>
            <div className="[--enter-delay:140ms]">
              <AboutSection />
            </div>
            {/* The lists are rendered here, on the server, and handed to the
                client component already built. Tabs only decides which one is
                on screen -- it never has to know what a project is. */}
            <div className="[--enter-delay:220ms]">
              <Tabs
                label="Experience and projects"
                tabs={[
                  {
                    id: "experience",
                    label: "experience",
                    content: (
                      <ExperienceList experiences={profile.experiences} />
                    ),
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
              Note for whoever puts the graph back: the graph's fetch is what
              gave this page its hourly revalidate. Without it the page is fully
              static, so the footer's "last updated" date now moves only on
              deploy. That is still true to the label, but it is no longer live.

              The graph also goes in ahead of the footer, so push the footer's
              start from 400ms to 480ms when it comes back.
            */}
          </div>
        </main>
      </div>
    </div>
  );
}
