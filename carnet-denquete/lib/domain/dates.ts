// Pure date helpers working on calendar days in the user's local frame.
// We represent dates as "YYYY-MM-DD" strings ("ISODate") to stay timezone-safe:
// the protocol only ever reasons about whole calendar days, never instants.

export type ISODate = string; // "YYYY-MM-DD"

const DAY_MS = 24 * 60 * 60 * 1000;

/** Parse "YYYY-MM-DD" to a UTC-midnight Date (stable, no DST drift). */
export function parseISO(d: ISODate): Date {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, day));
}

/** Format a Date (interpreted in UTC) back to "YYYY-MM-DD". */
export function toISO(date: Date): ISODate {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Whole calendar days from `a` to `b` (b - a). Negative if b precedes a. */
export function diffDays(a: ISODate, b: ISODate): number {
  return Math.round((parseISO(b).getTime() - parseISO(a).getTime()) / DAY_MS);
}

export function addDays(d: ISODate, n: number): ISODate {
  return toISO(new Date(parseISO(d).getTime() + n * DAY_MS));
}

/** Inclusive list of dates from `start` to `end`. */
export function rangeInclusive(start: ISODate, end: ISODate): ISODate[] {
  const out: ISODate[] = [];
  const total = diffDays(start, end);
  for (let i = 0; i <= total; i++) out.push(addDays(start, i));
  return out;
}

/** "YYYY-MM-DD" for the current local day. */
export function todayISO(now: Date = new Date()): ISODate {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const FR_MONTHS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];
const FR_DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

export function formatFR(d: ISODate, opts: { weekday?: boolean } = {}): string {
  const date = parseISO(d);
  const label = `${date.getUTCDate()} ${FR_MONTHS[date.getUTCMonth()]}`;
  if (opts.weekday) return `${FR_DAYS[date.getUTCDay()]} ${label}`;
  return label;
}
