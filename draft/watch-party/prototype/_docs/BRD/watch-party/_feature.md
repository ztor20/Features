# Ztor Watch Party

> **Spine.** Written once; every surface file references it. Source of truth for the data contract.
> **Sources:** 2026-06-22 Ztor dev sync-up · 2026-06-22 Ztor IT regular meeting · 2026-06-25 #ztor host-camera architecture thread · prior Watch Party BRD v1 (2026-06-07) · solution architecture diagram.
> **Status:** v3 (adds host camera broadcast to v2). **Date:** 2026-06-26.

> **What v3 adds.** The biz team wants the **host to stream their own camera** alongside the movie (a "watch-along" face-cam). Settled 2026-06-25: it is a **host-only broadcast** carried on a **separate live-media layer** — Ably stays sync/chat/presence only (it never carries video). See the host-camera rows in the data contract, gap engine, and surface specs below.

## Goal
- **Problem** (≤50 words): Ztor wants to launch synced co-watching for the F《我要衝線》 premiere (Aug 4 promo), but there is no way for ops to control **who** may host a watch party or **what** they may stream — and no monitor/analytics for live rooms. Open self-serve hosting would leak licensed content.
- **Solution** (≤50 words): A back office where ops grants specific accounts the right to host, assigns each host a pool of titles/episodes they may stream, sets room capacity, monitors scheduled/live rooms, and reads watch-party order + engagement analytics. Hosts self-serve the room (name/time/price) on the front end.
- **Deliverables:**
  1. **BO** — Watch Party configuration + live monitor + analytics (the prototyped primary surface).
  2. **Frontend** — host creates/controls a room (gated by grant); fans buy a ticket and watch in sync.
  3. Updated solution architecture diagram + this BRD (md + Notion).

## With vs Without
| Time | WITHOUT this feature | WITH this feature |
|---|---|---|
| Aug 4 premiere | Any user could spin up a "watch party" on any title → licensed content (F-series, imported films) leaks; ops can't see or stop a live room | Only Gary's account (ops-granted) can host, only on F《我要衝線》 ep 1–3 (ops-assigned); ops watches occupancy vs the 1,000 cap and can end a room |
| Reporting | Watch-party views invisible to the order count; co-watching value unprovable | Every watch-party ticket counts as an Order; analytics shows attendees, chat activity, avg watch time |

## Core scenario (told ONCE, across surfaces)
- **Given** ops has granted Gary's account the **host** capability and assigned it **F《我要衝線》 ep 1–3** with a room capacity of 1,000,
- **When** Gary (Frontend, host mode) creates a room — names it, sets a start time and a POPCORN ticket price (or free) — shares the link; fans buy a ticket and arrive; at start Gary goes live, picks ep 1 from his assigned pool (and may switch to ep 2 mid-session), and **turns his camera on** so fans see his reactions in a picture-in-picture tile; a fan double-taps Pay; the room fills to cap; Gary briefly disconnects,
- **Then** the system: blocks any non-granted account from hosting; lets Gary stream **only** his granted episodes; carries Gary's **camera as a separate host-only live stream** (not over the Ably sync bus) and signals every viewer to show/hide the PiP tile when he toggles it; charges the double-tapping fan **once**; admits **exactly** up to the cap (extras see "room full"); marks the room `host_away` (paused) while Gary is gone — which also drops the camera — and `live` again on return; writes each ticket as an `Order` counted toward the title; and surfaces all of it in the BO monitor + analytics. No replay after `ended`; refunds use the BO refund button — POPCORN credited back to the buyer in-system (never cash/Stripe), audited.

## Shared data contract

**Shared nouns used** (defined in `_docs/BRD/_shared-contract.md`, referenced not redefined):
- `User`, `Creator`, `Fan`, `Wallet` (POPCORN), `Title`, `Episode`, `Order`, `AuditLog`.

**Feature-specific entities & fields** (exact names + types):
- `HostGrant` { `id`: string, `userId`: string→User.id, `status`: enum, `grantedByOpsId`: string→User.id, `createdAt`: ts, `revokedAt`: ts|null }
- `ContentGrant` { `id`: string, `userId`: string→User.id (the host), `titleId`: string→Title.id, `episodeIds`: string[]→Episode.id, `grantedByOpsId`: string→User.id, `createdAt`: ts }
- `WatchParty` { `id`: string, `hostId`: string→User.id, `name`: string, `titleId`: string→Title.id, `episodeId`: string→Episode.id|null, `status`: enum, `scheduledStartAt`: ts(UTC), `capacity`: integer (single limit — 6-28 dropped `advertisedCapacity`), `ticketPricePopcorn`: integer(≥0), `isFree`: boolean, `ticketsSold`: integer, `hostCameraAllowed`: boolean (default true), `createdAt`: ts }
- `WatchPartyTicket` — modelled as an `Order` with `kind = watch_party_ticket`, `refId = WatchParty.id`, `amountPopcorn = WatchParty.ticketPricePopcorn`. No separate entity; reuses shared `Order`.
- `EmailNotification` { `id`: string, `type`: enum, `toUserId`: string→User.id, `watchPartyId`: string→WatchParty.id, `sentAt`: ts }
- `RoomOccupancy` — **runtime only** (Ably presence); not persisted. `occupancy` = live count of present clients.
- `WatchParty.hostCameraAllowed` — **persisted boolean** (default `true`). Ops policy: whether this party's host may turn their camera on at all. Lives on `WatchParty` (added to the entity above); ops-writable, host/fan read-only.
- `HostCameraState` — **runtime only** (signalled over the camera channel + reflected in the BO monitor); not persisted. `{ isLive: boolean, ingestUrl?: string, playbackUrl?: string, startedAt?: ts }`. The **media bytes never touch Ztor's backend or Ably** — the camera rides its own live-media path (host encoder → live ingest → CDN → viewer's PiP player). Ably/the camera channel only carries the **on/off signal**, never the video.

**Enums / allowed values:**
- `HostGrant.status`: `active | revoked`
- `WatchParty.status`: `draft | scheduled | preshow | live | host_away | ended | cancelled`
- `EmailNotification.type`: `party_created | ticket_purchased | party_reminder`
- (`Order.kind` extended with `watch_party_ticket`; `Order.status` `confirmed | refunded` — see shared contract)

**State machine** (`WatchParty.status`):
- `draft` → `scheduled` (host publishes)
- `scheduled` → `preshow` (system, at start − preshow window)
- `preshow` → `live` (host "go live" **AND** server-time confirms) — *"Live" is never the client clock alone*
- `live` → `host_away` (system, on host disconnect)
- `host_away` → `live` (system, on host reconnect)
- `live` → `ended` (host ends **OR** ops ends)
- `host_away` → `ended` (system timeout **OR** ops ends)
- `draft | scheduled | preshow` → `cancelled` (host or ops)
- **Illegal (explicit):** `ended` ✗→ `live`/`preshow`/`scheduled` · `cancelled` ✗→ any · `live` ✗→ `scheduled` · any ✗→ `draft`

**Ownership map** (who WRITES vs READS each field, per surface; *Creator Studio is not involved — host setup is on the Frontend per the 6-22 decision*):
| Field | Frontend (host/fan) | Creator Studio | BO (ops) |
|---|---|---|---|
| `HostGrant.*` | read (own) | — | **write** |
| `ContentGrant.*` | read (own) | — | **write** |
| `WatchParty.name / scheduledStartAt / ticketPricePopcorn / isFree` | **write** (host) | — | read |
| `WatchParty.titleId / episodeId` | **write** (host, in-room; restricted to ContentGrant) | — | read |
| `WatchParty.capacity` (single limit) | read | — | **write** (ops default + per-party) |
| `WatchParty.status` | **write** (host: go-live/end) | — | **write** (ops: end/cancel) |
| `WatchParty.hostCameraAllowed` | read | — | **write** (ops policy, default true) |
| `HostCameraState` (isLive) | **write** (host toggles in-room) | — | read (monitor) |
| `WatchParty.ticketsSold` | read | — | read |
| `Order` (watch_party_ticket) | **write** (system on fan purchase) | — | read + **write** `status=refunded` (ops) |
| `EmailNotification.*` | — | — | read (system writes) |
| `AuditLog.*` | — | — | read (system writes on ops action) |

**Shared vocabulary:**
- **Host grant**: the ops-set capability that lets one account create watch parties. Without it, the "host a watch party" action does not appear. Not a user role.
- **Content grant**: the set of titles one host may stream. For a **series** the grant is the specific **episodes**; for a **movie** there are no episodes — the whole title is the unit. The host picks among these **in-room**; they cannot stream anything outside the grant.
- **Capacity**: a **single** hard room limit (default **1,000**) that both displays and gates admission. *(6-28 dev sync dropped the earlier advertised/server dual-number — one value only.)*
- **No replay**: once a room is `ended`, there is no rewind/VOD — the ticket buys the live session only (stated at purchase).
- **Ticket = Order**: a watch-party ticket is an `Order` of kind `watch_party_ticket`; it counts toward the title's total order count.
- **Host camera (watch-along)**: a **host-only** live video of the host's webcam, shown to fans as a **picture-in-picture** tile beside the movie. **Real-time tech decided 2026-06-28 (dev sync): LiveKit** (WebRTC SFU) — dev already stood up a working demo at `stagingdev.ztor.ai/live-demo`. Envelope: **host-only** (viewers never broadcast) · up to **1,000 viewers** per room · **Hong Kong** region. The camera is a **separate live stream carried by LiveKit**, **independent of the movie's host-authoritative play/pause/seek** — toggling the camera or its latency never affects movie sync. **Ably carries only the camera on/off signal**, never the video. *(AWS IVS was judged correct long-term but ~1+ week of env setup, so not pursued for launch; the earlier LL-HLS-on-CDN sketch is superseded — see `outputs/diagrams/watch-party-vendor-options.md` + ADR `decisions/2026-06-28-watch-party-bo-changes.md`.)*

## Resolved decisions (gap engine)
All 15 lenses run; all 7 ‡ non-negotiables below. Status ∈ `RESOLVED | NEEDS-POLICY-OWNER | UNRESOLVED`.

| Finding | Lens | Status | Resolution (min fields for ‡) | Contract field(s) | Owning surface(s) | Test / Owner |
|---|---|---|---|---|---|---|
| A non-granted account tries to host | **Auth** ‡ | RESOLVED | reads: host reads own grants; ops reads all. writes: only ops writes `HostGrant`/`ContentGrant`. Boundary: a fan cannot read another fan's `Order` | `HostGrant`, `ContentGrant`, `Order.userId` | BO + Frontend | TC-A1, TC-A2 |
| Fan double-taps Pay / price has value | **Money** ‡ | RESOLVED | currency = **POPCORN** integer (no fractional → non-integer rejected at creation); no platform/tastemaker fee in v1 (commission **deferred**, below); refund = **POPCORN credited back to the buyer in-system** via the BO refund button (6-28 — no Stripe/cash), sets status + writes audit; partial payment = **not allowed** (all-or-nothing single debit) | `WatchParty.ticketPricePopcorn`, `Order.amountPopcorn`, `Order.status` | Frontend + BO | TC-M1, TC-M2 |
| Two fans buy the last seat at once | **Concurrency** ‡ | RESOLVED | contended resource = room seats; **atomic** reserve (server decrement under lock, not last-write-wins); oversell guard = `ticketsSold < capacity` checked atomically before issuing ticket+token | `WatchParty.capacity`, `WatchParty.ticketsSold` | Frontend + BO | TC-C1 |
| Payment hangs, fan retries | **Failure/idempotency** ‡ | RESOLVED | idempotency key = `(userId, kind=watch_party_ticket, refId=watchPartyId)` unique; retry returns the existing `Order`, no second debit; no external PSP webhook in v1 (synchronous POPCORN debit) | `Order.idempotencyKey` | Frontend | TC-I1 |
| Host streams a title they aren't licensed for; non-host spams parties | **Abuse/self-dealing** ‡ | RESOLVED | host cannot self-grant (only ops writes grants); host may stream **only** titles/episodes in `ContentGrant`; rate guard = **1 live party per host at a time** (additional may be scheduled) | `ContentGrant`, `HostGrant`, `WatchParty.status` | BO + Frontend | TC-AB1 |
| Geoblocked / under-age / un-entitled viewer joins | **Trust&safety / licensing + age-gate** ‡ | RESOLVED | gate = viewer must (registered **AND** holds a `confirmed` ticket) **AND** pass `Title.geoPolicy` **AND** meet `Title.ageRating`; takedown = ops **End room** (kill switch) in monitor | `Title.geoPolicy`, `Title.ageRating`, `Order.status`, `WatchParty.status` | Frontend + BO | TC-TS1 (geo), TC-TS2 (age) |
| Ops grants/revokes, reassigns content, refunds, ends a room | **Audit** ‡ | RESOLVED | every ops permission/money/lifecycle action writes `AuditLog{actorId, action, targetType, targetId, before, after, at}` | `AuditLog.*` | BO | TC-AU1 |
| **How does watch-party ticket revenue split** (platform / tastemaker / creator / backer)? | **Money** ‡ | **NEEDS-POLICY-OWNER** | — (explicitly deferred 6-22: "抽成、不同定價邏輯…未來再加") | — | BO (future) | **Owner: Susan (Finance)** — define the split before paid parties monetize |
| Empty room before start / thousands present | Cardinality | RESOLVED | monitor shows `occupancy / capacity` count; presence list display-capped; pre-start shows a lobby/empty state | `RoomOccupancy`, `WatchParty.capacity` | Frontend + BO | — |
| Host leaves mid-session | State/lifecycle | RESOLVED | `live`→`host_away` pauses playback for all; `host_away`→`live` on return; ops/host may End | `WatchParty.status` | Frontend + BO | TC-S1 |
| Start time timezone | Time | RESOLVED | stored UTC, shown in viewer-local tz; **server time** drives `preshow`/`live`, never the client clock | `WatchParty.scheduledStartAt` | Frontend + BO | — |
| Room cap reached | Limits/caps | RESOLVED | at `ticketsSold == capacity` → no more tickets/joins, "room full" state; **single** capacity limit (6-28 dropped the advertised dual-number) | `WatchParty.capacity` | Frontend + BO | TC-C1 |
| Chat after live / account deletion | Deletion/privacy | RESOLVED | live chat is **ephemeral** (not retained after `ended`, YouTube-live model); `Order` retained (anonymized on deletion) for analytics + tax | `Order`, `WatchParty.status` | Frontend | — |
| Who gets told | Notification | RESOLVED | email on `party_created` (host), `ticket_purchased` (buyer), `party_reminder` (buyer, before start) | `EmailNotification.type` | Frontend (system) | — |
| Languages / currency | i18n | RESOLVED (deferred multi-currency) | copy zh-TW / zh-HK / en; POPCORN is uniform (no FX) — multi-currency deferred | `User.locale` | all | — |
| Host turns their camera on/off mid-room; what fans see; the host inappropriate on cam | **Trust&safety / privacy** ‡ | RESOLVED | **host-only** (viewers cannot broadcast); camera is **opt-in** by the host per session (off by default, host toggles in-room); media is a **separate live stream** (**LiveKit**, real-time WebRTC), **not** carried by Ably and **not** persisted/replayed; on `host_away`/`ended` the camera drops; ops can `hostCameraAllowed=false` per party and **End room** kills both movie + cam; viewers see the camera as a labelled **PiP** tile that appears/disappears on the on/off signal | `WatchParty.hostCameraAllowed`, `HostCameraState`, `WatchParty.status` | Frontend + BO | TC-CAM1 |
| Camera feed is out of sync with the movie | Time/latency | RESOLVED | the camera is **independent of the movie's host-authoritative playback** (a parallel **LiveKit** stream, not part of play/pause/seek); LiveKit (WebRTC) is near-real-time, so the host's reactions track the room without affecting movie sync | `HostCameraState` | Frontend | — |
| Which live-media vendor carries the camera | Build/vendor | **RESOLVED (6-28)** | keep **Ably** for sync/chat/presence; the camera rides **LiveKit** (WebRTC SFU) — chosen at the 6-28 dev sync, dev has a working demo at `stagingdev.ztor.ai/live-demo`. AWS IVS (correct long-term, ~1+ wk env setup) and short-term Twitch were not pursued for launch | `HostCameraState` | Backend/infra | Dev — **LiveKit (decided)** |

**Non-‡ refund eligibility policy** (when *is* a refund granted at all) — secondary `NEEDS-POLICY-OWNER`, **Owner: Ops**. Mechanism (manual mark-refunded) is resolved; the *grant criteria* is an ops call. Does not block the prototype.

## Reference baseline (Mobbin)
- **Source:** **Posh** — *Event management* + *Organization dashboard* (web). Consumer slice derived from **Hulu — Watch Party** (web).
- **Completeness manifest** (one row per screen → state; must reach zero MISSING):

| Screen | State | Coverage | Note |
|---|---|---|---|
| BO · Overview dashboard | default | COVERED → BO.md#scenarios | metrics + party list |
| BO · Overview dashboard | empty | IMPROVED | "No watch parties yet — grant a host to begin" |
| BO · Overview dashboard | loading | COVERED → BO.md | skeleton |
| BO · Watch Parties (monitor) | default | COVERED → BO.md | status chips Scheduled/Live/Ended |
| BO · Watch Parties (monitor) | live | IMPROVED | live occupancy vs cap, host_away badge (not in Posh) |
| BO · Watch Parties (monitor) | empty | COVERED → BO.md | |
| BO · Party detail | default | COVERED → BO.md | occupancy, attendees, end-room |
| BO · Party detail | host_away | IMPROVED | "host disconnected — paused" banner (not in Posh) |
| BO · Party detail | camera-live | IMPROVED | "Host camera: live" indicator + per-party camera-allowed toggle (not in Posh) |
| FE · Room | host-camera on | IMPROVED | host self-view tile + viewer PiP "Host on camera" (beyond Hulu Watch Party) |
| BO · Party detail | ended | COVERED → BO.md | no-replay note |
| BO · Party detail | permission-denied | COVERED → BO.md | non-ops sees 403 |
| BO · Hosts (access) | default | COVERED → BO.md | grant/revoke host capability |
| BO · Hosts (access) | empty | COVERED → BO.md | "no hosts granted" |
| BO · Grant host modal | default | COVERED → BO.md | pick account, confirm |
| BO · Grant host modal | error | COVERED → BO.md | account already granted |
| BO · Content assignment | default | IMPROVED | title + **episode-level** ticks (beyond Posh) |
| BO · Content assignment | empty | COVERED → BO.md | "no content assigned — host can't create" |
| BO · Analytics | default | COVERED → BO.md | orders, attendees, chat rate, avg watch time |
| BO · Analytics | empty | COVERED → BO.md | |
| BO · Settings (capacity + policy) | default | IMPROVED | single capacity limit; POPCORN-refund policy note |
| BO · Order row → refund | confirm | IMPROVED | POPCORN refund button + audit (in-system credit) |
| BO · Order row → refund | permission-denied | COVERED → BO.md | |
| FE · Title premiere page | selling / preshow / live / ended | COVERED → Frontend.md | phase × ticket button |
| FE · Host create party | default | COVERED → Frontend.md | name/time/price |
| FE · Host create party | permission-denied | IMPROVED | no grant → action hidden / 403 |
| FE · Buy ticket | default / sold-out / already-bought / payment-error | COVERED → Frontend.md | |
| FE · Room | live / host_away / late-join | COVERED → Frontend.md | host picks episode in-room |
| FE · Join gate | invalid-code / not-entitled | COVERED → Frontend.md | |

`Coverage` ∈ `COVERED | IMPROVED | INTENTIONALLY-OMITTED (reason) | MISSING`. **Zero MISSING.**

**P0 — parity:** overview metrics, event list with live/upcoming status, team access (host grant), attendee list, settings/policy, export report.
**P1 — improvements** (each attached to a manifest row): content-pool assignment at **title+episode** granularity · **single capacity limit** · **host_away** monitor state · **views-as-orders** tally · **POPCORN refund + audit**.

## Assumptions
Defaults chosen on "invisible" gaps — a human can override any.
- **Ticket currency = POPCORN integer** (no cents) — matches the app's 🍿 wallet; cleanest for free/paid toggle.
- **1 live party per host at a time** — rate guard default; extra parties may be scheduled.
- **Live chat not persisted** after `ended` — per 6-22 (YouTube-live model).
- **Start-reminder email included** — per the meeting's "時間到要繼續看" note.
- **Single capacity limit** (6-28) — one number that displays and gates; the earlier advertised/server dual-number is dropped.
- **Start time stored UTC, shown viewer-local**; server time drives lifecycle.
- **Refund credits POPCORN back to the buyer in-system** via the BO refund button (6-28) — never cash/Stripe; the action records status + audit.
- **App version (1.0 design) is out of scope for this BRD** — Web-first for Aug 4; App watch party tracked separately.

## Surface map
| Surface | Involved? | Role in this feature |
|---|---|---|
| Frontend | **Y** | Host creates/controls a room (grant-gated); fan buys ticket + watches in sync; in-room episode pick; **host toggles their camera → fans see a PiP tile**. |
| Creator Studio | **N** | Not involved — host setup moved to the Frontend (self-serve) per 6-22. No file. |
| BO | **Y** (primary) | Grant hosts, assign content (title+episode), set capacity, **per-party host-camera policy**, monitor live rooms (**incl. camera-live indicator**), analytics, **POPCORN refund**. |
