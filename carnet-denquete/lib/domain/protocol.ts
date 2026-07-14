// Horloge A — the protocol clock, plus the orchestrator that turns raw
// records into the current stage.
//
// THE decoupling that matters most (brief §2, §13): a paused day stops
// Horloge A but NOT Horloge B. Everything here counts only active
// (non-paused) days; the cycle module never sees the pause set.

import { diffDays, rangeInclusive, addDays, type ISODate } from "./dates";
import { PHASE_DURATIONS, WEEK_LENGTH } from "./constants";
import { validatePalier } from "./escalier";
import { cycleInfo } from "./cycle";
import type {
  DayRecord,
  PalierId,
  PhaseId,
  ProtocolConfig,
  ProtocolStage,
  Settings,
} from "./types";

export interface ComputeInput {
  config: ProtocolConfig;
  records: Record<ISODate, DayRecord>;
  today: ISODate;
  settings: Settings;
  /** every recorded J1 (Horloge B), independent of pauses. */
  j1Dates: ISODate[];
}

export interface ComputeResult {
  stage: ProtocolStage;
  /** all non-paused dates from start to today, in order. */
  activeDates: ISODate[];
  /** first active date of phase 1, once the escalier is complete. */
  escalierEndDate: ISODate | null;
}

/** Active (non-paused) dates from the protocol start up to and including `today`. */
export function activeDatesUpTo(
  startDate: ISODate,
  today: ISODate,
  records: Record<ISODate, DayRecord>,
): ISODate[] {
  if (diffDays(startDate, today) < 0) return [];
  return rangeInclusive(startDate, today).filter((d) => !records[d]?.paused);
}

/**
 * protocolDay(phaseStart, d): number of active (non-paused) days between the
 * phase start and `d`, inclusive and 1-based. Returns 0 if `d` precedes the
 * phase start. This is Horloge A: paused days are simply not counted.
 */
export function protocolDay(
  phaseStart: ISODate,
  d: ISODate,
  records: Record<ISODate, DayRecord>,
): number {
  if (diffDays(phaseStart, d) < 0) return 0;
  return rangeInclusive(phaseStart, d).filter((x) => !records[x]?.paused).length;
}

function recordsFor(dates: ISODate[], records: Record<ISODate, DayRecord>): DayRecord[] {
  return dates.map((d) => records[d] ?? { date: d, habits: {} });
}

export function computeState(input: ComputeInput): ComputeResult {
  const { config, records, today, settings, j1Dates } = input;
  const activeDates = activeDatesUpTo(config.startDate, today, records);

  if (activeDates.length === 0) {
    return {
      stage: {
        kind: "escalier",
        palier: 1,
        attempt: 1,
        halved: !!settings.halvedPaliers[1],
        week: [],
        dayInWeek: 0,
        weekComplete: false,
        validation: null,
        suggestHalving: false,
      },
      activeDates,
      escalierEndDate: null,
    };
  }

  // --- Walk the escalier -------------------------------------------------
  let i = 0;
  let palier: PalierId = 1;
  let attempt = 1;
  let escalierEndIndex: number | null = null;

  while (escalierEndIndex === null) {
    const remaining = activeDates.length - i;

    // Current (last) week: in progress, or exactly complete today.
    if (remaining <= WEEK_LENGTH) {
      const week = activeDates.slice(i, i + WEEK_LENGTH);
      const weekComplete = week.length === WEEK_LENGTH;
      const validation = weekComplete
        ? validatePalier(palier, recordsFor(week, records))
        : null;
      return {
        stage: {
          kind: "escalier",
          palier,
          attempt,
          halved: !!settings.halvedPaliers[palier],
          week,
          dayInWeek: week.length,
          weekComplete,
          validation,
          suggestHalving: attempt > 2, // >= 2 failed attempts already
        },
        activeDates,
        escalierEndDate: null,
      };
    }

    // A completed week with at least one active day after it → evaluate & advance.
    const week = activeDates.slice(i, i + WEEK_LENGTH);
    const result = validatePalier(palier, recordsFor(week, records));
    if (result.pass) {
      if (palier === 4) {
        escalierEndIndex = i + WEEK_LENGTH;
        break;
      }
      palier = (palier + 1) as PalierId;
      attempt = 1;
      i += WEEK_LENGTH;
    } else {
      attempt += 1; // replay the same palier
      i += WEEK_LENGTH;
    }
  }

  // --- Measurement phases ------------------------------------------------
  const phaseDates = activeDates.slice(escalierEndIndex);
  const escalierEndDate = phaseDates[0];
  const P1 = PHASE_DURATIONS[1];
  const P2 = PHASE_DURATIONS[2];
  const P3 = PHASE_DURATIONS[3];
  const n = phaseDates.length; // active days since the escalier ended (>= 1)

  const phaseStage = (phase: PhaseId, dayInPhase: number, startIdx: number): ProtocolStage => ({
    kind: "phase",
    phase,
    dayInPhase,
    totalDays: PHASE_DURATIONS[phase],
    startDate: phaseDates[startIdx],
  });

  // Phase 1 — Référence.
  if (n <= P1) {
    return { stage: phaseStage(1, n, 0), activeDates, escalierEndDate };
  }

  // Point de sortie after phase 1 (brief §9). Block until the user decides.
  if (settings.stopAfterPhase1 === true) {
    return { stage: { kind: "done", reason: "exit-phase1" }, activeDates, escalierEndDate };
  }
  if (settings.stopAfterPhase1 === undefined) {
    return { stage: { kind: "gate-phase1" }, activeDates, escalierEndDate };
  }

  // Phase 2 — Zéro lactose.
  const after1 = n - P1;
  if (after1 <= P2) {
    return { stage: phaseStage(2, after1, P1), activeDates, escalierEndDate };
  }

  // Phase 3 — Zéro gluten.
  const after2 = after1 - P2;
  if (after2 <= P3) {
    return { stage: phaseStage(3, after2, P1 + P2), activeDates, escalierEndDate };
  }

  // Phase 4 — Confirmation, triggered on a FOLLICULAR active day.
  const p3EndIdx = P1 + P2 + P3; // first index after phase 3 in phaseDates
  let p4StartIdx = -1;
  for (let k = p3EndIdx; k < phaseDates.length; k++) {
    if (cycleInfo(phaseDates[k], j1Dates, config.cycleReferenceJ1).phase === "folliculaire") {
      p4StartIdx = k;
      break;
    }
  }
  if (p4StartIdx === -1) {
    return { stage: { kind: "awaiting-confirmation" }, activeDates, escalierEndDate };
  }
  const dayInP4 = phaseDates.length - p4StartIdx;
  if (dayInP4 <= PHASE_DURATIONS[4]) {
    return { stage: phaseStage(4, dayInP4, p4StartIdx), activeDates, escalierEndDate };
  }

  return { stage: { kind: "done", reason: "complete" }, activeDates, escalierEndDate };
}

/**
 * Project the calendar dates of upcoming milestones for the .ics of the full
 * protocol. Because future validation is unknown, this ASSUMES remaining
 * paliers pass on their first attempt from `today` and no future pauses — a
 * projection that shifts as reality unfolds. Documented as such in the README.
 */
export interface Milestone {
  date: ISODate;
  title: string;
}
export function projectMilestones(input: ComputeInput): Milestone[] {
  const { stage, escalierEndDate } = computeState(input);
  const out: Milestone[] = [];
  let cursor = input.today;

  // Remaining escalier weeks (assume first-try passes).
  if (stage.kind === "escalier") {
    let p = stage.palier;
    // days left in the current week
    let daysLeftThisWeek = WEEK_LENGTH - stage.dayInWeek;
    if (daysLeftThisWeek < 0) daysLeftThisWeek = 0;
    cursor = addDays(cursor, daysLeftThisWeek);
    out.push({ date: cursor, title: `Fin du palier ${p} — ${palierName(p)}` });
    while (p < 4) {
      p = (p + 1) as PalierId;
      cursor = addDays(cursor, WEEK_LENGTH);
      out.push({ date: cursor, title: `Fin du palier ${p} — ${palierName(p)}` });
    }
    cursor = addDays(cursor, 1);
    out.push({ date: cursor, title: "Début Phase 1 — Référence" });
  } else if (escalierEndDate) {
    cursor = escalierEndDate;
  }

  // Phases (projected, active-day based ≈ calendar days if no pauses).
  const anchor =
    stage.kind === "phase" ? stage.startDate : escalierEndDate ?? cursor;
  let phaseCursor = anchor;
  const seq: Array<[PhaseId, string]> = [
    [1, "Phase 1 — Référence"],
    [2, "Phase 2 — Zéro lactose"],
    [3, "Phase 3 — Zéro gluten"],
  ];
  for (const [id, title] of seq) {
    out.push({ date: phaseCursor, title: `Début ${title}` });
    phaseCursor = addDays(phaseCursor, PHASE_DURATIONS[id]);
  }
  out.push({ date: phaseCursor, title: "Fenêtre de confirmation (phase folliculaire)" });

  // De-dup by date+title.
  const seen = new Set<string>();
  return out.filter((m) => {
    const k = `${m.date}|${m.title}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function palierName(p: PalierId): string {
  return { 1: "Écouter", 2: "Réservoir", 3: "Matin", 4: "Rythme" }[p];
}

export type DaySegment =
  | { type: "escalier"; palier: PalierId }
  | { type: "phase"; phase: PhaseId }
  | { type: "awaiting" };

/**
 * Label every active date with the protocol segment it belongs to. Used by the
 * analysis stratification (which cares about measurement phases 1–3) and by the
 * timeline UI. Same walk as computeState, but recorded for the full history.
 */
export function labelTimeline(input: ComputeInput): Map<ISODate, DaySegment> {
  const { config, records, today, settings, j1Dates } = input;
  const activeDates = activeDatesUpTo(config.startDate, today, records);
  const labels = new Map<ISODate, DaySegment>();

  // Escalier: fixed weeks, replaying failed paliers.
  let i = 0;
  let palier: PalierId = 1;
  let escalierEndIndex: number | null = null;
  while (i < activeDates.length) {
    const week = activeDates.slice(i, i + WEEK_LENGTH);
    for (const d of week) labels.set(d, { type: "escalier", palier });
    if (week.length < WEEK_LENGTH) {
      return labels; // still inside the escalier
    }
    const result = validatePalier(palier, recordsFor(week, records));
    if (result.pass) {
      if (palier === 4) {
        escalierEndIndex = i + WEEK_LENGTH;
        break;
      }
      palier = (palier + 1) as PalierId;
    }
    i += WEEK_LENGTH;
  }
  if (escalierEndIndex === null) return labels;

  // Phases.
  const phaseDates = activeDates.slice(escalierEndIndex);
  const P1 = PHASE_DURATIONS[1];
  const P2 = PHASE_DURATIONS[2];
  const P3 = PHASE_DURATIONS[3];
  let p4StartIdx = -1;
  const stopped = settings.stopAfterPhase1 === true;
  for (let k = 0; k < phaseDates.length; k++) {
    const d = phaseDates[k];
    if (k < P1) {
      labels.set(d, { type: "phase", phase: 1 });
    } else if (stopped || settings.stopAfterPhase1 === undefined) {
      labels.set(d, { type: "awaiting" }); // held at the exit gate
    } else if (k < P1 + P2) {
      labels.set(d, { type: "phase", phase: 2 });
    } else if (k < P1 + P2 + P3) {
      labels.set(d, { type: "phase", phase: 3 });
    } else {
      if (p4StartIdx === -1) {
        if (cycleInfo(d, j1Dates, config.cycleReferenceJ1).phase === "folliculaire") {
          p4StartIdx = k;
        }
      }
      if (p4StartIdx !== -1 && k - p4StartIdx < PHASE_DURATIONS[4]) {
        labels.set(d, { type: "phase", phase: 4 });
      } else {
        labels.set(d, { type: "awaiting" });
      }
    }
  }
  return labels;
}
