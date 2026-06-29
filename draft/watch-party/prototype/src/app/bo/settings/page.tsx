"use client";

import { useState } from "react";
import { PageHeader } from "@/components/bo/BoShell";
import { Card, Btn, Toast } from "@/components/bo/ui";

const EMAILS = [
  { type: "party_created", who: "Host", when: "on room creation" },
  { type: "ticket_purchased", who: "Buyer", when: "on ticket purchase" },
  { type: "party_reminder", who: "Buyer", when: "before start time" },
];

export default function Settings() {
  const [capacity, setCapacity] = useState(1000);
  const [toast, setToast] = useState<string | null>(null);

  function save() {
    setToast(`Default capacity saved — ${capacity.toLocaleString()}.`);
    setTimeout(() => setToast(null), 2600);
  }

  return (
    <>
      <PageHeader title="Settings" sub="Default room capacity, fan-facing policy, and notifications for watch parties." />

      {/* Capacity */}
      <Card className="p-5 mb-6">
        <h2 className="font-semibold mb-1">Room capacity</h2>
        <p className="text-sm text-muted mb-4">
          A single hard limit that gates admission (per-party override available on each room). The 6-28 dev sync
          dropped the separate advertised/server dual-number — there is now <em>one</em> capacity value.
        </p>
        <div className="max-w-xs">
          <label className="block text-xs text-muted mb-1.5">Default capacity (hard limit)</label>
          <input
            type="number"
            value={capacity}
            min={1}
            onChange={(e) => setCapacity(Math.max(1, Number(e.target.value) || 0))}
            className="w-full bg-bg border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent tabular-nums"
          />
          <p className="text-[11px] text-muted mt-1">One number — used for both display and admission.</p>
        </div>
        <div className="mt-4">
          <Btn variant="primary" onClick={save}>Save defaults</Btn>
        </div>
      </Card>

      {/* Policy */}
      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted mb-3">Fan-facing policy</h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <Card className="p-4">
          <div className="font-medium text-sm">No replay</div>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            The ticket covers the live session only — no rewind/VOD (current tech limit). Stated to fans before purchase.
          </p>
        </Card>
        <Card className="p-4">
          <div className="font-medium text-sm">Refund in POPCORN</div>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Tickets are bought with POPCORN, so refunds return POPCORN — never cash/Stripe. The BO refund button
            records the refund (audited) and credits the POPCORN back to the buyer internally (6-28 decision).
          </p>
        </Card>
      </div>

      {/* Notifications */}
      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted mb-3">Email notifications</h2>
      <Card className="overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted bg-surface2/50">
              <th className="px-4 py-2.5 font-medium">Type</th>
              <th className="px-4 py-2.5 font-medium">Recipient</th>
              <th className="px-4 py-2.5 font-medium">Trigger</th>
            </tr>
          </thead>
          <tbody>
            {EMAILS.map((e) => (
              <tr key={e.type} className="border-t border-line/70">
                <td className="px-4 py-2.5 font-mono text-xs text-accent">{e.type}</td>
                <td className="px-4 py-2.5">{e.who}</td>
                <td className="px-4 py-2.5 text-muted text-xs">{e.when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Deferred policy — NEEDS-POLICY-OWNER */}
      <div className="border border-amber-400/30 bg-amber-400/5 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-amber-300">⏳</span>
          <h2 className="font-semibold text-amber-200">Pending policy decision — revenue share</h2>
        </div>
        <p className="text-sm text-muted leading-relaxed">
          We <strong className="text-text">track the stats now</strong> (POPCORN revenue, orders, attendees on the Analytics page) — but the
          actual revenue <strong className="text-text">split</strong> (platform / tastemaker / creator / backer) is a <strong className="text-text">future phase</strong>,
          deferred at the 2026-06-22 meeting (&ldquo;抽成、不同定價邏輯…未來再加&rdquo;). Owner to define the split: <strong className="text-text">Susan (Finance)</strong>. Doesn&rsquo;t block launch.
        </p>
      </div>

      <Toast msg={toast} />
    </>
  );
}
