import Image from "next/image";
import MicroLabel from "@/components/shared/MicroLabel";
import Whereabouts from "@/components/shared/Whereabouts";

type ProfileHeaderProps = {
  name: string;
  title: string;
};

/**
 * The top of the page: a two-by-two block.
 *
 * The left column says who, the right column says where and when. The micro
 * labels sit on one line and the values sit under them, so the four cells lock
 * into a grid without any rules being drawn between them.
 *
 * The name is lowercase and set at the same weight as the body text. Nothing on
 * this page shouts, and a name in the same key as everything around it is a
 * quieter introduction than a large bold one.
 *
 * On load the two columns fill in together, and both do it the same way: the
 * micro label first, then what it names. The page name and the location arrive
 * on the same beat, so the top of the page reads as one line being written
 * across before anything is written under it.
 */
export default function ProfileHeader({ name, title }: ProfileHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        {/* The page says its own name, the same way every other block on the
            site says what it is. It is the word the gutter is pointing at, so
            the two must not disagree -- and the blog page opens with `blog` in
            this same slot. The star that stood here for a while said the same
            thing as a mark, but a mark cannot be read back to you; it is still
            drawn in components/shared/Star.tsx, where the favicon takes it. */}
        <MicroLabel as="p" className="block-in">
          home
        </MicroLabel>
        <div className="flex items-center gap-3">
          {/*
            The only image on the page. It runs taller than the two lines beside
            it on purpose -- matched to their height it read as an icon rather
            than as a photograph of a person.

            The hairline around it is the same color as the page frame, so it
            sits in the layout rather than on top of it. The source is 800px
            square: room for any pixel ratio, and the file the reader is sent,
            since a static export has no optimizer to cut it down. It is 72KB.
            Shrink the source before adding a second photograph, not after.

            The photo arrives one step ahead of the name beside it -- the same
            step every other line on the page uses. Nothing inside it moves on
            its own; it rises whole, like a line of type.
          */}
          <div className="block-in [--stagger-offset:40ms] size-14 shrink-0 overflow-hidden ring-1 ring-rule">
            <Image
              src="/images/chefberke.jpg"
              alt={`${name}, ${title}`}
              width={56}
              height={56}
              priority
              className="size-14"
            />
          </div>
          {/* The name and the role are the block's third and fourth beats. The
              photo is already up by the time the name lands on it. */}
          <div className="stagger-in [--stagger-offset:80ms] flex flex-col gap-1.5">
            {/*
              The one string on the site set in Geist Pixel Square. A pixel face
              at 18px next to a page of 14px mono is the whole hierarchy: the
              name does not need to be bigger or bolder than anything else, it
              just has to be the only thing drawn on a different grid. The
              negative tracking pulls the squares back together, since a pixel
              face sets loose at this size.
            */}
            <h1 className="font-pixel text-name lowercase leading-none tracking-[-0.025em] text-primary">
              {name}
            </h1>
            <p className="text-micro lowercase leading-none text-faint">
              {title}
            </p>
          </div>
        </div>
      </div>
      <Whereabouts />
    </header>
  );
}
