"use client";

// Local-first store. localStorage is the source of truth (offline-first,
// single user). Every mutation persists synchronously and, when online, is
// best-effort flushed to /api/sync — failures are swallowed so the app is
// fully usable without a network.

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { DayRecord, JournalEntry, PalierId, ProtocolConfig, Settings } from "./domain/types";
import type { ISODate } from "./domain/dates";
import { DEFAULT_CYCLE_J1, DEFAULT_START_DATE } from "./domain/constants";
import { todayISO } from "./domain/dates";

const STORAGE_KEY = "carnet-enquete-v1";

export interface StoreState {
  config: ProtocolConfig;
  settings: Settings;
  records: Record<ISODate, DayRecord>;
  j1Dates: ISODate[];
  /** health of the push channel, for the .ics fallback banner. */
  lastPushSuccessDate: ISODate | null;
}

function defaultState(): StoreState {
  return {
    config: { startDate: DEFAULT_START_DATE, cycleReferenceJ1: DEFAULT_CYCLE_J1 },
    settings: { halvedPaliers: {}, darkMode: "system" },
    records: {},
    j1Dates: [DEFAULT_CYCLE_J1],
    lastPushSuccessDate: null,
  };
}

function load(): StoreState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

function persist(state: StoreState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota or private mode — ignore, the UI still holds state in memory */
  }
  // Best-effort sync; never blocks and never throws to the UI.
  if (navigator.onLine) {
    fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
      keepalive: true,
    }).catch(() => {});
  }
}

interface StoreContextValue {
  state: StoreState;
  today: ISODate;
  ready: boolean;
  recordFor: (date: ISODate) => DayRecord;
  toggleHabit: (date: ISODate, habitId: string) => void;
  setJournal: (date: ISODate, entry: JournalEntry) => void;
  togglePause: (date: ISODate) => void;
  addCycleStart: (date: ISODate) => void;
  setStopAfterPhase1: (v: boolean) => void;
  acceptHalving: (palier: PalierId) => void;
  setConfig: (patch: Partial<ProtocolConfig>) => void;
  setDarkMode: (mode: NonNullable<Settings["darkMode"]>) => void;
  reset: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(defaultState);
  const [ready, setReady] = useState(false);
  const [today, setToday] = useState<ISODate>(() => todayISO());

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    setState(load());
    setReady(true);
  }, []);

  // Keep "today" fresh if the app stays open past midnight.
  useEffect(() => {
    const id = setInterval(() => setToday(todayISO()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Apply the theme override.
  useEffect(() => {
    const mode = state.settings.darkMode ?? "system";
    const root = document.documentElement;
    if (mode === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", mode);
  }, [state.settings.darkMode]);

  function update(mut: (s: StoreState) => StoreState) {
    setState((prev) => {
      const next = mut(prev);
      persist(next);
      return next;
    });
  }

  const recordFor = (date: ISODate): DayRecord =>
    state.records[date] ?? { date, habits: {} };

  const value: StoreContextValue = {
    state,
    today,
    ready,
    recordFor,
    toggleHabit: (date, habitId) =>
      update((s) => {
        const rec = s.records[date] ?? { date, habits: {} };
        const habits = { ...rec.habits, [habitId]: !rec.habits[habitId] };
        return { ...s, records: { ...s.records, [date]: { ...rec, habits } } };
      }),
    setJournal: (date, entry) =>
      update((s) => {
        const rec = s.records[date] ?? { date, habits: {} };
        return { ...s, records: { ...s.records, [date]: { ...rec, journal: entry } } };
      }),
    togglePause: (date) =>
      update((s) => {
        const rec = s.records[date] ?? { date, habits: {} };
        return { ...s, records: { ...s.records, [date]: { ...rec, paused: !rec.paused } } };
      }),
    addCycleStart: (date) =>
      update((s) => {
        if (s.j1Dates.includes(date)) return s;
        return { ...s, j1Dates: [...s.j1Dates, date].sort() };
      }),
    setStopAfterPhase1: (v) =>
      update((s) => ({ ...s, settings: { ...s.settings, stopAfterPhase1: v } })),
    acceptHalving: (palier) =>
      update((s) => ({
        ...s,
        settings: { ...s.settings, halvedPaliers: { ...s.settings.halvedPaliers, [palier]: true } },
      })),
    setConfig: (patch) => update((s) => ({ ...s, config: { ...s.config, ...patch } })),
    setDarkMode: (mode) =>
      update((s) => ({ ...s, settings: { ...s.settings, darkMode: mode } })),
    reset: () => update(() => defaultState()),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

/** Build the ComputeInput the domain layer expects from the current store. */
export function toComputeInput(state: StoreState, today: ISODate) {
  return {
    config: state.config,
    records: state.records,
    settings: state.settings,
    j1Dates: state.j1Dates,
    today,
  };
}
