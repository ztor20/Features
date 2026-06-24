# BO Home CMS — Fresh-Context Consistency Review

Reviewer: adversarial fresh-context critic. Judged only from files on disk:
`requirements-en.md`, `requirements-zh-hant.md`, `prototype/index.html`.

## Results

| Check | Verdict | Evidence |
|---|---|---|
| A1. EN↔ZH section structure & numbering | PASS | Both docs: metadata table; 1 Purpose/目的; 2 scenarios; 3 Query Params; 4 Banner 4.1–4.4; 5 Ranking 5.1–5.4; 6 Content Block 6.1–6.4; Performance & SEO; Acceptance/驗收; Test cases; Not Included. Identical headings/order. |
| A2. Byte-identical identifiers | PASS | `BannerResource` enum `AI Competition \| Blind Box \| Movie \| Customize \| Crowdfund` (EN/ZH §4.4 l.66). 10 `DataType` names identical (l.157). UI-style names + defaults identical (§6.3 tables). BO-TC-01..10 identical. Only prose translated. |
| B3. Bilingual-coupled rule across all 3 surfaces | PASS | EN/ZH §4.4, §5.4, §6.4 all state "fill one → both required; both empty → omitted, no reserved space". Prototype enforces: `coupleB` in `saveBanner` (l.724), subtitle IIFE in `saveRanking` (l.655), `couple()` in `saveModal` (l.508). |
| B4. Required-field truth matches prototype | PASS | Banner: Item required every group + text optional (`saveBanner` l.730 `if(!curBItem)`; coupleB on text). Ranking: Title both langs required (`req('rzhTitle');req('renTitle')` l.653), subtitle coupled. Content Block: Title required (l.506) + source required per rule F. |
| C5. Banner group→item model; Customize incl.; no NO_ITEM exemption | PASS | `BANNER_ITEMS` has all 5 groups incl. `Customize` (l.542). `renderBItem` always shows field, no `needsItem`/`NO_ITEM` (l.687). Item required for all in `saveBanner`. Docs §4.4: "Required for every group … including `Customize`". |
| C6. Not Included lists external deps; §6.3 note | PASS | EN/ZH Not Included list "Authoring of Banner groups (Resources) and the events/items" + "Data Type catalog" as external deps. §6.3 note: "The Data Type options come from another BO module" (l.153). |
| D7. Enable scrolls (not frozen); only Cancel/Confirm frozen | PASS | Docs §4.1/§5.1/§6.1 + one Acceptance bullet each: "Enable at top (scrolls with content, not frozen)". Prototype: `.mtop` nested inside `.mbody` in all 3 modals (#modal l.239–241, #bmodal l.281–282, #rmodal l.315–316); `.mfoot` frozen sibling. CSS `.mbody{overflow:auto}` (l.88), `.mfoot{flex:none}` (l.148). |
| E8. Switches removed; Tag bilingual | PASS | No `.sw[data-field]`, `setFieldVis`, `tagOn/subOn/descOn`, or `{on}` on bilingual fields anywhere. Comment l.417 "show/hide switches removed". §6.4 model = title/tag/subtitle/description: Bilingual; Tag is `{zh,en}` (state l.377). |
| F9. Co-creation REQUIRES data source; only Events Data/Movie New exempt | PASS | `NO_SOURCE=['Events Data','Movie New']` (l.369, no Co-creation). §6.3 branch "Co-creation … data source IS required" (l.134). DT table Co-creation row "data source required" (l.151). Acceptance bullet (l.187). BO-TC-07 blocks Co-creation save w/o source. `DT['Co-creation'].note` (l.362) "但仍需選擇數據源". No place exempts Co-creation. |
| F10. DataType→UI style table (10 rows, defaults) matches DT | PASS | Table 10 rows; selectable = Ztor Library/Movie-Tv/Tastemaker/Ranking/Award; fixed = Movie Review/Events Data/Movie New/Box Office/Co-creation. Defaults Ztor=Video List, Movie/Tv=片單, Ranking=片單排行榜, Award=片單排行榜 — match `DT` (l.352–363). Blank line before table; renders. |
| G11. Delete for Banner + Content Block, NOT Ranking; BO-TC-09 | PASS | `data-bdel` (l.568/577) + `data-del` (l.395/404); ranking `#rankRow` (l.215–220) has no delete. Docs §4.2 + §6.2 list Delete 🗑; §5.2 "(No delete)". BO-TC-09 covers both + "Ranking exposes no delete". |
| G12. URL allows http OR https; rejects javascript:/data:/relative | PASS | Regex `^https?://` (l.737, l.760). Docs say "absolute `http`/`https`"; Acceptance + BO-TC-03 reject `javascript:`/`data:`/relative. No bare "http(s)" left in docs. |
| H13. Script parses; all controls map | PASS | Extracted `<script>` parses via `new Function` (PARSE OK). All 4 modals (#modal/#bmodal/#rmodal/#picker) open without throwing; no broken/leftover identifiers. |
| H14. No internal-only notes leaked | PASS | No LOCKED/已鎖定/已锁定, ticket mapping, or confirmation dates in `.md` docs. Prototype `#1/#2/#3` are cosmetic mock build labels only, not spec leaks. |
| H15. BO-TC-01..10 in both docs, observable Then | PASS | All 10 present EN (l.196–205) and ZH (l.196–205), each with observable Then. |

## Findings

### Blocking
None.

### Non-blocking nits
1. Prototype enable-toggle label is hardcoded Simplified Chinese `启用状态` (l.241, l.282, l.316) inside an otherwise Traditional (`zh-Hant`) mock; also `选项来自` (l.264). Cosmetic; no spec impact.
2. Prototype layout-sequence subhead "Ranking widget & Banner are separate — #1/#2 later" (l.226) is stale dev-build phrasing now that Banner/Ranking are present. Cosmetic.
3. Data-source placeholder is English ("Please input the link of the data source." l.266/452) while the cited error string is `請選擇數據鏈接`; both surfaces agree on the error string, so no contradiction — minor mixed-language polish.
4. §6.3 `Tastemaker` row says "yes (selectable)" without an explicit default, while `DT['Tastemaker'].def='User List'` (l.356). Not a contradiction (`dtDef` falls back to first style = same value), but the doc could state the default for parity with other selectable rows.

## Verdict
Zero blocking findings. EN↔ZH parity intact; bilingual-coupling and data-source rules (incl. Co-creation-requires-source) consistent across all three surfaces; editor chrome, delete, and URL rules match; the prototype script parses.

**Verdict: PASS**
