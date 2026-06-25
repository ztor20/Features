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
The internal ops surface to configure the public ztor homepage **per region**, without engineering. The homepage is composed, top → bottom: a **Banner**, **Continue Watching** (fixed, logged-in only), a **Ranking widget**, and a **Layout Sequence** of **Content Blocks**.

## 2. User scenarios
- **As an ops editor**, I pick a region, add & arrange banners, edit the Continue Watching section (title/content/tag), toggle/edit the ranking widget, add & arrange content blocks (each bound to a Data Type + data source + UI style), preview, and save — so the homepage changes without engineering. Flow: pick region → edit Banner / Continue Watching / Ranking / Layout Sequence → Preview → Save.
- Key branches: Banner picks a **Banner Type (4)** first, which drives its fields & item source (Brand Intro has no item); >1 banner → carousel + optional rotate (interval/behavior per FE §3.6); text/Tag/Subtitle/Description are optional & bilingual-coupled (fill one language → the other required; both empty → FE omits the field with no reserved space); some Data Types have a fixed UI style and/or need no data source; the ranking widget can be toggled & edited but **not** added/removed/reordered.

## 3. Query Params
`region` = `hk | tw | global` (which region's config; default `tw`). `preview` = `desktop | mobile` (preview viewport).

---

## 4. Banner  `/admin/page-config/home-page` (top area)

> The banner **layout, per-type fields, upload sizes/formats, carousel behavior, masks, and AI countdown display follow the FE homepage spec `home` §3 — not duplicated here**. This section defines only the **Back-Office authoring behavior** (fields are driven conditionally by Banner Type; select-only; validation).

### 4.1 Layout
| Block | Description |
|-------|-------------|
| Section header | “Banner” + **+ Add Banner**. |
| Rotate toggle | Shown **only when > 1 banner**. Interval & behavior (auto every **5s**, hover-pause, prev/next arrows + dots) **per FE spec §3.6**. |
| Banner list | One row per banner: `# · Title · Type · Item · N CTA · enable · ⚙ · ✥(drag) · 🗑` (Brand Intro shows “—” for Item). |
| Banner editor (modal) | Enable (top — scrolls with content, **not frozen**); **Banner Type** selector (4 types, §4.2) → drives that type's field set (field content per FE spec §3.2); Cancel/Confirm frozen at bottom. |

### 4.2 Banner Type (replaces the old Banner Resource)
Picking the **Banner Type** is step one; it determines ① the item source, ② the field set, ③ required fields (the ②③ field content **per FE spec §3.2**):

| Banner Type | Item source (select-only, image+name cards, read directly from the DB) | Note |
|---|---|---|
| **Brand Intro** | **No item** | **upload image or video**, custom text (no item picker) |
| **AI Competition** | **Events Data** (event) | item ⇄ upload (one-of); in item mode the 7-stage countdown reads that item's schedule (FE §3.5); **can add CTA (max 2)**; no manual date fields |
| **Event** | **Events Data** (incl. Blind Box) | item ⇄ upload (one-of); right-side hero optional, mp4 allowed |
| **Film Intro** | **Movie/TV List** (library film) | type tags pulled from the film (≤3) with a show/hide toggle; title as image or text |

> Per-type fields, upload sizes/formats (background image / right-side cut-out hero static-or-mp4 ≤15MB / title image), masks, carousel, countdown — **all refer to FE spec §3.1–3.6**; not duplicated here.
> **Source rule (by type):** **Event / Film Intro / AI Competition** are one-of (mutually exclusive) — **Select Item** OR **Upload image/video**; **Brand Intro** is upload image/video only (no item). ⚠️ The item-or-upload exclusivity is a CMS design choice and **differs slightly from FE §3.1** (item + uploads together); also **AI Competition in upload mode has no schedule source** (countdown loses its basis).

### 4.3 Interactions
| Action | Result |
|--------|--------|
| + Add Banner | Opens the banner editor (pick Banner Type first). |
| ⚙ (row) | Opens the banner editor for that banner. |
| _In the editor:_ pick **Banner Type** | Sets the layout; **resets** that type's field set; clears any previously chosen Item (Brand Intro hides the Item field). |
| _In the editor:_ click **Item** (non-Brand-Intro) | Opens the **SELECT ITEM** picker scoped to that type's source — **image + name cards, read directly from the database** (select-only); choosing fills it. |
| _In the editor:_ upload background / cut-out hero (static or mp4) / title image | Type-specific upload fields appear; specs per FE spec §3.3. |
| _In the editor:_ edit eyebrow/headline/desc · toggle type-tag show/hide (Film Intro only) | Edits the banner draft. |
| _In the editor:_ + Add CTA · remove CTA | **Max 2**. |
| _In the editor:_ set publish/unpublish time | Optional scheduling window. |
| Drag ✥ (row) | Reorders banners (= carousel order). |
| Toggle Rotate | Enables/disables auto-advance (only meaningful when > 1; interval/behavior per FE §3.6). |
| Toggle enable (row) | ON = shows on the public homepage (FE); OFF = hidden from FE (kept in BO, re-enableable anytime). |
| **Delete 🗑 (row)** | Removes the banner from the section. |
| Save (editor) | Validates (see §4.5) → saves; else inline error. |

### 4.4 Branches / states (FE)
| Case | Behavior |
|------|----------|
| 1 banner | Single banner; no carousel control, no rotate option. |
| > 1 banner | One-slot carousel, **one section** (never stacks); controls (prev/next arrows + dots), auto every **5s**, hover-pause **per FE §3.6**; rotate OFF → manual only. |
| Brand Intro type | No item; can upload image or video; render per FE §3.2. |
| AI Competition type | item (Events Data) ⇄ upload (one-of); in item mode countdown eyebrow/button/link switch per that item's competition schedule (FE §3.5). |
| Film Intro type, tag toggle = hidden | FE omits the tag area (even if the library film has tags). |
| One language of a text field filled, the other empty | Save blocked; the empty-language field highlighted (fill both or clear both). |
| Text field empty (both langs) | Omitted on FE with **no reserved space** — the banner text reflows up. |

**Disabled when:** a banner with `enabled=false`, or one outside its publish schedule window, is not rendered on FE.

### 4.5 Validation & data
**Save validation:**
- **Item / Upload (mutually exclusive)**: item-bearing types choose one — **item mode** requires an Item; **upload mode** requires upload instead (no item). Brand Intro has no item. Switching Type clears the previously chosen Item.
- **Text** (eyebrow `eyebrow` / headline `headline` / description `desc`): optional but **bilingual-coupled**; **required fields per type follow FE spec §3.2** (e.g. Film Intro headline = film name is required).
- **CTA**: **max 2** (incl. AI Competition); each needs a **bilingual name** (`name.zh` + `name.en`) + absolute `http`/`https` url (single url shared). **CTAs exist only on Banner (multi, max 2) and Content Block Custom (single, max 1)**; Continue Watching has no CTA.
- **Uploads**: formats/sizes per FE spec §3.3 (right-side hero mp4 ≤15MB).

**Data:**
- `Banner { id, enabled, type: BannerType, srcMode: 'item'|'upload', item: BannerItem | null, eyebrow: Bilingual, headline: Bilingual, desc: Bilingual, bgImage?: Asset, mainAsset?: Asset, titleImage?: Asset, tagAreaVisible?: boolean, ctas: Cta[], schedule: Schedule }`
- `srcMode`: `item` or `upload` — **togglable for Event / Film Intro / AI Competition (mutually exclusive)**; **Brand Intro is always `upload` (no item)**. All banner types allow up to 2 `ctas`.
- `BannerSection { banners: Banner[], rotate: boolean }`
- `BannerType` = `Brand Intro | AI Competition | Event | Film Intro` (the four FE §3.2 types).
- `BannerItem`: one event/item from the DB category mapped by Type (AI Competition→**Events Data**; Event→Events Data incl. Blind Box; Film Intro→Movie/TV List), **read directly from the product database**, select-only; the picker lists **image + name** cards, empty if no matching records. **Always `null` for Brand Intro (upload instead); `null` for Event/Film Intro/AI Competition when `srcMode='upload'`, required when `srcMode='item'`.**
- `tagAreaVisible`: **Film Intro only**; type tags are pulled from the film (≤3) and this toggle shows/hides the whole tag area (FE §3.4).
- `Schedule { from?: DateTime, to?: DateTime }`: optional publish/unpublish window.
- `bgImage / mainAsset / titleImage`: background image / right-side cut-out hero (static or mp4 ≤15MB) / title image; sizes & formats per FE §3.3.
- `Bilingual { zh: string, en: string }` — banner text (`eyebrow`/`headline`/`desc`) is optional but **bilingual-coupled** (empty → omitted on FE, no reserved space); **required fields per type per FE §3.2**. · `Cta { name: Bilingual, url: Url }` (**max 2**; bilingual name + one shared url; if added, both zh+en name + `http`/`https` url required)
- Field semantics / upload specs / countdown / masks / carousel: **refer to FE spec §3.1–3.6**.

---

## 4A. Continue Watching  (fixed section · directly under Banner)

Aligns to FE homepage §2 "繼續觀看": **logged-in only**, the list is **auto-filled by the watch-history system**. It is a **fixed section** pinned **under Banner, above Ranking**, and **cannot be added / removed / reordered**. Ops edit only **Title / Content / Tag** (no CTA).

### 4A.1 Layout
| Block | Description |
|-------|------|
| Row | `▶ Title · Continue Watching · enable · ⚙`. No add / remove / reorder. |
| Editor (modal) | Enable (top — scrolls with content, not frozen); bilingual **Title (required) / Content (optional) / Tag (optional)** (no CTA); Cancel/Confirm frozen. |

### 4A.2 Interactions
| Action | Result |
|--------|--------|
| Toggle enable (row) | ON = shown on FE (logged-in only); OFF = hidden (kept in BO). |
| ⚙ | Opens the editor. |
| Save | Validates Title (both langs) + Content/Tag bilingual coupling → saves; else inline error. |

### 4A.3 Branches / states (FE)
| Case | Behavior |
|------|------|
| Not logged in | Section **not shown** (logged-in only). |
| Enabled + logged in | Renders under Banner, above Ranking; list auto-continues. |
| Content / Tag one language only | Save blocked; empty-language field highlighted. |
| Content / Tag empty (both langs) | Omitted on FE with no reserved space. |
| Disabled | Not rendered. |

**Disabled when:** `enabled=false` or not logged in → not rendered. Fixed widget — cannot be added / removed / reordered as a section.

### 4A.4 Data
- `ContinueWatching { enabled, title: Bilingual, content: Bilingual, tag: Bilingual }` — `title` required (both langs); `content` / `tag` optional but **bilingual-coupled** (empty → omitted on FE, no reserved space); **no CTA**. **The list content is supplied by the watch-history system (not ops input).**

---

## 5. Ranking widget  (between Banner and Layout Sequence)

### 5.1 Layout
| Block | Description |
|-------|-------------|
| Row | `★ Title · Ranking widget · N/total platforms on · enable · ⚙`. **No add / remove / reorder.** |
| Ranking editor (modal) | Enable (top — scrolls with content, **not frozen**); bilingual **Title (required) + Tag (optional, bilingual-coupled) + Subtitle (optional, bilingual-coupled)**; **Platform list** (each: on/off toggle, ⠿ drag-reorder, ranking-source sub-line, “未配置” when unconfigured) + **+ Add Platform**; Cancel/Confirm frozen. |

### 5.2 Interactions
| Action | Result |
|--------|--------|
| Toggle (row) | Enable / disable the widget. |
| ⚙ (row) | Opens the ranking editor. |
| _In the editor:_ edit Title/Subtitle · platform toggle · drag ⠿ | Updates the widget & its platform list. |
| _In the editor:_ **+ Add Platform** | Opens a picker to **select a platform from the BO Rankings module** (image+name cards; not free-typed); the chosen platform is added to the list. |
| Save (editor) | Validates Title (both langs) + Tag / Subtitle bilingual coupling (fill one language → both required) → saves. |
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
- `Ranking { enabled, title: Bilingual, tag: Bilingual, subtitle: Bilingual, platforms: Platform[] }` — `title` required (both langs); `tag` / `subtitle` optional but **bilingual-coupled** (`zh` & `en` both filled or both empty; empty → omitted on FE with no reserved space).
- `Platform { key, name, sub: string, on: boolean, configured: boolean }` — `sub` = ranking source; `configured=false` → “未配置”. The platform catalog is **supplied by the BO Rankings module** — operators select from it via **+ Add Platform**, they do not free-type platforms.

---

## 6. Content Block (Layout Sequence)

### 6.1 Layout
| Block | Description |
|-------|-------------|
| Section header | “Layout Sequence” + **+ Add Content Block**. |
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
| Data Type = AI Competition | Fixed UI style; **data source required** (source: AI Competition). |
| Data Type = Custom | **No data source**; instead upload **background + image** + bilingual title/subtitle/content + **CTA (max 1)** (FE renders from the uploaded image). |
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
| AI Competition | AI 原力創作計畫 | **no (fixed)** — data source required (source: AI Competition) |
| Custom | Custom | **no (fixed)** — **no data source**; instead upload background + image, and fill bilingual title/subtitle/content/CTA |

> **The Data Type options map to the existing BO data-management modules — NOT hardcoded.** The 10 Data Types correspond to the BO `data-management` modules (Ztor Library · Movie/TV Lists · Movie Reviews · Tastemakers · Rankings · Events Data · Movie News · Awards · Box Office Data) plus Co-creation. The catalog (and the content each Data Type resolves to) is supplied by those modules; the Home CMS only *selects* a Data Type — it must read the list dynamically, not hardcode it. The table above is illustrative.

### 6.4 Data
- `ContentBlock { id, enabled, dataType: DataType, uiStyle: string, source: string, title: Bilingual, tag: Bilingual, subtitle: Bilingual, description: Bilingual, ctas?: Cta[], bgImage?: Asset, image?: Asset }` (`ctas` / `bgImage` / `image` are **Custom-only**)
- `DataType`: `Ztor Library | Movie/Tv List | Movie Review | Tastemaker | Ranking | Events Data | Movie New | Award | Box Office | Co-creation | AI Competition | Custom`
- `Bilingual { zh: string, en: string }`. **Title** is required (both langs). **Tag / Subtitle / Description** are optional but **bilingual-coupled** — for each, `zh` and `en` are both filled or both empty. An empty field is **omitted on FE with no reserved space**.

> **FE block mapping:** FE #8 **Gradient Banner** is built with the **Custom** Data Type (upload background + image + bilingual text + CTA) — no dedicated type. FE #4 Co-creation / #6 AI stay as Data Types here (`Co-creation` / `AI Competition`) — FE spec marks them "Hardcode" only because there was no CMS when it was written. FE #5 screening-room Tab block is **skipped** this version.

---

## Performance & SEO
**Performance (BO editor):** drag feedback < 100ms (optimistic) · preview render < 1s · editor LCP < 2.5s · CLS < 0.1 · INP < 200ms · lists virtualize beyond ~50 rows · preview re-render must not block input.
**SEO / GEO:** `N/A — authenticated` (Back Office is behind login; not indexable).

## Acceptance
**Banner**
- [ ] Editor: **Enable at top (scrolls with content, not frozen)**; only Save/Cancel frozen at bottom.
- [ ] Regardless of count, FE shows **one banner slot** (carousel), one banner at a time; banners never stack into separate sections.
- [ ] **Rotate** toggle appears only when **> 1** banner; interval/behavior (auto every **5s**, hover-pause, prev/next arrows + dots) **per FE spec §3.6**; OFF → no auto-advance, manual switching.
- [ ] **Banner Type (4: `Brand Intro | AI Competition | Event | Film Intro`)** is the primary selector, driving item source, field set, and required fields (field content per FE §3.2); switching Type resets fields and clears the previously chosen Item.
- [ ] **Item source by Type**: **AI Competition→Events Data** (event), Event→Events Data (incl. Blind Box), Film Intro→Movie/TV List, each from **database records** (image+name cards; select-only); **Brand Intro has no item (uploads image/video instead)**; empty picker if no records.
- [ ] **Source rule**: **Event / Film Intro / AI Competition** toggle **Select Item / Upload** (mutually exclusive; switching clears the previous item); **Brand Intro** is upload-only.
- [ ] Banner text (eyebrow/headline/desc) is **optional but bilingual-coupled** (fill one → both required; both empty → omitted on FE with no reserved space); **required fields per type per FE §3.2** (e.g. Film Intro headline = film name required).
- [ ] **Upload fields** (background image / right-side cut-out hero static-or-mp4 ≤15MB / title image) appear per type; sizes/formats **per FE §3.3**.
- [ ] **AI Competition type**: item (Events Data) ⇄ upload (one-of); in item mode the 7-stage countdown reads that item's competition schedule (FE §3.5); no manual date fields; **can add CTA (max 2)**.
- [ ] **Film Intro type**: type tags pulled from the film (≤3); the whole tag area can be **shown/hidden** (FE §3.4).
- [ ] **CTA max 2** (incl. AI Competition; **multiple is Banner-only**); if added, each needs a **bilingual name + absolute `http`/`https` url**; invalid blocked.
- [ ] Banners drag-reorderable (= carousel order); optional **publish/unpublish schedule**; each row has **Delete 🗑** (removes from section and carousel).

**Continue Watching**
- [ ] Fixed section pinned **under Banner, above Ranking**; cannot be added / removed / reordered.
- [ ] Editor: Enable at top (scrolls with content); bilingual **Title (required) / Content (optional) / Tag (optional)** (**no CTA**); Content/Tag bilingual-coupled.
- [ ] Enabled + **logged-in only** → shown on FE; logged-out or disabled → hidden; list auto-filled by the watch-history system (ops doesn't edit the list content).

**Ranking widget**
- [ ] Editor: **Enable at top (scrolls with content, not frozen)**; only Save/Cancel frozen at bottom.
- [ ] Single fixed widget — cannot be added / removed / reordered as a section.
- [ ] ⚙ edits: bilingual title (required) + **Tag (optional, bilingual-coupled)** + subtitle (optional, bilingual-coupled — fill one language → both required; empty → omitted on FE), enable, platform toggle / drag-reorder / add; unconfigured shows “未配置”.
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
- **BO-TC-02** — Given >1 banner with `rotate=ON` · When **5s** elapse (per FE §3.6) · Then the next banner auto-shows; And on mouse hover · Then auto-advance pauses; And with `rotate=OFF` · When 5s elapse · Then no auto-advance, but clicking a prev/next arrow or dot switches. *(catches: wrong interval / rotate ignoring the toggle / missing hover-pause & arrows)*
- **BO-TC-03** — Given a banner CTA with `url="javascript:alert(1)"` or empty `name` · When Save · Then blocked with inline error, nothing persisted; a `name` + `http`/`https` url saves. *(catches: phishing/XSS via CTA; incomplete CTA)*
- **BO-TC-04** — Given the Ranking row · When attempting to delete/reorder it as a section · Then not possible; When ⚙ → toggle a platform off, drag-reorder, edit title, Save · Then the row's platform count/order/title update and FE tabs reflect enabled platforms. *(catches: ranking treated as a normal block / non-editable)*
- **BO-TC-05** — Given a content block with Subtitle filled in zh only (en empty) · When Save · Then blocked and the empty-language field highlighted; And Given Subtitle empty in both langs · When Save · Then allowed and the FE omits the Subtitle with **no reserved space** (Description starts where Subtitle would be). *(catches: half-translated fields; empty fields leaving a gap on FE)*
- **BO-TC-06** — Given Data Type = `Co-creation` · When Save without a data source · Then blocked (“請選擇數據鏈接”); Given Data Type = `Events Data` or `Movie New` · Then no data-source field, Save allowed. *(catches: data-source requirement errors; Co-creation wrongly exempted)*
- **BO-TC-07** — Given Layout Sequence `[A, B, C]` · When C is dragged above A via the handle · Then order becomes `[C, A, B]` and row numbers update. *(catches: broken reorder)*
- **BO-TC-08** — Given a banner row and a content-block row · When **Delete 🗑** is clicked on each · Then that banner leaves the carousel and that block leaves the Layout Sequence (row counts decrement); the Ranking widget exposes **no** delete. *(catches: missing/over-broad delete)*
- **BO-TC-09** — Given Banner Type = `Film Intro` · When the Item field is clicked · Then the **SELECT ITEM** picker lists Movie/TV List films as **image + name cards read from the database** and choosing one fills the Item; Given the source has no records · Then the picker is empty (the CMS cannot create items here); When Save without an Item · Then blocked with inline error; And When the Type is switched from `Film Intro` to `Event` · Then the previously chosen item is cleared and the picker now lists Events Data (incl. Blind Box) items; And Given Type = `AI Competition` · Then the item comes from the **Events Data** source (events incl. AI-competition items). *(catches: wrong item source per Type; stale item list; missing item link)*
- **BO-TC-10** — Given Banner Type = `Brand Intro` · When the editor opens · Then **no Item field is shown** and it saves with no item (exception); Given Type = `Film Intro` with the headline (film name) empty · When Save · Then blocked (headline required for this type, FE §3.2); Given 2 CTAs already added · When adding a 3rd · Then blocked (**max 2**). *(catches: Brand Intro wrongly forced to require an item; per-type required fields not validated; CTA over the cap)*
- **BO-TC-11** — Given Banner Type ∈ {`Event`, `Film Intro`, `AI Competition`} · When switched to **Upload image/video** · Then the item picker hides, the upload area appears, and Save no longer requires an item; switching back to **Select Item** · Then the upload area hides and an Item is required (mutually-exclusive clear); Given `AI Competition` · Then a **source toggle is shown** and **CTA can be added (max 2)**; Given `Brand Intro` · Then only the upload area shows, no item, no toggle. *(catches: item & upload not mutually exclusive; AI Competition wrongly locked item-only; Brand Intro upload missing)*
- **BO-TC-12** — Given Continue Watching enabled · When a logged-out visitor views FE · Then the section is **not shown**; When logged in · Then it renders **under Banner, above Ranking** with an auto-continue list; Given Content filled in zh only (en empty) · When Save · Then blocked; When attempting to delete/reorder it as a section · Then not possible (fixed widget). *(catches: Continue Watching shown to logged-out; half-translated fields; treated as a normal section)*

## Not Included
- Per-region **data wiring** (config is per region, but cross-region data integration is separate).
- The public **FE renderer** (consumes this config; pre-existing).
- **Banner** is currently hardcoded on the FE renderer — to be replaced by this config.
- **Banner item data** is read directly from the **product database** (by Banner Type: AI Competition, Events Data incl. Blind Box, Movie/TV List); this surface only *selects* existing records — it does not create them (external dependency). Brand Intro has no item.
- The **Data Type catalog** (the list of Data Types and the content each resolves to) — supplied by the BO **data-management** modules; this surface reads the list dynamically and only *selects* a Data Type, never hardcodes it (external dependency).
- The Ranking **platform master data** — the platform catalog + ranking sources come from the **BO Rankings module** (this surface only selects from it).
- Platform-level **access control & change logging** (follow the existing BO admin).
