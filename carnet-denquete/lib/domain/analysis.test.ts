import { describe, it, expect } from "vitest";
import { decide, isAnalysisLocked, type StratifiedTable, type Cell } from "./analysis";
import type { CyclePhase, PhaseId } from "./types";

const CYCLE: CyclePhase[] = ["menstruelle", "folliculaire", "ovulatoire", "luteale"];

function cell(n: number, bloating: number, stoolsPerWeek: number): Cell {
  const stoolRatio = stoolsPerWeek / 7;
  return {
    n,
    bloating,
    energy: 3,
    anxiety: 2,
    stools: Math.round(stoolRatio * n),
    stoolRatio,
    weak: n < 4,
  };
}

function tableFrom(
  phase1: Partial<Record<CyclePhase, Cell>>,
  phase2: Partial<Record<CyclePhase, Cell>>,
): StratifiedTable {
  const empty: Cell = { n: 0, bloating: null, energy: null, anxiety: null, stools: 0, stoolRatio: null, weak: true };
  const cells = {} as StratifiedTable["cells"];
  for (const p of [1, 2, 3, 4] as PhaseId[]) {
    cells[p] = {} as Record<CyclePhase, Cell>;
    for (const c of CYCLE) cells[p][c] = empty;
  }
  for (const c of CYCLE) {
    if (phase1[c]) cells[1][c] = phase1[c]!;
    if (phase2[c]) cells[2][c] = phase2[c]!;
  }
  return { cells };
}

describe("decision criterion (frozen)", () => {
  it("declares coupable when bloating drops >=1 AND stools rise >=2/week", () => {
    const table = tableFrom(
      { folliculaire: cell(10, 3, 3), luteale: cell(8, 4, 2) },
      { folliculaire: cell(10, 2, 5), luteale: cell(8, 3, 4) },
    );
    expect(decide(table, 2).verdict).toBe("coupable");
  });

  it("is non-concluant when only one condition is met", () => {
    const table = tableFrom(
      { folliculaire: cell(10, 3, 3) },
      { folliculaire: cell(10, 2, 3.5) }, // bloating -1 ok, stools +0.5/week only
    );
    expect(decide(table, 2).verdict).toBe("non-concluant");
  });

  it("is insuffisant when no cycle phase has enough data in both phases", () => {
    const table = tableFrom(
      { folliculaire: cell(2, 3, 3) }, // n<4
      { folliculaire: cell(10, 2, 5) },
    );
    expect(decide(table, 2).verdict).toBe("insuffisant");
  });

  it("labels the suspect by the compared phase", () => {
    const table = tableFrom({}, {});
    expect(decide(table, 2).suspect).toBe("lactose");
    expect(decide(table, 3).suspect).toBe("gluten");
  });
});

describe("analysis lock", () => {
  it("is locked during a running measurement phase", () => {
    expect(isAnalysisLocked("phase")).toBe(true);
  });
  it("is unlocked otherwise", () => {
    expect(isAnalysisLocked("escalier")).toBe(false);
    expect(isAnalysisLocked("gate-phase1")).toBe(false);
    expect(isAnalysisLocked("done")).toBe(false);
  });
});
