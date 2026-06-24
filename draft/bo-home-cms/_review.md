# BO Home CMS — Fresh-Context Review

Fresh-context adversarial review of `requirements-en.md` ↔ `requirements-zh-hant.md` ↔ `prototype/index.html`. Focus: spec↔prototype consistency, internal coherence, EN↔ZH parity, and the four CHANGED-THIS-ROUND areas (banner groups, Add Platform picker, Data Type provenance, data-source rule).

## Results

| Check | Verdict | Evidence |
|---|---|---|
| A1. Same sections/numbering both docs | PASS | Both: metadata → 1 Purpose → 2 User scenarios → 3 Query Params → 4 Banner 4.1–4.4 → 5 Ranking 5.1–5.4 → 6 Content Block 6.1–6.4 → Performance & SEO → Acceptance → Test cases → Not Included. Identical headings. |
| A2. Identifiers byte-identical | PASS | `BannerResource` = `Movie/TV List \| Events Data \| Movie News \| Crowdfund` (both §4.4 l.66). 10 `DataType` names identical (l.158). UI-style names + defaults identical (§6.3 tables, l.143–152). `BO-TC-01`..`BO-TC-09` both. Only prose translated. |
| B3. BannerResource = exactly 4 groups; Customize GONE; prototype `BANNER_RES`; valid seed; no NO_ITEM | PASS | Docs §4.4 list the 4 groups. Prototype `BANNER_RES=['Movie/TV List','Events Data','Movie News','Crowdfund']` (l.538). Seed banner `resource:'Events Data'` (l.546). No `NO_ITEM`/`needsItem` anywhere. |
| B4. Events Data INCLUDES Blind Box + AI Competition | PASS | §4.4 "`Events Data` includes Blind Box + AI Competition items" (l.66, both); BO-TC-09 asserts it (l.205). Prototype `BANNER_ITEMS['Events Data']` = AI 短片大賽, Z-ORIGIN AI 計畫, 名導盲盒, 影展限定盲盒, 金馬影展 (l.541). |
| B5. Items from BO module; CMS select-only; Item required for every group | PASS | §4.4 BannerItem note + §4.2 picker rows + Not Included l.211. Prototype `renderBItem` always shows field (l.703), `saveBanner` blocks when `!curBItem` (l.746). Picker = image+name cards (`pkcard`/`pkthumb`, `thumbFor`). |
| B6. No leftover Customize / old 5-enum anywhere | PASS | `grep -ni customize` over both `.md` + prototype = 0 hits. No `AI Competition`/`Blind Box`/`Movie` as standalone top-level resource. |
| C7. Add Platform = picker from BO Rankings (not free-typed); no "New Platform" push | PASS | `rAddPf` builds `avail` from `RANKING_PLATFORMS` minus taken, calls `openPicker({title:'SELECT PLATFORM (from BO Rankings)',badge:'BO'})` (l.681–686). §5.2 dedicated + Add Platform row; §5.4 "catalog supplied by the BO Rankings module"; Not Included names it (l.213). No blank-row push. |
| D8. §6.3 note: Data Types map to BO data-management modules, NOT hardcoded | PASS | §6.3 blockquote l.154 lists the 9 modules + Co-creation, "must read the list dynamically, not hardcode it"; Not Included l.212. Prototype Data Type heading "選項來自 BO data-management 模組(非寫死)" (l.264). |
| D9. DataType→UI table 10 rows; selectable/fixed/defaults match `DT` | PASS | Table 10 rows match `DT` (l.352–363): Ztor=Video List, Movie/Tv=片單, Tastemaker=User List, Ranking/Award=片單排行榜; fixed = Movie Review, Events Data, Movie New, Box Office, Co-creation. Box Office "single (fixed)" → `dtSelectable` false (1 style). Table has blank line before it. |
| D10. Source required for all EXCEPT {Events Data, Movie New}; Co-creation REQUIRES source | PASS | Prototype `NO_SOURCE=['Events Data','Movie New']` (l.369); `needsSource` used in `saveModal` (l.514). §6.3 branch rows + Acceptance l.187–188 + BO-TC-06 (l.202) all agree Co-creation needs a source. |
| E11. Bilingual-coupled rule in docs + enforced in prototype | PASS | Banner Header/Title/Content, Ranking Subtitle, Block Tag/Subtitle/Description. `saveBanner coupleB` (l.740), `saveRanking` subtitle couple (l.666), `saveModal couple` Tag/Sub/Desc (l.508–513). FE preview omits empty fields (l.780–805). |
| E12. Enable toggle scrolls (not frozen); only `.mfoot` frozen | PASS | All three modals: `.mtop` lives inside `.mbody` (l.241 content, l.282 banner, l.316 ranking). `.mbody{overflow:auto}` (l.88), `.mfoot{flex:none}` (l.148). §4.1/§5.1/§6.1 + one Acceptance bullet each. |
| E13. Delete 🗑 for Banner + Content Block, NOT Ranking | PASS | `data-bdel` (l.568/577) + `data-del` (l.395/404) wired; `rankRow` has only ★/⚙/toggle (l.215–220), no delete. BO-TC-08 asserts ranking exposes no delete. |
| E14. URL allows http OR https | PASS | Regex `^https?:\/\/` in `saveBanner` (l.753) and `bannerCarousel` (l.776). No bare "http(s)" in prose (docs use `http`/`https`). |
| E15. CTA optional, needs name + http/https; Block Title required + source rule; Ranking Title required | PASS | `saveBanner` per-CTA name + url checks (l.750–754); `saveModal` requires zhTitle/enTitle (l.506); `saveRanking` requires title (l.664). |
| F16. Script parses; no broken/leftover identifiers; modals open | PASS | `new Function(scriptBody)` → PARSE_OK. No `needsItem`/`Customize`/`tagOn`/`NO_ITEM`. All controls (`btnAddBanner`, `rankEdit`, `btnAdd`, `bItemField`, `dsField`, `rAddPf`) map to documented interactions. |
| F17. No internal-only notes leaked | PASS | No LOCKED/已鎖定, ticket→date mapping, or confirmation dates in either `.md`. (See nit 1 re: cosmetic `#3` build labels in the prototype only.) |
| F18. BO-TC ids contiguous 01–09, observable Then, both docs | PASS | `BO-TC-01`..`BO-TC-09` present in both, contiguous, each with an observable Then. |

## Findings

### Blocking
None.

### Non-blocking nits
1. **Cosmetic build labels in the prototype** — `<title>… (enhanced #3)` (l.6), the PROTOTYPE note banner "Content Block enhanced (#3)" (l.184), and code comments `BANNER (#1)` (l.534). These are mock-build artifacts, not spec leaks (no ticket→date mapping, no decision history), and live only in the illustrative prototype, never in the authoritative `.md`. Harmless; could be tidied for stakeholder polish.
2. **Seed `RANKING_PLATFORMS` vs initial `ranking.platforms` minor sub-text drift** — e.g. existing `KKTV` seed sub `'Netflix 綜合 天排行榜'` (l.603) vs catalog `'KKTV 綜合 天排行榜'` (l.614). Prototype-only seed data; does not affect the spec or any rule. Cosmetic.
3. **`SOURCES` are placeholder content-block data-source names** (l.368) explicitly commented "real data comes from another BO module" — consistent with the dynamic-catalog spec; no action needed.

## Conclusion
Full parity across EN/ZH; all four CHANGED-THIS-ROUND areas (4-group BannerResource with Customize removed, Events Data containing Blind Box + AI Competition, Add Platform picker from BO Rankings, dynamic Data Type provenance, Co-creation-requires-source) are consistent between the spec docs and the prototype. Script parses; no broken/leftover identifiers. Only cosmetic nits in the illustrative prototype.

**Verdict: PASS**
