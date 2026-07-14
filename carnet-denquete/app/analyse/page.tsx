"use client";

import { useMemo, useState } from "react";
import { useStore, toComputeInput } from "@/lib/store";
import { computeState } from "@/lib/domain/protocol";
import { stratify, isAnalysisLocked } from "@/lib/domain/analysis";
import { buildSynthesis } from "@/lib/domain/export";
import { CYCLE_COLORS, PHASE_NAMES, MIN_N_FOR_SIGNAL } from "@/lib/domain/constants";
import type { CyclePhase, PhaseId } from "@/lib/domain/types";
import { Card, PageTitle, PrimaryButton } from "@/components/ui";

const CYCLE_ORDER: CyclePhase[] = ["menstruelle", "folliculaire", "ovulatoire", "luteale"];
const PHASES: PhaseId[] = [1, 2, 3, 4];
const fmt = (v: number | null) => (v == null ? "—" : v.toFixed(1));

export default function AnalysePage() {
  const { state, today, ready } = useStore();
  const [copied, setCopied] = useState(false);

  const { stage, table } = useMemo(() => {
    const input = toComputeInput(state, today);
    const { stage } = computeState(input);
    const table = stratify(input);
    return { stage, table };
  }, [state, today]);

  if (!ready) return <p className="caption">Chargement…</p>;

  const locked = isAnalysisLocked(stage.kind);

  async function copySynthesis() {
    const text = buildSynthesis(toComputeInput(state, today));
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  if (locked) {
    return (
      <>
        <PageTitle>Analyse</PageTitle>
        <Card>
          <h2 className="mb-2">🔒 Verrouillé pendant la phase</h2>
          <p className="text-[15px]" style={{ color: "var(--ink-soft)" }}>
            Voir tes chiffres pendant que tu les produis est un biais d&apos;attente. L&apos;écran se
            déverrouille à la fin de la phase en cours.
          </p>
          {stage.kind === "phase" && (
            <p className="num caption mt-3">
              Phase {stage.phase} — jour {stage.dayInPhase}/{stage.totalDays}
            </p>
          )}
        </Card>
      </>
    );
  }

  return (
    <>
      <PageTitle sub="Symptômes × phase du cycle × phase du protocole.">Analyse</PageTitle>

      <div className="flex flex-col gap-4">
        {PHASES.map((p) => {
          const hasData = CYCLE_ORDER.some((c) => table.cells[p][c].n > 0);
          if (!hasData) return null;
          return (
            <Card key={p}>
              <h3 className="mb-2">
                Phase {p} — {PHASE_NAMES[p]}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <tr style={{ color: "var(--ink-soft)" }}>
                      <th className="py-1 text-left font-normal">Cycle</th>
                      <th className="py-1 text-right font-normal">Ballon.</th>
                      <th className="py-1 text-right font-normal">Énerg.</th>
                      <th className="py-1 text-right font-normal">Anx.</th>
                      <th className="py-1 text-right font-normal">Selles</th>
                      <th className="py-1 text-right font-normal">n</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CYCLE_ORDER.map((c) => {
                      const cell = table.cells[p][c];
                      const luteal = c === "luteale";
                      const weak = cell.weak;
                      return (
                        <tr
                          key={c}
                          style={{
                            background: luteal ? "var(--accent-tint)" : "transparent",
                            opacity: cell.n === 0 || weak ? 0.5 : 1,
                          }}
                        >
                          <td className="py-1">
                            <span style={{ color: `var(--${c}-ink)`, fontWeight: luteal ? 500 : 400 }}>
                              {CYCLE_COLORS[c].label}
                            </span>
                          </td>
                          <td className="num py-1 text-right">{fmt(cell.bloating)}</td>
                          <td className="num py-1 text-right">{fmt(cell.energy)}</td>
                          <td className="num py-1 text-right">{fmt(cell.anxiety)}</td>
                          <td className="num py-1 text-right">
                            {cell.n === 0 ? "—" : `${cell.stools}/${cell.n}`}
                          </td>
                          <td className="num py-1 text-right">{cell.n}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          );
        })}

        <p className="caption">
          Les cases avec n &lt; {MIN_N_FOR_SIGNAL} sont grisées : une moyenne sur si peu de jours est du
          bruit, pas une donnée. Les seules comparaisons valides sont Phase 2 vs Phase 1 (lactose) et
          Phase 3 vs Phase 1 (gluten), à phase de cycle identique.
        </p>

        <Card tint>
          <p className="text-[15px]">
            À connaître : le psyllium et la réhydratation produisent leur plein effet sur plusieurs
            semaines. Une amélioration tardive peut leur être due, pas à l&apos;éviction. Le protocole ne
            distingue pas les deux.
          </p>
        </Card>

        <PrimaryButton onClick={copySynthesis}>
          {copied ? "Synthèse copiée ✓" : "Copier la synthèse"}
        </PrimaryButton>
      </div>
    </>
  );
}
