# Homepage CMS (BO) — Final Pre-Push Review

Fresh-context critic, re-run after the `film_list` prototype-copy fix. Judged from files on disk only.

## Results

| # | Gate | Result |
|---|------|--------|
| 0 | Prior failure (F1): prototype `film_list` `desc` + `USE` describe fixed tickable tabs, no "New/Trending/Curated/Manual", no `curated_collection` | PASS |
| 0b | Prior dead code (F2): `widget`/removed-template CSS, `tplMock`, `case` leftovers | PASS (removed) |
| 1 | Contract integrity (forward + reverse) | PASS |
| 2 | Exactly 8 templates, same gallery order, across enum + BO §5 + prototype `T`; no active ref to 6 removed | PASS |
| 3 | State-machine totality (publishStatus, LockState, Section.enabled) | PASS |
| 4 | 9 ‡ rows BO-TC-01..09: contract field + failing test + acceptance | PASS |
| 5 | Thresholds present | PASS |
| 6 | Performance & SEO block; SEO N/A authenticated | PASS |
| 7 | States coverage (empty/loading/error/permission-denied/locked + invalid CTA URL) | PASS |
| 8 | Per-template specifics consistent | PASS |
| 9 | Prototype JS internally consistent + null-guarded; modal drawer; drop-indicator; no source/config on FE | PASS |
| 10 | Provenance banner; standalone mock (no repo@SHA) | PASS |
| 11 | Bilingual parity (8 keys, field names, numbers, BO-TC ids byte-identical) | PASS |

## Findings

**F1 (prior blocker) — FIXED.** The prototype's `film_list` gallery copy now matches the authoritative fixed-tabs contract:
- `T.film_list.desc` (index.html:298): "Tabbed film lists (最新影片 / 現正熱播 / Ztor 精選 — tick to show) + a Resource filter, shown as a horizontal row or a grid."
- `USE.film_list` (index.html:321): "Show tabbed film lists (最新影片 / 現正熱播 / Ztor 精選, tick to show) with a Resource filter, as a row or grid…"
- `SRC.film_list` (index.html:311): fixed `checks` of 最新影片/現正熱播/Ztor 精選 + Resource select + Layout Row/Grid.

Grep over the whole prototype confirms zero occurrences of the old "New / Trending / Curated / Manual" model and zero occurrences of `curated_collection`. The three fixed-tab strings each appear exactly 3× (desc, USE, SRC), consistent.

**F2 (prior low-severity) — FIXED.** Grep for `widget`, `.pv-widget`, `.mock.widget`, `shape:'widget'`, and any `tplMock` widget branch returns nothing in the prototype. The cited lines (old 112-113, 203, 345) no longer hold widget artifacts. No dead code for any removed template remains.

**Removed-template sweep.** The 6 removed templates (`ai_program`, `library_promo`, `screening_room_list`, `curated_collection`, `community_posts`, `interactive_widget`) appear ONLY in the explicit "consolidates / former / removed" provenance note in `feature_description.md` (lines 41, 63). No active reference anywhere else. The generic word "widget" survives only as a benign catalog descriptor of `Section.source` content type in feature_description.md:34 and both BO requirements (en:48,138 / zh:48,138) — not a template reference. Acceptable.

**8-template set.** `feature_description.md:41` enum, BO §5 grid (en/zh:94), and prototype `T` (index.html:296-303) all list the same 8 in the same gallery order: featured_campaign, multi_campaign, film_list, viewing_history, top10_ranking, hero_banner, cocreation_projects, announcement_banner.

**Per-template specifics.** featured_campaign click-through resolves to `source.campaignRef` (no separate cta.url) via `linkField`/`sectionDest` (index.html:331-332, 506-509), banner image + CTA both link. multi_campaign: section header + section CTA above cards (rendered before body for multi only, 466-467), per-card image-required flag (552, 496), max-3-per-row scroll (CSS 151-157). film_list fixed ticked tabs + resource + layout (473-481). top10 editable source tabs + region + period, empty-tab placeholder (484-490). viewing_history auto/no-source (309). cocreation feed + projectIds override (499-503). announcement no source, ops-takedown by hide/delete (feature_description.md:82). hero single image + elements + CTA (301, heroBg 465). All consistent with both .md files.

**State machines** total in both .md files and enforced in prototype (publishStatus DRAFT_CLEAN↔DRAFT_DIRTY, LockState UNLOCKED↔LOCKED with 409, Section.enabled ENABLED↔DISABLED). Editor-cannot-publish 403 enforced (705-710).

**9 safety rows** BO-TC-01..09 each carry a contract field, a Given/When/Then test case, and an acceptance checkbox; ids appear exactly 2× each (acceptance + test case) in both en and zh — byte-identical.

**Prototype hygiene.** Provenance banner present (210), standalone mock with no repo@SHA (grep clean). Drawer is modal with backdrop that blocks but does not discard (737-738). Drag drop-indicator present (#dropline). FE preview renders no source/config (note at 467). JS is null-guarded throughout (`if(el)`/`byId` guards); every template has a `templateBody` branch or default, so any drawer opens without throwing.

**Bilingual parity** holds: same 8 template keys, identical source field names, identical numeric thresholds (50 / 80 / 120 / 500 / 40 / 2048 / 16 / 5MB / 15-min / 2s), identical BO-TC ids.

No blocking findings remain.

**Verdict: PASS**
