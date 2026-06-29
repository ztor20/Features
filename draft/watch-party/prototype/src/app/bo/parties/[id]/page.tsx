"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/bo/BoShell";
import { Card, StatusChip, OrderStatusChip, OccupancyBar, Modal, Btn, Toast } from "@/components/bo/ui";
import {
  getParty,
  ordersForParty,
  hostName,
  getTitle,
  getEpisode,
  type Order,
  type WatchPartyStatus,
} from "@/lib/bo-data";

export default function PartyDetail() {
  const { id } = useParams<{ id: string }>();
  const party = getParty(id);

  if (!party) {
    return (
      <Card className="p-10 text-center text-muted">
        Room <span className="font-mono">{id}</span> not found.{" "}
        <Link href="/bo/parties" className="text-accent">Back to monitor</Link>.
      </Card>
    );
  }

  return <PartyView partyId={id} />;
}

function PartyView({ partyId }: { partyId: string }) {
  const base = getParty(partyId)!;
  const title = getTitle(base.titleId);
  const ep = getEpisode(base.episodeId);

  const [status, setStatus] = useState<WatchPartyStatus>(base.status);
  const [camAllowed, setCamAllowed] = useState(base.hostCameraAllowed);
  const [orders, setOrders] = useState<Order[]>(() => ordersForParty(base));
  const [refundTarget, setRefundTarget] = useState<Order | null>(null);
  const [endOpen, setEndOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [audit, setAudit] = useState<{ action: string; target: string; at: string }[]>([]);

  const live = status === "live" || status === "host_away";
  const ended = status === "ended" || status === "cancelled";
  const camLive = status === "live" && base.hostCameraLive && camAllowed;

  function toggleCamPolicy() {
    const next = !camAllowed;
    setCamAllowed(next);
    logAudit("watch_party.camera_policy", `${base.id} · host camera ${next ? "allowed" : "disabled"}`);
    flash(next ? "Host camera allowed for this party." : "Host camera disabled — the host can't go on camera.");
  }

  const refundedCount = useMemo(() => orders.filter((o) => o.status === "refunded").length, [orders]);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }
  function logAudit(action: string, target: string) {
    setAudit((a) => [{ action, target, at: "just now" }, ...a]);
  }

  function confirmRefund() {
    if (!refundTarget) return;
    setOrders((os) => os.map((o) => (o.id === refundTarget.id ? { ...o, status: "refunded" } : o)));
    logAudit("order.refund", `${refundTarget.id} · ${refundTarget.amountPopcorn}🍿`);
    flash(`Order ${refundTarget.id} refunded — ${refundTarget.amountPopcorn}🍿 credited back to the buyer. Logged.`);
    setRefundTarget(null);
  }

  function confirmEnd() {
    setStatus("ended");
    logAudit("watch_party.end", `${base.id}`);
    flash(`Room ${base.id} ended.`);
    setEndOpen(false);
  }

  return (
    <>
      <PageHeader
        title={base.name}
        sub={`${title?.name ?? base.titleId}${ep ? ` · ${ep.name}` : title?.kind === "series" ? " · episode picked in-room" : ""} · host ${hostName(base.hostId)}`}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/bo/parties">
              <Btn variant="ghost">← Monitor</Btn>
            </Link>
            {live && (
              <Btn variant="danger" onClick={() => setEndOpen(true)}>
                End room
              </Btn>
            )}
          </div>
        }
      />

      <div className="flex items-center gap-2 mb-5">
        <StatusChip status={status} />
        <span className="font-mono text-[11px] text-muted">{base.id}</span>
        <span className="text-xs text-muted">
          · starts {new Date(base.scheduledStartAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
        </span>
      </div>

      {status === "host_away" && (
        <div className="mb-5 text-sm text-amber-300 bg-amber-400/10 border border-amber-400/30 rounded-lg px-4 py-3">
          ⚠ <strong>Host disconnected</strong> — the room is paused for all {base.occupancy.toLocaleString()} viewers because
          only the host controls playback. It resumes when the host reconnects, or you can End the room.
        </div>
      )}
      {status === "ended" && (
        <div className="mb-5 text-sm text-muted bg-surface border border-line rounded-lg px-4 py-3">
          This watch party has ended. <strong className="text-text">No replay</strong> is available — the ticket covered the
          live session only (stated to fans at purchase).
        </div>
      )}

      {/* Stat row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Card className="p-4">
          {live ? (
            <OccupancyBar occupancy={base.occupancy} capacity={base.capacity} />
          ) : (
            <>
              <div className="text-[11px] uppercase tracking-widest text-muted">Capacity</div>
              <div className="text-xl font-semibold mt-1 tabular-nums">
                {base.capacity.toLocaleString()}
              </div>
              <div className="text-xs text-muted mt-1">hard limit</div>
            </>
          )}
        </Card>
        <Card className="p-4">
          <div className="text-[11px] uppercase tracking-widest text-muted">Tickets sold</div>
          <div className="text-xl font-semibold mt-1 tabular-nums">{base.ticketsSold.toLocaleString()}</div>
          <div className="text-xs text-muted mt-1">{base.isFree ? "Free entry" : `${base.ticketPricePopcorn}🍿 each`} · counts as orders</div>
        </Card>
        <Card className="p-4">
          <div className="text-[11px] uppercase tracking-widest text-muted">Refunded</div>
          <div className="text-xl font-semibold mt-1 tabular-nums">{refundedCount}</div>
          <div className="text-xs text-muted mt-1">POPCORN credited back</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-widest text-muted">Host camera</div>
            <button
              type="button"
              role="switch"
              aria-checked={camAllowed}
              onClick={toggleCamPolicy}
              title={camAllowed ? "Disable host camera for this party" : "Allow host camera"}
              className={`relative w-9 h-5 rounded-full transition-colors ${camAllowed ? "bg-accent" : "bg-line"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${camAllowed ? "translate-x-4" : ""}`}
              />
            </button>
          </div>
          <div className="text-lg font-semibold mt-1 flex items-center gap-2">
            {!camAllowed ? (
              <span className="text-muted">Disabled</span>
            ) : camLive ? (
              <span className="inline-flex items-center gap-1.5 text-danger">
                <span className="w-2 h-2 rounded-full bg-danger animate-pulse" aria-hidden="true" />
                Live
              </span>
            ) : (
              <span className="text-text">Off</span>
            )}
          </div>
          <div className="text-xs text-muted mt-1">
            {camAllowed ? "ops policy: allowed · LiveKit broadcast" : "ops policy: host can't go on camera"}
          </div>
        </Card>
      </div>

      {/* Orders / attendees */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">Attendees &amp; orders</h2>
        <span className="text-xs text-muted">showing {orders.length} of {base.ticketsSold.toLocaleString()}</span>
      </div>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted bg-surface2/50">
              <th className="px-4 py-2.5 font-medium">Buyer</th>
              <th className="px-4 py-2.5 font-medium">Order</th>
              <th className="px-4 py-2.5 font-medium">Paid</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-line/70">
                <td className="px-4 py-2.5">{o.buyerName}</td>
                <td className="px-4 py-2.5 font-mono text-[11px] text-muted">{o.id}</td>
                <td className="px-4 py-2.5 tabular-nums">{o.amountPopcorn === 0 ? "Free" : `${o.amountPopcorn}🍿`}</td>
                <td className="px-4 py-2.5"><OrderStatusChip status={o.status} /></td>
                <td className="px-4 py-2.5 text-right">
                  {o.status === "confirmed" && o.amountPopcorn > 0 ? (
                    <button
                      type="button"
                      onClick={() => setRefundTarget(o)}
                      className="text-xs text-muted hover:text-danger border border-line hover:border-danger/40 rounded-md px-2.5 py-1"
                    >
                      Mark refunded
                    </button>
                  ) : (
                    <span className="text-xs text-muted/50">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Local audit trail (this session) */}
      {audit.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted mb-2">Audit (this session)</h2>
          <Card className="divide-y divide-line/70">
            {audit.map((a, i) => (
              <div key={i} className="px-4 py-2.5 text-xs flex items-center gap-3">
                <span className="font-mono text-accent">{a.action}</span>
                <span className="text-muted">{a.target}</span>
                <span className="text-muted/60 ml-auto">{a.at} · by Jeff (ops)</span>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* Refund confirm */}
      <Modal
        open={!!refundTarget}
        onClose={() => setRefundTarget(null)}
        title="Mark order refunded?"
        footer={
          <>
            <Btn variant="ghost" onClick={() => setRefundTarget(null)}>Cancel</Btn>
            <Btn variant="danger" onClick={confirmRefund}>Mark refunded</Btn>
          </>
        }
      >
        <p className="text-sm text-muted leading-relaxed">
          This sets order <span className="font-mono text-text">{refundTarget?.id}</span> ({refundTarget?.amountPopcorn}🍿) to{" "}
          <strong className="text-text">refunded</strong>, credits the <strong className="text-text">{refundTarget?.amountPopcorn}🍿</strong> back to the buyer{" "}
          internally, and writes an audit entry. Refunds are paid in <strong className="text-text">POPCORN only — never cash/Stripe</strong> (6-28 decision).
        </p>
      </Modal>

      {/* End room confirm */}
      <Modal
        open={endOpen}
        onClose={() => setEndOpen(false)}
        title="End this room?"
        footer={
          <>
            <Btn variant="ghost" onClick={() => setEndOpen(false)}>Keep live</Btn>
            <Btn variant="danger" onClick={confirmEnd}>End room now</Btn>
          </>
        }
      >
        <p className="text-sm text-muted leading-relaxed">
          Ending <span className="font-mono text-text">{base.id}</span> stops playback for all{" "}
          {base.occupancy.toLocaleString()} viewers and closes the room. There is no replay. This is logged to the audit trail.
        </p>
      </Modal>

      <Toast msg={toast} />
    </>
  );
}
