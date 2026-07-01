// Ztor 2.0 shop mock data — creators batch B
// Appends to ZTOR_SHOP.creators (never overwrites batch A)
window.ZTOR_SHOP = window.ZTOR_SHOP || {};
ZTOR_SHOP.creators = (ZTOR_SHOP.creators || []).concat([
  {
    slug: "eric-chou",
    name: "周興哲",
    role: "歌手",
    region: "TW",
    tagline: "把每一次心碎，都唱成永不失聯的愛。",
    followers: "385 萬",
    bio: "2014年以《以後別做朋友》一鳴驚人，寫下新世代情歌的定義。從《學著愛》到《Odyssey 旅程》巡迴，他以鋼琴與真摯嗓音陪伴無數人走過告別與重逢，被樂迷暱稱為「情歌王子」。",
    topFans: [
      { rank: 1, nick: "永不失聯的守護者", seed: "eric-chou-fan-keeper" },
      { rank: 2, nick: "怎麼了都在的人", seed: "eric-chou-fan-always" },
      { rank: 3, nick: "以後別做朋友做家人", seed: "eric-chou-fan-family" },
      { rank: 4, nick: "你好不好巡迴隊長", seed: "eric-chou-fan-captain" },
      { rank: 5, nick: "雨之後的彩虹", seed: "eric-chou-fan-rainbow" },
      { rank: 6, nick: "終曲循環十年", seed: "eric-chou-fan-loop" },
      { rank: 7, nick: "學著愛的好學生", seed: "eric-chou-fan-student" },
      { rank: 8, nick: "鋼琴前排常客", seed: "eric-chou-fan-piano" }
    ],
    events: [
      { title: "《Odyssey 旅程》新專輯簽售會", type: "簽售會", date: "2026-08-15", venue: "誠品生活松菸店 3F Forum" },
      { title: "永不失聯的愛 夏末見面會", type: "見面會", date: "2026-09-26", venue: "Legacy TERA 台北" },
      { title: "巡迴紀錄片《終曲之後》線上首映", type: "線上首映", date: "2026-11-07", venue: "Ztor 線上放映廳" }
    ],
    products: [
      { id: "eric-chou-odyssey-vinyl", name: "《Odyssey 旅程》黑膠專輯", ntd: 1680, hkd: null, badge: "新品", soldOut: false },
      { id: "eric-chou-tour-tee-black", name: "旅程巡演限定T恤（午夜黑）", ntd: 880, hkd: null, badge: "限量", soldOut: true },
      { id: "eric-chou-lyrics-poster-set", name: "手寫歌詞海報三入組", ntd: 580, hkd: null, badge: null, soldOut: false },
      { id: "eric-chou-piano-scorebook", name: "鋼琴彈唱譜精裝本", ntd: 720, hkd: null, badge: null, soldOut: false },
      { id: "eric-chou-signed-cd", name: "《永不失聯的愛》親簽CD", ntd: 1280, hkd: null, badge: "限量", soldOut: true },
      { id: "eric-chou-hoodie-grey", name: "終曲連帽帽T（霧灰）", ntd: 1580, hkd: null, badge: null, soldOut: false },
      { id: "eric-chou-canvas-tote", name: "旅程帆布托特包", ntd: 480, hkd: null, badge: null, soldOut: false },
      { id: "eric-chou-mug-duo", name: "你，好不好 對杯組", ntd: 680, hkd: null, badge: null, soldOut: false },
      { id: "eric-chou-light-stick", name: "永不失聯應援燈", ntd: 980, hkd: null, badge: "新品", soldOut: false },
      { id: "eric-chou-bracelet", name: "巡演紀念手環", ntd: 320, hkd: null, badge: null, soldOut: false },
      { id: "eric-chou-photobook", name: "巡迴寫真集《在路上》", ntd: 1180, hkd: null, badge: null, soldOut: false },
      { id: "eric-chou-postcard-set", name: "城市巡迴明信片十入組", ntd: 280, hkd: null, badge: null, soldOut: false },
      { id: "eric-chou-keychain", name: "鋼琴造型鑰匙圈", ntd: 350, hkd: null, badge: null, soldOut: false },
      { id: "eric-chou-phone-strap", name: "手機掛繩（旅程藍）", ntd: 420, hkd: null, badge: null, soldOut: false },
      { id: "eric-chou-candle", name: "雨之後香氛蠟燭", ntd: 880, hkd: null, badge: null, soldOut: false },
      { id: "eric-chou-umbrella", name: "終曲摺疊傘", ntd: 650, hkd: null, badge: null, soldOut: false },
      { id: "eric-chou-sticker-pack", name: "歌詞貼紙包", ntd: 180, hkd: null, badge: null, soldOut: false },
      { id: "eric-chou-cap", name: "旅程刺繡棒球帽", ntd: 780, hkd: null, badge: null, soldOut: false },
      { id: "eric-chou-fan-bundle", name: "永不失聯歌迷套組（T恤＋應援燈＋海報）", ntd: 1980, hkd: null, badge: "Bundle", soldOut: false },
      { id: "eric-chou-tumbler", name: "旅程保溫隨行杯", ntd: 850, hkd: null, badge: null, soldOut: false }
    ]
  },
  {
    slug: "adia-chan",
    name: "陳松伶",
    role: "演員／歌手",
    region: "HK",
    tagline: "歲月帶不走的，是歌裡那一份從容。",
    followers: "98 萬",
    bio: "1988年出道，憑《天涯歌女》重現一代歌女風華而走紅，戲歌雙棲三十餘年。近年從音樂劇舞台到《乘風破浪》再度綻放，優雅與韌性兼備，是港劇黃金年代最溫柔的注腳。",
    topFans: [
      { rank: 1, nick: "天涯歌女守望者", seed: "adia-chan-fan-songstress" },
      { rank: 2, nick: "松松的小松果一號", seed: "adia-chan-fan-pinecone" },
      { rank: 3, nick: "把歌談心三十年", seed: "adia-chan-fan-heartsong" },
      { rank: 4, nick: "婚姻物語老觀眾", seed: "adia-chan-fan-classic" },
      { rank: 5, nick: "乘風破浪應援團長", seed: "adia-chan-fan-wave" },
      { rank: 6, nick: "戲曲中心常客", seed: "adia-chan-fan-theatre" },
      { rank: 7, nick: "黃金年代收藏家", seed: "adia-chan-fan-golden" },
      { rank: 8, nick: "優雅永不過時", seed: "adia-chan-fan-grace" }
    ],
    events: [
      { title: "《把歌談心》經典重唱簽售會", type: "簽售會", date: "2026-07-18", venue: "誠品銅鑼灣店 9F 論壇" },
      { title: "松松與你的午後茶敘見面會", type: "見面會", date: "2026-10-03", venue: "旺角麥花臣場館" },
      { title: "音樂劇《天涯．歌女》首映禮", type: "首映禮", date: "2026-12-12", venue: "西九文化區戲曲中心大劇院" }
    ],
    products: [
      { id: "adia-chan-classics-cd", name: "《把歌談心》經典重唱CD", ntd: 980, hkd: 240, badge: "新品", soldOut: false },
      { id: "adia-chan-vinyl-remaster", name: "天涯歌女黑膠復刻版", ntd: 1880, hkd: 460, badge: "限量", soldOut: true },
      { id: "adia-chan-musical-program", name: "音樂劇《天涯．歌女》紀念場刊", ntd: 680, hkd: 168, badge: null, soldOut: false },
      { id: "adia-chan-silk-scarf", name: "松松優雅絲巾（墨綠）", ntd: 1280, hkd: 320, badge: null, soldOut: false },
      { id: "adia-chan-teacup-set", name: "午後茶敘骨瓷對杯", ntd: 1580, hkd: 390, badge: null, soldOut: false },
      { id: "adia-chan-photo-essay", name: "寫真隨筆集《從容》", ntd: 1080, hkd: 268, badge: null, soldOut: false },
      { id: "adia-chan-signed-poster", name: "親筆簽名劇照海報", ntd: 880, hkd: 220, badge: "限量", soldOut: false },
      { id: "adia-chan-brooch", name: "山茶花胸針", ntd: 760, hkd: 188, badge: null, soldOut: false },
      { id: "adia-chan-tote-bag", name: "歌女帆布袋", ntd: 520, hkd: 128, badge: null, soldOut: false },
      { id: "adia-chan-postcards", name: "港劇黃金年代明信片組", ntd: 320, hkd: 80, badge: null, soldOut: false },
      { id: "adia-chan-calendar-2027", name: "2027 優雅月曆", ntd: 580, hkd: 145, badge: null, soldOut: false },
      { id: "adia-chan-candle", name: "白茶香氛蠟燭", ntd: 920, hkd: 228, badge: null, soldOut: false },
      { id: "adia-chan-notebook", name: "談心手帳本", ntd: 450, hkd: 112, badge: null, soldOut: false },
      { id: "adia-chan-umbrella", name: "復古長柄傘", ntd: 980, hkd: 245, badge: null, soldOut: false },
      { id: "adia-chan-tee-white", name: "見面會限定T恤（米白）", ntd: 780, hkd: 195, badge: "新品", soldOut: false },
      { id: "adia-chan-keyring", name: "復古麥克風鑰匙扣", ntd: 350, hkd: 88, badge: null, soldOut: false },
      { id: "adia-chan-shawl", name: "舞台披肩（酒紅）", ntd: 1680, hkd: 415, badge: null, soldOut: false },
      { id: "adia-chan-fan-bundle", name: "松果歌迷套組（CD＋場刊＋海報）", ntd: 2180, hkd: 540, badge: "Bundle", soldOut: false },
      { id: "adia-chan-mug", name: "歲月如歌馬克杯", ntd: 480, hkd: 120, badge: null, soldOut: false },
      { id: "adia-chan-puzzle", name: "經典劇照拼圖（1000片）", ntd: 880, hkd: 220, badge: null, soldOut: false }
    ]
  },
  {
    slug: "andy-lau",
    name: "劉德華",
    role: "演員／歌手",
    region: "HK",
    tagline: "今天的努力，是給明天最好的交代。",
    followers: "1200 萬",
    bio: "華語演藝圈最勤奮的天王，從《旺角卡門》到《無間道》《桃姐》，逾百部電影與《忘情水》等金曲跨越四十年。創辦華仔天地與映藝娛樂，以自律與謙遜成為幾代人心中的不老傳奇。",
    topFans: [
      { rank: 1, nick: "忘情水喝不膩", seed: "andy-lau-fan-water" },
      { rank: 2, nick: "暗裡著迷四十年", seed: "andy-lau-fan-devoted" },
      { rank: 3, nick: "永遠十七歲", seed: "andy-lau-fan-seventeen" },
      { rank: 4, nick: "笨小孩不笨", seed: "andy-lau-fan-kid" },
      { rank: 5, nick: "一起走過的日子", seed: "andy-lau-fan-days" },
      { rank: 6, nick: "無間道前排影迷", seed: "andy-lau-fan-infernal" },
      { rank: 7, nick: "華仔天地老會員", seed: "andy-lau-fan-member" },
      { rank: 8, nick: "天王勤奮見證人", seed: "andy-lau-fan-witness" }
    ],
    events: [
      { title: "電影《拆彈風暴》世界首映禮", type: "首映禮", date: "2026-08-20", venue: "香港文化中心大劇院" },
      { title: "華仔天地三十五週年會員見面會", type: "見面會", date: "2026-10-17", venue: "九龍灣國際展貿中心 Star Hall" },
      { title: "《忘情水》黑膠復刻簽售會", type: "簽售會", date: "2026-12-05", venue: "誠品尖沙咀星光行店" }
    ],
    products: [
      { id: "andy-lau-vinyl-forget-love", name: "《忘情水》黑膠復刻版", ntd: 1980, hkd: 490, badge: "限量", soldOut: true },
      { id: "andy-lau-tour-tee", name: "巡演限定T恤（經典黑）", ntd: 980, hkd: 245, badge: "新品", soldOut: false },
      { id: "andy-lau-film-photobook", name: "《無間道》劇照攝影集", ntd: 1480, hkd: 365, badge: null, soldOut: false },
      { id: "andy-lau-signed-bluray", name: "演唱會藍光（親筆簽名版）", ntd: 2280, hkd: 560, badge: "限量", soldOut: true },
      { id: "andy-lau-poster-trilogy", name: "經典電影海報復刻三聯組", ntd: 880, hkd: 220, badge: null, soldOut: false },
      { id: "andy-lau-cap", name: "17歲刺繡棒球帽", ntd: 780, hkd: 195, badge: null, soldOut: false },
      { id: "andy-lau-hoodie", name: "笨小孩連帽帽T", ntd: 1680, hkd: 415, badge: null, soldOut: false },
      { id: "andy-lau-leather-wallet", name: "天王皮革短夾", ntd: 1880, hkd: 465, badge: null, soldOut: false },
      { id: "andy-lau-light-stick", name: "演唱會應援燈", ntd: 980, hkd: 245, badge: null, soldOut: false },
      { id: "andy-lau-keychain", name: "電影場記板鑰匙圈", ntd: 380, hkd: 95, badge: null, soldOut: false },
      { id: "andy-lau-postcards", name: "四十年光影明信片組", ntd: 350, hkd: 88, badge: null, soldOut: false },
      { id: "andy-lau-mug", name: "一起走過的日子馬克杯", ntd: 520, hkd: 130, badge: null, soldOut: false },
      { id: "andy-lau-tote", name: "華仔天地帆布袋", ntd: 480, hkd: 120, badge: null, soldOut: false },
      { id: "andy-lau-cheer-towel", name: "應援毛巾（天王紅）", ntd: 420, hkd: 105, badge: null, soldOut: false },
      { id: "andy-lau-notebook", name: "勤奮語錄手帳", ntd: 450, hkd: 112, badge: null, soldOut: false },
      { id: "andy-lau-tee-anniversary", name: "華仔天地35週年紀念T", ntd: 880, hkd: 220, badge: "新品", soldOut: false },
      { id: "andy-lau-puzzle", name: "經典劇照拼圖（1000片）", ntd: 880, hkd: 220, badge: null, soldOut: false },
      { id: "andy-lau-fan-bundle", name: "天王歌迷套組（T恤＋應援燈＋毛巾）", ntd: 2080, hkd: 515, badge: "Bundle", soldOut: false },
      { id: "andy-lau-phone-case", name: "暗裡著迷手機殼", ntd: 680, hkd: 168, badge: null, soldOut: false },
      { id: "andy-lau-umbrella", name: "暗戰摺疊傘", ntd: 650, hkd: 160, badge: null, soldOut: false }
    ]
  },
  {
    slug: "jolin-tsai",
    name: "蔡依林",
    role: "歌手",
    region: "TW",
    tagline: "怪美的，才是妳本來的樣子。",
    followers: "620 萬",
    bio: "從《倒帶》《舞孃》到《Ugly Beauty》，她以「地才」精神不斷自我翻新，把流行樂推向藝術高度。《玫瑰少年》溫柔發聲擁抱多元，亞洲流行天后的位置，是她一步一步跳出來的。",
    topFans: [
      { rank: 1, nick: "玫瑰少年同行者", seed: "jolin-tsai-fan-rose" },
      { rank: 2, nick: "舞孃轉不停", seed: "jolin-tsai-fan-dancer" },
      { rank: 3, nick: "怪美首席研究員", seed: "jolin-tsai-fan-ugly-beauty" },
      { rank: 4, nick: "日不落追光者", seed: "jolin-tsai-fan-sun" },
      { rank: 5, nick: "倒帶一百遍", seed: "jolin-tsai-fan-rewind" },
      { rank: 6, nick: "地才精神信徒", seed: "jolin-tsai-fan-effort" },
      { rank: 7, nick: "呸姐第一呸友", seed: "jolin-tsai-fan-play" },
      { rank: 8, nick: "看我七十二變", seed: "jolin-tsai-fan-magic" }
    ],
    events: [
      { title: "《Pleasure 玩美》新輯簽售會", type: "簽售會", date: "2026-07-25", venue: "台北信義威秀中庭廣場" },
      { title: "Ugly Beauty Finale 巡演紀錄片線上首映", type: "線上首映", date: "2026-09-12", venue: "Ztor 線上放映廳" },
      { title: "怪美研究所歌迷見面會", type: "見面會", date: "2026-11-21", venue: "台北流行音樂中心表演廳" }
    ],
    products: [
      { id: "jolin-tsai-ugly-beauty-vinyl", name: "《Ugly Beauty》黑膠典藏版", ntd: 1880, hkd: null, badge: "限量", soldOut: true },
      { id: "jolin-tsai-pleasure-cd", name: "《Pleasure 玩美》新輯CD", ntd: 580, hkd: null, badge: "新品", soldOut: false },
      { id: "jolin-tsai-tour-tee", name: "巡演限定T恤（怪美紫）", ntd: 980, hkd: null, badge: null, soldOut: false },
      { id: "jolin-tsai-rose-necklace", name: "玫瑰少年純銀項鍊", ntd: 2280, hkd: null, badge: "限量", soldOut: true },
      { id: "jolin-tsai-photobook", name: "《怪美現場》巡演寫真集", ntd: 1280, hkd: null, badge: null, soldOut: false },
      { id: "jolin-tsai-yoga-mat", name: "地才精神瑜珈墊", ntd: 1480, hkd: null, badge: null, soldOut: false },
      { id: "jolin-tsai-light-stick", name: "怪美應援燈", ntd: 980, hkd: null, badge: "新品", soldOut: false },
      { id: "jolin-tsai-cap", name: "呸字刺繡棒球帽", ntd: 780, hkd: null, badge: null, soldOut: false },
      { id: "jolin-tsai-hoodie", name: "Ugly Beauty 連帽帽T", ntd: 1680, hkd: null, badge: null, soldOut: false },
      { id: "jolin-tsai-earrings", name: "舞孃流蘇耳環", ntd: 880, hkd: null, badge: null, soldOut: false },
      { id: "jolin-tsai-tote", name: "日不落帆布袋", ntd: 520, hkd: null, badge: null, soldOut: false },
      { id: "jolin-tsai-mirror", name: "怪美隨身摺疊鏡", ntd: 380, hkd: null, badge: null, soldOut: false },
      { id: "jolin-tsai-sticker-pack", name: "歌詞金句貼紙包", ntd: 180, hkd: null, badge: null, soldOut: false },
      { id: "jolin-tsai-postcards", name: "舞台造型明信片組", ntd: 320, hkd: null, badge: null, soldOut: false },
      { id: "jolin-tsai-tumbler", name: "倒帶保溫隨行杯", ntd: 850, hkd: null, badge: null, soldOut: false },
      { id: "jolin-tsai-scrunchie-set", name: "大髮髻髮圈三入組", ntd: 350, hkd: null, badge: null, soldOut: false },
      { id: "jolin-tsai-candle", name: "玫瑰香氛蠟燭", ntd: 880, hkd: null, badge: null, soldOut: false },
      { id: "jolin-tsai-fan-bundle", name: "怪美套組（T恤＋應援燈＋貼紙包）", ntd: 1980, hkd: null, badge: "Bundle", soldOut: false },
      { id: "jolin-tsai-phone-strap", name: "看我七十二變手機鍊", ntd: 420, hkd: null, badge: null, soldOut: false },
      { id: "jolin-tsai-baking-apron", name: "甜點烘焙圍裙", ntd: 680, hkd: null, badge: null, soldOut: false }
    ]
  }
]);
