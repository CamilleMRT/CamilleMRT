import type { ISODate } from "./dates";

// --- Cycle (Horloge B) --------------------------------------------------

export type CyclePhase = "menstruelle" | "folliculaire" | "ovulatoire" | "luteale";

export interface CycleInfo {
  /** 1-based day within the current cycle. */
  cycleDay: number;
  phase: CyclePhase;
  /** SPM = last 7 days of the cycle, a sub-phase of the luteal phase. */
  isSPM: boolean;
  /** Cycle length used for this computation (rolling mean, default 28). */
  length: number;
}

// --- Journal (VERROUILLÉ — never change this set) -----------------------

export interface JournalEntry {
  bloating: number; // 0-5, 0 = aucun
  energy: number; // 0-5, 5 = au top
  anxiety: number; // 0-5, 0 = calme
  stool: boolean; // selle oui/non
}

// --- Daily record -------------------------------------------------------

export interface DayRecord {
  date: ISODate;
  /** A paused day stops Horloge A. Horloge B keeps running. */
  paused?: boolean;
  /** habitId -> checked. Only unlocked habits are meaningful. */
  habits: Record<string, boolean>;
  journal?: JournalEntry;
}

// --- Protocol configuration & settings ----------------------------------

export interface ProtocolConfig {
  /** Horloge A start. Default 2026-07-14. */
  startDate: ISODate;
  /** Initial reference J1 for Horloge B. Default 2026-07-07. */
  cycleReferenceJ1: ISODate;
}

export interface Settings {
  /** Whether the user accepted halving a given palier (offered after 2 fails). */
  halvedPaliers: Partial<Record<PalierId, boolean>>;
  /** Point de sortie: user chose to stop after phase 1. */
  stopAfterPhase1?: boolean;
  darkMode?: "system" | "light" | "dark";
}

// --- Escalier -----------------------------------------------------------

export type PalierId = 1 | 2 | 3 | 4;

export interface PalierValidation {
  pass: boolean;
  /** per-habit checked-day counts within the evaluated 7-day week. */
  counts: Record<string, number>;
  /** new habits that did not reach 5/7. */
  failingNew: string[];
  /** acquired habits that dropped below 4/7. */
  failingAcquired: string[];
}

// --- Phases -------------------------------------------------------------

export type PhaseId = 1 | 2 | 3 | 4;

// --- Computed protocol state -------------------------------------------

export type ProtocolStage =
  | {
      kind: "escalier";
      palier: PalierId;
      attempt: number; // 1-based
      halved: boolean;
      /** active dates of the current week (up to 7). */
      week: ISODate[];
      /** 1-based day within the current week (= week.length). */
      dayInWeek: number;
      /** the week has its full 7 active days. */
      weekComplete: boolean;
      /** validation result, present only when the week is complete. */
      validation: PalierValidation | null;
      /** app should propose halving (>= 2 failed attempts). */
      suggestHalving: boolean;
    }
  | {
      kind: "phase";
      phase: PhaseId;
      /** 1-based active day within the phase. */
      dayInPhase: number;
      totalDays: number;
      startDate: ISODate;
    }
  | { kind: "gate-phase1" } // point de sortie: awaiting the user's decision
  | { kind: "awaiting-confirmation" } // phase 3 done, waiting for a follicular day
  | { kind: "done"; reason: "exit-phase1" | "complete" };
