"use client";

import { useEffect, useRef } from "react";

/**
 * How much of the gap the light closes in one 60fps frame.
 *
 * This is the whole feel of the thing. Too high and it is welded to the scroll
 * again -- which is what it used to be, and what made a wheel notch land as a
 * step rather than as a movement. Too low and it drifts in behind the reader
 * like something being dragged. At 0.14 the light is most of the way there
 * within about a fifth of a second: it starts when you start and arrives just
 * after you stop, which is what reads as one continuous glide over a scroll
 * made of discrete jumps.
 */
const SETTLE = 0.14;

/** A frame at 60fps, in ms. The unit `SETTLE` is quoted in. */
const FRAME = 1000 / 60;

/**
 * Below this the light is close enough to be there, and the loop stops. Without
 * it an exponential approach never technically arrives and a page sitting still
 * would run a frame callback forever.
 */
const ARRIVED = 0.0002;

/**
 * The reading head: where the reader stands in a post, held in the margin.
 *
 * The light does not sit where the scroll is. It travels toward it, closing the
 * distance a fixed fraction per frame, so it eases out of every start and into
 * every stop on its own -- and that is the point. A scroll is not smooth: a
 * wheel is notches, a keypress is a jump, and a light pinned to the scroll
 * position inherits every one of those as a step. Something that is always
 * moving toward the reader rather than standing on them turns that same stuttery
 * input into one continuous movement.
 *
 * This is the one thing on the site that runs on the main thread, and it is
 * worth saying why, because the CSS scroll timeline it replaced did not.
 * `animation-timeline: scroll()` is placed off-thread and polls nothing, which
 * is better in every way but the one that matters here: it is exact. It puts the
 * light precisely where the scroll is, every frame, and there is no way to ask
 * it for lag -- an animation cannot be eased toward its own timeline. The trade
 * is one custom property written to one element per frame, only while the light
 * is still catching up, and both properties it drives are compositor properties.
 *
 * Two things keep that honest:
 *
 * - **The loop is not the scroll listener.** The listener does nothing but read
 *   a number and start the loop if it is not already running; the loop stops
 *   itself once it arrives. A page held still costs nothing.
 * - **The listener is passive**, so it can never delay the scroll it is
 *   watching.
 *
 * Nothing runs at all when motion is not wanted. `--motion` is 0 there, the
 * element's opacity is multiplied by it in the stylesheet, and the effect below
 * reads the same variable and never starts. Someone who asked for less motion
 * has not asked for a lamp that follows their scroll; the scroll bar already
 * answers that question without moving anything that was not already moving.
 *
 * Mounted on `/blog/<slug>` only -- see `components/shared/SiteNav.tsx`.
 */
export default function ReadingHead() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    /**
     * The stylesheet's own answer, whether it came from the system preference
     * or from the reading panel. There is one gate on this site and this reads
     * it, rather than asking the same question a second way and having two
     * places that can disagree.
     *
     * It is asked at the start of a scroll rather than once on mount, because
     * the reader can open the panel mid-post and change the answer. Asked once,
     * turning motion back on would leave the light dead until a navigation.
     * It is not asked per scroll event -- only when the loop is idle, so a
     * whole gesture costs one read.
     */
    function still() {
      return (
        getComputedStyle(document.documentElement)
          .getPropertyValue("--motion")
          .trim() === "0"
      );
    }

    let frame = 0;
    let running = false;
    let last = 0;
    let at = 0;
    let target = 0;

    function measure() {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      target = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
    }

    function step(now: number) {
      // Framerate-independent: the same fraction per 16.7ms however often this
      // is called, so a 120Hz screen settles at the same speed a 60Hz one does
      // rather than twice as fast. The clamp keeps a backgrounded tab from
      // coming back and snapping the light across the page in one frame.
      const elapsed = Math.min(64, now - last);
      last = now;
      at += (target - at) * (1 - Math.pow(1 - SETTLE, elapsed / FRAME));

      if (Math.abs(target - at) < ARRIVED) {
        at = target;
        running = false;
      }

      element!.style.setProperty("--head-at", String(at));
      if (running) frame = requestAnimationFrame(step);
    }

    function start() {
      measure();
      if (running || still()) return;

      running = true;
      last = performance.now();
      frame = requestAnimationFrame(step);
    }

    // Where the reader already is. A post opened at an anchor, or restored to
    // its old scroll position, starts with the light in place rather than
    // sliding it down from the top.
    measure();
    at = target;
    element.style.setProperty("--head-at", String(at));

    window.addEventListener("scroll", start, { passive: true });
    window.addEventListener("resize", start, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", start);
      window.removeEventListener("resize", start);
    };
  }, []);

  return <div ref={ref} className="gutter-rule__head" />;
}
