// 🟢 Tactical recommendations ONLY — allowed in real time. They NEVER touch
// the variable under test (that would destroy the experiment, brief §8).
// 🔴 Protocol recommendations are locked until a phase ends and are computed
// nowhere in this app before then.

import type { ISODate } from "./dates";
import { cycleInfo } from "./cycle";
import type { DayRecord, ProtocolConfig } from "./types";

export interface Recommendation {
  id: string;
  text: string;
}

/**
 * `records` in chronological order (oldest → newest). `today` is the most
 * recent date to reason from. Recommendations are conservative and only fire
 * when the brief's exact conditions are met.
 */
export function tacticalRecommendations(
  today: ISODate,
  orderedRecords: DayRecord[],
  j1Dates: ISODate[],
  config: ProtocolConfig,
): Recommendation[] {
  const out: Recommendation[] = [];
  const ci = cycleInfo(today, j1Dates, config.cycleReferenceJ1);

  const last3 = orderedRecords.filter((r) => r.journal).slice(-3);
  const have3 = last3.length === 3;

  // Ballonnement ≥ 4 depuis 3 jours ET lutéale.
  if (have3 && ci.phase === "luteale" && last3.every((r) => (r.journal?.bloating ?? 0) >= 4)) {
    out.push({
      id: "bloating-luteal",
      text: "Baisse le curseur FODMAP, monte l'eau, réduis les crudités à une poignée.",
    });
  }

  // Pas de selle depuis 3 jours.
  if (have3 && last3.every((r) => r.journal && r.journal.stool === false)) {
    out.push({
      id: "no-stool",
      text: "Psyllium + 2 kiwis + marche quotidienne.",
    });
  }

  // Anxiété ≥ 4 ET SPM.
  const todayRec = orderedRecords.find((r) => r.date === today);
  if (ci.isSPM && (todayRec?.journal?.anxiety ?? 0) >= 4) {
    out.push({
      id: "anxiety-spm",
      text: "Ta collation de 16 h, maintenant. Chocolat noir, amandes. La faim est réelle.",
    });
  }

  return out;
}
