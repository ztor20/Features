# BO Home CMS — Feature Summary 功能摘要

> One-pager for review (skill user + stakeholder meeting). Full spec: `requirements-en.md` / `requirements-zh-hant.md`. Live prototype: https://bo-home-cms.vercel.app

---

## English

**What:** A per-region Back-Office CMS to compose the public homepage without engineering — Banner, Ranking widget, and ordered Content Blocks.

**Features**
- **Banner** — Add one or many banners in a single carousel slot. Pick a **Banner Type** (Brand Intro · AI Competition · Event · Film Intro) → it drives the fields, required inputs and item source: non-Brand-Intro types select an **Item** from the database (AI Competition / Events Data incl. Blind Box / Movie/TV List); Brand Intro has no item. Uploads (background / cut-out hero static-or-mp4 ≤15MB / title image), optional bilingual eyebrow/headline/desc, CTAs (max 2). Carousel behavior (auto every 5s, hover-pause, arrows + dots) follows the FE spec.
- **Continue Watching** — A fixed section directly under the Banner (logged-in only); the rail auto-fills from watch history. Ops edit only Title / Content / Tag (bilingual, no CTA). Cannot be added/removed/reordered.
- **Ranking widget** — A single fixed widget (cannot add/delete/reorder) but editable: bilingual title/subtitle, platform on/off + drag-reorder, **+ Add Platform from the BO Rankings module**. Renders between Banner and content.
- **Content Block** — Ordered list. Each block: **Data Type** (10, from BO data-management modules) → **UI style** (some fixed, some selectable) → **data source**. Bilingual Title + optional Tag/Subtitle/Description. Drag to reorder.

**Key rules**
- **Bilingual-coupled:** any optional text field — fill one language → both required; leave both empty → omitted on FE (no blank gap).
- **Select, don't create:** Banner items, Ranking platforms and Data Types come from existing sources (DB / BO modules); this CMS only selects them.
- **Required:** Banner = an Item only in item mode (Brand Intro & upload mode need none); Ranking = Title; Content Block = Title + data source (except Events Data / Movie New).
- **Enable per item:** toggle on = shown on FE, off = hidden but kept.
- **URL safety:** CTA / data-source URLs must be absolute http/https.

**Status:** Spec ↔ prototype consistent; fresh-context critic PASS. Region / platform / item authoring is external (other BO modules).

---

## 繁體中文

**是什麼:** 一個分地區的後台 CMS,不需工程即可編排公開首頁 —— Banner、排行榜 widget、可排序的內容區塊。

**功能**
- **Banner** —— 在單一輪播槽位新增一或多個 banner。先選 **Banner Type**(Brand Intro · AI Competition · Event · Film Intro)→ 由型別決定欄位、必填與 item 來源:非 Brand Intro 型從**資料庫**選一個 **Item**(AI Competition / Events Data 含盲盒 / Movie/TV List);Brand Intro 型無 item。上傳(背景圖 / 去背主圖 靜態或 mp4 ≤15MB / 片名圖)、雙語小標/大標/說明文字、CTA(最多 2)皆依型。輪播行為(自動 5 秒、hover 暫停、箭頭+圓點)依 FE spec。
- **繼續觀看** —— Banner 之下的固定段(僅登入),片列由觀看紀錄自動帶入。營運只編 標題 / 內容 / Tag(雙語、無 CTA);不可新增/刪除/排序。
- **排行榜 widget** —— 單一固定 widget(不可新增/刪除/排序)但可編輯:雙語標題/副標、平台開關與拖拽排序、**從 BO Rankings 模組新增平台**。顯示於 Banner 與內容之間。
- **內容區塊** —— 可排序清單。每塊:**Data Type**(10 種,來自 BO data-management 模組)→ **UI 樣式**(部分固定、部分可選)→ **數據源**。雙語標題 + 選填 Tag/副標題/內頁描述。可拖拽排序。

**關鍵規則**
- **雙語耦合:** 任一選填文字欄位 —— 填一種語言則中英都必填;兩語言皆空則 FE 不顯示(不留空位)。
- **只選不建:** Banner item、排行榜平台、Data Type 皆來自既有來源(資料庫 / BO 模組);本 CMS 只負責選取。
- **必填:** Banner 僅 item 模式需選 Item(Brand Intro 與上傳模式不需);排行榜必填標題;內容區塊必填標題 + 數據源(Events Data / Movie New 除外)。
- **逐項上下架:** 每項可開關 —— 開=前台顯示,關=隱藏但保留。
- **URL 安全:** CTA / 數據源連結須為絕對 http/https。

**狀態:** 規格與原型一致;critic 通過。地區 / 平台 / item 的建立屬其他 BO 模組(外部依賴)。
