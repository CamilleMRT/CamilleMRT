"use client";

import { cycleInfo } from "@/lib/domain/cycle";
import type { ISODate } from "@/lib/domain/dates";
import type { ProtocolConfig } from "@/lib/domain/types";
import { useStore } from "@/lib/store";

const METRICS: Array<{ key: "bloating" | "energy" | "anxiety"; label: string }> = [
  { key: "bloating", label: "Ballonnement" },
  { key: "energy", label: "Énergie" },
  { key: "anxiety", label: "Anxiété" },
];

export function WeekSymptoms({ dates, config }: { dates: ISODate[]; config: ProtocolConfig }) {
  const { state } = useStore();
  const rows = dates.map((d) => ({
    date: d,
    journal: state.records[d]?.journal,
    ci: cycleInfo(d, state.j1Dates, config.cycleReferenceJ1),
  }));

  return (
    <div className="flex flex-col gap-3">
      {METRICS.map((m) => (
        <div key={m.key}>
          <div className="mb-1 flex items-baseline justify-between">
            <span className="caption">{m.label}</span>
          </div>
          <div className="flex items-end gap-1.5" style={{ height: 44 }}>
            {rows.map((r) => {
              const v = r.journal?.[m.key];
              const h = v == null ? 0 : (v / 5) * 40;
              return (
                <div key={r.date} className="flex flex-1 flex-col items-center justify-end">
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: Math.max(h, v != null ? 3 : 0),
                      background: v == null ? "var(--rule)" : `var(--${r.ci.phase}-fill)`,
                    }}
                    title={v == null ? "—" : String(v)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Selle row */}
      <div>
        <span className="caption">Selle</span>
        <div className="mt-1 flex gap-1.5">
          {rows.map((r) => (
            <div key={r.date} className="flex flex-1 justify-center">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{
                  background:
                    r.journal?.stool === true
                      ? "var(--accent)"
                      : r.journal?.stool === false
                        ? "var(--rule)"
                        : "transparent",
                  border: r.journal ? "none" : "1px solid var(--rule)",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Cycle day in regard */}
      <div className="flex gap-1.5 border-t border-[var(--rule)] pt-2">
        {rows.map((r) => (
          <div key={r.date} className="flex flex-1 flex-col items-center">
            <span className="num text-[12px]" style={{ color: `var(--${r.ci.phase}-ink)`, fontWeight: 500 }}>
              J{r.ci.cycleDay}
            </span>
            <span className="text-[11px]" style={{ color: "var(--ink-faint)" }}>
              {r.date.slice(8)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
