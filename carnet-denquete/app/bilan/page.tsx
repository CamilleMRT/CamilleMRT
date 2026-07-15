"use client";

import { useMemo } from "react";
import { useStore, toComputeInput } from "@/lib/store";
import { computeState } from "@/lib/domain/protocol";
import { tacticalRecommendations } from "@/lib/domain/recommendations";
import { newHabitsOf, acquiredHabitsBefore, VALIDATE_NEW_MIN, VALIDATE_ACQUIRED_MIN, PALIER_NAMES, PHASE_NAMES } from "@/lib/domain/constants";
import { addDays, rangeInclusive } from "@/lib/domain/dates";
import { Card, PageTitle } from "@/components/ui";
import { WeekSymptoms } from "@/components/WeekSymptoms";

export default function BilanPage() {
  const { state, today, ready } = useStore();

  const data = useMemo(() => {
    const input = toComputeInput(state, today);
    const { stage } = computeState(input);
    const ordered = Object.values(state.records).sort((a, b) => a.date.localeCompare(b.date));
    const recos = tacticalRecommendations(today, ordered, state.j1Dates, state.config).slice(0, 2);
    // Week dates: the escalier's current active week, else the last 7 calendar days.
    const weekDates =
      stage.kind === "escalier" && stage.week.length > 0
        ? stage.week
        : rangeInclusive(addDays(today, -6), today);
    return { stage, recos, weekDates };
  }, [state, today]);

  if (!ready) return <p className="caption">Chargement…</p>;
  const { stage, recos, weekDates } = data;

  return (
    <>
      <PageTitle sub="Le récit qui tient : compléter le dossier, case par case.">Bilan de la semaine</PageTitle>

      {/* Palier / phase */}
      <Card className="mb-4">
        {stage.kind === "escalier" ? (
          <>
            <h3 className="mb-2">
              Palier {stage.palier} — {PALIER_NAMES[stage.palier]}
            </h3>
            <ul className="flex flex-col gap-1.5">
              {newHabitsOf(stage.palier).map((h) => {
                const c = stage.week.reduce((n, d) => n + (state.records[d]?.habits?.[h.id] ? 1 : 0), 0);
                const ok = c >= VALIDATE_NEW_MIN;
                return (
                  <li key={h.id} className="flex items-center justify-between">
                    <span className="text-[15px]">{h.label}</span>
                    <span className="num text-[15px]" style={{ color: ok ? "var(--accent)" : "var(--ink-soft)" }}>
                      {c}/7
                    </span>
                  </li>
                );
              })}
              {acquiredHabitsBefore(stage.palier).map((h) => {
                const c = stage.week.reduce((n, d) => n + (state.records[d]?.habits?.[h.id] ? 1 : 0), 0);
                const ok = c >= VALIDATE_ACQUIRED_MIN;
                return (
                  <li key={h.id} className="flex items-center justify-between opacity-70">
                    <span className="text-[15px]">{h.label}</span>
                    <span className="num text-[15px]" style={{ color: ok ? "var(--accent)" : "var(--ink-soft)" }}>
                      {c}/7
                    </span>
                  </li>
                );
              })}
            </ul>
            {stage.weekComplete && stage.validation && (
              <p className="mt-3 text-[15px]" style={{ fontWeight: 500 }}>
                {stage.validation.pass
                  ? "Semaine validée. On monte d'une marche."
                  : "On rejoue cette semaine. Rien n'est perdu."}
              </p>
            )}
          </>
        ) : stage.kind === "phase" ? (
          <>
            <h3 className="mb-1">
              Phase {stage.phase} — {PHASE_NAMES[stage.phase]}
            </h3>
            <p className="num caption">
              jour {stage.dayInPhase}/{stage.totalDays}
            </p>
          </>
        ) : (
          <p className="text-[15px]">Pas de palier ni de phase en cours cette semaine.</p>
        )}
      </Card>

      {/* Symptômes */}
      <Card className="mb-4">
        <h3 className="mb-3">Symptômes de la semaine</h3>
        <WeekSymptoms dates={weekDates} config={state.config} />
        <p className="caption mt-3">Chaque barre est colorée par la phase du cycle de ce jour-là.</p>
      </Card>

      {/* Recommandations tactiques */}
      {recos.length > 0 && (
        <Card tint>
          <h3 className="mb-2">Recommandations</h3>
          <ul className="flex flex-col gap-1.5">
            {recos.map((r) => (
              <li key={r.id} className="text-[15px]">
                {r.text}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
