# FE (Frontend) — pending designer

This surface is empty on purpose — the **designer** will push the Frontend prototype + requirements here.

**Add:**
- `requirements-en.md` + `requirements-zh-hant.md` — the host-create-room, buy-ticket, and synced-room FE requirements
- `prototype/` — the FE clickable prototype (or a stub link if it stays in the standalone build)

**Design system:** `Frontend-Design-System`

**Reference (existing build):** https://ztor-watchparty.vercel.app · full BRD Frontend tab: https://ztor-watchparty.vercel.app/brd

**Scope (from the BRD):** host creates/controls a grant-gated room (name / time / POPCORN-or-free price), shares the link; fans buy a ticket (idempotent — no double charge) and watch in sync with live chat; the host picks/switches the episode **in-room** from their granted pool; **no replay**; if the host disconnects the room **pauses** (host-away) until they return.
