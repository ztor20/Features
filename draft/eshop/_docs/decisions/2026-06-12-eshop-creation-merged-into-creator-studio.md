# 2026-06-12 — [Ztor 2.0] eShop creation merged into Creator Studio (auto-generated on profile create)

*Status: DRAFT — needs review*

## Decision
原設計為在 Backoffice 創建商鋪、再於 Creator Studio 管理商品，**決定改為合併至 Creator Studio**。Admin 角色於 Creator Studio 創建藝人 Profile 時，直接關聯 Store 帳號，即**自動生成 eShop**；後台 Backoffice 的「Create eShop」功能可省略。

介面：Admin 多看到一層「Creator 列表」，選擇藝人後進入與藝人自身管理後台相同的介面；藝人未來 SSO 登入後只看到自己的管理後台。目前所有藝人商鋪均由內部人員（非藝人本人）管理，Creator Studio 為**過渡期方案**，未來會開放藝人自主管理。

商品上架後，藝人可選擇同步在 Store 社交平台發佈介紹貼文（此功能需由 Eric 提供接口給 Binqo 團隊實作）。

(English) The original design — create the shop in Backoffice, then manage products in Creator Studio — is **changed to a single merged flow inside Creator Studio**. When an Admin creates an artist Profile in Creator Studio and links a Store account, the **eShop is auto-generated**; the Backoffice "Create eShop" function is dropped. Admin sees one extra "Creator list" layer, then the same admin UI the artist will eventually see; artists will later SSO into only their own back-office. All shops are currently run by internal staff (not the artists) — Creator Studio is a **transitional-phase tool**, with artist self-management opening up later. After listing, artists can opt to publish a promo post on the Store social platform (Eric provides the interface for the Binqo team to build).

## Why
(not captured — collapsing shop-creation into Creator Studio removes a redundant Backoffice step and makes the artist Profile the single source that spawns the eShop.)

## Source
- Daily Brief: https://app.notion.com/p/Daily-Brief-June-14-2026-37f9ca6e76ac8148ab51df3c809df22f
- Source meeting: https://app.notion.com/p/Meeting-Note-37d9ca6e76ac8016990cc8a9f0b0cf33
