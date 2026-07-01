// Ztor 2.0 — 爆米花兌換商城 mock data
// schema: { id, name, cat, pop, note, tile }
// tile: 1-6 = styled gradient voucher tile; null = photo item (picsum seed = id)
window.ZTOR_SHOP = window.ZTOR_SHOP || {};
ZTOR_SHOP.popcornItems = [

  // ── 超市禮券 ──────────────────────────────────────────────
  { id: "parknshop-hk50", name: "百佳 PARKnSHOP 電子購物禮券 HK$50", cat: "超市禮券", pop: 2600, note: "兌換後即時發送電子券至帳戶", tile: 1 },
  { id: "parknshop-hk100", name: "百佳 PARKnSHOP 電子購物禮券 HK$100", cat: "超市禮券", pop: 5200, note: "兌換後即時發送電子券至帳戶", tile: 1 },
  { id: "parknshop-hk500", name: "百佳 PARKnSHOP 電子購物禮券 HK$500", cat: "超市禮券", pop: 26000, note: "兌換後 3 個工作天內發送電子券", tile: 1 },
  { id: "citysuper-hk100", name: "city'super 購物禮券 HK$100", cat: "超市禮券", pop: 5200, note: "兌換後 7 個工作天內寄送電子券", tile: 2 },
  { id: "citysuper-hk500", name: "city'super 購物禮券 HK$500", cat: "超市禮券", pop: 26000, note: "兌換後 7 個工作天內寄送電子券,每帳戶每月限兌 2 份", tile: 2 },
  { id: "pxmart-nt100", name: "全聯福利中心禮物卡 NT$100", cat: "超市禮券", pop: 1300, note: "兌換後即時發送至帳戶", tile: 3 },
  { id: "pxmart-nt500", name: "全聯福利中心禮物卡 NT$500", cat: "超市禮券", pop: 6500, note: "兌換後即時發送至帳戶", tile: 3 },
  { id: "pxmart-nt1000", name: "全聯福利中心禮物卡 NT$1,000", cat: "超市禮券", pop: 13000, note: "兌換後 3 個工作天內發送至帳戶", tile: 3 },
  { id: "costco-nt1000", name: "好市多 Costco 禮品卡 NT$1,000", cat: "超市禮券", pop: 13000, note: "兌換後 7 個工作天內掛號寄出實體卡,使用時需出示會員卡", tile: 4 },
  { id: "watsons-hk50", name: "屈臣氏電子現金券 HK$50", cat: "超市禮券", pop: 2600, note: "兌換後即時發送至帳戶", tile: 5 },
  { id: "watsons-hk100", name: "屈臣氏電子現金券 HK$100", cat: "超市禮券", pop: 5200, note: "兌換後即時發送至帳戶", tile: 5 },
  { id: "wellcome-tw-nt500", name: "頂好超市禮券 NT$500", cat: "超市禮券", pop: 6500, note: "兌換後 5 個工作天內發送電子券", tile: 6 },
  { id: "carrefour-nt500", name: "家樂福禮物卡 NT$500", cat: "超市禮券", pop: 6500, note: "兌換後 5 個工作天內發送電子券", tile: 2 },
  { id: "yata-hk100", name: "一田百貨購物禮券 HK$100", cat: "超市禮券", pop: 5200, note: "兌換後 7 個工作天內寄送電子券", tile: 4 },

  // ── 里數與點數 ────────────────────────────────────────────
  { id: "asia-miles-500", name: "亞洲萬里通 Asia Miles 500 里", cat: "里數與點數", pop: 3000, note: "兌換後 5 個工作天內存入,需綁定會員號碼", tile: 1 },
  { id: "asia-miles-1000", name: "亞洲萬里通 Asia Miles 1,000 里", cat: "里數與點數", pop: 5800, note: "兌換後 5 個工作天內存入,需綁定會員號碼", tile: 1 },
  { id: "asia-miles-5000", name: "亞洲萬里通 Asia Miles 5,000 里", cat: "里數與點數", pop: 28000, note: "兌換後 5 個工作天內存入,每帳戶每月限兌 1 次", tile: 1 },
  { id: "eva-infinity-1000", name: "長榮航空 Infinity MileageLands 1,000 哩", cat: "里數與點數", pop: 6000, note: "兌換後 7 個工作天內存入哩程帳戶", tile: 2 },
  { id: "eva-infinity-5000", name: "長榮航空 Infinity MileageLands 5,000 哩", cat: "里數與點數", pop: 29000, note: "兌換後 7 個工作天內存入,每帳戶每月限兌 1 次", tile: 2 },
  { id: "china-airlines-dm-1000", name: "中華航空華夏哩程 1,000 哩", cat: "里數與點數", pop: 6000, note: "兌換後 7 個工作天內存入哩程帳戶", tile: 3 },
  { id: "china-airlines-dm-5000", name: "中華航空華夏哩程 5,000 哩", cat: "里數與點數", pop: 29000, note: "兌換後 7 個工作天內存入,每帳戶每月限兌 1 次", tile: 3 },
  { id: "starlux-cosmile-1000", name: "星宇航空 COSMILE 1,000 哩", cat: "里數與點數", pop: 6200, note: "兌換後 7 個工作天內存入,需提供會員編號", tile: 4 },
  { id: "starlux-cosmile-5000", name: "星宇航空 COSMILE 5,000 哩", cat: "里數與點數", pop: 30000, note: "兌換後 7 個工作天內存入,每帳戶每月限兌 1 次", tile: 4 },
  { id: "line-points-100", name: "LINE POINTS 100 點", cat: "里數與點數", pop: 1300, note: "兌換後即時發送序號至帳戶", tile: 5 },
  { id: "openpoint-1000", name: "OPENPOINT 1,000 點", cat: "里數與點數", pop: 3900, note: "兌換後即時存入 OPENPOINT 帳戶", tile: 5 },
  { id: "yuu-points-1000", name: "yuu 積分 1,000 分", cat: "里數與點數", pop: 260, note: "兌換後即時存入 yuu 帳戶", tile: 6 },

  // ── 便利商店 ──────────────────────────────────────────────
  { id: "seven-eleven-nt100", name: "7-ELEVEN 商品卡 NT$100", cat: "便利商店", pop: 1300, note: "兌換後即時發送至帳戶", tile: 1 },
  { id: "seven-eleven-nt500", name: "7-ELEVEN 商品卡 NT$500", cat: "便利商店", pop: 6500, note: "兌換後即時發送至帳戶", tile: 1 },
  { id: "familymart-nt100", name: "全家 FamilyMart 商品卡 NT$100", cat: "便利商店", pop: 1300, note: "兌換後即時發送至帳戶", tile: 2 },
  { id: "familymart-nt500", name: "全家 FamilyMart 商品卡 NT$500", cat: "便利商店", pop: 6500, note: "兌換後即時發送至帳戶", tile: 2 },
  { id: "circlek-hk50", name: "OK 便利店現金券 HK$50", cat: "便利商店", pop: 2600, note: "兌換後 3 個工作天內發送電子券", tile: 3 },
  { id: "seven-eleven-hk50", name: "7-ELEVEN 香港現金券 HK$50", cat: "便利商店", pop: 2600, note: "兌換後 3 個工作天內發送電子券", tile: 4 },
  { id: "hilife-nt100", name: "萊爾富 Hi-Life 商品卡 NT$100", cat: "便利商店", pop: 1300, note: "兌換後即時發送至帳戶", tile: 5 },
  { id: "okmart-nt100", name: "OK mart 商品卡 NT$100", cat: "便利商店", pop: 1300, note: "兌換後即時發送至帳戶", tile: 6 },
  { id: "lets-cafe-latte", name: "全家 Let's Cafe 中杯拿鐵兌換券", cat: "便利商店", pop: 700, note: "兌換後即時發送條碼,效期 30 天", tile: 3 },
  { id: "city-cafe-latte", name: "7-ELEVEN CITY CAFE 中杯拿鐵兌換券", cat: "便利商店", pop: 700, note: "兌換後即時發送條碼,效期 30 天", tile: 4 },

  // ── 電影紀念品 ────────────────────────────────────────────
  { id: "ztor-program-book", name: "限量典藏場刊(燙金編號版)", cat: "電影紀念品", pop: 1800, note: "限量 300 份,兌換後 14 個工作天內掛號寄出", tile: null },
  { id: "ztor-original-poster", name: "原版電影海報(雙聯張)", cat: "電影紀念品", pop: 2200, note: "限量 500 份,兌換後 14 個工作天內捲筒寄出", tile: null },
  { id: "ztor-polaroid-stills", name: "拍立得劇照組(一套 6 張)", cat: "電影紀念品", pop: 2800, note: "限量 200 份,兌換後 14 個工作天內掛號寄出", tile: null },
  { id: "ztor-popcorn-bucket", name: "紀念爆米花桶(午夜場限定色)", cat: "電影紀念品", pop: 3600, note: "限量 500 份,兌換後 21 個工作天內寄出", tile: null },
  { id: "ztor-pin-set", name: "角色琺瑯徽章組(一套 4 枚)", cat: "電影紀念品", pop: 1500, note: "兌換後 14 個工作天內寄出", tile: null },
  { id: "ztor-film-cell-frame", name: "35mm 原片格紀念框", cat: "電影紀念品", pop: 4800, note: "限量 120 份,每帳戶限兌 1 份", tile: null },
  { id: "ztor-tote-bag", name: "片名標準字帆布袋", cat: "電影紀念品", pop: 1600, note: "兌換後 14 個工作天內寄出", tile: null },
  { id: "ztor-clapperboard", name: "場記板複製品(片場同款)", cat: "電影紀念品", pop: 5200, note: "限量 150 份,兌換後 21 個工作天內寄出", tile: null },
  { id: "ztor-signed-script", name: "導演親簽劇本複製本", cat: "電影紀念品", pop: 12000, note: "限量 50 份,每帳戶限兌 1 份", tile: null },
  { id: "ztor-acrylic-standee", name: "劇照壓克力立牌", cat: "電影紀念品", pop: 1300, note: "兌換後 14 個工作天內寄出", tile: null },
  { id: "ztor-postcard-set", name: "劇照明信片組(一套 12 張)", cat: "電影紀念品", pop: 800, note: "兌換後 14 個工作天內寄出", tile: null },
  { id: "ztor-keychain", name: "金屬片盤鑰匙圈", cat: "電影紀念品", pop: 900, note: "兌換後 14 個工作天內寄出", tile: null },
  { id: "ztor-crew-cap", name: "劇組同款棒球帽", cat: "電影紀念品", pop: 2600, note: "限量 300 份,兌換後 14 個工作天內寄出", tile: null },
  { id: "ztor-crew-tee", name: "劇組工作 T 恤(黑)", cat: "電影紀念品", pop: 3200, note: "兌換後 14 個工作天內寄出,請於備註填寫尺寸", tile: null },

  // ── 戲票與體驗 ────────────────────────────────────────────
  { id: "movie-exchange-voucher", name: "電影交換券(2D 正價座位)", cat: "戲票與體驗", pop: 4400, note: "兌換後即時發送至帳戶,效期 90 天", tile: 5 },
  { id: "imax-upgrade-voucher", name: "IMAX 廳升級券", cat: "戲票與體驗", pop: 1600, note: "需搭配電影交換券使用,效期 90 天", tile: 6 },
  { id: "premiere-lottery-entry", name: "首映禮抽選資格(一次)", cat: "戲票與體驗", pop: 880, note: "限量 1,000 個名額,結果於首映前 7 天公布", tile: null },
  { id: "set-visit-experience", name: "劇組探班體驗(半日)", cat: "戲票與體驗", pop: 58000, note: "限量 4 名,含市區接駁,需簽署保密協議", tile: null },
  { id: "private-screening-30", name: "包場放映體驗(30 個座位)", cat: "戲票與體驗", pop: 52000, note: "兌換後由專人聯繫安排場次,限平日", tile: null },
  { id: "qa-priority-seat", name: "映後座談優先入場券", cat: "戲票與體驗", pop: 2600, note: "限量 80 份,限指定場次使用", tile: null },
  { id: "midnight-double-feature", name: "午夜雙片連映套票(兩人座)", cat: "戲票與體驗", pop: 6800, note: "限定場次,兌換後即時發送電子票", tile: null }
];
