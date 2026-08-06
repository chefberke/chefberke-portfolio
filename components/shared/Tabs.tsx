"use client";

import { useId, useRef, useState } from "react";

export type TabItem = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: TabItem[];
  /** Accessible name for the tab strip, read before the tab names. */
  label: string;
};

/**
 * The experience and project lists, folded into one block.
 *
 * Stacked, the two lists made the page long enough that the contribution graph
 * fell below a second scroll. Only one of them is ever on screen.
 *
 * The strip keeps the page's grammar: the tab names are the same micro labels
 * every other section is titled with. The only thing that marks them as
 * controls is the blue, which everywhere else on this page means "you can click
 * this", and the rule that slides under whichever one is open -- the same rule,
 * with the same wipe, that every link on the page draws on hover.
 *
 * Both panels are rendered and the closed one is `hidden`, rather than the
 * closed one being left unrendered. A crawler does not click tabs: rendering
 * only the open panel meant every project on this site -- the titles, the
 * descriptions, the links -- existed nowhere in the document, and half the page
 * was invisible to search. `hidden` puts that text in the HTML and still keeps
 * it out of the layout, out of the tab order, and out of a screen reader.
 *
 * That also happens to be what replays the entry animation. An element with
 * `display: none` runs no animations at all, and starts them from the beginning
 * when it is displayed again -- so the rows of a panel cascade in on the switch
 * the same way they did on load, without a keyed remount to force it.
 */
export default function Tabs({ tabs, label }: TabsProps) {
  const [activeId, setActiveId] = useState(tabs[0].id);
  // The row delays are written for the page's entry, where this block waits its
  // turn behind the header and the bio. Replayed as-is on a click that would be
  // a quarter-second of nothing between pressing a tab and seeing it answer --
  // so once the reader has switched a tab, the panel rebases its cascade to
  // zero and the new list starts on the click.
  const [hasSwitched, setHasSwitched] = useState(false);
  const baseId = useId();
  const headingId = `${baseId}-heading`;
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const activeIndex = tabs.findIndex((tab) => tab.id === activeId);
  const active = tabs[activeIndex] ?? tabs[0];

  // Left and right walk the strip and move the panel with them, which is what
  // a tab strip is expected to do once one of its tabs has focus.
  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (step === 0) return;

    event.preventDefault();
    const next = tabs[(activeIndex + step + tabs.length) % tabs.length];
    openTab(next.id);
    tabRefs.current[next.id]?.focus();
  }

  function openTab(id: string) {
    setActiveId(id);
    setHasSwitched(true);
  }

  return (
    <section className="flex flex-col gap-6" aria-labelledby={headingId}>
      {/* The block's title, for the document outline only. On screen the tab
          strip names itself; a heading above it would say the same words twice.
          `sr-only` is absolutely positioned, so it is not a flex item and the
          gap above the strip is unchanged. */}
      <h2 id={headingId} className="sr-only">
        {label}
      </h2>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="stagger-in flex items-center gap-5"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active.id;

          return (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[tab.id] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${tab.id}`}
              // Only the open tab is in the tab order. Arrow keys move between
              // them once the strip has focus.
              tabIndex={isActive ? 0 : -1}
              onClick={() => openTab(tab.id)}
              className={`tab-underline cursor-pointer text-micro uppercase leading-none tracking-[0.05em] ${
                isActive ? "text-link" : "text-faint hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          // Rendered either way; only the open one has a box. Nothing here may
          // set a `display` utility, or it would win over the attribute.
          hidden={tab.id !== active.id}
          // The panel does not animate. It sets the offset the list inside it
          // cascades from, two steps behind the tab strip above.
          className={
            hasSwitched
              ? "[--enter-delay:0ms] [--stagger-offset:0ms]"
              : "[--stagger-offset:80ms]"
          }
        >
          {tab.content}
        </div>
      ))}
    </section>
  );
}
