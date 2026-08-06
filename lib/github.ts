/**
 * Reads a GitHub contribution calendar without an API token.
 *
 * `github.com/users/<login>/contributions` is the fragment GitHub's own profile
 * page fetches to draw the graph. It is public and unauthenticated, which is
 * the whole reason this file exists: the GraphQL API returns the same data but
 * demands a personal access token, and a portfolio should not need a secret to
 * render its own front page.
 *
 * The trade is that this is HTML, not JSON, so the shape is GitHub's to change.
 * Everything here is written to degrade rather than throw: an unreadable page
 * yields `null`, and the caller draws nothing.
 */

export type ContributionDay = {
  /** ISO date, "2026-08-01". */
  date: string;
  count: number;
  /** GitHub's own 0-4 bucket. Level, not count, decides the color. */
  level: number;
};

export type ContributionCalendar = {
  year: number;
  total: number;
  /**
   * Weeks as columns, each holding seven weekday slots. The slots at the very
   * start and end of a year are `null` -- the first week of January rarely
   * begins on a Sunday, and those gaps have to stay empty rather than render
   * as days with no contributions.
   */
  weeks: (ContributionDay | null)[][];
};

/** Matches every `<td>` that carries the ContributionCalendar-day class. */
const DAY_CELL = /<td\b([^>]*?class="ContributionCalendar-day"[^>]*)>/g;

/** Matches every `<tool-tip for="...">N contributions on ...</tool-tip>`. */
const TOOLTIP = /<tool-tip\b[^>]*?\bfor="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g;

/** `contribution-day-component-<weekday>-<week>`. */
const CELL_ID = /^contribution-day-component-(\d+)-(\d+)$/;

function attribute(tag: string, name: string): string | null {
  const match = tag.match(new RegExp(`\\b${name}="([^"]*)"`));
  return match ? match[1] : null;
}

/**
 * "14 contributions on August 17th." -> 14, and "No contributions on ..." -> 0.
 * The count only lives in the tooltip; the cell itself carries just a level.
 */
function parseCount(text: string): number {
  const match = text.match(/([\d,]+)\s+contribution/);
  return match ? Number(match[1].replace(/,/g, "")) : 0;
}

export async function fetchContributions(
  login: string,
  year: number
): Promise<ContributionCalendar | null> {
  let html: string;

  try {
    const response = await fetch(
      `https://github.com/users/${encodeURIComponent(login)}/contributions` +
        `?from=${year}-01-01&to=${year}-12-31`,
      {
        headers: {
          // GitHub serves this fragment to browsers. Say who is asking.
          "User-Agent": "berkekanber.com",
          Accept: "text/html",
        },
        // The graph moves at most a few times a day, so an hourly rebuild is
        // plenty and keeps the page off GitHub's rate limit.
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) return null;
    html = await response.text();
  } catch {
    // Offline builds and GitHub outages both land here. The page renders
    // without a graph rather than failing to render at all.
    return null;
  }

  const counts = new Map<string, number>();
  for (const [, id, text] of html.matchAll(TOOLTIP)) {
    counts.set(id, parseCount(text));
  }

  const grid: (ContributionDay | null)[][] = [];
  let total = 0;

  for (const [, tag] of html.matchAll(DAY_CELL)) {
    const id = attribute(tag, "id");
    const date = attribute(tag, "data-date");
    if (!id || !date) continue;

    const position = id.match(CELL_ID);
    if (!position) continue;

    const weekday = Number(position[1]);
    const week = Number(position[2]);

    // A cell with no tooltip is a day GitHub has not filled in -- a future
    // date in the current year. It counts as empty, not as absent.
    const count = counts.get(id) ?? 0;
    total += count;

    grid[week] ??= new Array<ContributionDay | null>(7).fill(null);
    grid[week][weekday] = {
      date,
      count,
      level: Number(attribute(tag, "data-level") ?? 0),
    };
  }

  if (grid.length === 0) return null;

  return {
    year,
    total,
    // A sparse array would leave holes if GitHub ever skipped a week index.
    weeks: Array.from(grid, (week) => week ?? new Array(7).fill(null)),
  };
}
