# BO Home CMS — Fresh-Context Critic Review (re-verification)

Reviewed: 2026-06-25

Re-verifying the two prior FAIL items (now claimed fixed) plus a full re-scan for stale/contradictory text. Judged only from the files.

## Gate table

| # | Gate | Result | Evidence |
|---|------|--------|----------|
| 1 | Prior Issue 1 — prototype `itemOnly` dead branch + stale comment | PASS | `grep itemOnly prototype/index.html` = 0 hits. `renderBSource` (lines 898–903) shows the Item⇄Upload toggle for item-bearing types and forces `bSrcMode='upload'` for Brand Intro (line 901). No item-only flag on `BTYPE['AI Competition']`; its note reads "item ⇄ 上傳 二選一". |
| 2 | Prior Issue 2 — feature_summary "every group / 每個群組" | PASS | feature_summary.md line 20: "Banner = an Item only in item mode (Brand Intro & upload mode need none)". Line 41 (繁中): "Banner 僅 item 模式需選 Item(Brand Intro 與上傳模式不需)". No "every group / 每個群組" anywhere except this file's history quotes. |
| 3 | Banner model integrity (4 types, Brand Intro no item, item⇄upload one-of) | PASS | requirements §4.2/§4.5/§6.4 + feature_description state machine consistent; AI Competition item source = Events Data; upload mode has no schedule source (documented intentional deviation). |
| 4 | AI Competition CTA (max 2, all 4 types) | PASS | Prototype line 895 enables CTA for all types incl. AI Competition; §4.5 "max 2 (incl. AI Competition)". |
| 5 | "no CTA" applied only to Continue Watching | PASS | Only Continue Watching is "no CTA" (req-en 86, feature_description 6/25). Not applied to AI Competition. |
| 6 | Continue Watching fixed / logged-in / Title-Content-Tag / no reorder | PASS | §4A + state machine consistent; no "Continue Watching … CTA" leftover. |
| 7 | Rotate interval = 5s (no "3s") | PASS | All occurrences are 5s / 5 秒 / 5000 (req 35/73/241/278, prototype 217/1027). Zero "3s". |
| 8 | No "Custom banner type" | PASS | `BannerType` = `Brand Intro \| AI Competition \| Event \| Film Intro`. Custom exists only as a Content-Block Data Type (FE #8 Gradient). |
| 9 | No old labels ("Home Page Banner/Ranking/Layout") | PASS | Labels are "Banner / Continue Watching / Ranking / Layout Sequence". |
| 10 | Banner source mapping AI Competition→Events Data (not →AI Competition) | PASS | req §4.2/data, feature_description 35: "AI Competition→Events Data". (Content-Block AI Competition data source = AI Competition is a separate, correct mapping.) |
| 11 | Bilingual parity of identifiers/numbers; BO-TC-01..12 in both langs | PASS | Both langs have all 12 (BO-TC-01..12), unique. Enum/field identifiers byte-identical across the pair. |
| 12 | Prototype JS — no undefined-id references from the fix | PASS | All `getElementById` refs resolve; `bdrop`/`bdrop2`/`pfdrop` created dynamically, `pvbannerEl` rendered into `pvwrap`. |
| 13 | "item-only" strings are only anti-pattern catch-notes | PASS | "item-only" appears only in BO-TC-11 catch text ("AI Competition wrongly locked item-only" / "AI 比賽被鎖 item-only") in both langs — correct bug-to-catch descriptions. |

## Remaining issues

**Fixed during this review (1, same family as prior Issue 2 — comment-only, not new logic):**
- prototype/index.html (~line 634) carried a retired comment "Banner Resource = a GROUP … **Every group requires one item.**", contradicting the adjacent "Brand Intro has NO item" line and the signed-off item⇄upload model (revived the retired Banner-Resource "group" framing). Rewritten: items select-only from BO modules; item-bearing types are item⇄upload (one-of); Brand Intro has no item; item required only in item mode. No code/logic changed.

No other contradictions or stale leftovers found.

VERDICT: PASS
