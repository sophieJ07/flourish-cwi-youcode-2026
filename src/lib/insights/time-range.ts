export type ShortTimeRange = "1h" | "6h" | "today";

const STAFF_INSIGHTS_TZ = "America/Vancouver";

/** First instant of the current calendar day in the staff insights time zone. */
function startOfZonedCalendarDay(now: Date, timeZone: string): Date {
  const targetYmd = now.toLocaleDateString("en-CA", { timeZone });
  const hourMs = 3600_000;
  let t = now.getTime();
  while (new Date(t).toLocaleDateString("en-CA", { timeZone }) === targetYmd) {
    t -= hourMs;
  }
  while (new Date(t).toLocaleDateString("en-CA", { timeZone }) !== targetYmd) {
    t += hourMs;
  }
  const minuteMs = 60_000;
  while (
    new Date(t - minuteMs).toLocaleDateString("en-CA", { timeZone }) === targetYmd
  ) {
    t -= minuteMs;
  }
  return new Date(t);
}

export function getRangeBounds(range: ShortTimeRange): {
  since: string;
  until: string;
  label: string;
} {
  const until = new Date();
  let since: Date;
  let label: string;

  if (range === "1h") {
    since = new Date(until.getTime() - 3600_000);
    label = "Last hour";
  } else if (range === "6h") {
    since = new Date(until.getTime() - 6 * 3600_000);
    label = "Last 6 hours";
  } else {
    since = startOfZonedCalendarDay(until, STAFF_INSIGHTS_TZ);
    label = "Today";
  }

  return {
    since: since.toISOString(),
    until: until.toISOString(),
    label,
  };
}

export function parseShortTimeRange(
  raw: string | undefined,
): ShortTimeRange {
  if (raw === "1h" || raw === "6h" || raw === "today") return raw;
  return "today";
}

/** Long dashboard windows (calendar weeks in staff TZ). */
export type LongTimeRange = "1w" | "2w";

export function getLongRangeBounds(range: LongTimeRange): {
  since: string;
  until: string;
  label: string;
} {
  const until = new Date();
  const dayMs = 24 * 3600_000;
  const days = range === "1w" ? 7 : 14;
  const since = new Date(until.getTime() - days * dayMs);
  const label = range === "1w" ? "Last week" : "Last 2 weeks";
  return {
    since: since.toISOString(),
    until: until.toISOString(),
    label,
  };
}

export function parseLongTimeRange(raw: string | undefined): LongTimeRange {
  if (raw === "1w") return "1w";
  return "2w";
}
