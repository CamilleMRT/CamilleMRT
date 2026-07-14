import { NextResponse } from "next/server";
import { prisma, hasDatabase } from "@/lib/server/prisma";
import { parseISO } from "@/lib/domain/dates";

export const runtime = "nodejs";

// Best-effort sync of the client's local-first state (offline-first). The
// client posts its whole state on change when online; failures are ignored by
// the client, so this route staying a no-op without a DB is fine.
export async function POST(req: Request) {
  if (!hasDatabase()) return NextResponse.json({ ok: false, reason: "no-db" });

  const secret = req.headers.get("x-app-secret");
  if (process.env.APP_SECRET && secret !== process.env.APP_SECRET) {
    // The client does not currently attach the secret; when APP_SECRET is set,
    // wire it through the store's fetch header. Until then, reject cleanly.
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }

  const state = await req.json().catch(() => null);
  if (!state) return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });

  await prisma.config.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      startDate: parseISO(state.config.startDate),
      cycleReferenceJ1: parseISO(state.config.cycleReferenceJ1),
      stopAfterPhase1: state.settings?.stopAfterPhase1 ?? null,
      darkMode: state.settings?.darkMode ?? "system",
    },
    update: {
      startDate: parseISO(state.config.startDate),
      cycleReferenceJ1: parseISO(state.config.cycleReferenceJ1),
      stopAfterPhase1: state.settings?.stopAfterPhase1 ?? null,
      darkMode: state.settings?.darkMode ?? "system",
    },
  });

  const records = Object.values(state.records ?? {}) as Array<{
    date: string;
    paused?: boolean;
    habits?: Record<string, boolean>;
    journal?: { bloating: number; energy: number; anxiety: number; stool: boolean };
  }>;
  for (const r of records) {
    const j = r.journal;
    const data = {
      paused: !!r.paused,
      habits: r.habits ?? {},
      bloating: j?.bloating ?? null,
      energy: j?.energy ?? null,
      anxiety: j?.anxiety ?? null,
      stool: j?.stool ?? null,
    };
    await prisma.dayRecord.upsert({
      where: { date: r.date },
      create: { date: r.date, ...data },
      update: data,
    });
  }

  const j1: string[] = state.j1Dates ?? [];
  await prisma.cycleStart.deleteMany({ where: { date: { notIn: j1.length ? j1 : ["__none__"] } } });
  for (const d of j1) {
    await prisma.cycleStart.upsert({ where: { date: d }, create: { date: d }, update: {} });
  }

  const halved = Object.entries(state.settings?.halvedPaliers ?? {})
    .filter(([, v]) => v)
    .map(([k]) => Number(k));
  await prisma.halvedPalier.deleteMany({ where: { palier: { notIn: halved.length ? halved : [-1] } } });
  for (const p of halved) {
    await prisma.halvedPalier.upsert({ where: { palier: p }, create: { palier: p }, update: {} });
  }

  return NextResponse.json({ ok: true });
}
