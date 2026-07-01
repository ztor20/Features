"use client";

import { useState } from "react";
import { PageHeader } from "@/components/bo/BoShell";
import { Card, Metric, Btn, Toast, cx } from "@/components/bo/ui";
import { WATCH_PARTIES, analytics, attendedFor, hasStarted, hostName, getTitle, AUDIT_LOG } from "@/lib/bo-data";

export default function Analytics() {
  const a = analytics();
  const [toast, setToast] = useState<string | null>(null);

  const perParty = WATCH_PARTIES.map((p) => ({
    p,
    orders: p.ticketsSold,
    attended: attendedFor(p),
    started: hasStarted(p),
    revenue: p.ticketPricePopcorn * p.ticketsSold,
  }));

  function exportCsv() {
    setToast("Exported watch-party report (mock CSV).");
    setTimeout(() => setToast(null), 2600);
  }

  return (
    <>
      <PageHeader
        title="Analytics"
        sub="Watch-party engagement. Every ticket counts toward the title's total order count (per 6-22). Revenue is tracked here; the actual rev-share split is a future phase."
        actions={<Btn variant="default" onClick={exportCsv}>⬇ Export report</Btn>}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <Metric label="Watch-party orders" value={a.ticketOrders.toLocaleString()} sub="included in total orders" />
        <Metric label="Attendees" value={a.attendees.toLocaleString()} sub="actual (of sold)" />
        <Metric label="Attendance rate" value={`${Math.round(a.attendanceRate * 100)}%`} sub="attended ÷ sold" />
        <Metric label="Chat activity rate" value={`${Math.round(a.chatActivityRate * 100)}%`} sub="of viewers posted" />
        <Metric label="Avg watch time" value={`${a.avgWatchMinutes}m`} sub="per attendee" />
      </div>

      {/* Per-party breakdown */}
      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted mb-3">Per watch party</h2>
      <Card className="overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted bg-surface2/50">
              <th className="px-4 py-2.5 font-medium">Watch party</th>
              <th className="px-4 py-2.5 font-medium">Title · host</th>
              <th className="px-4 py-2.5 font-medium text-right">Orders</th>
              <th className="px-4 py-2.5 font-medium text-right">Attendance</th>
              <th className="px-4 py-2.5 font-medium text-right">POPCORN</th>
            </tr>
          </thead>
          <tbody>
            {perParty.map(({ p, orders, attended, started, revenue }) => (
              <tr key={p.id} className="border-t border-line/70">
                <td className="px-4 py-2.5">{p.name}</td>
                <td className="px-4 py-2.5 text-muted text-xs">{getTitle(p.titleId)?.name} · {hostName(p.hostId)}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">{orders.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">
                  {started ? (
                    <>
                      {attended.toLocaleString()}
                      <span className="text-muted text-xs"> · {Math.round((attended / orders) * 100)}%</span>
                    </>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums">{revenue === 0 ? "—" : `${revenue.toLocaleString()}🍿`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Audit log */}
      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted mb-3">Audit log</h2>
      <Card className="divide-y divide-line/70">
        {AUDIT_LOG.map((e) => (
          <div key={e.id} className="px-4 py-2.5 text-xs flex items-center gap-3 flex-wrap">
            <span className={cx("font-mono", e.action.includes("refund") ? "text-amber-300" : "text-accent")}>{e.action}</span>
            <span className="text-muted">{e.target}</span>
            <span className="text-muted/60 ml-auto">
              {new Date(e.at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })} · {e.actor}
            </span>
          </div>
        ))}
      </Card>

      <Toast msg={toast} />
    </>
  );
}
