"use client";

import { useState } from "react";
import type { JournalEntry } from "@/lib/domain/types";
import { useStore } from "@/lib/store";

const SCALE = [0, 1, 2, 3, 4, 5];

function Scale({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[15px]" style={{ fontWeight: 500 }}>
          {label}
        </span>
        <span className="caption">{hint}</span>
      </div>
      <div className="flex gap-1.5" role="group" aria-label={label}>
        {SCALE.map((n) => {
          const active = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-pressed={active}
              className="num flex h-11 flex-1 items-center justify-center rounded-[var(--radius-control)] border text-[15px]"
              style={{
                borderColor: active ? "var(--accent)" : "var(--rule)",
                background: active ? "var(--accent)" : "var(--surface)",
                color: active ? "#fff" : "var(--ink)",
                fontWeight: active ? 500 : 400,
              }}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function JournalForm() {
  const { today, recordFor, setJournal } = useStore();
  const existing = recordFor(today).journal;
  const [draft, setDraft] = useState<Partial<JournalEntry>>(existing ?? {});
  const [saved, setSaved] = useState(!!existing);

  function patch(p: Partial<JournalEntry>) {
    setDraft((d) => ({ ...d, ...p }));
    setSaved(false);
  }

  const complete =
    draft.bloating != null && draft.energy != null && draft.anxiety != null && draft.stool != null;

  function save() {
    if (!complete) return;
    setJournal(today, draft as JournalEntry);
    setSaved(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <Scale
        label="Ballonnement"
        hint="0 = aucun"
        value={draft.bloating ?? null}
        onChange={(v) => patch({ bloating: v })}
      />
      <Scale
        label="Énergie"
        hint="5 = au top"
        value={draft.energy ?? null}
        onChange={(v) => patch({ energy: v })}
      />
      <Scale
        label="Anxiété / fringale"
        hint="0 = calme"
        value={draft.anxiety ?? null}
        onChange={(v) => patch({ anxiety: v })}
      />
      <div>
        <span className="mb-1 block text-[15px]" style={{ fontWeight: 500 }}>
          Selle
        </span>
        <div className="flex gap-1.5">
          {[
            { v: true, l: "Oui" },
            { v: false, l: "Non" },
          ].map((o) => {
            const active = draft.stool === o.v;
            return (
              <button
                key={o.l}
                type="button"
                onClick={() => patch({ stool: o.v })}
                aria-pressed={active}
                className="h-11 flex-1 rounded-[var(--radius-control)] border text-[15px]"
                style={{
                  borderColor: active ? "var(--accent)" : "var(--rule)",
                  background: active ? "var(--accent)" : "var(--surface)",
                  color: active ? "#fff" : "var(--ink)",
                  fontWeight: active ? 500 : 400,
                }}
              >
                {o.l}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={save}
        disabled={!complete}
        className="min-h-[44px] w-full rounded-[var(--radius-control)] px-4 text-[15px] disabled:opacity-40"
        style={{ background: "var(--accent)", color: "#fff", fontWeight: 500 }}
      >
        {saved ? "Enregistré ✓" : "Enregistrer le journal"}
      </button>
    </div>
  );
}
