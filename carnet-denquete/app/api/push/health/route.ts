import { NextResponse } from "next/server";
import { prisma, hasDatabase } from "@/lib/server/prisma";

export const runtime = "nodejs";

// Push health, so the client can show the .ics fallback banner after 3
// consecutive push failures (the filet, brief §7).
export async function GET() {
  if (!hasDatabase()) return NextResponse.json({ consecutiveFailures: 0 });
  const health = await prisma.pushHealth.findUnique({ where: { id: "singleton" } });
  return NextResponse.json({
    consecutiveFailures: health?.consecutiveFailures ?? 0,
    lastSuccessDate: health?.lastSuccessDate ?? null,
  });
}
