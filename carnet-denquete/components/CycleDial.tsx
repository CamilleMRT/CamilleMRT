"use client";

import { phaseBoundaries } from "@/lib/domain/cycle";
import type { CyclePhase } from "@/lib/domain/types";

interface Segment {
  phase: CyclePhase;
  from: number; // 1-based first day
  to: number; // inclusive last day
}

function segments(length: number): Segment[] {
  const { menstruelleEnd, folliculaireEnd, ovulatoireEnd } = phaseBoundaries(length);
  return [
    { phase: "menstruelle", from: 1, to: menstruelleEnd },
    { phase: "folliculaire", from: menstruelleEnd + 1, to: folliculaireEnd },
    { phase: "ovulatoire", from: folliculaireEnd + 1, to: ovulatoireEnd },
    { phase: "luteale", from: ovulatoireEnd + 1, to: length },
  ];
}

const R = 52;
const CX = 60;
const CY = 60;
const STROKE = 12;

function polar(dayFraction: number): [number, number] {
  // 0 at top, clockwise.
  const angle = -Math.PI / 2 + dayFraction * 2 * Math.PI;
  return [CX + R * Math.cos(angle), CY + R * Math.sin(angle)];
}

function arcPath(from: number, to: number, length: number): string {
  const startFrac = (from - 1) / length;
  const endFrac = to / length;
  const [x1, y1] = polar(startFrac);
  const [x2, y2] = polar(endFrac);
  const large = endFrac - startFrac > 0.5 ? 1 : 0;
  return `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`;
}

export function CycleDial({
  cycleDay,
  length,
  phase,
}: {
  cycleDay: number;
  length: number;
  phase: CyclePhase;
}) {
  const segs = segments(length);
  const clampedDay = Math.min(Math.max(cycleDay, 1), length);
  const [mx, my] = polar((clampedDay - 0.5) / length);

  return (
    <svg viewBox="0 0 120 120" width="120" height="120" role="img" aria-label={`Jour ${cycleDay} du cycle, phase ${phase}`}>
      {segs.map((s) => {
        if (s.to < s.from) return null;
        const isCurrent = s.phase === phase;
        return (
          <path
            key={s.phase}
            d={arcPath(s.from, s.to, length)}
            fill="none"
            stroke={`var(--${s.phase}-fill)`}
            strokeWidth={STROKE}
            strokeLinecap="butt"
            opacity={isCurrent ? 1 : 0.3}
          />
        );
      })}
      {/* current-day marker */}
      <circle cx={mx} cy={my} r={5} fill={`var(--${phase}-ink)`} stroke="var(--surface)" strokeWidth={2} />
      <text
        x={CX}
        y={CY - 4}
        textAnchor="middle"
        className="num"
        fontSize="22"
        fontWeight={500}
        fill="var(--ink)"
      >
        {cycleDay}
      </text>
      <text x={CX} y={CY + 12} textAnchor="middle" fontSize="9" fill="var(--ink-soft)">
        / {length} j
      </text>
    </svg>
  );
}
