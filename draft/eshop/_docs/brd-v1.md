# Business Requirements — Ztor eShop Integration

*Version 1.1 · Draft · 2026-06-15 · Owner: Jeff Yang*
*Companion wireframe (v0.4): https://aic-output.vercel.app/ztor/ztor-eshop-wireframe-2026-06-11.html*
*Clickable prototype: https://ztor-eshop-proto.vercel.app/*
*Source of truth: Jun 11/12 eShop meeting decisions + Beamco commerce-module ground truth*

> **v1.1 revision (2026-06-15):** synced the screen model to the shipped prototype — the Spotlight home carries the Artist Shops + New & Trending Merch rails, a **dedicated `/shops` browse page** exists alongside them, and payment-rail selection happens at **checkout** (not on the product page). BRs unchanged; BR-10 and the screen map updated below.

> ⚠️ **Status:** First draft. Four items remain open and are marked **⚠️ OPEN** throughout: platform revenue cut, dynamic-QR blocker scope, creator-registration approval policy, and the commerce-module API spec. These must be closed before the corresponding BRs can be fully built.

---

## Section 1: Problem Statement

Beamco's artist community runs merch storefronts ("eShop") on a platform that is moving to maintenance as ~80% of its engineering shifts to Ztor 2.0 Creator Studio. Those artists need a durable home for selling physical merch, and Ztor — today a film/OTT rental platform with no creator-commerce surface — needs exactly that capability to deliver the Creator Studio swimlane and the broader "Follow the Money" creator-economy vision.

If we don't build this, Beamco artists lose their storefronts as 1.0 winds down, Ztor 2.0 ships without a commerce surface, and the platform forfeits a recurring creator-revenue stream that anchors the IP-economic narrative. Because Beamco's backend was architected multi-tenant from day one (with Ztor a named tenant), the efficient path is to **wrap the existing commerce module as a microservice** rather than rebuild — turning a migration risk into a reuse win, against a **Jul 30 internal-ready / first-week-of-August launch** target.

---

## Section 2: User Groups

| User Group | Role Description | Access Level | Key Need |
|---|---|---|---|
| **Buyer (Ztor user)** | Existing Ztor fan/viewer browsing and purchasing artist merch | View + purchase (frontend) | Discover and buy artist merch with fiat or POPCORN, then collect it |
| **Creator (Artist)** | Shop owner migrated from Beamco; manages own storefront | Scoped admin — own shop only | Manage products, orders, and reports for their own shop |
| **Admin (Ops)** | Internal staff operating Creator Studio | Global admin + role-assumption | Onboard creators, and operate any creator's shop on their behalf in v1 |
| **CMS Editor (Ops)** | Curates frontend shop/product placement | Content admin | Control which shops/products surface, and in what order |
| **Commerce Microservice** | Wrapped Beamco `commerce` + `base` modules | System actor | Serve Shop/Product/Inventory/Order + payment/auth across tenants |
| **Stripe** | Payment gateway (fiat rail) | External system | Process card/wallet payments for eShop orders |
| **POPCORN Ledger** | Ztor's existing virtual-currency system | Internal system | Debit POPCORN for purchases priced in the dual-currency model |
| **Dynamic QR Service** | Token/ID generator for pickup verification | System actor | Issue and validate rotating pickup codes |

---

## Section 3: User Stories

> **US-01:** As a **Buyer**, I want to browse an artist's shop from their profile or a shareable link and buy merch in either fiat or POPCORN, so that I can support artists I follow without leaving Ztor.

> **US-02:** As a **Buyer**, I want to collect my purchase via a secure pickup code, so that I can receive physical goods even though full logistics isn't wired up yet.

> **US-03:** As a **Creator**, I want a single place to manage my products, orders, and earnings reports for my own shop, so that I can run my merch business without seeing or touching other artists' data.

> **US-04:** As an **Admin**, I want to create a creator profile and have their eShop generated automatically, so that onboarding an artist is one step instead of two disjoint ones.

> **US-05:** As an **Admin**, I want to select any creator and operate their shop in their role, so that I can run shops on artists' behalf before self-serve SSO ships.

> **US-06:** As a **CMS Editor**, I want to control which shops and products appear on the Ztor homepage and in what order, so that merchandising is curated and only launch-ready shops are public.

> **US-07:** As a **Creator**, I want to publish an intro post to the social feed when I list a product, so that my followers learn about a drop in context rather than via a bare catalog.

---

## Section 4: User Flow

### Flow A — Admin onboards a creator (Creator Studio)

```
Step A1: Admin → opens Creator Studio → Creators module loads (global list)
Step A2: Admin → "Create creator" (name, handle, link Store account) → system validates handle uniqueness
Step A3: System → on save, auto-generates the creator's eShop (no separate "create shop" step)
Step A4: 🔀 Decision: does opening creator registration require approval? ⚠️ OPEN
  → YES: profile enters pending-approval state until business signs off
  → NO: profile is immediately operable
Step A5: Admin → selects a creator from the list → enters that artist's role-scoped modules (Products/Orders/Reports)
Step A6: Admin → adds products with dual pricing (cash base; POPCORN auto-converted) → saves as Draft
Step A7: Admin → sets shop/products to Published → CMS surfaces them on the frontend
```

### Flow B — Creator manages own shop (phase 2 via SSO; v1 = admin acts on behalf)

```
Step B1: Creator → SSO login → lands directly in own shop's Products module (no Creators module)
Step B2: Creator → manages products / views orders / views reports — scoped to own shop only
Step B3: Creator → on listing a product, optionally authors an intro post → posted to Store social feed
```

### Flow C — Buyer purchase & fulfillment (happy path)

```
Step C1: Buyer → discovers a shop (home rail · feed post · social link · creator profile)
Step C2: Buyer → opens shop landing (/shop/:handle ≡ creator profile Shop tab)
Step C3: Buyer → opens product detail (variants, dual-currency price)
Step C4: Buyer → "Buy now" → selects payment rail
Step C5: 🔀 Decision: fiat or POPCORN?
  → FIAT: Stripe on-page checkout (cards / Apple / Google Pay)
  → POPCORN: debit POPCORN balance via existing Ztor flow (UI shows USD-mapped amount, not "buying tokens")
Step C6: System → confirms order → records order, settles creator income in cash
Step C7: System → issues a dynamic pickup QR (rotating token) for local pickup
Step C8: Buyer → presents QR at pickup → operator validates token/ID → order marked Completed
```

**Exception / error paths:**
- C3-E: Product out of stock or quantity 0 → "Buy now" disabled, product shown as sold out (⚠️ quantity-0 UI treatment OPEN).
- C5-E: Fiat payment fails at Stripe → order not created, buyer returned to product detail with error; POPCORN debit failure → transaction rolled back, balance untouched.
- C5-E2: Platform-level currency switch has a rail disabled → only the enabled rail is offered; if both disabled, checkout is unavailable.
- C7-E: No refunds in v1 → cancellation/return requests are handled offline by ops, not in-system.

### Section 4a: 📊 User Flow Diagram

The user-flow board on the **companion wireframe (v0.4)** is the canonical visual for these three flows (Admin / Creator / Buyer swimlanes with the fiat-vs-POPCORN and approval decision points):
https://aic-output.vercel.app/ztor/ztor-eshop-wireframe-2026-06-11.html (Board 1 · User Flows)

---

## Section 5: Business Requirements

**BR-01: Commerce microservice integration via Ztor-owned gateway**
- **Description:** The system SHALL expose the wrapped Beamco `commerce` + `base` modules to Ztor through a Ztor-owned client API gateway, distinct from Beamco's fans-site gateway, mapping each Ztor session to the correct commerce tenant context.
- **Priority:** 🔴 Must-Have
- **User Group(s):** Commerce Microservice, all frontend groups
- **Measurability:** A Ztor-authenticated request resolves to the Ztor tenant and returns only Ztor-scoped commerce data in 100% of tenancy test cases; Beamco gateway is never called by Ztor surfaces.

**BR-02: Creator profile creation auto-generates eShop**
- **Description:** The system SHALL, upon creation of a creator profile in Creator Studio with a linked Store account, automatically generate that creator's eShop with no separate shop-creation step.
- **Priority:** 🔴 Must-Have
- **User Group(s):** Admin
- **Measurability:** 100% of newly created creator profiles have an associated eShop record immediately on save; the legacy back-office "Create eShop" action does not exist.

**BR-03: Unique vanity handle registry**
- **Description:** The system SHALL enforce a unique public handle per creator, reserving system words and supporting a defined rename policy, and resolve `/shop/:handle` to that creator's shop.
- **Priority:** 🔴 Must-Have
- **User Group(s):** Admin, Buyer
- **Measurability:** Duplicate or reserved-word handles are rejected at save; `/shop/:handle` resolves to the correct shop for 100% of published handles.

**BR-04: Two-POV permission model**
- **Description:** The system SHALL gate Creator Studio access by role: Admin sees the global Creators module and can role-assume into any creator's scoped modules; Creator sees only their own Product/Orders/Reports with no Creators module and no cross-artist access.
- **Priority:** 🔴 Must-Have
- **User Group(s):** Admin, Creator
- **Measurability:** Admin cannot open Product/Orders/Reports without first selecting a creator; a Creator session can never read or write another creator's data across all access-control test cases.

**BR-05: Physical product & bundle management with dual pricing**
- **Description:** The system SHALL allow creating/editing physical products (variants, inventory, cost-per-item) and bundles, storing a cash base price and an auto-converted POPCORN price in independent fields.
- **Priority:** 🔴 Must-Have
- **User Group(s):** Admin, Creator
- **Measurability:** Cash and POPCORN prices persist as separate values with no rounding drift on round-trip; virtual goods, music, event tickets, and membership cards cannot be created.

**BR-06: Shop storefront unified with creator profile**
- **Description:** The system SHALL render the creator's shop as the Shop tab of their profile and resolve the vanity URL `/shop/:handle` to that same page, sourcing both from one shop record.
- **Priority:** 🔴 Must-Have
- **User Group(s):** Buyer
- **Measurability:** Profile Shop tab and `/shop/:handle` display identical product data from a single source; Shop tab renders only when the creator has a shop.

**BR-07: Dual-currency checkout with platform-level switch**
- **Description:** The system SHALL offer checkout in fiat (via Stripe) and/or POPCORN, with a platform-level on/off switch per rail, presenting POPCORN as a USD-mapped amount rather than a token purchase.
- **Priority:** 🔴 Must-Have
- **User Group(s):** Buyer
- **Measurability:** With both rails on, buyer can complete a purchase via either; toggling a rail off removes it from checkout within one session; POPCORN UI never prompts a "buy tokens" step.

**BR-08: Order recording and status lifecycle**
- **Description:** The system SHALL record each completed purchase as an order and track it through Processing → (pickup) → Completed, with creator income settled in cash.
- **Priority:** 🔴 Must-Have
- **User Group(s):** Admin, Creator, Commerce Microservice
- **Measurability:** Every successful payment yields exactly one order record with correct line items and status; creator earnings post in cash currency.

**BR-09: Dynamic QR pickup**
- **Description:** The system SHALL issue a rotating-token pickup code (refresh 5–30s) per eligible order, verifiable by an operator via token/ID lookup without storing the QR image, to fulfill local pickup. ⚠️ OPEN: full scope of the QR generator is an Asana blocker.
- **Priority:** 🔴 Must-Have
- **User Group(s):** Buyer, Commerce Microservice, Dynamic QR Service
- **Measurability:** A presented code validates only within its refresh window; a screenshotted/expired code is rejected; operator validation marks the order Completed.

**BR-10: Shop discovery surfaces (CMS-curated)**
- **Description:** The system SHALL surface artist shops and trending merch through the existing CMS Content Block pattern across three placements — the Spotlight home **Artist Shops** rail, the Spotlight home **New & Trending Merch** rail, and a **dedicated `/shops` browse page** (full shop grid + trending merch) — all supporting manual and conditional sort and showing only Published shops.
- **Priority:** 🟡 Should-Have
- **User Group(s):** Buyer, CMS Editor
- **Measurability:** Unpublished shops never appear on any of the three surfaces; CMS sort order is reflected on the frontend; the home rail's "view all" routes to `/shops`; each card deep-links to its shop landing.

**BR-11: Publication gating**
- **Description:** The system SHALL prevent any shop or product in Draft state from appearing on any Ztor frontend surface (rail, profile, search, direct URL).
- **Priority:** 🔴 Must-Have
- **User Group(s):** CMS Editor, Buyer
- **Measurability:** A Draft shop returns not-found/hidden on `/shop/:handle` and is absent from all listings across test cases.

**BR-12: Product-drop social post**
- **Description:** The system SHALL allow a creator (or admin on their behalf) to author an intro post with an attached product card when listing a product, publishing it to the Store social feed.
- **Priority:** 🟢 Nice-to-Have
- **User Group(s):** Creator, Buyer
- **Measurability:** A product-drop post renders in the feed with a working product card that links to product detail; posting is opt-in, never automatic.

### Section 5a: 📊 System Diagram

The architecture board on the **companion wireframe (v0.4)** is the canonical system diagram — Clients (Ztor Web FE / Creator Studio) → Ztor client gateway → Beamco commerce module, plus the Money & Fulfillment column (Stripe fiat rail, POPCORN rail, artist wallet, dynamic QR):
https://aic-output.vercel.app/ztor/ztor-eshop-wireframe-2026-06-11.html (Board 3 · Architecture Sketch)

Module → BR mapping: **Ztor client gateway** (BR-01) · **Creator Studio** (BR-02, BR-04, BR-05, BR-08, BR-12) · **Handle registry** (BR-03) · **Storefront/Web FE** (BR-06, BR-10, BR-11) · **Checkout** (BR-07) · **Commerce module / orders** (BR-08) · **Dynamic QR service** (BR-09).

---

## Section 6: Acceptance Criteria

**BR-01: Commerce microservice integration**
- ✅ **AC-01a:** GIVEN a Ztor-authenticated session, WHEN any commerce call is made, THEN it resolves to the Ztor tenant and returns only Ztor-scoped data.
- ✅ **AC-01b:** The Ztor Store FE issues no requests through Beamco's fans-site gateway.

**BR-02: Auto-generate eShop**
- ✅ **AC-02a:** GIVEN a new creator profile with a linked Store account, WHEN saved, THEN an eShop record exists for that creator.
- ✅ **AC-02b:** No standalone "Create eShop" action is present in any back office.

**BR-03: Handle registry**
- ✅ **AC-03a:** WHEN a duplicate or reserved handle is submitted, THEN save is rejected with a validation message.
- ✅ **AC-03b:** GIVEN a published handle, WHEN `/shop/:handle` is requested, THEN the correct shop renders.

**BR-04: Two-POV permission model**
- ✅ **AC-04a:** GIVEN an Admin session, WHEN no creator is selected, THEN Product/Orders/Reports are inaccessible.
- ✅ **AC-04b:** GIVEN a Creator session, WHEN they attempt to access another creator's data by any route, THEN access is denied.
- ✅ **AC-04c:** GIVEN an Admin selects a creator, THEN the opened modules are scoped to that creator's data.

**BR-05: Product & bundle management**
- ✅ **AC-05a:** WHEN a product is saved, THEN cash and POPCORN prices persist as independent values with no rounding drift on reload.
- ✅ **AC-05b:** System SHALL NOT allow creating virtual goods, music, event tickets, or membership cards.
- ✅ **AC-05c:** A bundle groups ≥2 physical products at a bundle price.

**BR-06: Unified storefront**
- ✅ **AC-06a:** Profile Shop tab and `/shop/:handle` display identical products from one source.
- ✅ **AC-06b:** The Shop tab is absent when the creator has no shop.

**BR-07: Dual-currency checkout**
- ✅ **AC-07a:** GIVEN both rails enabled, WHEN buyer checks out, THEN both fiat and POPCORN are selectable and each completes a purchase.
- ✅ **AC-07b:** GIVEN a rail is toggled off at platform level, THEN it is not offered at checkout.
- ✅ **AC-07c:** POPCORN checkout displays a USD-mapped amount and never shows a separate token-purchase step.

**BR-08: Order lifecycle**
- ✅ **AC-08a:** WHEN payment succeeds, THEN exactly one order is recorded with correct line items.
- ✅ **AC-08b:** Order status transitions Processing → Completed; creator earnings post in cash.

**BR-09: Dynamic QR pickup**
- ✅ **AC-09a:** WHEN a code is presented within its refresh window, THEN it validates; outside the window it is rejected.
- ✅ **AC-09b:** WHEN an operator validates a code, THEN the order is marked Completed.
- ✅ **AC-09c:** System SHALL NOT accept a re-used/expired (screenshotted) code.

**BR-10: Homepage rail**
- ✅ **AC-10a:** Only Published shops appear in the rail.
- ✅ **AC-10b:** CMS sort order (manual/conditional) is reflected on the frontend.

**BR-11: Publication gating**
- ✅ **AC-11a:** A Draft shop returns not-found/hidden on `/shop/:handle`.
- ✅ **AC-11b:** Draft shops/products are absent from rail, search, and profile.

**BR-12: Product-drop post**
- ✅ **AC-12a:** A product-drop post renders with a product card linking to product detail.
- ✅ **AC-12b:** Posting is opt-in; no post is created without explicit author action.

---

## Section 7: Do / Don't / Edge Cases

**✅ Do:**
- Reuse the Beamco commerce/base modules as-is via the microservice wrapper; treat Ztor as a tenant, not a fork.
- Build the Ztor client API gateway as a Ztor-team responsibility, separate from Beamco's fans gateway.
- Keep cash as the price-of-record; derive POPCORN by conversion at display/checkout time but store both.
- Reuse existing Ztor patterns: profile/tab grammar for the storefront, CMS Content Blocks for the rail, the existing POPCORN spend flow for that rail.

**❌ Don't:**
- Don't build a standalone "create shop" step — shop creation is a side effect of creator-profile creation.
- Don't expose Draft shops/products on any frontend surface.
- Don't give Admin a global cross-creator Product/Orders/Reports view — access is always via role-assumption into one creator.
- Don't implement in-system refunds in v1; don't add logistics/shipping integration in v1.
- Don't present POPCORN payment as "buying virtual currency."
- Don't bring non-physical SKUs (music, tickets, memberships, standalone digital) into v1 scope.

**⚠️ Edge Cases:**
- **Quantity 0 / out of stock:** product shows sold-out and disables purchase (⚠️ exact UI treatment OPEN).
- **Both currency rails disabled:** checkout surfaces as unavailable rather than erroring mid-flow.
- **Handle rename after promotion:** old `/shop/:handle` must not silently 404 without a redirect policy (define in rename policy, BR-03).
- **POPCORN debit succeeds but order write fails:** debit must roll back; no orphaned charge.
- **Admin role-assumed session leakage:** exiting a creator context must fully drop that creator's scope.
- **Expired/replayed QR code:** rejected; operator sees a clear invalid state.

---

## Section 8: Dependencies & Integration Points

| ID | Dependency | Type | Impact | Status |
|---|---|---|---|---|
| DEP-01 | Beamco `commerce` + `base` modules wrapped as microservice | Blocked-by | No eShop without it; core of the build | Known |
| DEP-02 | Commerce module REST/API spec (endpoints, schemas) | Blocked-by | Gateway/middleware cannot be built without it | ⚠️ Needs Investigation — undocumented |
| DEP-03 | Ztor client API gateway (Ztor/Eric team) | Blocks | Front-end can't reach commerce data | Known |
| DEP-04 | Stripe integration (fiat rail) | Integrates-with | No fiat checkout without it | Known |
| DEP-05 | POPCORN ledger / existing spend flow | Integrates-with | No POPCORN checkout without it | Known |
| DEP-06 | Dynamic QR generator service | Blocked-by | No local-pickup fulfillment; flagged Asana blocker | ⚠️ Needs Investigation — scope undefined |
| DEP-07 | CMS Content Block system | Integrates-with | No curated rail / publication gating without it | Known |
| DEP-08 | Creator-registration approval policy | Blocks (onboarding) | Determines whether creator sign-up gates on review | ⚠️ Needs Investigation — business decision |
| DEP-09 | Platform revenue-cut decision (0% today vs 60/40) | Integrates-with | Determines settlement/ledger logic | ⚠️ Needs Investigation — stakeholder decision |
| DEP-10 | HK/TW logistics provider (post-v1) | Integrates-with | Needed when shipping replaces offline handling | Known — deferred |
| DEP-11 | Shop/merch UAT bugs on Beamco | Blocked-by | Same module + same engineers; bugs carry into Ztor | Known |

---

## Section 9: Phase Breakdown

**PH-01: Internal Ready (target Jul 30) — admin-operated core commerce loop**
BR-01 → BR-02 → BR-03 → BR-04 → BR-05 → BR-06 → BR-07 → BR-08
*Rationale:* Delivers the end-to-end purchasable slice operated by internal admins: microservice wired, creators+shops created, products listed with dual pricing, storefront live, dual-currency checkout, orders recorded. After this phase an internal team can run a real shop and take a real order.

**PH-02: Launch (target Aug wk-1) — public discovery & fulfillment**
BR-11 → BR-10 → BR-09 → BR-12
*Rationale:* Makes shops publicly discoverable and fulfillable: publication gating hardened, homepage rail curated, dynamic-QR pickup live, product-drop posts for promotion. This is what turns an internal demo into a public launch.

**PH-03: Self-serve & money maturation (post-launch) 💡**
*Rationale:* Deferred capabilities that don't block launch — **artist SSO self-serve** (Creator POV without admin), **POPCORN payouts** to creators, **additional payment methods** (Antom local wallets, PayPal, Alipay, WeChat Pay, LINE Pay, 街口, 悠遊卡), **in-system refunds**, and **logistics integration**. All marked 💡 Optional-for-launch — can defer without breaking the core feature.

---

## Section 10: For AI Readers

### 10a: ID Cross-Reference Map

```
=== CROSS-REFERENCE MAP ===

USER STORIES → BUSINESS REQUIREMENTS
US-01 → BR-06, BR-07, BR-03
US-02 → BR-09
US-03 → BR-04, BR-05, BR-08
US-04 → BR-02
US-05 → BR-04
US-06 → BR-10, BR-11
US-07 → BR-12

BUSINESS REQUIREMENTS → ACCEPTANCE CRITERIA
BR-01 → AC-01a, AC-01b
BR-02 → AC-02a, AC-02b
BR-03 → AC-03a, AC-03b
BR-04 → AC-04a, AC-04b, AC-04c
BR-05 → AC-05a, AC-05b, AC-05c
BR-06 → AC-06a, AC-06b
BR-07 → AC-07a, AC-07b, AC-07c
BR-08 → AC-08a, AC-08b
BR-09 → AC-09a, AC-09b, AC-09c
BR-10 → AC-10a, AC-10b
BR-11 → AC-11a, AC-11b
BR-12 → AC-12a, AC-12b

BUSINESS REQUIREMENTS → DEPENDENCIES
BR-01 → DEP-01, DEP-02, DEP-03
BR-02 → DEP-01
BR-05 → DEP-01
BR-07 → DEP-04, DEP-05, DEP-09
BR-08 → DEP-01, DEP-09
BR-09 → DEP-06
BR-10 → DEP-07
BR-11 → DEP-07
BR-02 (onboarding) → DEP-08

BUSINESS REQUIREMENTS → PHASES
PH-01: BR-01, BR-02, BR-03, BR-04, BR-05, BR-06, BR-07, BR-08
PH-02: BR-09, BR-10, BR-11, BR-12
PH-03: (no new BRs — SSO, payouts, extra PSPs, refunds, logistics)

FLOW STEPS → BUSINESS REQUIREMENTS
Step A2 → BR-03
Step A3 → BR-02
Step A5 → BR-04
Step A6 → BR-05
Step A7 → BR-11
Step B1 → BR-04
Step B3 → BR-12
Step C2 → BR-06
Step C3 → BR-05
Step C5 → BR-07
Step C6 → BR-08
Step C7 → BR-09
Step C8 → BR-09
```

### 10b: Ticket Metadata Index

```
=== TICKET METADATA INDEX ===

[BR-01]
title: Build Ztor-owned commerce API gateway with tenant scoping
description: Expose wrapped Beamco commerce/base modules to Ztor via a Ztor-owned gateway mapping sessions to tenant context.
priority: Must-Have
estimate: XL  ⚠️ Consider splitting into sub-tickets
labels: backend, integration, infrastructure
user_groups: Commerce Microservice, all frontend
phase: PH-01
depends_on: none
blocked_by: DEP-01, DEP-02
acceptance_criteria: AC-01a, AC-01b
user_stories: US-01

[BR-02]
title: Implement auto-generation of eShop on creator-profile creation
description: Creating a creator profile with a linked Store account auto-generates the eShop; no separate create-shop step.
priority: Must-Have
estimate: M
labels: backend, frontend
user_groups: Admin
phase: PH-01
depends_on: BR-01
blocked_by: DEP-01, DEP-08
acceptance_criteria: AC-02a, AC-02b
user_stories: US-04

[BR-03]
title: Build unique vanity handle registry and /shop/:handle resolver
description: Enforce unique creator handles with reserved-word and rename policy; resolve vanity URL to the shop.
priority: Must-Have
estimate: M
labels: backend, frontend
user_groups: Admin, Buyer
phase: PH-01
depends_on: BR-02
blocked_by: none
acceptance_criteria: AC-03a, AC-03b
user_stories: US-01

[BR-04]
title: Implement two-POV Creator Studio permission model
description: Role-gate Creator Studio — Admin global + role-assumption; Creator own-shop only.
priority: Must-Have
estimate: L
labels: backend, frontend, design
user_groups: Admin, Creator
phase: PH-01
depends_on: BR-01
blocked_by: none
acceptance_criteria: AC-04a, AC-04b, AC-04c
user_stories: US-03, US-05

[BR-05]
title: Build physical product and bundle management with dual pricing
description: Create/edit physical products and bundles with variants, inventory, cost; store cash + POPCORN prices independently.
priority: Must-Have
estimate: L
labels: backend, frontend
user_groups: Admin, Creator
phase: PH-01
depends_on: BR-01
blocked_by: none
acceptance_criteria: AC-05a, AC-05b, AC-05c
user_stories: US-03

[BR-06]
title: Build unified shop storefront on creator profile
description: Render shop as profile Shop tab; resolve /shop/:handle to the same one-source page.
priority: Must-Have
estimate: M
labels: frontend, design
user_groups: Buyer
phase: PH-01
depends_on: BR-03, BR-05
blocked_by: none
acceptance_criteria: AC-06a, AC-06b
user_stories: US-01

[BR-07]
title: Implement dual-currency checkout with platform-level rail switch
description: Offer fiat (Stripe) and/or POPCORN checkout with platform on/off per rail; POPCORN shown USD-mapped.
priority: Must-Have
estimate: L
labels: backend, frontend, integration
user_groups: Buyer
phase: PH-01
depends_on: BR-06
blocked_by: DEP-04, DEP-05, DEP-09
acceptance_criteria: AC-07a, AC-07b, AC-07c
user_stories: US-01

[BR-08]
title: Implement order recording and status lifecycle
description: Record each purchase as an order; track Processing → Completed; settle creator income in cash.
priority: Must-Have
estimate: M
labels: backend
user_groups: Admin, Creator, Commerce Microservice
phase: PH-01
depends_on: BR-07
blocked_by: DEP-09
acceptance_criteria: AC-08a, AC-08b
user_stories: US-03

[BR-09]
title: Build dynamic QR pickup and operator validation
description: Issue rotating-token pickup codes per order; operator validates by token/ID; mark order Completed.
priority: Must-Have
estimate: L
labels: backend, frontend, integration
user_groups: Buyer, Commerce Microservice, Dynamic QR Service
phase: PH-02
depends_on: BR-08
blocked_by: DEP-06
acceptance_criteria: AC-09a, AC-09b, AC-09c
user_stories: US-02

[BR-10]
title: Build shop discovery surfaces (home rails + dedicated /shops page) via CMS Content Blocks
description: Surface published shops + trending merch on the Spotlight home rails and a dedicated /shops browse page, with manual/conditional sort.
priority: Should-Have
estimate: L
labels: frontend, integration
user_groups: Buyer, CMS Editor
phase: PH-02
depends_on: BR-06, BR-11
blocked_by: DEP-07
acceptance_criteria: AC-10a, AC-10b
user_stories: US-06

[BR-11]
title: Implement publication gating across frontend surfaces
description: Prevent Draft shops/products from appearing on any Ztor frontend surface.
priority: Must-Have
estimate: M
labels: backend, frontend
user_groups: CMS Editor, Buyer
phase: PH-02
depends_on: BR-06
blocked_by: DEP-07
acceptance_criteria: AC-11a, AC-11b
user_stories: US-06

[BR-12]
title: Build product-drop social post with product card
description: Allow opt-in authoring of an intro post with a product card to the Store social feed on listing.
priority: Nice-to-Have
estimate: M
labels: backend, frontend
user_groups: Creator, Buyer
phase: PH-02
depends_on: BR-05
blocked_by: none
acceptance_criteria: AC-12a, AC-12b
user_stories: US-07
```

### 10c: Screen Map

```
=== SCREEN MAP ===

Step A1 → Screen: Creator Studio — Creators (Admin POV)
Step A2 → Screen: Creator Studio — Create Creator (drawer over Creators)
Step A3 → Screen: Creator Studio — Creators | State: eShop auto-created, row added
Step A5 → Screen: Creator Studio — Products (role-assumed into creator)
Step A6 → Screen: Creator Studio — Product Edit | State: saved as Draft
Step A7 → Screen: Creator Studio — Products | State: Published
Step B1 → Screen: Creator Studio — Products (Creator POV, own shop)
Step B2 → Screen: Creator Studio — Orders / Reports (Creator POV)
Step B3 → Screen: Create Post (drawer) | State: product-drop posted
Step C1 → Screen: Home (Spotlight) — Artist Shops + New & Trending Merch rails  ·  also: Shops (/shops) — dedicated browse (shop grid + trending merch)
Step C2 → Screen: Shop Landing ≡ Creator Profile (Shop tab)
Step C3 → Screen: Product Detail
Step C4 → Screen: Product Detail | State: variant chosen, Buy now (payment NOT selected here — deferred to checkout)
Step C5 → Screen: Checkout (fiat Stripe) / Checkout (POPCORN) | State: rail chosen
Step C6 → Screen: Order Confirmation
Step C7 → Screen: Order Confirmation | State: dynamic QR issued
Step C8 → Screen: Pickup QR (buyer) + Operator Validation (ops)
```

---

*End of BRD v1.0. Resolve the four ⚠️ OPEN items (platform cut · QR scope · registration approval · commerce API spec) and confirm phase targets before engineering kickoff.*
