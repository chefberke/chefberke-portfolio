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
  header. It is a display face — do not use it for anything else on the page.
  The share cards are the one place outside the page it appears: it sets each
  card's line, which is that card's name for its page.

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

## Share cards

A card is one line typed at a prompt. The page's name — `berke kanber`, the
blog's line, a post's title — set large and lowercase in the pixel face, the
way the header sets the name, with a blue block cursor
after its last word; under it, faint and behind a blue `›`, the one fact that
goes with it: the role, the note count, the date and reading time. The hairline
across the top and `berkekanber.com` in the top-right corner are the whole of
the frame. `lib/ogCard.tsx` draws it and takes two strings; each
`opengraph-image.tsx` supplies those two and nothing else.

It keeps the site's material and drops its furniture. Paper, the two inks, both
faces, the top hairline, and blue spent on exactly two things — the cursor
and the prompt mark. No gutter, no nav, no photograph, no corner location. A
card is read as a thumbnail for as long as it takes to scroll past it, so it
says what the page is and stops.

There is one card per page, because the line is the page's own: a page
borrowing another page's card would name the wrong thing. Add a page, add its
card beside it.

The type is bigger than the site's: a page is read at arm's length, a card at
500px wide in a feed, and being legible there is the one thing a card is allowed
to disagree with the page about.

### What it took to look like the site

**Satori cannot open a `woff2`.** That is the whole reason the old cards were
set in a stray sans. `app/fonts/*-card.ttf` are the same two faces decompressed
and cut down to Latin-1, Latin Extended-A and general punctuation, with the
hinting stripped — 59KB for the pair instead of 2MB. Both faces are cut to the
same ranges: a post title is set in the pixel face, and a glyph missing from it
is quietly drawn in the mono instead, so a dash or a curly quote in a title comes
out in the wrong face rather than failing. A post whose title reaches outside
that range comes out blank and needs the subset widened.

Three more things that are easy to undo:

- **The cursor is a word.** Satori has no `inline-block`, and a cursor beside a
  wrapped text box stands beside the whole block. So the line is split into one
  box per word in a wrapping flex row, each word but the last carrying its own
  no-break space — the pixel face is not monospaced, so the gap has to be its
  own space rather than a measured one — and the cursor sits inside the last
  word's box, so it follows a long title down to whichever line its last word
  lands on and can never wrap onto a line of its own. A single word wider than
  the column would overflow rather than break.
- **`metadata.openGraph.images` is not set anywhere.** An explicitly named image
  is inherited whole by every segment under it, so naming the home page's card
  in the layout would put the name on every post. Left unset, Next fills the
  field per segment from the `opengraph-image.tsx` beside that segment's page,
  and hashes each URL so a redrawn card is not served from a scraper's cache.
- **A box holding two JSX children must declare a display.** `{n} min read` is
  two children. Every interpolated label here is written as one template string.

### What a card, a description and the structured data may not say

No frameworks. Not in `description`, not in `keywords`, not in the JSON-LD
`description`. A stack is what the work was done with, not what it is; the list
dates the moment it is written and is the same one every other developer's card
carries. The projects in `data/profile.json` already say it in the only place it
is a fact rather than a claim, and `knowsAbout` in `lib/jsonLd.ts` is built from
those — which is where a machine asks the question.

The descriptions are the bio said shortly. `components/home/AboutSection.tsx` is
where the words come from.

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
`lowercase-and-hyphens`, a `#` heading, an image path that is not under
`public/` and written from the root, or a frontmatter block written in anything
but YAML. This is the opposite
of `lib/github.ts`, which swallows its failures — and deliberately so. That file
parses a shape GitHub can change without warning; a post is yours, and a missing
field is a typo you made a minute ago. To leave a post out on purpose, mark it
`draft: true`: drafts are readable at their own URL in `bun dev` and absent from
the index, the sitemap and the build.

The last of those is not a house rule about consistency. `gray-matter` dispatches
on whatever word is written after the opening `---`, and one of the languages it
will dispatch to is JavaScript — an engine that is a literal `eval`. A file
beginning `---js` is then not a document with a header on it, it is a program,
and it runs with the build's own reach before any of the checks above have looked
at it. So `lib/posts.ts` names that engine and `json` beside it and replaces both
with a refusal: the only header a post may carry is the one written above, and
every other language `gray-matter` knows a name for was unregistered already.

### The pipeline

`lib/markdown.ts` stops one step short of HTML, at the tree, and
`components/post/PostBody.tsx` turns the tree into React elements with its own
components in the places that need them — which is the only reason an image in a
post can be a real `next/image` and an internal link a real `next/link`. There is
no compiler on the pipeline, so no HTML string is ever built; raw HTML written
into a post is dropped rather than rendered.

Everything runs at build time. Every blog route is prerendered
(`generateStaticParams` plus `dynamicParams = false`), because there is no server
at the other end of this build. **A route that reads the filesystem on request
will not run at all** — that is the same constraint that keeps
`apple-touch-icon.png` in `public/`, and it is the whole of _The build_ below.

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

### Small pictures between paragraphs

Two ways, and the first is almost always enough:

- **A ```` ```note ```` block** is a list or a bar drawn in text, in the same
  mono face as the prose. `lib/noteGrammar.ts` colors five glyphs with scopes
  the code theme already has: `?` at a line start and `[ ]` and `░` faint,
  `[x]` and `█` blue. Everything else is ink. No file, no new color.
- **A drawing** is an SVG in `public/images/blog/<slug>/`, written
  `![alt](/images/blog/<slug>/x.svg "caption")`. The title becomes a micro
  label under it in a `<figure>`; the alt stays a description for someone who
  cannot see it. An SVG carries no frame, because it is drawn in the page's own
  hairlines. It cannot read the page's CSS, so its colors are `palette` values
  copied in by hand, and the file says so in a comment. Use `rule` for lines
  and `blue` for the one thing that matters, nothing else. Draw it 620 wide,
  edge to edge, and give every stroke `vector-effect="non-scaling-stroke"`:
  `.post` stretches an SVG to whatever the column is -- a phone, or 760 when a
  reader picks `wide` -- and that keeps the lines at one pixel while it does.

One or two per post. Each one is a pause in the reading, and a post with one
between every section has stopped being read.

### Styling

`.post` in `styles/globals.css` is the one place in the repo that styles bare
elements, because it is the one place the markup was not written here. It covers
only what the component map does not replace: **CSS dresses what passes through,
`PostBody` handles what is replaced.**

The post header writes itself in line by line like everything else; the body
arrives as one `.block-in`. The stagger numbers siblings up to sixteen and a post
is longer than that, so a staggered body would land out of order — and a page
that is in place inside a second is the rule the stagger exists to serve.

## Search and sharing

Every page names its own title, description, canonical URL and share tags; the
root layout holds the home page's. Three things keep them honest:

- **A page that sets `openGraph`, `twitter` or `alternates` replaces the
  layout's whole object.** Next merges metadata key by key, not field by field.
  So the parts that are about the site rather than the page — the site name,
  the locale, the X handle, the feed link — live once in `lib/site.ts` and every
  route spreads them in. A field set only in the layout is a field missing from
  every post.
- **A date is the content's, or there is none.** A post's sitemap entry carries
  its own date, the blog's carries the newest post's, and the home page carries
  none — the only date it could give is the build's, and a page stamped as
  changed on every deploy teaches a crawler to ignore the true dates too. The
  feed follows the same rule.
- **A post names its author in place.** `lib/jsonLd.ts` publishes `#person` on
  the home page, but Google reads one page at a time and does not follow an
  `@id` across pages, so `lib/postJsonLd.ts` writes the name and URL beside it.

`app/feed.xml/route.ts` is the blog as RSS: title, description and date per
note, never the body. Drafts are out of it for the same reason they are out of
the sitemap.

## Contributions graph

`lib/github.ts` scrapes `github.com/users/<login>/contributions`, the same public
fragment GitHub's own profile page fetches. No API token, by design. It is HTML,
so the shape is GitHub's to change: every failure path returns `null` and the
section drops off the page rather than breaking the build.

Its `revalidate: 3600` is now a build-time number and nothing more: the fetch
runs once, while the page is being written, and the graph it draws is the graph
of the last deploy. Nothing on a static export comes back an hour later. The
call keeps the field because the day this site has a server again is the day it
means what it says.

## The build

`next build` writes the finished site to `out/` and that is the whole artifact —
`output: "export"` in `next.config.ts`. Cloudflare Pages serves the directory:
**build command `npm run build`, output directory `out`, and no adapter.**

There used to be one. `@cloudflare/next-on-pages` wrapped the build in a Worker,
and it is deprecated and no longer reads what Next 16 emits: it dropped the three
cards, the icon, `robots.txt` and `sitemap.xml` out of the deploy without naming
one of them, then refused the build over the one route it could not classify.
Nothing here needed the Worker it was building. Every page, card and file on this
site is drawn while the build runs.

So the rule the rest of this file keeps referring to is now the build's own: **a
route that reads anything at request time fails `next build` by name.** There is
no request.

Three things follow from it, and each one is a line somewhere:

- **A metadata route must say `dynamic = "force-static"`.** `app/icon.tsx`,
  `app/robots.ts`, `app/sitemap.ts`, `app/feed.xml/route.ts` and all three
  `opengraph-image.tsx` carry it. Without it the route is compiled as a handler
  and the export stops on it.
- **`next/image` is `unoptimized`.** There is no optimizer at the other end, and
  there never was one — the Cloudflare deploy has been serving `/_next/image`
  the source bytes for as long as it has existed. The component still measures
  the file and reserves its box, which is the half of it this site uses. The
  consequence: **an image belongs in `public/` at roughly the size it is read
  at**, because the whole file is now what ships.
- **`public/_headers` is everything the site can say in a header.** There is no
  server, so the file carries two jobs. A `/*` block at the top sets the security
  headers — CSP, HSTS, `nosniff`, `Referrer-Policy`, `X-Frame-Options` and COOP —
  and the four rules under it type the files that have no extension. Pages reads
  a file's type off its name, and Next names a metadata image after its route —
  `out/icon`, `out/opengraph-image`. Untyped they go out as
  `application/octet-stream`: a favicon no browser draws, a card no scraper
  opens. Pages applies every matching block, so the two jobs do not collide. Add
  a page with a card, add its two lines there.

  The CSP is holding up two things described above, and tightening it breaks
  them. `script-src` keeps `'unsafe-inline'` because the boot script in
  `app/layout.tsx` is inline and blocking by design, and a static export has no
  request to mint a nonce on. A hash list is no way out either: most of the
  inline scripts in a built page are Next's own RSC payload, whose contents
  change with the page and with every build, so the list would have to be written
  back into this file after each one. `style-src` keeps it for the token `<style>`
  on the line above the script. What stands between this site and injected script
  is therefore not `script-src` — it is `default-src 'none'` and the four
  directives under it, which mean a script that does get in still cannot reach a
  third party, rewrite the base URL, post a form, or be framed.
