# Berke Kanber Portfolio

Minimal personal portfolio. One hairline across the top over a single centered
column of monospace text.

- Experience & projects tabs
- A markdown blog — drop a `.md` file in `content/posts/`, the filename is the URL
- CV and social links
- CSS-only entry animation: the column writes itself in line by line
- One color palette in `lib/tokens.ts` — no hex value lives anywhere else, not
  even in the syntax highlighting
- Self-hosted fonts, so the page makes no third-party request

## Setup

```bash
bun install
bun dev
```

Browser: http://localhost:3000

## Customize

- `data/profile.json` — name, location, title, experience, projects
- `content/posts/*.md` — the blog; see the Blog section of `CLAUDE.md` for the
  frontmatter a post needs
- `lib/tokens.ts` — every color on the page
- `public/images`
- `public/documents/berke-kanber-cv.pdf`

## Tech

Next.js 16, React 19, Tailwind CSS 4
