# Ztor eShop — Feature Scope (editable)

*2026-06-26 · source: `Ztor功能点.md` + Phase 1 handoff · IDs match the scope-map HTML.*
*Build reconciliation added 2026-06-29 — scope tags checked against the two code prototypes.*

Edit the value in **back-ticks** at the start of each feature line. Three scope values only:

- `p1`  — **Phase 1** (build now, internal)
- `next` — **follow-up** features (planned later phase)
- `tbd`  — **to be determined** (business team decides)

**Build markers** (appended to each line — reflect the prototypes, not the backend):

- ✅ **built** — UI present & reasonably complete in the prototype
- 🟡 **partial** — present but incomplete / stubbed / missing a sub-part  → *the real work*
- ❌ **missing** — not found
- ✅⬆ **built-ahead** — UI exists even though the scope tag defers it (free optionality; static UI only, no backend)
- ⏳ **deferred** — correctly absent, matches a `next`/`tbd` tag

> Prototypes reviewed: **operator side (S/O/E)** = `ztor20/Creator-Studio` → `ztor-creator-studio/r2.1/`. **Buyer side (B)** = `ztor20/Frontend` branch **L**. "Built" = static UI only — none of it is wired to a backend yet.

---

## ⚑ Build Reconciliation — what's actually left for Phase 1

**Bottom line:** of the Phase-1 (`p1`) surface, only **4 features are not fully built**. Everything else tagged `p1` is built in the prototypes. The build has even run *ahead* of scope into `next`/`tbd` territory (auctions, the full Earnings waterfall, cross-revenue tabs, tax docs) — but that's static UI without a backend.

### 🟡 The real Phase-1 gaps (the dev to-do)

| ID | Feature | Gap |
|---|---|---|
| **S30** | POPCORN price (create product) | Standard price/original/cost built — but the **POPCORN price field is missing**. POPCORN markup exists only as a `design-system.html` demo, not in `create-product.html`. |
| **B06** | Pay by POPCORN (checkout) | POPCORN can buy/rent **content** today, but is **not a tender in the goods checkout** (`checkout.js`/`mock-pay.js` offer only card / express). |
| **B09** | Pickup QR (goods) | A static QR is built — but bound to **event tickets** only. Goods orders that choose on-site pickup get **no QR**; goods checkout models courier delivery only. |
| **S13** | Product-list sort | No user-facing sort control. Only drag-to-reorder (fan-display ordering, D083), which isn't a list sort. |

> ⭐ **#1 priority — POPCORN as eShop currency.** S30 (operator sets a POPCORN price) and B06 (buyer pays in POPCORN) are the **same flagship net-new capability**, and it's the single biggest unbuilt `p1` piece. Build them together.

### ✅⬆ Built ahead of scope (UI already exists — pull into P1 only if business wants it)

Static UI is done for these despite being tagged `next`/`tbd`. **Tags kept as-is** — the deferral reflects backend/policy readiness, not UI effort:

- **Auctions** (`tbd` S11) — full `create-auction.html` + `auction-detail.html` + buyer bid flow already built.
- **Earnings cross-revenue tabs** (`tbd` E13–E17: e-tickets, IP royalty, licensing, streaming, project support) — all rendered as filter chips + rows.
- **Revenue waterfall** (`tbd` E22) — full gross→net waterfall UI exists, *but the platform-cut policy is still undecided* — keep `tbd`.
- **Tax documents** (`tbd` E24), **payout / charts / manual-entry** (`next` E08/E09/E20/E23), **referenced-by-project** (`tbd` S24), **bundle quantity limit** (`tbd` S45), **refund KPI/filter** (`tbd` O04/O09), **view fan record** (`next` O17), **digital download** (`next` O22) — all built.

### 📝 Note fixes from the review

- **B02 PDP** — old note "net-new — designer proto has none" is **stale**. A full param-driven PDP is built on Frontend/L (`shop-item.html` + `shop-detail-render.js`). Now **✅ built**.
- **O18 / O23 refunds** — present in the operator UI but intentionally **disabled stubs** (decision D041, "later release") — consistent with `tbd`/`next`.

### 🧩 Un-tracked modules built in the Creator Studio prototype (outside this eShop list)

Fans CRM (`fans-crm.html`/`tier-settings.html`), IP Bank (`ip-market`/`my-ip`/`register-ip`), Projects/Crowdfunding (`projects`/`create-project`), Events + ticketing, and the admin/creators surfaces all exist — relevant context for cross-module dependencies (e.g. S24 references projects; O17 references Fans CRM).

---


## S · 商店管理 Shop Management

- **通用功能** Common
  - `p1` **S01** 顶部库存预警提示条 · Low-stock alert bar ✅
  - `p1` **S02** 筛选 · Filter ✅
  - `p1` **S03** 商店设置 · Store settings ✅
    - `p1` **S04** 编辑封面 / 头像 / 名称 / 链接 / 描述 / 币种 · Edit cover/avatar/name/URL/desc/currency ✅
    - `next` **S05** 付款设置 · Payment settings — _Stripe status read-only; details TBD_ ✅ _(read-only, as spec'd)_
    - `next` **S06** 出货设置（出货地址、免运门槛） · Shipping defaults (address, free-ship threshold) — _config fields only — no carrier integration_ ✅
    - `p1` **S07** 粉丝预览视角 · See-as-fan preview ✅
  - `p1` **S08** 商店预览页面 · Store preview ✅
  - **创建 商品 / 组合 / 拍卖** Create product / bundle / auction
    - `p1` **S09** 创建商品（入口） · Create product entry ✅
    - `p1` **S10** 创建组合（入口） · Create bundle entry ✅
    - `tbd` **S11** 创建拍卖（入口） · Create auction entry — _auctions deferred_ ✅⬆ _full auction build exists_
- **商品** Products
  - `p1` **S12** 商品列表 · Product list ✅
    - `p1` **S13** 排序 · Sort 🟡 _no sort control — drag-reorder only (fan-display, not list sort)_
    - `p1` **S14** 字段（图片/名称/分类/价格/状态/库存） · Columns ✅
    - **状态** Statuses
      - `p1` **S15** 已上架（上架开关、编辑） · Live (toggle, edit) ✅
      - `p1` **S16** 已隐藏 · Hidden ✅
      - `p1` **S17** 库存过低 · Low stock ✅
      - `p1` **S18** 补货流程（数量/供应商/到货日/备注/确认） · Restock flow ✅
      - `p1` **S19** 已售完 · Sold out — _status shown; exact UI TBD_ ✅
      - `p1` **S20** 草稿 · Draft ✅
    - `p1` **S21** 商品详情 / 编辑 · Product detail / edit ✅
      - `p1` **S22** 显示状态 / 分类 · Show status/category ✅
      - `p1` **S23** 销售摘要（件数/毛收/净利 → 收入管理） · Sales summary — _reads from Earnings minimum_ ✅
      - `tbd` **S24** 被专案引用（引用列表 / 前往专案） · Referenced by project — _needs project/crowdfund module_ ✅⬆
      - `p1` **S25** 以粉丝身份预览 · See-as-fan preview ✅
  - `p1` **S26** 创建商品 · Create product ✅
    - `p1` **S27** 展示图（主图 / 副图） · Media (main/sub) ✅
    - `p1` **S28** 商品资讯（名称/描述/分类/规格） · Info ✅
    - `p1` **S29** 商品规格（单一 / 多规格） · Variants (single/multi) ✅
    - `p1` **S30** 定价（价格 / 原价 + 爆米花价） · Pricing + POPCORN price — _POPCORN price is net-new_ 🟡 _standard pricing built; **POPCORN price field missing**_
    - `p1` **S31** 库存（不限量 / 限量 + 低库存提醒） · Inventory ✅
    - `p1` **S32** 多规格价格与库存（SKU / 成本） · Variant matrix (SKU/cost) ✅
    - **取货方式** Fulfillment method
      - `p1` **S33** 物流配送（重量/分类/尺寸/寄件地） · Logistics fields — _data entry only — no carrier API_ ✅
      - `p1` **S34** 现场 QR 领取（领取说明） · On-site QR pickup ✅
    - `p1` **S35** 购买限制与标签（每人限购 / 标签） · Purchase limit & tags ✅
    - `p1` **S36** 预览 / 上架开卖 · Preview & publish ✅
    - `p1` **S37** 稍后再存（草稿） · Save draft ✅
    - `p1` **S38** 开始售卖 · Start selling ✅
      - `p1` **S39** 发布贴文（标题/内容/收件对象/排程） · Product-drop social post ✅ _(reuses Ztor's existing social-post feature — no new build)_
- **组合** Bundles
  - `p1` **S40** 组合包列表（字段 / 状态） · Bundle list ✅
  - `p1` **S41** 创建组合包 · Create bundle ✅
    - `p1` **S42** 组合包名称 · Name ✅
    - `p1` **S43** 商品（新增 / 近期预览） · Items ✅
    - `p1` **S44** 定价（固定价 / 折扣价） · Pricing (fixed/% off) ✅
    - `tbd` **S45** 限量 · Quantity limit ✅⬆ _built as limited-edition hard cap_
    - `p1` **S46** 发布贴文 · Publish post ✅ _(reuses Ztor's existing social-post feature)_
  - `p1` **S47** 组合包详情 / 编辑 · Bundle detail / edit ✅
    - `p1` **S48** 销售摘要 · Sales summary — _reads from Earnings_ ✅
    - `p1` **S49** 库存与成员影响（= 最少成员） · Stock = min(member) ✅
    - `p1` **S50** 以粉丝身份预览 · See-as-fan preview ✅

## O · 订单管理 Order Management

- `p1` **O01** 数据统计 · KPI stats ✅
  - `p1` **O02** 待出货 · To ship ✅
  - `p1` **O03** 待处理 · Pending ✅
  - `tbd` **O04** 退款 / 争议 · Refund / dispute — _refunds deferred_ ✅⬆ _KPI shown_
  - `p1` **O05** 已完成 · 30天 · Completed · 30d ✅
- `p1` **O06** 汇出 · Export ✅
- `p1` **O07** 搜索订单 · Search orders ✅
- **状态栏** Status filter
  - `p1` **O08** 全部 / 代付款 / 已付款 / 待出货 / 已出货 / 已完成 · All → Completed ✅
  - `tbd` **O09** 退款 / 争议 · Refund / dispute ✅⬆ _filter tab shown_
- `p1` **O10** 订单列表字段 · Order list fields ✅
- `p1` **O11** 订单详情 · Order detail ✅
  - **内容** Content
    - `p1` **O12** 状态 / 收入结算 · Status / settlement ✅
    - `p1` **O13** 订单商品列表 · Line items ✅
    - `p1` **O14** 金额（商品 / 运费 / 平台费 / 支付费 / 净额） · Amounts incl. platform fee ✅
    - `p1` **O15** 在收入管理查看 · View in Earnings — _link to Earnings minimum_ ✅
    - `p1` **O16** 买家信息（名称 / 地址 / 联系方式） · Buyer info ✅
    - `next` **O17** 查看粉丝记录 · View fan record — _Fans CRM module out of scope_ ✅⬆ _links to fans-crm_
  - **功能** Actions
    - `tbd` **O18** 退款 · Refund — _no in-system refunds in Phase 1_ 🟡 _button present but disabled (D041)_
    - `p1` **O19** 标记出货 / 履约 · Mark shipped / fulfillment ✅
      - `p1` **O20** 物流配送（物流商 / 追踪码 / 标记出货） · Logistics (manual) — _manual entry — no carrier API_ ✅
      - `p1` **O21** QR 领取（二维码 / 标记已领取） · QR pickup ✅
      - `next` **O22** 数位（下载） · Digital download — _digital goods deferred_ ✅⬆
    - `next` **O23** 退款与争议（部分 / 整单退款） · Refund & dispute 🟡 _buttons present but disabled (D041)_

## E · 收入管理 Earnings / Income

- `p1` **E01** 数据统计 · KPI stats — _minimal slice only_ ✅
  - `p1` **E02** 总输入 · Gross ✅
  - `p1` **E03** 净利（→ 收益拆分） · Net (→ breakdown) — _net p1; waterfall later_ ✅
  - `p1` **E04** 待结算 · Pending settlement ✅
  - `p1` **E05** 可提领 · Available — _display p1; payout later_ ✅
- `p1` **E06** 筛选（本月 / 季 / 年） · Filter (month/qtr/year) ✅
- `p1` **E07** 汇出 · Export ✅
- `next` **E08** 申请提款 · Request payout — _payout mechanics deferred_ ✅⬆ _UI built; backend deferred_
- **栏目** Tabs
  - `next` **E09** 总览（趋势图 / 近期交易 / 来源分布） · Overview — _charts deferred_ ✅⬆ _charts built_
  - `p1` **E10** 交易明细 · Transactions ✅
    - `p1` **E11** 全部（字段 + 展开详情） · All (fields + expand) ✅
    - `p1` **E12** 电子商店 · E-Shop tab ✅
    - `tbd` **E13** 电子票券 · E-Tickets ✅⬆
    - `tbd` **E14** IP 版税 · IP royalty ✅⬆
    - `tbd` **E15** 授权 · Licensing ✅⬆
    - `tbd` **E16** 平台 / 串流版税 · Streaming royalty ✅⬆
    - `tbd` **E17** 专案支持 · Project support ✅⬆
    - `next` **E18** 提款与退款 · Payout & refund ✅⬆
    - `p1` **E19** 载入更多 · Load more ✅
    - `next` **E20** 手动补登 · Manual entry ✅⬆
    - `p1` **E21** 汇出 CSV · Export CSV ✅
  - `tbd` **E22** 收益拆解（瀑布图 / 依专案 · Ztor抽成·创作者·EFT） · Revenue breakdown waterfall — _'Follow the Money' split — UI built, but **platform-cut policy still undecided** → keep tbd_ ✅⬆
  - `next` **E23** 提款 · Payout ✅⬆ _bank cards + request flow built_
  - `tbd` **E24** 税务文件 · Tax documents ✅⬆ _7-jurisdiction tax tab built_

## B · 买家店面（Ztor eShop） Buyer Storefront  _(from Phase 1 handoff (not in 功能点.md))_

- `p1` **B01** 创作者商店页 · Creator shop page ✅
- `p1` **B02** 商品详情页 (PDP) · Product detail page — _built on Frontend/L (shop-item.html + shop-detail-render.js)_ ✅ _(was wrongly noted "designer proto has none")_
- `p1` **B03** 购物车 · Cart ✅
- `p1` **B04** 结帐 · Checkout ✅ _(drawer stepper, not a standalone page)_
  - `p1` **B05** Apple Pay / 信用卡 (Stripe) · Apple Pay / card ✅ _(mock; express Pay buttons disabled, card path live)_
  - `p1` **B06** 爆米花付款 (Pay by POPCORN) · Pay by POPCORN — _net-new payment option_ 🟡 _POPCORN buys content only; **not a tender in goods checkout**_
  - `tbd` **B07** 货到付款 (COD) · Cash on delivery — _removed from Phase 1_ ⏳ _(vestigial in legacy cart only)_
- `p1` **B08** 订单确认 · Order confirmation ✅
- `p1` **B09** 取货 QR（email + 订单详情，静态） · Pickup QR (static, email + order) 🟡 _QR built for event tickets; **not wired to goods pickup orders**_
- `next` **B10** 公开探索栏（/shops、首页商品栏） · Public discovery rails — _internal-only Phase 1 — no public discovery_ ⏳

---

*Scope totals — `p1`: 82 · `next`: 11 · `tbd`: 14 · total 107 features. (updated 2026-06-29)*

*By section — S Shop: p1 45 / next 2 / tbd 3 · O Orders: p1 17 / next 3 / tbd 3 · E Earnings: p1 12 / next 5 / tbd 7 · B Storefront: p1 8 / next 1 / tbd 1.*

*Build status (2026-06-29) — Phase-1 gaps remaining: **4** (🟡 S13 sort · S30 POPCORN price · B06 pay-by-POPCORN · B09 goods pickup QR). All other `p1` features built. ~20 `next`/`tbd` features built ahead of scope (static UI, no backend).*
