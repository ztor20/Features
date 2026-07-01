# Shop — Detail Pages (all item types) + Mobile Shopping Surface

Work in `D:\Ztor. 2.0\L-2.0-EndGame`. Read the pointed-to files; don't trust this prompt over the code. **One-shot** — honour the self-gates below (reproduce the mobile cart/add bug before fixing; build ONE detail page fully, then propagate to the other types). Front-end only: no real payment/auth/persistence — mock + labelled stubs. **The look must read premium / luxury**, grounded in Mobbin's best ecommerce and skinned strictly with Ztor's existing dark + orange tokens.

## CONTEXT — read first (don't dump, read)
- **`BUILD-PROMPT-TEMPLATE.md`** — verified Phase 0 (tokens; generated `components.css` + `node tools/build-css.mjs`; `DS.register` registry; new-page head/script order; gates; the mobile layer — `@media` token block, `33-mobile-tweaks.css`, `43-bottom-nav.css`, `44-mobile-drawer.css`, `mobile-nav.js`). Load it.
- `CLAUDE.md`, `AGENTS.md` (incl. **image/asset rules** — WebP, kebab-case content names, descriptive `alt`, `loading="lazy"`), `COMPONENTS.md`, `docs/DESIGN_SYSTEM.md`.
- **Shop today:** PLP pages `shop.html` / `shop-creators.html` / `shop-popcorn.html` / `shop-events.html` / `shop-auction.html`, all rendered by **`assets/shop-render.js`** from **`assets/shop-data-*.js`** (`products`, `popcorn`, `events`, `creators`, `auction`, `fans`, `imgmap`). The cart drawer is **`assets/cart.js` + `assets/cart.css`** (delegated `[data-add]` add-to-cart; `header__cart` trigger).
- **Card → detail is DEAD:** cards render as `<a class="shop-card" href="#">` and `shop-render.js` (~line 310) **suppresses** the click — there is **no detail page anywhere** (only creator cards link to `creator-<slug>.html`).
- **Data is minimal:** a product is `{ id, name, cat, ntd, hkd, badge, soldOut }` — **no images, description, variants, angles, or video.** Card images come from `prodImg(id)` → `assets/images/shop/g/<map>.webp` (via `imgmap`) or a placeholder. A PDP needs an **extended data model** + **generated multi-angle photos**.
- **Add-to-cart quick-add** (`assets/refine-shop.css` ~129) is a **hover-reveal** "Faire" pattern; a touch rule (~164, `@media (hover:none),(pointer:coarse)`) makes it static — **but the owner reports mobile add/cart is broken; reproduce it (see self-gate).** Note `refine-shop.css` is **`body.rf-shop` page-keyed** (the anti-pattern the repo is migrating off) — put NEW css in `css/components/`, not there.

⚠ `CLAUDE.md`/`COMPONENTS.md` "what's cut" notes are stale — trust the code; verify in a browser.

## DESIGN SYSTEM RULES
Don't re-derive — in `BUILD-PROMPT-TEMPLATE.md`. Feature-critical: new component CSS → `css/components/NN-name.css` + `@import` in `css/main.css` + `node tools/build-css.mjs`; never hand-edit `components.css`/`tokens.css`; tokens only (no hardcoded hex). Behaviour → `DS.register` in `ds.js` (delegated, MutationObserver-safe, like `cart.js`), never inline per page. Reuse `media-glass`, `ds-skeleton`, `ds-drawer`, `glass-tabs`, `status-tag`, buttons. **Do not extend the `body.rf-shop` page-keyed `refine-shop.css`** — author the PDP + the fixed quick-add as proper components keyed to their class.

## THE FOUR NON-NEGOTIABLES (verbatim — do not soften)

**[1] TOKEN & COMPONENT DISCIPLINE**
- NEVER hardcode a value (color, size, spacing, font, radius, z-index, breakpoint). Always reference a token.
- New tokens and new component CSS files ARE allowed — but ONLY after proving the design system doesn't already cover it.
- SEARCH-BEFORE-CREATE (mandatory): before any new token, search the token layer for an exact OR semantic equivalent; before any new component CSS, search existing components. Create only if none exists.
- Any new token/component MUST follow the Phase 0 layering, structure, and naming convention — no ad-hoc patterns.
- Log every new token/component + the search that confirmed it was missing, in HANDOFF.md.
- Prevent: duplicate tokens, near-duplicate components, scattered hardcoded values.

**[2] FEATURE = COMPLETE FLOW**
- A terse feature name means build the COMPLETE end-to-end user flow — not one screen.
- Decompose into every page, state, and interaction a real user needs start-to-finish. Map it as a FLOW INVENTORY.
- Every button/link resolves — no dead-ends, no orphan buttons. Include empty/loading/error/success/out-of-stock-type states.
- Front-end only: full UX with mock data + clearly-labeled backend stubs. NO real payment/auth/persistence — client-side validation + mock responses. Log every backend integration point in HANDOFF.md.
- BOUNDED: complete WITHIN the named feature — NOT expand into others. Ambiguous edges → propose the full flow, flag optional extensions for the user's call.

**[3] MOBBIN REFERENCE GATE**
- Before designing any feature flow, use Mobbin to ground flow + screen patterns in real, proven products.
- Pull the same flow from AT LEAST 3 (here: the TOP 5) top apps/sites; synthesize the COMMON pattern (steps, screen structure, key UI, states). This drives the Flow Inventory.
- Mobbin governs STRUCTURE/FLOW/UX ONLY — it does NOT override visuals. Skin every pattern with Ztor tokens + components. Reference the pattern, not the app's colors/type/logo.
- Cite which apps were used. Synthesize, don't average into mush; don't clone any single app's look.
- Product-specific flows with no clean match → adapt the closest convention, don't force-fit; flag these. If Mobbin returns nothing usable → STOP and flag.

**[4] PRECEDENCE (when inputs conflict)**
1. Ztor design system (tokens/components) = visual law. Nothing overrides it.
2. Figma / screenshot / reference site (if supplied) = exact visual spec for that screen.
3. Mobbin = flow/structure/UX-pattern source (≥3 apps).
4. EverythingAbtZtor.md = product, copy, IA truth.
→ Mobbin decides the skeleton; the Ztor design system supplies the skin. Never the reverse.

## OTHER CONSTRAINTS
- Vanilla HTML/CSS/JS (ES modules). No framework/CSS-framework/jQuery. Pages run static (CSS build is authoring-only).
- **Premium / luxury** is the visual bar — achieve it through Mobbin-grounded layout + Ztor's tokens (generous whitespace, large refined imagery, restrained type, the dark canvas + single orange accent, `media-glass`), NOT new colours or hardcoded styles. Brand rule: **no drop shadows** except the sanctioned glass material.
- **Images:** generate 3–4 **multi-angle** product shots per item with the **Higgsfield MCP**; save as WebP, kebab-case content names under `assets/images/shop/...`, register in `imgmap`/the item's `images[]`. If Higgsfield is unavailable, use styled placeholders and list every swap point in HANDOFF.md. Each PDP also has a **video slot** that shows a styled placeholder player when no real clip exists.
- Language: zh-Hant + 繁中/EN via `i18n.js` + `locales/en.json` (add entries for all new copy). Correct `lang` attrs.
- **Mobile is first-class, not a shrink.** Design every PDP + the shopping surface at mobile (375) and desktop (≥1280); ≥44px touch targets; gallery swipes on touch.
- WCAG 2.2 AA; `prefers-reduced-motion`; Lighthouse ≥90; progressive enhancement.

## SCOPE
**(A) A detail page for EVERY item type** — goods, creator-merch, **bundles (套組)**, popcorn, events, auction — each entered by making the PLP card link to it (stop suppressing the click). One **param-driven template per family** (e.g. `shop-item.html?id=…` reading `shop-data`), with type modules:
- **Goods / creator-merch PDP:** image gallery (multi-angle + zoom) · video slot · price (NTD/HKD) · variant selector (size/colour where relevant) · qty · **add-to-cart** · wishlist · description/specs · shipping/returns · "you may also like".
- **Bundle PDP (套組):** a bundle is several items sold together (e.g. 1 hat + 1 vinyl + 1 tee). Hero/composite media + price (with the struck "原價" / saving vs. buying separately, using the existing `shop-card__price-was` pattern) + **a "套組內容 / What's inside" section that displays EACH included item with its OWN photos + name** (a clean grid or stacked rows; each item's mini-gallery viewable; optional link to that item's own PDP). Variant pickers per included item where relevant (e.g. tee size). Adds to cart as ONE bundle line. **Mobbin a "set / kit / bundle" PDP** (beauty sets, gift bundles, gaming editions) for the elegant "what's inside" pattern. Note `套組` already exists as a creator-storefront sub-tab (`[data-shop-tab="bundles"]` in `ds.js`) — check `shop-data` for existing bundle entries and EXTEND, don't duplicate.
- **Popcorn PDP:** the redeem/rent proposition + **redeem/rent CTA** (popcorn is currency/rental, not shipped).
- **Event PDP:** date/venue/lineup + **select-ticket CTA**.
- **Auction PDP:** lot gallery + live status (current bid · time left · bidders) + **place-bid CTA**.
*(The actual checkout / bid-submission / ticket-purchase / redemption COMPLETIONS are prompt 2 — here each PDP CTA puts the item into the right pending state and confirms; wire the CTA to open the existing cart drawer / a clearly-stubbed next step, never a dead button.)*
**(B) Fix the mobile shopping surface:** add-to-cart usable on touch on every PLP + PDP, and a **cart entry point on mobile** (header and/or bottom-nav) so the cart drawer is reachable. **Extend the data model** (`images[]`, `description`, `specs`, `variants`, `video`, type fields) across `shop-data-*.js`.
Bounded: no checkout/payment here (prompt 2); don't rebuild the PLP grids or the cart drawer — extend them.

## DIAGNOSIS — mobile add-to-cart / cart (TO VERIFY, debug self-gate)
A touch rule for `.rf-quickadd` exists, yet the owner reports mobile can't add or open the cart. Reproduce in a browser at 375px (`py -3 -m http.server`): does the quick-add show + fire on tap on each PLP? Is `body.rf-shop` present on every shop page (the rule is page-keyed)? Is there ANY cart trigger in the mobile header/bottom-nav (there is none today — `header__cart` is desktop-only)? **State the confirmed cause before changing code.**

## VISUAL SOURCE
Mobbin **top-5 luxury / premium ecommerce** apps — study their **PDP** (gallery, variant UX, sticky buy bar, zoom) and PLP add-to-cart/cart patterns. Structure only; skin with Ztor tokens. Generate product imagery with Higgsfield.

## FLOWCHART + SCREEN/STATE MATRIX (build every row)
```mermaid
flowchart TD
  PLP[Shop PLP grid] -->|tap card| PDP{Item type}
  PLP -->|quick-add: desktop hover / MOBILE static tap| ADD[Add to cart]
  MOB[Mobile] --> CARTBTN[Cart button in header + bottom-nav] --> CARTD[Cart drawer (exists)]
  PDP -->|goods / creator-merch| G[Goods PDP: gallery·video·variants·qty·add-to-cart·wishlist·specs·related]
  PDP -->|bundle 套組| BND[Bundle PDP: 套組內容 — each included item shows its OWN photos]
  PDP -->|popcorn| P[Popcorn PDP: redeem / rent CTA]
  PDP -->|event| E[Event PDP: date/venue/lineup · select-ticket CTA]
  PDP -->|auction| A[Auction PDP: lot gallery · live status · place-bid CTA]
  G --> ADD --> CARTD
  BND --> ADD
  CARTD -. checkout .-> NEXT[Prompt 2: checkout / bid / ticket / redeem completions]
  G -. variant out of stock / sold out / added toast .-> G
```

| Screen | States to build (all) | Controls — each MUST act |
|---|---|---|
| PLP card (desktop) | default · hover · sold-out · added | card→PDP · quick-add→cart · wishlist |
| PLP card (mobile) | default (quick-add **static, visible**) · sold-out · added | tap card→PDP · tap add→cart · wishlist |
| Mobile cart entry | count 0 · count N | header/bottom-nav cart → opens cart drawer |
| Goods/creator PDP | loading skeleton · default · variant-selected · variant-out-of-stock · sold-out · added toast | gallery swipe/zoom · video play(placeholder) · variant · qty · add-to-cart · wishlist · related→PDP |
| Bundle PDP (套組) | loading · default · included-item-expanded · sold-out · added | each included item's photos/gallery · per-item variant · add-bundle-to-cart · view-item→PDP |
| Popcorn PDP | default · redeemed/added | redeem/rent CTA · gallery |
| Event PDP | upcoming · sold-out | select-ticket CTA · gallery/lineup |
| Auction PDP | live · ending-soon · ended | place-bid CTA · live status · gallery |
| Cart drawer (existing) | empty · items · mobile-reachable | qty± · remove · checkout (→ prompt 2 stub) |

## ARCHITECTURE & HANDOFF
- **PDP template:** param-driven (`shop-item.html?id=…` etc.) rendered by a new `assets/shop-detail-render.js` reading `window.ZTOR_SHOP` — mirror the existing `shop-render.js`/`cart.js` patterns; behaviours via `DS.register`. Make PLP cards link to the PDP (`href` to the template with the id; stop suppressing the click for non-creator cards).
- **Data model:** extend each `shop-data-*.js` item with `images: [..]`, `description`, `specs`, `variants`, `video`, and type-specific fields. **A bundle carries `type:"bundle"` + `components: [{ name, images:[..], variants? }]`** — each included item with its own photos. Keep back-compat with the PLP renderer.
- **Mobile cart:** add a cart control to the mobile header and/or `43-bottom-nav.css` + `mobile-nav.js`, bound to `cart.js`'s open; show the item count.
- **Quick-add fix:** make add-to-cart a real component (out of `body.rf-shop` refine), reliably visible + tappable on touch.
- **Images via Higgsfield**, named/optimised per `AGENTS.md`; log every generated asset + every placeholder swap point in HANDOFF.md.
- **HANDOFF.md:** the flowchart + matrix; new data fields; new components (PDP, mobile cart, quick-add) + their search; Mobbin apps used; Higgsfield assets + placeholders; backend stubs (cart/wishlist persistence, inventory); how to run/build; known gaps. Update `COMPONENTS.md`.

## DEFINITION OF DONE (self-certify before presenting)
- **Every item in shop / creator-merch / bundles / popcorn / events / auctions opens a detail page** with multi-angle gallery + video slot + the type-correct CTA; **bundle PDPs show each included item with its own photos**; no card is a dead `href="#"`.
- **Mobile:** add-to-cart works on tap on every PLP + PDP, and the cart drawer is reachable from a mobile cart button — verified in a browser at 375px (root cause of the old failure documented).
- Every screen + state in the matrix built + styled at **mobile + desktop**; every control acts; loading/sold-out/out-of-stock/added all render; reads premium/luxury; gates pass (`build-css.mjs`, `check-tabstick-gap.mjs`, hex grep); clean console.
- No placeholders-as-screens, no "later phase", no dead controls. Genuine out-of-scope (the completions) → HANDOFF.md, wired to a clearly-labelled next step, never a dead button.

## WORKFLOW (one-shot, with self-gates)
1. **Self-gate (debug):** reproduce + confirm the mobile add-to-cart / cart-button cause before refactoring.
2. **Think first:** Mobbin top-5 (PDP + PLP-cart) + synthesis; token/component audit (reuse cart.js, media-glass, ds-skeleton, ds-drawer, glass-tabs); extend the data model; confirm the flowchart + matrix.
3. **Self-gate (blast radius):** build ONE PDP (a goods item) fully + the mobile cart fix; self-verify desktop + mobile; **then** propagate the PDP to the other types + all items.
4. Generate imagery via Higgsfield as you build each type.
5. Small commits (data model → mobile cart fix → goods PDP → each type → quick-add component).
6. **SHOW EVIDENCE:** browser screenshots of each PDP type + the mobile PLP add + mobile cart open, at 375 + ≥1280; a click-test of every CTA; clean console; passing gates. Keep HANDOFF.md current.

## DON'TS
- Don't leave any card as a dead `href="#"`; don't ship a PDP type without its gallery + CTA.
- Don't extend the `body.rf-shop` page-keyed `refine-shop.css` — author components in `css/components/`.
- Don't implement real payment/auth here (prompt 2); don't build the checkout — wire CTAs to the cart/next-step.
- Don't hardcode hex / sizes; no new global z-index; no drop shadows (glass only).
- Don't clone a Mobbin app's colours/type — structure only, Ztor skin.
- Don't naive-shrink for mobile; don't declare done until the mobile cart works in a browser and every matrix row passes the Definition of Done.
