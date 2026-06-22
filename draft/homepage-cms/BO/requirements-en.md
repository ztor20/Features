# Homepage CMS — Back Office Requirements

| Item | Details |
|------|---------|
| Routes | `/admin/homepage` (editor) · `/admin/homepage/audit` (audit log) |
| Folder | `homepage-cms/BO` |
| Version | 1.1 |
| Updated | 2026-06-22 |
| Anchored-commit | — (standalone mock; BO is never anchored) · live FE reference: https://ztor.lx7.com/ |

---

## 1. Purpose
The internal ops surface that controls the public ztor homepage (the black-&-yellow Ztor 2.0 home). Ops add a `Section` from a **template** (chosen from a gallery that previews its FE layout), edit each section's **Title / Subtitle / Content** (hide / edit / reorder), set a **CTA** (label + URL) and a named **Tag**, reorder / hide / delete sections, preview desktop/mobile, and run a draft → publish flow protected by an edit lock, editor/publisher roles, and an append-only audit log.

## 2. User scenarios
- **As a `homepage_editor`**, I open `/admin/homepage`, acquire the edit lock, add sections from previewed templates, edit their text elements (reorder/hide), set CTA links and tags, preview, and save a draft. Flow: open → acquire lock → add from template → edit `draftLayout` → preview → save draft (`DRAFT_DIRTY`).
- **As a `homepage_publisher`**, I review a dirty draft and publish it live, or hide a bad section and republish. Flow: open → review → Publish (`liveLayout := draftLayout`) → `DRAFT_CLEAN`.
- Key branches: someone else holds the lock → read-only; I'm an editor → Publish hidden; no `homepage_cms` → 403; double-click Publish → publishes once; a CTA URL is `javascript:`/relative → rejected; section count at cap → "Add" disabled.

## 3. Query Params
`?preview=desktop|mobile` (preview viewport; default `desktop`).

---

## 4. Homepage Editor  `/admin/homepage`

### 4.1 Layout
| Block | Description |
|-------|-------------|
| Top bar | Lock status, `publishStatus` badge (`DRAFT_CLEAN`/`DRAFT_DIRTY`), desktop/mobile toggle, **Save draft**, **Publish** (publisher only), **Discard draft**. |
| Left — Section list / canvas | Ordered `draftLayout.sections`; each row: template name, title, `enabled` (hide) toggle, tag chip, drag handle, delete. Reflects `Section.order`. **+ Add section** opens the template gallery (§5). |
| Center — Live preview | Renders `draftLayout` at the selected viewport; each section renders its visible `elements` in `elementOrder`, plus `tag` (if enabled) and `cta` (if enabled). Illustrative reuse of the FE renderer. |
| Right — Edit panel (drawer) | Opens on section select; slides in from the right so it's reachable at any window width. Contains: template (read-only), content source, banner image, the three element rows, CTA editor, Tag editor (see §4.3), and a footer with **Save** / **Cancel**. |

### 4.2 Interactions
| Action | Result |
|--------|--------|
| Open editor while `UNLOCKED` | Acquire lock; `AuditLog(lock_acquired)`. |
| Open editor while `LOCKED` by other | Read-only; banner "Locked by {name}"; writes blocked (409). |
| **+ Add section** → pick a template (§5) | New `Section` created with that `template`, seeded `elements`/`cta`/`tag`; added at end; `→ DRAFT_DIRTY`; `AuditLog(template_selected, section_added)`. |
| Drag a section to a new position | While dragging, the picked row dims and a **drop-indicator line** shows exactly where it will land (Asana/Linear-style); on drop `order` updates; `→ DRAFT_DIRTY`; `AuditLog(section_reordered)`. A drop at the original position is a no-op (no dirty/audit). |
| Toggle a section's `enabled` (hide/show) | `ENABLED ↔ DISABLED`; greyed when hidden; `→ DRAFT_DIRTY`; `AuditLog(section_hidden_changed)`. |
| Delete a section | Removed from `draftLayout`; `→ DRAFT_DIRTY`; `AuditLog(section_removed)`. |
| Edit an element's text (Title/Subtitle/Content) | Updates `elements[key].text`; `→ DRAFT_DIRTY`; `AuditLog(section_edited)`. Autosave debounced 2s. |
| Toggle an element's visibility | Flips `elements[key].visible`; element drops out of FE render; `→ DRAFT_DIRTY`; `AuditLog(element_visibility_changed)`. |
| Move an element up/down | Reorders `elementOrder`; preview re-renders; `→ DRAFT_DIRTY`; `AuditLog(element_reordered)`. |
| Set the content source (per-template: collection / feed / region+period / widget type) | Updates `Section.source`; `→ DRAFT_DIRTY`; `AuditLog(source_changed)`. This is what makes list/carousel templates populate. |
| Upload / replace / remove banner image (image-capable templates only) | Updates `Section.image.url`/`alt`; upload validated (PNG/JPEG/WebP, ≤5MB); `→ DRAFT_DIRTY`; `AuditLog(image_changed)`. |
| Toggle CTA + edit label/URL | Updates `cta`; URL validated (http/https only); `→ DRAFT_DIRTY`; `AuditLog(cta_changed)`. |
| Toggle Tag + name it | Updates `tag.enabled`/`tag.label`; `→ DRAFT_DIRTY`; `AuditLog(tag_changed)`. |
| Switch desktop/mobile | Preview re-renders; no data change. |
| **Save draft** | Persists `draftLayout`; stays `DRAFT_DIRTY`; releases lock on exit (`lock_released`). |
| **Publish** (publisher) | `liveLayout := draftLayout`, `liveVersion := draftVersion`, `→ DRAFT_CLEAN`, `lastPublishedAt/By` set; `AuditLog(published)`. Idempotent on `draftVersion`. |
| **Discard draft** | `draftLayout := liveLayout`; `→ DRAFT_CLEAN`; `AuditLog(draft_discarded)`. |

### 4.3 Element / CTA / Tag editing (right panel)
| Control | Behavior |
|---------|----------|
| Content source (per template) | Renders the `Section.source` fields for that template (see Per-template source config in `feature_description.md`): e.g. `top10_ranking` → Tabs (add/remove ranking-source names) + Region + Period; `film_list` → Tabs (fixed 最新影片/現正熱播/Ztor 精選 — tick to show) + Resource (All/Taiwan/Hong Kong/…) + Layout (Row/Grid); `cocreation_projects` → Auto feed + Crowdfund project IDs (IDs override the feed — FE shows exactly the IDs); `featured_campaign` → Linked campaign + optional Deadline; `viewing_history` → none (auto per-visitor). Templates with no source (`hero_banner`, `multi_campaign`) show no source control (`multi_campaign` uses its Campaign cards instead). |
| Banner image (image-capable templates: `hero_banner`, `featured_campaign`) | **Upload / Replace / Remove** a single cover image + **alt text** (≤120). Upload accepts PNG/JPEG/WebP ≤5MB (SVG excluded); invalid files are rejected with a message and not stored. Other templates show no image control (their imagery comes from linked content in v1). |
| Element rows (Title, Subtitle, Content) | All three are **optional** and start **empty** on a new section (no template defaults). Each row has: a **visibility** toggle (`elements[key].visible` — hide/show), a **text** input (edit; max length `title` 80 / `subtitle` 120 / `content` 500 chars), and **↑/↓** to set priority in `elementOrder`. Hidden or empty elements are excluded from FE render (a section may show only its template body). Valid orderings are any permutation/subset, e.g. `Title→Subtitle→Content`, `Title→Content→Subtitle`, `Title→Content` (subtitle hidden), `Content→Subtitle` (title hidden). |
| CTA | **Enable** toggle (`cta.enabled`); **label** input (≤40); **URL** input (≤2048). On save the URL must be absolute `http`/`https` — `javascript:`, `data:`, or relative URLs show an inline error and are not saved. **Exception** — `featured_campaign`: no URL field; the CTA (and the banner image) link to the linked campaign set in Content source (`source.campaignRef`). |
| Campaign cards (`multi_campaign` only) | A repeater of cards. **Add card** / **Remove card**; each card has its own **image (required, PNG/JPEG/WebP ≤5MB)**, **title**, **content**, and **CTA** (label + http(s) URL). Needs **≥1 card** and **every card must have an image** — the panel flags incomplete cards. `multi_campaign` also has an optional **section header** (title/subtitle/content) **and a section CTA** (label + http(s) URL) shown above the cards; no section-level image (each card carries its own image + its own CTA). **FE display: up to 3 cards per row; more than 3 scroll horizontally.** |
| Tag | **Enable** toggle (`tag.enabled`); **name** input (`tag.label`, ≤16). Disabled tag does not render on FE. |
| Save / Cancel (drawer footer) | The edit drawer is **modal**: while it is open the rest of the page (section list, top bar, + Add, switchers) is blocked — the operator can only **Save** or **Cancel** (or ✕). **Save** keeps this section's edits in `draftLayout` and closes (the change is in the draft, not yet public — it goes live only on **Publish**). **Cancel** / ✕ reverts every edit made since the drawer opened — including a section just added from the gallery — and closes. Clicking the dimmed backdrop does nothing (prompts "Save or Cancel first"); it never silently discards work. |

### 4.4 Branches / states
| Case | Behavior |
|------|----------|
| Empty / first-run (0 sections) | Canvas empty state "Add your first section"; clicking opens the template gallery; preview blank; Publish disabled. |
| Loading | Skeleton of top bar + list; gallery/edit disabled until loaded. |
| Locked by other | Read-only; list/handles/panel/gallery disabled; "Locked by {name} since {time}". |
| Save/publish error | Toast "Couldn't save — retry"; server `draftLayout` unchanged; lock retained. |
| Invalid CTA URL | Inline error under URL field ("Use a full http(s) link"); section not saved with the bad URL. |
| Permission-denied (no `homepage_cms`) | 403 page; editor never renders. |
| At section cap (50) | "Add section" disabled with "Max 50 sections" tooltip. |
| Ranking tab with no data (`top10_ranking`) | The tab still shows in the nav; its panel renders an empty placeholder ("No ranking data for this tab yet"). Each tab can be empty independently. |
| Co-creation project IDs (`cocreation_projects`) | If any `projectId` is added, FE renders **exactly those** (N IDs → N cards) in order and ignores the feed — no more, no less. With no IDs it pulls from the feed. Up to 3 per row, scroll beyond. |

**Disabled when:** role is `homepage_editor` → **Publish** and **force-unlock** hidden/disabled. Another user holds the lock → all edit controls disabled. `publishStatus == DRAFT_CLEAN` → **Publish** and **Discard draft** disabled. `cta.enabled == false` → CTA label/URL inputs disabled. `tag.enabled == false` → Tag name input disabled.

**State (`Homepage.publishStatus`):** `DRAFT_CLEAN` → `DRAFT_DIRTY` (any draft edit by lock holder); `DRAFT_DIRTY` → `DRAFT_CLEAN` (publisher Publish, or holder Discard). Illegal: `homepage_editor` ✗→ Publish.
**State (`LockState`):** `UNLOCKED` → `LOCKED` (enter edit); `LOCKED` → `UNLOCKED` (exit / 15-min idle / publisher force-unlock). Illegal: non-holder write while `LOCKED` (409).
**State (`Section.enabled`):** `ENABLED` ↔ `DISABLED` (lock holder hide/show); `DISABLED` sections omitted from `liveLayout`.

---

## 5. Add Section — Template gallery (modal)

### 5.1 Layout
| Block | Description |
|-------|-------------|
| Template grid | One card per `SectionTemplate`, in gallery order (`featured_campaign`, `multi_campaign`, `film_list`, `viewing_history`, `top10_ranking`, `hero_banner`, `cocreation_projects`, `announcement_banner`). Each card MUST show, beyond the name: its **key-difference label** + **one-line description** (see Template catalog in `feature_description.md`) and a **structurally distinct thumbnail** — so the operator can tell templates apart without selecting each. No two thumbnails share the same shape. |
| Preview pane | On hover/select, shows the chosen template's **key difference + description** and a larger FE preview with placeholder content (requirement: "select a template → review how it displays on FE, and what makes it different"). |
| Confirm | **Use this template** creates the `Section`. |

### 5.2 Interactions
| Action | Result |
|--------|--------|
| Hover/select a template card | Preview pane shows that template's key difference + description + a larger FE preview. |
| **Use this template** | Creates a `Section` with `template` set + seeded `elements`/`cta`/`tag`; closes modal; selects it in the editor; `AuditLog(template_selected, section_added)`. |
| Cancel | Closes modal; no change. |

### 5.3 Branches / states
| Case | Behavior |
|------|----------|
| At section cap | Gallery cannot be opened; "Max 50 sections" tooltip on Add. |
| Locked by other | Gallery disabled (read-only). |

---

## 6. Audit Log  `/admin/homepage/audit`

### 6.1 Layout
| Block | Description |
|-------|-------------|
| Filter bar | Filter by `action`, `actorId`, date range. |
| Log table | `AuditLog` rows: `at`, `actorId` (name) + `actorRole`, `action`, `targetSectionId`, `summary`. Newest first; paginates beyond 50 rows. |

### 6.2 Branches / states
| Case | Behavior |
|------|----------|
| Empty | "No activity recorded yet." |
| Permission-denied | Visible to `homepage_publisher` only; editor gets 403. |

**Disabled when:** viewer is `homepage_editor` → audit route returns 403.

---

## Performance & SEO
**Performance (all surfaces):** drag feedback < 100ms (optimistic) · element reorder & preview re-render < 1s · template-gallery preview render < 1s · autosave debounced 2s · section list virtualizes beyond ~50 rows · audit table paginates beyond 50 rows · editor app LCP < 2.5s · CLS < 0.1 · INP < 200ms. Preview re-render must not block input.
**SEO / GEO:** `N/A — authenticated` (Back Office is behind login; not indexable).

## Acceptance
- [ ] An editor can add (from a previewed template), edit, hide, delete, and reorder sections without engineering.
- [ ] Per section: Title/Subtitle/Content can each be hidden, edited, and reordered (`elementOrder`); CTA label+URL set; Tag enabled+named.
- [ ] Each template exposes its required controls: image (banner templates), content source (`Section.source` — collection/feed/region/widget per the catalog), so list/carousel templates can actually be pointed at content.
- [ ] `multi_campaign` supports multiple cards (add/remove), each with its own required image + title + content + CTA; the editor blocks/flags a section with zero cards or any card missing an image.
- [ ] Selecting a template shows a preview of how it renders on FE before the section is created.
- [ ] Each template card states its **key difference** (label + one-line description) and a structurally distinct thumbnail, so the operator can choose without trial-and-error.
- [ ] Saving a draft changes only `draftLayout`; visitors keep `liveLayout` until publish.
- [ ] (‡ concurrency) Two simultaneous enter-edit → exactly one acquires the lock; the other is read-only (409) — BO-TC-01
- [ ] (‡ auth) `homepage_editor` cannot publish (hidden + 403); no `homepage_cms` → cannot open CMS (403) — BO-TC-02
- [ ] (‡ idempotency) Two/retried Publish on the same `draftVersion` publish exactly once — BO-TC-03
- [ ] (‡ abuse) Editor cannot push content live; publisher review gate blocks it; attempt is auditable — BO-TC-04
- [ ] (‡ audit) Every edit/publish/discard writes an `AuditLog` row with `actorId`, `actorRole`, `at`, `action` — BO-TC-05
- [ ] (‡ trust&safety) Publisher takedown by hiding the section + republish; `DISABLED` sections never appear in `liveLayout` — BO-TC-06
- [ ] (‡ trust&safety/abuse) A `javascript:`/relative `Cta.url` is rejected and not saved; only http(s) persists — BO-TC-07
- [ ] (‡ trust&safety/abuse) A banner image of the wrong type or >5MB is rejected and not stored; PNG/JPEG/WebP ≤5MB persists — BO-TC-09
- [ ] (‡ money) No payment/refund endpoint reachable from the CMS — BO-TC-08
- [ ] (perf) Drag feedback < 100ms and preview re-render < 1s on a 50-section homepage.

## Test cases
- **BO-TC-01** — Given homepage `UNLOCKED` · When users A and B both POST enter-edit in the same instant · Then exactly one gets `lockedBy=self` (200), the other 409 "Locked by {A}". *(catches: two editors silently overwriting)*
- **BO-TC-02** — Given user is `homepage_editor` · When they POST publish · Then 403, `liveVersion` unchanged; And no-`homepage_cms` user GET `/admin/homepage` → 403. *(catches: privilege escalation / unauthorized access)*
- **BO-TC-03** — Given `draftVersion=7`, `liveVersion=6` · When publish sent twice with key `7` · Then `liveVersion=7` after the first; the second returns existing `liveLayout`, no 2nd `published` audit row. *(catches: double publish on retry)*
- **BO-TC-04** — Given an editor's draft has policy-violating content · When the editor tries to make it live · Then there is no editor publish path (blocked) and the draft edit is in `AuditLog`. *(catches: rogue editor bypassing review)*
- **BO-TC-05** — Given any editor action (add/edit/reorder/element change/cta/tag/publish/discard) · When it succeeds · Then an `AuditLog` row exists with the exact `actorId`, `actorRole`, `at`, `action`, `targetSectionId`. *(catches: untraceable changes)*
- **BO-TC-06** — Given a `Section` with `enabled=DISABLED` · When a publisher publishes · Then that section is absent from the `liveLayout` served to visitors. *(catches: takedown that doesn't hide content)*
- **BO-TC-07** — Given a section CTA · When `cta.url` is set to `javascript:alert(1)` or a relative path and saved · Then the save is rejected with an inline error and `cta.url` is not persisted; an `http(s)` URL saves fine. *(catches: stored-XSS / phishing via CTA link)*
- **BO-TC-08** — Given the CMS UI and API · When inspecting available actions · Then no charge/refund endpoint is exposed (money path absent by design). *(catches: scope creep adding an unguarded money path)*
- **BO-TC-09** — Given a banner-capable section · When uploading a `.svg` / `.exe` / a 9MB JPEG · Then the upload is rejected with a message and `Section.image.url` stays empty; a 2MB PNG uploads and renders in preview. *(catches: malicious/oversized media upload)*

## Not Included
- The public FE homepage renderer (consumes `liveLayout`; pre-existing, out of scope).
- Version rollback / restore (audit log is record-only — per scope).
- Scheduled publishing.
- Per-locale homepage content (single default-locale in v1).
- Tag color/style system (label only in v1).
- Publish notifications (NEEDS-POLICY-OWNER: Content Ops lead).
- Creator-facing (CS) editing.
