import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export type SyncState = "idle" | "syncing" | "success" | "error" | "disabled";

export interface SyncButtonProps {
  lastSyncedAt?: Date | null;
  onSync: () => Promise<void> | void;
  onSyncStart?: () => void;
  onSyncSuccess?: (ts: Date) => void;
  onSyncError?: (err: unknown) => void;
  onSyncCancel?: () => void;
  disabled?: boolean;
  initialState?: SyncState;
}

function formatRelative(date?: Date | null) {
  if (!date) return "Never";
  const diff = Date.now() - date.getTime();
  const min = Math.round(diff / 1000 / 60);
  if (min < 1) return "Just now";
  return `${min}m ago`;
}

export function SyncButton({
  lastSyncedAt,
  onSync,
  onSyncStart,
  onSyncSuccess,
  onSyncError,
  onSyncCancel,
  disabled,
  initialState = "idle",
}: SyncButtonProps) {
  const [state, setState] = useState<SyncState>(initialState);
  const [syncTime, setSyncTime] = useState<Date | null>(lastSyncedAt || null);

  const handleSync = useCallback(async () => {
    if (state === "syncing" || state === "disabled" || disabled) return;
    try {
      onSyncStart?.();
      setState("syncing");
      await onSync?.();
      const ts = new Date();
      setSyncTime(ts);
      setState("success");
      setTimeout(() => setState("idle"), 800);
      onSyncSuccess?.(ts);
    } catch (err) {
      setState("error");
      onSyncError?.(err);
    }
  }, [state, disabled, onSync, onSyncStart, onSyncSuccess, onSyncError]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSync();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSync]);

  const label = state === "idle" && syncTime
    ? `Synced • ${formatRelative(syncTime)}`
    : state === "idle"
    ? "Synced"
    : state === "syncing"
    ? "Syncing…"
    : state === "success"
    ? "Synced"
    : state === "error"
    ? "Sync failed"
    : "Sync";

  return (
    <button
      type="button"
      onClick={handleSync}
      aria-live="polite"
      aria-busy={state === "syncing"}
      disabled={state === "disabled" || disabled}
      className={cn(
        "relative inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm font-medium",
        state === "error" && "border-red-500 text-red-700",
        state === "success" && "border-green-500 text-green-700",
        state === "syncing" && "opacity-70 cursor-not-allowed",
      )}
    >
      {state === "syncing" && (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {state === "success" && (
        <svg
          className="h-4 w-4 text-green-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {state === "error" && (
        <svg
          className="h-4 w-4 text-red-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path
            d="M12 9v4m0 4h.01M5.22 5.22l13.56 13.56"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <span>{label}</span>
    </button>
  );
}

export default SyncButton;
