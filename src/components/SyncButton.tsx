"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";

export type SyncState = "idle" | "syncing" | "error";

export interface SyncButtonProps {
  doSync: () => Promise<void>;
  lastSynced?: string | null;
  className?: string;
  onSyncStart?: () => void;
  onSyncSuccess?: (ts: string) => void;
  onSyncError?: (err: unknown) => void;
}

export default function SyncButton({
  doSync,
  lastSynced,
  className = "",
  onSyncStart,
  onSyncSuccess,
  onSyncError,
}: SyncButtonProps) {
  const [state, setState] = useState<SyncState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [ts, setTs] = useState<string | null>(lastSynced ?? null);
  const mounted = useRef(true);

  useEffect(() => () => {
    mounted.current = false;
  }, []);

  async function handleSync() {
    if (state === "syncing") return;
    setState("syncing");
    setError(null);
    onSyncStart?.();
    try {
      await doSync();
      const now = new Date().toISOString();
      if (!mounted.current) return;
      setTs(now);
      setState("idle");
      onSyncSuccess?.(now);
    } catch (e: any) {
      if (!mounted.current) return;
      setState("error");
      setError(e?.message ?? "Sync failed");
      onSyncError?.(e);
    }
  }

  const label =
    state === "syncing"
      ? "Syncing…"
      : state === "error"
      ? "Sync issue"
      : ts
      ? "Synced"
      : "Sync";

  const title =
    state === "error"
      ? error ?? "Sync failed"
      : ts
      ? `Last synced ${formatRelative(ts)}`
      : "Manual sync";

  return (
    <button
      type="button"
      onClick={handleSync}
      disabled={state === "syncing"}
      aria-busy={state === "syncing"}
      aria-pressed={state === "syncing"}
      aria-live="polite"
      title={title}
      className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {state === "syncing" ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : state === "error" ? (
        <TriangleAlert className="h-4 w-4 text-red-600" aria-hidden="true" />
      ) : (
        <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
      )}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function formatRelative(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const sec = Math.floor(diffMs / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  if (sec < 45) return "just now";
  if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`;
  return d.toLocaleString();
}

