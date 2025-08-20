"use client";

import { EnterpriseNavbar, NavRoute } from "@/components/enterprise-navbar";
import { useAuth } from "@/hooks/useAuth";
import { useSyncStatus } from "./SyncStatusProvider";

const ROUTES: NavRoute[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard" },
  { id: "notes", label: "Notes", href: "/dashboard/notes" },
  { id: "todos", label: "Todos", href: "/dashboard/todos" },
  { id: "money", label: "Money", href: "/dashboard/money" },
  { id: "templates", label: "Templates", href: "/dashboard/templates" },
];

export default function GlobalNavbar() {
  const { user } = useAuth();
  const { syncStatus, updateLastSyncTime } = useSyncStatus();

  if (!user) return null;

  return (
    <EnterpriseNavbar
      routes={ROUTES}
      workspaceName="Gaurav’s Personal Notes (GPN)"
      user={{
        name: user.displayName || "User",
        avatarUrl: user.photoURL || undefined,
      }}
      notificationsCount={0}
      sync={{
        lastSyncedAt: syncStatus.lastSyncTime,
        onSync: async () => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          updateLastSyncTime();
        },
      }}
    />
  );
}

