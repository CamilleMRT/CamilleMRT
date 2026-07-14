"use client";

import { useEffect, useState } from "react";
import { GhostButton } from "./ui";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export function PushEnable() {
  const [status, setStatus] = useState<"idle" | "on" | "unsupported" | "error">("idle");
  const vapid = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    navigator.serviceWorker.ready.then(async (reg) => {
      const sub = await reg.pushManager.getSubscription();
      if (sub) setStatus("on");
    });
  }, []);

  async function enable() {
    if (!vapid) {
      setStatus("error");
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") return;
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapid) as BufferSource,
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });
      setStatus("on");
    } catch {
      setStatus("error");
    }
  }

  if (status === "unsupported") {
    return <p className="caption">Les notifications push ne sont pas disponibles sur cet appareil. Le calendrier .ics reste, lui, 100 % fiable.</p>;
  }
  if (status === "on") {
    return <p className="caption">Notifications activées. Le push est un confort — le rappel .ics ne tombe jamais.</p>;
  }
  return (
    <div>
      <GhostButton onClick={enable}>Activer les notifications (bonus)</GhostButton>
      {!vapid && <p className="caption mt-2">Configure NEXT_PUBLIC_VAPID_PUBLIC_KEY pour activer.</p>}
      {status === "error" && <p className="caption mt-2">Impossible d&apos;activer — réessaie, ou reste sur le .ics.</p>}
    </div>
  );
}
