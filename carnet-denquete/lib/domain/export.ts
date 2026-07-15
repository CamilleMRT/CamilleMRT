// "Copier la synthèse" — plain-text export for the dietician and the
// gastro-enterologist. The final badge is not a weight; it is a complete
// table to put on a specialist's desk (brief §9).

import { formatFR } from "./dates";
import { PHASE_NAMES } from "./constants";
import { CYCLE_COLORS } from "./constants";
import type { ComputeInput } from "./protocol";
import { computeState } from "./protocol";
import { stratify, decide, type StratifiedTable } from "./analysis";
import type { CyclePhase, PhaseId } from "./types";
import { DECISION_CRITERION } from "./constants";

const CYCLE_ORDER: CyclePhase[] = ["menstruelle", "folliculaire", "ovulatoire", "luteale"];
const num = (v: number | null, d = 1) => (v === null ? "—" : v.toFixed(d));

function tableBlock(table: StratifiedTable): string {
  const lines: string[] = [];
  for (const p of [1, 2, 3, 4] as PhaseId[]) {
    lines.push(`\n## Phase ${p} — ${PHASE_NAMES[p]}`);
    for (const c of CYCLE_ORDER) {
      const cell = table.cells[p][c];
      if (cell.n === 0) continue;
      const flag = cell.weak ? " (n<4 — indicatif)" : "";
      lines.push(
        `  ${CYCLE_COLORS[c].label.padEnd(13)} n=${cell.n}  ` +
          `ballon.=${num(cell.bloating)}  énergie=${num(cell.energy)}  ` +
          `anxiété=${num(cell.anxiety)}  selles=${cell.stools}/${cell.n}${flag}`,
      );
    }
  }
  return lines.join("\n");
}

export function buildSynthesis(input: ComputeInput): string {
  const { stage } = computeState(input);
  const table = stratify(input);
  const lines: string[] = [];

  lines.push("CARNET D'ENQUÊTE — Synthèse");
  lines.push(`Éditée le ${formatFR(input.today, { weekday: true })}`);
  lines.push("");
  lines.push(`Début du protocole : ${formatFR(input.config.startDate)}`);
  lines.push(`Stade actuel : ${describeStage(stage)}`);
  lines.push("");
  lines.push("CRITÈRE DE DÉCISION (figé avant le jour 1) :");
  lines.push(DECISION_CRITERION);
  lines.push("");
  lines.push("TABLEAU STRATIFIÉ (symptômes × phase de cycle × phase de protocole)");
  lines.push(tableBlock(table));
  lines.push("");

  // Verdicts, only when the relevant phase is complete enough to compare.
  for (const testPhase of [2, 3] as const) {
    const res = decide(table, testPhase);
    const label = testPhase === 2 ? "Lactose (Phase 2 vs 1)" : "Gluten (Phase 3 vs 1)";
    lines.push(`VERDICT — ${label} : ${res.verdict}`);
  }
  lines.push("");
  lines.push("LIMITE À CONNAÎTRE : le psyllium et la réhydratation produisent leur plein");
  lines.push("effet sur plusieurs semaines. Une amélioration tardive peut leur être due,");
  lines.push("et pas à l'éviction. Le protocole ne distingue pas les deux.");
  lines.push("");
  lines.push("Ce protocole ne remplace ni le suivi diététique, ni un bilan gastro-entérologique.");

  return lines.join("\n");
}

function describeStage(stage: ReturnType<typeof computeState>["stage"]): string {
  switch (stage.kind) {
    case "escalier":
      return `Escalier — palier ${stage.palier} (tentative ${stage.attempt})`;
    case "phase":
      return `Phase ${stage.phase} — ${PHASE_NAMES[stage.phase]}, jour ${stage.dayInPhase}/${stage.totalDays}`;
    case "gate-phase1":
      return "Point de sortie — décision après la phase 1";
    case "awaiting-confirmation":
      return "En attente d'une fenêtre folliculaire (phase 4)";
    case "done":
      return stage.reason === "exit-phase1" ? "Terminé (sortie après phase 1)" : "Protocole complété";
  }
}
