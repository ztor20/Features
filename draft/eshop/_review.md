# eShop — Draft Review

**Status: DRAFT — needs review**

Staged 2026-06-30. Buyer storefront (**FE**) ingested from `Frontend@L`; operator scope (**CS**) + supporting docs folded in.

## Review checklist

- [ ] FE specs (SHOP-001…007) accepted as the buyer-storefront **roadmap release units**
- [ ] Prototype slice renders acceptably (`FE/prototype/shop.html`)
- [ ] CS feature-scope (`p1` / `next` / `tbd`) confirmed with biz team
- [ ] Build-status column source resolved (Asana dev board vs dev feature list) — **OPEN**
- [ ] POPCORN-as-currency gap raised with dev team (**POPCORN is absent from the dev feature list** — 定价 = 价格/原价 only)
- [ ] `draft/eshop` → `shipped/` once accepted **and** integrated into the master site

## Open items carried from scoping

- **Build-status reconciliation** (prototype vs dev list vs Asana) — paused, to resume.
- **4 P1 gaps not yet ticketed:** S30 POPCORN price · B06 POPCORN checkout · B09 goods pickup QR · S13 product-list sort.
- Prototype is 34 MB (205 shop images + fonts) — can be slimmed (drop `.jpg` duplicates of `.webp`) if repo weight matters.
