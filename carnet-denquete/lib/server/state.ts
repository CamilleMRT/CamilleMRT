// Rebuild the domain ComputeInput from the database, for server-side push
// computation. Mirrors the client store shape.

import { prisma } from "./prisma";
import { DEFAULT_CYCLE_J1, DEFAULT_START_DATE } from "@/lib/domain/constants";
import { todayISO, toISO, type ISODate } from "@/lib/domain/dates";
import type { ComputeInput } from "@/lib/domain/protocol";
import type { DayRecord, PalierId } from "@/lib/domain/types";

export async function loadComputeInput(today: ISODate = todayISO()): Promise<ComputeInput> {
  const [config, days, starts, halved] = await Promise.all([
    prisma.config.findUnique({ where: { id: "singleton" } }),
    prisma.dayRecord.findMany(),
    prisma.cycleStart.findMany(),
    prisma.halvedPalier.findMany(),
  ]);

  const records: Record<ISODate, DayRecord> = {};
  for (const d of days) {
    const journal =
      d.bloating != null && d.energy != null && d.anxiety != null && d.stool != null
        ? { bloating: d.bloating, energy: d.energy, anxiety: d.anxiety, stool: d.stool }
        : undefined;
    records[d.date] = {
      date: d.date,
      paused: d.paused,
      habits: (d.habits as Record<string, boolean>) ?? {},
      journal,
    };
  }

  const halvedPaliers: Partial<Record<PalierId, boolean>> = {};
  for (const h of halved) halvedPaliers[h.palier as PalierId] = true;

  return {
    config: {
      startDate: config ? toISO(config.startDate) : DEFAULT_START_DATE,
      cycleReferenceJ1: config ? toISO(config.cycleReferenceJ1) : DEFAULT_CYCLE_J1,
    },
    records,
    settings: {
      halvedPaliers,
      stopAfterPhase1: config?.stopAfterPhase1 ?? undefined,
    },
    j1Dates: starts.map((s) => s.date).sort(),
    today,
  };
}
