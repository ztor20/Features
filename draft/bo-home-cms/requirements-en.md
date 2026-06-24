# BO Home CMS — Back Office Requirements

| Item | Details |
|------|---------|
| Routes | `/admin/page-config/home-page` (per region: `香港(中国)` / `台灣` / `全世界`) |
| Folder | `bo-home-cms` |
| Version | 1.0 |
| Updated | 2026-06-23 |
| Anchored-commit | — (standalone mock; BO is not anchored) · real admin ref: adminmvp.ztor.com `/#/page-config/home-page` |

> Aligns to the real ztor admin. **The `.md` is authoritative; the prototype (`prototype/index.html`) illustrates.** Field/enum identifiers are byte-identical across the EN / 繁中 pair; only prose is translated.

---

## 1. Purpose
The internal ops surface to configure the public ztor homepage **per region**, without engineering. The homepage is composed, top → bottom, of three areas: a **Banner**, a **Ranking widget**, and a **Layout Sequence** of **Content Blocks**.

## 2. User scenarios
- **As an ops editor**, I pick a region, add & arrange banners, toggle/edit the ranking widget, add & arrange content blocks (each bound to a Data Type + data source + UI style), preview, and save — so the homepage changes without engineering. Flow: pick region → edit Banner / Ranking / Layout Sequence → Preview → Save.
- Key branches: >1 banner → carousel + optional rotate; Tag/Subtitle/Description are optional & bilingual-coupled (fill one language → the other required; both empty → FE omits the field with no reserved space); some Data Types have a fixed UI style and/or need no data source; the ranking widget can be toggled & edited but **not** added/removed/reordered.

## 3. Query Params
`region` = `hk | tw | global` (which region's config; default `tw`). `preview` = `desktop | mobile` (preview viewport).

---

## 4. Banner  `/admin/page-config/home-page` (top area)

### 4.1 Layout
| Block | Description |
|-------|-------------|
| Section header | “Home Page Banner” + **+ Add Banner**. |
| Rotate toggle | Shown **only when > 1 banner** — “Rotate · auto every 3s”. |
| Banner list | One row per banner: `# · Title · Resource · Item · N CTA · enable · ⚙ · ✥(drag) · 🗑`. |
| Banner editor (modal) | Enable (top — scrolls with content, **not frozen**); **Banner Resource** = a **group** (created in another module) → **Item** picker (which event/item *under that group*, shown as image+name cards from BO); bilingual **Header / Title / Content** (**all optional, bilingual-coupled**); **CTA** repeater (name + url); Cancel/Confirm frozen at bottom. |

### 4.2 Interactions
| Action | Result |
|--------|--------|
| + Add Banner | Opens the banner editor to create a new banner. |
| ⚙ (row) | Opens the banner editor for that banner. |
| _In the editor:_ pick **Resource** (group) | Selects the **group** (created in another module); clears any previously chosen Item (items are group-specific) and shows the Item picker. |
| _In the editor:_ click **Item** | Opens the **SELECT ITEM** picker scoped to that group — lists the **events/items under it** as **image + name cards** (created in that module first; select-only, not created here); choosing fills the specific event/item. |
| _In the editor:_ edit Header/Title/Content · + Add CTA · remove CTA | Edits the banner draft — all inside the editor modal. |
| Drag ✥ (row) | Reorders banners (= carousel order). |
| Toggle Rotate | Enables/disables 3s auto-advance (only meaningful when > 1). |
| Toggle enable (row) | ON = the banner shows on the public homepage (FE); OFF = hidden from FE (kept in BO, can be re-enabled anytime). |
| **Delete 🗑 (row)** | Removes the banner from the section. |
| Save (editor) | Validates (**Item required (every group)**; text fields optional but **bilingual-coupled** — fill one language → both required; each CTA — if added — needs name + `http`/`https` url) → saves; else inline error. |

### 4.3 Branches / states (FE)
| Case | Behavior |
|------|----------|
| 1 banner | Single banner; no carousel control, no rotate option. |
| > 1 banner, rotate OFF | One-slot carousel; visitor switches via **dots** (no auto-advance). |
| > 1 banner, rotate ON | Auto-advance every **3s**; dots still work. |
| Always | All banners share **ONE slot / one section** — they never stack. |
| One language of Header/Title/Content filled, the other empty | Save blocked; the empty-language field highlighted (fill both or clear both). |
| Header/Title/Content empty (both langs) | Omitted on FE with **no reserved space** — the banner text reflows up. |

**Disabled when:** a banner with `enabled=false` is not rendered on FE.

### 4.4 Data
- `Banner { id, enabled, resource: BannerResource, item: BannerItem, header: Bilingual, title: Bilingual, content: Bilingual, ctas: Cta[] }`
- `BannerSection { banners: Banner[], rotate: boolean }`
- `BannerResource` = a **group**, mapped to an existing **BO data module**: `Movie/TV List | Events Data | Movie News | Crowdfund`. **`Events Data` includes Blind Box + AI Competition items.** The Home CMS does **not** create groups or items — it only selects from what those BO modules provide (the group list is supplied by BO; the set here is illustrative).
- `BannerItem`: a specific **event / item under the selected group**, created in that BO module first (**out of this scope** — e.g. Crowdfund items are created in BO, then appear under the `Crowdfund` group). The picker lists the group's items as **image + name** cards, scoped to the selected group; empty if the group has none ("create it in that module first"). **Required for every group** (no group is exempt).
- `Bilingual { zh: string, en: string }` — **all banner text (Header/Title/Content) is optional but bilingual-coupled**: per field, `zh` & `en` are both filled or both empty; an empty field is **omitted on FE with no reserved space**. · `Cta { name: string, url: Url }` (if a CTA is added, both `name` + `http`/`https` `url` are required)

---

## 5. Ranking widget  (between Banner and Layout Sequence)

### 5.1 Layout
| Block | Description |
|-------|-------------|
| Row | `★ Title · Ranking widget · N/total platforms on · enable · ⚙`. **No add / remove / reorder.** |
| Ranking editor (modal) | Enable (top — scrolls with content, **not frozen**); bilingual **Title (required) + Subtitle (optional, bilingual-coupled)**; **Platform list** (each: on/off toggle, ⠿ drag-reorder, ranking-source sub-line, “未配置” when unconfigured) + **+ Add Platform**; Cancel/Confirm frozen. |

### 5.2 Interactions
| Action | Result |
|--------|--------|
| Toggle (row) | Enable / disable the widget. |
| ⚙ (row) | Opens the ranking editor. |
| _In the editor:_ edit Title/Subtitle · platform toggle · drag ⠿ | Updates the widget & its platform list. |
| _In the editor:_ **+ Add Platform** | Opens a picker to **select a platform from the BO Rankings module** (image+name cards; not free-typed); the chosen platform is added to the list. |
| Save (editor) | Validates Title (both langs) + Subtitle bilingual coupling (fill one language → both required) → saves. |
| _(No delete)_ | The ranking widget is a single fixed widget — it cannot be deleted / added / reordered as a section. |

### 5.3 Branches / states
| Case | Behavior |
|------|----------|
| Enabled | FE renders Title (+ Subtitle if filled) + enabled-platform **tabs** + numbered ranking, between Banner and content blocks. |
| Subtitle empty (both langs) | Omitted on FE with no reserved space; one language only → Save blocked. |
| Disabled | Not rendered. |
| Platform unconfigured | Shows red “未配置”. |

**Disabled when:** the widget is a **single fixed widget** — it cannot be added / removed / reordered as a section (only its content is editable).

### 5.4 Data
- `Ranking { enabled, title: Bilingual, subtitle: Bilingual, platforms: Platform[] }` — `title` required (both langs); `subtitle` optional but **bilingual-coupled** (`zh` & `en` both filled or both empty; empty → omitted on FE with no reserved space).
- `Platform { key, name, sub: string, on: boolean, configured: boolean }` — `sub` = ranking source; `configured=false` → “未配置”. The platform catalog is **supplied by the BO Rankings module** — operators select from it via **+ Add Platform**, they do not free-type platforms.

---

## 6. Content Block (Layout Sequence)

### 6.1 Layout
| Block | Description |
|-------|-------------|
| Section header | “Home Page Layout Sequence” + **+ Add Content Block**. |
| Block list | One row per block: `# · Title · DataType · UIStyle · Tag · enable · ⚙ · ✥(drag) · 🗑`. |
| Block editor (modal) | Enable (top — scrolls with content, **not frozen**); bilingual **Title (required) / Tag / Subtitle / Description (rich text)** — Tag/Subtitle/Description are **optional** (no show/hide switch); **Data Type** (10); **Data source** picker; **FE UI style**; Cancel/Confirm frozen. |

### 6.2 Interactions
| Action | Result |
|--------|--------|
| + Add Content Block | Opens the block editor to create a new block. |
| ⚙ (row) | Opens the block editor for that block. |
| _In the editor:_ fill Tag / Subtitle / Description | Each is **optional**, but **bilingual-coupled** — filling one language makes the other language required (both or neither). |
| _In the editor:_ pick **Data Type** | Shows that type's UI styles (selectable or fixed) + shows/hides the data-source field. |
| _In the editor:_ pick UI style | Sets the FE render style (only when the type is selectable). |
| _In the editor:_ click data-source field | Opens the **SELECT ITEM** picker (search + items); choosing fills it. |
| Drag ✥ (row) | Reorders the blocks. |
| **Delete 🗑 (row)** | Removes the content block. |
| Save (editor) | Validates Title (both langs) + bilingual coupling for Tag/Subtitle/Description + data-source (where required) → saves. |

### 6.3 Branches / states
| Case | Behavior |
|------|----------|
| One language of Tag/Subtitle/Description filled, the other empty | Save blocked; the empty-language field is highlighted (fill both or clear both). |
| Tag/Subtitle/Description left empty (both langs) | Allowed — the field is **omitted on FE with no reserved space**; later blocks/content reflow up (e.g. empty Subtitle → Description starts in the Subtitle's place). |
| Data Type with one/fixed style | UI style not selectable — uses the master default. |
| Data Type ∈ {Events Data, Movie New} | **No data-source field**; uses the master default. |
| Data Type = Co-creation | Fixed UI style (`影視共創計畫`) **but data source IS required** (unlike Events Data). |
| Data source empty (required type) | Save blocked (“請選擇數據鏈接”). |
| Invalid URL (CTA / data source) | Rejected — absolute `http`/`https` only. |

**Data Type → FE UI style** (pick one Data Type; some styles selectable, some fixed):

| Data Type | UI styles | Selectable |
|---|---|---|
| Ztor Library | Video List · Rank List · 片單 · 片單排行榜 | yes (default Video List) |
| Movie/Tv List | Video List · Rank List · 片單 · 片單排行榜 | yes (default 片單) |
| Movie Review | Feature Review · Thematic Post | **no (fixed)** |
| Tastemaker | User List · User Review | yes (default User List) |
| Ranking | Video List · Rank List · 片單 · 片單排行榜 | yes (default 片單排行榜) |
| Events Data | 活動 | **no (fixed)** |
| Movie New | 影展消息 | **no (fixed)** |
| Award | Video List · Rank List · 片單 · 片單排行榜 | yes (default 片單排行榜) |
| Box Office | 票房排行 | single (fixed) |
| Co-creation | 影視共創計畫 | **no (fixed)** — fixed UI like Events Data, but **data source required** |

> **The Data Type options map to the existing BO data-management modules — NOT hardcoded.** The 10 Data Types correspond to the BO `data-management` modules (Ztor Library · Movie/TV Lists · Movie Reviews · Tastemakers · Rankings · Events Data · Movie News · Awards · Box Office Data) plus Co-creation. The catalog (and the content each Data Type resolves to) is supplied by those modules; the Home CMS only *selects* a Data Type — it must read the list dynamically, not hardcode it. The table above is illustrative.

### 6.4 Data
- `ContentBlock { id, enabled, dataType: DataType, uiStyle: string, source: string, title: Bilingual, tag: Bilingual, subtitle: Bilingual, description: Bilingual }`
- `DataType`: `Ztor Library | Movie/Tv List | Movie Review | Tastemaker | Ranking | Events Data | Movie New | Award | Box Office | Co-creation`
- `Bilingual { zh: string, en: string }`. **Title** is required (both langs). **Tag / Subtitle / Description** are optional but **bilingual-coupled** — for each, `zh` and `en` are both filled or both empty. An empty field is **omitted on FE with no reserved space**.

---

## Performance & SEO
**Performance (BO editor):** drag feedback < 100ms (optimistic) · preview render < 1s · editor LCP < 2.5s · CLS < 0.1 · INP < 200ms · lists virtualize beyond ~50 rows · preview re-render must not block input.
**SEO / GEO:** `N/A — authenticated` (Back Office is behind login; not indexable).

## Acceptance
**Banner**
- [ ] Editor: **Enable at top (scrolls with content, not frozen)**; only Save/Cancel frozen at bottom.
- [ ] Regardless of count, FE shows **one banner slot** (carousel), one banner at a time; banners never stack into separate sections.
- [ ] **Rotate** toggle appears only when **> 1** banner; ON → auto-advance every **3s**; OFF → manual dot switching.
- [ ] All banner text fields (Header/Title/Content) are **optional but bilingual-coupled** (fill one language → both required; both empty → omitted on FE with no reserved space); if a CTA is added it needs `name` + absolute `http`/`https` `url`; invalid blocked.
- [ ] **Banner Resource = a group** mapped to a BO data module (`Movie/TV List | Events Data | Movie News | Crowdfund`; Events Data includes Blind Box + AI Competition); after picking a group, an **Item** (an event/item *under that group*) must be selected from existing BO items (image + name cards; select-only) — **required for every group**; changing the group clears the previously chosen Item; empty picker if the group has none.
- [ ] Banners drag-reorderable; row order = carousel order.
- [ ] Each banner row has **Delete 🗑**; removing a banner takes it out of the section (and the carousel).

**Ranking widget**
- [ ] Editor: **Enable at top (scrolls with content, not frozen)**; only Save/Cancel frozen at bottom.
- [ ] Single fixed widget — cannot be added / removed / reordered as a section.
- [ ] ⚙ edits: bilingual title (required) + subtitle (optional, bilingual-coupled — fill one language → both required; empty → omitted on FE), enable, platform toggle / drag-reorder / add; unconfigured shows “未配置”.
- [ ] Enabled → renders between Banner and content blocks; disabled → hidden.

**Content Block**
- [ ] Enable at top (**scrolls with content, not frozen**); only Save/Cancel frozen at bottom; bilingual; `Title` required.
- [ ] Tag/Subtitle/Description are **optional** (no show/hide switch) and **bilingual-coupled** — fill one language → the other is required; leave both empty → **FE omits the field with no reserved space** (content reflows up).
- [ ] Each Data Type exposes its UI styles per §6.3 — selectable types pick one; fixed types are not editable.
- [ ] Data source required for every Data Type **except** Events Data / Movie New.
- [ ] `Co-creation` has a fixed UI style (`影視共創計畫`) like Events Data, **but its data source IS required**.
- [ ] Layout Sequence rows show `Title · DataType · UIStyle`; drag-reorderable via the handle.
- [ ] Each content-block row has **Delete 🗑**; removing a block takes it out of the Layout Sequence.

**Validation / safety**
- [ ] All operator URLs (banner CTA, content-block data source) must be absolute `http`/`https`; `javascript:` / `data:` / relative rejected and not saved.

## Test cases
Given / When / Then, with an **observable Then**.
- **BO-TC-01** — Given 3 enabled banners · When the FE homepage renders · Then exactly **one** banner shows at a time inside a single banner section, with **3** dot indicators. *(catches: banners stacking into multiple sections)*
- **BO-TC-02** — Given >1 banner with `rotate=ON` · When 3s elapse · Then the next banner auto-shows; And with `rotate=OFF` · When 3s elapse · Then no auto-advance, but clicking a dot switches. *(catches: rotate ignoring the toggle)*
- **BO-TC-03** — Given a banner CTA with `url="javascript:alert(1)"` or empty `name` · When Save · Then blocked with inline error, nothing persisted; a `name` + `http`/`https` url saves. *(catches: phishing/XSS via CTA; incomplete CTA)*
- **BO-TC-04** — Given the Ranking row · When attempting to delete/reorder it as a section · Then not possible; When ⚙ → toggle a platform off, drag-reorder, edit title, Save · Then the row's platform count/order/title update and FE tabs reflect enabled platforms. *(catches: ranking treated as a normal block / non-editable)*
- **BO-TC-05** — Given a content block with Subtitle filled in zh only (en empty) · When Save · Then blocked and the empty-language field highlighted; And Given Subtitle empty in both langs · When Save · Then allowed and the FE omits the Subtitle with **no reserved space** (Description starts where Subtitle would be). *(catches: half-translated fields; empty fields leaving a gap on FE)*
- **BO-TC-06** — Given Data Type = `Co-creation` · When Save without a data source · Then blocked (“請選擇數據鏈接”); Given Data Type = `Events Data` or `Movie New` · Then no data-source field, Save allowed. *(catches: data-source requirement errors; Co-creation wrongly exempted)*
- **BO-TC-07** — Given Layout Sequence `[A, B, C]` · When C is dragged above A via the handle · Then order becomes `[C, A, B]` and row numbers update. *(catches: broken reorder)*
- **BO-TC-08** — Given a banner row and a content-block row · When **Delete 🗑** is clicked on each · Then that banner leaves the carousel and that block leaves the Layout Sequence (row counts decrement); the Ranking widget exposes **no** delete. *(catches: missing/over-broad delete)*
- **BO-TC-09** — Given Banner Resource (group) = `Movie/TV List` · When the Item field is clicked · Then the **SELECT ITEM** picker lists the events/items under that group as **image + name cards** and choosing one fills the Item; Given a group with no items · Then the picker is empty (the CMS cannot create groups or items here); When Save without an Item · Then blocked with inline error; And When the group is switched from `Movie/TV List` to `Crowdfund` · Then the previously chosen item is cleared and the picker now lists the Crowdfund group's items; And Given group = `Events Data` · Then its items include Blind Box / AI Competition entries. *(catches: missing item link; wrong/stale item list; groups/items not authored in their BO module; Events Data grouping)*

## Not Included
- Per-region **data wiring** (config is per region, but cross-region data integration is separate).
- The public **FE renderer** (consumes this config; pre-existing).
- **Banner** is currently hardcoded on the FE renderer — to be replaced by this config.
- **Authoring of Banner items** — Movie/TV List, Events Data (incl. Blind Box + AI Competition), Movie News, and Crowdfund items are created in their own BO modules; this surface only *selects* existing items (external dependency).
- The **Data Type catalog** (the list of Data Types and the content each resolves to) — supplied by the BO **data-management** modules; this surface reads the list dynamically and only *selects* a Data Type, never hardcodes it (external dependency).
- The Ranking **platform master data** — the platform catalog + ranking sources come from the **BO Rankings module** (this surface only selects from it).
- Platform-level **access control & change logging** (follow the existing BO admin).
