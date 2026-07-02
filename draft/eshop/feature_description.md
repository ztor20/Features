# eShop — Feature (DRAFT)

*Staged 2026-06-30 · owner: Jeff Yang · surfaces: **FE** (buyer storefront) · **CS** (operator / Creator Studio)*

Ztor 2.0 eShop — creator-merch commerce. This draft folder stages the **final designer build** (buyer storefront, from `ztor20/Frontend@L`) plus the operator-side scope and all supporting docs, so eShop can be released **feature-by-feature** on the Ztor roadmap.

## Surfaces

- **`FE/`** — buyer storefront. Source: `ztor20/Frontend` branch **L**, `features/shop/` (the senior designer's final version). 7 feature specs + a runnable prototype slice.
- **`CS/`** — operator side (Creator Studio: 商店 / 订单 / 收入管理). Our feature-scope list + interactive scope-map.

## Buyer-storefront release units (FE — from Frontend@L)

| ID | Feature | Route(s) | Status |
|----|---------|----------|--------|
| SHOP-001 | Browse Shop (Product Listing) | `shop.html` + creators/events/popcorn/auction | implemented (proto) |
| SHOP-002 | Product Detail (Goods) | `shop-item.html` | implemented |
| SHOP-003 | Bundle Product (套組) | `shop-item.html` | implemented |
| SHOP-004 | Shopping Cart | cart drawer | implemented |
| SHOP-005 | Quick Add to Cart (PLP) | `shop*.html` | implemented |
| SHOP-006 | Checkout (multi-step) | checkout drawer | implemented |
| SHOP-007 | Wishlist / Save Item | `shop*.html` | implemented |

*"implemented" = static prototype UI in Frontend@L; no backend wired yet. Each `FE/*.md` is a full spec (routes · sourceFiles · states · acceptance criteria).*

## Prototype

`FE/prototype/` — a **self-contained slice** of the shop pages + shared chrome + shop assets/images. Open `FE/prototype/shop.html` in a browser. Links to non-shop pages (creator profiles, index, etc.) are out of slice and will 404 — this is a shop-focused extract, not the full site. Provenance + how to detect upstream updates: **`SOURCE.md`**.

## Operator side (CS)

- `CS/feature-scope.md` — full eShop feature scope (**S** Shop · **O** Orders · **E** Earnings · **B** Buyer), tagged `p1` / `next` / `tbd`.
- `CS/feature-scope-map.html` — interactive scope map (also live: https://ztor-eshop-proto.vercel.app/eshop-feature-scope-map.html).

## Supporting docs (`_docs/`)

- `brd-v1.md` — Business Requirements v1.1
- *(eShop ADRs are kept in the personal `ztor-docs/decisions/` repo — not bundled into this company repo)*
- `ingestion-brief.md` · `phase1-progress.md` · `shop-pay-integration.md`
- `wireframe-v0.4.html`

## Not included (by decision, 2026-06-30)

- **Clickable Next.js prototype** → lives in `NukeGozilla/ztor-eshop-proto` (live: https://ztor-eshop-proto.vercel.app/).
- **Designer-proto mirror** → superseded by this Frontend@L ingest.
