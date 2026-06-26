"use client";

/** Small UI primitives for the Watch Party back office. Brand tokens from globals.css. */

import { useEffect } from "react";
import type { WatchPartyStatus, OrderStatus } from "@/lib/bo-data";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

const STATUS_STYLE: Record<WatchPartyStatus, { cls: string; label: string; pulse?: boolean }> = {
  draft: { cls: "text-muted bg-surface2 border-line", label: "Draft" },
  scheduled: { cls: "text-sky-300 bg-sky-400/10 border-sky-400/30", label: "Scheduled" },
  preshow: { cls: "text-accentLight bg-accent/10 border-accent/30", label: "Pre-show" },
  live: { cls: "text-danger bg-danger/10 border-danger/30", label: "Live", pulse: true },
  host_away: { cls: "text-amber-300 bg-amber-400/10 border-amber-400/30", label: "Host away", pulse: true },
  ended: { cls: "text-muted bg-surface2 border-line", label: "Ended" },
  cancelled: { cls: "text-muted bg-surface2 border-line line-through", label: "Cancelled" },
};

export function StatusChip({ status }: { status: WatchPartyStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span className={cx("inline-flex items-center gap-1.5 text-[11px] font-medium rounded-full px-2.5 py-1 border", s.cls)}>
      {s.pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" aria-hidden />}
      {s.label}
    </span>
  );
}

export function OrderStatusChip({ status }: { status: OrderStatus }) {
  return status === "refunded" ? (
    <span className="inline-flex text-[11px] font-medium rounded-full px-2 py-0.5 border text-amber-300 bg-amber-400/10 border-amber-400/30">
      Refunded
    </span>
  ) : (
    <span className="inline-flex text-[11px] font-medium rounded-full px-2 py-0.5 border text-success bg-success/10 border-success/30">
      Confirmed
    </span>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("bg-surface border border-line rounded-xl", className)}>{children}</div>;
}

export function Metric({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <Card className="p-4">
      <div className="text-[11px] uppercase tracking-widest text-muted">{label}</div>
      <div className="text-2xl font-semibold mt-1 tabular-nums">{value}</div>
      {sub && <div className="text-xs text-muted mt-1">{sub}</div>}
    </Card>
  );
}

export function OccupancyBar({ occupancy, capacity }: { occupancy: number; capacity: number }) {
  const pct = Math.min(100, Math.round((occupancy / Math.max(capacity, 1)) * 100));
  const full = occupancy >= capacity;
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-muted">Occupancy</span>
        <span className={cx("tabular-nums", full ? "text-danger font-semibold" : "text-text")}>
          {occupancy.toLocaleString()} / {capacity.toLocaleString()} {full && "· FULL"}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-surface2 overflow-hidden">
        <div className={cx("h-full rounded-full", full ? "bg-danger" : "bg-accent")} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cx(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        on ? "bg-accent" : "bg-surface2 border border-line"
      )}
    >
      <span className={cx("inline-block h-4 w-4 rounded-full bg-bg transition-transform", on ? "translate-x-6" : "translate-x-1")} />
    </button>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface border border-line rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h2 className="font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-md text-muted hover:text-text hover:bg-surface2 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">{children}</div>
        {footer && <div className="px-5 py-4 border-t border-line flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function Btn({
  children,
  onClick,
  variant = "default",
  disabled,
  type = "button",
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "default" | "danger" | "ghost";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-40 disabled:cursor-not-allowed";
  const styles = {
    primary: "bg-accent text-bg hover:bg-accentLight",
    default: "border border-line text-text hover:bg-surface2",
    danger: "border border-danger/40 text-danger hover:bg-danger/10",
    ghost: "text-muted hover:text-text hover:bg-surface2",
  }[variant];
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cx(base, styles, className)}>
      {children}
    </button>
  );
}

export function Toast({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-surface2 border border-line rounded-lg px-4 py-2.5 text-sm shadow-xl flex items-center gap-2">
      <span className="text-success">✓</span>
      {msg}
    </div>
  );
}
