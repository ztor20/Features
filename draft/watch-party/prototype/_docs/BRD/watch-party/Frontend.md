# Ztor Watch Party — Frontend

> ⚠️ **Front-end ownership (6-28):** the user-facing front-end is now built by the **design team** — current
> deploy at **https://ztor-2-0-f2e.vercel.app/**. This prototype keeps the **back office** (`/bo`) and the
> **realtime sync-engine demo** (`/`, `/room/[code]`, `/join`); the requirements below are the contract the
> designer's build implements (sync, entitlement, host camera), not a separate UI to maintain here.

> This surface's slice of the core scenario in `_feature.md`. Two actors share it: **host** (a granted
> account, in host mode) and **fan/viewer**. Derived from **Hulu — Watch Party** (Mobbin) + the existing
> demo (`/`, `/room/[code]`, `/join`).

## Goal (this surface)
Let a **granted host** create and control a synced room (name, time, price, in-room episode pick), and let a
**fan** buy a POPCORN ticket and watch in sync with live chat + presence. The page itself is the entitlement
gate — only a registered, ticketed (or free-listed) user reaches the stream.

## Contract reference
Shared nouns → `_docs/BRD/_shared-contract.md`. Feature-local → `_feature.md#shared-data-contract`.
- **reads:** `HostGrant` (own), `ContentGrant` (own), `Title`, `Episode`, `WatchParty.*` (incl. `hostCameraAllowed`), `RoomOccupancy`, `HostCameraState`, `Wallet.popcornBalance`
- **writes:** `WatchParty.name / scheduledStartAt / ticketPricePopcorn / isFree` (host create), `WatchParty.titleId / episodeId` (host, in-room, restricted to `ContentGrant`), `WatchParty.status` (host go-live/end), `HostCameraState.isLive` (host toggles camera in-room), `Order` (system on fan purchase, idempotent)

## Scenarios
- **Given** Gary holds a `HostGrant`, **When** he taps "Host a watch party," **Then** he sets a name + start time + POPCORN price (or free) and gets a share link; the title/episode picker shows **only** his `ContentGrant`.
- **Given** Gary has **no** grant, **When** he looks for the host action, **Then** it is **not shown** (and a direct create call returns `403`).
- **Given** a fan opens the premiere title page, **When** the phase is `selling`, **Then** they see a countdown + "Buy ticket"; in `preshow` "Starting soon · Join"; in `live` "Join now"; in `ended` "Ended — no replay."
- **Given** a fan buys, **When** they double-tap Pay, **Then** exactly **one** `Order{kind:watch_party_ticket}` is created and POPCORN is debited **once** (idempotency key).
- **Given** the room is at capacity, **When** another fan tries to buy/join, **Then** they see "Room full."
- **Given** Gary is live, **When** he switches from ep 1 to ep 2 (both granted), **Then** all viewers' players adopt ep 2 via the host snapshot; a non-granted episode is **not selectable**.
- **Given** Gary disconnects, **When** he's away, **Then** viewers see "Host stepped away — paused"; on return playback resumes.
- **Given** a fan dropped, **When** they reopen the same link while `live`, **Then** they re-enter and re-sync (snapshot).
- **Given** Gary is live and the party allows it, **When** he turns his **camera** on, **Then** every viewer sees his face-cam in a **PiP** tile (a late joiner learns it's already on); when he turns it off or steps away, the tile disappears for everyone. The camera is separate from playback — switching episodes or pausing the movie does not affect it.

## Functional requirements
- **FR-01** A **granted** host can create a room: name, start time, POPCORN price or free, share link/code.
- **FR-02** A host can, **in-room**, pick/switch the title + episode — restricted to their content grant.
- **FR-03** A fan can buy a ticket with POPCORN (or join free) and is admitted only if registered + entitled + within cap + geo/age-eligible.
- **FR-04** A viewer's playback stays host-synced (play/pause/seek + late-join snapshot); host-away pauses all.
- **FR-05** A viewer can use live chat + see the presence list; chat is not retained after the room ends.
- **FR-06** The system emails the host on create and the buyer on purchase + a start reminder.
- **FR-07** Purchase copy states **no replay** before payment.
- **FR-08** A granted host can **turn their camera on/off in-room** (host-only, off by default); when on, every viewer sees the host in a **picture-in-picture** tile. The camera is a separate live stream (**LiveKit** — real-time WebRTC, chosen 6-28), independent of the movie's host-authoritative sync, not recorded; it drops on host-away/end. The toggle is unavailable if ops set `hostCameraAllowed = false` for the party.

## Edge / empty / loading / error states
| State | Behaviour |
|---|---|
| empty / first-run | Host with no content grant → create blocked: "No content assigned yet — contact ops." |
| loading | Title page resolves phase from **server time**; room shows "Connecting…" then snapshot. |
| error / failure | Payment hang + retry → no double charge (idempotent). Invalid room code → "Room not found." |
| permission-denied | No host grant → host action hidden; un-entitled join → "You need a ticket"; geoblocked → "Not available in your region." |
| sold-out / full | "Room full (1000/1000)." |
| already-bought | "You already have a ticket — Join." |
| host_away | "Host stepped away — playback paused." (host camera also drops) |
| ended | "This watch party has ended. No replay is available." |
| camera-blocked | Host disabled by ops (`hostCameraAllowed=false`) → camera toggle hidden. Browser denies camera/mic → inline "Camera blocked — allow access and retry." |

## Success criteria
| Metric | Threshold | Window | Verification |
|---|---|---|---|
| Double-pay → single charge | 100% | per purchase | one `Order` row, one POPCORN debit per idempotency key |
| Late-join re-sync | < 3s to correct video+time | per join | snapshot handshake lands on right `episodeId` + timestamp |
| Un-granted episode blocked | 100% | per switch | picker restricted to `ContentGrant.episodeIds` |

## Test cases
- **TC-M1 (Money)** — Given a ticket priced `150` POPCORN and a fan with `200` · When they buy · Then `Order.amountPopcorn == 150` AND `Wallet.popcornBalance == 50` AND `Order.status == 'confirmed'`. *(catches: wrong/again charge)*
- **TC-M2 (Money)** — Given a host sets price `12.5` · When they submit · Then create is **rejected** ("whole POPCORN only"). *(catches: fractional-credit corruption)*
- **TC-I1 (Idempotency)** — Given a pending purchase with key `k1` · When the request is retried with `k1` · Then the same `Order` is returned and POPCORN is debited **once**. *(catches: double-charge on retry)*
- **TC-C1 (Concurrency)** — Given `capacity=1000, ticketsSold=999` · When 2 fans buy simultaneously · Then **exactly one** `Order` is created (`ticketsSold→1000`) and the other gets "room full." *(catches: oversell)*
- **TC-TS1 (Trust&safety · geo)** — Given a viewer in a geoblocked region for an imported title · When they try to join · Then join is **blocked** ("not available in your region"), no stream token issued. *(catches: licensing breach)*
- **TC-TS2 (Trust&safety · age)** — Given an under-age viewer and a watch party streaming an `ageRating = R` title · When they try to join · Then join is **blocked** ("age-restricted") and no stream token is issued. *(catches: age-gated content shown to an ineligible user)*
- **TC-AB1 (Abuse)** — Given Gary's grant = F ep1–3 · When he tries to select ep4 / another title in-room · Then it is **not selectable** and a forced request `403`s. *(catches: streaming beyond grant)*
- **TC-CAM1 (Camera)** — Given Gary's party has `hostCameraAllowed = true` and he turns the camera on · When a viewer is in the room · Then the viewer's **PiP tile appears** (and a viewer joining after also sees it via the status handshake); when Gary toggles off or goes `host_away`, the tile is **removed** for everyone. Given `hostCameraAllowed = false` · the camera toggle is **unavailable**. *(catches: leaked/zombie camera, missing opt-in)*

## Not Included
- Host **self-grant** of capability or content (ops-only, BO).
- **VOD / replay** after the live ends (tech-limited; stated at purchase) — including no recording/replay of the **host camera**.
- **Viewer cameras** (fans on cam) — host-only broadcast in v1.
- **Voice chat** as a standalone (2-way) feature — the host's mic rides their camera; independent voice is a fast-follow.
- **App (1.0)** build — Web-first for Aug 4.
