# bo-home-cms — how to use this folder (read me first)

**What:** BO Home CMS — a per-region Back-Office tool to compose the public ztor homepage (Banner / Continue Watching / Ranking / Layout Sequence) without engineering.

**Authoritative build source for AI:** `requirements-en.md` + `feature_description.md`.
The `.md` wins over the prototype. **Build order:** `feature_description.md` (align the contract) → `requirements-en.md` (build from this) → `prototype/index.html` (illustration only).

| File | Reader | Authority | How to use |
|---|---|---|---|
| `feature_description.md` | AI (read first) | contract / spine | data model, total state machine, ownership map — align vocabulary before building |
| `requirements-en.md` | AI (primary) | **AUTHORITATIVE** | full spec: layout / interactions / branch tables / acceptance / test cases (BO-TC-*) — build from this |
| `requirements-zh-hant.md` | 中文 human | mirror | prose translation of `-en`; field/enum/numbers byte-identical — **do NOT build from this** |
| `prototype/index.html` | AI + human | illustrative ONLY | shows states/UI; **never** a source of behavior — the `.md` wins |
| `feature_summary.md` | human (review) | non-build | bilingual one-pager for stakeholders |
| `_review.md` | human / AI | sign-off | fresh-context critic PASS/FAIL record |

**Live prototype:** https://bo-home-cms.vercel.app
**FE homepage spec** (the public homepage this CMS configures; every `refer to FE spec §3.x` points here): https://github.com/ztor20/Frontend/blob/main/docs/pages/home/requirements-zh-hant.md
**Surface:** BO only (Back Office; standalone mock, no FE anchoring).
