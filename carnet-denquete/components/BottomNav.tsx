"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Aujourd'hui" },
  { href: "/escalier", label: "Escalier" },
  { href: "/bilan", label: "Bilan" },
  { href: "/analyse", label: "Analyse" },
  { href: "/reglages", label: "Réglages" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-10 border-t border-[var(--rule)] bg-[var(--surface)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex w-full max-w-[560px]">
        {TABS.map((t) => {
          const active = pathname === t.href;
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                aria-current={active ? "page" : undefined}
                className="flex min-h-[56px] flex-col items-center justify-center gap-0.5 px-1 text-center"
                style={{ color: active ? "var(--accent)" : "var(--ink-soft)" }}
              >
                <span className="text-[12px] leading-tight" style={{ fontWeight: active ? 500 : 400 }}>
                  {t.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
