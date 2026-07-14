import type { ReactNode } from "react";
import type { CyclePhase } from "@/lib/domain/types";

export function Card({
  children,
  className = "",
  tint = false,
}: {
  children: ReactNode;
  className?: string;
  tint?: boolean;
}) {
  return (
    <section
      className={`rounded-[var(--radius-card)] border border-[var(--rule)] p-4 ${className}`}
      style={{ background: tint ? "var(--accent-tint)" : "var(--surface)" }}
    >
      {children}
    </section>
  );
}

export function PageTitle({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <header className="mb-4">
      <h1>{children}</h1>
      {sub ? <p className="caption mt-0.5">{sub}</p> : null}
    </header>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="min-h-[44px] w-full rounded-[var(--radius-control)] px-4 text-[15px] disabled:opacity-40"
      style={{ background: "var(--accent)", color: "#fff", fontWeight: 500 }}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-[44px] w-full rounded-[var(--radius-control)] border border-[var(--rule)] px-4 text-[15px]"
      style={{ color: "var(--ink)", background: "var(--surface)" }}
    >
      {children}
    </button>
  );
}

const PHASE_LABELS: Record<CyclePhase, string> = {
  menstruelle: "Menstruelle",
  folliculaire: "Folliculaire",
  ovulatoire: "Ovulatoire",
  luteale: "Lutéale",
};

/** A phase badge: fill aplat with same-phase ink text (never black/grey). */
export function PhaseBadge({ phase, spm }: { phase: CyclePhase; spm?: boolean }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px]"
      style={{
        background: `var(--${phase}-fill)`,
        color: `var(--${phase}-ink)`,
        fontWeight: 500,
      }}
    >
      {PHASE_LABELS[phase]}
      {spm ? " · SPM" : ""}
    </span>
  );
}
