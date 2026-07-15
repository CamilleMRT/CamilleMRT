import { describe, it, expect } from "vitest";
import { addDays, type ISODate } from "./dates";
import { HABITS } from "./constants";
import {
  activeDatesUpTo,
  protocolDay,
  computeState,
  type ComputeInput,
} from "./protocol";
import { cycleInfo } from "./cycle";
import type { DayRecord } from "./types";

const START: ISODate = "2026-07-14";
const REF_J1: ISODate = "2026-07-07";

const allHabitIds = HABITS.map((h) => h.id);

/** A record with every habit checked and a journal entry. */
function fullDay(date: ISODate, checked: string[] = allHabitIds): DayRecord {
  const habits: Record<string, boolean> = {};
  for (const id of checked) habits[id] = true;
  return { date, habits, journal: { bloating: 2, energy: 3, anxiety: 1, stool: true } };
}

function buildRecords(days: DayRecord[]): Record<ISODate, DayRecord> {
  const map: Record<ISODate, DayRecord> = {};
  for (const d of days) map[d.date] = d;
  return map;
}

function input(partial: Partial<ComputeInput> & { today: ISODate }): ComputeInput {
  return {
    config: { startDate: START, cycleReferenceJ1: REF_J1 },
    records: {},
    settings: { halvedPaliers: {} },
    j1Dates: [],
    ...partial,
  };
}

// ---------------------------------------------------------------------------
// THE decoupling test (brief §2, §13): a paused day stops Horloge A but NOT
// Horloge B. This is the single most important guarantee in the app.
// ---------------------------------------------------------------------------
describe("Horloge A / Horloge B decoupling under pause", () => {
  const records = buildRecords([
    { date: "2026-07-16", habits: {}, paused: true },
    { date: "2026-07-17", habits: {}, paused: true },
  ]);
  const today: ISODate = "2026-07-20";

  it("Horloge A skips paused days", () => {
    const active = activeDatesUpTo(START, today, records);
    // 14,15,(16 paused),(17 paused),18,19,20
    expect(active).toEqual(["2026-07-14", "2026-07-15", "2026-07-18", "2026-07-19", "2026-07-20"]);
    expect(protocolDay(START, today, records)).toBe(5);
  });

  it("Horloge B ignores pauses entirely — cycleDay stays on the calendar", () => {
    // 2026-07-20 is 13 calendar days after the J1 of 2026-07-07 → cycleDay 14,
    // regardless of the two paused days. A coupled clock would wrongly give 12.
    const info = cycleInfo(today, [], REF_J1);
    expect(info.cycleDay).toBe(14);
    expect(info.phase).toBe("ovulatoire");
  });

  it("the cycle module never receives the pause set", () => {
    // cycleInfo's signature has no records/pause parameter — structural proof.
    expect(cycleInfo.length).toBe(3); // (date, j1Dates, referenceJ1)
  });
});

describe("protocolDay", () => {
  it("counts inclusive active days and returns 0 before the start", () => {
    expect(protocolDay(START, "2026-07-13", {})).toBe(0);
    expect(protocolDay(START, START, {})).toBe(1);
    expect(protocolDay(START, "2026-07-20", {})).toBe(7);
  });
});

// ---------------------------------------------------------------------------
// Escalier: validation 5/7, replay, halving suggestion.
// ---------------------------------------------------------------------------
describe("escalier progression", () => {
  it("stays on palier 1 while the first week is in progress", () => {
    const days = [0, 1, 2].map((n) => fullDay(addDays(START, n)));
    const { stage } = computeState(input({ today: addDays(START, 2), records: buildRecords(days) }));
    expect(stage.kind).toBe("escalier");
    if (stage.kind === "escalier") {
      expect(stage.palier).toBe(1);
      expect(stage.dayInWeek).toBe(3);
      expect(stage.weekComplete).toBe(false);
    }
  });

  it("advances to palier 2 after a validated first week (+ a successor day)", () => {
    const days = Array.from({ length: 8 }, (_, n) => fullDay(addDays(START, n)));
    const { stage } = computeState(input({ today: addDays(START, 7), records: buildRecords(days) }));
    expect(stage.kind).toBe("escalier");
    if (stage.kind === "escalier") {
      expect(stage.palier).toBe(2);
      expect(stage.attempt).toBe(1);
    }
  });

  it("replays a palier that only hit 4/7 on a new habit", () => {
    // Check p1 new habits on only 4 of the first 7 days.
    const p1 = HABITS.filter((h) => h.palier === 1).map((h) => h.id);
    const days: DayRecord[] = [];
    for (let n = 0; n < 8; n++) {
      days.push(n < 4 ? fullDay(addDays(START, n), p1) : { date: addDays(START, n), habits: {} });
    }
    const { stage } = computeState(input({ today: addDays(START, 7), records: buildRecords(days) }));
    expect(stage.kind).toBe("escalier");
    if (stage.kind === "escalier") {
      expect(stage.palier).toBe(1); // no regression, no advance
      expect(stage.attempt).toBe(2); // replayed
    }
  });

  it("suggests halving after two failed attempts", () => {
    // 15 active days, all empty → two full weeks fail, third in progress.
    const days = Array.from({ length: 15 }, (_, n) => ({
      date: addDays(START, n),
      habits: {},
    }));
    const { stage } = computeState(input({ today: addDays(START, 14), records: buildRecords(days) }));
    expect(stage.kind).toBe("escalier");
    if (stage.kind === "escalier") {
      expect(stage.palier).toBe(1);
      expect(stage.attempt).toBe(3);
      expect(stage.suggestHalving).toBe(true);
    }
  });

  it("never requires 7/7: exactly 5/7 on new habits validates", () => {
    const p1 = HABITS.filter((h) => h.palier === 1).map((h) => h.id);
    const days: DayRecord[] = [];
    for (let n = 0; n < 8; n++) {
      days.push(n < 5 ? fullDay(addDays(START, n), p1) : { date: addDays(START, n), habits: {} });
    }
    const { stage } = computeState(input({ today: addDays(START, 7), records: buildRecords(days) }));
    if (stage.kind === "escalier") expect(stage.palier).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// Phases: dynamic dates, phase-1 exit gate, transition to phase 2.
// ---------------------------------------------------------------------------
describe("measurement phases", () => {
  // Fill all habits every day → escalier completes in 28 active days, first try.
  function fullRun(nDays: number): Record<ISODate, DayRecord> {
    return buildRecords(Array.from({ length: nDays }, (_, n) => fullDay(addDays(START, n))));
  }

  it("enters phase 1 on the first active day after the escalier (29 days)", () => {
    const { stage, escalierEndDate } = computeState(
      input({ today: addDays(START, 28), records: fullRun(29) }),
    );
    expect(escalierEndDate).toBe(addDays(START, 28));
    expect(stage.kind).toBe("phase");
    if (stage.kind === "phase") {
      expect(stage.phase).toBe(1);
      expect(stage.dayInPhase).toBe(1);
    }
  });

  it("computes phase dates dynamically, never hard-coded", () => {
    const { stage } = computeState(input({ today: addDays(START, 40), records: fullRun(41) }));
    // day 41 = escalier(28) + 13 → phase 1 day 13
    if (stage.kind === "phase") {
      expect(stage.phase).toBe(1);
      expect(stage.dayInPhase).toBe(13);
      expect(stage.startDate).toBe(addDays(START, 28));
    }
  });

  it("holds at the exit gate after phase 1 until the user decides", () => {
    // 57 active days = escalier(28) + phase1(28) + 1
    const { stage } = computeState(input({ today: addDays(START, 56), records: fullRun(57) }));
    expect(stage.kind).toBe("gate-phase1");
  });

  it("stops entirely when the user takes the point de sortie", () => {
    const { stage } = computeState(
      input({
        today: addDays(START, 56),
        records: fullRun(57),
        settings: { halvedPaliers: {}, stopAfterPhase1: true },
      }),
    );
    expect(stage).toEqual({ kind: "done", reason: "exit-phase1" });
  });

  it("continues to phase 2 when the user chooses to go on", () => {
    const { stage } = computeState(
      input({
        today: addDays(START, 56),
        records: fullRun(57),
        settings: { halvedPaliers: {}, stopAfterPhase1: false },
      }),
    );
    expect(stage.kind).toBe("phase");
    if (stage.kind === "phase") {
      expect(stage.phase).toBe(2);
      expect(stage.dayInPhase).toBe(1);
    }
  });
});

// ---------------------------------------------------------------------------
// Phase 4: triggered only on a follicular active day.
// ---------------------------------------------------------------------------
describe("phase 4 — confirmation window", () => {
  function fullRun(nDays: number): Record<ISODate, DayRecord> {
    return buildRecords(Array.from({ length: nDays }, (_, n) => fullDay(addDays(START, n))));
  }

  it("waits for a follicular day, then runs 5 days", () => {
    const settings = { halvedPaliers: {}, stopAfterPhase1: false as const };
    // Regular 28-day J1s so the cycle actually recurs (without them the cycle
    // overruns and stays luteal forever — see the cycle module).
    const j1Dates = Array.from({ length: 7 }, (_, k) => addDays(REF_J1, k * 28));
    // Scan across the phase-4 region and confirm the stage is only ever
    // phase 4 on follicular days (or awaiting) — never phase 4 outside it.
    let sawPhase4 = false;
    for (let n = 112; n < 150; n++) {
      const today = addDays(START, n);
      const { stage } = computeState(input({ today, records: fullRun(n + 1), settings, j1Dates }));
      if (stage.kind === "phase" && stage.phase === 4) {
        sawPhase4 = true;
        expect(stage.dayInPhase).toBeGreaterThanOrEqual(1);
        expect(stage.dayInPhase).toBeLessThanOrEqual(5);
        // the phase-4 start day must itself be follicular
        expect(cycleInfo(stage.startDate, j1Dates, REF_J1).phase).toBe("folliculaire");
      }
    }
    expect(sawPhase4).toBe(true);
  });

  it("holds at awaiting-confirmation when phase 3 ends outside a follicular day", () => {
    const settings = { halvedPaliers: {}, stopAfterPhase1: false as const };
    // Place J1s so that the first post-phase-3 active day is luteal.
    // Phase-4 region begins at activeDates[112] = START+112. Anchor a J1 20 days
    // before it → cycleDay 21 (luteal) on that day.
    const firstP4 = addDays(START, 112);
    const j1Dates = Array.from({ length: 9 }, (_, k) => addDays(firstP4, -20 + (k - 4) * 28));
    const { stage } = computeState(
      input({ today: firstP4, records: fullRun(113), settings, j1Dates }),
    );
    expect(cycleInfo(firstP4, j1Dates, REF_J1).phase).toBe("luteale");
    expect(stage.kind).toBe("awaiting-confirmation");
  });
});
