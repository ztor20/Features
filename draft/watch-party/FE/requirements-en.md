# Watch Party — Frontend Requirements

| Item | Details |
|------|---------|
| Surface | Frontend (consumer) — host self-serve room + fan buy-ticket + synced in-room |
| Folder | `watch-party/FE` |
| Version | v1 |
| Updated | 2026-06-26 |
| Prototype | shipped (desktop) → integrated in master `Frontend` site, deploy https://ztor-2-0-f2e.vercel.app (source: `ztor20/Frontend`) |
| Design system | `Frontend-Design-System` |

> The `.md` is authoritative; the prototype illustrates. Migrated from the Watch Party BRD (also hosted at `/brd`).

## Contract reference
Shared platform nouns → `Features/_shared-contract.md` (referenced, not redefined). Feature-local entities (`HostGrant`, `ContentGrant`, `WatchParty`, `Order` (`watch_party_ticket`), `RoomOccupancy`, `EmailNotification`) + the `WatchParty.status` state machine live in the full BRD spine (hosted `/brd`). The Frontend is the **host/fan-facing** half of the same contract the Back Office (`watch-party/BO`) administers.
- **FE reads:** `HostGrant` (is this account a host?), `ContentGrant` (which titles/episodes may this host stream?), `WatchParty.*`, `Order` (own tickets), `RoomOccupancy`, `Fan.display_name`, `Title`, `Episode`
- **FE writes:** `WatchParty.{name, scheduledAt, price, privacy, capacity}` (host create), `WatchParty.status` (`scheduled`→`live` when host opens the room, `host_away`/`live` on disconnect/return), `Order` (`watch_party_ticket` purchase — idempotent), chat messages + presence (Ably; not persisted in v1)

## Goal (this surface)
Let a **granted host** self-serve a room — name, time, free-or-POPCORN price, public/private — and run it live; let a **fan** buy a ticket once (no double charge) and watch the film **in sync** with live chat. The host picks/switches the episode **in-room** from their granted pool. Ops controls (who may host, what they may stream, capacity, monitor, refund) are the Back Office's job — the Frontend only consumes those grants.

## Scenarios
- **Given** a fan who is **not** a granted host, **When** they open the create-party menu, **Then** "host a watch party" is hidden/disabled — only `HostGrant{status:active}` accounts can create.
- **Given** Gary is a granted host, **When** he creates a party, **Then** the flow walks film → date/time → privacy (public/private) → price (free or POPCORN) → capacity (unlimited or a set cap) and writes a `WatchParty` in `scheduled`; the film picker is restricted to his `ContentGrant` pool.
- **Given** a created party, **When** the host finishes, **Then** he gets a **room link + join code in one copy action**; a **paid** party shares the **ticket purchase link** (the title page) instead of the raw room link/code.
- **Given** a private party, **When** a fan opens the room link, **Then** they must enter the **join code** to proceed (public parties skip the code).
- **Given** a fan on the title page, **When** they tap **"共看派對入場券"** (watch-party ticket), **Then** a claim popup confirms the party, and on **領取 (claim)** a `watch_party_ticket` `Order` is created **idempotently** — tapping twice does **not** double-charge — and the ticket grants playback for that party.
- **Given** a party is **at capacity**, **When** a fan tries to claim, **Then** the popup shows a **full** state ("已額滿") and no order is created.
- **Given** the room is `live`, **When** a fan with a ticket joins, **Then** they watch in sync with the host (playback position / play / pause / seek follow the host) and see **live chat** + an online count.
- **Given** the host disconnects mid-room, **When** the connection drops, **Then** the room enters **host-away** and playback **pauses for everyone** until the host returns (`status: host_away` → `live`); **no replay** after the party ends.
- **Given** the host is in the room, **When** they open **host controls**, **Then** they can **switch the episode** (from the granted pool), **adjust film volume**, **delete a chat message**, and **remove (kick)** an attendee (two-step confirm); guests are read-only on controls.
- **Given** a fan opens **My watch parties** (list), **When** the page loads, **Then** parties show a **free(green)/paid(orange) · public/private** chip and status; an **in-progress** party opens the room in a new tab.

## Functional requirements
- **FR-01** Only an account with an active `HostGrant` can reach the **create-party** flow.
- **FR-02** The host can set room **name, date/time, privacy (public/private), price (free or POPCORN amount), and capacity (unlimited or a number)**.
- **FR-03** The film/episode picker in create is **restricted to the host's `ContentGrant`** pool.
- **FR-04** On create, the host gets a **single copy action** combining **room link + join code**; a **paid** party shares the **ticket-purchase link** (title page), not the raw room link/code.
- **FR-05** A **private** room requires the **join code** to enter; a **public** room does not.
- **FR-06** A fan can **buy a ticket** for a party from the title page; the purchase is **idempotent** (one `watch_party_ticket` `Order` per fan per party — no double charge).
- **FR-07** A **full** party blocks new tickets and shows an **at-capacity** state; tickets never exceed `capacity`.
- **FR-08** A ticket-holder can **join the room** and watch in **sync** (host is the authority for play/pause/seek/position) with **live chat** and an **online count**.
- **FR-09** On **host disconnect** the room shows **host-away** and **pauses playback for all**; on return it resumes. **No replay** after end.
- **FR-10** In-room, the **host** can **switch episode** (granted pool only), **set film volume**, **delete a chat message**, and **remove an attendee** (two-step confirm); **guests are read-only** on these.
- **FR-11** **My watch parties** lists the fan's parties with **free/paid · public/private** chips and status; in-progress opens the room.
- **FR-12** A **pre-show lobby** (chat + countdown, no playback yet) is available before start.

## Edge / empty / loading / error states
| State | Behaviour |
|---|---|
| empty / first-run | List: "No watch parties yet." Create film-picker with no granted content: "No content assigned — ask ops to grant a title." |
| loading | Skeletons on the list; spinner on the in-room **sync** state ("同步中…") while catching up to the host. |
| not-a-host | Create entry hidden/disabled for non-`HostGrant` accounts. |
| at-capacity | Title ticket popup shows **"已額滿"**; no order created. |
| already-ticketed | Re-tapping claim shows the **already-claimed** path (go to the party), no second `Order`. |
| private-no-code | Wrong/empty join code → inline "代碼錯誤，請再試一次," no entry. |
| host_away | All attendees see "主持人已離線 — 全體暫停播放" + the room paused; resumes on host return. |
| ended / no-replay | After the party ends there is **no replay**; the room shows an ended state. |
| permission / no-ticket | A fan without a valid ticket hitting a room link → blocked / sent to buy a ticket. |

## Success criteria
| Metric | Threshold | Window | Verification |
|---|---|---|---|
| Double-charge on ticket buy | 0 | per fan per party | repeat claim returns the same `Order`; no second charge |
| Over-cap admissions | 0 | per room | `ticketsSold ≤ capacity` always (atomic guard, shared with BO) |
| Host streams un-granted content | 100% blocked | per create / per switch | picker restricted to `ContentGrant`; server rejects others |
| Sync drift (fan vs host) | within tolerance | live | fan playback follows host position via the `playback-sync` channel |
| Host-away pause | 100% | per disconnect | room pauses for all on host drop, resumes on return |

## Test cases
- **TC-G1 (Gate)** — Given a non-host fan · When they open the create menu · Then "host a watch party" is **absent/disabled** and the create flow is unreachable. *(catches: ungranted hosting)*
- **TC-G2 (Grant scope)** — Given Gary's `ContentGrant` = [F ep1–3] · When Gary opens the create film-picker · Then only F ep1–3 are selectable; an in-room **switch** to ep4 is **blocked**. *(catches: streaming un-licensed content)*
- **TC-B1 (Idempotency)** — Given a fan taps **claim** on party `wp_001` · When they tap claim again (double-click / retry) · Then exactly **one** `watch_party_ticket` `Order` exists and the fan is **charged once**. *(catches: double charge)*
- **TC-B2 (Capacity)** — Given `capacity=1000` and 1000 tickets sold · When the 1001st fan claims · Then the popup shows **"已額滿"** and **no** `Order` is created. *(catches: oversell)*
- **TC-P1 (Private)** — Given a **private** room · When a fan opens the link without the code · Then entry is **blocked** until the correct join code is entered. *(catches: private rooms leaking)*
- **TC-S1 (Sync)** — Given the host **pauses** at 12:30 · When the state propagates · Then every ticket-holder's player is **paused at 12:30** (within tolerance). *(catches: out-of-sync playback)*
- **TC-S2 (Host-away)** — Given the room is `live` · When the host disconnects · Then all attendees see **host-away** and playback is **paused**; on reconnect it **resumes** (no replay offered after end). *(catches: orphaned/uncontrolled rooms)*
- **TC-M1 (Moderation)** — Given the host deletes a chat message / removes an attendee (two-step confirm) · When confirmed · Then the message/attendee is gone for everyone; a **guest** attempting the same sees no such control. *(catches: guests gaining host powers)*

## Information architecture (prototype)
Consumer chrome (master `Frontend` shell — side rail, header, create-menu). Built desktop pages:
1. **Create a party** `watch-party-create.html` — host wizard: **film pick → date/time → privacy (public/private) → price (free / POPCORN) → capacity (unlimited / set)** → **"派對已建立"** confirmation with the combined **room link + join code** copy (paid → ticket-purchase link instead).
2. **My watch parties** `watch-party-list.html` — the fan's parties with **free/paid · public/private** chips + status; in-progress opens the room in a new tab. Host vs guest views.
3. **Manage a party** `watch-party.html` — host's single-party view: back button, status tag, room link + join code (always shown to the host).
4. **Buy a ticket** `title.html` — title detail; **"共看派對入場券"** → claim popup (`claim` / `full` / `already-claimed` states) → on claim, go to the party.
5. **In-room** `watch-party-room.html` — `lobby` (chat + countdown) → `sync` ("同步中…") → `live` (synced player + live chat + online count) → `ended` (no replay). Host overlay: switch episode, film volume, delete message, remove attendee, mic (host camera/voice). Guests read-only.
6. **Flow canvas** `watch-party-canvas.html` — *internal* zoomable map of all 24 states (host + guest lanes); not a consumer page — for review/handoff.

## Realtime (integration note)
Sync, **not** streaming — each fan plays their own copy of the film; **Ably** broadcasts state only. Three channels:
- `playback-sync` — host position / play / pause / seek (host is authoritative; late-joiners catch up via the **sync** state)
- `chat` — live room chat (lobby + live)
- `presence` — online count + attendee roster (drives host-away detection and the kick list)

The FE prototype is **mock**; mark these as the realtime integration points for the build. Host-camera PiP (v3) is a separate Amazon IVS broadcast and out of scope for this FE prototype.

## Not Included
- **Mobile** (`mobile-watch-party*.html`) — desktop shipped; mobile pending.
- **Ops controls** — who may host, content grants, capacity defaults, live monitor, analytics, refunds → **Back Office** (`watch-party/BO`).
- **Payment / refund** internals — purchase follows the existing platform Order/payment rules (idempotency is FE-visible; the ledger is not redefined here).
- **Replay / VOD** — no replay after a party ends (by design).
- **Rev-share / commission** computation — deferred (Owner: Susan / Finance); stats tracked, split not computed in v1.
- **Real persistence of chat** — chat is realtime-only in v1 (Ably), not stored.
