# 2026-06-12 — [Ztor 2.0] eShop technical division of labor; movie & eShop orders kept in separate DBs; uploads unified to AWS

*Status: DRAFT — needs review*

## Decision
**技術分工：**
- **Eric 團隊** — Store 前端開發、eShop 所有接口（**直接查詢資料庫，不調用 Binqo 微服務**）。
- **超微／Binqo 團隊** — Creator Studio、獨立微服務、商品及訂單資料庫。

電影訂單與 eShop 訂單**維持分開資料庫，暫不合併**（合併牽涉報表等大量改動）。資源上傳（圖片等）**應統一至同一位置（AWS）**。SMS／Email 微服務已完成收發邏輯，eShop 訂單通知內容由超微團隊管理；長遠需建立統一的 Email Template 管理模組。

(English) **Division of labor:** **Eric's team** owns Store front-end + all eShop interfaces (**querying the DB directly, not calling Binqo microservices**); the **超微/Binqo team** owns Creator Studio, the standalone microservice, and the product/order databases. Movie orders and eShop orders **stay in separate databases (not merged for now)** — merging would touch reports and require large-scale changes. Asset uploads (images, etc.) **should be unified to one location (AWS)**. The SMS/Email microservice's send/receive logic is done; eShop order-notification content is managed by the 超微 team; a unified Email Template management module is a longer-term need.

## Why
Eric 端直接查 DB 而非調用 Binqo 微服務以加速 eShop 接口；訂單資料庫維持分開避免合併報表的大量改動。Eric querying the DB directly (rather than via Binqo microservices) speeds up eShop interfaces; keeping the order DBs separate avoids the large report-rework that merging would force.

## Source
- Daily Brief: https://app.notion.com/p/Daily-Brief-June-14-2026-37f9ca6e76ac8148ab51df3c809df22f
- Source meeting: https://app.notion.com/p/Meeting-Note-37d9ca6e76ac8016990cc8a9f0b0cf33
