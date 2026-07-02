"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/bo/BoShell";
import { Card, StatusChip, OccupancyBar, cx } from "@/components/bo/ui";
import { WATCH_PARTIES, hostName, getTitle, getEpisode, type WatchPartyStatus } from "@/lib/bo-data";

type Filter = "all" | "live" | "scheduled" | "ended";
const FILTERS: { key: Filter; label: string; test: (s: WatchPartyStatus) => boolean }[] = [
  { key: "all", label: "All", test: () => true },
  { key: "live", label: "Live", test: (s) => s === "live" || s === "host_away" },
  { key: "scheduled", label: "Scheduled", test: (s) => s === "scheduled" || s === "preshow" || s === "draft" },
  { key: "ended", label: "Ended", test: (s) => s === "ended" || s === "cancelled" },
];

export default function PartiesMonitor() {
  const [filter, setFilter] = useState<Filter>("all");
  const test = FILTERS.find((f) => f.key === filter)!.test;
  const rows = WATCH_PARTIES.filter((p) => test(p.status));

  return (
    <>
      <PageHeader
        title="Watch Parties"
        sub="Live monitor of every scheduled, live and ended room. Open a room to see occupancy, attendees, orders and the end-room control."
      />

      <div className="flex items-center gap-1 bg-surface border border-line rounded-full p-1 w-fit mb-5 text-sm">
        {FILTERS.map((f) => {
          const count = WATCH_PARTIES.filter((p) => f.test(p.status)).length;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cx(
                "px-3.5 py-1.5 rounded-full transition-colors",
                filter === f.key ? "bg-accent text-bg font-medium" : "text-muted hover:text-text"
              )}
            >
              {f.label} <span className="tabular-nums opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <Card className="p-10 text-center text-muted">No watch parties in this view.</Card>
      ) : (
        <div className="grid gap-3">
          {rows.map((p) => {
            const title = getTitle(p.titleId);
            const ep = getEpisode(p.episodeId);
            const live = p.status === "live" || p.status === "host_away";
            return (
              <Link key={p.id} href={`/bo/parties/${p.id}`} className="block">
                <Card className="p-4 hover:border-accent/40 transition-colors">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <StatusChip status={p.status} />
                        <span className="font-medium">{p.name}</span>
                        <span className="font-mono text-[11px] text-muted">{p.id}</span>
                        {p.status === "live" && p.hostCameraLive && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-danger bg-danger/10 border border-danger/30 rounded-full px-2 py-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" aria-hidden="true" />
                            🎥 cam live
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted mt-1.5">
                        {title?.name}
                        {ep ? ` · ${ep.name}` : title?.kind === "series" ? " · episode picked in-room" : ""} · host {hostName(p.hostId)} ·{" "}
                        {new Date(p.scheduledStartAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })} ·{" "}
                        {p.isFree ? "Free" : `${p.ticketPricePopcorn}🍿`}
                      </div>
                    </div>
                    <div className="w-48 shrink-0">
                      {live ? (
                        <OccupancyBar occupancy={p.occupancy} capacity={p.capacity} />
                      ) : (
                        <div className="text-xs text-muted text-right">
                          <span className="tabular-nums text-text">{p.ticketsSold.toLocaleString()}</span> tickets ·{" "}
                          cap {p.capacity.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                  {p.status === "host_away" && (
                    <div className="mt-3 text-xs text-amber-300 bg-amber-400/10 border border-amber-400/30 rounded-md px-3 py-2">
                      ⚠ Host disconnected — playback paused for all viewers.
                    </div>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
