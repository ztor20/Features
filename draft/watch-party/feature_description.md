# Watch Party

> Migrated into `Features/` following the handbook convention (2026-06-26). Full hosted BRD: https://ztor-watchparty.vercel.app/brd

**Surface(s):** Frontend + Back Office (multi-surface)
**Status:** draft — BO prototype shipped; **FE prototype pending designer**

## Owners
> One Feature Owner per feature. (Replace the placeholders with real names.)
- Feature Owner: `<BA>` — owns this doc, the BRD, the diagram
- FE prototype: `<designer>` — the host/fan synced-watch front end (`FE/`)
- BO prototype: `<BA>` — the ops monitor / grant / analytics back office (`BO/`)

## What
Synced live co-watching — a host streams a film or episode and fans watch **together in real time** with live chat. Launches for the **F《我要衝線》 premiere on Aug 4** (web promo).

## Why
Today there's no way for ops to control **who** hosts or **what** they stream — open self-serve hosting would leak licensed content — and no monitor/analytics for live rooms. This feature adds the ops controls (host grants, content pool, capacity, live monitor, analytics) while hosts self-serve the room (name / time / price) on the front end.

## Success looks like
- Only ops-granted accounts can host, only on ops-assigned titles/episodes.
- Rooms never oversell past capacity; ticket purchases are idempotent (no double charge).
- Every watch-party ticket counts as an **Order**; ops can monitor live occupancy and end a room.
- The F《我要衝線》 premiere runs on web Aug 4 with synced playback + live chat.

## Surfaces
- **FE** (`FE/`) — host creates/controls a grant-gated room; fans buy a ticket and watch in sync; in-room episode pick. Uses `Frontend-Design-System`. *(pending designer)*
- **BO** (`BO/`) — grant hosts, assign content (title + episode), set capacity, monitor live rooms, analytics, manual refund. Uses `Creator-Studio-Design-System`. *(prototype shipped → /bo)*

## Links (existing build)
- BO prototype: https://ztor-watchparty.vercel.app/bo
- Watch-party site (FE): https://ztor-watchparty.vercel.app
- Hosted BRD (full spine + surfaces): https://ztor-watchparty.vercel.app/brd
- Solution diagram: https://ztor-watchparty.vercel.app/solution-architecture.html

## Key dates
- **End of July** — internal test build · **Aug 4** — F《我要衝線》 promo launch (web)

## Open decision (needs owner)
- Watch-party **revenue split** (platform / tastemaker / creator / backer) → future phase. **Owner: Susan (Finance).** Stats are tracked now; the split isn't computed in v1. Doesn't block launch.
