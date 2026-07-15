// Analyse — double stratification: symptoms × cycle phase × protocol phase.
// The screen is LOCKED during a running phase (see isAnalysisLocked); this
// module only computes the table, it does not decide access.

import type { ISODate } from "./dates";
import { cycleInfo } from "./cycle";
import { labelTimeline, type ComputeInput } from "./protocol";
import {
  DECISION_BLOATING_DROP,
  DECISION_STOOLS_PER_WEEK_RISE,
  MIN_N_FOR_SIGNAL,
} from "./constants";
import type { CyclePhase, PhaseId } from "./types";

export interface Cell {
  n: number; // days with a journal entry
  bloating: number | null; // mean
  energy: number | null;
  anxiety: number | null;
  stools: number; // count of stool=true
  stoolRatio: number | null; // stools / n
  /** true when n < MIN_N_FOR_SIGNAL → to be greyed out (noise, not data). */
  weak: boolean;
}

export type CyclePhaseKey = CyclePhase; // luteal row is highlighted in the UI

export interface StratifiedTable {
  /** table[protocolPhase][cyclePhase] */
  cells: Record<PhaseId, Record<CyclePhase, Cell>>;
}

const CYCLE_PHASES: CyclePhase[] = ["menstruelle", "folliculaire", "ovulatoire", "luteale"];
const PROTOCOL_PHASES: PhaseId[] = [1, 2, 3, 4];

function emptyCell(): Cell {
  return { n: 0, bloating: null, energy: null, anxiety: null, stools: 0, stoolRatio: null, weak: true };
}

export function stratify(input: ComputeInput): StratifiedTable {
  const labels = labelTimeline(input);
  // accumulators
  const acc: Record<PhaseId, Record<CyclePhase, { b: number; e: number; a: number; stools: number; n: number }>> =
    {} as never;
  for (const p of PROTOCOL_PHASES) {
    acc[p] = {} as never;
    for (const c of CYCLE_PHASES) acc[p][c] = { b: 0, e: 0, a: 0, stools: 0, n: 0 };
  }

  for (const [date, seg] of labels) {
    if (seg.type !== "phase") continue;
    const rec = input.records[date];
    if (!rec?.journal) continue;
    const ci = cycleInfo(date, input.j1Dates, input.config.cycleReferenceJ1);
    const bucket = acc[seg.phase][ci.phase];
    bucket.b += rec.journal.bloating;
    bucket.e += rec.journal.energy;
    bucket.a += rec.journal.anxiety;
    bucket.stools += rec.journal.stool ? 1 : 0;
    bucket.n += 1;
  }

  const cells = {} as StratifiedTable["cells"];
  for (const p of PROTOCOL_PHASES) {
    cells[p] = {} as Record<CyclePhase, Cell>;
    for (const c of CYCLE_PHASES) {
      const a = acc[p][c];
      cells[p][c] = a.n === 0
        ? emptyCell()
        : {
            n: a.n,
            bloating: a.b / a.n,
            energy: a.e / a.n,
            anxiety: a.a / a.n,
            stools: a.stools,
            stoolRatio: a.stools / a.n,
            weak: a.n < MIN_N_FOR_SIGNAL,
          };
    }
  }
  return { cells };
}

/** The analysis screen is inaccessible while a measurement phase is running. */
export function isAnalysisLocked(stageKind: string): boolean {
  return stageKind === "phase";
}

// --- Decision criterion (frozen) ---------------------------------------

export type Verdict = "coupable" | "non-concluant" | "insuffisant";

export interface DecisionResult {
  suspect: "lactose" | "gluten";
  comparePhase: PhaseId; // 2 vs 1 → lactose ; 3 vs 1 → gluten
  verdict: Verdict;
  /** per matched cycle-phase deltas, for transparency. */
  detail: Array<{
    cyclePhase: CyclePhase;
    bloatingDrop: number | null; // phase1 - phaseX (positive = improvement)
    stoolRise: number | null; // (phaseX stools/week) - (phase1 stools/week)
    n1: number;
    nX: number;
  }>;
}

/**
 * Apply the frozen criterion, comparing a test phase against phase 1 AT
 * IDENTICAL CYCLE PHASE. Coupable requires, on the cycle phases with enough
 * data (n >= MIN in both), bloating down >= 1 AND stools up >= 2/week.
 * Only Phase 2 vs 1 and Phase 3 vs 1 are valid comparisons.
 */
export function decide(table: StratifiedTable, testPhase: 2 | 3): DecisionResult {
  const suspect = testPhase === 2 ? "lactose" : "gluten";
  const detail: DecisionResult["detail"] = [];
  let anyComparable = false;
  let allImproved = true;

  for (const c of CYCLE_PHASES) {
    const ref = table.cells[1][c];
    const test = table.cells[testPhase][c];
    const n1 = ref.n;
    const nX = test.n;
    let bloatingDrop: number | null = null;
    let stoolRise: number | null = null;
    if (n1 >= MIN_N_FOR_SIGNAL && nX >= MIN_N_FOR_SIGNAL) {
      anyComparable = true;
      bloatingDrop = (ref.bloating ?? 0) - (test.bloating ?? 0);
      // stools per week = ratio * 7
      const refPerWeek = (ref.stoolRatio ?? 0) * 7;
      const testPerWeek = (test.stoolRatio ?? 0) * 7;
      stoolRise = testPerWeek - refPerWeek;
      const meets = bloatingDrop >= DECISION_BLOATING_DROP && stoolRise >= DECISION_STOOLS_PER_WEEK_RISE;
      if (!meets) allImproved = false;
    }
    detail.push({ cyclePhase: c, bloatingDrop, stoolRise, n1, nX });
  }

  let verdict: Verdict;
  if (!anyComparable) verdict = "insuffisant";
  else if (allImproved) verdict = "coupable";
  else verdict = "non-concluant";

  return { suspect, comparePhase: testPhase, verdict, detail };
}
