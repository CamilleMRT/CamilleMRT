"use client";

import { habitsUpTo } from "@/lib/domain/constants";
import type { PalierId } from "@/lib/domain/types";
import { useStore } from "@/lib/store";

export function HabitList({ palier }: { palier: PalierId }) {
  const { today, recordFor, toggleHabit } = useStore();
  const rec = recordFor(today);
  const habits = habitsUpTo(palier);

  return (
    <ul className="flex flex-col gap-2">
      {habits.map((h) => {
        const checked = !!rec.habits[h.id];
        return (
          <li key={h.id}>
            <button
              type="button"
              onClick={() => toggleHabit(today, h.id)}
              aria-pressed={checked}
              className="flex min-h-[44px] w-full items-center gap-3 rounded-[var(--radius-control)] border px-3 py-2 text-left"
              style={{
                borderColor: checked ? "var(--accent)" : "var(--rule)",
                background: checked ? "var(--accent-tint)" : "var(--surface)",
              }}
            >
              <span
                aria-hidden
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border"
                style={{
                  borderColor: checked ? "var(--accent)" : "var(--ink-faint)",
                  background: checked ? "var(--accent)" : "transparent",
                  color: "#fff",
                }}
              >
                {checked ? "✓" : ""}
              </span>
              <span className="flex flex-col">
                <span className="text-[15px]" style={{ fontWeight: checked ? 500 : 400 }}>
                  {h.label}
                </span>
                {h.note ? <span className="caption">{h.note}</span> : null}
              </span>
              <span className="num ml-auto text-[12px]" style={{ color: "var(--ink-faint)" }}>
                {h.points} pt{h.points > 1 ? "s" : ""}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
