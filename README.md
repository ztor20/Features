# ztor-features

BRD outputs from the **ztor-brd** skill. One folder per feature.

- `draft/<slug>/` — newly generated, not yet verified
- `shipped/<slug>/` — verified + merged into `ztor-frontend@main` (next release)
- `_shared-contract.md` — shared platform nouns features reference

Each feature folder: `feature_description.md` (spine: data contract, state machine, ownership) + `FE/ CS/ BO/` (bilingual house-format docs + prototypes) + `_review.md`.
