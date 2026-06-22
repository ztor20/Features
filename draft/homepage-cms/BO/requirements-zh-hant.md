# 首頁 CMS — 後台(Back Office)需求

| 項目 | 內容 |
|------|---------|
| Routes | `/admin/homepage`(編輯器)· `/admin/homepage/audit`(稽核日誌) |
| Folder | `homepage-cms/BO` |
| Version | 1.1 |
| Updated | 2026-06-22 |
| Anchored-commit | —(獨立 mock;BO 從不錨定)· FE 線上參考:https://ztor.lx7.com/ |

---

## 1. 目的
控制公開 ztor 首頁(黑黃配色的 Ztor 2.0 首頁)的內部營運介面。營運從**模板**新增 `Section`(模板從一個會預覽 FE 版面的模板庫挑選),編輯每個板塊的 **Title / Subtitle / Content**(隱藏 / 編輯 / 調順序),設定 **CTA**(label + URL)與一個可命名的 **Tag**,排序 / 隱藏 / 刪除板塊,桌面/手機預覽,並執行一條受編輯鎖、編輯者/發布者角色與唯讀稽核日誌保護的草稿 → 發布流程。

## 2. 使用情境
- **身為 `homepage_editor`**,我打開 `/admin/homepage`,取得編輯鎖,從預覽過的模板新增板塊、編輯其文字元素(調順序/隱藏)、設定 CTA 連結與標籤、預覽、存草稿。流程:打開 → 取得鎖 → 從模板新增 → 編輯 `draftLayout` → 預覽 → 存草稿(`DRAFT_DIRTY`)。
- **身為 `homepage_publisher`**,我審閱髒草稿並發布上線,或隱藏有問題的板塊後重新發布。流程:打開 → 審閱 → 發布(`liveLayout := draftLayout`)→ `DRAFT_CLEAN`。
- 關鍵分支:他人持有鎖 → 唯讀;我是編輯者 → 發布鈕隱藏;無 `homepage_cms` → 403;連點發布 → 只發一次;CTA URL 為 `javascript:`/相對路徑 → 被拒;板塊數達上限 → 「新增」停用。

## 3. Query Params
`?preview=desktop|mobile`(預覽視口;預設 `desktop`)。

---

## 4. 首頁編輯器  `/admin/homepage`

### 4.1 版面
| Block | 說明 |
|-------|-------------|
| 頂部列 | 鎖狀態、`publishStatus` 標記(`DRAFT_CLEAN`/`DRAFT_DIRTY`)、桌面/手機切換、**存草稿**、**發布**(僅發布者)、**捨棄草稿**。 |
| 左 — 板塊清單 / 畫布 | 有序的 `draftLayout.sections`;每列:模板名、標題、`enabled`(隱藏)開關、標籤片、拖曳把手、刪除。對應 `Section.order`。**+ 新增板塊** 打開模板庫(§5)。 |
| 中 — 即時預覽 | 以選定視口渲染 `draftLayout`;每個板塊依 `elementOrder` 渲染其可見 `elements`,加上 `tag`(若啟用)與 `cta`(若啟用)。為 FE 渲染器的示意性重用。 |
| 右 — 編輯面板(抽屜) | 選取板塊時從右側滑出,任何視窗寬度都可達。包含:模板(唯讀)、內容來源、banner 圖片、三個元素列、CTA 編輯器、Tag 編輯器(見 §4.3),以及底部的 **Save** / **Cancel**。 |

### 4.2 互動
| 操作 | 結果 |
|--------|--------|
| 在 `UNLOCKED` 時打開編輯器 | 取得鎖;`AuditLog(lock_acquired)`。 |
| 在被他人 `LOCKED` 時打開編輯器 | 唯讀;橫幅「由 {name} 鎖定」;寫入被擋(409)。 |
| **+ 新增板塊** → 挑模板(§5) | 以該 `template` 建立新 `Section`,植入預設 `elements`/`cta`/`tag`;加在末尾;`→ DRAFT_DIRTY`;`AuditLog(template_selected, section_added)`。 |
| 把板塊拖到新位置 | 拖曳時被拖的列變淡,並顯示一條**落點指示線**標明會插入的位置(Asana/Linear 風格);放下後更新 `order`;`→ DRAFT_DIRTY`;`AuditLog(section_reordered)`。放回原位為無操作(不 dirty、不記錄)。 |
| 切換板塊的 `enabled`(隱藏/顯示) | `ENABLED ↔ DISABLED`;隱藏時變灰;`→ DRAFT_DIRTY`;`AuditLog(section_hidden_changed)`。 |
| 刪除板塊 | 從 `draftLayout` 移除;`→ DRAFT_DIRTY`;`AuditLog(section_removed)`。 |
| 編輯某元素文字(Title/Subtitle/Content) | 更新 `elements[key].text`;`→ DRAFT_DIRTY`;`AuditLog(section_edited)`。自動存草稿防抖 2s。 |
| 切換某元素可見性 | 翻轉 `elements[key].visible`;該元素退出 FE 渲染;`→ DRAFT_DIRTY`;`AuditLog(element_visibility_changed)`。 |
| 把某元素上移/下移 | 重排 `elementOrder`;預覽重渲染;`→ DRAFT_DIRTY`;`AuditLog(element_reordered)`。 |
| 設定內容來源(依模板:合集 / 信息流 / 地區+周期 / widget 類型) | 更新 `Section.source`;`→ DRAFT_DIRTY`;`AuditLog(source_changed)`。這是讓列表/輪播模板能填入內容的關鍵。 |
| 上傳 / 更換 / 移除 banner 圖片(僅支援圖片的模板) | 更新 `Section.image.url`/`alt`;上傳校驗(PNG/JPEG/WebP,≤5MB);`→ DRAFT_DIRTY`;`AuditLog(image_changed)`。 |
| 切換 CTA + 編輯 label/URL | 更新 `cta`;URL 校驗(僅 http/https);`→ DRAFT_DIRTY`;`AuditLog(cta_changed)`。 |
| 切換 Tag + 命名 | 更新 `tag.enabled`/`tag.label`;`→ DRAFT_DIRTY`;`AuditLog(tag_changed)`。 |
| 切換桌面/手機 | 預覽重渲染;無資料變更。 |
| **存草稿** | 持久化 `draftLayout`;維持 `DRAFT_DIRTY`;離開時釋放鎖(`lock_released`)。 |
| **發布**(發布者) | `liveLayout := draftLayout`、`liveVersion := draftVersion`、`→ DRAFT_CLEAN`、設定 `lastPublishedAt/By`;`AuditLog(published)`。以 `draftVersion` 做冪等。 |
| **捨棄草稿** | `draftLayout := liveLayout`;`→ DRAFT_CLEAN`;`AuditLog(draft_discarded)`。 |

### 4.3 元素 / CTA / Tag 編輯(右面板)
| 控制 | 行為 |
|---------|----------|
| 內容來源(依模板) | 渲染該模板的 `Section.source` 欄位(見 `feature_description.md` 的 Per-template source config):例如 `top10_ranking` → Tabs(新增/移除排行來源名稱)+ Region + Period;`film_list` → Tabs(固定 最新影片/現正熱播/Ztor 精選 — 勾選顯示)+ Resource(All/Taiwan/Hong Kong/…)+ Layout(Row/Grid);`cocreation_projects` → Auto feed + 眾籌項目 IDs(填了 ID 就覆蓋 feed,FE 只顯示這些 ID);`featured_campaign` → 關聯活動 + 可選 Deadline;`viewing_history` → 無(依訪客自動)。無來源的模板(`hero_banner`、`multi_campaign`)不顯示來源控制(`multi_campaign` 改用 Campaign cards)。 |
| Banner 圖片(支援圖片的模板:`hero_banner`、`featured_campaign`) | **上傳 / 更換 / 移除** 單張封面圖 + **alt 文字**(≤120)。上傳接受 PNG/JPEG/WebP ≤5MB(排除 SVG);無效檔案被拒並提示、不存檔。其他模板不顯示圖片控制(v1 其圖像來自關聯內容)。 |
| 元素列(Title、Subtitle、Content) | 三者皆**可選**,新建板塊時全部**留空**(無模板預設)。每列有:**可見性**開關(`elements[key].visible` — 隱藏/顯示)、**文字**輸入(編輯;字數上限 `title` 80 / `subtitle` 120 / `content` 500)、**↑/↓** 設定在 `elementOrder` 的優先順序。隱藏或留空的元素不進 FE 渲染(板塊可只顯示其模板主體)。合法排序為任意排列/子集,例如 `Title→Subtitle→Content`、`Title→Content→Subtitle`、`Title→Content`(隱藏副標)、`Content→Subtitle`(隱藏標題)。 |
| CTA | **啟用**開關(`cta.enabled`);**label** 輸入(≤40);**URL** 輸入(≤2048)。存檔時 URL 必須為絕對 `http`/`https` — `javascript:`、`data:` 或相對路徑顯示行內錯誤且不存檔。**例外** — `featured_campaign`:無 URL 欄;CTA(與 banner 圖片)連到 Content source 設定的關聯活動(`source.campaignRef`)。 |
| Campaign cards(僅 `multi_campaign`) | 卡片清單。**Add card** / **Remove card**;每張卡各有自己的**圖片(必填,PNG/JPEG/WebP ≤5MB)**、**title**、**content**、**CTA**(label + http(s) URL)。需 **≥1 張卡**且**每張卡都要有圖片**——面板會標出未完成的卡。`multi_campaign` 另有可選的**區塊標題**(title/subtitle/content)**與區塊 CTA**(label + http(s) URL)顯示在卡片上方;無板塊層級圖片(每張卡各自帶圖與自己的 CTA)。**FE 顯示:一行最多 3 張卡;超過 3 張橫向捲動。** |
| Tag | **啟用**開關(`tag.enabled`);**名稱**輸入(`tag.label`,≤16)。停用的 tag 不在 FE 渲染。 |
| Save / Cancel(抽屜底部) | 編輯抽屜為**模態**:開啟期間頁面其餘部分(板塊清單、頂部列、+ Add、切換器)皆被鎖住——只能 **Save** 或 **Cancel**(或 ✕)。**Save** 將此板塊的編輯保留在 `draftLayout` 並關閉(變更在草稿中,尚未公開;按 **Publish** 才上線)。**Cancel** / ✕ 還原自抽屜開啟以來的所有編輯——包含剛從模板庫新增的板塊——並關閉。點變暗的遮罩不會有動作(提示「請先 Save 或 Cancel」),絕不靜默丟棄編輯。 |

### 4.4 分支 / 狀態
| 情況 | 行為 |
|------|----------|
| 空 / 首次(0 板塊) | 畫布空狀態「新增你的第一個板塊」;點擊打開模板庫;預覽空白;發布停用。 |
| 載入中 | 頂部列 + 清單骨架;載入完成前停用庫/編輯。 |
| 被他人鎖定 | 唯讀;清單/把手/面板/庫停用;「由 {name} 於 {time} 鎖定」。 |
| 存檔/發布錯誤 | 提示「存檔失敗——請重試」;伺服器 `draftLayout` 不變;保留鎖。 |
| CTA URL 無效 | URL 欄下行內錯誤(「請用完整 http(s) 連結」);不以壞 URL 存檔。 |
| 權限不足(無 `homepage_cms`) | 403 頁;編輯器不渲染。 |
| 達板塊上限(50) | 「新增板塊」停用並顯示「最多 50 板塊」提示。 |
| 排行 tab 無資料(`top10_ranking`) | 該 tab 仍顯示在導航;其面板渲染空狀態占位(「此 tab 尚無排行資料」)。每個 tab 可各自為空。 |
| Co-creation 專案 IDs(`cocreation_projects`) | 只要加了 `projectId`,FE 就**只渲染這些**(N 個 ID → N 張卡)且忽略 feed——不多不少。沒填 ID 時才用 feed。一行最多 3 張,超過橫滾。 |

**停用條件(Disabled when):** 角色為 `homepage_editor` → **發布** 與 **強制解鎖** 隱藏/停用。他人持有鎖 → 所有編輯控制停用。`publishStatus == DRAFT_CLEAN` → **發布** 與 **捨棄草稿** 停用。`cta.enabled == false` → CTA label/URL 輸入停用。`tag.enabled == false` → Tag 名稱輸入停用。

**狀態(`Homepage.publishStatus`):** `DRAFT_CLEAN` → `DRAFT_DIRTY`(鎖持有者任何草稿編輯);`DRAFT_DIRTY` → `DRAFT_CLEAN`(發布者發布,或持有者捨棄)。非法:`homepage_editor` ✗→ 發布。
**狀態(`LockState`):** `UNLOCKED` → `LOCKED`(進入編輯);`LOCKED` → `UNLOCKED`(離開 / 15 分鐘閒置 / 發布者強制解鎖)。非法:`LOCKED` 時非持有者寫入(409)。
**狀態(`Section.enabled`):** `ENABLED` ↔ `DISABLED`(鎖持有者隱藏/顯示);`DISABLED` 板塊不進 `liveLayout`。

---

## 5. 新增板塊 — 模板庫(modal)

### 5.1 版面
| Block | 說明 |
|-------|-------------|
| 模板網格 | 每個 `SectionTemplate` 一張卡,依模板庫順序(`featured_campaign`、`multi_campaign`、`film_list`、`viewing_history`、`top10_ranking`、`hero_banner`、`cocreation_projects`、`announcement_banner`)。每張卡除名稱外**必須**顯示:其**關鍵差異標籤** + **一行說明**(見 `feature_description.md` 的 Template catalog)與一個**形態各異的縮圖**——讓營運不必逐一點選即可分辨。任兩個縮圖不得同形。 |
| 預覽面板 | 懸停/選取時,顯示所選模板的**關鍵差異 + 說明**與較大的 FE 預覽占位內容(需求:「選模板 → 預覽其在 FE 的呈現,以及它的差異在哪」)。 |
| 確認 | **使用此模板** 建立 `Section`。 |

### 5.2 互動
| 操作 | 結果 |
|--------|--------|
| 懸停/選取模板卡 | 預覽面板顯示該模板的關鍵差異 + 說明 + 較大的 FE 預覽。 |
| **使用此模板** | 建立含 `template` 與植入 `elements`/`cta`/`tag` 的 `Section`;關閉 modal;在編輯器選取它;`AuditLog(template_selected, section_added)`。 |
| 取消 | 關閉 modal;無變更。 |

### 5.3 分支 / 狀態
| 情況 | 行為 |
|------|----------|
| 達板塊上限 | 無法打開模板庫;Add 上顯示「最多 50 板塊」提示。 |
| 被他人鎖定 | 模板庫停用(唯讀)。 |

---

## 6. 稽核日誌  `/admin/homepage/audit`

### 6.1 版面
| Block | 說明 |
|-------|-------------|
| 篩選列 | 依 `action`、`actorId`、日期區間篩選。 |
| 日誌表 | `AuditLog` 列:`at`、`actorId`(姓名)+ `actorRole`、`action`、`targetSectionId`、`summary`。最新在前;超過 50 列分頁。 |

### 6.2 分支 / 狀態
| 情況 | 行為 |
|------|----------|
| 空 | 「尚無活動記錄。」 |
| 權限不足 | 僅 `homepage_publisher` 可見;編輯者得 403。 |

**停用條件(Disabled when):** 檢視者為 `homepage_editor` → 稽核路由回 403。

---

## Performance & SEO
**Performance(所有 surface):** 拖曳回饋 < 100ms(樂觀)· 元素重排與預覽重渲染 < 1s · 模板庫預覽渲染 < 1s · 自動存草稿防抖 2s · 板塊清單超過約 50 列虛擬化 · 稽核表超過 50 列分頁 · 編輯器 App LCP < 2.5s · CLS < 0.1 · INP < 200ms。預覽重渲染不得阻塞輸入。
**SEO / GEO:** `N/A — authenticated`(後台在登入後;不可索引)。

## Acceptance
- [ ] 編輯者無需工程即可從(預覽過的)模板新增、編輯、隱藏、刪除、排序板塊。
- [ ] 每板塊:Title/Subtitle/Content 各可隱藏、編輯、調順序(`elementOrder`);CTA label+URL 可設;Tag 可啟用+命名。
- [ ] 每個模板都暴露其所需控制:圖片(banner 模板)、內容來源(`Section.source` — 依目錄的 合集/信息流/地區/widget),讓列表/輪播模板能真正指向內容。
- [ ] `multi_campaign` 支援多張卡(增/刪),每張各有必填圖片 + 標題 + 內容 + CTA;編輯器會擋下/標記零卡或任何缺圖的卡。
- [ ] 選模板時,在建立板塊前先預覽它在 FE 的呈現。
- [ ] 每張模板卡標明其**關鍵差異**(標籤 + 一行說明)與形態各異的縮圖,讓營運不必試錯即可選擇。
- [ ] 存草稿只改 `draftLayout`;訪客在發布前仍看 `liveLayout`。
- [ ] (‡ concurrency) 兩次同時進入編輯 → 恰好一人取得鎖;另一人唯讀(409)— BO-TC-01
- [ ] (‡ auth) `homepage_editor` 無法發布(隱藏 + 403);無 `homepage_cms` → 無法打開 CMS(403)— BO-TC-02
- [ ] (‡ idempotency) 對同一 `draftVersion` 的兩次/重試發布只發一次 — BO-TC-03
- [ ] (‡ abuse) 編輯者無法把內容推上線;發布者審閱閘擋下;嘗試可稽核 — BO-TC-04
- [ ] (‡ audit) 每次編輯/發布/捨棄都寫一筆含 `actorId`、`actorRole`、`at`、`action` 的 `AuditLog` — BO-TC-05
- [ ] (‡ trust&safety) 發布者藉隱藏板塊+重發下架;`DISABLED` 板塊絕不出現在 `liveLayout` — BO-TC-06
- [ ] (‡ trust&safety/abuse) `javascript:`/相對 `Cta.url` 被拒不存檔;僅 http(s) 持久化 — BO-TC-07
- [ ] (‡ trust&safety/abuse) 類型錯誤或 >5MB 的 banner 圖片被拒不存檔;PNG/JPEG/WebP ≤5MB 可持久化 — BO-TC-09
- [ ] (‡ money) CMS 無法觸及任何付款/退款端點 — BO-TC-08
- [ ] (perf) 50 板塊首頁上拖曳回饋 < 100ms 且預覽重渲染 < 1s。

## Test cases
- **BO-TC-01** — Given 首頁 `UNLOCKED` · When 使用者 A 與 B 在同一瞬間都 POST 進入編輯 · Then 恰好一人得 `lockedBy=self`(200),另一人 409「由 {A} 鎖定」。*(catches: 兩位編輯者悄悄互相覆蓋)*
- **BO-TC-02** — Given 使用者為 `homepage_editor` · When 他 POST publish · Then 403,`liveVersion` 不變;And 無 `homepage_cms` 使用者 GET `/admin/homepage` → 403。*(catches: 提權發布 / 未授權存取)*
- **BO-TC-03** — Given `draftVersion=7`、`liveVersion=6` · When 以鍵 `7` 送兩次發布 · Then 第一次後 `liveVersion=7`;第二次回傳既有 `liveLayout`,不產生第二筆 `published` 列。*(catches: 重試造成重複發布)*
- **BO-TC-04** — Given 編輯者草稿含違規內容 · When 編輯者嘗試使其上線 · Then 無編輯者發布路徑(被擋)且該草稿編輯在 `AuditLog`。*(catches: 流氓編輯者繞過審閱)*
- **BO-TC-05** — Given 任何編輯者操作(新增/編輯/排序/元素變更/cta/tag/發布/捨棄)· When 成功 · Then 存在一筆含正確 `actorId`、`actorRole`、`at`、`action`、`targetSectionId` 的 `AuditLog` 列。*(catches: 無法追溯的變更)*
- **BO-TC-06** — Given 某 `Section` 的 `enabled=DISABLED` · When 發布者發布 · Then 該板塊不出現在送給訪客的 `liveLayout`。*(catches: 下架卻沒真的隱藏內容)*
- **BO-TC-07** — Given 某板塊 CTA · When `cta.url` 設為 `javascript:alert(1)` 或相對路徑並存檔 · Then 存檔被拒並顯示行內錯誤,`cta.url` 不被持久化;`http(s)` URL 可正常存檔。*(catches: 透過 CTA 連結的儲存型 XSS / 釣魚)*
- **BO-TC-08** — Given CMS UI 與 API · When 檢查可用操作 · Then 未暴露任何付款/退款端點(設計上無 money 路徑)。*(catches: 範圍蔓延引入未防護的 money 路徑)*
- **BO-TC-09** — Given 支援 banner 的板塊 · When 上傳 `.svg` / `.exe` / 9MB JPEG · Then 上傳被拒並提示,`Section.image.url` 維持空;2MB PNG 可上傳並在預覽渲染。*(catches: 惡意/超大媒體上傳)*

## Not Included
- 公開 FE 首頁渲染器(消費 `liveLayout`;既有,範圍外)。
- 版本回滾 / 還原(稽核日誌僅記錄——依範圍)。
- 排程發布。
- 分語系首頁內容(v1 僅單一預設語系)。
- Tag 顏色/樣式系統(v1 僅名稱)。
- 發布通知(NEEDS-POLICY-OWNER:Content Ops lead)。
- 創作者端(CS)編輯。
