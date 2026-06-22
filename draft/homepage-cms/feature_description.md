# Homepage CMS (Back Office) — Feature description

## Purpose
**Problem:** Editing the ztor public homepage (https://ztor.lx7.com/ — the black-&-yellow Ztor 2.0 home) today means code changes and engineering round-trips — the ops team cannot add, reorder, configure, or take down homepage sections on their own. **Solution:** A Back Office visual CMS that controls exactly that homepage: ops create a section from a template (chosen from a gallery that previews how it renders on FE), edit each section's Title/Subtitle/Content (hide / edit / reorder), set a CTA URL and a named Tag, reorder/hide/delete sections, preview desktop/mobile, and publish a draft live — with an edit lock, editor/publisher roles, and an append-only audit log.
1. Section CRUD: add (from a previewed template) / edit / hide / delete / reorder `Section`s, with a live desktop/mobile preview.
2. Per-section content: `title`/`subtitle`/`content` each hideable, editable, and reorderable; a `Cta` (enable + label + URL); a `SectionTag` (enable + name).
3. A draft → publish flow gated by the `homepage_publisher` role, protected by an edit lock and an append-only `AuditLog`.

## Surface map
| Surface | Involved? | Role in this feature | Prototype |
|---|---|---|---|
| FE (fan) | N | Renders the published `liveLayout` (sections in order, `enabled`, `elements` by `elementOrder`, `cta`, `tag`). **Out of scope this feature** — the public renderer already exists; only illustrated inside the BO template preview. | none |
| CS (creator studio) | N | Not involved. | none |
| BO (back office) | Y | The homepage CMS editor: template gallery, drag canvas, edit panel, preview, draft→publish, roles, audit. | mock (BO is always a standalone mock), Ztor black-&-yellow theme |

## Core scenario (told ONCE, across surfaces)
- **Given** a `homepage_editor` opens the Homepage CMS while no one else holds the lock,
  **When** they acquire the edit lock, click "Add section", pick the `cocreation_projects` template from a gallery that previews its FE layout, edit its `title`/`content` (hiding `subtitle`), set `elementOrder = [content, title]`, enable a `Cta {label:"View projects", url:"https://ztor.lx7.com/cocreate"}`, enable a `SectionTag {label:"NEW"}`, reorder the section above `top10_ranking`, and switch the preview to mobile,
  **Then** `Homepage.publishStatus` flips `DRAFT_CLEAN → DRAFT_DIRTY`, each action writes an `AuditLog` row, and the changes live only in `draftLayout` (visitors still see `liveLayout`);
  **and When** a `homepage_publisher` reviews the draft and clicks Publish,
  **Then** `liveLayout := draftLayout`, `publishStatus → DRAFT_CLEAN`, `liveVersion := draftVersion`, and a `published` `AuditLog` row records actor + time. **(BO only; FE consumes `liveLayout` outside this feature.)**

## Data contract
**Shared nouns used** (referenced, not redefined): `User`, `UserId`, `Timestamp`, `Url`.

**Feature-specific entities & fields** (exact names + types):
- `Homepage { id: string, draftLayout: Layout, liveLayout: Layout, publishStatus: PublishStatus, lockedBy: UserId | null, lockedAt: Timestamp | null, draftVersion: int, liveVersion: int, lastPublishedAt: Timestamp | null, lastPublishedBy: UserId | null }`
- `Layout { sections: Section[] }`  — ordered; index == render order.
- `Section { id: string, template: SectionTemplate, order: int, enabled: boolean, elements: ElementSet, elementOrder: ElementKey[], image: ImageAsset, source: SourceConfig, items: CampaignItem[], cta: Cta, tag: SectionTag }`
- `ElementSet { title: Element, subtitle: Element, content: Element }`
- `Element { text: string, visible: boolean }`
- `ImageAsset { url: Url, alt: string }`  — `url` is an uploaded media asset (empty = none); `alt` ≤ 120 chars. Only meaningful for image-capable templates (see catalog).
- `CampaignItem { image: ImageAsset, title: string, content: string, cta: Cta }` — one card in a `multi_campaign` section. Used ONLY by `multi_campaign` (empty `[]` for every other template). Each card's `image` is **required**; `title`/`content`/`cta` are per-card.
- `SourceConfig` — a per-template object declaring WHAT content the section pulls (which collection / feed / region / widget). Shape varies by `template` (see Per-template source config); empty for templates that need no source (`hero_banner`). This is what makes list/carousel templates actually populate.
- `Cta { enabled: boolean, label: string, url: Url }`  — `label` ≤ 40 chars; `url` ≤ 2048.
- `SectionTag { enabled: boolean, label: string }`  — `label` ≤ 16 chars.
- `AuditLog { id: string, action: AuditAction, actorId: UserId, actorRole: Role, at: Timestamp, targetSectionId: string | null, summary: string }`

**Enums / allowed values:**
- `Homepage.publishStatus` (`PublishStatus`): `DRAFT_CLEAN | DRAFT_DIRTY`
- `Section.template` (`SectionTemplate`, generated from the existing ztor homepage section types): `featured_campaign | multi_campaign | film_list | viewing_history | top10_ranking | hero_banner | cocreation_projects | announcement_banner` (8 templates — `film_list` consolidates the former library_promo / screening_room_list / curated_collection; `featured_campaign` also covers the former ai_program; `multi_campaign` is the former community_posts, repurposed as a multi-card promo block; the former interactive_widget was removed)
- `Section.enabled` state: `ENABLED | DISABLED` (boolean field; "hide" sets `DISABLED`)
- `ElementSet` keys / `Section.elementOrder` values (`ElementKey`): `title | subtitle | content`
- `Role`: `homepage_editor | homepage_publisher` (both require permission `homepage_cms`)
- `AuditLog.action` (`AuditAction`): `lock_acquired | lock_released | section_added | section_removed | section_reordered | section_hidden_changed | template_selected | section_edited | element_reordered | element_visibility_changed | image_changed | source_changed | cta_changed | tag_changed | published | draft_discarded`
- Edit-lock state (`LockState`, derived from `lockedBy`): `UNLOCKED | LOCKED`

**Field rules:**
- `Section.elementOrder` is a permutation of `[title, subtitle, content]`; the FE renders, in this order, only the keys whose `elements[key].visible == true`. Hiding an element does not remove its `text`.
- **`multi_campaign` completeness:** a `multi_campaign` section needs **≥1 `CampaignItem`** and **every card must have an `image`**; per-card `title`/`content`/`cta` are optional. A card with no image, or a section with zero cards, is incomplete — the editor flags it and it must be fixed before Publish. `multi_campaign` renders an **optional section header** (the section-level `title`/`subtitle`/`content`, hide/edit/reorder) **plus a section-level `cta`** (label + http(s) URL, e.g. 進入創作大廳 →) **above its cards**; it has **no** section-level `image` (each card carries its own image + its own CTA, separate from the section CTA). **Display:** FE shows up to **3 cards per row**; more than 3 scroll horizontally (no wrap to a second row).
- **All three elements (`title`/`subtitle`/`content`) are optional.** A newly created section starts with all three **empty** — templates carry no default copy. An empty (or hidden) element renders nothing on FE; a section may legitimately show only its template body (e.g. a ranking with no heading).
- A `Section` is always created FROM a `template` (no blank section). The template determines the FE layout and seeds default `elements`/`cta`/`tag`.
- `Cta.url` must be an absolute `http`/`https` URL. `javascript:`, `data:`, and relative schemes are rejected (validated BO-side before save).
- **Click-through:** for `featured_campaign` the section's destination is `source.campaignRef`. On FE the banner image **and** the CTA button link to that destination (this template therefore has no separate `cta.url` — the CTA only carries a label). All other templates use `cta.url` for their CTA. Non-`http(s)` destinations render as non-clickable (an id is resolved to a URL by the FE renderer, out of scope here).
- `Section.image` upload is validated BO-side: type ∈ {`image/png`, `image/jpeg`, `image/webp`}, size ≤ 5MB; rejected uploads are not stored. `image` applies only to image-capable templates (`hero_banner`, `featured_campaign`); other templates ignore it (their imagery comes from linked content, not manual upload, in v1).

## Template catalog (gallery metadata)
Each `SectionTemplate` carries gallery metadata so an operator can tell templates apart at a glance: a **key-difference label** (`diff`), a **one-line description** (`desc`), and a **structurally distinct thumbnail/preview** (no two templates render the same shape). The gallery MUST show the key difference — not just the name — for every card.
| Template | Key difference | When to use |
|---|---|---|
| `featured_campaign` | Single promoted item | Spotlight ONE campaign/competition/program with a badge + CTA; deadline optional (set = time-limited, empty = evergreen, incl. the AI program) |
| `multi_campaign` | Multiple campaign cards | Optional section header (title/subtitle/content) + section CTA + several promo cards; each card = 1 image (required) + its own title, content & CTA |
| `film_list` | Tabbed film lists | A section with the fixed tabs 最新影片 / 現正熱播 / Ztor 精選 (each tickable) + a Resource filter, shown as a row or grid (consolidates the former library_promo, screening_room_list, curated_collection) |
| `viewing_history` | Personalized + progress | Per-user "continue watching" row with progress bars |
| `top10_ranking` | Numbered 1–10 | Big numbered ranking/leaderboard carousel |
| `hero_banner` | Full-bleed top hero | One big headline + CTA across full width; one per page, at the top |
| `cocreation_projects` | Funding cards | Project cards with a crowdfunding progress bar |
| `announcement_banner` | Thin notice strip | Slim text-only strip for time-sensitive news; no artwork |

**Banner image capability:** `hero_banner`, `featured_campaign` accept a single uploaded `image` (cover/background). `multi_campaign` uses a **required image per card** (`items[].image`). Other templates show no upload field in v1.

**Per-template source config** (`Section.source` shape per `template` — the editor renders these fields; every value above the generic title/subtitle/content/CTA/tag):
| Template | `source` fields | Notes |
|---|---|---|
| `featured_campaign` | `campaignRef`, `deadline?` | links one campaign/program; optional end date; image + click-through |
| `multi_campaign` | — (no `source`; content is `items[]` cards) | each card: image (required) + title + content + cta |
| `film_list` | `tabs` (the **fixed** set 最新影片 / 現正熱播 / Ztor 精選 — each tick on/off to show it; no add/rename), `resource` (All / Taiwan / Hong Kong / …), `layout` (Row/Grid) | renders a tab nav of the ticked tabs; `resource` filters the films; `layout` picks carousel vs grid. The homepage can hold multiple `film_list` sections, each configured independently. |
| `viewing_history` | — (auto, per-user) | system-populated; no manual items/image |
| `top10_ranking` | `tabs` (list of ranking-source names, e.g. Ztor/Netflix/Disney+…), `region` (Taiwan/Hong Kong/Global), `period` (This week/This month) | numbered ranking feed with a per-source **tab navigation**; each tab may be empty |
| `hero_banner` | — | image + elements + CTA only |
| `cocreation_projects` | `feed` (Active/Ending soon/Most funded), `projectIds` (list of crowdfund project IDs) | **Rule:** if `projectIds` is non-empty, FE shows **exactly those projects, one card each, in list order** (N IDs → N cards) and ignores `feed`; if `projectIds` is empty, FE shows the `feed`. Display: up to 3 cards per row, scroll beyond. |
| `announcement_banner` | — (no source) | slim text strip; no image; no items. Always shows while live; **ops take it down by hiding or deleting the section** (no visitor-dismiss) — e.g. switch it off once maintenance is done, else it stays on FE. |

## State machine (total — every value, legal + explicitly-illegal)

**`Homepage.publishStatus`:**
- `DRAFT_CLEAN` → `DRAFT_DIRTY` (trigger: lock holder makes any draft change)
- `DRAFT_DIRTY` → `DRAFT_CLEAN` (trigger: `homepage_publisher` publishes — `liveLayout := draftLayout`, `liveVersion := draftVersion`)
- `DRAFT_DIRTY` → `DRAFT_CLEAN` (trigger: lock holder discards draft — `draftLayout := liveLayout`)
- **Terminal:** none
- **Illegal (blocked):** `DRAFT_DIRTY` ✗→ `DRAFT_CLEAN` via publish by `homepage_editor` (403)

**`LockState`:**
- `UNLOCKED` → `LOCKED` (trigger: editor/publisher enters edit mode; sets `lockedBy`, `lockedAt`)
- `LOCKED` → `UNLOCKED` (trigger: lock holder exits/saves; OR 15-min idle timeout; OR `homepage_publisher` force-unlock)
- **Illegal (blocked):** any write by a non-holder while `LOCKED` ✗→ applied (read-only; 409 Locked)

**`Section.enabled`:**
- `ENABLED` → `DISABLED` (trigger: lock holder hides) — omitted from `liveLayout` on next publish; shown greyed in editor
- `DISABLED` → `ENABLED` (trigger: lock holder un-hides)
- **Terminal:** none

## Ownership map (who WRITES vs READS each field, per surface)
| Field | FE (out of scope) | CS | BO |
|---|---|---|---|
| `Section.template` | read | — | write (set once at create) |
| `Section.order` / `enabled` | read | — | write (editor, lock-held) |
| `Section.elements` / `elementOrder` | read | — | write (editor, lock-held) |
| `Section.image` (image-capable templates) | read | — | write (editor, lock-held) |
| `Section.source` (per-template) | read | — | write (editor, lock-held) |
| `Section.cta` / `tag` | read | — | write (editor, lock-held) |
| `Homepage.liveLayout` | read (renderer) | — | write (publisher, via publish) |
| `Homepage.publishStatus` / `lockedBy` / `lockedAt` | — | — | write (system) |
| `Homepage.liveVersion` / `lastPublishedAt` / `lastPublishedBy` | read | — | write (system on publish) |
| `AuditLog` | — | — | write (system); read (publisher) |

## Resolved decisions (gap engine)
| Finding | Lens | Status | Resolution | Contract field(s) | Test case |
|---|---|---|---|---|---|
| Two ops edit the same homepage at once | concurrency ‡ | RESOLVED | Pessimistic edit lock on `Homepage.draftLayout`. First to enter edit mode sets `lockedBy`; others read-only (409). Auto-release after 15 min idle or publisher force-unlock. | `lockedBy`, `lockedAt`, `LockState` | BO-TC-01 |
| Editor tries to publish | auth ‡ | RESOLVED | Only `homepage_publisher` may publish/force-unlock. `homepage_editor` edits draft only. Both need `homepage_cms`; others 403. | `Role`, `publishStatus` | BO-TC-02 |
| Publish retried (double-click / network retry) | failure/idempotency ‡ | RESOLVED | Idempotency key = `draftVersion`. Publishing when `liveVersion == draftVersion` is a no-op returning existing `liveLayout`. | `draftVersion`, `liveVersion` | BO-TC-03 |
| Rogue/compromised editor pushes bad content live | abuse ‡ | RESOLVED | Editor cannot publish (role split = review gate); all actions audited. Self-dealing/bot/spam N/A (internal authed tool). | `Role`, `AuditLog` | BO-TC-04 |
| Cross-user boundary on `Homepage` | auth ‡ | RESOLVED | See ownership map; staff without `homepage_cms` cannot read/mutate `Homepage` (403). | ownership map | BO-TC-02 |
| Record who changed/published what, when | audit ‡ | RESOLVED | Every `AuditAction` writes an `AuditLog` row (`actorId`, `actorRole`, `at`, `targetSectionId`, `summary`). Append-only, no rollback (per scope). | `AuditLog.*` | BO-TC-05 |
| Bad content is live; takedown | trust&safety ‡ | RESOLVED | Gate = publisher review before publish. Takedown (no rollback): publisher hides the `Section` (`enabled=DISABLED`) and/or discards draft, then republishes. Age-gating N/A — general-audience homepage. | `Section.enabled`, `publishStatus` | BO-TC-06 |
| Malicious CTA link (phishing / `javascript:` URL) | trust&safety / abuse ‡ | RESOLVED | `Cta.url` validated BO-side: absolute `http`/`https` only; `javascript:`/`data:`/relative rejected with an inline error; not saved. | `Cta.url` | BO-TC-07 |
| Malicious banner upload (wrong type / oversized / script payload) | trust&safety / abuse ‡ | RESOLVED | `Section.image` upload validated BO-side: MIME ∈ {png,jpeg,webp} + size ≤ 5MB; anything else rejected and not stored. (SVG excluded to avoid embedded script.) | `Section.image` | BO-TC-09 |
| Does this feature move money? | money ‡ | RESOLVED (N/A) | No value transfer — CMS edits layout/content only. CTA may link to paid pages but no charge/refund occurs here. | — | BO-TC-08 |
| Empty homepage (0 sections) | empty/first-run | RESOLVED | Canvas shows empty state + "Add your first section"; opens the template gallery; preview blank. | `Layout.sections` | — |
| Limits/caps | limits/caps | RESOLVED | Max **50** sections; `title` ≤ 80, `subtitle` ≤ 120, `content` ≤ 500, `Cta.label` ≤ 40, `Cta.url` ≤ 2048, `SectionTag.label` ≤ 16, `ImageAsset.alt` ≤ 120 chars, image ≤ 5MB. At cap: "Add" disabled with tooltip. (Soft caps — overridable.) | `Layout.sections`, `Element`, `Cta`, `SectionTag`, `ImageAsset` | — |
| Notify someone on publish | notification | NEEDS-POLICY-OWNER | Whether/whom to notify on publish — owner: Content Ops lead. v1 ships none. | — | — |
| Multi-locale homepage (site has 中/EN) | i18n | NEEDS-POLICY-OWNER | Per-locale homepage content — owner: Product. v1 manages a single default-locale homepage. | — | — |

## Anchoring record
| Surface | Repo | Commit SHA | Base page |
|---|---|---|---|
| BO | — (standalone mock) | — | — |
| FE | `ztor20/Frontend` (out of scope this feature) | not anchored | live reference: https://ztor.lx7.com/ |

## Assumptions
Defaults chosen on "invisible" gaps — a human can override.
- Edit-lock idle timeout: **15 minutes**.
- Autosave of draft edits: debounced **2s** (server-persisted).
- Soft caps: 50 sections; text lengths 80/120/500; CTA label 40, URL 2048; tag label 16.
- Timestamps stored UTC, displayed in viewer timezone.
- No scheduled publishing in v1.
- One `SectionTag` per section (enable + name); no preset color/style system in v1 (label only).
- `SectionTemplate` values are generated from the current ztor homepage section types observed at https://ztor.lx7.com/ ; the catalog can grow without contract changes elsewhere.
- FE rendering of `liveLayout` is pre-existing and out of scope; this feature ships the BO editor and the `liveLayout` contract it must consume.
- **Greenfield design (not reverse-engineered):** field names, enums, state machine and routes are a proposed clean design, NOT extracted from any existing CMS implementation. The dev team builds to this contract fresh; no legacy field/endpoint compatibility required. (Confirmed scope: rebuild, no alignment to old code.)
