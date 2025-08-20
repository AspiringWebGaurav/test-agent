import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavRoute } from "./types";
import { cn } from "@/lib/utils";

interface NavPrimaryProps {
  routes: NavRoute[];
}

export function NavPrimary({ routes }: NavPrimaryProps) {
  const pathname = usePathname() || "/";
  return (
    <ul className="flex items-center gap-2" role="menubar">
      {routes
        .filter((r) => !r.hidden)
        .map((r) => {
          const active =
            typeof r.isActive === "boolean"
              ? r.isActive
              : pathname.startsWith(r.href);
          return (
            <li key={r.id} role="none">
              <Link
                href={r.href}
                role="menuitem"
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                {r.label}
              </Link>
            </li>
          );
        })}
    </ul>
  );
}

export default NavPrimary;
