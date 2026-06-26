# Watch Party — Back Office Requirements

| Item | Details |
|------|---------|
| Surface | Back Office (ops) — the **prototyped primary surface** |
| Folder | `watch-party/BO` |
| Version | v2 |
| Updated | 2026-06-24 |
| Prototype | shipped → https://ztor-watchparty.vercel.app/bo (source: `NukeGozilla/ztor-watchparty`) |
| Design system | `Creator-Studio-Design-System` |

> The `.md` is authoritative; the prototype illustrates. Migrated from the Watch Party BRD (also hosted at `/brd`).

## Contract reference
Shared platform nouns → `Features/_shared-contract.md` (referenced, not redefined). Feature-local entities (`HostGrant`, `ContentGrant`, `WatchParty`, `EmailNotification`, `RoomOccupancy`) + the `WatchParty.status` state machine live in the full BRD spine (hosted `/brd`).
- **BO reads:** `WatchParty.*`, `Order` (watch_party_ticket), `RoomOccupancy`, `User.displayName`, `Title`, `Episode`, `EmailNotification`
- **BO writes:** `HostGrant.*`, `ContentGrant.*`, `WatchParty.capacity`, `WatchParty.advertisedCapacity`, `WatchParty.status` (end/cancel only), `Order.status` (→ `refunded`), `AuditLog.*` (system, on every write here)

## Goal (this surface)
Give ops the controls the 6-22 meetings put in the back office: decide **who** may host, **what** each host may stream (title + episode), the room **capacity**, a **live monitor** of scheduled/live rooms, and **analytics** (watch-party orders + engagement). Everything else (room name, time, price) is host self-serve on the Frontend — BO only reads those.

## Scenarios
- **Given** ops opens the BO, **When** they open **Hosts**, pick Gary's account and toggle **Grant host**, **Then** a `HostGrant{userId, status:active}` is written, an `AuditLog` row is added, and Gary's account can now see "host a watch party" on the Frontend.
- **Given** Gary is a granted host, **When** ops opens **Content** for Gary and ticks F《我要衝線》 ep 1, 2, 3, **Then** a `ContentGrant{userId, titleId, episodeIds:[e1,e2,e3]}` is written; Gary may stream only those in-room.
- **Given** a room is `live`, **When** ops opens **Watch Parties → the room**, **Then** ops sees `occupancy / capacity`, the attendee list, and an **End room** control; if the host disconnected the room shows a `host_away` banner.
- **Given** a fan disputes a charge, **When** ops opens the room's orders and clicks **Mark refunded** on that order (confirm), **Then** `Order.status = refunded`, an `AuditLog{action:'order.refund'}` row is written — **no** automatic POPCORN reversal (CS handles the credit).
- **Given** the Aug-4 campaign, **When** ops opens **Settings**, **Then** they set room **capacity = 1000** and **advertised = 500**; advertised is display-only and never gates admission.
- **Given** a non-ops user, **When** they hit a `/bo` URL, **Then** they get a permission-denied screen (no data).

## Functional requirements
- **FR-01** The ops admin can grant/revoke the **host capability** on any account.
- **FR-02** The ops admin can assign a host a pool of **titles + specific episodes** they may stream.
- **FR-03** The ops admin can set a **default capacity** and a per-room capacity + advertised number.
- **FR-04** The ops admin can **monitor** every scheduled/live/ended room: status, occupancy vs cap, host-away.
- **FR-05** The ops admin can **end** (kill) a live room and **cancel** a scheduled one.
- **FR-06** The ops admin can view **analytics**: watch-party orders (counted in total orders), attendees, chat activity, avg watch time, and **export**. (No subscriber/new split — Ztor has no subscription feature.)
- **FR-07** The ops admin can **mark an order refunded** (status + audit only; no payment reversal).
- **FR-08** Every grant/assign/capacity/end/cancel/refund action is **written to the audit log**.
- **FR-09** Ticket **price is read-only** in BO (host sets it on the Frontend).

## Edge / empty / loading / error states
| State | Behaviour |
|---|---|
| empty / first-run | Overview: "No watch parties yet — grant a host to begin." Hosts: "No hosts granted." Content: "No content assigned — this host can't create a party." |
| loading | Skeleton rows on dashboard + lists. |
| error / failure | Grant on an already-granted account → inline "Already a host." End-room failure → toast + room stays, retry. |
| permission-denied | Non-ops at `/bo*` → full-page 403 "Back office — ops only," no data leaked. |
| host_away | Monitored room shows amber "Host disconnected — playback paused for all" banner + time-away counter. |
| at-capacity | Room row shows `1000 / 1000 · FULL`; analytics still accrue. |

## Success criteria
| Metric | Threshold | Window | Verification |
|---|---|---|---|
| Host can't stream un-granted content | 100% blocked | per room create | Frontend create restricts title/episode to `ContentGrant`; BO shows the grant |
| Over-cap admissions | 0 | per room | `ticketsSold ≤ capacity` always (atomic guard) |
| Ops actions audited | 100% | always | every BO write produces an `AuditLog` row |
| Watch-party orders in total count | 100% | per ticket | each `watch_party_ticket` Order increments the title's order count |

## Test cases
- **TC-A1 (Auth)** — Given a non-ops user · When they GET `/bo/parties/wp_001` · Then response is `403` and **no** `WatchParty`/`Order` data is returned. *(catches: BO data leaking to non-admins)*
- **TC-A2 (Auth)** — Given fan A holds order `o_A` · When fan A requests fan B's order `o_B` · Then `403`/empty. *(catches: cross-fan PII leak)*
- **TC-AB1 (Abuse)** — Given Gary's `ContentGrant` = [F ep1–3] · When Gary tries to create a party on title `imported_film` · Then create is **blocked** (`403`), not recorded as a party. *(catches: hosting un-licensed content)*
- **TC-AU1 (Audit)** — Given ops marks order `o_1` refunded · When the action commits · Then an `AuditLog` row exists with `{actorId, action:'order.refund', targetType:'Order', targetId:'o_1', before:{status:'confirmed'}, after:{status:'refunded'}, at}` AND `Order.status == 'refunded'`. *(catches: untraceable money/permission changes)*
- **TC-S1 (Lifecycle)** — Given room `wp_001` is `live` · When the host disconnects · Then `status == 'host_away'` AND the monitor row shows the host-away banner; on reconnect `status == 'live'`. *(catches: orphaned uncontrolled rooms)*
- **TC-CAP1 (Caps)** — Given `capacity=1000, advertised=500` · When the 501st fan buys · Then the purchase **succeeds** (advertised never gates) AND when the 1001st buys it **fails** with "room full". *(catches: advertised number wrongly blocking; oversell)*

## Information architecture (prototype)
Admin shell (dedicated, bypasses the consumer chrome) with left nav:
1. **Overview** `/bo` — headline metrics (parties live now, tickets sold, watch-party orders, attendees) + a list of parties with status chips.
2. **Watch Parties** `/bo/parties` — the monitor: filterable list (Scheduled / Live / Ended) → **detail** `/bo/parties/[id]` (occupancy vs cap, attendee list, orders + manual refund, end/cancel, host-away banner, no-replay note).
3. **Hosts** `/bo/hosts` — accounts with grant/revoke toggle → per-host **Content** assignment (title cards + episode-level ticks).
4. **Analytics** `/bo/analytics` — watch-party orders, attendees, chat activity, avg watch time + **Export**.
5. **Settings** `/bo/settings` — default + per-campaign capacity, advertised number, policy notes (no-replay, no-auto-refund), email notifications, and the **rev-share future-phase** banner (NEEDS-POLICY-OWNER: Susan).

## Not Included
- Setting ticket **price** (host self-serve on Frontend; BO is read-only).
- **Rev-share / commission** computation (deferred — Susan/Finance).
- **Marketing tooling** (SMS blasts, paylinks, tags) — cut for v1.
- **Automatic refund / payment reversal** — manual mark-refunded + CS only.
- **App (1.0) version** — Web-first; tracked separately.
