# Watch Party

> Migrated into `Features/` following the handbook convention (2026-06-26). Full hosted BRD: https://ztor-watchparty.vercel.app/brd
> **The full clickable prototype + the complete BRD now live in [`prototype/`](./prototype/)** (Next.js source, mirrored from the personal repo). BRD markdown: [`prototype/_docs/BRD/watch-party/`](./prototype/_docs/BRD/watch-party/) — dev BRD, the lean **business overview** (`Biz.md`), bilingual **email templates**, BO + Frontend surfaces, shared contract.

**Surface(s):** Frontend + Back Office (multi-surface)
**Status:** draft (v4) — BO built & deployed; **FE now owned by the design team** (see 6-28 update)
**Update (2026-06-28, IT dev sync):** BO refinements applied — **single capacity limit** (advertised/server dual-number dropped), **POPCORN refund** (BO refund button credits POPCORN back internally; never cash/Stripe), Host account mgmt + WP stats confirmed in prototype, WP revenue tracked separately from the creator Financial Overview for July. **Realtime tech = LiveKit** (demo at https://stagingdev.ztor.ai/live-demo; AWS IVS/Twitch dropped for launch). **Front-end is now the designer's build → https://ztor-2-0-f2e.vercel.app/** — this prototype keeps the BO (`/bo`) + the realtime sync-engine demo. Full audit-log spec **deferred to the following release**. Decision record: `ztor-docs/decisions/2026-06-28-watch-party-bo-changes.md`.
**Update (2026-06-26):** v3 adds **host camera** (host-only PiP broadcast; Ably unchanged for sync/chat/presence). Architecture brief: https://aic-output.vercel.app/ztor/ztor-watchparty-host-camera-2026-06-26.html · business overview: https://ztor-watchparty.vercel.app/overview

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
- **FE** (`FE/`) — host creates/controls a grant-gated room; fans buy a ticket and watch in sync; in-room episode pick. Uses `Frontend-Design-System`. *(now built by the design team → https://ztor-2-0-f2e.vercel.app/)*
- **BO** (`BO/`) — grant hosts, assign content (title + episode), set single capacity, monitor live rooms, analytics, POPCORN refund. Uses `Creator-Studio-Design-System`. *(prototype shipped → /bo)*

## Links (existing build)
- BO prototype: https://ztor-watchparty.vercel.app/bo
- Front-end (designer's build): https://ztor-2-0-f2e.vercel.app/
- Sync-engine demo (this prototype): https://ztor-watchparty.vercel.app
- Hosted BRD (full spine + surfaces): https://ztor-watchparty.vercel.app/brd
- Solution diagram: https://ztor-watchparty.vercel.app/solution-architecture.html

## Key dates
- **End of July** — internal test build · **Aug 4** — F《我要衝線》 promo launch (web)

## Open decision (needs owner)
- Watch-party **revenue split** (platform / tastemaker / creator / backer) → future phase. **Owner: Susan (Finance).** Stats are tracked now; the split isn't computed in v1. Doesn't block launch.
