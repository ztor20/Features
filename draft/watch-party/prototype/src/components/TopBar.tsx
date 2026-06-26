"use client";

// Trimmed from the crowdfund proto's TopBar — EN-only, no search backend.
export function TopBar({ onOpenMobileNav }: { onOpenMobileNav?: () => void }) {
  return (
    <header
      className="sticky top-0 z-30 bg-bg/90 backdrop-blur border-b border-line px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-6"
      style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
    >
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open menu"
        className="lg:hidden -ml-1 w-10 h-10 rounded-md flex items-center justify-center text-text hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="lg:hidden text-xl font-semibold whitespace-nowrap">
        ztor<span className="text-accent">.</span>
        <span className="text-[10px] ml-1 align-top text-muted">WATCH PARTY</span>
      </div>

      <div className="hidden lg:flex items-center gap-2 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" aria-hidden="true" />
          Realtime watch party · synced playback, live comments
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="flex items-center gap-2 bg-surface rounded-full px-2.5 sm:px-3 py-1.5 text-sm">
          <span className="text-accent">🍿</span>
          <span className="tabular-nums">20</span>
        </div>
        <div
          className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accentLight"
          aria-hidden="true"
        />
      </div>
    </header>
  );
}
