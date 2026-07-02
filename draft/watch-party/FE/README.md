# FE (Frontend) — delivered

The Frontend prototype is **built & deployed**. It lives in the standalone master site (`Frontend`), not duplicated here — this folder holds the **authoritative requirements**; the live build is the clickable prototype.

| Item | Details |
|------|---------|
| Surface | Frontend (consumer) — host creates/controls a room, fans buy a ticket and watch in sync |
| Status | **shipped** (desktop) — integrated into the master `Frontend` site; mobile pending |
| Requirements | [`requirements-en.md`](./requirements-en.md) · [`requirements-zh-hant.md`](./requirements-zh-hant.md) — authoritative |
| Design system | `Frontend-Design-System` |
| Updated | 2026-06-26 |

> The `.md` is authoritative; the prototype illustrates.

## Prototype (live — stub link, stays in the standalone build)
Deployed in the master `Frontend` site (repo `ztor20/Frontend`, deploy `ztor-2-0-f2e.vercel.app`). Per-surface deep links:

| Surface | Live link |
|---|---|
| **My watch parties** (list) | https://ztor-2-0-f2e.vercel.app/watch-party-list.html |
| **Create a party** (host) | https://ztor-2-0-f2e.vercel.app/watch-party-create.html |
| **Manage a party** (host) | https://ztor-2-0-f2e.vercel.app/watch-party.html |
| **Buy a ticket** (fan, on the title page) | https://ztor-2-0-f2e.vercel.app/title.html |
| **In-room** (synced playback + chat) | https://ztor-2-0-f2e.vercel.app/watch-party-room.html |
| **Flow canvas** (all states, internal nav) | https://ztor-2-0-f2e.vercel.app/watch-party-canvas.html |

The room page accepts URL params for every state: `?role=host|guest&state=lobby|sync|live|ended&mic=on|off` (`&roster=1` opens the attendee list, `&del=1` shows delete-message, `&settings=1` opens the host episode/volume sheet).

**Realtime:** sync only, not streaming — each fan plays their own copy; **Ably** broadcasts host playback state, chat, and presence. Three channels: `playback-sync`, `chat`, `presence`. (Host camera PiP is a separate v3 add on **LiveKit** — decided 6-28; FE prototype is mock.)

## Reference (the earlier standalone build)
https://ztor-watchparty.vercel.app · full BRD Frontend tab: https://ztor-watchparty.vercel.app/brd

## Scope (from the BRD)
Host creates/controls a grant-gated room (name / time / POPCORN-or-free price), shares the link; fans buy a ticket (idempotent — no double charge) and watch in sync with live chat; the host picks/switches the episode **in-room** from their granted pool; **no replay**; if the host disconnects the room **pauses** (host-away) until they return.
