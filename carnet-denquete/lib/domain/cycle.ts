// Horloge B — the menstrual cycle. Runs in parallel, INDEPENDENTLY.
// It never drives the protocol; it only stratifies the analysis and feeds
// tactical recommendations. Pauses on Horloge A do NOT affect it.

import { diffDays, type ISODate } from "./dates";
import { CYCLE_AVERAGE_WINDOW, DEFAULT_CYCLE_LENGTH } from "./constants";
import type { CycleInfo, CyclePhase } from "./types";

/**
 * Rolling mean of observed cycle lengths (differences between consecutive
 * recorded J1 dates). Falls back to 28 until a full cycle is observed.
 */
export function cycleLength(j1Dates: ISODate[]): number {
  const sorted = [...new Set(j1Dates)].sort();
  if (sorted.length < 2) return DEFAULT_CYCLE_LENGTH;
  const lengths: number[] = [];
  for (let i = 1; i < sorted.length; i++) lengths.push(diffDays(sorted[i - 1], sorted[i]));
  const window = lengths.slice(-CYCLE_AVERAGE_WINDOW);
  const mean = window.reduce((a, b) => a + b, 0) / window.length;
  return Math.round(mean);
}

/** The most recent recorded J1 that is on or before `date`. */
function lastJ1OnOrBefore(date: ISODate, j1Dates: ISODate[]): ISODate | null {
  const sorted = [...new Set(j1Dates)].sort();
  let found: ISODate | null = null;
  for (const j1 of sorted) {
    if (diffDays(j1, date) >= 0) found = j1;
    else break;
  }
  return found;
}

/**
 * Phase boundaries recomputed au prorata of the observed length.
 * Reference (length 28): menstruelle 1–5, folliculaire 6–13,
 * ovulatoire 14–16, lutéale 17–fin.
 */
export function phaseBoundaries(length: number): {
  menstruelleEnd: number;
  folliculaireEnd: number;
  ovulatoireEnd: number;
} {
  const scale = length / DEFAULT_CYCLE_LENGTH;
  return {
    menstruelleEnd: Math.round(5 * scale),
    folliculaireEnd: Math.round(13 * scale),
    ovulatoireEnd: Math.round(16 * scale),
  };
}

export function phaseForDay(cycleDay: number, length: number): CyclePhase {
  const { menstruelleEnd, folliculaireEnd, ovulatoireEnd } = phaseBoundaries(length);
  if (cycleDay <= menstruelleEnd) return "menstruelle";
  if (cycleDay <= folliculaireEnd) return "folliculaire";
  if (cycleDay <= ovulatoireEnd) return "ovulatoire";
  return "luteale"; // everything after ovulation, including an overrunning cycle
}

/** SPM = the last 7 days of the cycle, a sub-phase of the luteal phase. */
export function isSPM(cycleDay: number, length: number): boolean {
  return phaseForDay(cycleDay, length) === "luteale" && cycleDay > length - 7;
}

/**
 * Full cycle info for a date. `j1Dates` is every recorded J1; `referenceJ1`
 * is the initial reference used before any J1 has been recorded (or for dates
 * preceding the first recorded J1).
 */
export function cycleInfo(
  date: ISODate,
  j1Dates: ISODate[],
  referenceJ1: ISODate,
): CycleInfo {
  const length = cycleLength(j1Dates.length >= 2 ? j1Dates : [referenceJ1, ...j1Dates]);
  const anchor = lastJ1OnOrBefore(date, [referenceJ1, ...j1Dates]) ?? referenceJ1;

  // cycleDay = days since the anchor J1, + 1. If the observed cycle overruns
  // the expected length (no new J1 yet), the day simply keeps counting and the
  // phase stays luteal/SPM — the cycle is not forced to wrap.
  const cycleDay = diffDays(anchor, date) + 1;

  return {
    cycleDay,
    length,
    phase: phaseForDay(cycleDay, length),
    isSPM: isSPM(cycleDay, length),
  };
}
