# Watch Party — 前端（FE）需求（繁體中文）

> 雙語文件：與 `requirements-en.md` 對應。欄位 / enum 識別碼需與英文版**逐字一致**，僅翻譯說明文字。完整 BRD 另有線上版：https://ztor-watchparty.vercel.app/brd

| 項目 | 內容 |
|------|------|
| Surface | 前端（消費者端）— 主持人自助開房 ＋ 粉絲購票 ＋ 房內同步觀看 |
| Folder | `watch-party/FE` |
| Version | v1 |
| Updated | 2026-06-26 |
| Prototype | 已上線（桌機）→ 已整合進主站 `Frontend`，部署 https://ztor-2-0-f2e.vercel.app（原始碼：`ztor20/Frontend`） |
| Design system | `Frontend-Design-System` |

> `.md` 為權威來源，原型僅作示意。內容遷移自 Watch Party BRD（亦託管於 `/brd`）。

## Contract reference（資料契約）
平台共用名詞 → `Features/_shared-contract.md`（引用，不重新定義）。功能本地實體（`HostGrant`、`ContentGrant`、`WatchParty`、`Order`（`watch_party_ticket`）、`RoomOccupancy`、`EmailNotification`）與 `WatchParty.status` 狀態機定義於完整 BRD（託管 `/brd`）。前端是同一份契約的**主持人/粉絲端**，後台（`watch-party/BO`）則管理同一份契約。
- **FE 讀取：** `HostGrant`（此帳號是否為主持人）、`ContentGrant`（此主持人可播哪些 title/episode）、`WatchParty.*`、`Order`（自己的票）、`RoomOccupancy`、`Fan.display_name`、`Title`、`Episode`
- **FE 寫入：** `WatchParty.{name, scheduledAt, price, privacy, capacity}`（主持人建立）、`WatchParty.status`（開房時 `scheduled`→`live`；斷線/回歸時 `host_away`/`live`）、`Order`（`watch_party_ticket` 購票 — 冪等）、聊天訊息＋presence（Ably；v1 不留存）

## Goal（本介面目標）
讓**已授權主持人**自助開房 — 設定名稱、時間、免費或 POPCORN 票價、公開/私密 — 並即時主持；讓**粉絲**一鍵購票（不重複扣款）並與全體**同步**觀看、即時聊天。主持人於**房內**從授權片庫挑選/切換劇集。營運端控制（誰能主持、可播什麼、容量、監控、退款）屬後台職責 — 前端僅消費這些授權。

## Scenarios（情境）
- **Given** 一位**未獲授權**的粉絲，**When** 打開發起共看選單，**Then**「發起共看派對」隱藏/停用 — 僅 `HostGrant{status:active}` 帳號可建立。
- **Given** Gary 是已授權主持人，**When** 建立派對，**Then** 流程依序走 影片 → 日期/時間 → 隱私（公開/私密）→ 票價（免費或 POPCORN）→ 容量（不限或設定上限），並寫入一筆 `scheduled` 的 `WatchParty`；影片選擇器**限定**於其 `ContentGrant` 片庫。
- **Given** 已建立的派對，**When** 主持人完成，**Then** 取得**房間連結＋加入碼合併單一複製**動作；**付費**派對改分享**購票連結**（影片頁），不給原始房間連結/碼。
- **Given** 私密派對，**When** 粉絲打開房間連結，**Then** 須輸入**加入碼**方能進入（公開派對免碼）。
- **Given** 影片頁上的粉絲，**When** 點**「共看派對入場券」**，**Then** 領票彈窗確認該派對，按**領取**時**冪等地**建立 `watch_party_ticket` `Order` — 點兩次**不會**重複扣款 — 該票授予此派對的播放權。
- **Given** 派對**已額滿**，**When** 粉絲嘗試領票，**Then** 彈窗顯示**額滿**狀態（「已額滿」），不建立任何 order。
- **Given** 派對為 `live`，**When** 持票粉絲加入，**Then** 與主持人**同步**觀看（播放位置/play/pause/seek 跟隨主持人），並看到**即時聊天**＋線上人數。
- **Given** 主持人房內中途斷線，**When** 連線中斷，**Then** 房間進入 **host-away**，**全體暫停播放**直到主持人回歸（`status: host_away` → `live`）；派對結束後**無回放**。
- **Given** 主持人在房內，**When** 打開**主持控制**，**Then** 可**切換劇集**（限授權片庫）、**調整影片音量**、**刪除聊天訊息**、**踢除來賓**（兩段確認）；來賓對控制為唯讀。
- **Given** 粉絲打開**我的共看派對**（列表），**When** 頁面載入，**Then** 各派對顯示**免費(綠)/付費(橘) · 公開/私密** chip 與狀態；**進行中**派對以新分頁開房。

## Functional requirements（功能需求）
- **FR-01** 僅具 active `HostGrant` 的帳號可進入**發起派對**流程。
- **FR-02** 主持人可設定房間 **名稱、日期/時間、隱私（公開/私密）、票價（免費或 POPCORN 金額）、容量（不限或數字）**。
- **FR-03** 建立流程的影片/劇集選擇器**限定於主持人的 `ContentGrant`** 片庫。
- **FR-04** 建立後，主持人取得**合併單一複製**動作（**房間連結＋加入碼**）；**付費**派對改分享**購票連結**（影片頁），不給原始房間連結/碼。
- **FR-05** **私密**房須**加入碼**方能進入；**公開**房免碼。
- **FR-06** 粉絲可於影片頁**購票**；購買為**冪等**（每粉絲每派對一筆 `watch_party_ticket` `Order` — 不重複扣款）。
- **FR-07** **額滿**派對阻擋新票並顯示**額滿**狀態；售票數永不超過 `capacity`。
- **FR-08** 持票者可**進入房間**並**同步**觀看（主持人為 play/pause/seek/位置的權威）、含**即時聊天**與**線上人數**。
- **FR-09** **主持人斷線**時房間顯示 **host-away** 並**全體暫停**；回歸即恢復。結束後**無回放**。
- **FR-10** 房內**主持人**可**切換劇集**（限授權片庫）、**設定影片音量**、**刪除聊天訊息**、**踢除來賓**（兩段確認）；**來賓對這些為唯讀**。
- **FR-11** **我的共看派對**列出粉絲的派對，含**免費/付費 · 公開/私密** chip 與狀態；進行中可開房。
- **FR-12** 開演前提供**暖機等候室**（聊天＋倒數，尚未播放）。

## Edge / empty / loading / error states（邊界 / 空 / 載入 / 錯誤狀態）
| State | Behaviour |
|---|---|
| empty / first-run | 列表：「尚無共看派對」。建立流程影片選擇器無授權片庫時：「尚未指派內容 — 請營運授權一部 title」。 |
| loading | 列表骨架；房內 **sync** 狀態顯示 spinner（「同步中…」）等待追上主持人。 |
| not-a-host | 非 `HostGrant` 帳號的建立入口隱藏/停用。 |
| at-capacity | 影片頁領票彈窗顯示**「已額滿」**；不建立 order。 |
| already-ticketed | 重複點領取走**已領票**路徑（前往該派對），不建立第二筆 `Order`。 |
| private-no-code | 加入碼錯誤/空白 → 行內「代碼錯誤，請再試一次」，不進入。 |
| host_away | 全體來賓看到「主持人已離線 — 全體暫停播放」＋房間暫停；主持人回歸即恢復。 |
| ended / no-replay | 派對結束後**無回放**；房間顯示已結束狀態。 |
| permission / no-ticket | 無有效票的粉絲開房間連結 → 阻擋／導向購票。 |

## Success criteria（成功標準）
| Metric | Threshold | Window | Verification |
|---|---|---|---|
| 購票重複扣款 | 0 | 每粉絲每派對 | 重複領取回傳同一 `Order`；不二次扣款 |
| 超賣入場 | 0 | 每房 | `ticketsSold ≤ capacity` 恆成立（與 BO 共用 atomic guard） |
| 主持人播放未授權內容 | 100% 阻擋 | 每次建立／切換 | 選擇器限定 `ContentGrant`；伺服器拒絕其他 |
| 同步漂移（粉絲對主持人） | 容許值內 | live | 粉絲播放經 `playback-sync` channel 跟隨主持人位置 |
| 主持人離線暫停 | 100% | 每次斷線 | 主持人斷線時全體暫停，回歸即恢復 |

## Test cases（測試案例）
- **TC-G1 (Gate)** — Given 非主持人粉絲 · When 打開發起選單 · Then「發起共看派對」**不存在/停用**且建立流程無法進入。*(catches：未授權主持)*
- **TC-G2 (Grant scope)** — Given Gary 的 `ContentGrant` = [F ep1–3] · When Gary 打開建立流程影片選擇器 · Then 僅 F ep1–3 可選；房內**切換**至 ep4 被**阻擋**。*(catches：播放未授權內容)*
- **TC-B1 (Idempotency)** — Given 粉絲於派對 `wp_001` 點**領取** · When 再次點領取（雙擊／重試）· Then 恰存在**一筆** `watch_party_ticket` `Order` 且**僅扣款一次**。*(catches：重複扣款)*
- **TC-B2 (Capacity)** — Given `capacity=1000` 已售 1000 票 · When 第 1001 位粉絲領取 · Then 彈窗顯示**「已額滿」**且**不**建立 `Order`。*(catches：超賣)*
- **TC-P1 (Private)** — Given 一個**私密**房 · When 粉絲未帶碼打開連結 · Then 進入被**阻擋**直到輸入正確加入碼。*(catches：私密房外洩)*
- **TC-S1 (Sync)** — Given 主持人在 12:30 **暫停** · When 狀態傳播 · Then 每位持票者的播放器**暫停於 12:30**（容許值內）。*(catches：播放不同步)*
- **TC-S2 (Host-away)** — Given 房間為 `live` · When 主持人斷線 · Then 全體來賓看到 **host-away** 且播放**暫停**；重連後**恢復**（結束後不提供回放）。*(catches：失控/無主房間)*
- **TC-M1 (Moderation)** — Given 主持人刪除聊天訊息／踢除來賓（兩段確認）· When 確認 · Then 該訊息/來賓對全體消失；**來賓**嘗試同操作看不到該控制。*(catches：來賓取得主持權限)*

## Information architecture (prototype)（資訊架構）
消費者外框（主站 `Frontend` shell — 側欄、header、發起選單）。已建桌機頁：
1. **發起派對** `watch-party-create.html` — 主持人精靈：**影片 → 日期/時間 → 隱私（公開/私密）→ 票價（免費 / POPCORN）→ 容量（不限 / 設定）** → **「派對已建立」**確認頁，含**房間連結＋加入碼合併複製**（付費 → 改購票連結）。
2. **我的共看派對** `watch-party-list.html` — 粉絲的派對，含**免費/付費 · 公開/私密** chip ＋狀態；進行中以新分頁開房。分主持人/來賓視角。
3. **管理派對** `watch-party.html` — 主持人單一派對視圖：返回鈕、狀態 tag、房間連結＋加入碼（一律顯示給主持人）。
4. **購票** `title.html` — 作品詳情；**「共看派對入場券」** → 領票彈窗（`claim` / `full` / `already-claimed` 狀態）→ 領取後前往該派對。
5. **房內** `watch-party-room.html` — `lobby`（聊天＋倒數）→ `sync`（「同步中…」）→ `live`（同步播放器＋即時聊天＋線上人數）→ `ended`（無回放）。主持人覆層：切換劇集、影片音量、刪除訊息、踢除來賓、麥克風（主持人鏡頭/語音）。來賓唯讀。
6. **流程畫布** `watch-party-canvas.html` — **內部**用、可縮放的 24 狀態地圖（主持人＋來賓兩列）；非消費者頁面 — 供 review/交接。

## Realtime（整合註記）
同步、**非**串流 — 每位粉絲各播一份自己的影片副本；**Ably** 僅廣播狀態。三個 channel：
- `playback-sync` — 主持人位置 / play / pause / seek（主持人為權威；後加入者經 **sync** 狀態追上）
- `chat` — 房內即時聊天（lobby ＋ live）
- `presence` — 線上人數＋來賓名單（驅動 host-away 偵測與踢除名單）

FE 原型為 **mock**；請將上述標為建置時的 realtime 整合點。主持人鏡頭 PiP（v3）為獨立 Amazon IVS 廣播，不在此 FE 原型範圍。

## Not Included（不包含）
- **手機版**（`mobile-watch-party*.html`）— 桌機已上線；手機待辦。
- **營運端控制** — 誰能主持、內容授權、容量預設、即時監控、分析、退款 → **後台**（`watch-party/BO`）。
- **付款 / 退款** 內部機制 — 購買沿用平台既有 Order/付款規則（冪等性為 FE 可見；帳務不在此重新定義）。
- **回放 / VOD** — 派對結束後無回放（設計如此）。
- **分潤 / 抽成** 計算 — 延後（Owner：Susan / Finance）；統計現已追蹤，v1 不計算分潤。
- **聊天真實留存** — v1 聊天僅即時（Ably），不儲存。
