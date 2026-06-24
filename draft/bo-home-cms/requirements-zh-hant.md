# BO 首頁 CMS — 後台需求(繁體中文)

| 項目 | 內容 |
|------|---------|
| Routes | `/admin/page-config/home-page`(分地區:`香港(中国)` / `台灣` / `全世界`) |
| Folder | `bo-home-cms` |
| Version | 1.0 |
| Updated | 2026-06-23 |
| Anchored-commit | —(獨立 mock;BO 不錨定)· 真實後台參考:adminmvp.ztor.com `/#/page-config/home-page` |

> 對齊真實 ztor 後台。**以 `.md` 為準,原型(`prototype/index.html`)僅作示意。** 欄位/列舉識別碼(英文)中英版逐字一致,只翻譯敘述。

---

## 1. 目的
讓內部營運能**分地區**配置 ztor 公開首頁,不需工程介入。首頁由上到下由三個區域組成:**Banner**、**Ranking 排行榜 widget**、**Layout Sequence(內容區塊序列)**。

## 2. 使用情境
- **身為營運編輯**,我選地區,新增與排列 banner、開關/編輯排行榜 widget、新增與排列內容區塊(各綁定 Data Type + 數據源 + UI 樣式),預覽後存檔 —— 讓首頁不需工程就能改。流程:選地區 → 編輯 Banner / Ranking / Layout Sequence → 預覽 → 存檔。
- 關鍵分支:>1 banner → 輪播 + 選用 rotate;Tag/Subtitle/Description 選填且雙語耦合(填一種→另一種必填,皆空則 FE 不顯示、不占位);部分 Data Type 樣式固定且/或無需數據源;排行榜 widget 可開關與編輯,但**不能**新增/刪除/排序。

## 3. Query Params
`region` = `hk | tw | global`(哪個地區的配置;預設 `tw`)。`preview` = `desktop | mobile`(預覽視口)。

---

## 4. Banner  `/admin/page-config/home-page`(頂部區域)

### 4.1 版面
| Block | 說明 |
|-------|-------------|
| 區段標題 | 「Home Page Banner」+ **+ Add Banner**。 |
| Rotate 開關 | **僅在 banner > 1 時顯示** —— 「Rotate · auto every 3s」。 |
| Banner 清單 | 一列一個 banner:`# · Title · Resource · Item · N CTA · 啟用 · ⚙ · ✥(拖拽) · 🗑`。 |
| Banner 編輯彈窗 | 啟用(頂部 —— 隨內容滾動、**不固定**);**Banner Resource** = 一個**群組(group)**(於其他模組建立)→ **Item** 選擇器(該群組*底下的*哪個 event/item,以 BO 的圖片+名稱卡片呈現);雙語 **Header / Title / Content**(**全部選填、雙語耦合**);**CTA** 清單(name + url);取消/確定 固定底部。 |

### 4.2 互動
| 操作 | 結果 |
|--------|--------|
| + Add Banner | 開啟 banner 編輯器以新增一個 banner。 |
| ⚙(列) | 開啟該 banner 的編輯器。 |
| _編輯器內:_ 選 **Resource**(群組) | 選定**群組**(於其他模組建立);清除先前選的 Item(Item 依群組而定)並顯示 Item 選擇器。 |
| _編輯器內:_ 點 **Item** | 開啟限定該群組的 **SELECT ITEM** 選擇器 —— 以 **圖片 + 名稱** 卡片列出該群組*底下的* event/item(須先在該模組建立;此處只選不建);選擇即填入該具體 event/item。 |
| _編輯器內:_ 編輯 Header/Title/Content · + Add CTA · 移除 CTA | 編輯 banner 草稿 —— 皆在編輯器彈窗內操作。 |
| 拖拽 ✥(列) | 排序 banner(= 輪播順序)。 |
| 切換 Rotate | 開關 3 秒自動輪播(>1 才有意義)。 |
| 切換啟用(列) | 開 = 該 banner 顯示於前台首頁(FE);關 = 從前台隱藏(後台保留,可隨時再開啟)。 |
| **刪除 🗑(列)** | 從區段移除該 banner。 |
| 存檔(編輯器) | 驗證(**Item 必填(每個群組)**;文字欄位選填但**雙語耦合** —— 填一種語言則中英都需填;每個已新增的 CTA 需 name + `http`/`https` url)→ 存檔;否則行內錯誤。 |

### 4.3 分支 / 狀態(FE)
| 情況 | 行為 |
|------|----------|
| 1 個 banner | 單一 banner;無輪播控制、無 rotate 選項。 |
| > 1 banner,rotate 關 | 單槽輪播;訪客以**圓點**切換(不自動)。 |
| > 1 banner,rotate 開 | 每 **3 秒**自動切換;圓點仍可用。 |
| 永遠 | 所有 banner 共用**一個槽位 / 一個區段** —— 不堆疊。 |
| Header/Title/Content 只填一種語言、另一種留空 | 存檔被擋;空白語言欄標紅(要嘛都填、要嘛都清空)。 |
| Header/Title/Content 兩語言皆空 | 於 FE **不顯示且不保留占位** —— banner 文字往上頂。 |

**停用條件:** `enabled=false` 的 banner 不在 FE 渲染。

### 4.4 資料
- `Banner { id, enabled, resource: BannerResource, item: BannerItem, header: Bilingual, title: Bilingual, content: Bilingual, ctas: Cta[] }`
- `BannerSection { banners: Banner[], rotate: boolean }`
- `BannerResource` = 一個**群組(group)**:於**其他 BO 模組建立與管理**的內容群組(`AI Competition | Blind Box | Movie | Customize | Crowdfund` —— **`Customize` 同樣是一個群組**,不是手動模式)。Home CMS **不建立**群組 —— 只從既有群組選取;群組清單由該模組提供(此處列舉僅為示意)。
- `BannerItem`:所選**群組底下的一個具體 event / item**,同樣於該其他模組建立。選擇器以 **圖片 + 名稱** 卡片列出該群組底下的 item;群組無 item 則清單為空(「請先在該模組建立」)。**每個群組皆必填**(無任何群組例外 —— 含 `Customize`)。
- `Bilingual { zh: string, en: string }` —— **banner 所有文字(Header/Title/Content)皆選填但雙語耦合**:每個欄位的 `zh` 與 `en` 要嘛都填、要嘛都空;空欄位於 **FE 不顯示且不保留占位**。 · `Cta { name: string, url: Url }`(若新增 CTA,則 `name` + `http`/`https` `url` 皆必填)

---

## 5. Ranking 排行榜 widget(Banner 與 Layout Sequence 之間)

### 5.1 版面
| Block | 說明 |
|-------|-------------|
| 列 | `★ Title · Ranking widget · N/總數 platforms on · 啟用 · ⚙`。**不可新增 / 刪除 / 排序。** |
| Ranking 編輯彈窗 | 啟用(頂部 —— 隨內容滾動、**不固定**);雙語 **Title(必填)+ Subtitle(選填、雙語耦合)**;**Platform 清單**(每個:開關、⠿ 拖拽排序、排行來源子行、未設定顯示「未配置」)+ **+ Add Platform**;取消/確定 固定底部。 |

### 5.2 互動
| 操作 | 結果 |
|--------|--------|
| 切換(列) | 啟用 / 停用 widget。 |
| ⚙(列) | 開啟 ranking 編輯器。 |
| _編輯器內:_ 編輯 Title/Subtitle · 平台開關 · 拖拽 ⠿ · + Add Platform | 更新 widget 與其平台清單。 |
| 存檔(編輯器) | 驗證 Title(兩語言)+ Subtitle 雙語耦合(填一種語言→中英都需填)→ 存檔。 |
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
- `Ranking { enabled, title: Bilingual, subtitle: Bilingual, platforms: Platform[] }` —— `title` 必填(兩語言);`subtitle` 選填但**雙語耦合**(`zh` 與 `en` 要嘛都填、要嘛都空;空則 FE 不顯示且不保留占位)。
- `Platform { key, name, sub: string, on: boolean, configured: boolean }` —— `sub` 為排行來源;`configured=false` → 「未配置」。

---

## 6. Content Block 內容區塊(Layout Sequence)

### 6.1 版面
| Block | 說明 |
|-------|-------------|
| 區段標題 | 「Home Page Layout Sequence」+ **+ Add Content Block**。 |
| 區塊清單 | 一列一個:`# · Title · DataType · UIStyle · Tag · 啟用 · ⚙ · ✥(拖拽) · 🗑`。 |
| 區塊編輯彈窗 | 啟用(頂部 —— 隨內容滾動、**不固定**);雙語 **Title(必填)/ Tag / Subtitle / Description(富文本)** —— Tag/Subtitle/Description 皆**選填**(無顯示/隱藏開關);**Data Type**(10);**數據源**選擇器;**FE UI 樣式**;取消/確定 固定底部。 |

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

> **Data Type 選項來自 BO 其他模組** —— Data Type 的清單(以及每種類型對應的內容)於別處定義與維護;Home CMS 只能*選取* Data Type,不能新增或編輯清單。上表僅為示意。

### 6.4 資料
- `ContentBlock { id, enabled, dataType: DataType, uiStyle: string, source: string, title: Bilingual, tag: Bilingual, subtitle: Bilingual, description: Bilingual }`
- `DataType`:`Ztor Library | Movie/Tv List | Movie Review | Tastemaker | Ranking | Events Data | Movie New | Award | Box Office | Co-creation`
- `Bilingual { zh: string, en: string }`。**Title** 必填(兩語言)。**Tag / Subtitle / Description** 選填但**雙語耦合** —— 每個欄位的 `zh` 與 `en` 要嘛都填、要嘛都空。空欄位於 **FE 不顯示且不保留占位**。

---

## Performance & SEO
**Performance(後台編輯器):** 拖曳回饋 < 100ms(樂觀)· 預覽渲染 < 1s · 編輯器 LCP < 2.5s · CLS < 0.1 · INP < 200ms · 清單超過約 50 列虛擬化 · 預覽重渲染不得阻塞輸入。
**SEO / GEO:** `N/A — authenticated`(後台在登入後;不可索引)。

## 驗收標準(Acceptance)
**Banner**
- [ ] 編輯器:**啟用在頂部(隨內容滾動、不固定)**;僅 Save/Cancel 固定底部。
- [ ] 無論數量,FE 只顯示**一個 banner 槽位**(輪播),一次一個;banner 不堆疊成多段。
- [ ] **Rotate** 開關僅在 banner **> 1** 時出現;開 → 每 **3 秒**自動切換;關 → 手動圓點切換。
- [ ] banner 所有文字欄位(Header/Title/Content)皆**選填但雙語耦合**(填一種語言→中英都需填;兩語言皆空→FE 不顯示且不保留占位);若新增 CTA,則需 `name` + 絕對 `http`/`https` `url`;不合法擋下。
- [ ] **Banner Resource = 一個群組**(於其他模組建立;`Customize` 也是群組);選完群組後須從既有 BO item 選一個 **Item**(該群組底下的 event/item;圖片+名稱卡片、只選不建)—— **每個群組皆必填**;切換群組會清除先前選的 Item;群組無 item 則清單為空。
- [ ] banner 可拖拽排序;列順序即輪播順序。
- [ ] 每列 banner 皆有 **刪除 🗑**;刪除後該 banner 移出區段(與輪播)。

**Ranking widget**
- [ ] 編輯器:**啟用在頂部(隨內容滾動、不固定)**;僅 Save/Cancel 固定底部。
- [ ] 單一固定 widget —— 不能當作區段被新增 / 刪除 / 排序。
- [ ] ⚙ 可編輯:雙語標題(必填)+ 副標題(選填、雙語耦合 —— 填一種語言→中英都需填;空則 FE 不顯示)、啟用、平台 開關 / 拖拽排序 / 新增;未設定顯示「未配置」。
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
- **BO-TC-02** — Given >1 banner 且 `rotate=開` · When 經過 3 秒 · Then 自動切到下一個;And `rotate=關` · When 經過 3 秒 · Then 不自動,但點圓點仍可切。*(catches: 輪播無視開關)*
- **BO-TC-03** — Given banner 某 CTA 的 `url="javascript:alert(1)"` 或 `name` 為空 · When 存檔 · Then 被擋並顯示行內錯誤、不持久化;填入 `name` + `http`/`https` url 可存。*(catches: CTA 釣魚/XSS;CTA 不完整)*
- **BO-TC-04** — Given Ranking 列 · When 嘗試把它當區段刪除或排序 · Then 不可;When ⚙ → 關掉某平台、拖拽排序、改標題、存檔 · Then 列上平台數/順序/標題更新,FE tabs 反映已啟用平台。*(catches: ranking 被當普通區塊 / 不可編輯)*
- **BO-TC-05** — Given 內容區塊 Subtitle 只填繁中、英語留空 · When 存檔 · Then 被擋且空白語言欄標紅;Given Subtitle 兩語言皆空 · When 存檔 · Then 允許,且 FE 不顯示 Subtitle、**不保留占位**(內頁描述顶到副標題的位置)。*(catches: 半翻譯欄位;空欄在 FE 留下空隙)*
- **BO-TC-06** — Given Data Type = `Co-creation` · When 未選數據源就存檔 · Then 被擋(「請選擇數據鏈接」);Given Data Type = `Events Data` 或 `Movie New` · Then 不顯示數據源欄位且可存。*(catches: 數據源規則錯誤;Co-creation 被錯誤豁免)*
- **BO-TC-07** — Given Layout Sequence `[A, B, C]` · When 用把手把 C 拖到 A 之上 · Then 順序變成 `[C, A, B]` 且序號更新。*(catches: 排序失效)*
- **BO-TC-08** — Given 一列 banner 與一列內容區塊 · When 各自點 **刪除 🗑** · Then 該 banner 移出輪播、該區塊移出 Layout Sequence(列數遞減);Ranking widget **無**刪除。*(catches: 缺少刪除 / 刪除範圍過大)*
- **BO-TC-09** — Given Banner Resource(群組)= `Movie` · When 點 Item 欄位 · Then **SELECT ITEM** 選擇器以**圖片 + 名稱卡片**列出該群組底下的 event/item、選一個即填入 Item;Given 某群組無任何 item · Then 清單為空(CMS 無法在此新增群組或 item);When 未選 Item 就存檔 · Then 被擋並顯示行內錯誤;Given 群組 = `Customize` · Then 與其他群組一致 —— 列出其 item 且 Item 仍必填(無任何群組例外);When 群組由 `Movie` 切到 `Crowdfund` · Then 先前選的電影被清除、選擇器改列 Crowdfund 群組的 item。*(catches: 缺少 item 鏈接;item 清單錯誤/殘留;群組/item 未在所屬模組建立;Customize 被錯誤豁免)*

## Not Included
- 分地區**資料串接**(配置依地區,但跨地區資料整合另計)。
- 公開 **FE 渲染器**(消費本配置;既有)。
- **Banner** 目前在 FE 為寫死,將由本配置取代。
- **Banner 群組(Resource)及其底下 event/item 的建立**(Movie / AI Competition / Crowdfund 募資 / Blind Box)—— 由各自的 BO 模組建立;本介面只從既有群組與 item *選取*(外部依賴)。
- **Data Type 清單**(Data Type 的種類,以及每種類型對應的內容)—— 於其他 BO 模組定義與維護;本介面只*選取* Data Type(外部依賴)。
- Ranking 的**平台主檔資料**(來源來自另一個 BO 模組)。
- 平台層級的**存取權限與變更記錄**(沿用既有 BO 後台)。
