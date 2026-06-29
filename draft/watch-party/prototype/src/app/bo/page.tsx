"use client";

import Link from "next/link";
import { PageHeader } from "@/components/bo/BoShell";
import { Card, Metric, StatusChip, OccupancyBar } from "@/components/bo/ui";
import { WATCH_PARTIES, analytics, hostName, getTitle, getEpisode } from "@/lib/bo-data";

const ORDER: Record<string, number> = { live: 0, host_away: 1, preshow: 2, scheduled: 3, draft: 4, ended: 5, cancelled: 6 };

export default function Overview() {
  const a = analytics();
  const parties = [...WATCH_PARTIES].sort((x, y) => ORDER[x.status] - ORDER[y.status]);

  return (
    <>
      <PageHeader
        title="Overview"
        sub="Watch Party operations at a glance — who's live, tickets sold, and how watch-party orders are tracking ahead of the Aug 4 F《我要衝線》 promo."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <Metric label="Live now" value={a.liveNow} sub="rooms streaming" />
        <Metric label="Watch-party orders" value={a.ticketOrders.toLocaleString()} sub="counts toward total orders" />
        <Metric label="Attendees" value={a.attendees.toLocaleString()} sub="across all parties" />
        <Metric label="POPCORN revenue" value={`${a.popcornRevenue.toLocaleString()} 🍿`} sub="paid tickets (pre rev-share)" />
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">Watch parties</h2>
        <Link href="/bo/parties" className="text-xs text-accent hover:text-accentLight">
          Open monitor →
        </Link>
      </div>

      {parties.length === 0 ? (
        <Card className="p-10 text-center text-muted">
          No watch parties yet — <Link href="/bo/hosts" className="text-accent">grant a host</Link> to begin.
        </Card>
      ) : (
        <div className="grid gap-3">
          {parties.map((p) => {
            const title = getTitle(p.titleId);
            const ep = getEpisode(p.episodeId);
            const live = p.status === "live" || p.status === "host_away";
            return (
              <Link key={p.id} href={`/bo/parties/${p.id}`} className="block group">
                <Card className="p-4 hover:border-accent/40 transition-colors">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <StatusChip status={p.status} />
                        <span className="font-medium truncate">{p.name}</span>
                      </div>
                      <div className="text-xs text-muted mt-1.5">
                        {title?.name}
                        {ep ? ` · ${ep.name}` : title?.kind === "series" && p.status === "scheduled" ? " · episode picked in-room" : ""} · host {hostName(p.hostId)} ·{" "}
                        {p.isFree ? "Free" : `${p.ticketPricePopcorn}🍿`}
                      </div>
                    </div>
                    <div className="w-44 shrink-0">
                      {live ? (
                        <OccupancyBar occupancy={p.occupancy} capacity={p.capacity} />
                      ) : (
                        <div className="text-xs text-muted text-right">
                          <span className="tabular-nums text-text">{p.ticketsSold.toLocaleString()}</span> tickets sold
                          <div className="text-[11px] mt-0.5">cap {p.capacity.toLocaleString()}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
