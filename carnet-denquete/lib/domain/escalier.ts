// Phase 0 — l'escalier. Progression gated by weekly validation, never by the
// calendar. A palier that fails is REPLAYED, never lost: no regression, no
// acquired habit removed, no point taken back.

import type { ISODate } from "./dates";
import {
  VALIDATE_ACQUIRED_MIN,
  VALIDATE_NEW_MIN,
  acquiredHabitsBefore,
  newHabitsOf,
} from "./constants";
import type { DayRecord, PalierId, PalierValidation } from "./types";

/**
 * Validate one palier over its 7 active days.
 *
 * Rule (non-negotiable, brief §3): 5 days out of 7 on the palier's NEW habits,
 * and no acquired habit below 4/7. Never 7/7.
 */
export function validatePalier(
  palier: PalierId,
  weekRecords: DayRecord[],
): PalierValidation {
  const counts: Record<string, number> = {};
  const countChecked = (habitId: string) =>
    weekRecords.reduce((n, r) => n + (r.habits?.[habitId] ? 1 : 0), 0);

  const failingNew: string[] = [];
  for (const h of newHabitsOf(palier)) {
    const c = countChecked(h.id);
    counts[h.id] = c;
    if (c < VALIDATE_NEW_MIN) failingNew.push(h.id);
  }

  const failingAcquired: string[] = [];
  for (const h of acquiredHabitsBefore(palier)) {
    const c = countChecked(h.id);
    counts[h.id] = c;
    if (c < VALIDATE_ACQUIRED_MIN) failingAcquired.push(h.id);
  }

  return {
    pass: failingNew.length === 0 && failingAcquired.length === 0,
    counts,
    failingNew,
    failingAcquired,
  };
}
