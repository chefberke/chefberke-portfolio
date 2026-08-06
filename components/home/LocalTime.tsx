"use client";

import { useEffect, useState } from "react";

const TIME_ZONE = "Europe/Istanbul";

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/**
 * "GMT+3". Istanbul does not change for daylight saving, so this is a constant
 * in practice, but reading it from Intl means the page stays right if the zone
 * ever moves. It is the same on the server and in the browser, so it can be
 * rendered before mount without a hydration mismatch.
 */
const zoneLabel =
  new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    timeZoneName: "shortOffset",
  })
    .formatToParts(new Date())
    .find((part) => part.type === "timeZoneName")?.value ?? "";

/**
 * The clock under the location: what time it is where Berke is, ticking.
 *
 * It is set in the same gray as the label above it. Violet on this page means
 * "you can click this", and the clock is the one live thing that is not a link,
 * so it stays out of the accent color and reads as part of its own column.
 *
 * The digits only appear after mount. This page is static, so a time rendered
 * on the server would be the time of the last build, and it would disagree with
 * the browser on the first paint. The dashes hold the same width in a mono
 * face, so nothing shifts when the real time arrives.
 */
export default function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(timeFormat.format(new Date()));

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="text-micro uppercase leading-[1.625] tracking-[0.05em] text-faint">
      {time ?? "--:--:--"} {zoneLabel}
    </span>
  );
}
