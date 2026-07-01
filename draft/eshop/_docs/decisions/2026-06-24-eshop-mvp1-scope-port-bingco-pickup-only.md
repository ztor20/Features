# 2026-06-24 — [Ztor 2.0] E-Shop MVP1 scope: port existing Bingco features, pickup-only, no shipping/VIP

*Status: DRAFT — needs review*

## Decision
E-Shop / Store MVP1 (Phase 1, end-August) scope is locked:
- **Baseline = port the existing Bingco online-version features directly** as this round's scope. Verbatim: "以現有 Bingco 線上版本的功能為基準，直接搬移為本次 scope".
- **Pickup-only** fulfilment: fans collect goods on-site at the event via **QR code**. **No shipping in Phase 1.**
- **Excluded from v1:** VIP-tier features and logistics/shipping info. Verbatim: "VIP 版本相關功能及物流資訊暫不納入第一版".
- Shipping deferred to **~September**, pending **shipping-vendor selection** (vendor not yet confirmed).
- **Product preview:** C-side preview not finished — use a **self-made fake preview placeholder** for now.
- **Backend** reuses the **Binco architecture**; this year's goal remains internal-staff management (Artist Portal concept).
- **Creator store page** = posts + shop; leaderboard and events pages are later features.
- QA: 庭方 (Tingfang) has prepared a test-case doc covering all existing Creta feature points to safeguard quality.

## Why
Porting the proven Bingco feature set and shipping pickup-only first lets Store hit the end-August window without blocking on shipping-vendor negotiation or VIP/logistics complexity; those are deferred to a later phase.

## Source
- Daily Brief: https://app.notion.com/p/Daily-Brief-June-24-2026-3899ca6e76ac815ab672c1727e2ef091
- Source meeting (requirement alignment): https://www.notion.so/Meeting-Note-ztor-2-0-requirement-alignment-3899ca6e76ac80439b0ced32ab9128b6
- Source meeting (dev team sync): https://www.notion.so/Meeting-Note-ztor-2-0-dev-team-sync-up-3899ca6e76ac80dab3f2c012658c7b14
