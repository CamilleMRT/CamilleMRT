import { describe, it, expect } from "vitest";
import {
  cycleInfo,
  cycleLength,
  phaseBoundaries,
  phaseForDay,
  isSPM,
} from "./cycle";

const REF = "2026-07-07"; // initial reference J1

describe("cycleLength — rolling mean, default 28", () => {
  it("defaults to 28 with fewer than two J1s", () => {
    expect(cycleLength([])).toBe(28);
    expect(cycleLength(["2026-07-07"])).toBe(28);
  });

  it("averages observed cycle lengths", () => {
    // 30-day then 26-day cycle → mean 28
    expect(cycleLength(["2026-07-07", "2026-08-06", "2026-09-01"])).toBe(28);
  });

  it("rounds the mean", () => {
    // one 29-day cycle
    expect(cycleLength(["2026-07-07", "2026-08-05"])).toBe(29);
  });
});

describe("phaseBoundaries — recomputed au prorata", () => {
  it("matches the reference at length 28", () => {
    expect(phaseBoundaries(28)).toEqual({
      menstruelleEnd: 5,
      folliculaireEnd: 13,
      ovulatoireEnd: 16,
    });
  });

  it("scales for a longer cycle", () => {
    const b = phaseBoundaries(35);
    expect(b.menstruelleEnd).toBe(6); // round(5*35/28)=round(6.25)
    expect(b.folliculaireEnd).toBe(16); // round(16.25)
    expect(b.ovulatoireEnd).toBe(20); // round(20)
  });
});

describe("phaseForDay", () => {
  it("classifies the reference cycle", () => {
    expect(phaseForDay(1, 28)).toBe("menstruelle");
    expect(phaseForDay(5, 28)).toBe("menstruelle");
    expect(phaseForDay(6, 28)).toBe("folliculaire");
    expect(phaseForDay(13, 28)).toBe("folliculaire");
    expect(phaseForDay(14, 28)).toBe("ovulatoire");
    expect(phaseForDay(16, 28)).toBe("ovulatoire");
    expect(phaseForDay(17, 28)).toBe("luteale");
    expect(phaseForDay(28, 28)).toBe("luteale");
  });

  it("keeps counting as luteal when the cycle overruns", () => {
    expect(phaseForDay(33, 28)).toBe("luteale");
  });
});

describe("isSPM — last 7 days of the cycle", () => {
  it("is the last 7 luteal days", () => {
    expect(isSPM(21, 28)).toBe(false);
    expect(isSPM(22, 28)).toBe(true);
    expect(isSPM(28, 28)).toBe(true);
  });
  it("is never true outside the luteal phase", () => {
    expect(isSPM(3, 28)).toBe(false);
  });
});

describe("cycleInfo", () => {
  it("computes cycleDay = calendar days since J1 + 1", () => {
    expect(cycleInfo("2026-07-07", [], REF).cycleDay).toBe(1);
    expect(cycleInfo("2026-07-14", [], REF).cycleDay).toBe(8);
  });

  it("anchors to the most recent recorded J1", () => {
    const info = cycleInfo("2026-08-10", ["2026-08-06"], REF);
    expect(info.cycleDay).toBe(5); // 2026-08-06 is J1 → 2026-08-10 is day 5
    expect(info.phase).toBe("menstruelle");
  });
});
