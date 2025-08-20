import Link from "next/link";
import { NavRoute, SyncButtonProps } from "./types";
import NavPrimary from "./NavPrimary";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import SyncButton from "./SyncButton";
import { usePathname } from "next/navigation";

export interface EnterpriseNavbarProps {
  routes: NavRoute[];
  workspaceName: string;
  onOpenSwitcher?: () => void;
  user: { name: string; avatarUrl?: string };
  notificationsCount?: number;
  sync: Omit<SyncButtonProps, "initialState"> & { initialState?: SyncButtonProps["initialState"] };
}

export function EnterpriseNavbar({
  routes,
  workspaceName,
  onOpenSwitcher,
  user,
  notificationsCount,
  sync,
}: EnterpriseNavbarProps) {
  const pathname = usePathname() || "/";
  const activeRoutes = routes.map((r) => ({
    ...r,
    isActive: r.isActive ?? pathname.startsWith(r.href),
  }));

  return (
    <nav
      role="navigation"
      aria-label="Global"
      className="sticky top-0 z-50 flex w-full items-center justify-between border-b bg-white px-4 py-2"
    >
      <div className="flex items-center gap-4">
        <Link href="/" className="text-xl" aria-label="Home">
          📝
        </Link>
        <WorkspaceSwitcher name={workspaceName} onOpen={onOpenSwitcher} />
      </div>
      <div className="hidden md:block">
        <NavPrimary routes={activeRoutes} />
      </div>
      <div className="flex items-center gap-3">
        <SyncButton {...sync} />
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-md p-1 hover:bg-gray-100"
        >
          <span role="img" aria-label="bell">
            🔔
          </span>
          {notificationsCount ? (
            <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1 text-[10px] text-white">
              {notificationsCount}
            </span>
          ) : null}
        </button>
        <button
          type="button"
          aria-label="User menu"
          className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-100"
        >
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatarUrl} alt="" className="h-6 w-6 rounded-full" />
          ) : (
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-sm">
              {user.name[0]}
            </span>
          )}
          <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
        </button>
      </div>
    </nav>
  );
}

export default EnterpriseNavbar;
