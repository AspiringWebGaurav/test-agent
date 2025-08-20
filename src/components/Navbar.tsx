"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";
import SyncButton from "./SyncButton";

export type NavItem = { href: string; label: string };

export default function Navbar({
  items = [
    { href: "/", label: "Dashboard" },
    { href: "/notes", label: "Notes" },
    { href: "/todos", label: "Todos" },
    { href: "/money", label: "Money" },
    { href: "/templates", label: "Templates" },
  ],
}: {
  items?: NavItem[];
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function doSync() {
    await new Promise((r) => setTimeout(r, 1500));
  }

  return (
    <header
      role="banner"
      className={[
        "sticky top-0 z-40 supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-950/60",
        "bg-white dark:bg-gray-950 border-b border-gray-200/80 dark:border-gray-800/80",
        scrolled ? "shadow-sm" : "",
      ].join(" ")}
    >
      <div className="mx-auto max-w-7xl h-14 px-4 md:px-6 flex items-center gap-3">
        {/* Left: hamburger + logo + primary nav */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden inline-flex items-center justify-center size-9 rounded-lg border"
            aria-label="Open menu"
            aria-controls="mobile-drawer"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          <Link href="/" className="font-semibold" aria-label="Home">
            Avelina
          </Link>

          <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
            {items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                aria-current={pathname === it.href ? "page" : undefined}
                className={[
                  "px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-900",
                  pathname === it.href ? "font-medium bg-gray-100 dark:bg-gray-900" : "",
                ].join(" ")}
              >
                {it.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: search, sync, notifications, user */}
        <div className="ml-auto flex items-center gap-2">
          <button
            className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm border md:w-64 justify-start"
            onClick={() => {}}
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
            <span className="text-gray-500">Search…</span>
            <kbd className="ml-auto text-xs text-gray-500">⌘K</kbd>
          </button>
          <button
            className="md:hidden size-9 rounded-lg border inline-flex items-center justify-center"
            aria-label="Search"
            onClick={() => {}}
          >
            <Search className="h-5 w-5" />
          </button>

          <SyncButton doSync={doSync} lastSynced={null} />

          <button
            className="size-9 rounded-lg border inline-flex items-center justify-center"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>

          <button
            className="size-9 rounded-full overflow-hidden border"
            aria-haspopup="menu"
            aria-label="Account menu"
          />
        </div>
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div role="dialog" aria-modal="true" className="md:hidden fixed inset-0 z-50">
          <button
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          />
          <div
            id="mobile-drawer"
            className="absolute left-0 top-0 h-full w-80 bg-white dark:bg-gray-950 p-4 shadow-xl"
          >
            <nav className="grid gap-1 mt-4">
              {items.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={() => setDrawerOpen(false)}
                  className={[
                    "px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-900",
                    pathname === it.href ? "font-medium bg-gray-100 dark:bg-gray-900" : "",
                  ].join(" ")}
                >
                  {it.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

