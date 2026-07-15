import { NextResponse } from "next/server";
import { prisma, hasDatabase } from "@/lib/server/prisma";
import { ensureVapid, webpush } from "@/lib/server/push";
import { loadComputeInput } from "@/lib/server/state";
import { computeNotification, type Slot } from "@/lib/domain/notify";

export const runtime = "nodejs";

// Called by an EXTERNAL cron (cron-job.org) at 07:30 / 16:00 / 21:00.
// Content is computed server-side from the palier/phase, cycle day and
// yesterday's journal. Only unlocked habits are ever mentioned.
//   GET /api/cron/notify?slot=morning|snack|evening&secret=...
export async function GET(req: Request) {
  const url = new URL(req.url);
  const slot = url.searchParams.get("slot") as Slot | null;
  const secret = url.searchParams.get("secret") ?? req.headers.get("x-cron-secret");

  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  if (slot !== "morning" && slot !== "snack" && slot !== "evening") {
    return NextResponse.json({ ok: false, reason: "bad-slot" }, { status: 400 });
  }
  if (!hasDatabase()) return NextResponse.json({ ok: false, reason: "no-db" });
  if (!ensureVapid()) return NextResponse.json({ ok: false, reason: "no-vapid" });

  const input = await loadComputeInput();
  const message = computeNotification(slot, input);
  if (!message) return NextResponse.json({ ok: true, sent: 0, reason: "nothing-to-say" });

  const subs = await prisma.pushSubscription.findMany();
  let sent = 0;
  let failed = 0;
  for (const s of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        JSON.stringify(message),
      );
      sent += 1;
    } catch (err: unknown) {
      failed += 1;
      // 404/410 → subscription gone, clean it up.
      const code = (err as { statusCode?: number })?.statusCode;
      if (code === 404 || code === 410) {
        await prisma.pushSubscription.deleteMany({ where: { endpoint: s.endpoint } });
      }
    }
  }

  // Track push health for the 3-consecutive-failures .ics fallback banner.
  const today = input.today;
  if (sent > 0) {
    await prisma.pushHealth.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", lastSuccessDate: today, consecutiveFailures: 0 },
      update: { lastSuccessDate: today, consecutiveFailures: 0 },
    });
  } else if (subs.length > 0) {
    await prisma.pushHealth.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", consecutiveFailures: 1 },
      update: { consecutiveFailures: { increment: 1 } },
    });
  }

  return NextResponse.json({ ok: true, sent, failed });
}
