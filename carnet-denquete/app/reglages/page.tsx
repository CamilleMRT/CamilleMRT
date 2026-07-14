"use client";

import { useMemo, useState } from "react";
import { useStore, toComputeInput } from "@/lib/store";
import { projectMilestones } from "@/lib/domain/protocol";
import { dailyRemindersICS, protocolICS } from "@/lib/domain/ics";
import { buildSynthesis } from "@/lib/domain/export";
import { DECISION_CRITERION } from "@/lib/domain/constants";
import { formatFR } from "@/lib/domain/dates";
import type { Settings } from "@/lib/domain/types";
import { Card, PageTitle, PrimaryButton, GhostButton } from "@/components/ui";
import { PushEnable } from "@/components/PushEnable";

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReglagesPage() {
  const store = useStore();
  const { state, today, ready } = store;
  const [copied, setCopied] = useState(false);

  const milestones = useMemo(
    () => (ready ? projectMilestones(toComputeInput(state, today)) : []),
    [state, today, ready],
  );

  if (!ready) return <p className="caption">Chargement…</p>;

  const paused = !!state.records[today]?.paused;

  function pause() {
    const msg = paused
      ? "Reprendre le protocole aujourd'hui ?"
      : "Mettre le protocole en pause aujourd'hui ? Le compteur s'arrête, ton cycle continue. Tu reprends exactement où tu en étais. Ce n'est pas un échec — c'est prévu.";
    if (window.confirm(msg)) store.togglePause(today);
  }

  async function copySynthesis() {
    try {
      await navigator.clipboard.writeText(buildSynthesis(toComputeInput(state, today)));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    if (!window.confirm("Réinitialiser toutes les données ? Cette action est irréversible.")) return;
    if (!window.confirm("Es-tu sûre ? Tout sera effacé définitivement.")) return;
    store.reset();
  }

  const modes: Array<{ v: NonNullable<Settings["darkMode"]>; l: string }> = [
    { v: "system", l: "Système" },
    { v: "light", l: "Clair" },
    { v: "dark", l: "Sombre" },
  ];

  return (
    <>
      <PageTitle>Réglages</PageTitle>

      <div className="flex flex-col gap-4">
        {/* Dates */}
        <Card>
          <h3 className="mb-2">Dates</h3>
          <label className="mb-3 block">
            <span className="caption">Début du protocole (Horloge A)</span>
            <input
              type="date"
              value={state.config.startDate}
              onChange={(e) => store.setConfig({ startDate: e.target.value })}
              className="mt-1 h-11 w-full rounded-[var(--radius-control)] border border-[var(--rule)] bg-[var(--surface)] px-3"
            />
          </label>
          <label className="block">
            <span className="caption">J1 de référence (Horloge B)</span>
            <input
              type="date"
              value={state.config.cycleReferenceJ1}
              onChange={(e) => store.setConfig({ cycleReferenceJ1: e.target.value })}
              className="mt-1 h-11 w-full rounded-[var(--radius-control)] border border-[var(--rule)] bg-[var(--surface)] px-3"
            />
          </label>
          <p className="caption mt-2">
            Les deux horloges sont indépendantes. Le cycle n&apos;apparaît jamais dans le calendrier du
            protocole.
          </p>
        </Card>

        {/* Calendrier .ics */}
        <Card>
          <h3 className="mb-2">Calendrier .ics</h3>
          <p className="caption mb-3">
            Le socle 100 % fiable : c&apos;est iOS qui gère l&apos;alarme. Importe ces fichiers dans ton
            agenda.
          </p>
          <div className="flex flex-col gap-2">
            <GhostButton onClick={() => download("carnet-rappels.ics", dailyRemindersICS(state.config.startDate))}>
              Les 3 rappels quotidiens (07 h 30 · 16 h · 21 h)
            </GhostButton>
            <GhostButton onClick={() => download("carnet-protocole.ics", protocolICS(milestones))}>
              Le protocole complet (jalons)
            </GhostButton>
          </div>
          <p className="caption mt-2">
            Les jalons du protocole sont une projection : les dates se décalent selon ta progression réelle.
          </p>
          <div className="mt-3 border-t border-[var(--rule)] pt-3">
            <PushEnable />
          </div>
        </Card>

        {/* Les trois boutons */}
        <Card>
          <h3 className="mb-3">Actions</h3>
          <div className="flex flex-col gap-2">
            <GhostButton onClick={pause}>
              {paused ? "Reprendre le protocole" : "Mettre en pause aujourd'hui"}
            </GhostButton>
            <GhostButton onClick={copySynthesis}>
              {copied ? "Synthèse copiée ✓" : "Copier la synthèse"}
            </GhostButton>
            <button
              type="button"
              onClick={reset}
              className="min-h-[44px] w-full rounded-[var(--radius-control)] border px-4 text-[15px]"
              style={{ borderColor: "var(--menstruelle-ink)", color: "var(--menstruelle-ink)" }}
            >
              Réinitialiser (double confirmation)
            </button>
          </div>
        </Card>

        {/* Mode sombre */}
        <Card>
          <h3 className="mb-2">Apparence</h3>
          <div className="flex gap-1.5">
            {modes.map((m) => {
              const active = (state.settings.darkMode ?? "system") === m.v;
              return (
                <button
                  key={m.v}
                  type="button"
                  onClick={() => store.setDarkMode(m.v)}
                  aria-pressed={active}
                  className="h-11 flex-1 rounded-[var(--radius-control)] border text-[15px]"
                  style={{
                    borderColor: active ? "var(--accent)" : "var(--rule)",
                    background: active ? "var(--accent)" : "var(--surface)",
                    color: active ? "#fff" : "var(--ink)",
                  }}
                >
                  {m.l}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Critère de décision (figé) */}
        <Card>
          <h3 className="mb-2">Critère de décision (figé avant le jour 1)</h3>
          <p className="text-[15px]" style={{ color: "var(--ink-soft)" }}>
            {DECISION_CRITERION}
          </p>
        </Card>

        {/* Critères d'arrêt */}
        <Card>
          <h3 className="mb-2" style={{ color: "var(--menstruelle-ink)" }}>
            Critères d&apos;arrêt — consulte un médecin
          </h3>
          <p className="text-[15px]">
            Arrête le protocole et consulte un médecin si tu observes : sang dans les selles · perte de
            poids inexpliquée · douleur abdominale sévère · fièvre · vomissements répétés.
          </p>
          <p className="caption mt-2">
            Ce protocole ne remplace ni le suivi de ta diététicienne, ni un bilan gastro-entérologique.
          </p>
        </Card>

        <p className="caption text-center">
          Début : {formatFR(state.config.startDate)} · Aucun comptage de calories, aucun suivi de poids.
        </p>
      </div>
    </>
  );
}
