# chefberke-portfolio

A one-page portfolio. The page is a frame — one hairline across the top — over a
single centered column of monospace text. Every block in that column is the same
gesture: a micro label saying what a thing is, and the value beside or under it.

Every page opens on the same line read across: what the page is on the left —
`home`, `blog`, a post's title — and where it is written from on the right, in
`components/shared/Whereabouts.tsx`. The location and the ticking clock are
facts about the site, not about the page, so that component reads
`data/profile.json` itself and nothing has to pass them down. A corner that
answered on one page and was empty on the next would read as the clock having
stopped rather than as it never having been asked.

## Motion

There is one movement on the page and it happens once, on load: the top hairline
draws itself out from the left, then the column writes itself in under it. Not
block by block — line by line. A label, then the thing it names, then the next
label, each one 40ms behind the last, all the way down to the footer. The whole
page is in place inside a second.

Two classes in `styles/globals.css` do all of it, and both use the same pair of
keyframes:

- `.block-in` animates the element it sits on.
- `.stagger-in` animates the **direct children** of the element it sits on, each
  one a step later than the one before. Almost everything arrives this way.

Both are opacity and transform only, so neither can move a box while it runs.

### The three numbers

A piece's delay is `--enter-delay + --stagger-offset + --stagger-step × index`,
and each part is set by whoever knows it:

| Variable           | Set on                              | Says                                            |
| ------------------ | ----------------------------------- | ----------------------------------------------- |
| `--enter-delay`    | the block wrapper in `app/page.tsx` | when this block starts                          |
| `--stagger-offset` | a container                         | how far into the block this run of lines starts |
| `--stagger-step`   | a container, rarely                 | the gap between siblings — 40ms by default      |

All three inherit, so a container states only the one it changes. The index is
counted by `nth-child` rules in the stylesheet, capped at 16, because the
children are written as markup in one place and as `.map()` output in another and
neither can number itself without a prop threaded through every component.

The four numbers in `app/page.tsx` are starting pistols, not durations — a block
runs on past its own number by however many lines it holds. They are set to
overlap. Add a block, give it a number that starts before the block above it has
finished.

### What makes it feel like one flow

Four things, and all of them are easy to undo by accident:

- **The fade and the rise are separate animations.** `block-fade` (240ms,
  `linear`) against `block-rise` (380ms, ease-out-cubic). A fade only looks even
  if it _is_ even, and the travel wants a longer, softer curve than the fade
  does. Collapse them back into one keyframe on one ease-out-expo curve and the
  page snaps again.
- **The step is much shorter than the duration.** 40ms against 380ms, so six or
  eight lines are always in the air together. Widen the step and the page comes
  apart into separate landings.
- **The pieces are small.** A whole block arriving at once is a sheet of paper
  being laid down; the same block arriving as five lines is writing. This is the
  one rule that replaced an older one saying a block must arrive whole.
- **The rise is `translate3d`, not `translateY`.** That is what puts each piece
  on the compositor for the length of its animation, so small mono type is moved
  as a finished layer instead of being re-rasterized every frame. `will-change`
  would do the same, but it holds the layer for the life of the page, and there
  are about twenty pieces here that would each be holding one.

Two clocks on one element is still the thing to avoid: a `.stagger-in` container
must not itself be an animated child of another `.stagger-in`, or its subtree
moves twice. Keep containers as plain layout elements and animate only the leaves.

The tab strip is the one place a delay is rebased at runtime. The row delays are
written for the page's entry, where the list waits its turn behind the header and
the bio; replayed as-is on a click, that would be a quarter-second of nothing
between pressing a tab and seeing it answer. So `Tabs` zeroes `--enter-delay` and
`--stagger-offset` on the panel once the reader has switched a tab.

### The reading head

The page's entry is the only motion on a clock. There is one more on the site
and it has no clock at all: on a post, the single pass of light that ran down
the gutter rule at load comes back as `.gutter-rule__head` and stands where the
reader stands in the piece. It moves only when the reader scrolls.

**The light travels toward the reader; it does not sit on them.**
`components/shared/ReadingHead.tsx` closes 14% of the remaining distance every
frame and stops when it arrives, so the head eases out of every start and into
every stop on its own.

That easing is the whole point, and it is what the first version got wrong. A
scroll is not smooth — a wheel is notches, a keypress is a jump — and a light
pinned to the scroll position inherits every one of them as a step. Something
always moving toward the reader turns that same stuttery input into one
continuous glide.

This was a CSS scroll timeline, which was off the main thread and polled
nothing. It was replaced because it is _exact_: an animation cannot be eased
toward its own timeline, so there is no way to ask a scroll timeline for lag.
The trade is one custom property on one element per frame — and only while the
light is still catching up.

Everything else is a function of that one number, `--head-at`, from 0 to 1:

- **`transform` is `--head-at × 190%`**, which is where the rule runs out.
- **Opacity is the lower of two limits** — the light coming up out of nothing in
  the first breath of scroll, and it thinning the whole way down. They cross at
  about 6%. It thins because the rule it rides is a gradient that is gone by the
  bottom, and a light brighter than its line comes loose and floats.
- **`--head-at` starts at 0**, so a post too short to scroll, and a page where
  the script has not run, are both exactly the page as it is otherwise drawn.

Two things keep the main-thread work honest, and both are easy to undo: the loop
is not the scroll listener — the listener reads one number and starts the loop
only if it is not already running — and the listener is `passive`, so it can
never delay the scroll it is watching.

`SiteNav` mounts it on `/blog/<slug>` only. A page must be one long thing read
top to bottom before "where you are in it" is worth answering in the margin.

### Stillness

Nothing on this site moves when motion is not wanted, and there is no list of
selectors saying so. `--motion` is a number every duration on the page is
multiplied by:

```css
:root {
  --motion: 1;
}
@media (prefers-reduced-motion: reduce) {
  :root {
    --motion: 0;
  }
}
:root[data-motion="still"] {
  --motion: 0;
}
```

At `0` every animation runs for no time and its `both` fill leaves the element
on its last keyframe — the page arrives finished. **A new animation is made
still by writing its duration the way the others are written:**
`calc(380ms * var(--motion))`, delays included. Nothing has to be remembered
twice.

It is a multiplier and not a second block of rules because stillness is asked
for in two ways CSS cannot join into one selector — a media query and an
attribute — and the reading panel adds the second one.

The reading head is the exception, and the only one: it has no duration at all —
it is a position. So it multiplies its own `opacity` by `--motion` and never
lights, and its script reads the same variable and never starts. Same gate,
whatever the thing being gated is.

## Colors: tokens only, never hex

`lib/tokens.ts` is the single source of truth for every color. It is the only file
in this repo that may contain a hex value. ESLint fails the build on a hex literal
anywhere else, including Tailwind arbitrary values such as `text-[#fff]`.

The file has two layers:

- `palette` — the five raw colors: `paper`, `rule`, `ink`, `inkFaint`, `blue`.
  Edit these to change how the site looks. The neutrals are warm, not blue-gray;
  `blue` is the only saturated color on the page.
- `tokens` — semantic roles mapped onto those colors. Edit this to re-assign
  which color a role uses.

The five contribution-grid steps are generated, not hand-picked: `fade()` takes
`palette.blue` down to four opacities. Change the blue and the grid follows it.

`app/layout.tsx` writes `tokens` into the document head as CSS variables.
`styles/globals.css` maps those variables onto Tailwind utilities with
`@theme inline`, so it holds no colors of its own.

### Using a color

In markup, use the semantic class — never a palette entry, never a hex:

| Class           | Role                                                   |
| --------------- | ------------------------------------------------------ |
| `bg-surface`    | page background                                        |
| `border-rule`   | the hairlines that frame the page                      |
| `text-primary`  | content: the name, prose, role and project titles      |
| `text-faint`    | metadata: micro labels, dates, companies, footer links |
| `text-link`     | links, the open tab — anything the reader can act on   |
| `text-accent`   | text selection                                         |
| `bg-grid-0`…`4` | the five contribution-graph steps                      |

There are only two ink colors on purpose. If something needs to sit between
`text-primary` and `text-faint`, the answer is almost always that it belongs in
one of them, not that the palette needs a third step.

In JavaScript that needs a color string — a library option, or the build-time
OpenGraph image which cannot read CSS — import the token instead:

```ts
import { tokens } from "@/lib/tokens";
backgroundColor: tokens.surface;
```

Need a role that does not exist yet? Add it to `tokens`, map it in the
`@theme inline` block of `styles/globals.css`, then use it. Do not reach for a hex.

## Type

Two faces, both vendored under `app/fonts` with their OFL licenses beside them,
both loaded through `next/font/local` so there is no third-party request.

- **Ioskeley Mono** sets the whole page. `body` fixes the one text size the site
  has: 14px/1.625.
- **Geist Pixel Square** (`font-pixel`) sets exactly one string: the name in the
  header. It is a display face — do not use it for anything else.

There are exactly three sizes — one step below the body size and one above —
and, like the colors, they are named rather than written out:

| Use         | Class        | Spec                                      |
| ----------- | ------------ | ----------------------------------------- |
| body        | inherited    | 14px / 1.625 — do not restate it          |
| micro label | `text-micro` | 12px, uppercase, `tracking-[0.05em]`      |
| the name    | `text-name`  | 18px, `font-pixel`, `tracking-[-0.025em]` |

Anything that is metadata goes through `components/shared/MicroLabel.tsx` rather
than restating those classes, so the label style stays in one place.

**Never write a px size in markup.** The three classes come from `--type-micro`,
`--type-body` and `--type-name` in `styles/globals.css`, and all three are the
number times `--type-scale` — which the reading panel moves. A hard-coded
`text-[12px]` is a line that stays behind when a reader enlarges the page.

The scale is on the type sizes and not on the root `font-size`, because Tailwind
builds every spacing utility out of `0.25rem`: moving the root would take the
padding, the gaps and the hairlines with it. That is a zoom. This grows the
words and leaves the page they are written on where it is.

## The reading panel

One faint line stuck in the bottom-right corner of every page — `I wonder what
this button does 🤔` — and three preferences behind it. It is drawn as a
sentence, not as a control: there is no icon, no tile and no button box anywhere
else on this site, and one pinned to a corner would be the loudest object on the
page.

**Not on a phone.** Below `sm` it is not drawn at all. A line pinned to the
corner of a small window is standing on the page rather than beside it — it
lands on the footer and on the last line of whatever is being read. The width
where the gutter gives up its rules is the width where this gives up its corner.

`components/shared/ReaderPanel.tsx` is the whole of it, mounted in the layout so
it is not re-announced on every navigation. The panel is a native `<dialog>`
opened with `showModal()` — focus trap, Escape, inert background and restored
focus, for one method call and no library. Its `::backdrop` is turned off and
the scrim is a plain element inside it, because a backdrop does not reliably
inherit the color tokens the site is drawn from.

| Row         | Choices                | Writes                             |
| ----------- | ---------------------- | ---------------------------------- |
| `type size` | small · medium · large | `--type-scale` on the root element |
| `measure`   | narrow · wide          | `data-measure="wide"`              |
| `motion`    | on · off               | `data-motion="still"`              |

The choices are words, not the numbers behind them. A reader choosing how to
read is not setting a value, and `16` is a fact about the page that means
nothing until you have seen it. Every other label on this site names a thing
rather than measuring it. The px each word stands for is in `lib/reading.ts`,
which is where a fourth step goes.

Three things hold it together:

- **The document is the record.** Nothing keeps a second copy of these — the
  panel reads them back off the root element when it opens.
- **They are applied before the first paint.** `lib/reading.ts` names the keys
  once and exports the blocking inline script the layout writes into `<head>`.
  Every page here is prerendered at the site's own size, so a preference read
  after hydration is a page the reader watches arrive at 14px and then jump.
  That script is also why `<html>` carries `suppressHydrationWarning`: it writes
  three things onto that tag before React runs, so the tag React hydrates is not
  the tag the server sent, and only the browser can know what they should be.
  The attribute reaches that element and one level down — nothing in the page.
- **Each attribute is only ever set, never set to its default.** That is what
  makes the motion switch one-way: nothing writes `data-motion="full"`, so a
  reader whose system asks for less motion keeps it whichever way they leave the
  switch, and the row says so instead of drawing choices it cannot honor.

A fourth preference is one more `OptionRow`, its choices in `lib/reading.ts`
beside the others, and a `:root[data-…]` rule for its value to land in.

## Content

`data/profile.json` holds the name, location, title, experience, and projects.
The bio prose lives in `components/home/AboutSection.tsx`, because it is written
with inline links in it and does not survive being flattened into JSON.

## Blog

A post is one markdown file in `content/posts/`, and the filename is the slug.
There is no index and no manifest — adding a post is adding a file. Four keys:

```yaml
---
title: Writing this site
description: One sentence. It is the meta description, the card, and the index line.
date: 2026-08-06
draft: false # optional
---
```

**A malformed post fails the build and the message names the file.** A missing
`title`, `description` or `date`, a `date` that is not exactly `2026-08-06`, a
`draft` that is not `true` or `false`, a slug that is not
`lowercase-and-hyphens`, a `#` heading, or an image path that is not under
`public/` and written from the root. This is the opposite
of `lib/github.ts`, which swallows its failures — and deliberately so. That file
parses a shape GitHub can change without warning; a post is yours, and a missing
field is a typo you made a minute ago. To leave a post out on purpose, mark it
`draft: true`: drafts are readable at their own URL in `bun dev` and absent from
the index, the sitemap and the build.

### The pipeline

`lib/markdown.ts` stops one step short of HTML, at the tree, and
`components/post/PostBody.tsx` turns the tree into React elements with its own
components in the places that need them — which is the only reason an image in a
post can be a real `next/image` and an internal link a real `next/link`. There is
no compiler on the pipeline, so no HTML string is ever built; raw HTML written
into a post is dropped rather than rendered.

Everything runs at build time. Every blog route is prerendered
(`generateStaticParams` plus `dynamicParams = false`), because the deploy target
refuses a server function. **A route that reads the filesystem on request will
not run at all** — that is the same constraint that keeps `apple-touch-icon.png`
in `public/`.

### Headings

Markdown has six levels and this site has three type sizes, none of them spare.
So the levels are told apart on case, size and color — three axes, no new type:

| Level   | Form                                           |
| ------- | ---------------------------------------------- |
| `##`    | 12px, uppercase, **`text-primary`**, `mt-9`    |
| `###`   | 14px, lowercase, `text-faint`, `mt-4`          |
| `####`+ | drawn as `###` — there is no fourth appearance |
| `#`     | refused; the `h1` is the post title            |

`##` is the one micro label on the site that is not faint. A label naming a
_value_ is about the content, so it stands back; a label naming a _section_ is
the content's own skeleton, so it does not.

### Code and images

`lib/codeTheme.ts` is the only file besides `lib/tokens.ts` that goes near a
color, and it holds no hex — it maps three tokens onto TextMate scopes. Comments
faint, strings and keywords and numbers blue, everything else ink. No syntax
theme, no green, no red. The languages a post may use are listed in
`lib/markdown.ts`; anything else falls back to plain text.

An image is written `![alt](/images/blog/x.png)` and nothing more. The build
measures the file and passes the real dimensions to `next/image`, so the column
reserves the right height before the picture loads.

### Styling

`.post` in `styles/globals.css` is the one place in the repo that styles bare
elements, because it is the one place the markup was not written here. It covers
only what the component map does not replace: **CSS dresses what passes through,
`PostBody` handles what is replaced.**

The post header writes itself in line by line like everything else; the body
arrives as one `.block-in`. The stagger numbers siblings up to sixteen and a post
is longer than that, so a staggered body would land out of order — and a page
that is in place inside a second is the rule the stagger exists to serve.

## Contributions graph

`lib/github.ts` scrapes `github.com/users/<login>/contributions`, the same public
fragment GitHub's own profile page fetches. No API token, by design. It is HTML,
so the shape is GitHub's to change: every failure path returns `null` and the
section drops off the page rather than breaking the build. Revalidates hourly.
