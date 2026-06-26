"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Trimmed from the crowdfund proto's Sidebar — EN-only, watch-party nav.
const NAV = [
  { icon: "🎬", label: "Watch Party", href: "/", match: "/" },
];

type Density = "desktop" | "drawer";

function NavContents({
  pathname,
  density,
  onLinkClick,
}: {
  pathname: string;
  density: Density;
  onLinkClick?: () => void;
}) {
  const navRowPad = density === "drawer" ? "py-2.5" : "py-2";

  return (
    <>
      <nav aria-label="Main" className="px-2 space-y-1 text-sm">
        {NAV.map((n) => {
          const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.match);
          return (
            <Link
              key={n.label}
              href={n.href}
              onClick={onLinkClick}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 px-3 ${navRowPad} rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                active ? "bg-surface text-text" : "text-muted hover:text-text hover:bg-surface/60"
              }`}
            >
              <span className="w-5 text-center text-xs opacity-70">{n.icon}</span>
              <span>{n.label}</span>
            </Link>
          );
        })}
      </nav>

      <nav aria-label="Resources" className="px-2 mt-1 text-sm">
        <Link
          href="/bo"
          onClick={onLinkClick}
          className={`flex items-center gap-3 px-3 ${navRowPad} rounded-md text-muted hover:text-text hover:bg-surface/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
        >
          <span className="w-5 text-center text-xs opacity-70">⚙</span>
          <span>Back office</span>
        </Link>
        <a
          href="/solution-architecture.html"
          onClick={onLinkClick}
          className={`flex items-center gap-3 px-3 ${navRowPad} rounded-md text-muted hover:text-text hover:bg-surface/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
        >
          <span className="w-5 text-center text-xs opacity-70">🎥</span>
          <span>Solution diagram</span>
        </a>
        <Link
          href="/brd"
          onClick={onLinkClick}
          className={`flex items-center gap-3 px-3 ${navRowPad} rounded-md text-muted hover:text-text hover:bg-surface/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
        >
          <span className="w-5 text-center text-xs opacity-70">📄</span>
          <span>BRD v2</span>
        </Link>
      </nav>

      <div className="mt-auto px-4 py-4 border-t border-line">
        <div className="text-[10px] text-muted uppercase tracking-widest mb-2">
          About
        </div>
        <p className="text-xs text-muted/80 leading-relaxed">
          Host a private room, share the link, and watch together in sync — with
          live comments and presence.
        </p>
      </div>
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname() ?? "";

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-line bg-bg sticky top-0 h-screen overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="p-4">
        <Link href="/" className="flex items-center text-2xl font-semibold">
          ztor<span className="text-accent">.</span>
          <span className="text-[10px] ml-1 align-top text-muted tracking-widest">
            WATCH PARTY
          </span>
        </Link>
      </div>
      <NavContents pathname={pathname} density="desktop" />
    </aside>
  );
}

export function MobileNavDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname() ?? "";
  const panelRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Capture the previously focused element so we can restore focus on close.
  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement | null;
      const first = panelRef.current?.querySelector<HTMLElement>(
        "button, [href], input, [tabindex]:not([tabindex='-1'])"
      );
      first?.focus();
    } else if (triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [open]);

  // ESC to close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Body scroll lock — position:fixed pattern preserves scroll position on iOS.
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const body = document.body;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  // Focus trap — keep Tab cycling inside the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const root = panelRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll<HTMLElement>(
        "button, [href], input, [tabindex]:not([tabindex='-1'])"
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div
      className={`lg:hidden fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 transition-opacity motion-safe:duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        className={`absolute left-0 top-0 h-full w-[82vw] max-w-[300px] bg-bg border-r border-line flex flex-col overflow-y-auto transform transition-transform motion-safe:duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ paddingLeft: "env(safe-area-inset-left)" }}
      >
        <div className="flex items-center justify-between p-4 border-b border-line">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center text-2xl font-semibold"
          >
            ztor<span className="text-accent">.</span>
            <span className="text-[10px] ml-1 align-top text-muted tracking-widest">
              WATCH PARTY
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="w-9 h-9 rounded-md hover:bg-surface flex items-center justify-center text-muted hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            ✕
          </button>
        </div>
        <NavContents pathname={pathname} density="drawer" onLinkClick={onClose} />
      </aside>
    </div>
  );
}
