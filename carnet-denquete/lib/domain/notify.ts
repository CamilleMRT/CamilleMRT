// Couche 2 — Web Push : le bonus contextuel. Content is computed SERVER-SIDE
// from the palier/phase, the cycle day, and yesterday's journal. Only unlocked
// habits are ever mentioned. The push is a comfort; the .ics reminder is the
// floor that must never fall (brief §7).

import { addDays, type ISODate } from "./dates";
import { cycleInfo } from "./cycle";
import { computeState, type ComputeInput } from "./protocol";
import type { PalierId } from "./types";

export type Slot = "morning" | "snack" | "evening";

export interface PushMessage {
  title: string;
  body: string;
}

/** Highest unlocked palier: escalier → its palier; measurement phases → 4. */
export function unlockedPalier(input: ComputeInput): PalierId {
  const { stage } = computeState(input);
  if (stage.kind === "escalier") return stage.palier;
  return 4;
}

export function computeNotification(slot: Slot, input: ComputeInput): PushMessage | null {
  const palier = unlockedPalier(input);
  const ci = cycleInfo(input.today, input.j1Dates, input.config.cycleReferenceJ1);

  if (slot === "morning") {
    if (palier >= 2 && ci.phase === "luteale") {
      return {
        title: "Aujourd'hui",
        body: "+ Le psyllium aujourd'hui, avec un grand verre d'eau. La progestérone ralentit déjà tout.",
      };
    }
    return null;
  }

  if (slot === "snack") {
    if (palier >= 4 && ci.isSPM) {
      return {
        title: "Collation lutéale",
        body: "Chocolat noir + amandes. Maintenant, pas à 21 h. Ta dépense de repos est réellement plus haute — ce n'est pas de la gourmandise.",
      };
    }
    return null;
  }

  // evening — only if the journal is NOT filled.
  const todayRec = input.records[input.today];
  if (!todayRec?.journal) {
    return { title: "Journal du soir", body: "Quatre chiffres, trente secondes." };
  }
  return null; // journal filled → aucune notification
}

// Event-driven messages (fired by the app on transitions, not by the cron).
export const EVENT_MESSAGES = {
  palierValidated: (nextName: string): PushMessage => ({
    title: "On monte d'une marche",
    body: `Cette semaine : ${nextName}.`,
  }),
  palierReplay: (): PushMessage => ({
    title: "On rejoue cette semaine",
    body: "Rien n'est perdu.",
  }),
  enterPhase2: (): PushMessage => ({
    title: "Phase 2 — Zéro lactose",
    body: "Le lactose sort. Les probiotiques passent au non-laitier (dont le pain au levain).",
  }),
  enterPhase3: (): PushMessage => ({
    title: "Phase 3 — Zéro gluten",
    body: "Le blé sort, le lactose revient. Les probiotiques repassent aux yaourts et fromages affinés.",
  }),
  enterLuteal: (): PushMessage => ({
    title: "Phase lutéale",
    body: "Tes ballonnements vont augmenter mécaniquement. Ce n'est pas le protocole qui échoue.",
  }),
};

/** Whether a push has failed for 3 consecutive days → show the .ics fallback banner. */
export function shouldShowIcsFallback(lastPushSuccessDate: ISODate | null, today: ISODate): boolean {
  if (!lastPushSuccessDate) return false;
  return addDays(lastPushSuccessDate, 3) <= today;
}
