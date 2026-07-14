"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "./ui";

// The filet: if push has failed 3 days running, invite falling back to the
// .ics calendar. The push is a comfort; the reminder must never fall.
export function IcsFallbackBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    fetch("/api/push/health")
      .then((r) => r.json())
      .then((h) => setShow((h?.consecutiveFailures ?? 0) >= 3))
      .catch(() => {});
  }, []);
  if (!show) return null;
  return (
    <Card tint className="mb-4">
      <p className="text-[15px]">
        Les notifications n&apos;arrivent plus depuis quelques jours. Rabats-toi sur le calendrier .ics —
        il est 100 % fiable.{" "}
        <Link href="/reglages" style={{ color: "var(--accent)", fontWeight: 500 }}>
          Réglages
        </Link>
      </p>
    </Card>
  );
}
