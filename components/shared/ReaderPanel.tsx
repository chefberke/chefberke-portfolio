"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MicroLabel, { MICRO_LABEL } from "@/components/shared/MicroLabel";
import { BASE_TYPE, MEASURE_STEPS, STORAGE, TYPE_STEPS } from "@/lib/reading";

/**
 * The trigger's own type.
 *
 * `MICRO_LABEL` is not used for it: it is a sentence, not a label, and a
 * sentence set in caps reads as shouting. It takes the other shape the page
 * already has at that size -- the value line under a micro label, as the footer
 * sets "Next.js" -- so nothing new is introduced for it.
 */
const SMALL = "text-micro leading-[1.625] tracking-[0.05em]";

type Choice = { value: string; label: string };

/**
 * One preference: a micro label saying what it is, and the choices beside it.
 *
 * It is the page's own grammar, and the choices are drawn as the tab strip is
 * drawn -- the same wipe-in rule, held open under whichever one is set. That is
 * deliberate: a tab strip and a preference are the same object here, one thing
 * open out of a few, so they are marked the same way rather than given a switch
 * or a checkbox that exists nowhere else on the site.
 *
 * `radiogroup` rather than `tablist`, because these choose a value rather than
 * reveal a panel, and arrow keys walk the group either way.
 */
function OptionRow({
  label,
  choices,
  value,
  onChange,
  note,
}: {
  label: string;
  choices: readonly Choice[];
  value: string;
  onChange: (value: string) => void;
  /** Stands in for the choices when the reader has no say -- see `motion`. */
  note?: string;
}) {
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});
  const index = choices.findIndex((choice) => choice.value === value);

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (step === 0) return;

    event.preventDefault();
    const next = choices[(index + step + choices.length) % choices.length];
    onChange(next.value);
    buttons.current[next.value]?.focus();
  }

  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-rule py-3">
      <MicroLabel>{label}</MicroLabel>

      {note ? (
        <p className={`text-right text-faint ${SMALL}`}>{note}</p>
      ) : (
        <div
          role="radiogroup"
          aria-label={label}
          onKeyDown={onKeyDown}
          className="flex items-center gap-4"
        >
          {choices.map((choice) => {
            const set = choice.value === value;

            return (
              <button
                key={choice.value}
                ref={(node) => {
                  buttons.current[choice.value] = node;
                }}
                type="button"
                role="radio"
                aria-checked={set}
                // Only the set choice is in the tab order; the arrow keys are
                // how you reach the others, the same as the tab strip.
                tabIndex={set ? 0 : -1}
                onClick={() => onChange(choice.value)}
                className={`tab-underline cursor-pointer ${MICRO_LABEL} ${
                  set ? "text-link" : "text-faint hover:text-primary"
                }`}
              >
                {choice.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// The value a choice carries is the px it stands for, because that is what the
// document and the storage key are written in. The word is what the reader is
// shown -- see the note in lib/reading.ts about why they are words at all.
const TYPE_CHOICES: Choice[] = TYPE_STEPS.map((step) => ({
  value: String(step.px),
  label: step.label,
}));

const MEASURE_CHOICES: Choice[] = MEASURE_STEPS.map((step) => ({
  value: String(step.px),
  label: step.label,
}));

const MOTION_CHOICES: Choice[] = [
  { value: "full", label: "on" },
  { value: "still", label: "off" },
];

/**
 * The bottom-right corner of every page: one faint line asking to be pressed,
 * and the three things a reader can change about the site behind it.
 *
 * It is drawn as a sentence rather than as a control, because it is not one --
 * there is no icon, no tile, no button box anywhere else on this site, and one
 * pinned to a corner would be the loudest object on the page. Faint type with
 * the same underline every link here wipes in on hover says all a reader needs:
 * this is text you can press.
 *
 * It arrives last, at 900ms, after the column above it has finished writing
 * itself. A joke that lands with the page is part of the page; a joke that
 * arrives once the page has settled is an aside.
 *
 * The panel is a native `<dialog>` opened with `showModal()`, which is what
 * gives it the focus trap, the Escape key, the inert background and the
 * restored focus on close -- all of it, for one method call and no library.
 *
 * Its own backdrop is turned off and a scrim is drawn inside instead.
 * `::backdrop` sits outside the tree for the purpose of inheritance in older
 * engines, so the color tokens this whole site is drawn from do not reliably
 * reach it. A plain element inside the dialog inherits them the ordinary way.
 *
 * Nothing here holds a copy of the reader's settings. The document holds them
 * -- an inline style for the size, an attribute for the other two, all three
 * put there before the first paint by lib/reading.ts -- and this reads them
 * back when it opens. State drawn from the same place it is written to cannot
 * drift out of step with the page it is describing.
 */
export default function ReaderPanel() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // The site's own values, which is also what the server rendered. Nothing
  // reads the document until the panel is asked for, so the first render
  // matches the HTML exactly and hydration has nothing to disagree with.
  const [type, setType] = useState(String(BASE_TYPE));
  const [measure, setMeasure] = useState(String(MEASURE_STEPS[0].px));
  const [motion, setMotion] = useState("full");
  // A system that asks for less motion is not overruled from here. The switch
  // can only ever add stillness, so when the system has already asked, the row
  // has nothing left to offer and says so.
  const [systemStill, setSystemStill] = useState(false);

  /**
   * Opening is where the panel finds out what it is describing.
   *
   * The document is the record -- an inline `--type-scale`, two data
   * attributes, all three written before the first paint -- and this reads it
   * back rather than keeping a second copy in step with it. Doing that on the
   * click rather than on mount also means no state is set while the page is
   * still arriving, and nothing is read that the server could not have
   * rendered.
   */
  function openPanel() {
    const root = document.documentElement;
    const scale = Number(root.style.getPropertyValue("--type-scale"));

    setType(String(scale > 0 ? Math.round(scale * BASE_TYPE) : BASE_TYPE));
    setMeasure(
      String(
        root.dataset.measure === "wide"
          ? MEASURE_STEPS[1].px
          : MEASURE_STEPS[0].px,
      ),
    );
    setMotion(root.dataset.motion === "still" ? "still" : "full");
    setSystemStill(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    setOpen(true);
  }

  // `showModal()` is the only way into the top layer, and it cannot be an
  // attribute -- a <dialog open> is a non-modal dialog with none of the
  // behavior this panel is built on. So React holds the state and the effect
  // keeps the element in step with it.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  /** Writes a preference down, quietly giving up if the browser refuses. */
  const remember = useCallback((key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Private browsing, mostly. The setting still holds for this visit --
      // it is on the document -- it just will not survive a reload.
    }
  }, []);

  function chooseType(value: string) {
    setType(value);
    document.documentElement.style.setProperty(
      "--type-scale",
      String(Number(value) / BASE_TYPE),
    );
    remember(STORAGE.type, value);
  }

  function chooseMeasure(value: string) {
    setMeasure(value);
    const wide = value !== String(MEASURE_STEPS[0].px);

    // Only ever set, never set to the default: an absent attribute is the
    // site's own measure, so there is one state to reason about rather than
    // two that mean the same thing.
    if (wide) document.documentElement.dataset.measure = "wide";
    else delete document.documentElement.dataset.measure;

    remember(STORAGE.measure, wide ? "wide" : "column");
  }

  function chooseMotion(value: string) {
    setMotion(value);

    if (value === "still") document.documentElement.dataset.motion = "still";
    else delete document.documentElement.dataset.motion;

    remember(STORAGE.motion, value);
  }

  return (
    <>
      <button
        type="button"
        onClick={openPanel}
        aria-haspopup="dialog"
        aria-expanded={open}
        // Not drawn on a phone at all. A line pinned to the corner of a small
        // window is standing on the page rather than beside it -- there is no
        // margin down there for an aside to sit in, so it lands on the footer
        // and on the last line of whatever is being read. The same width where
        // the gutter gives up its rules is where this gives up its corner.
        className={`link-underline block-in fixed right-5 bottom-5 z-40 hidden cursor-pointer text-faint hover:text-primary sm:block [--enter-delay:900ms] ${SMALL}`}
      >
        I wonder what this button does 🤔
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="reader-panel-title"
        // Escape closes the dialog itself and fires `close`, so that event --
        // not the click handler -- is the one place the state comes back down.
        onClose={() => setOpen(false)}
        // The element is stretched over the window and stripped of everything
        // the user agent gives it: the box, the margins, the backdrop. What is
        // drawn is the two children inside it.
        className="fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 text-primary backdrop:bg-transparent"
      >
        {/* The page, held back. It is the ink of the site at a tenth strength
            rather than black at a half: a scrim is the paper in shadow, not a
            sheet of something else laid over it. */}
        <div
          className="panel-scrim scrim-in absolute inset-0"
          onClick={() => setOpen(false)}
        />

        {/* Transparent to the pointer, so everything the card does not cover is
            still the scrim and still closes the panel. */}
        <div className="pointer-events-none relative flex min-h-full items-center justify-center p-6">
          {/*
           * The card is the page's own frame drawn small: one hairline around
           * paper, no radius, no shadow.
           *
           * It arrives as one piece rather than line by line. A `.stagger-in`
           * inside a `.block-in` is two clocks on one subtree -- see the note in
           * CLAUDE.md -- and a panel is short enough that a cascade would be
           * read as hesitation rather than as writing.
           */}
          <div className="block-in pointer-events-auto flex w-full max-w-[420px] flex-col gap-6 border border-rule bg-surface p-6">
            <header className="flex flex-col gap-2">
              <MicroLabel as="p">reading</MicroLabel>
              <h2 id="reader-panel-title" className="text-primary">
                What this button does.
              </h2>
              <p className={`text-pretty text-faint ${SMALL}`}>
                How this page is set, while you are the one reading it.
              </p>
            </header>

            <div className="flex flex-col">
              <OptionRow
                label="type size"
                choices={TYPE_CHOICES}
                value={type}
                onChange={chooseType}
              />
              <OptionRow
                label="measure"
                choices={MEASURE_CHOICES}
                value={measure}
                onChange={chooseMeasure}
              />
              <OptionRow
                label="motion"
                choices={MOTION_CHOICES}
                value={systemStill ? "still" : motion}
                onChange={chooseMotion}
                note={systemStill ? "your system asks for none" : undefined}
              />
            </div>

            <div className="flex items-baseline justify-between gap-6">
              <MicroLabel>kept in this browser</MicroLabel>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={`tab-underline cursor-pointer text-link ${MICRO_LABEL}`}
              >
                close
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
