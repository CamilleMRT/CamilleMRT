import type { PalierId, PhaseId, CyclePhase } from "./types";
import type { ISODate } from "./dates";

// --- Fixed protocol dates ----------------------------------------------

export const DEFAULT_START_DATE: ISODate = "2026-07-14"; // Horloge A
export const DEFAULT_CYCLE_J1: ISODate = "2026-07-07"; // Horloge B reference
export const DEFAULT_CYCLE_LENGTH = 28;
/** Rolling mean window over the most recent observed cycles. */
export const CYCLE_AVERAGE_WINDOW = 6;

// --- Habits -------------------------------------------------------------

export interface HabitDef {
  id: string;
  label: string;
  /** short note surfaced in the UI (the brief's parentheticals). */
  note?: string;
  points: number;
  palier: PalierId;
}

// Cumulative escalier. Each palier ADDS habits and keeps all previous ones.
// Point totals per palier: 5, +5, +2, +3  → daily max 5 → 15.
export const HABITS: HabitDef[] = [
  // Palier 1 — Écouter (5 pts)
  { id: "p1_hunger", palier: 1, points: 1, label: "Qualifier ma faim", note: "les 7 faims" },
  { id: "p1_chew", palier: 1, points: 1, label: "Mastiquer, sans écran" },
  { id: "p1_water", palier: 1, points: 1, label: "Sortir la gourde, boire plus", note: "sans chiffre" },
  { id: "p1_journal", palier: 1, points: 2, label: "Journal du soir" },
  // Palier 2 — Réservoir (+5 pts)
  { id: "p2_hydration", palier: 2, points: 3, label: "Hydratation 2,3 L mesurés", note: "1,5 L si palier divisé" },
  { id: "p2_psyllium", palier: 2, points: 2, label: "Psyllium", note: "toujours avec un grand verre d'eau" },
  // Palier 3 — Matin (+2 pts)
  { id: "p3_breakfast", palier: 3, points: 1, label: "Petit-déjeuner protéiné + glucide IG bas" },
  { id: "p3_probiotic", palier: 3, points: 1, label: "1 probiotique" },
  // Palier 4 — Rythme (+3 pts)
  { id: "p4_fruitsveg", palier: 4, points: 1, label: "2 fruits + 1 poignée de crudités", note: "une poignée OUI, un bol NON" },
  { id: "p4_snack", palier: 4, points: 1, label: "Collation de 16 h planifiée" },
  { id: "p4_walk", palier: 4, points: 1, label: "Marche quotidienne" },
];

export const PALIER_NAMES: Record<PalierId, string> = {
  1: "Écouter",
  2: "Réservoir",
  3: "Matin",
  4: "Rythme",
};

export function habitsUpTo(palier: PalierId): HabitDef[] {
  return HABITS.filter((h) => h.palier <= palier);
}
export function newHabitsOf(palier: PalierId): HabitDef[] {
  return HABITS.filter((h) => h.palier === palier);
}
export function acquiredHabitsBefore(palier: PalierId): HabitDef[] {
  return HABITS.filter((h) => h.palier < palier);
}
export function maxScoreAt(palier: PalierId): number {
  return habitsUpTo(palier).reduce((s, h) => s + h.points, 0);
}

// --- Escalier validation thresholds (garde-fou: never 7/7) -------------

export const WEEK_LENGTH = 7;
export const VALIDATE_NEW_MIN = 5; // new habits: 5/7
export const VALIDATE_ACQUIRED_MIN = 4; // acquired habits must stay >= 4/7
export const FAILS_BEFORE_HALVING = 2;

// --- Measurement phases -------------------------------------------------

export const PHASE_NAMES: Record<PhaseId, string> = {
  1: "Référence",
  2: "Zéro lactose",
  3: "Zéro gluten",
  4: "Confirmation",
};

// Durations in ACTIVE (non-paused) days.
export const PHASE_DURATIONS: Record<PhaseId, number> = {
  1: 28, // 4 semaines — contient automatiquement un cycle complet
  2: 28,
  3: 28,
  4: 5, // déclenchée en phase folliculaire
};

export const PHASE_CONSTRAINTS: Record<PhaseId, string> = {
  1: "Rien ne change. On n'ajoute rien, on ne retire rien. On mesure.",
  2: "Ni lait, ni fromage frais, ni féta, ni burrata, ni yaourt de vache. Mozzarella OK. Pâtes affinées OK (comté, tomme de brebis, parmesan). Probiotiques non-laitiers : légumes lactofermentés, cornichons, choucroute, kimchi, miso, tempeh, kéfir de fruits — et le pain au levain, encore autorisé.",
  3: "Ni blé, ni pain, ni pâtes, ni semoule de blé. Sarrasin, riz, quinoa, avoine, patate douce, légumineuses : OK. Le lactose revient. Plus de pain au levain : les probiotiques repassent aux yaourts et fromages affinés.",
  4: "Un aliment à la fois, 48 h d'observation entre chaque.",
};

// --- Decision criterion — FROZEN before day 1, non-modifiable ----------

export const DECISION_CRITERION =
  "Un aliment est déclaré coupable si, à phase de cycle identique, le ballonnement moyen baisse d'au moins 1 point sur 5 ET les selles augmentent d'au moins 2 par semaine, par rapport à la phase 1. En dessous : non concluant.";

export const DECISION_BLOATING_DROP = 1; // points on 0-5
export const DECISION_STOOLS_PER_WEEK_RISE = 2;

// --- Analysis -----------------------------------------------------------

/** Cells with fewer than this many days are noise → greyed out. */
export const MIN_N_FOR_SIGNAL = 4;

// --- ICS reminders ------------------------------------------------------

export interface IcsReminder {
  slot: "morning" | "snack" | "evening";
  time: string; // "HHMMSS"
  summary: string;
}
export const ICS_REMINDERS: IcsReminder[] = [
  { slot: "morning", time: "073000", summary: "Un verre d'eau, puis la gourde" },
  { slot: "snack", time: "160000", summary: "Collation" },
  { slot: "evening", time: "210000", summary: "Journal du soir — 4 chiffres, 30 secondes" },
];

// --- Design tokens: cycle phase colours (see brief §11) ----------------
// fill = aplats (dial segments, badges). ink = text, strokes, borders.
export const CYCLE_COLORS: Record<CyclePhase, { fill: string; ink: string; label: string }> = {
  menstruelle: { fill: "#E0778E", ink: "#B34157", label: "Menstruelle" },
  folliculaire: { fill: "#5FC08D", ink: "#24714B", label: "Folliculaire" },
  ovulatoire: { fill: "#E5B45F", ink: "#8A6210", label: "Ovulatoire" },
  luteale: { fill: "#8C93E5", ink: "#5259B8", label: "Lutéale" },
};
