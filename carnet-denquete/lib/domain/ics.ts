// Couche 1 — le calendrier .ics : le socle, 100 % fiable. iOS owns the alarm;
// no service worker, no cron, no push. Zero network dependency.

import { ICS_REMINDERS, type IcsReminder } from "./constants";
import type { ISODate } from "./dates";
import type { Milestone } from "./protocol";

function fold(line: string): string {
  // RFC 5545 line folding at 75 octets (approximate on chars — safe for ASCII/FR).
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let rest = line;
  parts.push(rest.slice(0, 75));
  rest = rest.slice(75);
  while (rest.length > 74) {
    parts.push(" " + rest.slice(0, 74));
    rest = rest.slice(74);
  }
  if (rest.length) parts.push(" " + rest);
  return parts.join("\r\n");
}

function esc(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function stamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}T${p(d.getUTCHours())}${p(
    d.getUTCMinutes(),
  )}${p(d.getUTCSeconds())}Z`;
}

function isoToBasic(d: ISODate): string {
  return d.replace(/-/g, "");
}

let uidCounter = 0;
function uid(): string {
  uidCounter += 1;
  return `${stamp()}-${uidCounter}@carnet-denquete`;
}

function wrap(events: string[]): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Carnet d'enquête//v1//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events,
    "END:VCALENDAR",
  ]
    .map(fold)
    .join("\r\n");
}

/** The three daily reminders, as recurring all-year events with a display alarm. */
export function dailyRemindersICS(startDate: ISODate, reminders: IcsReminder[] = ICS_REMINDERS): string {
  const dt = isoToBasic(startDate);
  const events = reminders.map((r) =>
    [
      "BEGIN:VEVENT",
      `UID:${uid()}`,
      `DTSTAMP:${stamp()}`,
      `DTSTART:${dt}T${r.time}`,
      "RRULE:FREQ=DAILY",
      `SUMMARY:${esc(r.summary)}`,
      "BEGIN:VALARM",
      "TRIGGER:-PT0M",
      "ACTION:DISPLAY",
      `DESCRIPTION:${esc(r.summary)}`,
      "END:VALARM",
      "END:VEVENT",
    ].join("\r\n"),
  );
  return wrap(events);
}

/** The full protocol as all-day milestones (projected — shifts with reality). */
export function protocolICS(milestones: Milestone[]): string {
  const events = milestones.map((m) => {
    const d = isoToBasic(m.date);
    return [
      "BEGIN:VEVENT",
      `UID:${uid()}`,
      `DTSTAMP:${stamp()}`,
      `DTSTART;VALUE=DATE:${d}`,
      `SUMMARY:${esc(m.title)}`,
      "BEGIN:VALARM",
      "TRIGGER:-PT0M",
      "ACTION:DISPLAY",
      `DESCRIPTION:${esc(m.title)}`,
      "END:VALARM",
      "END:VEVENT",
    ].join("\r\n");
  });
  return wrap(events);
}
