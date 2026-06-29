# BO Home CMS — Fresh-Context Critic Review

**Reviewed: 2026-06-26**

Reviewer judged ONLY from the files (requirements-en / requirements-zh-hant / feature_description / feature_summary / README / prototype/index.html). Verifies internal consistency, prototype↔spec match, and correct "changes vs existing CMS" framing against the signed-off FINAL model.

## Per-check results

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Change framing — §1A in both files, 5 NEW items + unchanged note, Version 1.1 / 2026-06-26 | PASS | `requirements-en.md:18-28`, `requirements-zh-hant.md:18-28`; both `| Version | 1.1 |` (line 7) + `| Updated | 2026-06-26 |` (line 8). 5 NEW rows (Banner, Continue Watching, Ranking Tag, Content Block Tag, Data Types) + ✅ unchanged row present. |
| 2 | AI Competition consistency — item-only / no upload / no toggle / no text / no CTA everywhere | PASS | Type table `en:57`; source rule `en:62`; interactions `en:72-73`; branches `en:87`; validation `en:96-98`; data shape `en:102-103,106`; acceptance `en:259,261`; BO-TC-09 `en:297`, TC-10 `en:298`, TC-11 `en:299`. feature_description `27,35,44`; feature_summary `12,33`. Prototype `index.html:695 itemOnly:true,uploads:[]`, `947-949 isAI hides bTextWrap/bCtaWrap`, `1024-1028 isAI→empty text + ctas:[]`. No "item⇄upload" / "can add CTA" / AI-text leftovers. |
| 3 | Custom background = sample popup (`bg`), image uploaded, CTA ≤1; ContentBlock uses `bg` not `bgImage` | PASS | `en:213,232,237`; `zh:213,232,237`; feature_description `31`. `bg` = sample-library key, `image` = upload. Prototype `BG_SAMPLES` (3 samples) `index.html:565-569`, `cBg` `570`, `bgpicker` `444`, `NO_SOURCE` includes Custom `481`, Custom CTA cap 1 `673`. `bgImage` appears ONLY on Banner, never on ContentBlock. |
| 4 | Contract integrity — all surface fields/enums exist in feature_description; DataType=12, BannerType=4 | PASS* | `DataType` 12 values `feature_description:37` / `en:238` (9 existing + Co-creation + AI Competition + Custom). `BannerType` 4 `feature_description:35` / `en:105`. Prototype `DT` object has all 12 `index.html:462-474`. *See Issue I-1: a stale "(10)" count label, cosmetic / non-blocking. |
| 5 | State-machine totality — srcMode transitions; AI always item; Brand Intro always upload | PASS | `feature_description:43-49` total state machine: `srcMode item⇄upload` legal for Event/Film Intro, illegal `item`+null / `upload`+non-null; AI always `item`; Brand Intro always `upload`. Mirrored `en:103,106`. Prototype `index.html:954-956` forces item for itemOnly, upload for no-item types. |
| 6 | Bilingual parity — identifiers/numbers byte-identical, both have §1A, BO-TC-01..12 in both | PASS | Both files have exactly 12 BO-TC IDs (BO-TC-01..12), one §1A each, Version 1.1 / 2026-06-26. Enums (`BannerType`, `DataType`, field names, `5s`, `≤15MB`, max-2 / max-1) byte-identical EN vs ZH. |
| 7 | Prototype ↔ spec — AI no text/CTA/upload, Custom bg picker, Ranking Tag, CW no CTA, JS parses | PASS | `isAI` `947,1013`, `bTextWrap`/`bCtaWrap` hidden `948-949`, `itemOnly` `695,954`; `BG_SAMPLES`/`cBg`/`bgpicker` present; `rzhTag` (Ranking Tag) `395`, `cwzhTag`/`cwenTag` (CW Tag) `420,425`; Continue Watching editor has Title/Content/Tag only, NO CTA field/handler. `<script>` block validates via `new Function()` → "SCRIPT PARSES OK". |
| 8 | No stale contradictions — "3s", old labels, CW+CTA, "Custom banner type" | PASS | grep: no "3s"/"3秒" rotate; no "Home Page Banner/Ranking/Layout" labels; every "Continue Watching … CTA" hit is "no CTA"; every "Custom" hit is the Custom **Data Type**, never a Banner type; no AI+upload contradiction. |

## Issues

- **I-1 (minor / non-blocking) — stale "10" Data Type count.** §6.1 editor-row says "**Data Type** (10)" (`requirements-en.md:189`, `requirements-zh-hant.md:189`) and the §6.3 narrative says "The 10 Data Types correspond to … (9 modules) plus Co-creation" (`requirements-en.md:234`, `requirements-zh-hant.md:234`), while the `DataType` enum and the §6.3 table both list **12** (`en:232,238`). The narrative is defensible — "10" = the data-management-catalog-backed types (9 modules + Co-creation), excluding Custom (no data source) and AI Competition (fixed source). But the bare "(10)" in §6.1 reads as a direct count mismatch with the 12-row table above it. Recommend: change §6.1 to "Data Type (12)" (or "12: 9 existing + Co-creation/AI Competition/Custom") and reword §6.3 to "10 of the Data Types are supplied by the BO data-management modules (9 + Co-creation); AI Competition / Custom are added by this CMS." Does NOT contradict the signed-off model (Data Type count = 12) and does not block build — flagged for tidiness.

## Verdict

All 8 checks PASS. The spec is internally consistent, the EN/ZH pair is byte-identical on identifiers, and the prototype matches the signed-off FINAL model: AI Competition is item-only with no text / no CTA / no upload (all content + 7-stage countdown from the linked item); Custom = sample-popup background (`bg`) + uploaded image + CTA≤1; Ranking and Content Block both gained a bilingual Tag; Continue Watching has no CTA. The change framing (§1A) correctly lists the 5 NEW/CHANGED items vs the existing-CMS baseline. Only one cosmetic count-label nit (I-1), which does not contradict the model.

VERDICT: PASS
