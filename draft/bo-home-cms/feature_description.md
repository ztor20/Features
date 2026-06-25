# BO Home CMS — Feature description

## Purpose
**Problem:** The public homepage (Banner, Ranking widget, content sections) is hardcoded; every change needs engineering and a release.
**Solution:** A per-region Back-Office CMS where a non-technical operator composes the homepage — Banner, Ranking widget, and an ordered list of Content Blocks — and publishes without code.
**Deliverables:** (1) Banner manager (type→item/upload, carousel). (2) Continue Watching (fixed section under Banner; title/content/tag, no CTA; list auto from watch history). (3) Ranking widget (fixed, editable, platform toggles). (4) Content Block list (Data Type → UI style + data source).

## Surface map
| Surface | Involved? | Role in this feature | Prototype |
|---|---|---|---|
| FE (fan) | N | Renders the published config (pre-existing renderer; consumes this output) | — |
| CS (creator studio) | N | — | — |
| BO (back office) | Y | The whole authoring surface: pick region → edit Banner / Ranking / Layout Sequence → preview → save | mock (standalone) |

## Core scenario (told ONCE)
- **Given** an ops editor on `/admin/page-config/home-page` for region `台灣`
- **When** they add a Banner (pick a Banner Type → for non-Brand-Intro select an Item from the database → uploads + optional bilingual text → CTAs ≤2), enable & edit the Ranking widget (title + platform toggles), and add Content Blocks (each: Data Type → UI style → data source), then Preview and Save
- **Then** the region's homepage config is persisted and the FE renderer shows, top→bottom: Banner (carousel) → Continue Watching (logged-in only) → Ranking widget → Content Blocks in the saved order. Disabled items are excluded; empty optional fields are omitted with no reserved space.

## Data contract
**Shared nouns:** `Region` (`HK | 台灣 | 全世界`), `Url` (absolute `http`/`https` only).

**Feature-specific entities & fields:**
- `HomeConfig { region: Region, bannerSection: BannerSection, continueWatching: ContinueWatching, ranking: Ranking, blocks: ContentBlock[] }`
- `ContinueWatching { enabled: boolean, title: Bilingual, content: Bilingual, tag: Bilingual }` — fixed section under Banner; logged-in only; list auto from watch history (not ops input); `title` required, `content`/`tag` bilingual-coupled, **no CTA**
- `BannerSection { banners: Banner[], rotate: boolean }`
- `Banner { id, enabled: boolean, type: BannerType, srcMode: 'item'|'upload', item: BannerItem | null, eyebrow: Bilingual, headline: Bilingual, desc: Bilingual, bgImage?: Asset, mainAsset?: Asset, titleImage?: Asset, tagAreaVisible?: boolean, ctas: Cta[], schedule: Schedule }` — `srcMode` item⇄upload **mutually exclusive** (Event/Film Intro); all banner types incl. AI Competition allow up to 2 `ctas` (multi-CTA is Banner-only)
- `Cta { name: Bilingual, url: Url }` (max 2; bilingual name + one shared url) · `Schedule { from?: DateTime, to?: DateTime }` · `Asset` (image, or mp4 ≤15MB for `mainAsset`; sizes/formats per FE spec §3.3)
- `Ranking { enabled: boolean, title: Bilingual, tag: Bilingual, subtitle: Bilingual, platforms: Platform[] }`
- `Platform { key: string, name: string, sub: string, on: boolean, configured: boolean }`
- `ContentBlock { id, enabled: boolean, dataType: DataType, uiStyle: string, source: string, title: Bilingual, tag: Bilingual, subtitle: Bilingual, description: Bilingual, ctas?: Cta[], bgImage?: Asset, image?: Asset }` (`ctas`/`bgImage`/`image` are Custom-only)
- `Bilingual { zh: string, en: string }`

**Enums / allowed values:**
- `BannerType` (FE §3.2, drives item source + field set + required fields): `Brand Intro | AI Competition | Event | Film Intro`. Item source by type — Brand Intro→none (upload image/video); AI Competition→**Events Data**; Event→Events Data (incl. Blind Box); Film Intro→Movie/TV List. Event/Film Intro/AI Competition support item⇄upload (one-of).
- `BannerItem`: a specific event/item **read directly from the product database**, scoped to the type's source (select-only; not authored here). `null` for Brand Intro; required for the other types.
- `DataType`: `Ztor Library | Movie/Tv List | Movie Review | Tastemaker | Ranking | Events Data | Movie New | Award | Box Office | Co-creation | AI Competition | Custom`
- `DataType.uiStyle` (per type; selectable vs fixed) — Ztor Library/Movie-Tv List/Tastemaker/Ranking/Award are selectable; Movie Review/Events Data/Movie New/Box Office/Co-creation are fixed.

## State machine (total)
- `Banner.enabled`: `disabled` ⇄ `enabled` (trigger: BO toggle). `enabled` → rendered on FE; `disabled` → kept in BO, not rendered.
- `BannerSection.rotate`: `off` ⇄ `on` (trigger: BO; **only meaningful when banners > 1**; off = manual prev/next + dots, on = **5s** auto-advance w/ hover-pause, per FE §3.6).
- `Banner.type`: one of `Brand Intro | AI Competition | Event | Film Intro` (trigger: BO). Switching type **resets the field set and clears `item`**.
- `Banner.srcMode`: `item` ⇄ `upload`, **togglable for Event / Film Intro / AI Competition** (mutually exclusive). `item` → `item` required & uploads hidden; `upload` → `item=null` & uploads shown. **illegal:** `srcMode='item'` with null `item` ✗; `srcMode='upload'` with non-null `item` ✗ (Save blocked). **Brand Intro is always `upload`** (no item). AI Competition in upload mode has no schedule source.
- `ContinueWatching.enabled`: `disabled` ⇄ `enabled` (trigger: BO). Fixed section under Banner; FE renders only when `enabled` **and** the visitor is logged in. **illegal:** add / delete / reorder as a section ✗.
- `Ranking.enabled`: `disabled` ⇄ `enabled` (trigger: BO). Single fixed widget — **illegal:** add / delete / reorder as a section ✗.
- `ContentBlock.enabled`: `disabled` ⇄ `enabled` (trigger: BO).
- Draft lifecycle: `draft` → `saved` (trigger: Save, gated by validation) ; validation fail → stays `draft` with inline errors.
- **Bilingual field rule (Banner eyebrow/headline/desc, Continue Watching content/tag, Ranking Tag/Subtitle, Content Block Tag/Subtitle/Description):** `both-empty` (omitted on FE) ⇄ `both-filled`; **illegal:** `one-language-only` ✗ (Save blocked). Per-type required text fields (e.g. Film Intro headline) follow FE §3.2.

## Ownership map (WRITE vs READ)
| Field | FE | CS | BO |
|---|---|---|---|
| `Banner.*`, `BannerSection.rotate` | read | — | write |
| `ContinueWatching.title/content/tag/enabled` | read | — | write |
| `ContinueWatching` list content (watch history) | read | — | read (system-supplied; not authored) |
| `Banner.item` (DB record ref) | read | — | select-only |
| `Ranking.enabled / title / tag / subtitle / platforms[].on` | read | — | write |
| `Platform` catalog (key/name/sub) | read | — | read (from BO Rankings module; select-only) |
| `ContentBlock.*` | read | — | write |
| `ContentBlock.dataType` catalog | read | — | read (from BO data-management modules; select-only) |

## Resolved decisions (gap engine)
| Finding | Lens | Status | Resolution | Contract field(s) | Test case |
|---|---|---|---|---|---|
| Operator pastes `javascript:`/`data:`/relative URL in a CTA or data source | abuse / trust&safety ‡ | RESOLVED | Accept absolute `http`/`https` only; reject & do not save otherwise | `Cta.url`, `ContentBlock.source` | BO-TC-03 |
| Half-translated field ships (one language blank) | trust&safety ‡ | RESOLVED | Bilingual coupling — fill one language → both required; both empty → omitted, no reserved space | all `Bilingual` fields | BO-TC-05 |
| Banner with no linked content | data integrity | RESOLVED | item-bearing types are item⇄upload (mutually exclusive): item mode requires `item`, upload mode uses an uploaded asset; Brand Intro uploads only; Event/Film Intro/AI Competition support item⇄upload | `Banner.type`, `Banner.srcMode`, `Banner.item` | BO-TC-09, BO-TC-10, BO-TC-11 |
| Data source requirement per type | data integrity | RESOLVED | Required for every DataType except `Events Data` / `Movie New`; `Co-creation` IS required | `ContentBlock.source` | BO-TC-06 |
| Who can edit / change history | auth ‡ / audit ‡ | NEEDS-POLICY-OWNER | Access control + change logging follow the existing BO admin (out of scope here) | — | — |

## Anchoring record
| Surface | Repo | Commit SHA | Base page |
|---|---|---|---|
| BO | — (standalone mock) | — | `prototype/index.html` |

## Assumptions
Defaults on "invisible" gaps — a human can override.
- Rotate interval: **5s** (per FE spec §3.6).
- Banner is **type-driven** (Brand Intro / AI Competition / Event / Film Intro); the type sets the item source, field set and required fields. Per-type fields, upload specs, masks, carousel and AI countdown follow FE spec §3.1–3.6 (not duplicated in the BO doc).
- Banner item / Ranking platforms / Data Type catalog are **read-only references** sourced externally (DB / BO modules); the CMS never creates them.
- Enable toggle sits at the top of each editor but **scrolls with content** (only Save/Cancel are frozen).
- SEO/GEO: `N/A — authenticated` (Back Office is behind login).
