"use client";

import { useMemo } from "react";
import { useStore, toComputeInput } from "@/lib/store";
import { computeState } from "@/lib/domain/protocol";
import { cycleInfo } from "@/lib/domain/cycle";
import { dailyScore, dailyMax } from "@/lib/domain/scoring";
import { tacticalRecommendations } from "@/lib/domain/recommendations";
import {
  PALIER_NAMES,
  PHASE_NAMES,
  PHASE_CONSTRAINTS,
  maxScoreAt,
} from "@/lib/domain/constants";
import { formatFR } from "@/lib/domain/dates";
import type { PalierId } from "@/lib/domain/types";
import { CycleDial } from "@/components/CycleDial";
import { HabitList } from "@/components/HabitList";
import { JournalForm } from "@/components/JournalForm";
import { Card, PageTitle, PhaseBadge, PrimaryButton, GhostButton } from "@/components/ui";
import { IcsFallbackBanner } from "@/components/IcsFallbackBanner";

export default function TodayPage() {
  const store = useStore();
  const { state, today, ready } = store;

  const { stage, ci, palierLevel, score, max, recos } = useMemo(() => {
    const input = toComputeInput(state, today);
    const { stage } = computeState(input);
    const ci = cycleInfo(today, state.j1Dates, state.config.cycleReferenceJ1);
    const palierLevel: PalierId = stage.kind === "escalier" ? stage.palier : 4;
    const rec = state.records[today];
    const score = dailyScore(rec, palierLevel);
    const max = dailyMax(palierLevel);
    const ordered = Object.values(state.records).sort((a, b) => a.date.localeCompare(b.date));
    const recos = tacticalRecommendations(today, ordered, state.j1Dates, state.config);
    return { stage, ci, palierLevel, score, max, recos };
  }, [state, today]);

  if (!ready) return <p className="caption">Chargement…</p>;

  const paused = !!state.records[today]?.paused;

  return (
    <>
      <PageTitle sub={formatFR(today, { weekday: true })}>Aujourd&apos;hui</PageTitle>

      <IcsFallbackBanner />

      {paused && (
        <Card tint className="mb-4">
          <p className="text-[15px]">
            Journée en pause. Le compteur du protocole est arrêté — ton cycle, lui, continue.
          </p>
        </Card>
      )}

      {/* Stage + cycle */}
      <Card className="mb-4">
        <div className="flex items-center gap-4">
          <CycleDial cycleDay={ci.cycleDay} length={ci.length} phase={ci.phase} />
          <div className="flex flex-col gap-1.5">
            {stage.kind === "escalier" && (
              <>
                <span className="caption">Escalier · palier {stage.palier}</span>
                <span className="text-[18px]" style={{ fontWeight: 500 }}>
                  {PALIER_NAMES[stage.palier]}
                </span>
                <span className="caption">
                  Semaine en cours · jour {stage.dayInWeek}/7
                  {stage.attempt > 1 ? ` · tentative ${stage.attempt}` : ""}
                </span>
              </>
            )}
            {stage.kind === "phase" && (
              <>
                <span className="caption">Phase {stage.phase}</span>
                <span className="text-[18px]" style={{ fontWeight: 500 }}>
                  {PHASE_NAMES[stage.phase]}
                </span>
                <span className="num caption">
                  jour {stage.dayInPhase}/{stage.totalDays}
                </span>
              </>
            )}
            {stage.kind === "awaiting-confirmation" && (
              <span className="text-[16px]">En attente d&apos;une fenêtre folliculaire.</span>
            )}
            {stage.kind === "done" && (
              <span className="text-[16px]">
                {stage.reason === "exit-phase1" ? "Protocole arrêté après la phase 1." : "Protocole complété."}
              </span>
            )}
            <div className="mt-1">
              <PhaseBadge phase={ci.phase} spm={ci.isSPM} />
            </div>
          </div>
        </div>

        {/* Score */}
        {(stage.kind === "escalier" || stage.kind === "phase") && (
          <div className="mt-4 flex items-baseline justify-between border-t border-[var(--rule)] pt-3">
            <span className="caption">Score du jour</span>
            <span className="num text-[22px]" style={{ fontWeight: 500 }}>
              {score}
              <span className="text-[14px]" style={{ color: "var(--ink-faint)" }}>
                {" "}
                / {max}
              </span>
            </span>
          </div>
        )}
      </Card>

      {/* Point de sortie after phase 1 */}
      {stage.kind === "gate-phase1" && (
        <Card tint className="mb-4">
          <h2 className="mb-2">Tes symptômes sont-ils déjà nettement meilleurs qu&apos;au jour 1 ?</h2>
          <p className="mb-3 text-[15px]">
            Si oui, tu t&apos;arrêtes là. L&apos;eau, le psyllium et la mastication ont suffi — tu n&apos;as
            aucune raison de couper quoi que ce soit. C&apos;est le meilleur résultat possible.
          </p>
          <div className="flex flex-col gap-2">
            <PrimaryButton onClick={() => store.setStopAfterPhase1(true)}>
              Oui — je m&apos;arrête ici
            </PrimaryButton>
            <GhostButton onClick={() => store.setStopAfterPhase1(false)}>
              Non — je continue vers la phase 2
            </GhostButton>
          </div>
        </Card>
      )}

      {/* Phase constraint reminder */}
      {stage.kind === "phase" && (
        <Card className="mb-4">
          <h3 className="mb-1">Contrainte de la phase</h3>
          <p className="text-[15px]" style={{ color: "var(--ink-soft)" }}>
            {PHASE_CONSTRAINTS[stage.phase]}
          </p>
        </Card>
      )}

      {/* Tactical recommendations (🟢 only) */}
      {recos.length > 0 && (
        <Card tint className="mb-4">
          <h3 className="mb-1">Aujourd&apos;hui</h3>
          <ul className="flex flex-col gap-1.5">
            {recos.map((r) => (
              <li key={r.id} className="text-[15px]">
                {r.text}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Habits */}
      {!paused && (stage.kind === "escalier" || stage.kind === "phase" || stage.kind === "gate-phase1") && (
        <Card className="mb-4">
          <h3 className="mb-3">Mes habitudes</h3>
          <HabitList palier={palierLevel} />
          <p className="caption mt-3">
            Objectif : 5 jours sur 7. Jamais 7/7. Une journée manquée reste grise, rien ne se casse.
          </p>
        </Card>
      )}

      {/* Cycle button */}
      <Card className="mb-4">
        <button
          type="button"
          onClick={() => store.addCycleStart(today)}
          className="min-h-[44px] w-full rounded-[var(--radius-control)] border px-4 text-[15px]"
          style={{ borderColor: "var(--menstruelle-ink)", color: "var(--menstruelle-ink)", fontWeight: 500 }}
        >
          Mes règles ont commencé aujourd&apos;hui
        </button>
        {state.j1Dates.length > 0 && (
          <p className="caption mt-2">
            Dernier J1 enregistré : {formatFR(state.j1Dates[state.j1Dates.length - 1])}
          </p>
        )}
      </Card>

      {/* Journal du soir */}
      {!paused && (
        <Card>
          <h3 className="mb-3">Journal du soir</h3>
          <JournalForm />
        </Card>
      )}
    </>
  );
}
