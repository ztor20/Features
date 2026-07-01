# 2026-06-12 — [Ztor 2.0] eShop storefront reuses CMS Content Block; manual + conditional sorting; Published-only

*Status: DRAFT — needs review*

## Decision
Store 前端會以**清單方式**展示藝人商鋪及商品，**沿用現有 CMS 的 Content Block 架構**。支援**手動排序**及**條件排序**兩種方式（與現有電影內容管理一致）。CMS **只顯示已上線（Published）的商鋪**，未上線的商鋪自動篩除。

(English) The Store front-end displays artist shops and products as **lists**, **reusing the existing CMS Content Block architecture**. It supports both **manual sorting** and **conditional sorting** (consistent with the existing movie-content management). The CMS **only shows Published shops** — unpublished shops are auto-filtered out.

## Why
沿用現有 CMS Content Block 與電影內容管理的排序方式，避免另建一套展示/排序系統。Reusing the existing CMS Content Block + the movie-content sorting model avoids building a separate display/sorting system.

## Source
- Daily Brief: https://app.notion.com/p/Daily-Brief-June-14-2026-37f9ca6e76ac8148ab51df3c809df22f
- Source meeting: https://app.notion.com/p/Meeting-Note-37d9ca6e76ac8016990cc8a9f0b0cf33
