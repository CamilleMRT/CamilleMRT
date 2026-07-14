"use client";

import { useMemo } from "react";
import { useStore, toComputeInput } from "@/lib/store";
import { computeState } from "@/lib/domain/protocol";
import {
  PALIER_NAMES,
  newHabitsOf,
  maxScoreAt,
  VALIDATE_NEW_MIN,
} from "@/lib/domain/constants";
import type { PalierId } from "@/lib/domain/types";
import { Card, PageTitle, PrimaryButton } from "@/components/ui";

const PALIERS: PalierId[] = [1, 2, 3, 4];

export default function EscalierPage() {
  const store = useStore();
  const { state, today, ready } = store;

  const { stage } = useMemo(() => computeState(toComputeInput(state, today)), [state, today]);

  if (!ready) return <p className="caption">Chargement…</p>;

  const currentPalier: PalierId | null = stage.kind === "escalier" ? stage.palier : null;
  const escalierDone = stage.kind !== "escalier";

  // Per-new-habit counts within the current week (for the live 5/7 display).
  const weekCounts: Record<string, number> = {};
  if (stage.kind === "escalier") {
    for (const h of newHabitsOf(stage.palier)) {
      weekCounts[h.id] = stage.week.reduce(
        (n, d) => n + (state.records[d]?.habits?.[h.id] ? 1 : 0),
        0,
      );
    }
  }

  function status(p: PalierId): "acquis" | "en-cours" | "verrouille" {
    if (escalierDone) return "acquis";
    if (currentPalier === null) return "verrouille";
    if (p < currentPalier) return "acquis";
    if (p === currentPalier) return "en-cours";
    return "verrouille";
  }

  return (
    <>
      <PageTitle sub="Chaque marche ajoute des habitudes et garde toutes les précédentes.">
        Escalier
      </PageTitle>

      <div className="flex flex-col gap-3">
        {[...PALIERS].reverse().map((p) => {
          const st = status(p);
          const dimmed = st === "verrouille";
          const isCurrent = st === "en-cours";
          // rising steps: palier 4 widest indent at top
          const indent = (4 - p) * 12;
          return (
            <div key={p} style={{ marginLeft: indent }}>
              <Card
                className={dimmed ? "opacity-45" : ""}
                tint={isCurrent}
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-[16px]" style={{ fontWeight: 500 }}>
                    {p}. {PALIER_NAMES[p]}
                  </span>
                  <span className="caption">
                    {st === "acquis" ? "Acquis ✓" : st === "en-cours" ? "En cours" : "Verrouillé"}
                  </span>
                </div>
                <p className="caption mt-1">Score max : {maxScoreAt(p)} pts</p>

                {isCurrent && stage.kind === "escalier" && (
                  <div className="mt-3 border-t border-[var(--rule)] pt-3">
                    <p className="caption mb-2">
                      Validation : {VALIDATE_NEW_MIN}/7 sur les nouvelles habitudes
                      {stage.attempt > 1 ? ` · tentative ${stage.attempt}` : ""}
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {newHabitsOf(p).map((h) => {
                        const c = weekCounts[h.id] ?? 0;
                        const ok = c >= VALIDATE_NEW_MIN;
                        return (
                          <li key={h.id} className="flex items-center justify-between">
                            <span className="text-[15px]">{h.label}</span>
                            <span
                              className="num text-[15px]"
                              style={{ color: ok ? "var(--accent)" : "var(--ink-soft)", fontWeight: 500 }}
                            >
                              {c}/7
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    {stage.suggestHalving && !state.settings.halvedPaliers[p] && (
                      <div className="mt-3">
                        <p className="text-[15px]" style={{ color: "var(--ink-soft)" }}>
                          Un palier qui ne passe pas est un palier trop grand, pas un échec de volonté.
                          On peut le diviser par deux.
                        </p>
                        <div className="mt-2">
                          <PrimaryButton onClick={() => store.acceptHalving(p)}>
                            Diviser ce palier par deux
                          </PrimaryButton>
                        </div>
                      </div>
                    )}
                    {state.settings.halvedPaliers[p] && (
                      <p className="caption mt-2">Palier divisé par deux — cibles réduites.</p>
                    )}
                  </div>
                )}
              </Card>
            </div>
          );
        })}
      </div>

      {escalierDone && (
        <Card className="mt-4" tint>
          <p className="text-[15px]">Escalier terminé. Les phases de mesure ont commencé.</p>
        </Card>
      )}
    </>
  );
}
