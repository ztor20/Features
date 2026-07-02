"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "./ui";

const NAV = [
  { label: "Overview", href: "/bo", icon: "▦", match: (p: string) => p === "/bo" },
  { label: "Watch Parties", href: "/bo/parties", icon: "▶", match: (p: string) => p.startsWith("/bo/parties") },
  { label: "Hosts & Content", href: "/bo/hosts", icon: "✦", match: (p: string) => p.startsWith("/bo/hosts") },
  { label: "Analytics", href: "/bo/analytics", icon: "◔", match: (p: string) => p.startsWith("/bo/analytics") },
  { label: "Settings", href: "/bo/settings", icon: "⚙", match: (p: string) => p.startsWith("/bo/settings") },
];

export function BoShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  return (
    <div className="min-h-screen flex bg-bg text-text">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-line bg-bg sticky top-0 h-screen">
        <div className="p-4 border-b border-line">
          <div className="flex items-center text-xl font-semibold">
            ztor<span className="text-accent">.</span>
            <span className="text-[10px] ml-1.5 align-top text-muted tracking-widest">BACK OFFICE</span>
          </div>
          <div className="text-[11px] text-muted mt-1">Watch Party config</div>
        </div>

        <nav aria-label="Back office" className="px-2 py-3 space-y-1 text-sm">
          {NAV.map((n) => {
            const active = n.match(pathname);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "flex items-center gap-3 px-3 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  active ? "bg-surface text-text" : "text-muted hover:text-text hover:bg-surface/60"
                )}
              >
                <span className="w-4 text-center text-xs opacity-70">{n.icon}</span>
                <span>{n.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-line space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-muted hover:text-text"
          >
            ← Watch Party site
          </Link>
          <a
            href="/solution-architecture.html"
            className="flex items-center gap-2 text-xs text-muted hover:text-text"
          >
            🎥 Solution diagram
          </a>
          <Link href="/brd" className="flex items-center gap-2 text-xs text-muted hover:text-text">
            📄 BRD v2
          </Link>
          <p className="text-[10px] text-muted/70 leading-relaxed pt-1">
            Prototype · mock data. Config + live monitor + analytics for the F《我要衝線》 premiere.
          </p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur border-b border-line px-4 sm:px-6 py-3 flex items-center gap-3">
          <div className="md:hidden text-lg font-semibold">
            ztor<span className="text-accent">.</span>
            <span className="text-[10px] ml-1 text-muted">BO</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" aria-hidden /> Internal · ops only
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-muted">Ops admin</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accentLight" aria-hidden />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, sub, actions }: { title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {sub && <p className="text-sm text-muted mt-1 max-w-2xl">{sub}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

