# BO 首頁 CMS — 後台需求(繁體中文)

| 項目 | 內容 |
|------|---------|
| Routes | `/admin/page-config/home-page`(分地區:`香港(中国)` / `台灣` / `全世界`) |
| Folder | `bo-home-cms` |
| Version | 1.1 |
| Updated | 2026-06-26 |
| Anchored-commit | —(獨立 mock;BO 不錨定)· 真實後台參考:adminmvp.ztor.com `/#/page-config/home-page` |
| FE spec | https://github.com/ztor20/Frontend/blob/main/docs/pages/home/requirements-zh-hant.md —— 本 CMS 所配置的公開首頁;所有「refer to FE spec §3.x」皆指向此 |

> 對齊真實 ztor 後台。**以 `.md` 為準,原型(`prototype/index.html`)僅作示意。** 欄位/列舉識別碼(英文)中英版逐字一致,只翻譯敘述。

---

## 1. 目的
讓內部營運能**分地區**配置 ztor 公開首頁,不需工程介入。首頁由上到下:**Banner**、**Continue Watching 繼續觀看**(固定、僅登入)、**Ranking 排行榜 widget**、**Layout Sequence(內容區塊序列)**。

## 1A. 相對現有 BO CMS 的變更(本次)
現有 Home Page Config 每地區只有 **Ranking Widget** + **Layout Sequence**;本次新增/變更以下項目。

| Change | Type |
|---|---|
| **Banner** 管理器 —— 全新頂部區段:4 種 Banner Type(Brand Intro / AI Competition / Event / Film Intro)、依型 item/上傳(AI Competition 僅 item;Brand Intro 僅上傳)、上傳尺寸限制、CTA ≤2(達上限自動隱藏;AI Competition 無)、輪播 5 秒/hover/箭頭、上下架排程 | 🆕 NEW |
| **Continue Watching** —— Banner 之下全新固定區段(僅登入;片列自動帶入;標題/內容/Tag,無 CTA) | 🆕 NEW |
| **Ranking widget** —— 新增雙語 **Tag** 欄位 | 🆕 NEW |
| **Content Block** —— 新增雙語 **Tag** 欄位(現有編輯器沒有) | 🆕 NEW |
| **Content Block Data Types** —— 新增 **Co-creation**、**AI Competition**、**Custom**(現有 9 種)。Custom = 從 sample 樣式彈窗選背景 + 上傳一張圖片 + 1 個 CTA | 🆕 NEW |
| 現有 9 種 Data Type 與其 UI 樣式;地區分頁;Layout Sequence 拖拽/啟用/刪除 | ✅ unchanged |

## 2. 使用情境
- **身為營運編輯**,我選地區,新增與排列 banner、編輯繼續觀看段(標題/內容/Tag)、開關/編輯排行榜 widget、新增與排列內容區塊(各綁定 Data Type + 數據源 + UI 樣式),預覽後存檔 —— 讓首頁不需工程就能改。流程:選地區 → 編輯 Banner / Continue Watching / Ranking / Layout Sequence → 預覽 → 存檔。
- 關鍵分支:Banner 先選 **Banner Type(4 型)** 再依型帶出欄位與 item 來源(Brand Intro 無 item);>1 banner → 輪播 + 選用 rotate(秒數/行為依 FE §3.6);文字/Tag/Subtitle/Description 選填且雙語耦合(填一種→另一種必填,皆空則 FE 不顯示、不占位);部分 Data Type 樣式固定且/或無需數據源;排行榜 widget 可開關與編輯,但**不能**新增/刪除/排序。

## 3. Query Params
`region` = `hk | tw | global`(哪個地區的配置;預設 `tw`)。`preview` = `desktop | mobile`(預覽視口)。

---

## 4. Banner  `/admin/page-config/home-page`(頂部區域)

> Banner 的**版型、各型欄位、上傳尺寸/格式、輪播行為、遮罩、AI 倒數顯示**一律以 **FE 首頁規格 `home` §3 為準,本節不重抄**;以下只定義**後台編輯行為**(由 Banner Type 條件式帶出欄位、只選不建、驗證)。

### 4.1 版面
| Block | 說明 |
|-------|-------------|
| 區段標題 | 「Banner」+ **+ Add Banner**。 |
| Rotate 開關 | **僅在 banner > 1 時顯示**。輪播秒數與行為(自動 **5 秒**、hover 暫停、左右箭頭 + 圓點)**依 FE spec §3.6**。 |
| Banner 清單 | 一列一個 banner:`# · Title · Type · Item · N CTA · 啟用 · ⚙ · ✥(拖拽) · 🗑`(品牌介紹型 Item 顯示「—」)。 |
| Banner 編輯彈窗 | 啟用(頂部 —— 隨內容滾動、**不固定**);**Banner Type** 選擇器(4 型,§4.2)→ 依型帶出該型欄位(欄位內容 refer FE spec §3.2);取消/確定 固定底部。 |

### 4.2 Banner Type(取代舊的 Banner Resource)
選 **Banner Type** 為第一步,它同時決定 ① item 來源 ② 欄位集 ③ 必填欄位(② ③ 的欄位內容**依 FE spec §3.2**):

| Banner Type | item 來源(只選不建、圖+名卡片、直接來自資料庫) | 備註 |
|---|---|---|
| **Brand Intro**(品牌介紹) | **無 item** | **可上傳圖片或影片**、純自訂文字(不出現 item 選擇器) |
| **AI Competition**(AI 比賽) | **Events Data**(賽事) | **僅 item —— 無上傳、無來源切換**;編輯器只顯示 Banner Type + Item 選擇器 + 啟用。**無文字欄位(小標/大標/說明文字)、無 CTA** —— 所有內容(文字、按鈕)與 7 段倒數皆來自所連賽事 item(FE §3.5)。Banner 清單列 / FE 預覽在無手動標題時,以所連 **item/賽事名稱** 作為標題。 |
| **Event**(活動) | **Events Data**(含盲盒) | item ⇄ 上傳 二選一;右側主圖選填、可 mp4 |
| **Film Intro**(影片介紹) | **Movie/TV List**(片庫影片) | 類型標籤自片庫帶入(≤3)、有顯示/隱藏開關;片名可圖可文 |

> 各型欄位、上傳尺寸/格式(背景圖 / 右側去背主圖 靜態或 mp4 ≤15MB / 片名圖)、遮罩、輪播、倒數 —— **一律 refer to FE spec §3.1–3.6**,本文件不重抄。
> **來源規則(依型):** **Event / Film Intro** 可二選一(互斥)—— **選 Item** 或 **上傳圖片/影片**;**AI Competition** **僅 item**(Events Data;無上傳、無切換);**Brand Intro** 只上傳圖片/影片(無 item)。⚠️ 互斥(Event / Film Intro)為 CMS 設計,**與 FE §3.1「item + 上傳並存」略有不同**。AI Competition 的所有內容與 7 段倒數皆取自所連 item(FE §3.5)。

### 4.3 互動
| 操作 | 結果 |
|--------|--------|
| + Add Banner | 開啟 banner 編輯器(先選 Banner Type)。 |
| ⚙(列) | 開啟該 banner 的編輯器。 |
| _編輯器內:_ 選 **Banner Type** | 設定版型;**重設**該型欄位集;清除先前選的 Item(Brand Intro 則隱藏 Item 欄位)。 |
| _編輯器內:_ 點 **Item**(非 Brand Intro 型) | 開啟限定該型來源的 **SELECT ITEM** 選擇器 —— 以 **圖片 + 名稱** 卡片列出、**直接來自資料庫**(只選不建);選擇即填入。 |
| _編輯器內:_ 上傳 背景圖 / 去背主圖(靜態或 mp4)/ 片名圖 | 依型出現對應上傳欄位;規格 refer FE spec §3.3。 |
| _編輯器內:_ 編輯 小標/大標/說明文字 · 切換類型標籤 顯示/隱藏(僅 Film Intro 型) | 編輯 banner 草稿。**AI Competition 不適用**(無文字欄位 —— 所有文字來自所連 item)。 |
| _編輯器內:_ + Add CTA · 移除 CTA | **最多 2 顆**(達 2 顆時「+ Add CTA」按鈕隱藏)。**AI Competition 不適用**(無 CTA)。 |
| _編輯器內:_ 設定上下架時間 | 選填的上架/下架排程時間。 |
| 拖拽 ✥(列) | 排序 banner(= 輪播順序)。 |
| 切換 Rotate | 開關自動輪播(>1 才有意義;秒數/行為依 FE §3.6)。 |
| 切換啟用(列) | 開 = 顯示於前台首頁(FE);關 = 從前台隱藏(後台保留,可隨時再開啟)。 |
| **刪除 🗑(列)** | 從區段移除該 banner。 |
| 存檔(編輯器) | 驗證(見 §4.5)→ 存檔;否則行內錯誤。 |

### 4.4 分支 / 狀態(FE)
| 情況 | 行為 |
|------|----------|
| 1 個 banner | 單一 banner;無輪播控制、無 rotate 選項。 |
| > 1 banner | 單槽輪播、共用**一個區段**(不堆疊);控制鈕(左右箭頭 + 圓點)、自動 **5 秒**、hover 暫停 **依 FE §3.6**;rotate 關則不自動、僅手動。 |
| Brand Intro 型 | 無 item;可上傳圖片或影片;渲染 refer FE §3.2。 |
| AI Competition 型 | **僅 item**(Events Data 賽事;無上傳、無切換);文字、按鈕與倒數小標/按鈕/連結皆依該 item 賽事時程切換(FE §3.5);無手動文字欄位、無 CTA。 |
| Film Intro 型 類型標籤開關 = 隱藏 | FE 不顯示標籤區(即使該片庫影片有標籤)。 |
| 文字欄位只填一種語言、另一種留空 | 存檔被擋;空白語言欄標紅(要嘛都填、要嘛都清空)。 |
| 文字欄位兩語言皆空 | 於 FE **不顯示且不保留占位** —— banner 文字往上頂。 |

**停用條件:** `enabled=false`,或不在上架排程區間的 banner,不在 FE 渲染。

### 4.5 驗證與資料
**存檔驗證:**
- **Item / 上傳**:**Event / Film Intro** 二選一(互斥)—— **item 模式**則 Item 必填;**upload 模式**則改上傳圖片/影片(不選 item)。**AI Competition 僅 item**(Item 必填;無上傳、無切換)。**Brand Intro** 無 item(只上傳)。切換 Type 會清除先前選的 Item。
- **文字**(小標 `eyebrow` / 大標 `headline` / 說明文字 `desc`):選填但**雙語耦合**;**各型必填欄位依 FE spec §3.2**(例:Film Intro 的大標=片名必填)。**AI Competition 無文字欄位**(所有文字來自所連 item)。
- **按鈕(CTA)**:**最多 2 顆**(達 2 顆時「+ Add CTA」按鈕隱藏);每顆需**中英名稱**(`name.zh` + `name.en`)+ 絕對 `http`/`https` url(中英共用一個 url)。**CTA 僅 Banner —— Brand Intro / Event / Film Intro(多個,最多 2)—— 與 Content Block Custom(單一,最多 1)有**;**AI Competition 無 CTA**;**Continue Watching 無 CTA**。
- **上傳**:格式/大小依 FE spec §3.3(右側主圖 mp4 ≤15MB)。

**資料:**
- `Banner { id, enabled, type: BannerType, srcMode: 'item'|'upload', item: BannerItem | null, eyebrow: Bilingual, headline: Bilingual, desc: Bilingual, bgImage?: Asset, mainAsset?: Asset, titleImage?: Asset, tagAreaVisible?: boolean, ctas: Cta[], schedule: Schedule }` —— **AI Competition 無文字(`eyebrow`/`headline`/`desc`)、`ctas` 為空陣列**(文字與按鈕來自所連 item)。
- `srcMode`:`item` 或 `upload` —— **Event / Film Intro 可切換(互斥)**;**AI Competition 恆 `item`(無上傳、無切換)**;**Brand Intro 恆 `upload`(無 item)**。Brand Intro / Event / Film Intro 的 `ctas` 最多 2;**AI Competition 無 CTA**。
- `BannerSection { banners: Banner[], rotate: boolean }`
- `BannerType` = `Brand Intro | AI Competition | Event | Film Intro`(對應 FE §3.2 四型)。
- `BannerItem`:依 Type 對應的 DB 分類(AI Competition→**Events Data**;Event→Events Data 含盲盒;Film Intro→Movie/TV List)的一筆 event/item,**直接來自產品資料庫**、只選不建;選擇器以 **圖片 + 名稱** 卡片列出,無相符記錄則為空。**Brand Intro 恆 `null`(改上傳);AI Competition 恆必填(僅 item、無上傳);Event / Film Intro 於 `srcMode='upload'` 時為 `null`、`srcMode='item'` 時必填。**
- `tagAreaVisible`:**僅 Film Intro 型**;類型標籤自片庫帶入(≤3),此開關控制整個標籤區顯示/隱藏(FE §3.4)。
- `Schedule { from?: DateTime, to?: DateTime }`:選填的上/下架排程時間。
- `bgImage / mainAsset / titleImage`:背景圖 / 右側去背主圖(靜態或 mp4 ≤15MB)/ 片名圖;尺寸格式 refer FE §3.3。
- `Bilingual { zh: string, en: string }` —— banner 文字(`eyebrow`/`headline`/`desc`)選填但**雙語耦合**(空→FE 不顯示、不留占位);**各型必填欄位依 FE §3.2**。 · `Cta { name: Bilingual, url: Url }`(**最多 2 顆**;name 中英各一、共用一個 url;若新增則中英 name + `http`/`https` url 皆必填)
- 欄位語意/上傳規格/倒數/遮罩/輪播:**refer to FE spec §3.1–3.6**。

---

## 4A. Continue Watching 繼續觀看(固定 section · 位於 Banner 之下)

對齊 FE 首頁 §2「繼續觀看」段:**僅登入**可見、片列由**觀看紀錄系統自動帶入**。此為**固定 section**,位置固定在 **Banner 之下、Ranking 之上**,**不可新增/刪除/排序**。營運只編輯 **標題 / 內容 / Tag**(無 CTA)。

### 4A.1 版面
| Block | 說明 |
|-------|------|
| 列 | `▶ Title · Continue Watching · 啟用 · ⚙`。不可新增/刪除/排序。 |
| 編輯彈窗 | 啟用(頂部、隨內容滾動、不固定);雙語 **標題(必填)/ 內容(選填)/ Tag(選填)**(無 CTA);取消/確定 固定底部。 |

### 4A.2 互動
| 操作 | 結果 |
|------|------|
| 切換啟用(列) | 開 = FE 顯示(僅登入);關 = 隱藏(後台保留)。 |
| ⚙ | 開啟編輯器。 |
| 存檔 | 驗證 標題(雙語必填)+ 內容/Tag 雙語耦合 → 存檔;否則行內錯誤。 |

### 4A.3 分支 / 狀態(FE)
| 情況 | 行為 |
|------|------|
| 未登入 | **不顯示**此段(僅登入)。 |
| 啟用 + 已登入 | 顯示於 Banner 之下、Ranking 之上;片列自動續看。 |
| 內容 / Tag 只填一種語言 | 存檔被擋;空白語言欄標紅。 |
| 內容 / Tag 兩語言皆空 | FE 不顯示該欄、不留占位。 |
| 停用 | 不渲染。 |

**停用條件:** `enabled=false` 或未登入 → 不渲染。固定 widget,不可當區段新增/刪除/排序。

### 4A.4 資料
- `ContinueWatching { enabled, title: Bilingual, content: Bilingual, tag: Bilingual }` —— `title` 必填(雙語);`content` / `tag` 選填但**雙語耦合**(空→FE 不顯示、不留占位);**無 CTA**。**片列內容由觀看紀錄系統提供(非營運輸入)。**

---

## 5. Ranking 排行榜 widget(Banner 與 Layout Sequence 之間)

### 5.1 版面
| Block | 說明 |
|-------|-------------|
| 列 | `★ Title · Ranking widget · N/總數 platforms on · 啟用 · ⚙`。**不可新增 / 刪除 / 排序。** |
| Ranking 編輯彈窗 | 啟用(頂部 —— 隨內容滾動、**不固定**);雙語 **Title(必填)+ Tag(選填、雙語耦合)+ Subtitle(選填、雙語耦合)**;**Platform 清單**(每個:開關、⠿ 拖拽排序、排行來源子行、未設定顯示「未配置」)+ **+ Add Platform**;取消/確定 固定底部。 |

### 5.2 互動
| 操作 | 結果 |
|--------|--------|
| 切換(列) | 啟用 / 停用 widget。 |
| ⚙(列) | 開啟 ranking 編輯器。 |
| _編輯器內:_ 編輯 Title/Subtitle · 平台開關 · 拖拽 ⠿ | 更新 widget 與其平台清單。 |
| _編輯器內:_ **+ Add Platform** | 開啟選擇器,從 **BO Rankings 模組選一個平台**(圖片+名稱卡片;非自由輸入);選定即加入清單。 |
| 存檔(編輯器) | 驗證 Title(兩語言)+ Tag / Subtitle 雙語耦合(填一種語言→中英都需填)→ 存檔。 |
| _(無刪除)_ | 排行榜為**單一固定 widget** —— 不能當作區段被新增 / 刪除 / 排序。 |

### 5.3 分支 / 狀態
| 情況 | 行為 |
|------|----------|
| 啟用 | FE 渲染 Title(+ 副標題,若有填)+ 已啟用平台 **tabs** + 編號排行,位於 Banner 與內容區塊之間。 |
| 副標題兩語言皆空 | 於 FE 不顯示且不保留占位;只填一種語言 → 存檔被擋。 |
| 停用 | 不渲染。 |
| 平台未設定 | 顯示紅色「未配置」。 |

**停用條件:** 此為**單一固定 widget** —— 不能當作區段被新增 / 刪除 / 排序(僅內容可編輯)。

### 5.4 資料
- `Ranking { enabled, title: Bilingual, tag: Bilingual, subtitle: Bilingual, platforms: Platform[] }` —— `title` 必填(兩語言);`tag` / `subtitle` 選填但**雙語耦合**(`zh` 與 `en` 要嘛都填、要嘛都空;空則 FE 不顯示且不保留占位)。
- `Platform { key, name, sub: string, on: boolean, configured: boolean }` —— `sub` 為排行來源;`configured=false` → 「未配置」。平台目錄由 **BO Rankings 模組提供** —— 營運透過 **+ Add Platform** 從中選取,不自由輸入。

---

## 6. Content Block 內容區塊(Layout Sequence)

### 6.1 版面
| Block | 說明 |
|-------|-------------|
| 區段標題 | 「Layout Sequence」+ **+ Add Content Block**。 |
| 區塊清單 | 一列一個:`# · Title · DataType · UIStyle · Tag · 啟用 · ⚙ · ✥(拖拽) · 🗑`。 |
| 區塊編輯彈窗 | 啟用(頂部 —— 隨內容滾動、**不固定**);雙語 **Title(必填)/ Tag / Subtitle / Description(富文本)** —— Tag/Subtitle/Description 皆**選填**(無顯示/隱藏開關);**Data Type**(12);**數據源**選擇器;**FE UI 樣式**;取消/確定 固定底部。 |

### 6.2 互動
| 操作 | 結果 |
|--------|--------|
| + Add Content Block | 開啟區塊編輯器以新增一個區塊。 |
| ⚙(列) | 開啟該區塊的編輯器。 |
| _編輯器內:_ 填寫 Tag / Subtitle / Description | 皆**選填**,但**雙語耦合** —— 填了一種語言,另一種語言即變必填(要嘛都填、要嘛都空)。 |
| _編輯器內:_ 選 **Data Type** | 顯示該類型的 UI 樣式(可選或固定)+ 顯示/隱藏數據源欄位。 |
| _編輯器內:_ 選 UI 樣式 | 設定 FE 渲染樣式(僅該類型可選時)。 |
| _編輯器內:_ 點數據源欄位 | 開啟 **SELECT ITEM** 選擇器(搜尋 + 項目);選擇即填入。 |
| 拖拽 ✥(列) | 排序區塊。 |
| **刪除 🗑(列)** | 移除該內容區塊。 |
| 存檔(編輯器) | 驗證 Title(兩語言)+ Tag/Subtitle/Description 的雙語耦合 + 數據源(需要者)→ 存檔。 |

### 6.3 分支 / 狀態
| 情況 | 行為 |
|------|----------|
| Tag/Subtitle/Description 只填一種語言、另一種留空 | 存檔被擋;空白語言欄標紅(要嘛都填、要嘛都清空)。 |
| Tag/Subtitle/Description 兩語言皆空 | 允許 —— 該欄位於 **FE 不顯示且不保留占位**;後續內容往上頂(例:副標題空 → 內頁描述顶到副標題的位置)。 |
| Data Type 樣式固定 | UI 樣式不可選 —— 使用主檔預設。 |
| Data Type ∈ {Events Data, Movie New} | **無數據源欄位**;使用主檔預設。 |
| Data Type = Co-creation | UI 樣式固定(`影視共創計畫`),**但數據源仍必選**(與 Events Data 不同)。 |
| Data Type = AI Competition | UI 樣式固定;**需選數據源**(來源:AI Competition)。 |
| Data Type = Custom | **無數據源**;改為**從 sample 樣式彈窗(3 個樣本)選背景** + **上傳一張圖片** + 雙語標題/副標/內容 + **CTA(最多 1)**(FE 依上傳圖片渲染)。 |
| 數據源空(需要的類型) | 存檔被擋(「請選擇數據鏈接」)。 |
| URL 不合法(CTA / 數據源) | 拒絕 —— 僅絕對 `http`/`https`。 |

**Data Type → FE UI 樣式**(選一個 Data Type;部分樣式可選、部分固定):

| Data Type | UI 樣式 | 可選 |
|---|---|---|
| Ztor Library | Video List · Rank List · 片單 · 片單排行榜 | 可選(預設 Video List) |
| Movie/Tv List | Video List · Rank List · 片單 · 片單排行榜 | 可選(預設 片單) |
| Movie Review | Feature Review · Thematic Post | **不可改(固定)** |
| Tastemaker | User List · User Review | 可選(預設 User List) |
| Ranking | Video List · Rank List · 片單 · 片單排行榜 | 可選(預設 片單排行榜) |
| Events Data | 活動 | **不可改(固定)** |
| Movie New | 影展消息 | **不可改(固定)** |
| Award | Video List · Rank List · 片單 · 片單排行榜 | 可選(預設 片單排行榜) |
| Box Office | 票房排行 | 單一(固定) |
| Co-creation | 影視共創計畫 | **不可改(固定)** —— UI 樣式同 Events Data,但**數據源必選** |
| AI Competition | AI 原力創作計畫 | **不可改(固定)** —— 需選數據源(來源:AI Competition) |
| Custom | Custom | **不可改(固定)** —— **無數據源**;改為從 sample 樣式彈窗選背景 + 上傳一張圖片,並填雙語標題/副標/內容/CTA(最多 1) |

> **Data Type 選項對應既有的 BO data-management 模組 —— 非寫死。** 12 種 Data Type 中,11 種對應 BO `data-management` 模組(9 個:Ztor Library · Movie/TV Lists · Movie Reviews · Tastemakers · Rankings · Events Data · Movie News · Awards · Box Office Data —— 外加 Co-creation 與 AI Competition);**Custom** 為 CMS 專屬(無數據源)。清單(及每種類型對應的內容)由那些模組提供;Home CMS 只能*選取* Data Type —— 須**動態讀取清單、不可寫死**。上表僅為示意。

### 6.4 資料
- `ContentBlock { id, enabled, dataType: DataType, uiStyle: string, source: string, title: Bilingual, tag: Bilingual, subtitle: Bilingual, description: Bilingual, ctas?: Cta[], bg?: string, image?: Asset }`(`ctas` / `bg` / `image` **僅 Custom 型**;`bg` = 從 sample 樣式彈窗選的背景樣本 key,`image` = 上傳的圖片)
- `DataType`:`Ztor Library | Movie/Tv List | Movie Review | Tastemaker | Ranking | Events Data | Movie New | Award | Box Office | Co-creation | AI Competition | Custom`
- `Bilingual { zh: string, en: string }`。**Title** 必填(兩語言)。**Tag / Subtitle / Description** 選填但**雙語耦合** —— 每個欄位的 `zh` 與 `en` 要嘛都填、要嘛都空。空欄位於 **FE 不顯示且不保留占位**。

> **對應 FE 區塊:** FE #8 **漸層橫幅**以 **Custom** Data Type 製作(從 sample 樣式彈窗選背景 + 上傳一張圖片 + 雙語文字 + CTA),不另設專屬類型。FE #4 共創 / #6 AI 在本 CMS 維持為 Data Type(`Co-creation` / `AI Competition`)—— FE spec 標其為 Hardcode 是因撰寫當時尚無 CMS。FE #5 放映廳 Tab 式區塊**本版不做**(skip)。

---

## Performance & SEO
**Performance(後台編輯器):** 拖曳回饋 < 100ms(樂觀)· 預覽渲染 < 1s · 編輯器 LCP < 2.5s · CLS < 0.1 · INP < 200ms · 清單超過約 50 列虛擬化 · 預覽重渲染不得阻塞輸入。
**SEO / GEO:** `N/A — authenticated`(後台在登入後;不可索引)。

## 驗收標準(Acceptance)
**Banner**
- [ ] 編輯器:**啟用在頂部(隨內容滾動、不固定)**;僅 Save/Cancel 固定底部。
- [ ] 無論數量,FE 只顯示**一個 banner 槽位**(輪播),一次一個;banner 不堆疊成多段。
- [ ] **Rotate** 開關僅在 banner **> 1** 時出現;輪播秒數/行為(自動 **5 秒**、hover 暫停、左右箭頭 + 圓點)**依 FE spec §3.6**;關 → 不自動,手動切換。
- [ ] **Banner Type(4 型:`Brand Intro | AI Competition | Event | Film Intro`)** 為主選項,決定 item 來源、欄位集與必填(欄位內容依 FE §3.2);切換 Type 重設欄位並清除先前的 Item。
- [ ] **Item 來源依 Type**:**AI Competition→Events Data**(賽事)、Event→Events Data(含盲盒)、Film Intro→Movie/TV List,皆從**資料庫記錄**選(圖+名卡片、只選不建);**Brand Intro 無 item(改上傳圖片/影片)**;無記錄則清單為空。
- [ ] **來源規則**:**Event / Film Intro** 可切 選 Item / 上傳(互斥,切換清除先前 item);**AI Competition** 僅 item(無上傳、無切換);**Brand Intro** 只上傳。
- [ ] banner 文字(小標/大標/說明文字)**選填但雙語耦合**(填一種→中英都需填;皆空→FE 不顯示且不保留占位);**各型必填依 FE §3.2**(例:Film Intro 大標=片名必填)。
- [ ] **上傳欄位**(背景圖 / 右側去背主圖 靜態或 mp4 ≤15MB / 片名圖)依型出現;尺寸格式 **依 FE §3.3**。
- [ ] **AI Competition 型**:**僅 item**(Events Data 賽事;無上傳、無來源切換);編輯器只顯示 Banner Type + Item 選擇器 + 啟用;**無文字欄位、無 CTA、無手動日期欄位**;所有文字、按鈕與 7 段倒數皆來自所連 item(FE §3.5);列/預覽以所連 item/賽事名稱作為標題。
- [ ] **Film Intro 型**:類型標籤自片庫帶入(≤3),整個標籤區可**顯示/隱藏**(FE §3.4)。
- [ ] **CTA 最多 2 顆**(Brand Intro / Event / Film Intro;達 2 顆時「+ Add CTA」按鈕隱藏;**AI Competition 無**;**多個僅 Banner 支援**);若新增則需**中英名稱 + 絕對 `http`/`https` url**;不合法擋下。
- [ ] banner 可拖拽排序(= 輪播順序);可設選填**上/下架排程時間**;每列有 **刪除 🗑**(移出區段與輪播)。

**Continue Watching 繼續觀看**
- [ ] 固定 section、位於 **Banner 之下、Ranking 之上**;不可新增 / 刪除 / 排序。
- [ ] 編輯器:啟用在頂部(隨內容滾動);雙語 **標題(必填)/ 內容(選填)/ Tag(選填)**(**無 CTA**);內容/Tag 雙語耦合。
- [ ] 啟用 + **僅登入** → FE 顯示;未登入或停用 → 不顯示;片列由觀看紀錄系統自動帶入(營運不編片列內容)。

**Ranking widget**
- [ ] 編輯器:**啟用在頂部(隨內容滾動、不固定)**;僅 Save/Cancel 固定底部。
- [ ] 單一固定 widget —— 不能當作區段被新增 / 刪除 / 排序。
- [ ] ⚙ 可編輯:雙語標題(必填)+ **Tag(選填、雙語耦合)** + 副標題(選填、雙語耦合 —— 填一種語言→中英都需填;空則 FE 不顯示)、啟用、平台 開關 / 拖拽排序 / 新增;未設定顯示「未配置」。
- [ ] 啟用 → 渲染於 Banner 與內容區塊之間;停用 → 隱藏。

**Content Block**
- [ ] 啟用在頂部(**隨內容滾動、不固定**);僅 Save/Cancel 固定底部;雙語;`Title` 必填。
- [ ] Tag/Subtitle/Description 皆**選填**(無顯示/隱藏開關)且**雙語耦合** —— 填一種語言→另一種必填;兩語言皆空→**FE 不顯示且不保留占位**(內容往上頂)。
- [ ] 每個 Data Type 依 §6.3 暴露其 UI 樣式 —— 可選類型挑一個;固定類型不可改。
- [ ] **除 Events Data / Movie New 外**,每個 Data Type 皆需選數據源。
- [ ] `Co-creation` UI 樣式固定(`影視共創計畫`)如 Events Data,**但其數據源必選**。
- [ ] Layout Sequence 列顯示 `Title · DataType · UIStyle`;可用把手拖拽排序。
- [ ] 每列內容區塊皆有 **刪除 🗑**;刪除後該區塊移出 Layout Sequence。

**驗證 / 安全**
- [ ] 所有營運輸入的 URL(banner CTA、內容區塊數據源)須為絕對 `http`/`https`;`javascript:` / `data:` / 相對路徑一律拒絕、不存檔。

## 測試用例(Test cases)
Given / When / Then,Then 需**可觀察**。
- **BO-TC-01** — Given 3 個已啟用 banner · When FE 首頁渲染 · Then 在單一 banner 區段內一次只顯示**一個** banner,並有 **3** 個圓點。*(catches: banner 堆疊成多段)*
- **BO-TC-02** — Given >1 banner 且 `rotate=開` · When 經過 **5 秒**(依 FE §3.6) · Then 自動切到下一個;And 滑鼠 hover 於 banner · Then 自動輪播暫停;And `rotate=關` · When 經過 5 秒 · Then 不自動,但點左右箭頭/圓點仍可切。*(catches: 輪播秒數錯誤 / 無視開關 / 缺 hover 暫停與箭頭)*
- **BO-TC-03** — Given banner 某 CTA 的 `url="javascript:alert(1)"` 或 `name` 為空 · When 存檔 · Then 被擋並顯示行內錯誤、不持久化;填入 `name` + `http`/`https` url 可存。*(catches: CTA 釣魚/XSS;CTA 不完整)*
- **BO-TC-04** — Given Ranking 列 · When 嘗試把它當區段刪除或排序 · Then 不可;When ⚙ → 關掉某平台、拖拽排序、改標題、存檔 · Then 列上平台數/順序/標題更新,FE tabs 反映已啟用平台。*(catches: ranking 被當普通區塊 / 不可編輯)*
- **BO-TC-05** — Given 內容區塊 Subtitle 只填繁中、英語留空 · When 存檔 · Then 被擋且空白語言欄標紅;Given Subtitle 兩語言皆空 · When 存檔 · Then 允許,且 FE 不顯示 Subtitle、**不保留占位**(內頁描述顶到副標題的位置)。*(catches: 半翻譯欄位;空欄在 FE 留下空隙)*
- **BO-TC-06** — Given Data Type = `Co-creation` · When 未選數據源就存檔 · Then 被擋(「請選擇數據鏈接」);Given Data Type = `Events Data` 或 `Movie New` · Then 不顯示數據源欄位且可存。*(catches: 數據源規則錯誤;Co-creation 被錯誤豁免)*
- **BO-TC-07** — Given Layout Sequence `[A, B, C]` · When 用把手把 C 拖到 A 之上 · Then 順序變成 `[C, A, B]` 且序號更新。*(catches: 排序失效)*
- **BO-TC-08** — Given 一列 banner 與一列內容區塊 · When 各自點 **刪除 🗑** · Then 該 banner 移出輪播、該區塊移出 Layout Sequence(列數遞減);Ranking widget **無**刪除。*(catches: 缺少刪除 / 刪除範圍過大)*
- **BO-TC-09** — Given Banner Type = `Film Intro` · When 點 Item 欄位 · Then **SELECT ITEM** 選擇器以**圖片 + 名稱卡片、直接從資料庫**列出 Movie/TV List 的影片、選一個即填入 Item;Given 該來源無記錄 · Then 清單為空(CMS 無法在此新增 item);When 未選 Item 就存檔 · Then 被擋並顯示行內錯誤;When Type 由 `Film Intro` 切到 `Event` · Then 先前選的 item 被清除、選擇器改列 Events Data(含盲盒)的 item;Given Type = `AI Competition` · Then item 來自 **Events Data** 來源(賽事,含 AI 競賽 item)。*(catches: item 來源依 Type 對應錯誤;item 清單殘留;缺少 item 鏈接)*
- **BO-TC-10** — Given Banner Type = `Brand Intro` · When 開啟編輯器 · Then **不顯示 Item 欄位**,且未選 item 仍可存檔(例外);Given Type = `Film Intro` 且大標(片名)留空 · When 存檔 · Then 被擋(該型大標必填,FE §3.2);Given 已加 2 顆 CTA · When 嘗試新增第 3 顆 · Then 被擋(**最多 2 顆**)。*(catches: Brand Intro 被誤套 item 必填;各型必填漏驗;CTA 超過上限)*
- **BO-TC-11** — Given Banner Type ∈ {`Event`,`Film Intro`} · When 切到「上傳圖片/影片」· Then item 選擇器隱藏、出現上傳區、存檔不要求 item;切回「選 Item」· Then 上傳區隱藏、Item 變必填(互斥清除);Given `AI Competition` · Then **不顯示來源切換、不顯示 CTA、不顯示文字欄位** —— 只顯示 Item 選擇器(Item 必填;上傳⇄item 切換不適用);Given `Brand Intro` · Then 只顯示上傳區、無 item、無來源切換。*(catches: Event/Film Intro 的 item 與上傳未互斥;AI 比賽被錯誤加上上傳切換 / CTA / 文字欄位;Brand Intro 未開放上傳)*
- **BO-TC-12** — Given Continue Watching 已啟用 · When 未登入訪客看 FE · Then **不顯示**此段;When 已登入 · Then 顯示於 **Banner 之下、Ranking 之上**、片列自動續看;Given 內容只填繁中、英語留空 · When 存檔 · Then 被擋;When 嘗試把它當區段刪除/排序 · Then 不可(固定 widget)。*(catches: 繼續觀看對未登入顯示;半翻譯欄位;被當普通區段)*

## Not Included
- 分地區**資料串接**(配置依地區,但跨地區資料整合另計)。
- 公開 **FE 渲染器**(消費本配置;既有)。
- **Banner** 目前在 FE 為寫死,將由本配置取代。
- **Banner item 資料**直接來自**產品資料庫**(依 Banner Type:AI Competition、Events Data 含盲盒、Movie/TV List);本介面只*選取*既有記錄、不建立(外部依賴)。Brand Intro 型無 item。
- **Data Type 清單**(Data Type 的種類,以及每種類型對應的內容)—— 由 BO **data-management** 模組提供;本介面動態讀取、只*選取* Data Type,絕不寫死(外部依賴)。
- Ranking 的**平台主檔資料** —— 平台目錄與排行來源來自 **BO Rankings 模組**(本介面只從中選取)。
- 平台層級的**存取權限與變更記錄**(沿用既有 BO 後台)。
