// Ztor 2.0 Shop — mock data, creators batch C
// 楊丞琳 / 王家衛 / 魏德聖 / 蔡阿嘎
window.ZTOR_SHOP = window.ZTOR_SHOP || {};
ZTOR_SHOP.creators = (ZTOR_SHOP.creators || []).concat([
  {
    slug: "rainie-yang",
    name: "楊丞琳",
    role: "歌手／演員",
    region: "TW",
    tagline: "把每一場雨，都唱成愛的樣子。",
    followers: "412 萬",
    bio: "從偶像團體出道，以《惡魔在身邊》《海派甜心》成為一代偶像劇女王；轉身投入音樂，《雨愛》《年輪說》《青春住了誰》一路唱進世代心裡，是台灣流行文化最溫柔也最堅韌的聲音之一。",
    topFans: [
      { rank: 1, nick: "雨愛裡撐傘的人", seed: "rainie-rain-umbrella" },
      { rank: 2, nick: "曖昧受盡委屈代表", seed: "rainie-aimei-rep" },
      { rank: 3, nick: "年輪說的樹洞管理員", seed: "rainie-rings-keeper" },
      { rank: 4, nick: "等王子的青蛙飼育員", seed: "rainie-frog-keeper" },
      { rank: 5, nick: "海派甜心鐵粉一號", seed: "rainie-sweetheart-no1" },
      { rank: 6, nick: "青春住了誰的房客", seed: "rainie-youth-tenant" },
      { rank: 7, nick: "刪拾以後的整理師", seed: "rainie-declutter-master" },
      { rank: 8, nick: "惡魔身邊的小跟班", seed: "rainie-devil-sidekick" }
    ],
    events: [
      { title: "LIKE A STAR 安可場歌迷見面會", type: "見面會", date: "2026-08-15", venue: "台北流行音樂中心" },
      { title: "《刪拾 以後》黑膠復刻簽售會", type: "簽售會", date: "2026-09-26", venue: "誠品生活松菸店" },
      { title: "巡演紀錄片《雨後》線上首映", type: "線上首映", date: "2026-11-07", venue: "Ztor 線上放映廳" }
    ],
    products: [
      { id: "rainie-yang-vinyl-rain-love", name: "《雨愛》十五週年黑膠復刻版", ntd: 2280, hkd: null, badge: "限量", soldOut: false },
      { id: "rainie-yang-album-delete-reset", name: "《刪拾 以後》典藏CD", ntd: 880, hkd: null, badge: null, soldOut: false },
      { id: "rainie-yang-tour-tee-black", name: "LIKE A STAR 巡演限定T恤（黑）", ntd: 790, hkd: null, badge: null, soldOut: false },
      { id: "rainie-yang-tour-hoodie", name: "巡演限定連帽外套", ntd: 1480, hkd: null, badge: "新品", soldOut: false },
      { id: "rainie-yang-lyrics-poster-set", name: "經典歌詞海報三入組", ntd: 580, hkd: null, badge: "Bundle", soldOut: false },
      { id: "rainie-yang-photobook", name: "《青春住了誰》寫真歌詞本", ntd: 1280, hkd: null, badge: null, soldOut: false },
      { id: "rainie-yang-light-stick", name: "雨滴造型應援手燈", ntd: 980, hkd: null, badge: "限量", soldOut: true },
      { id: "rainie-yang-umbrella", name: "雨愛透明傘", ntd: 690, hkd: null, badge: null, soldOut: false },
      { id: "rainie-yang-tote-bag", name: "年輪說帆布托特包", ntd: 590, hkd: null, badge: null, soldOut: false },
      { id: "rainie-yang-frog-keyring", name: "青蛙王子壓克力鑰匙圈", ntd: 320, hkd: null, badge: null, soldOut: false },
      { id: "rainie-yang-postcard-set", name: "巡演劇照明信片組（12入）", ntd: 380, hkd: null, badge: null, soldOut: false },
      { id: "rainie-yang-cap", name: "RY 刺繡棒球帽", ntd: 780, hkd: null, badge: null, soldOut: false },
      { id: "rainie-yang-scrunchie-set", name: "曖昧緞面髮圈組", ntd: 350, hkd: null, badge: null, soldOut: false },
      { id: "rainie-yang-mug", name: "海派甜心陶瓷馬克杯", ntd: 450, hkd: null, badge: null, soldOut: false },
      { id: "rainie-yang-phone-case", name: "雨夜霧面手機殼", ntd: 590, hkd: null, badge: null, soldOut: false },
      { id: "rainie-yang-badge-set", name: "巡演徽章五入組", ntd: 420, hkd: null, badge: null, soldOut: false },
      { id: "rainie-yang-tour-tee-white", name: "LIKE A STAR 巡演限定T恤（白）", ntd: 790, hkd: null, badge: null, soldOut: false },
      { id: "rainie-yang-signed-poster", name: "親筆簽名海報（編號版）", ntd: 1680, hkd: null, badge: null, soldOut: true },
      { id: "rainie-yang-fan-bundle", name: "雨愛應援組合包（T恤＋手燈＋海報）", ntd: 2980, hkd: null, badge: "Bundle", soldOut: false },
      { id: "rainie-yang-sticker-pack", name: "歌詞手寫貼紙包", ntd: 220, hkd: null, badge: null, soldOut: false }
    ]
  },
  {
    slug: "wong-kar-wai",
    name: "王家衛",
    role: "導演",
    region: "HK",
    tagline: "世間所有的相遇，都是久別重逢。",
    followers: "286 萬",
    bio: "香港電影最重要的作者之一，《阿飛正傳》《重慶森林》《花樣年華》以光影與時間寫詩，曾獲坎城影展最佳導演。墨鏡之後，是對愛與錯過最纏綿的凝視，影響了整個世代的影像美學。",
    topFans: [
      { rank: 1, nick: "過期鳳梨罐頭收藏家", seed: "wkw-pineapple-collector" },
      { rank: 2, nick: "2046號房的常客", seed: "wkw-room-2046" },
      { rank: 3, nick: "無腳鳥飼育員", seed: "wkw-legless-bird" },
      { rank: 4, nick: "花樣年華旗袍裁縫", seed: "wkw-qipao-tailor" },
      { rank: 5, nick: "春光乍洩探戈舞伴", seed: "wkw-tango-partner" },
      { rank: 6, nick: "宮二的關門弟子", seed: "wkw-gongs-disciple" },
      { rank: 7, nick: "墮落天使夜班乘客", seed: "wkw-fallen-rider" },
      { rank: 8, nick: "醉生夢死釀酒師", seed: "wkw-dreamwine-brewer" }
    ],
    events: [
      { title: "《花樣年華》25週年修復版首映禮", type: "首映禮", date: "2026-07-18", venue: "香港文化中心大劇院" },
      { title: "光影對話・導演見面會", type: "見面會", date: "2026-09-12", venue: "百老匯電影中心" },
      { title: "《重慶森林》4K修復線上首映", type: "線上首映", date: "2026-10-24", venue: "Ztor 線上放映廳" }
    ],
    products: [
      { id: "wong-kar-wai-stills-photobook", name: "《花樣年華》4K修復劇照攝影集", ntd: 1880, hkd: 460, badge: "限量", soldOut: false },
      { id: "wong-kar-wai-storyboard-print", name: "《重慶森林》分鏡手稿複製畫", ntd: 1280, hkd: 320, badge: null, soldOut: false },
      { id: "wong-kar-wai-mood-bluray", name: "《花樣年華》25週年藍光珍藏版", ntd: 1580, hkd: 390, badge: null, soldOut: false },
      { id: "wong-kar-wai-2046-keyring", name: "2046 房號黃銅鑰匙圈", ntd: 480, hkd: 120, badge: null, soldOut: false },
      { id: "wong-kar-wai-pineapple-candle", name: "鳳梨罐頭造型香氛蠟燭", ntd: 680, hkd: 170, badge: "新品", soldOut: false },
      { id: "wong-kar-wai-qipao-scarf", name: "花樣年華印花絲巾", ntd: 1680, hkd: 410, badge: null, soldOut: true },
      { id: "wong-kar-wai-poster-set", name: "經典電影海報復刻三入組", ntd: 980, hkd: 240, badge: "Bundle", soldOut: false },
      { id: "wong-kar-wai-script-book", name: "《阿飛正傳》劇本典藏書", ntd: 1180, hkd: 290, badge: null, soldOut: false },
      { id: "wong-kar-wai-sunglasses", name: "導演同款墨鏡", ntd: 2280, hkd: 560, badge: null, soldOut: false },
      { id: "wong-kar-wai-ost-vinyl", name: "《春光乍洩》原聲帶黑膠", ntd: 2080, hkd: 510, badge: null, soldOut: false },
      { id: "wong-kar-wai-postcard-box", name: "光影劇照明信片鐵盒（24入）", ntd: 580, hkd: 145, badge: null, soldOut: false },
      { id: "wong-kar-wai-tee-chungking", name: "重慶森林霓虹印花T恤", ntd: 890, hkd: 220, badge: null, soldOut: false },
      { id: "wong-kar-wai-night-tote", name: "墮落天使夜行托特包", ntd: 690, hkd: 170, badge: null, soldOut: false },
      { id: "wong-kar-wai-grandmaster-print", name: "《一代宗師》水墨劇照版畫", ntd: 1480, hkd: 360, badge: null, soldOut: false },
      { id: "wong-kar-wai-film-notes", name: "導演手記復刻筆記本", ntd: 520, hkd: 130, badge: null, soldOut: false },
      { id: "wong-kar-wai-clock-lamp", name: "時鐘意象桌燈", ntd: 1980, hkd: 490, badge: null, soldOut: false },
      { id: "wong-kar-wai-trilogy-boxset", name: "時代三部曲藍光套裝", ntd: 3280, hkd: 800, badge: "Bundle", soldOut: true },
      { id: "wong-kar-wai-ticket-pins", name: "戲票造型琺瑯徽章組", ntd: 450, hkd: 110, badge: null, soldOut: false },
      { id: "wong-kar-wai-passport-cover", name: "春光乍洩護照套", ntd: 380, hkd: 95, badge: null, soldOut: false },
      { id: "wong-kar-wai-darkroom-print", name: "暗房手放劇照（編號簽名版）", ntd: 4280, hkd: 1050, badge: "限量", soldOut: false }
    ]
  },
  {
    slug: "wei-te-sheng",
    name: "魏德聖",
    role: "導演",
    region: "TW",
    tagline: "用一輩子的傻勁，拍一座島的夢。",
    followers: "98 萬",
    bio: "以《海角七號》寫下台灣影史票房傳奇，再以《賽德克・巴萊》搬演霧社事件、監製《KANO》重現嘉農榮光。他用一股傻勁說土地的故事，如今正築夢「台灣三部曲」，是最敢做夢的台灣導演。",
    topFans: [
      { rank: 1, nick: "恆春寄信的友子", seed: "wts-hengchun-tomoko" },
      { rank: 2, nick: "彩虹橋上的獵人", seed: "wts-rainbow-hunter" },
      { rank: 3, nick: "進甲子園的應援團長", seed: "wts-koshien-leader" },
      { rank: 4, nick: "馬拉桑首席業務員", seed: "wts-malasun-sales" },
      { rank: 5, nick: "國境之南的主唱", seed: "wts-southland-vocal" },
      { rank: 6, nick: "52赫茲的那隻鯨魚", seed: "wts-52hz-whale" },
      { rank: 7, nick: "莫那魯道的族人", seed: "wts-mona-clansman" },
      { rank: 8, nick: "台灣三部曲集資先鋒", seed: "wts-trilogy-backer" }
    ],
    events: [
      { title: "台灣三部曲前導紀錄首映禮", type: "首映禮", date: "2026-10-10", venue: "台北信義威秀影城" },
      { title: "《海角七號》原聲黑膠簽售會", type: "簽售會", date: "2026-08-22", venue: "高雄駁二藝術特區" },
      { title: "導演講堂・土地與電影見面會", type: "見面會", date: "2026-12-05", venue: "台中國家歌劇院" }
    ],
    products: [
      { id: "wei-te-sheng-cape7-vinyl", name: "《海角七號》原聲帶黑膠復刻", ntd: 1980, hkd: null, badge: "限量", soldOut: false },
      { id: "wei-te-sheng-seediq-script", name: "《賽德克・巴萊》劇本典藏書", ntd: 1280, hkd: null, badge: null, soldOut: false },
      { id: "wei-te-sheng-kano-jersey", name: "KANO 嘉農棒球復刻球衣", ntd: 1880, hkd: null, badge: "新品", soldOut: false },
      { id: "wei-te-sheng-love-letters", name: "海角七號・七封情書信紙組", ntd: 480, hkd: null, badge: null, soldOut: false },
      { id: "wei-te-sheng-rainbow-tee", name: "彩虹橋圖騰T恤", ntd: 690, hkd: null, badge: null, soldOut: false },
      { id: "wei-te-sheng-storyboard-book", name: "台灣三部曲分鏡手稿集", ntd: 1580, hkd: null, badge: null, soldOut: false },
      { id: "wei-te-sheng-malasun-glasses", name: "馬拉桑小米酒杯組", ntd: 580, hkd: null, badge: null, soldOut: false },
      { id: "wei-te-sheng-cape7-poster", name: "《海角七號》復刻海報", ntd: 420, hkd: null, badge: null, soldOut: false },
      { id: "wei-te-sheng-52hz-dvd", name: "《52赫茲，我愛你》音樂電影DVD", ntd: 680, hkd: null, badge: null, soldOut: false },
      { id: "wei-te-sheng-embroidered-cap", name: "賽德克圖紋刺繡帽", ntd: 780, hkd: null, badge: null, soldOut: false },
      { id: "wei-te-sheng-hengchun-postcards", name: "恆春海景劇照明信片組", ntd: 350, hkd: null, badge: null, soldOut: false },
      { id: "wei-te-sheng-signed-baseball", name: "KANO 簽名紀念棒球", ntd: 980, hkd: null, badge: "限量", soldOut: true },
      { id: "wei-te-sheng-south-tote", name: "國境之南帆布袋", ntd: 550, hkd: null, badge: null, soldOut: false },
      { id: "wei-te-sheng-director-notes", name: "《導演・巴萊》拍攝手記", ntd: 880, hkd: null, badge: null, soldOut: false },
      { id: "wei-te-sheng-film-bookmark", name: "35mm膠卷底片書籤", ntd: 320, hkd: null, badge: "新品", soldOut: false },
      { id: "wei-te-sheng-trilogy-badges", name: "台灣三部曲應援徽章組", ntd: 380, hkd: null, badge: null, soldOut: false },
      { id: "wei-te-sheng-ocean-bundle", name: "海角七號珍藏組（黑膠＋信紙＋海報）", ntd: 2680, hkd: null, badge: "Bundle", soldOut: false },
      { id: "wei-te-sheng-mona-carving", name: "莫那・魯道木雕小像", ntd: 1480, hkd: null, badge: null, soldOut: false },
      { id: "wei-te-sheng-kano-towel", name: "甲子園應援毛巾", ntd: 450, hkd: null, badge: null, soldOut: false },
      { id: "wei-te-sheng-storyboard-notebook", name: "導演空白分鏡筆記本", ntd: 420, hkd: null, badge: null, soldOut: false }
    ]
  },
  {
    slug: "tsai-a-ga",
    name: "蔡阿嘎",
    role: "網路創作者",
    region: "TW",
    tagline: "笑著講台語，認真愛台灣。",
    followers: "253 萬",
    bio: "台灣第一位破百萬訂閱的YouTuber，以道地台語與「嘎名人」系列走紅，和二伯、蔡桃貴的家庭日常陪伴觀眾超過十五年。從搞笑短片到公益行動，始終用最台的方式，說最真的台灣故事。",
    topFans: [
      { rank: 1, nick: "蔡桃貴乾媽後援會長", seed: "aga-kuei-godmom" },
      { rank: 2, nick: "二伯圍裙小幫手", seed: "aga-erbo-helper" },
      { rank: 3, nick: "台語檢定班班長", seed: "aga-taigi-monitor" },
      { rank: 4, nick: "桃貴星球居民代表", seed: "aga-planet-resident" },
      { rank: 5, nick: "嘎家軍第一排鐵粉", seed: "aga-front-row" },
      { rank: 6, nick: "雞排加珍奶大使", seed: "aga-chicken-boba" },
      { rank: 7, nick: "笑到嘎逼歪的觀眾", seed: "aga-laugh-crooked" },
      { rank: 8, nick: "嘎名人模仿大賽冠軍", seed: "aga-mimic-champ" }
    ],
    events: [
      { title: "嘎家軍十五週年見面會", type: "見面會", date: "2026-07-25", venue: "華山1914文化創意產業園區" },
      { title: "蔡桃貴2027桌曆簽售會", type: "簽售會", date: "2026-11-14", venue: "台中勤美誠品綠園道" },
      { title: "新節目《嘎遊台灣》線上首映", type: "線上首映", date: "2026-09-05", venue: "Ztor 線上放映廳" }
    ],
    products: [
      { id: "tsai-a-ga-collab-tee", name: "嘎好穿聯名T恤", ntd: 590, hkd: null, badge: "新品", soldOut: false },
      { id: "tsai-a-ga-taigi-textbook", name: "台語不輪轉檢定教材", ntd: 480, hkd: null, badge: null, soldOut: false },
      { id: "tsai-a-ga-sticker-set", name: "經典語錄防水貼紙包", ntd: 180, hkd: null, badge: null, soldOut: false },
      { id: "tsai-a-ga-kuei-pillow", name: "蔡桃貴造型抱枕", ntd: 690, hkd: null, badge: "限量", soldOut: true },
      { id: "tsai-a-ga-erbo-apron", name: "二伯同款廚房圍裙", ntd: 550, hkd: null, badge: null, soldOut: false },
      { id: "tsai-a-ga-army-hoodie", name: "嘎家軍連帽T", ntd: 1080, hkd: null, badge: null, soldOut: false },
      { id: "tsai-a-ga-mug", name: "嘎逼歪馬克杯", ntd: 380, hkd: null, badge: null, soldOut: false },
      { id: "tsai-a-ga-dad-cap", name: "嘎潮流老帽", ntd: 680, hkd: null, badge: null, soldOut: false },
      { id: "tsai-a-ga-desk-calendar", name: "蔡桃貴2027桌曆", ntd: 420, hkd: null, badge: "新品", soldOut: false },
      { id: "tsai-a-ga-socks-pack", name: "台味襪子三入組", ntd: 350, hkd: null, badge: "Bundle", soldOut: false },
      { id: "tsai-a-ga-phone-strap", name: "桃貴星球手機吊飾", ntd: 280, hkd: null, badge: null, soldOut: false },
      { id: "tsai-a-ga-eco-cup", name: "呷飽未環保隨行杯", ntd: 480, hkd: null, badge: null, soldOut: false },
      { id: "tsai-a-ga-market-tote", name: "菜市場購物袋", ntd: 390, hkd: null, badge: null, soldOut: false },
      { id: "tsai-a-ga-keycap-set", name: "嘎鍵盤注音鍵帽組", ntd: 580, hkd: null, badge: null, soldOut: false },
      { id: "tsai-a-ga-kuei-plush", name: "蔡桃貴絨毛娃娃", ntd: 880, hkd: null, badge: "限量", soldOut: true },
      { id: "tsai-a-ga-acrylic-stand", name: "貼圖經典款壓克力立牌", ntd: 320, hkd: null, badge: null, soldOut: false },
      { id: "tsai-a-ga-family-bundle", name: "嘎家日常組合包（T恤＋馬克杯＋貼紙）", ntd: 1180, hkd: null, badge: "Bundle", soldOut: false },
      { id: "tsai-a-ga-cheer-towel", name: "台灣加油應援毛巾", ntd: 360, hkd: null, badge: null, soldOut: false },
      { id: "tsai-a-ga-planet-puzzle", name: "桃貴星球拼圖（520片）", ntd: 650, hkd: null, badge: null, soldOut: false },
      { id: "tsai-a-ga-diary-notebook", name: "嘎日記手帳本", ntd: 350, hkd: null, badge: null, soldOut: false }
    ]
  }
]);
