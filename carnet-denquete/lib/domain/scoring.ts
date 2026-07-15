import { habitsUpTo, maxScoreAt } from "./constants";
import type { DayRecord, PalierId } from "./types";

/** Daily score = sum of points of checked, unlocked habits, capped at the max. */
export function dailyScore(record: DayRecord | undefined, palier: PalierId): number {
  if (!record) return 0;
  return habitsUpTo(palier).reduce(
    (s, h) => s + (record.habits?.[h.id] ? h.points : 0),
    0,
  );
}

export function dailyMax(palier: PalierId): number {
  return maxScoreAt(palier);
}
