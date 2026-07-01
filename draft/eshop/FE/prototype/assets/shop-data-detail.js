/* ────────────────────────────────────────────────────────────────
   shop-data-detail.js — PDP (detail-page) sidecar data.

   Loaded ONLY on shop-item.html. Sets window.ZTOR_SHOP.detail = { "<id>": {…} }.
   shop-detail-render.js merges detail[id] OVER the base entry resolved from the
   existing arrays (products ∪ popcornItems ∪ shopEvents ∪ auctions ∪
   creators[].products), so the 5 curated PLP source files stay byte-for-byte
   unchanged and the PLP renderer + cart.js are untouched.

   EVERY field here is OPTIONAL + additive — an absent field simply doesn't
   render. Image filenames are bare names under assets/images/shop/g/ (WebP),
   resolved by the same prodImg() path the PLP uses. Fallback chain in the
   renderer: entry.images → [imgMap[id]] → [picsum(id)].

   Mock data for the front-end preview. Real per-product photography swaps in
   at assets/images/shop/g/<id>-<n>.webp (0 = hero). See HANDOFF.md.
   ──────────────────────────────────────────────────────────────── */
window.ZTOR_SHOP = window.ZTOR_SHOP || {};
ZTOR_SHOP.detail = {

  /* ===== GOODS / creator-merch — the gate reference PDP ===== */
  "ztor-logo-heavyweight-tee-black": {
    images: ["tee-0.webp", "tee-2.webp", "tee-3.webp"],
    description: "以 240 克純棉重磅布裁製，落肩寬鬆版型，胸前以低調燙印呈現 Ztor. 標準字。布面厚實、水洗不易變形，是散場之後仍想一直穿著的日常電影服。",
    specs: [
      { k: "材質", v: "100% 純棉 240g 重磅針織" },
      { k: "版型", v: "落肩寬鬆 Oversized" },
      { k: "產地", v: "台灣製造" },
      { k: "洗滌", v: "冷水手洗、陰乾、勿烘、勿漂白" }
    ],
    variants: [
      { type: "size", label: "尺寸", options: [
        { label: "S", value: "s" },
        { label: "M", value: "m" },
        { label: "L", value: "l" },
        { label: "XL", value: "xl", soldOut: true }
      ] },
      { type: "colour", label: "顏色", options: [
        { label: "墨黑", value: "black" },
        { label: "霧灰", value: "grey" }
      ] }
    ],
    shipping: "下單後 3–5 個工作天內出貨；台灣本島滿 NT$1,000 免運，離島與海外運費另計。",
    returns: "收到商品 7 天內可申請退換，商品需保持吊牌完整、未經下水與配戴。",
    related: ["after-credits-hoodie", "end-credits-longsleeve", "what-to-watch-tonight-tee"]
  },

  /* ===== BUNDLE 套組 — one line, components shown with their own photos ===== */
  "movie-night-blanket-set": {
    type: "bundle",
    wasNtd: 1740,
    description: "把戲院的儀式感帶回沙發。一條超細纖維觀影毯、一只全遮光眼罩、一支爆米花香氛蠟燭，專為週五晚的居家放映夜打包成組——較單買省下 NT$360。",
    images: ["bag-3.webp", "book-1.webp", "cup-3.webp"],
    components: [
      { name: "超細纖維觀影毯（霧灰）", images: ["bag-3.webp", "book-0.webp"],
        variants: [{ type: "colour", label: "顏色", options: [{ label: "霧灰", value: "grey" }, { label: "墨黑", value: "black" }] }] },
      { name: "全遮光記憶棉眼罩", images: ["book-1.webp"] },
      { name: "爆米花香氛蠟燭 200g", images: ["cup-3.webp", "cup-0.webp"] }
    ],
    shipping: "套組合併出貨，下單後 3–5 個工作天內寄出。",
    returns: "套組為優惠組合，恕不接受拆組退換；整組未拆封 7 天內可退。",
    related: ["cinema-velvet-cushion-red", "projector-ambient-night-light", "popcorn-scented-candle"]
  },
  "ztor-double-wall-glass-set": {
    type: "bundle",
    wasNtd: 1120,
    description: "雙層隔熱玻璃對杯，一杯給你、一杯給最常一起看片的人。手工吹製、耐熱好握，冰飲不凝水、熱飲不燙手——成對入手較單買省 NT$200。",
    images: ["cup-0.webp", "cup-1.webp"],
    components: [
      { name: "雙層玻璃杯 350ml · A", images: ["cup-0.webp", "cup-2.webp"] },
      { name: "雙層玻璃杯 350ml · B", images: ["cup-1.webp", "cup-3.webp"] }
    ],
    shipping: "防震包裝、合併出貨，下單後 3–5 個工作天內寄出。",
    returns: "玻璃製品如運送破損，請於收到 3 天內附照片申請換貨。",
    related: ["ztor-popcorn-bucket-thermos", "popcorn-scented-candle", "countdown-leader-wall-clock"]
  },

  /* ===== POPCORN — redeem with the爆米花 credit (not shipped) ===== */
  "citysuper-hk100": {
    images: ["cards-1.webp", "cards-3.webp"],
    description: "以爆米花點數兌換 city'super 電子購物禮券，面額 HK$100。兌換後 7 個工作天內以電子券形式寄送至你的帳戶，適用於 city'super 全線門市與網購。",
    popPrice: 5200,
    redeemNote: "兌換後不可退點；電子券效期為發券日起 12 個月。",
    specs: [
      { k: "面額", v: "HK$100" },
      { k: "形式", v: "電子購物禮券" },
      { k: "適用", v: "city'super 門市・網購" },
      { k: "效期", v: "發券日起 12 個月" }
    ]
  },

  /* ===== EVENT — date/venue/lineup + select-ticket ===== */
  "ev-themesong-night": {
    images: ["ticket-0.webp", "ticket-2.webp"],
    description: "金曲原唱齊聚一晚，重現你記憶裡那些電影主題曲的現場版本。90 分鐘不插電與管弦交織，獻給每個在散場後仍哼著旋律的你。",
    doorsTime: "18:30 入場 · 19:30 開演",
    lineup: ["林宥嘉", "陳綺貞", "盧廣仲", "告五人"],
    ticketTiers: [
      { label: "搖滾區 站票", ntd: 1800, hkd: 450, soldOut: false },
      { label: "VIP 看台 對號座", ntd: 2400, hkd: 600, soldOut: false },
      { label: "至尊包廂（含限定周邊）", ntd: 4800, hkd: 1200, soldOut: true }
    ]
  },

  /* ===== AUCTION — lot gallery + live status + place-bid ===== */
  "au-script-signed": {
    images: ["manuscript-2.webp", "manuscript-0.webp", "book-2.webp"],
    description: "《雙眼之間》導演親筆批註的工作劇本，全片唯一一本。內含分場手稿、修改痕跡與導演簽名，附作品鑑定證書。",
    startBid: 50000,
    bidIncrement: 2000,
    endsISO: "2026-09-14T23:59:00+08:00",
    bidders: 52,
    provenance: "來源：導演工作室直接提供，附親簽鑑定證書與原裝收藏盒。",
    specs: [
      { k: "件數", v: "全球唯一 1 件" },
      { k: "附件", v: "鑑定證書・原裝收藏盒" },
      { k: "狀態", v: "九成新・含手寫批註" }
    ]
  },

  "taiwan-trilogy-concept-poster": {
    "description": "以《魏德聖·台灣三部曲》前導視覺為本，採進口美術紙微噴輸出，沉穩的土地色調與海風層次層層疊印於厚磅紙面。每張右下角皆有獨立流水編號與壓印鋼印，是替一個關於這座島嶼的長夢，留下的一枚收藏憑證。",
    "specs": [
      {
        "k": "尺寸",
        "v": "A2（420 × 594 mm）"
      },
      {
        "k": "材質",
        "v": "進口 230g 美術紙微噴輸出"
      },
      {
        "k": "限量",
        "v": "全球編號限量 300 張，附鋼印與編號卡"
      },
      {
        "k": "產地",
        "v": "台灣印製"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "A2（420 × 594 mm）",
            "value": "a2"
          },
          {
            "label": "A1（594 × 841 mm）",
            "value": "a1"
          }
        ]
      }
    ],
    "shipping": "下單後 3–5 個工作天內以硬管包裝出貨，避免摺痕；台灣本島滿 NT$1,000 免運，離島與海外運費另計。",
    "returns": "編號收藏品如有印刷瑕疵，收到 7 天內可申請換貨；商品須保持完整未拆封、編號卡完好。",
    "related": [
      "vintage-film-program-reprint",
      "hk-classic-hand-painted-poster",
      "taiyu-golden-age-postcards"
    ]
  },
  "vintage-film-program-reprint": {
    "description": "自老戲院散場後遺落的場刊重新製版復刻，連同泛黃紙色、油墨網點與當年的排版錯落一併保留。翻開它，像把一張早已停業的戲院門票，重新夾回口袋裡。",
    "specs": [
      {
        "k": "開本",
        "v": "菊8開（約 148 × 210 mm）"
      },
      {
        "k": "頁數",
        "v": "全本 16 頁，騎馬釘裝訂"
      },
      {
        "k": "用紙",
        "v": "米黃道林紙，仿舊網點印刷"
      },
      {
        "k": "產地",
        "v": "台灣印製"
      }
    ],
    "shipping": "下單後 3–5 個工作天內出貨，附紙板襯墊防摺；台灣本島滿 NT$1,000 免運，離島與海外另計運費。",
    "returns": "收到後 7 天內可申請退換，書冊須保持平整未閱讀痕跡、無摺角與書寫。",
    "related": [
      "taiwan-trilogy-concept-poster",
      "taiyu-golden-age-postcards",
      "hk-classic-hand-painted-poster"
    ]
  },
  "ztor-storyboard-notebook": {
    "description": "封面復刻 Ztor. 經典片頭的分鏡手稿線條，內頁採可平攤的裸背線裝，左頁畫格、右頁筆記，方便把一閃而過的鏡頭隨手定格。米色道林內頁不反光、耐久書寫，適合長時間在暗暗的放映廳裡記下念頭。",
    "specs": [
      {
        "k": "尺寸",
        "v": "A5（148 × 210 mm）"
      },
      {
        "k": "頁數",
        "v": "160 頁，80g 米色道林內頁"
      },
      {
        "k": "裝訂",
        "v": "裸背線裝，可 180° 平攤"
      },
      {
        "k": "內頁",
        "v": "左分鏡格／右橫線筆記"
      }
    ],
    "shipping": "下單後 3–5 個工作天內出貨；台灣本島單筆滿 NT$1,000 免運，外島與海外運費另行計算。",
    "returns": "收到 7 天內可退換，筆記本須維持全新未書寫、封面無壓痕。",
    "related": [
      "director-megaphone-pen-set",
      "ztor-clapperboard-acrylic",
      "film-strip-bookmarks"
    ]
  },
  "taiyu-golden-age-postcards": {
    "description": "選錄台語片黃金年代的經典戲院畫面與手繪本事，復刻為一套八張的明信片組，連海報邊角的歲月痕跡都細細留下。可寄、可框、可夾進書頁，把那個用台語說故事的年代,輕輕遞到下一個人手上。",
    "specs": [
      {
        "k": "張數",
        "v": "一組 8 張，圖樣各異"
      },
      {
        "k": "尺寸",
        "v": "標準明信片 100 × 148 mm"
      },
      {
        "k": "用紙",
        "v": "300g 經典棉卡，仿舊印刷"
      },
      {
        "k": "附件",
        "v": "附牛皮紙收納卡套"
      }
    ],
    "shipping": "下單後 3–5 個工作天內出貨，附透明套防潮；台灣本島滿 NT$1,000 免運，離島與海外另計。",
    "returns": "收到後 7 天內可申請退換，明信片組須完整、卡套未拆封使用。",
    "related": [
      "vintage-film-program-reprint",
      "hk-classic-hand-painted-poster",
      "taiwan-trilogy-concept-poster"
    ]
  },
  "film-strip-bookmarks": {
    "description": "以真實放映過的 35mm 廢棄膠卷裁製，每段畫格皆不重複，獨一無二地停在某部電影的某一秒。對著光，還能看見當年穿過放映機的那道影像，從此夾在你正在讀的那一頁裡。",
    "specs": [
      {
        "k": "材質",
        "v": "35mm 真實電影膠片"
      },
      {
        "k": "組數",
        "v": "一組 3 入，畫格隨機不重複"
      },
      {
        "k": "加工",
        "v": "邊緣封膜、頂端金屬扣環"
      },
      {
        "k": "附件",
        "v": "附畫格說明卡"
      }
    ],
    "shipping": "下單後 3–5 個工作天內出貨，膠片以硬卡夾護；台灣本島滿 NT$1,000 免運，外島與海外運費另計。",
    "returns": "因屬隨機畫格之膠片收藏品，恕不接受指定畫格退換；如有膠片破損，收到 7 天內可換貨。",
    "related": [
      "ztor-storyboard-notebook",
      "ztor-clapperboard-acrylic",
      "film-festival-pin-set"
    ]
  },
  "ztor-clapperboard-acrylic": {
    "description": "以 Ztor. 識別重新打樣的場記板，改用透明壓克力裁切，黑白拍板與刻度一應俱全，桌上的擺飾感多過工作的緊張感。上方拍臂可開合，留白處能用白板筆寫下此刻正在進行的「那一場」。",
    "specs": [
      {
        "k": "材質",
        "v": "5mm 透明壓克力，雷射雕刻"
      },
      {
        "k": "尺寸",
        "v": "約 200 × 175 mm（收藏比例）"
      },
      {
        "k": "結構",
        "v": "上拍臂可開合，附阻尼鉸鏈"
      },
      {
        "k": "附件",
        "v": "附白板筆與防塵絨布袋"
      }
    ],
    "shipping": "下單後 3–5 個工作天內出貨，壓克力以氣泡層層包覆防刮；台灣本島滿 NT$1,000 免運，離島與海外另計。",
    "returns": "收到 7 天內可退換，場記板須無刮痕、保護膜完整、配件齊全。",
    "related": [
      "ztor-storyboard-notebook",
      "director-megaphone-pen-set",
      "film-strip-bookmarks"
    ]
  },
  "hk-classic-hand-painted-poster": {
    "description": "復刻自港片全盛時期的戲院手繪大看板，連畫師落筆的飛白與顏料堆疊都忠實重現,是還看得見人手溫度的一張海報。此版本已全數售罄,留作香港電影那段濃烈歲月的一個紀念。",
    "specs": [
      {
        "k": "尺寸",
        "v": "B2（500 × 707 mm）"
      },
      {
        "k": "材質",
        "v": "260g 絨面美術紙微噴"
      },
      {
        "k": "工藝",
        "v": "手繪稿高解析復刻，保留筆觸"
      },
      {
        "k": "狀態",
        "v": "已售完，不再追加"
      }
    ],
    "shipping": "本商品已售完，恕無法下單出貨；如未來開放預購將另行公告。",
    "returns": "售完商品不適用退換貨流程；既有訂單之退換請依原訂單條款辦理。",
    "related": [
      "taiwan-trilogy-concept-poster",
      "vintage-film-program-reprint",
      "taiyu-golden-age-postcards"
    ]
  },
  "director-megaphone-pen-set": {
    "description": "把導演手裡的喊話筒縮小成一支可書寫的原子筆，筒身金屬旋轉出芯,握在掌心仍有沉甸甸的份量。一組三色,寫字時像隨時都能對著紙面喊一聲「Action」。",
    "specs": [
      {
        "k": "材質",
        "v": "鋁合金筒身，金屬旋轉出芯"
      },
      {
        "k": "組數",
        "v": "一組 3 入（黑／藍／紅墨）"
      },
      {
        "k": "筆芯",
        "v": "0.7mm 油性中性筆芯，可替換"
      },
      {
        "k": "附件",
        "v": "附磁吸收納盒"
      }
    ],
    "shipping": "下單後 3–5 個工作天內出貨；台灣本島滿 NT$1,000 免運，外島與海外運費另計。",
    "returns": "收到 7 天內可退換，筆組須保持未書寫、收納盒與替芯完整。",
    "related": [
      "ztor-storyboard-notebook",
      "ztor-clapperboard-acrylic",
      "film-festival-pin-set"
    ]
  },
  "film-festival-pin-set": {
    "description": "以歷屆電影節意象設計的限定琺瑯徽章,六枚一組,從售票亭、放映機到散場的紅幕,各自定格一個看電影的小小儀式。別在外套、帆布袋或相機背帶上,把對電影節的偏愛低調地戴在身上。",
    "specs": [
      {
        "k": "數量",
        "v": "一組 6 入，圖樣各異"
      },
      {
        "k": "材質",
        "v": "硬質琺瑯鍍金，蝶型針扣"
      },
      {
        "k": "尺寸",
        "v": "單枚約 25–30 mm"
      },
      {
        "k": "附件",
        "v": "附主題收藏卡台紙"
      }
    ],
    "shipping": "下單後 3–5 個工作天內出貨，徽章固定於卡台防碰撞；台灣本島滿 NT$1,000 免運，離島與海外另計。",
    "returns": "收到 7 天內可申請退換，徽章組須完整、針扣未使用、卡台無折損。",
    "related": [
      "film-strip-bookmarks",
      "director-megaphone-pen-set",
      "ztor-clapperboard-acrylic"
    ]
  },
  "film-crew-staff-jacket": {
    "description": "以厚磅斜紋棉布裁製，左胸與後背低調印上 CREW 字樣，還原片場工作人員的日常穿著。多口袋設計收得下對講機與場記筆，是收工後也捨不得換下的那件外套。",
    "specs": [
      {
        "k": "材質",
        "v": "98% 棉 2% 彈性纖維、斜紋厚磅"
      },
      {
        "k": "版型",
        "v": "工裝直筒、落肩剪裁"
      },
      {
        "k": "口袋",
        "v": "前胸雙貼袋、腰側斜插袋共四袋"
      },
      {
        "k": "產地",
        "v": "台灣製造"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "軍綠",
            "value": "army-green"
          },
          {
            "label": "卡其",
            "value": "khaki"
          },
          {
            "label": "墨黑",
            "value": "ink-black"
          }
        ]
      }
    ],
    "shipping": "下單後 3–5 個工作天內出貨；台灣本島單筆滿 NT$1,000 免運，離島與海外運費另行計算。",
    "returns": "收到商品 7 天內可申請退換貨，外套須保持吊牌完整、未經穿著與下水。",
    "related": [
      "after-credits-hoodie",
      "midnight-screening-fleece-jacket",
      "projectionist-work-cap"
    ]
  },
  "after-credits-hoodie": {
    "description": "320 克雙面起絨重磅布縫製，胸前以霧面燙印寫上「散場之後」四字，呼應燈亮起、字幕跑完仍不想離席的那一刻。帽繩加粗、袖口羅紋紮實，是夜涼時最先想到的那件連帽衫。",
    "specs": [
      {
        "k": "材質",
        "v": "80% 棉 20% 聚酯、320g 雙面起絨"
      },
      {
        "k": "版型",
        "v": "寬鬆落肩、加大連帽"
      },
      {
        "k": "細節",
        "v": "袋鼠口袋、加粗棉質帽繩"
      },
      {
        "k": "洗滌",
        "v": "冷水翻面手洗、陰乾、勿烘"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl",
            "soldOut": true
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "墨黑",
            "value": "ink-black"
          },
          {
            "label": "霧灰",
            "value": "fog-grey"
          },
          {
            "label": "酒紅",
            "value": "wine-red"
          }
        ]
      }
    ],
    "shipping": "確認訂單後 3–5 個工作天備貨出貨；台灣本島滿 NT$1,000 享免運，離島及海外另計運費。",
    "returns": "商品到貨 7 日內可辦理退換，連帽衫需維持未洗滌、未穿著且配件齊全。",
    "related": [
      "film-crew-staff-jacket",
      "end-credits-longsleeve",
      "midnight-screening-fleece-jacket"
    ]
  },
  "projectionist-work-cap": {
    "description": "硬挺斜紋棉布搭配復古五片帽身，帽簷下方藏一行細小的放映機刺繡，致敬膠卷時代守在放映室的那雙手。後扣金屬調節，戴久了帽身會隨汗水與光陰養出溫潤的舊色。",
    "specs": [
      {
        "k": "材質",
        "v": "100% 純棉斜紋布、硬挺帽身"
      },
      {
        "k": "版型",
        "v": "復古五片帽、中高帽頂"
      },
      {
        "k": "尺寸",
        "v": "均碼、後方金屬扣可調 54–60cm"
      },
      {
        "k": "產地",
        "v": "台灣製造"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "均碼",
            "value": "one-size"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "卡其",
            "value": "khaki"
          },
          {
            "label": "墨黑",
            "value": "ink-black"
          },
          {
            "label": "軍綠",
            "value": "army-green"
          }
        ]
      }
    ],
    "shipping": "下單後 3–5 個工作天內安排出貨；台灣本島消費滿 NT$1,000 免運費，離島與海外另行報價。",
    "returns": "收到後 7 天內可申請退換，帽款須保持原狀、無配戴痕跡與汗漬。",
    "related": [
      "film-reel-bucket-hat",
      "film-crew-staff-jacket",
      "crew-pass-lanyard"
    ]
  },
  "film-reel-bucket-hat": {
    "description": "以水洗棉布做出柔軟微塌的漁夫帽身，帽簷一圈以同色線繡上連續的膠卷齒孔圖騰，遠看素雅、近看才讀得出那段底片語彙。帽身輕、收摺不留摺痕，是散步看片、城市漫遊都好搭的一頂。",
    "specs": [
      {
        "k": "材質",
        "v": "100% 水洗棉、軟質帽身"
      },
      {
        "k": "工藝",
        "v": "帽簷膠卷齒孔同色刺繡"
      },
      {
        "k": "尺寸",
        "v": "均碼、頭圍約 57–59cm"
      },
      {
        "k": "產地",
        "v": "台灣製造"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "均碼",
            "value": "one-size"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "霧灰",
            "value": "fog-grey"
          },
          {
            "label": "卡其",
            "value": "khaki"
          },
          {
            "label": "墨黑",
            "value": "ink-black"
          }
        ]
      }
    ],
    "shipping": "訂單成立後 3–5 個工作天出貨；台灣本島滿 NT$1,000 免運，外島與海外運費另計。",
    "returns": "到貨 7 日內接受退換貨，漁夫帽需保持未配戴、無摺損與汙漬狀態。",
    "related": [
      "projectionist-work-cap",
      "crew-pass-lanyard",
      "what-to-watch-tonight-tee"
    ]
  },
  "end-credits-longsleeve": {
    "description": "200 克精梳棉長袖，前身留白、左袖順著手臂直印一整列細小的片尾名單字樣，像把一部電影的工作人員悄悄帶在身上。布面細緻親膚，是換季時最順手套上的一件內外皆宜的上衣。",
    "specs": [
      {
        "k": "材質",
        "v": "100% 精梳棉、200g 中磅針織"
      },
      {
        "k": "版型",
        "v": "合身落肩、圓領長袖"
      },
      {
        "k": "印製",
        "v": "左袖片尾名單細字直排印花"
      },
      {
        "k": "洗滌",
        "v": "冷水翻面洗滌、陰乾、勿熨印花處"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "墨黑",
            "value": "ink-black"
          },
          {
            "label": "霧灰",
            "value": "fog-grey"
          },
          {
            "label": "卡其",
            "value": "khaki"
          }
        ]
      }
    ],
    "shipping": "下單後 3–5 個工作天內寄出；台灣本島單筆滿 NT$1,000 免運，離島與海外另計運費。",
    "returns": "商品送達 7 天內可申請退換，長袖上衣須保留吊牌、未經下水與穿著。",
    "related": [
      "after-credits-hoodie",
      "what-to-watch-tonight-tee",
      "film-crew-staff-jacket"
    ]
  },
  "what-to-watch-tonight-tee": {
    "description": "180 克純棉柔軟平織，胸前以手寫感字體印上「今晚想看點什麼」，把每個選片猶豫的夜晚都穿成日常。版型不挑身形、洗感舒服，是攤在沙發上配一部老片的最佳搭檔。",
    "specs": [
      {
        "k": "材質",
        "v": "100% 純棉、180g 平織"
      },
      {
        "k": "版型",
        "v": "經典直筒、微落肩"
      },
      {
        "k": "印製",
        "v": "胸前手寫感水性印花"
      },
      {
        "k": "產地",
        "v": "台灣製造"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "霧灰",
            "value": "fog-grey"
          },
          {
            "label": "墨黑",
            "value": "ink-black"
          },
          {
            "label": "酒紅",
            "value": "wine-red"
          }
        ]
      }
    ],
    "shipping": "確認付款後 3–5 個工作天出貨；台灣本島滿 NT$1,000 免運，離島及海外運費另計。",
    "returns": "收到後 7 日內可辦理退換貨，短 T 需維持未洗、未穿與吊牌完整。",
    "related": [
      "end-credits-longsleeve",
      "after-credits-hoodie",
      "film-reel-bucket-hat"
    ]
  },
  "crew-pass-lanyard": {
    "description": "以織帶搭配霧面金屬扣具，仿照片場通行證的識別帶，掛上門禁卡或鑰匙就像隨身帶著一張入場資格。織紋上低調織入 Ztor. 字樣，細看才認得出的小小歸屬感。",
    "specs": [
      {
        "k": "材料",
        "v": "聚酯織帶、霧面合金龍蝦扣與防勒安全扣"
      },
      {
        "k": "規格",
        "v": "寬約 2cm、總長約 46cm"
      },
      {
        "k": "附件",
        "v": "透明證件套一只"
      },
      {
        "k": "產地",
        "v": "台灣製造"
      }
    ],
    "variants": [
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "墨黑",
            "value": "ink-black"
          },
          {
            "label": "軍綠",
            "value": "army-green"
          },
          {
            "label": "酒紅",
            "value": "wine-red"
          }
        ]
      }
    ],
    "shipping": "下單後 3–5 個工作天內出貨；台灣本島滿 NT$1,000 免運，離島與海外另計運費。",
    "returns": "到貨 7 天內可申請退換，識別帶與證件套須保持全新未使用。",
    "related": [
      "projectionist-work-cap",
      "film-reel-bucket-hat",
      "film-crew-staff-jacket"
    ]
  },
  "midnight-screening-fleece-jacket": {
    "description": "厚實搖粒絨刷毛立領外套，內裡蓄熱、外層防潑短毛，專為散場後騎車回家的午夜涼風而生。胸口暗繡一彎細小月相，是只有自己知道的午夜場暗號。",
    "specs": [
      {
        "k": "材質",
        "v": "100% 聚酯雙面搖粒絨、克重 280g"
      },
      {
        "k": "版型",
        "v": "立領拉鍊、修身保暖剪裁"
      },
      {
        "k": "細節",
        "v": "雙側拉鍊口袋、胸口月相暗繡"
      },
      {
        "k": "洗滌",
        "v": "冷水手洗、勿烘、勿與粗糙衣物同洗"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "墨黑",
            "value": "ink-black"
          },
          {
            "label": "霧灰",
            "value": "fog-grey"
          },
          {
            "label": "軍綠",
            "value": "army-green"
          }
        ]
      }
    ],
    "shipping": "訂單確認後 3–5 個工作天內安排寄送；台灣本島消費滿 NT$1,000 免運，離島與海外運費另行計算。",
    "returns": "商品收到 7 日內可申請退換貨，刷毛外套須保持吊牌完整、未下水與未穿著。",
    "related": [
      "after-credits-hoodie",
      "film-crew-staff-jacket",
      "end-credits-longsleeve"
    ]
  },
  "ztor-anniversary-crystal-trophy": {
    "description": "以 K9 光學水晶手工切磨而成，底座雷射內雕 Ztor. 標準字與一週年字樣，光線穿過時折射出放映機投影般的細碎光暈。隨座附專屬編號與紀念卡，收進絨布盒裡，像替這一年的觀影時光留下一座小小的紀念碑。",
    "specs": [
      {
        "k": "材質",
        "v": "K9 光學水晶＋金屬底座"
      },
      {
        "k": "尺寸",
        "v": "高約 14cm，底寬 8cm"
      },
      {
        "k": "限量編號",
        "v": "全球限量 300 座，雷射內雕流水號"
      },
      {
        "k": "附件",
        "v": "絨布收藏盒＋紀念卡"
      }
    ],
    "shipping": "下單後 3–5 個工作天內由台北倉出貨；台灣本島滿 NT$1,000 免運，離島與海外運費另計。",
    "returns": "收到後 7 天內可申請退換，水晶獎座需保持原狀、編號封籤未拆。",
    "related": [
      "brass-clapperboard-limited",
      "ztor-sterling-silver-pendant",
      "classic-scene-paper-light"
    ]
  },
  "vintage-projector-diecast-model": {
    "description": "依 1950 年代 35mm 膠片放映機原型，以 1:6 比例合金壓鑄重現，片盤可轉、鏡頭可微調俯仰角。金屬冷冽的手感與斑駁仿舊塗裝，擺在書架上就像把一整座老放映室搬回了家。",
    "specs": [
      {
        "k": "比例",
        "v": "1:6 合金壓鑄模型"
      },
      {
        "k": "材質",
        "v": "鋅合金本體＋仿舊烤漆"
      },
      {
        "k": "尺寸",
        "v": "長約 22cm，含片盤高 18cm"
      },
      {
        "k": "附件",
        "v": "展示底座＋說明卡"
      }
    ],
    "shipping": "下單後 3–5 個工作天內出貨；台灣本島滿 NT$1,000 免運，離島及海外另行報價。",
    "returns": "商品到貨 7 天內可退換，模型與配件需完整、片盤無拆裝痕跡。",
    "related": [
      "director-chair-walnut-miniature",
      "brass-clapperboard-limited",
      "taiwan-theater-billboard-miniature"
    ]
  },
  "framed-35mm-film-cell": {
    "description": "擷取自一段真實放映過的 35mm 膠卷，裁切後嵌入無酸卡紙與抗 UV 玻璃裱框，背面附鑑定書與片格出處說明。對著光看，一格一格的影像彷彿仍在等待下一次轉動。",
    "specs": [
      {
        "k": "材料",
        "v": "真實放映 35mm 電影膠卷片格"
      },
      {
        "k": "裱框",
        "v": "無酸卡紙＋抗 UV 玻璃實木框"
      },
      {
        "k": "尺寸",
        "v": "外框約 25 × 20cm"
      },
      {
        "k": "附件",
        "v": "片格鑑定書（含出處與編號）"
      }
    ],
    "shipping": "下單後 3–5 個工作天內以防撞包裝寄出；台灣本島滿 NT$1,000 免運，離島與海外運費另計。",
    "returns": "收到 7 天內可申請退換，裱框需完整未拆封、玻璃無刮痕。",
    "related": [
      "vintage-ticket-stub-album",
      "classic-scene-paper-light",
      "ztor-anniversary-crystal-trophy"
    ]
  },
  "taiwan-theater-billboard-miniature": {
    "description": "參照昔日台灣老戲院門前那面手繪電影看板，由師傅一筆一筆按比例微縮重繪，連顏料堆疊的厚度與招牌燈架都照樣還原。它替一個逐漸消失的街角時代，留下一塊掌心大小的記憶。",
    "specs": [
      {
        "k": "材質",
        "v": "手繪壓克力顏料＋木質框架"
      },
      {
        "k": "尺寸",
        "v": "約 30 × 20 × 6cm"
      },
      {
        "k": "限量編號",
        "v": "限量 88 件，背面手寫編號（已售完）"
      },
      {
        "k": "附件",
        "v": "作者簽名卡＋收藏證書"
      }
    ],
    "shipping": "本品為已售完之限量品，恕不再出貨。",
    "returns": "已售完商品不再受理新訂單與退換。",
    "related": [
      "vintage-projector-diecast-model",
      "director-chair-walnut-miniature",
      "vintage-ticket-stub-album"
    ]
  },
  "classic-scene-paper-light": {
    "description": "取一幕經典長鏡頭的構圖，以多層紙雕逐層堆疊出景深，內藏暖白燈帶後，光影便在街道與人影間流動起來。夜裡點亮時，整個房間都像浸進了那場戲的尾聲。",
    "specs": [
      {
        "k": "材質",
        "v": "多層雷射切割紙雕＋亞克力外罩"
      },
      {
        "k": "光源",
        "v": "暖白 LED 燈帶，USB 供電"
      },
      {
        "k": "尺寸",
        "v": "約 20 × 15 × 10cm"
      },
      {
        "k": "附件",
        "v": "USB 電源線＋防塵收納盒"
      }
    ],
    "shipping": "下單後 3–5 個工作天內出貨；台灣本島滿 NT$1,000 免運，離島與海外另計運費。",
    "returns": "到貨 7 天內可退換，紙雕與燈組需完好、無折損與通電痕跡以外的損傷。",
    "related": [
      "framed-35mm-film-cell",
      "ztor-anniversary-crystal-trophy",
      "vintage-ticket-stub-album"
    ]
  },
  "ztor-sterling-silver-pendant": {
    "description": "將 Ztor. 片頭標誌縮鑄成 925 純銀墜飾，邊緣保留手工拋光的細微弧度，背面壓印獨立編號。它小得可以日日貼著鎖骨，卻把那一閃而過的開場標誌，悄悄留在了身上。",
    "specs": [
      {
        "k": "材質",
        "v": "925 純銀，手工拋光"
      },
      {
        "k": "尺寸",
        "v": "墜身約 18 × 14mm，附 45cm 銀鍊"
      },
      {
        "k": "限量編號",
        "v": "背面壓印獨立流水編號"
      },
      {
        "k": "附件",
        "v": "絨布首飾袋＋保養擦銀布"
      }
    ],
    "shipping": "下單後 3–5 個工作天內以掛號寄出；台灣本島滿 NT$1,000 免運，離島與海外運費另計。",
    "returns": "收到後 7 天內可申請退換，墜飾需未配戴、封套與擦銀布完整。",
    "related": [
      "ztor-anniversary-crystal-trophy",
      "brass-clapperboard-limited",
      "framed-35mm-film-cell"
    ]
  },
  "vintage-ticket-stub-album": {
    "description": "收錄逾百張不同年代、不同戲院的絕版電影票根，依時序裱貼於無酸內頁，旁註放映場次與戲院名稱。一頁頁翻過去，像是把幾十年來散場後捨不得丟的那一小截紙，重新接成一條時光。",
    "specs": [
      {
        "k": "內容",
        "v": "逾 100 張絕版實體電影票根"
      },
      {
        "k": "內頁",
        "v": "無酸護存內頁，可平攤翻閱"
      },
      {
        "k": "規格",
        "v": "硬殼精裝，約 A4 大小、120 頁"
      },
      {
        "k": "附件",
        "v": "典藏說明冊＋防潮收納盒"
      }
    ],
    "shipping": "下單後 3–5 個工作天內出貨；台灣本島滿 NT$1,000 免運，離島及海外運費另計。",
    "returns": "到貨 7 天內可退換，典藏冊需保持未拆封、內頁無翻閱與書寫痕跡。",
    "related": [
      "framed-35mm-film-cell",
      "taiwan-theater-billboard-miniature",
      "classic-scene-paper-light"
    ]
  },
  "director-chair-walnut-miniature": {
    "description": "以實木胡桃木車製椅架、真皮裁出椅面與椅背，按比例縮小成一張可摺收的迷你導演椅，椅背還能燙上你指定的名字。擺在桌上，彷彿隨時有人會喊出那聲「Action」。",
    "specs": [
      {
        "k": "材質",
        "v": "胡桃木實木＋真皮椅面"
      },
      {
        "k": "尺寸",
        "v": "高約 16cm，可摺收"
      },
      {
        "k": "客製",
        "v": "椅背可燙印姓名或暱稱（選配）"
      },
      {
        "k": "附件",
        "v": "棉布防塵袋＋保養說明卡"
      }
    ],
    "shipping": "下單後 3–5 個工作天內出貨，含客製燙印者需多備 2–3 個工作天；台灣本島滿 NT$1,000 免運，離島與海外另計。",
    "returns": "未客製品到貨 7 天內可退換；已燙印姓名之客製品恕不接受退換，僅瑕疵可換貨。",
    "related": [
      "vintage-projector-diecast-model",
      "brass-clapperboard-limited",
      "taiwan-theater-billboard-miniature"
    ]
  },
  "brass-clapperboard-limited": {
    "description": "以實心黃銅手工製成的場記板，板面手工雕刻雙週年字樣與 Ztor. 標誌，拍板可上下開合並發出清脆的金屬聲。黃銅會隨時間養出溫潤色澤，讓這塊紀念物像膠卷一樣，慢慢留下歲月的痕跡。",
    "specs": [
      {
        "k": "材質",
        "v": "實心黃銅，手工雕刻"
      },
      {
        "k": "尺寸",
        "v": "約 20 × 18cm，拍板可開合"
      },
      {
        "k": "限量編號",
        "v": "雙週年限量 200 件，板背刻有編號"
      },
      {
        "k": "附件",
        "v": "鑑定證書＋木質收藏盒"
      }
    ],
    "shipping": "下單後 3–5 個工作天內以防撞包裝寄出；台灣本島滿 NT$1,000 免運，離島與海外運費另計。",
    "returns": "收到 7 天內可申請退換，場記板需保持原狀、編號與證書齊全。",
    "related": [
      "ztor-anniversary-crystal-trophy",
      "vintage-projector-diecast-model",
      "director-chair-walnut-miniature"
    ]
  },
  "digital-collector-card-pack": {
    "description": "收錄十二張高解析數位收藏卡，每張定格一個讓人屏息的鏡頭瞬間，背面附上拍攝當下的幕後手記。購買後即時收進帳戶，散場多年後重新滑開，那道光仍在。",
    "specs": [
      {
        "k": "檔案格式",
        "v": "PNG 透明卡面＋JPG 全幅"
      },
      {
        "k": "解析度",
        "v": "2480 × 3508 px（300dpi）"
      },
      {
        "k": "數量",
        "v": "12 張一組"
      },
      {
        "k": "授權範圍",
        "v": "個人收藏與裝置桌布使用"
      }
    ],
    "shipping": "購買後於帳戶內即時開通，可於『我的收藏』隨時下載取用；數位商品恕不退款。",
    "returns": "數位／電子商品售出後恕不退款，詳情請見商品說明。",
    "related": [
      "ztor-4k-wallpaper-collection",
      "classic-quotes-sticker-pack",
      "virtual-premiere-avatar-frames"
    ]
  },
  "ztor-4k-wallpaper-collection": {
    "description": "精選一整年最動人的劇照，調色重新校過，化作三十張可掛在桌面的 4K 電影風景。讓那些散場後不捨的畫面，每天開機時再亮一次。",
    "specs": [
      {
        "k": "檔案格式",
        "v": "JPG（sRGB 色彩）"
      },
      {
        "k": "解析度",
        "v": "3840 × 2160 px（4K UHD）"
      },
      {
        "k": "數量",
        "v": "30 張年度合輯"
      },
      {
        "k": "相容平台",
        "v": "桌機、筆電、平板、手機通用比例"
      }
    ],
    "shipping": "購買後於帳戶內即時開通，可於『我的收藏』分批或整包下載；數位商品恕不退款。",
    "returns": "數位／電子商品售出後恕不退款，詳情請見商品說明。",
    "related": [
      "digital-collector-card-pack",
      "yearly-viewing-report-poster",
      "ztor-intro-ringtone-pack"
    ]
  },
  "classic-quotes-sticker-pack": {
    "description": "把銀幕上那些說進心坎的台詞，做成二十四款會動的貼圖，字句隨光影輕輕浮現。傳給同樣記得這句話的人，比文字更懂彼此。",
    "specs": [
      {
        "k": "檔案格式",
        "v": "APNG／WebP 動態貼圖"
      },
      {
        "k": "數量",
        "v": "24 款一組"
      },
      {
        "k": "尺寸",
        "v": "370 × 320 px（聊天最佳化）"
      },
      {
        "k": "相容平台",
        "v": "LINE、Telegram、WhatsApp"
      }
    ],
    "shipping": "購買後於帳戶內即時開通，可於『我的收藏』取得各平台匯入檔；數位商品恕不退款。",
    "returns": "數位／電子商品售出後恕不退款，詳情請見商品說明。",
    "related": [
      "digital-collector-card-pack",
      "ztor-intro-ringtone-pack",
      "virtual-premiere-avatar-frames"
    ]
  },
  "director-commentary-unlock": {
    "description": "解鎖整部作品的導演講評音軌，讓導演在你耳邊細說每顆鏡頭為何這樣擺、那場戲為何留白。看過一遍的電影，配上這條軌，會像第一次重新認識它。",
    "specs": [
      {
        "k": "檔案格式",
        "v": "AAC 立體聲音軌"
      },
      {
        "k": "音質",
        "v": "320 kbps／48kHz"
      },
      {
        "k": "總長",
        "v": "約 118 分鐘（隨正片同步）"
      },
      {
        "k": "授權範圍",
        "v": "綁定帳戶串流聆聽"
      }
    ],
    "shipping": "購買後於帳戶內即時開通，可於『我的收藏』搭配正片同步聆聽；數位商品恕不退款。",
    "returns": "數位／電子商品售出後恕不退款，詳情請見商品說明。",
    "related": [
      "masterclass-editing-rhythm",
      "digital-program-deluxe-edition",
      "ztor-intro-ringtone-pack"
    ]
  },
  "digital-program-deluxe-edition": {
    "description": "完整收錄選角訪談、分鏡手稿與美術概念圖的數位場刊，PDF 保留排版的呼吸，EPUB 讓你在通勤路上也能慢慢翻。像把首映夜帶回家的那本冊子，只是這次永遠不會弄丟。",
    "specs": [
      {
        "k": "檔案格式",
        "v": "PDF＋EPUB 雙版本"
      },
      {
        "k": "頁數",
        "v": "約 96 頁典藏版面"
      },
      {
        "k": "內容",
        "v": "訪談、分鏡、概念圖、幕後側拍"
      },
      {
        "k": "相容平台",
        "v": "電腦、平板、電子閱讀器"
      }
    ],
    "shipping": "購買後於帳戶內即時開通，PDF 與 EPUB 皆可於『我的收藏』下載；數位商品恕不退款。",
    "returns": "數位／電子商品售出後恕不退款，詳情請見商品說明。",
    "related": [
      "director-commentary-unlock",
      "yearly-viewing-report-poster",
      "masterclass-editing-rhythm"
    ]
  },
  "ztor-intro-ringtone-pack": {
    "description": "把熟悉的片頭音效裁成八段鈴聲與提示音，從燈暗那一刻的低鳴到字卡浮現的清脆。每次手機響起，就像戲院的燈又為你暗了下來。",
    "specs": [
      {
        "k": "檔案格式",
        "v": "M4R（iOS）＋MP3（Android）"
      },
      {
        "k": "音質",
        "v": "320 kbps 立體聲"
      },
      {
        "k": "數量",
        "v": "8 段鈴聲與提示音"
      },
      {
        "k": "相容平台",
        "v": "iPhone、Android 通用"
      }
    ],
    "shipping": "購買後於帳戶內即時開通，可於『我的收藏』下載各系統格式；數位商品恕不退款。",
    "returns": "數位／電子商品售出後恕不退款，詳情請見商品說明。",
    "related": [
      "classic-quotes-sticker-pack",
      "director-commentary-unlock",
      "ztor-4k-wallpaper-collection"
    ]
  },
  "masterclass-editing-rhythm": {
    "description": "由資深剪輯師帶你拆解節奏如何決定一場戲的呼吸，從留白的勇氣到一刀切換的時機，附可下載的範例片段練習。看完之後重看任何電影，你會開始聽見剪接的心跳。",
    "specs": [
      {
        "k": "檔案格式",
        "v": "1080p MP4 串流課程"
      },
      {
        "k": "時數",
        "v": "6 單元，共約 3.5 小時"
      },
      {
        "k": "附件",
        "v": "範例素材包＋章節講義 PDF"
      },
      {
        "k": "授權範圍",
        "v": "綁定帳戶無限次觀看"
      }
    ],
    "shipping": "購買後於帳戶內即時開通，可於『我的收藏』隨時續看並下載講義；數位商品恕不退款。",
    "returns": "數位／電子商品售出後恕不退款，詳情請見商品說明。",
    "related": [
      "director-commentary-unlock",
      "digital-program-deluxe-edition",
      "yearly-viewing-report-poster"
    ]
  },
  "virtual-premiere-avatar-frames": {
    "description": "為線上首映禮設計的十款動態頭像框，光影沿著邊緣緩緩流動，像紅毯旁那圈打在你身上的聚光燈。換上它，這場首映就有你的名字。",
    "specs": [
      {
        "k": "檔案格式",
        "v": "動態 PNG／靜態 PNG（去背）"
      },
      {
        "k": "解析度",
        "v": "1024 × 1024 px 圓形與方形"
      },
      {
        "k": "數量",
        "v": "10 款頭像框"
      },
      {
        "k": "相容平台",
        "v": "社群頭像與 Ztor. 站內檔案"
      }
    ],
    "shipping": "購買後於帳戶內即時開通，可於『我的收藏』套用或下載；數位商品恕不退款。",
    "returns": "數位／電子商品售出後恕不退款，詳情請見商品說明。",
    "related": [
      "digital-collector-card-pack",
      "classic-quotes-sticker-pack",
      "yearly-viewing-report-poster"
    ]
  },
  "yearly-viewing-report-poster": {
    "description": "把你這一年看過的每一部片、待過的每一場戲，化成一張可客製的數位海報，色塊與字體都隨你的觀影軌跡生成。是只屬於你的一年片單，也是一封寫給自己的電影情書。",
    "specs": [
      {
        "k": "檔案格式",
        "v": "PNG 高解析＋PDF 列印檔"
      },
      {
        "k": "解析度",
        "v": "A2 尺寸（300dpi 可印）"
      },
      {
        "k": "客製欄位",
        "v": "觀影清單、總時數、年度代表作"
      },
      {
        "k": "授權範圍",
        "v": "個人收藏與自行列印"
      }
    ],
    "shipping": "購買後依你的觀影紀錄即時生成，可於『我的收藏』下載與重新匯出；數位商品恕不退款。",
    "returns": "數位／電子商品售出後恕不退款，詳情請見商品說明。",
    "related": [
      "ztor-4k-wallpaper-collection",
      "digital-program-deluxe-edition",
      "virtual-premiere-avatar-frames"
    ]
  },
  "premiere-double-ticket": {
    "description": "專屬首映之夜的雙人套票，於正式上映前搶先入座，與創作團隊同處一室感受燈暗那一刻的屏息。座位安排於影廳中段最佳視野區，散場另附導演簽名場刊一份，留下這晚的紀念。",
    "specs": [
      {
        "k": "場次",
        "v": "首映當晚 19:30（提前 30 分鐘入場）"
      },
      {
        "k": "地點",
        "v": "台北光點戲院 大廳影廳"
      },
      {
        "k": "人數",
        "v": "雙人套票（2 人入場）"
      },
      {
        "k": "附件",
        "v": "導演簽名場刊 ×1、迎賓飲品 ×2"
      }
    ],
    "shipping": "電子票券，購票後寄送至帳戶與註冊 Email；採實名制入場，請攜帶證件核對。",
    "returns": "首映席次有限，售出恕不退換；如本人無法出席，可於開演前 24 小時將票券轉讓他人，並更新入場者姓名。",
    "related": [
      "midnight-classic-single-ticket",
      "director-qa-session-ticket",
      "private-screening-experience"
    ]
  },
  "midnight-classic-single-ticket": {
    "description": "在夜深人靜的午夜場，獨自走進影廳重看一部經典，讓膠卷的顆粒與微微雜訊把你帶回初看時的心情。單人入場，座位自由選擇，適合想安靜地與一部老片獨處的夜晚。",
    "specs": [
      {
        "k": "場次",
        "v": "每週五、六 23:45 午夜場"
      },
      {
        "k": "片長",
        "v": "約 110–135 分鐘（依當期片單）"
      },
      {
        "k": "地點",
        "v": "西門町 二輪戲院 2 廳"
      },
      {
        "k": "座位",
        "v": "單人自由入座（不劃位）"
      }
    ],
    "shipping": "電子票券，購票後寄送至帳戶與註冊 Email；憑手機 QR Code 於午夜場入口掃碼入場。",
    "returns": "午夜場票券售出後不接受退款，惟開演前可自行轉讓，受讓者憑同一 QR Code 入場即可。",
    "related": [
      "premiere-double-ticket",
      "open-air-screening-picnic-combo",
      "projection-room-tour"
    ]
  },
  "projection-room-tour": {
    "description": "走進平時謝絕參觀的膠卷放映室，看資深放映師親手裝片、對焦、換捲，聽機械運轉的低鳴如何撐起整場光影。導覽全程約一小時，名額極少，讓你貼近電影最古老也最迷人的那道光源。",
    "specs": [
      {
        "k": "時長",
        "v": "約 60 分鐘導覽"
      },
      {
        "k": "人數",
        "v": "每場限 8 人（小團制）"
      },
      {
        "k": "地點",
        "v": "中山堂 35mm 膠卷放映室"
      },
      {
        "k": "須知",
        "v": "室內機具高溫，請著長褲與包覆式鞋款"
      }
    ],
    "shipping": "電子票券，購票後寄送至帳戶與註冊 Email；實名制入場，現場核對證件與場次。",
    "returns": "導覽名額有限，票券售出後恕不退換；若臨時無法到場，可於前一日將名額轉讓並更新參加者姓名。",
    "related": [
      "cinema-backstage-tech-tour",
      "dubbing-workshop-experience",
      "midnight-classic-single-ticket"
    ]
  },
  "director-qa-session-ticket": {
    "description": "放映結束後留下來，聽導演親口聊那些剪進與剪掉的決定，現場開放提問與創作者直接對話。本場座談名額已全數售罄，僅保留候補登記，若有釋出席次將依序通知。",
    "specs": [
      {
        "k": "場次",
        "v": "映後座談 約 50 分鐘（含 Q&A）"
      },
      {
        "k": "地點",
        "v": "信義 誠品電影院 廳內"
      },
      {
        "k": "人數",
        "v": "單人入場"
      },
      {
        "k": "狀態",
        "v": "已售完，開放候補登記"
      }
    ],
    "shipping": "電子票券，購票後寄送至帳戶與註冊 Email；實名制入場，候補釋出席次將另行寄送通知。",
    "returns": "本場已售完，候補席次一經確認即售出不退；確認後若無法出席，可於開演前 24 小時轉讓並更新入場姓名。",
    "related": [
      "premiere-double-ticket",
      "private-screening-experience",
      "annual-fan-festival-pass"
    ]
  },
  "private-screening-experience": {
    "description": "把整座影廳留給你和最重要的人，自選一部想一起看的電影，在無人打擾的暗房裡共享兩小時的專注。最多容納 20 人，可預約調光與字幕設定，是慶生、求婚或單純任性的一晚最體面的選擇。",
    "specs": [
      {
        "k": "人數",
        "v": "包場 1–20 人"
      },
      {
        "k": "時長",
        "v": "含入場與放映約 3 小時"
      },
      {
        "k": "地點",
        "v": "私人放映廳（台北市區，預約後告知地址）"
      },
      {
        "k": "附件",
        "v": "片單自選 ×1、迎賓爆米花與飲品（10 人份）"
      }
    ],
    "shipping": "電子票券，購票後寄送至帳戶與註冊 Email；採實名制，由訂購人核對身分後統一帶領入場。",
    "returns": "包場需提前安排場地與人力，確認後恕不退款；如需改期可於 7 日前申請一次免費更動場次。",
    "related": [
      "premiere-double-ticket",
      "director-qa-session-ticket",
      "open-air-screening-picnic-combo"
    ]
  },
  "open-air-screening-picnic-combo": {
    "description": "在草地上鋪開野餐墊，等天色暗下、銀幕亮起，配著夜風與蟲鳴重看一部老片，把看電影變回一件露天的事。套票含兩人入場與野餐組合，從毛毯到點心一次備齊，到場坐下就好。",
    "specs": [
      {
        "k": "場次",
        "v": "夏季週末 黃昏入場、19:30 開演"
      },
      {
        "k": "地點",
        "v": "大佳河濱公園 露天草坪區"
      },
      {
        "k": "人數",
        "v": "雙人入場"
      },
      {
        "k": "附件",
        "v": "野餐毛毯 ×1、手作點心盒 ×2、保溫飲品 ×2"
      }
    ],
    "shipping": "電子票券，購票後寄送至帳戶與註冊 Email；憑 QR Code 於草坪入口換取野餐組合並入場。",
    "returns": "露天場次若遇天候取消將全額退款或改期；非天候因素之個人取消恕不退費，可自行轉讓席次。",
    "related": [
      "midnight-classic-single-ticket",
      "private-screening-experience",
      "annual-fan-festival-pass"
    ]
  },
  "dubbing-workshop-experience": {
    "description": "戴上耳機、站到麥克風前，跟著經典片段練習對嘴與情緒，由資深配音員帶你體會聲音如何賦予角色第二次生命。工作坊全程約兩小時，現場錄下你的版本，帶走一段屬於自己的配音檔。",
    "specs": [
      {
        "k": "時長",
        "v": "約 120 分鐘（含實錄）"
      },
      {
        "k": "人數",
        "v": "每場限 10 人"
      },
      {
        "k": "地點",
        "v": "內湖 專業配音錄音室"
      },
      {
        "k": "附件",
        "v": "個人配音錄音檔（WAV 格式）×1"
      }
    ],
    "shipping": "電子票券，購票後寄送至帳戶與註冊 Email；實名制入場，個人錄音檔於課後寄至註冊信箱。",
    "returns": "工作坊席次有限，售出後不接受退款；如無法出席可於 3 日前申請改期一次，或轉讓他人參加。",
    "related": [
      "projection-room-tour",
      "cinema-backstage-tech-tour",
      "annual-fan-festival-pass"
    ]
  },
  "cinema-backstage-tech-tour": {
    "description": "穿過售票口與紅絨幕後的那道門，走進控制室與音響機房，看一場放映背後的調光、聲場與訊號是如何被悄悄校準的。導覽由技術團隊親自帶領，全程約九十分鐘，揭開戲院最安靜也最關鍵的後台。",
    "specs": [
      {
        "k": "時長",
        "v": "約 90 分鐘導覽"
      },
      {
        "k": "人數",
        "v": "每場限 12 人"
      },
      {
        "k": "地點",
        "v": "台中 大型數位影城 後台機房"
      },
      {
        "k": "須知",
        "v": "機房需保持安靜，禁止使用閃光燈拍攝"
      }
    ],
    "shipping": "電子票券，購票後寄送至帳戶與註冊 Email；實名制入場，現場核對證件後由技術人員帶領進入後台。",
    "returns": "後台導覽涉及場地調度，票券售出恕不退換；若臨時不克前往，可於前一日轉讓名額並更新參加者資料。",
    "related": [
      "projection-room-tour",
      "dubbing-workshop-experience",
      "annual-fan-festival-pass"
    ]
  },
  "annual-fan-festival-pass": {
    "description": "一張通行證走完整年度影迷祭，從放映、講座到深夜場與限定市集都能自由穿梭，把一整季的電影時光都收進口袋。憑證享全場次優先入座與專屬週邊兌換，是獻給真正影迷的一年之約。",
    "specs": [
      {
        "k": "效期",
        "v": "影迷祭全期通行（連續 10 天）"
      },
      {
        "k": "地點",
        "v": "全台 5 座合作戲院聯動場館"
      },
      {
        "k": "權益",
        "v": "全場次優先入座、限定週邊兌換 ×1"
      },
      {
        "k": "人數",
        "v": "單人通行（不可共用）"
      }
    ],
    "shipping": "電子票券，購票後寄送至帳戶與註冊 Email；採實名制綁定本人，入場時憑通行 QR Code 與證件核對。",
    "returns": "通行證為實名綁定，售出後恕不退款亦不可轉讓；如系統重複扣款，請聯繫客服協助核退。",
    "related": [
      "premiere-double-ticket",
      "open-air-screening-picnic-combo",
      "director-qa-session-ticket"
    ]
  },
  "ztor-popcorn-bucket-thermos": {
    "description": "以雙層 304 不鏽鋼打造爆米花桶的圓潤輪廓，桶身保留紅白條紋的戲院記憶，握在手心仍是熟悉的散場溫度。旋蓋密封不漏、冷熱皆宜，把那份在黑暗中等待燈亮的儀式感，留在每天的桌邊。",
    "specs": [
      {
        "k": "材質",
        "v": "304 食品級不鏽鋼雙層真空"
      },
      {
        "k": "容量",
        "v": "480ml"
      },
      {
        "k": "保溫保冷",
        "v": "保溫 6 小時／保冷 12 小時"
      },
      {
        "k": "產地",
        "v": "台灣設計、中國製造"
      }
    ],
    "shipping": "下單後 3–5 個工作天內出貨；台灣本島滿 NT$1,000 免運，離島與海外運費另計。",
    "returns": "商品到貨 7 天內可申請退換，杯體須維持完整、未經使用並保留原包裝。",
    "related": [
      "popcorn-scented-candle",
      "countdown-leader-wall-clock",
      "cinema-velvet-cushion-red"
    ]
  },
  "countdown-leader-wall-clock": {
    "description": "錶面取自老膠卷片頭的倒數刻度，5、4、3 的環狀數字隨指針緩緩走過，像每一場電影開演前的那段靜默。靜音掃秒不擾人，掛在牆上，讓時間也帶著放映室的節奏。",
    "specs": [
      {
        "k": "材質",
        "v": "霧面金屬框＋鋼化玻璃鏡面"
      },
      {
        "k": "尺寸",
        "v": "直徑 30cm／厚 4.2cm"
      },
      {
        "k": "機芯",
        "v": "日本石英靜音掃秒機芯"
      },
      {
        "k": "電力",
        "v": "1 顆 3 號電池（未隨附）"
      }
    ],
    "shipping": "下單後約 3–5 個工作天安排出貨；本島單筆滿 NT$1,000 免運，外島與國際地區運費另行計算。",
    "returns": "收到商品 7 日內可退換，須保持鏡面與機芯完好未使用；玻璃鏡面以防震材料包裝，運送破損可換貨。",
    "related": [
      "projector-ambient-night-light",
      "ztor-popcorn-bucket-thermos",
      "magnetic-poster-frame-a2"
    ]
  },
  "cinema-velvet-cushion-red": {
    "description": "以暗紅絲絨復刻老戲院座椅的那層觸感，絨毛在光線下會微微變色，沉穩而帶一點戲劇性。內裡填充蓬鬆回彈棉，靠著它窩進沙發，客廳就成了你的私人包廂。",
    "specs": [
      {
        "k": "表布",
        "v": "短毛絲絨（聚酯纖維）"
      },
      {
        "k": "填充",
        "v": "高回彈聚酯棉芯"
      },
      {
        "k": "尺寸",
        "v": "45 × 45cm（含枕芯）"
      },
      {
        "k": "洗滌",
        "v": "外套可拆、冷水手洗、平放陰乾"
      }
    ],
    "variants": [
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "暗紅",
            "value": "deep-red"
          },
          {
            "label": "墨綠",
            "value": "forest-green"
          },
          {
            "label": "午夜藍",
            "value": "midnight-blue"
          }
        ]
      }
    ],
    "shipping": "下單後 3–5 個工作天出貨；台灣本島滿 NT$1,000 免運，離島及海外另計運費。",
    "returns": "到貨 7 天內未使用、吊牌完整可申請退換；枕套經洗滌或拆封使用後恕不退換。",
    "related": [
      "projector-ambient-night-light",
      "popcorn-scented-candle",
      "countdown-leader-wall-clock"
    ]
  },
  "projector-ambient-night-light": {
    "description": "造型取自老式膠卷放映機，暖黃燈光從鏡頭般的開口灑出，像深夜裡那束打在銀幕上的光。三段調光可隨心轉換亮度，睡前留一盞，把房間調成散場後的微光。",
    "specs": [
      {
        "k": "材質",
        "v": "ABS 機身＋霧面導光燈罩"
      },
      {
        "k": "光源",
        "v": "內建 LED 暖白光 2700K"
      },
      {
        "k": "調光",
        "v": "三段亮度觸控切換"
      },
      {
        "k": "供電",
        "v": "USB-C 充電，續航約 8 小時"
      }
    ],
    "variants": [
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "暖黃",
            "value": "warm-amber"
          },
          {
            "label": "霧白",
            "value": "misty-white"
          }
        ]
      }
    ],
    "shipping": "下單後 3–5 個工作天內安排出貨；本島滿 NT$1,000 免運，離島與海外運費另計。",
    "returns": "收到 7 日內可退換，燈具需功能正常、配件齊全且未經使用。",
    "related": [
      "countdown-leader-wall-clock",
      "cinema-velvet-cushion-red",
      "now-showing-neon-sign"
    ]
  },
  "now-showing-neon-sign": {
    "description": "以暖紅霓虹手工彎折出「NOW SHOWING」字樣，亮起時像走進巷口那間還在營業的老戲院。低耗電 LED 霓虹軟管不發燙、壽命長，掛在牆上就為房間點亮一場永遠正在放映的場次。",
    "specs": [
      {
        "k": "材質",
        "v": "矽膠 LED 霓虹軟管＋透明壓克力底板"
      },
      {
        "k": "尺寸",
        "v": "50 × 22cm"
      },
      {
        "k": "光色",
        "v": "暖紅"
      },
      {
        "k": "供電",
        "v": "附 USB 變壓器、含壁掛配件"
      }
    ],
    "shipping": "目前已售完，暫不出貨；補貨時將依登記順序通知，本島滿 NT$1,000 免運，外島與海外另計。",
    "returns": "收到 7 天內可退換，霓虹軟管須完好未使用；以防震材料包裝寄出，若運送途中破損可換貨。",
    "related": [
      "projector-ambient-night-light",
      "countdown-leader-wall-clock",
      "magnetic-poster-frame-a2"
    ]
  },
  "popcorn-scented-candle": {
    "description": "奶油爆米花的香氣裡藏著一絲焦糖與烘烤穀物的暖意，點燃後像剛走進放映前的大廳。大豆蠟燃燒乾淨、燭火安靜，讓整個空間慢慢染上散場前那段最放鬆的時光。",
    "specs": [
      {
        "k": "蠟材",
        "v": "100% 天然大豆蠟"
      },
      {
        "k": "香調",
        "v": "奶油爆米花、焦糖、烘烤穀物"
      },
      {
        "k": "淨重",
        "v": "200g／燃燒時數約 40 小時"
      },
      {
        "k": "容器",
        "v": "霧面玻璃杯＋木質燭蓋"
      }
    ],
    "shipping": "下單後 3–5 個工作天內出貨；台灣本島單筆滿 NT$1,000 免運，離島與海外運費另計。",
    "returns": "未拆封、未點燃者可於到貨 7 日內退換；玻璃燭杯以防震包裝寄送，運送破損可申請換貨。",
    "related": [
      "ztor-popcorn-bucket-thermos",
      "cinema-velvet-cushion-red",
      "projector-ambient-night-light"
    ]
  },
  "magnetic-poster-frame-a2": {
    "description": "以一對磁吸木條夾住海報上下緣，免裱框、免打孔，換片只要幾秒，像在牆上經營一間會輪番上檔的小戲院。原木質感溫潤耐看，讓珍藏的那張海報，總能輕鬆換上最近的心頭好。",
    "specs": [
      {
        "k": "材質",
        "v": "實木夾條＋內嵌磁條"
      },
      {
        "k": "適用尺寸",
        "v": "A2（42 × 59.4cm）"
      },
      {
        "k": "配件",
        "v": "附麻繩吊掛與無痕掛勾"
      },
      {
        "k": "產地",
        "v": "台灣製造"
      }
    ],
    "variants": [
      {
        "type": "colour",
        "label": "木色",
        "options": [
          {
            "label": "原木",
            "value": "natural-oak"
          },
          {
            "label": "胡桃",
            "value": "walnut"
          }
        ]
      }
    ],
    "shipping": "下單後約 3–5 個工作天出貨；本島滿 NT$1,000 免運，離島及海外地區運費另行計算。",
    "returns": "到貨 7 天內可申請退換，木條須維持完整、未使用並保留原包裝。",
    "related": [
      "now-showing-neon-sign",
      "countdown-leader-wall-clock",
      "cinema-velvet-cushion-red"
    ]
  },

  "jay-chou-fantasy-vinyl": {
    "description": "2001 年的《范特西》是周式中國風與西洋曲風交融的起點，這張黑膠復刻版重現了當年青澀又狂放的少年杰倫。轉動唱針，〈愛在西元前〉與〈簡單愛〉的旋律便把那個夏天緩緩拉回耳邊。",
    "specs": [
      {
        "k": "規格",
        "v": "180g 重量級黑膠 LP，雙碟裝"
      },
      {
        "k": "收錄曲目",
        "v": "10 首，含〈愛在西元前〉〈簡單愛〉〈雙截棍〉"
      },
      {
        "k": "發行年份",
        "v": "2001 原版／2025 復刻"
      },
      {
        "k": "附贈",
        "v": "復刻歌詞內頁與編號收藏卡"
      }
    ],
    "related": [
      "jay-chou-yehuimei-vinyl",
      "jay-chou-november-chopin-vinyl",
      "jay-chou-vinyl-collection-box"
    ],
    "shipping": "下單後 5 至 7 個工作天出貨，黑膠以防壓硬殼專用箱配送。",
    "returns": "未拆封可於收貨 7 日內申請退換；拆封後因黑膠特性恕不接受退貨。"
  },
  "jay-chou-yehuimei-vinyl": {
    "description": "以母親之名命名的《葉惠美》，藏著〈以父之名〉的史詩感與〈晴天〉的青春惆悵。黑膠的溫潤底噪，讓那句「故事的小黃花」聽起來更像一封寫給少年時光的信。",
    "specs": [
      {
        "k": "規格",
        "v": "180g 黑膠 LP，單碟裝"
      },
      {
        "k": "收錄曲目",
        "v": "11 首，含〈晴天〉〈以父之名〉〈東風破〉"
      },
      {
        "k": "發行年份",
        "v": "2003 原版／2025 復刻"
      },
      {
        "k": "內附",
        "v": "歌詞海報一張"
      }
    ],
    "related": [
      "jay-chou-fantasy-vinyl",
      "jay-chou-november-chopin-vinyl",
      "jay-chou-secret-notebook"
    ],
    "shipping": "備貨後 5 至 7 個工作天寄出，全程使用黑膠防震包材。",
    "returns": "未拆封商品 7 日內可退換，拆封後恕不退貨。"
  },
  "jay-chou-november-chopin-vinyl": {
    "description": "《十一月的蕭邦》把古典鋼琴的優雅揉進周式情歌，〈夜曲〉與〈髮如雪〉是無數人記憶裡的旋律。這張黑膠以較高克重壓製，讓鋼琴的泛音在唱盤上更顯立體。",
    "specs": [
      {
        "k": "規格",
        "v": "200g 重量級黑膠 LP"
      },
      {
        "k": "收錄曲目",
        "v": "12 首，含〈夜曲〉〈髮如雪〉〈一路向北〉"
      },
      {
        "k": "發行年份",
        "v": "2005 原版／2025 復刻"
      },
      {
        "k": "封面工藝",
        "v": "霧面壓紋外封"
      }
    ],
    "related": [
      "jay-chou-yehuimei-vinyl",
      "jay-chou-fantasy-vinyl",
      "jay-chou-vinyl-collection-box"
    ],
    "shipping": "下單 5 至 7 個工作天內出貨，以硬殼專用箱寄送。",
    "returns": "未拆封可於 7 日內辦理退換，拆封黑膠不適用退貨。"
  },
  "jay-chou-carnival-tour-tee": {
    "description": "嘉年華巡迴限定 T 恤，把整場演唱會的霓虹與煙火收進一件棉 T 裡。穿上它，彷彿又站回那片揮舞應援燈的人海中央。",
    "specs": [
      {
        "k": "材質",
        "v": "100% 純棉，230g 厚磅"
      },
      {
        "k": "印花",
        "v": "巡演主視覺正面大圖、背面場次列表"
      },
      {
        "k": "版型",
        "v": "中性寬鬆落肩"
      },
      {
        "k": "產地",
        "v": "台灣印製"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s",
            "soldOut": false
          },
          {
            "label": "M",
            "value": "m",
            "soldOut": false
          },
          {
            "label": "L",
            "value": "l",
            "soldOut": false
          },
          {
            "label": "XL",
            "value": "xl",
            "soldOut": false
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "曜石黑",
            "value": "obsidian-black",
            "soldOut": false
          },
          {
            "label": "霧灰白",
            "value": "misty-white",
            "soldOut": false
          }
        ]
      }
    ],
    "related": [
      "jay-chou-tour-poster",
      "jay-chou-tour-lightstick",
      "jay-chou-signature-hoodie"
    ],
    "shipping": "現貨商品 3 至 5 個工作天出貨，台灣本島免運。",
    "returns": "收貨 7 日內、吊牌完整且未下水可申請退換一次。"
  },
  "jay-chou-lyrics-poster-set": {
    "description": "三入組歌詞海報，分別取自〈七里香〉〈稻香〉與〈晴天〉裡最動人的幾句詞。貼在牆上，每一行字都像把那段青春重新讀了一遍。",
    "specs": [
      {
        "k": "內容",
        "v": "海報三入，主題各異"
      },
      {
        "k": "尺寸",
        "v": "A2（420 × 594 mm）"
      },
      {
        "k": "紙質",
        "v": "200g 霧面美術紙"
      },
      {
        "k": "印刷",
        "v": "高解析無框滿版"
      }
    ],
    "related": [
      "jay-chou-tour-poster",
      "jay-chou-phone-case",
      "jay-chou-tote-bag"
    ],
    "shipping": "下單 3 至 5 個工作天寄出，海報捲入硬紙筒配送。",
    "returns": "未拆封 7 日內可退換；紙製品拆封後恕不退貨。"
  },
  "jay-chou-piano-keychain": {
    "description": "以一段黑白琴鍵為造型的金屬鑰匙圈，向那位把鋼琴彈成招牌的少年致敬。小巧地掛在包上，像隨身帶著一段未完的旋律。",
    "specs": [
      {
        "k": "材質",
        "v": "鋅合金電鍍"
      },
      {
        "k": "尺寸",
        "v": "約 6.5 cm"
      },
      {
        "k": "細節",
        "v": "黑白琴鍵琺瑯填色"
      },
      {
        "k": "重量",
        "v": "約 35g"
      }
    ],
    "related": [
      "jay-chou-acrylic-stand",
      "jay-chou-secret-notebook",
      "jay-chou-phone-case"
    ],
    "shipping": "現貨 3 至 5 個工作天出貨，小物以氣泡袋包裝寄送。",
    "returns": "收貨 7 日內，未使用且包裝完整可退換。"
  },
  "jay-chou-daoxiang-cap": {
    "description": "〈稻香〉唱的是回到最初的美好，這頂刺繡棒球帽把那株金黃稻穗繡上帽簷。戴著它走在路上，心裡彷彿也響起那句「珍惜一切，就算沒有擁有」。",
    "specs": [
      {
        "k": "材質",
        "v": "純棉斜紋布"
      },
      {
        "k": "刺繡",
        "v": "稻穗圖樣立體繡花"
      },
      {
        "k": "帽型",
        "v": "六片式硬挺帽身"
      },
      {
        "k": "調節",
        "v": "金屬扣後調帶"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "均碼",
            "value": "one-size",
            "soldOut": false
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "稻穗卡其",
            "value": "rice-khaki",
            "soldOut": false
          },
          {
            "label": "田野墨綠",
            "value": "field-green",
            "soldOut": false
          }
        ]
      }
    ],
    "related": [
      "jay-chou-carnival-tour-tee",
      "jay-chou-knit-vest",
      "jay-chou-cowboy-bandana"
    ],
    "shipping": "現貨 3 至 5 個工作天出貨，台灣本島滿額免運。",
    "returns": "收貨 7 日內、未配戴且吊牌完整可退換。"
  },
  "jay-chou-porcelain-mug": {
    "description": "取〈青花瓷〉那抹「天青色等煙雨」的釉色，做成一只可日日捧在手心的馬克杯。注入熱茶時，杯身的青藍漸層彷彿也被水氣暈染開來。",
    "specs": [
      {
        "k": "材質",
        "v": "高溫陶瓷"
      },
      {
        "k": "容量",
        "v": "380 ml"
      },
      {
        "k": "釉色",
        "v": "青花漸層手感釉"
      },
      {
        "k": "適用",
        "v": "可微波、可洗碗機"
      }
    ],
    "related": [
      "jay-chou-secret-notebook",
      "jay-chou-tote-bag",
      "jay-chou-phone-case"
    ],
    "shipping": "新品現貨 3 至 5 個工作天出貨，陶瓷以防撞泡棉包裝。",
    "returns": "未使用且包裝完整 7 日內可退換；破損請於開箱時拍照即時反映。"
  },
  "jay-chou-secret-notebook": {
    "description": "靈感來自電影《不能說的秘密》裡那架穿越時空的鋼琴，筆記本封面壓印了一段琴譜。翻開空白內頁，像在等一個只屬於你的旋律被寫下。",
    "specs": [
      {
        "k": "規格",
        "v": "A5 線圈裝"
      },
      {
        "k": "頁數",
        "v": "120 頁，五線譜與空白混排"
      },
      {
        "k": "封面",
        "v": "琴譜壓紋硬殼"
      },
      {
        "k": "內紙",
        "v": "100g 不透墨米色紙"
      }
    ],
    "related": [
      "jay-chou-piano-keychain",
      "jay-chou-porcelain-mug",
      "jay-chou-yehuimei-vinyl"
    ],
    "shipping": "現貨 3 至 5 個工作天出貨，文具以紙盒保護寄送。",
    "returns": "未拆封 7 日內可退換；拆封後因衛生考量恕不退貨。"
  },
  "jay-chou-tour-lightstick": {
    "description": "嘉年華演唱會官方應援燈，握把上印著巡演 logo，燈頭能隨節奏切換多種色彩。它陪你度過的，是黑暗中與全場一起發光的那幾個小時。",
    "specs": [
      {
        "k": "材質",
        "v": "ABS 握把＋柔光燈罩"
      },
      {
        "k": "發光",
        "v": "多段色彩可切換"
      },
      {
        "k": "電力",
        "v": "3 號電池供電（需另購）"
      },
      {
        "k": "尺寸",
        "v": "長約 32 cm"
      }
    ],
    "related": [
      "jay-chou-carnival-tour-tee",
      "jay-chou-tour-poster",
      "jay-chou-acrylic-stand"
    ],
    "shipping": "補貨後 5 至 7 個工作天出貨，含電子零件以防震包材寄送。",
    "returns": "未拆封 7 日內可退換；功能異常於收貨 14 日內提供保固換新。"
  },
  "jay-chou-signature-hoodie": {
    "description": "胸前低調印著「周同學」的親筆簽名，是給死忠粉絲的一封手寫情書。厚磅刷毛內裡讓它在演唱會散場的夜風裡，剛好暖得恰到好處。",
    "specs": [
      {
        "k": "材質",
        "v": "棉混紡，內刷毛"
      },
      {
        "k": "克重",
        "v": "380g 厚磅"
      },
      {
        "k": "印花",
        "v": "胸前簽名燙印"
      },
      {
        "k": "細節",
        "v": "雙層連帽、羅紋袖口"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s",
            "soldOut": false
          },
          {
            "label": "M",
            "value": "m",
            "soldOut": false
          },
          {
            "label": "L",
            "value": "l",
            "soldOut": false
          },
          {
            "label": "XL",
            "value": "xl",
            "soldOut": false
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "炭黑",
            "value": "charcoal",
            "soldOut": false
          },
          {
            "label": "麻花灰",
            "value": "heather-grey",
            "soldOut": false
          },
          {
            "label": "奶霜白",
            "value": "cream-white",
            "soldOut": false
          }
        ]
      }
    ],
    "related": [
      "jay-chou-carnival-tour-tee",
      "jay-chou-knit-vest",
      "jay-chou-basketball-jersey"
    ],
    "shipping": "現貨 3 至 5 個工作天出貨，台灣本島滿額免運。",
    "returns": "收貨 7 日內、未下水且吊牌完整可退換一次。"
  },
  "jay-chou-cowboy-bandana": {
    "description": "〈牛仔很忙〉的西部頑皮全收進這條印花方巾，圖樣裡藏著仙人掌與手槍的俏皮符號。綁在頸間或手腕，都是一句「快使用雙截棍」的隨身態度。",
    "specs": [
      {
        "k": "材質",
        "v": "純棉斜紋"
      },
      {
        "k": "尺寸",
        "v": "55 × 55 cm"
      },
      {
        "k": "圖樣",
        "v": "西部主題滿版印花"
      },
      {
        "k": "車工",
        "v": "四邊收邊車縫"
      }
    ],
    "related": [
      "jay-chou-daoxiang-cap",
      "jay-chou-basketball-jersey",
      "jay-chou-tote-bag"
    ],
    "shipping": "現貨 3 至 5 個工作天出貨，布製品以夾鏈袋包裝。",
    "returns": "未拆封 7 日內可退換；拆封後恕不接受退貨。"
  },
  "jay-chou-vinyl-collection-box": {
    "description": "為出道 25 週年而生的黑膠典藏盒組，把生涯代表專輯收進一只精裝外盒。它不只是音樂，更像把整個世代的青春整齊地收藏進一個抽屜。",
    "specs": [
      {
        "k": "內容",
        "v": "代表專輯黑膠多碟＋典藏冊"
      },
      {
        "k": "規格",
        "v": "180g 黑膠，精裝硬盒"
      },
      {
        "k": "限定",
        "v": "25 週年編號收藏證"
      },
      {
        "k": "附贈",
        "v": "復刻歌詞冊與紀念海報"
      }
    ],
    "related": [
      "jay-chou-fantasy-vinyl",
      "jay-chou-yehuimei-vinyl",
      "jay-chou-november-chopin-vinyl"
    ],
    "shipping": "盒組備貨 7 至 10 個工作天出貨，整組以加固木紋外箱配送。",
    "returns": "未拆封封膜 7 日內可退換；拆封後因典藏品性質恕不退貨。"
  },
  "jay-chou-acrylic-stand": {
    "description": "「周同學」造型壓克力立牌，把舞台上那個戴帽抱吉他的身影縮成桌上小景。擺在書桌一角，加班的夜裡也彷彿有人替你哼著〈晴天〉。",
    "specs": [
      {
        "k": "材質",
        "v": "高透壓克力"
      },
      {
        "k": "尺寸",
        "v": "高約 12 cm"
      },
      {
        "k": "底座",
        "v": "可拆式透明卡榫底座"
      },
      {
        "k": "印刷",
        "v": "雙面 UV 彩印"
      }
    ],
    "related": [
      "jay-chou-piano-keychain",
      "jay-chou-tour-lightstick",
      "jay-chou-secret-notebook"
    ],
    "shipping": "現貨 3 至 5 個工作天出貨，附保護膜防刮包裝。",
    "returns": "收貨 7 日內、未撕保護膜且完整可退換。"
  },
  "jay-chou-tour-poster": {
    "description": "嘉年華巡演主視覺海報，霓虹字體與摩天輪剪影把整場演出的歡騰定格成一張畫面。展開貼上牆，房間瞬間也有了演唱會散場前的微醺。",
    "specs": [
      {
        "k": "尺寸",
        "v": "B1（707 × 1000 mm）"
      },
      {
        "k": "紙質",
        "v": "250g 亮面海報紙"
      },
      {
        "k": "設計",
        "v": "巡演官方主視覺"
      },
      {
        "k": "印刷",
        "v": "滿版高解析輸出"
      }
    ],
    "related": [
      "jay-chou-lyrics-poster-set",
      "jay-chou-carnival-tour-tee",
      "jay-chou-tour-lightstick"
    ],
    "shipping": "現貨 3 至 5 個工作天出貨，海報以硬紙筒捲裝寄送。",
    "returns": "未拆封 7 日內可退換；紙製品拆封後恕不退貨。"
  },
  "jay-chou-knit-vest": {
    "description": "靈感取自〈等你下課〉的校園青澀，一件學院風針織背心把暗戀的羞怯織進紋理。套在白襯衫外，就像回到那個在教室外等鐘聲的午後。",
    "specs": [
      {
        "k": "材質",
        "v": "棉混紡針織"
      },
      {
        "k": "版型",
        "v": "V 領合身學院版"
      },
      {
        "k": "織紋",
        "v": "菱格提花"
      },
      {
        "k": "季節",
        "v": "春秋適穿"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s",
            "soldOut": false
          },
          {
            "label": "M",
            "value": "m",
            "soldOut": false
          },
          {
            "label": "L",
            "value": "l",
            "soldOut": false
          },
          {
            "label": "XL",
            "value": "xl",
            "soldOut": false
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "學院藏青",
            "value": "navy",
            "soldOut": false
          },
          {
            "label": "粉筆米白",
            "value": "chalk-beige",
            "soldOut": false
          }
        ]
      }
    ],
    "related": [
      "jay-chou-signature-hoodie",
      "jay-chou-daoxiang-cap",
      "jay-chou-carnival-tour-tee"
    ],
    "shipping": "新品現貨 3 至 5 個工作天出貨，台灣本島滿額免運。",
    "returns": "收貨 7 日內、未下水且吊牌完整可申請退換。"
  },
  "jay-chou-basketball-jersey": {
    "description": "把〈鬥牛〉裡那股街頭籃球的熱血穿上身，球衣背號與印花都帶著少年逞強的痞氣。無論上場或日常，它都喊著那句「想要去河南嵩山」的不服輸。",
    "specs": [
      {
        "k": "材質",
        "v": "速乾排汗網眼布"
      },
      {
        "k": "版型",
        "v": "寬鬆無袖球衣"
      },
      {
        "k": "印花",
        "v": "胸前隊徽、背面號碼"
      },
      {
        "k": "機能",
        "v": "透氣導汗處理"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s",
            "soldOut": false
          },
          {
            "label": "M",
            "value": "m",
            "soldOut": false
          },
          {
            "label": "L",
            "value": "l",
            "soldOut": false
          },
          {
            "label": "XL",
            "value": "xl",
            "soldOut": false
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "球場紅",
            "value": "court-red",
            "soldOut": false
          },
          {
            "label": "夜場黑",
            "value": "night-black",
            "soldOut": false
          }
        ]
      }
    ],
    "related": [
      "jay-chou-signature-hoodie",
      "jay-chou-knit-vest",
      "jay-chou-cowboy-bandana"
    ],
    "shipping": "現貨 3 至 5 個工作天出貨，台灣本島滿額免運。",
    "returns": "收貨 7 日內、未下水且吊牌完整可退換一次。"
  },
  "jay-chou-phone-case": {
    "description": "〈七里香〉的花卉爬滿手機殼背面，淡淡的粉與綠像那年初夏的窗台。每次拿起手機，都像聞到一句「窗外的麻雀，在電線桿上多嘴」。",
    "specs": [
      {
        "k": "材質",
        "v": "軍規防摔軟硬殼"
      },
      {
        "k": "圖樣",
        "v": "七里香花卉印花"
      },
      {
        "k": "防護",
        "v": "四角氣囊、鏡頭加高邊框"
      },
      {
        "k": "相容",
        "v": "支援多款主流機型"
      }
    ],
    "related": [
      "jay-chou-lyrics-poster-set",
      "jay-chou-tote-bag",
      "jay-chou-porcelain-mug"
    ],
    "shipping": "現貨 3 至 5 個工作天出貨，請於結帳備註機型。",
    "returns": "未拆封 7 日內可退換；客製機型確認後恕不退貨。"
  },
  "jay-chou-tote-bag": {
    "description": "以〈簡單愛〉為題的帆布托特包，手寫字體印著那句「想簡簡單單愛你」。容量俐落好裝，日常背著它，就像把一段乾淨的喜歡隨身帶在身邊。",
    "specs": [
      {
        "k": "材質",
        "v": "12 安士厚帆布"
      },
      {
        "k": "尺寸",
        "v": "約 38 × 40 cm"
      },
      {
        "k": "印花",
        "v": "歌詞手寫字燙印"
      },
      {
        "k": "細節",
        "v": "內袋一格、加長提把"
      }
    ],
    "related": [
      "jay-chou-phone-case",
      "jay-chou-lyrics-poster-set",
      "jay-chou-cowboy-bandana"
    ],
    "shipping": "現貨 3 至 5 個工作天出貨，台灣本島滿額免運。",
    "returns": "收貨 7 日內、未使用且吊牌完整可退換。"
  },
  "jay-chou-puzzle": {
    "description": "以《最偉大的作品》主視覺製成的 1000 片拼圖，把那場跨越美術史的音樂奇想攤在桌上。一片片拼起，像陪著鋼琴前的他，重新走進那幅超現實的畫。",
    "specs": [
      {
        "k": "片數",
        "v": "1000 片"
      },
      {
        "k": "完成尺寸",
        "v": "約 50 × 75 cm"
      },
      {
        "k": "材質",
        "v": "環保紙板加厚裱面"
      },
      {
        "k": "附件",
        "v": "完成參考海報一張"
      }
    ],
    "related": [
      "jay-chou-tour-poster",
      "jay-chou-lyrics-poster-set",
      "jay-chou-acrylic-stand"
    ],
    "shipping": "現貨 3 至 5 個工作天出貨，盒裝以防壓紙箱配送。",
    "returns": "未拆封 7 日內可退換；拆封後因缺片難以核對恕不退貨。"
  },
  "nicholas-tse-viva-live-vinyl": {
    "description": "《Viva Live》是謝霆鋒把搖滾現場灌進溝槽的一張黑膠，從前奏的鼓點到尾聲的吉他餘震，都像把你重新拉回那個汗水與燈光交織的舞台夜晚。雙碟收錄演唱會完整曲序，附跨頁歌詞內頁與限量編號卡，留聲機轉動時，熱血彷彿從未冷卻。",
    "specs": [
      {
        "k": "規格",
        "v": "180g 雙黑膠 / 33⅓ 轉"
      },
      {
        "k": "收錄",
        "v": "《Viva Live》演唱會完整曲序"
      },
      {
        "k": "附件",
        "v": "跨頁歌詞內頁 + 限量編號卡"
      },
      {
        "k": "產地",
        "v": "日本壓片"
      }
    ],
    "related": [
      "nicholas-tse-love-vinyl",
      "nicholas-tse-tour-tee",
      "nicholas-tse-lightstick"
    ],
    "shipping": "香港、台灣同步出貨，黑膠專用防壓硬殼包裝，下單後 5–7 個工作天送達。",
    "returns": "封膜未拆可於收貨 7 天內申請退換；拆封後僅接受瑕疵換貨。"
  },
  "nicholas-tse-chef-apron": {
    "description": "這件圍裙來自《鋒味》的廚房，是謝霆鋒在鏡頭前後最常繫上的那種重磅棉麻，洗得越久反而越有手感。胸前低調繡上「鋒味」字樣，從爆炒到擺盤，讓你也能把對料理的全力以赴穿在身上。",
    "specs": [
      {
        "k": "材質",
        "v": "棉麻混紡 12oz"
      },
      {
        "k": "設計",
        "v": "胸前「鋒味」刺繡 + 雙側口袋"
      },
      {
        "k": "綁帶",
        "v": "可調節頸帶與長腰帶"
      },
      {
        "k": "尺寸",
        "v": "均一尺寸"
      }
    ],
    "related": [
      "nicholas-tse-chef-tool-set",
      "nicholas-tse-hot-sauce",
      "nicholas-tse-cookie-gift-box"
    ],
    "shipping": "全球配送，平整折疊附防塵收納袋，3–6 個工作天到貨。",
    "returns": "未使用且吊牌完整者，14 天內可退換貨。"
  },
  "nicholas-tse-cookie-gift-box": {
    "description": "鋒味曲奇延續《鋒味》一貫的講究，奶油香氣與酥鬆口感是謝霆鋒親自把關的配方，每一口都嚐得到那份不將就。鐵盒以舞台金與廚房黑撞色設計，吃完還能收納小物，是送給同樣熱愛生活的人的心意。",
    "specs": [
      {
        "k": "內容",
        "v": "原味、可可、海鹽三款共 24 片"
      },
      {
        "k": "包裝",
        "v": "可重複使用金屬鐵盒"
      },
      {
        "k": "保存",
        "v": "常溫陰涼處 90 天"
      },
      {
        "k": "產地",
        "v": "香港製造"
      }
    ],
    "related": [
      "nicholas-tse-hot-sauce",
      "nicholas-tse-chef-apron",
      "nicholas-tse-chef-tool-set"
    ],
    "shipping": "食品類常溫宅配，避免高溫時段送達，台港 3–5 個工作天。",
    "returns": "食品基於衛生考量，非瑕疵恕不退換；破損或受潮請拍照於 48 小時內聯繫客服。"
  },
  "nicholas-tse-tour-tee": {
    "description": "這件巡演限定 T 恤把舞台主視覺印上前胸後背，背面是那句「活著就要全力以赴」的手寫字，像把當晚的吶喊縫進了棉布裡。重磅純棉剪裁俐落，無論去下一場演出還是日常上街，都帶著一點搖滾的不羈。",
    "specs": [
      {
        "k": "材質",
        "v": "100% 精梳純棉 220g"
      },
      {
        "k": "版型",
        "v": "中性寬鬆落肩"
      },
      {
        "k": "印花",
        "v": "前胸主視覺 + 背面手寫標語"
      },
      {
        "k": "洗滌",
        "v": "翻面冷水機洗"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "舞台黑",
            "value": "stage-black"
          },
          {
            "label": "煙灰",
            "value": "smoke-grey"
          }
        ]
      }
    ],
    "related": [
      "nicholas-tse-collab-tee",
      "nicholas-tse-lightstick",
      "nicholas-tse-butterfly-hoodie"
    ],
    "shipping": "台港地區 3–5 個工作天送達，滿額免運。",
    "returns": "未下水、吊牌齊全者 7 天內可換尺寸一次；個人因素退貨需自付運費。"
  },
  "nicholas-tse-guitar-pick-set": {
    "description": "這組撥片復刻謝霆鋒舞台上慣用的厚度與弧度，每片印上他的簽名與不同年份的巡演字樣，握在指間就能想起那些燃燒的吉他 solo。隨盒附上絨布收納袋，是給樂迷與彈奏者都剛剛好的小小信物。",
    "specs": [
      {
        "k": "內容",
        "v": "撥片 5 片（厚度 0.73mm / 0.88mm）"
      },
      {
        "k": "材質",
        "v": "Celluloid 賽璐珞"
      },
      {
        "k": "印刷",
        "v": "簽名 + 巡演年份"
      },
      {
        "k": "附件",
        "v": "絨布收納袋"
      }
    ],
    "related": [
      "nicholas-tse-guitar-keychain",
      "nicholas-tse-viva-live-vinyl",
      "nicholas-tse-tour-tee"
    ],
    "shipping": "輕量小物，台港 3–5 個工作天，可併入其他商品合併寄送。",
    "returns": "商品本身完好者 7 天內可退換；拆封後如有缺片請於收貨當日反映。"
  },
  "nicholas-tse-rider-jacket": {
    "description": "這件騎士外套呼應謝霆鋒最搖滾的舞台年代，厚實植鞣皮革帶著時間才養得出的光澤，肩線與拉鍊細節都做得硬挺有態度。內裡縫上低調的鋒字織標，穿上它，街頭就是你的舞台。",
    "specs": [
      {
        "k": "材質",
        "v": "頭層牛皮 / 滌綸內裡"
      },
      {
        "k": "版型",
        "v": "修身機車剪裁"
      },
      {
        "k": "細節",
        "v": "斜插金屬拉鍊 + 內裡鋒字織標"
      },
      {
        "k": "保養",
        "v": "避免雨淋，定期皮革保養油"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "經典黑",
            "value": "classic-black"
          }
        ]
      }
    ],
    "related": [
      "nicholas-tse-butterfly-hoodie",
      "nicholas-tse-embroidered-cap",
      "nicholas-tse-tour-tee"
    ],
    "shipping": "高單價皮件採加固紙箱配送並附保價，台港 5–7 個工作天。",
    "returns": "未拆吊牌、無穿著痕跡者 14 天內可退換；皮革如有原廠瑕疵免費換貨。"
  },
  "nicholas-tse-photo-book": {
    "description": "《鋒迴路轉》收錄謝霆鋒從舞台、片場到廚房的多重身影，攝影師以自然光捕捉他卸下面具的瞬間，每一頁都是一段路途的註腳。精裝裝幀搭配啞面藝術紙，翻閱時像走進他這些年的轉折與堅持。",
    "specs": [
      {
        "k": "頁數",
        "v": "全彩 168 頁"
      },
      {
        "k": "裝幀",
        "v": "精裝硬殼 + 啞面藝術紙"
      },
      {
        "k": "尺寸",
        "v": "24 × 30 cm"
      },
      {
        "k": "語言",
        "v": "中英對照圖說"
      }
    ],
    "related": [
      "nicholas-tse-movie-poster",
      "nicholas-tse-poster-set",
      "nicholas-tse-acrylic-stand"
    ],
    "shipping": "精裝書採書角護角包裝防撞，台港 5–7 個工作天送達。",
    "returns": "封膜完整未拆者 7 天內可退；拆封後僅接受印刷瑕疵或缺頁換貨。"
  },
  "nicholas-tse-movie-poster": {
    "description": "《證人》復刻海報重現謝霆鋒奪下影帝的那個雨夜，冷峻的藍灰調與他眼神裡的掙扎，把整部戲的張力凝在一張紙上。採用電影級厚磅紙印製，裱框掛上牆，客廳也能有片場的氣場。",
    "specs": [
      {
        "k": "尺寸",
        "v": "61 × 91.5 cm（A1）"
      },
      {
        "k": "紙材",
        "v": "200g 啞面海報紙"
      },
      {
        "k": "工藝",
        "v": "高解析四色印刷"
      },
      {
        "k": "附件",
        "v": "未裱框，附防潮收納筒"
      }
    ],
    "related": [
      "nicholas-tse-poster-set",
      "nicholas-tse-photo-book",
      "nicholas-tse-phone-case"
    ],
    "shipping": "海報以硬式紙筒捲裝，台港 3–6 個工作天，避免折損。",
    "returns": "收貨 7 天內未裱、未書寫者可退換；運送壓痕請於收貨當日拍照反映。"
  },
  "nicholas-tse-hot-sauce": {
    "description": "鋒味秘製辣醬走的是先香後辣的層次，蒜香與發酵辣椒在舌尖慢慢鋪開，是謝霆鋒在廚房裡反覆試味才定下的比例。拌麵、沾餃、炒飯都對味，一瓶就能讓家常菜多一分鋒味的講究。",
    "specs": [
      {
        "k": "容量",
        "v": "180g 玻璃瓶裝"
      },
      {
        "k": "辣度",
        "v": "中辣（先香後辣）"
      },
      {
        "k": "成分",
        "v": "發酵辣椒、蒜、植物油，無添加防腐劑"
      },
      {
        "k": "保存",
        "v": "開封後冷藏 30 天"
      }
    ],
    "related": [
      "nicholas-tse-chef-apron",
      "nicholas-tse-cookie-gift-box",
      "nicholas-tse-chef-tool-set"
    ],
    "shipping": "玻璃瓶採氣泡布加固，食品常溫宅配，台港 3–5 個工作天。",
    "returns": "食品未開封且包裝完好者 7 天內可退；瓶身破損請於收貨 48 小時內附照聯繫。"
  },
  "nicholas-tse-embroidered-cap": {
    "description": "這頂棒球帽把一個立體刺繡的「鋒」字放在正面，針腳飽滿，是低調卻一眼能認出的態度。可調節後扣讓頭圍自在，從練團室到街頭再到廚房，都是他那份隨性的延伸。",
    "specs": [
      {
        "k": "材質",
        "v": "純棉斜紋布"
      },
      {
        "k": "設計",
        "v": "正面立體「鋒」字刺繡"
      },
      {
        "k": "調節",
        "v": "金屬扣後調節帶"
      },
      {
        "k": "尺寸",
        "v": "均碼（頭圍 56–60cm）"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "均碼",
            "value": "one-size"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "墨黑",
            "value": "ink-black"
          },
          {
            "label": "卡其",
            "value": "khaki"
          },
          {
            "label": "軍綠",
            "value": "army-green"
          }
        ]
      }
    ],
    "related": [
      "nicholas-tse-rider-jacket",
      "nicholas-tse-tour-tee",
      "nicholas-tse-collab-tee"
    ],
    "shipping": "台港地區 3–5 個工作天，帽型以填充紙球防壓寄送。",
    "returns": "未配戴、吊牌完整者 7 天內可退換；個人因素退貨自付運費。"
  },
  "nicholas-tse-butterfly-hoodie": {
    "description": "玉蝴蝶帽 T 取自那張同名專輯的意象，背後一隻展翅的蝴蝶以漸層印花鋪展，像把少年時的鋒芒輕輕收進羽翼。內刷毛厚磅布料保暖耐穿，是給老歌迷的一封溫柔情書。",
    "specs": [
      {
        "k": "材質",
        "v": "棉混內刷毛 320g"
      },
      {
        "k": "版型",
        "v": "寬鬆連帽落肩"
      },
      {
        "k": "印花",
        "v": "背面漸層玉蝴蝶圖樣"
      },
      {
        "k": "細節",
        "v": "雙層帽口 + 袋鼠口袋"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "霧黑",
            "value": "misty-black"
          },
          {
            "label": "深靛藍",
            "value": "deep-indigo"
          }
        ]
      }
    ],
    "related": [
      "nicholas-tse-tour-tee",
      "nicholas-tse-rider-jacket",
      "nicholas-tse-love-vinyl"
    ],
    "shipping": "台港地區 3–5 個工作天送達，滿額免運。",
    "returns": "未下水、吊牌齊全者 7 天內可換一次尺寸；瑕疵免費換貨。"
  },
  "nicholas-tse-chef-tool-set": {
    "description": "這組三件廚房道具沿用《鋒味》節目裡的選物標準，從主廚刀到木鏟都講求手感與重心，握起來就懂為什麼他總說工具是料理的一半。胡桃木與不鏽鋼的組合耐用又好看，新手與老饕都能上手。",
    "specs": [
      {
        "k": "內容",
        "v": "主廚刀、木鏟、料理夾各一"
      },
      {
        "k": "材質",
        "v": "高碳不鏽鋼 + 胡桃木柄"
      },
      {
        "k": "包裝",
        "v": "磁吸收納禮盒"
      },
      {
        "k": "保養",
        "v": "刀具手洗擦乾，木件定期上油"
      }
    ],
    "related": [
      "nicholas-tse-chef-apron",
      "nicholas-tse-hot-sauce",
      "nicholas-tse-cookie-gift-box"
    ],
    "shipping": "刀具類加固包裝並依法妥善封裝，台港 5–7 個工作天送達。",
    "returns": "基於衛生與安全，刀具開封後非瑕疵恕不退換；未拆封者 7 天內可退。"
  },
  "nicholas-tse-lightstick": {
    "description": "這支應援燈以舞台麥克風為輪廓，握柄處壓上謝霆鋒的簽名，亮起時是一片溫熱的琥珀光。內建多段燈效可隨節奏切換，下一次站在台下，讓它替你把這些年的支持照亮整個場館。",
    "specs": [
      {
        "k": "燈效",
        "v": "恆亮 / 呼吸 / 閃爍三段"
      },
      {
        "k": "電源",
        "v": "三號電池 ×2（未隨附）"
      },
      {
        "k": "材質",
        "v": "ABS 防摔機身"
      },
      {
        "k": "附件",
        "v": "可拆腕帶"
      }
    ],
    "related": [
      "nicholas-tse-tour-tee",
      "nicholas-tse-viva-live-vinyl",
      "nicholas-tse-acrylic-stand"
    ],
    "shipping": "含電池倉電子品，台港 3–6 個工作天，氣泡防護包裝。",
    "returns": "功能完好者 7 天內可退換；無法開機請於收貨當日聯繫客服換貨。"
  },
  "nicholas-tse-acrylic-stand": {
    "description": "這款壓克力立牌定格謝霆鋒一個經典的舞台造型，手持麥克風、燈光從側面打來，連衣襬的弧度都印得清晰。透明壓克力加底座好擺好收，書桌、層架隨手一放，舞台就在你手邊。",
    "specs": [
      {
        "k": "尺寸",
        "v": "高約 15cm"
      },
      {
        "k": "材質",
        "v": "3mm 透明壓克力 + 卡榫底座"
      },
      {
        "k": "印刷",
        "v": "雙面 UV 彩印"
      },
      {
        "k": "包裝",
        "v": "保護膜 + 紙盒"
      }
    ],
    "related": [
      "nicholas-tse-lightstick",
      "nicholas-tse-guitar-keychain",
      "nicholas-tse-photo-book"
    ],
    "shipping": "輕量小物，台港 3–5 個工作天，可與其他商品合併寄送。",
    "returns": "保護膜未撕、無刮痕者 7 天內可退換；運送破損請於收貨當日附照反映。"
  },
  "nicholas-tse-guitar-keychain": {
    "description": "這枚鑰匙圈把謝霆鋒舞台上的那把電吉他縮成掌心大小，琴身金屬烤漆帶著一點冷冽的金屬光，連弦與旋鈕都做出細節。掛在鑰匙或背包上，是隨身帶著的一段搖滾記憶。",
    "specs": [
      {
        "k": "材質",
        "v": "鋅合金電鍍"
      },
      {
        "k": "尺寸",
        "v": "全長約 8cm"
      },
      {
        "k": "工藝",
        "v": "立體烤漆 + 仿真琴弦"
      },
      {
        "k": "配件",
        "v": "防鬆環扣"
      }
    ],
    "related": [
      "nicholas-tse-guitar-pick-set",
      "nicholas-tse-acrylic-stand",
      "nicholas-tse-tote-bag"
    ],
    "shipping": "輕量小物，台港 3–5 個工作天，可合併寄送。",
    "returns": "商品完好者 7 天內可退換；鍍層瑕疵請於收貨當日聯繫換貨。"
  },
  "nicholas-tse-tote-bag": {
    "description": "鋒味帆布托特包用厚磅胚布做底，正面印上「鋒味」與一抹爐火插畫，是把廚房裡的熱氣帶上街的隨性提案。容量裝得下食材、樂譜或一天的瑣碎，越用越軟、越用越有味道。",
    "specs": [
      {
        "k": "材質",
        "v": "14oz 厚磅帆布"
      },
      {
        "k": "尺寸",
        "v": "38 × 40 × 10cm"
      },
      {
        "k": "設計",
        "v": "正面「鋒味」爐火插畫印花"
      },
      {
        "k": "細節",
        "v": "內袋 + 加寬肩帶"
      }
    ],
    "related": [
      "nicholas-tse-chef-apron",
      "nicholas-tse-guitar-keychain",
      "nicholas-tse-phone-case"
    ],
    "shipping": "台港地區 3–5 個工作天，平整折疊寄送。",
    "returns": "未使用、吊牌完整者 7 天內可退換；個人因素退貨自付運費。"
  },
  "nicholas-tse-love-vinyl": {
    "description": "《因為愛所以愛》黑膠復刻把謝霆鋒最熾烈的情歌重新刻回模擬訊號，溫暖的類比聲底讓那份少年式的深情更顯飽滿。封套復刻當年設計並附歌詞夾頁，唱針落下，整個世紀末的悸動又回來了。",
    "specs": [
      {
        "k": "規格",
        "v": "180g 黑膠 / 33⅓ 轉"
      },
      {
        "k": "收錄",
        "v": "《因為愛所以愛》原專輯曲目"
      },
      {
        "k": "封套",
        "v": "復刻原版設計 + 歌詞夾頁"
      },
      {
        "k": "產地",
        "v": "歐洲壓片"
      }
    ],
    "related": [
      "nicholas-tse-viva-live-vinyl",
      "nicholas-tse-butterfly-hoodie",
      "nicholas-tse-poster-set"
    ],
    "shipping": "黑膠專用防壓硬殼包裝，台港 5–7 個工作天送達。",
    "returns": "封膜未拆可於收貨 7 天內退換；拆封後僅接受瑕疵換貨。"
  },
  "nicholas-tse-phone-case": {
    "description": "這款手機殼以謝霆鋒的舞台剪影為主圖，逆光中的他握著麥克風，背景是一束灑落的聚光。霧面防滑殼身耐刮耐摔，每次拿起手機，都像把那一刻的光影握在手心。",
    "specs": [
      {
        "k": "材質",
        "v": "霧面 TPU + 硬質背板"
      },
      {
        "k": "防護",
        "v": "四角氣囊抗摔"
      },
      {
        "k": "印刷",
        "v": "舞台剪影 UV 彩印"
      },
      {
        "k": "相容",
        "v": "iPhone / Android 主流機型"
      }
    ],
    "related": [
      "nicholas-tse-acrylic-stand",
      "nicholas-tse-tote-bag",
      "nicholas-tse-movie-poster"
    ],
    "shipping": "下單請備註手機型號，台港 3–6 個工作天，輕量包裝。",
    "returns": "未使用、型號正確者 7 天內可退換；型號備註錯誤恕無法退貨。"
  },
  "nicholas-tse-poster-set": {
    "description": "這組兩入歌詞海報選了謝霆鋒兩首代表作的關鍵句，以極簡排版搭配手寫筆觸，讓歌詞本身成為牆上的風景。厚磅啞面紙印製，無論貼在練團室還是書房，都讓那些唱過的句子日日相伴。",
    "specs": [
      {
        "k": "內容",
        "v": "歌詞主題海報 2 張"
      },
      {
        "k": "尺寸",
        "v": "42 × 59.4 cm（A2）"
      },
      {
        "k": "紙材",
        "v": "180g 啞面海報紙"
      },
      {
        "k": "附件",
        "v": "防潮收納筒"
      }
    ],
    "related": [
      "nicholas-tse-movie-poster",
      "nicholas-tse-photo-book",
      "nicholas-tse-love-vinyl"
    ],
    "shipping": "海報以硬式紙筒捲裝，台港 3–6 個工作天，避免折損。",
    "returns": "未裱、未書寫者收貨 7 天內可退換；運送壓痕請於收貨當日反映。"
  },
  "nicholas-tse-collab-tee": {
    "description": "這件鋒味聯名黑 T 把舞台與廚房兩個世界縫在一起，胸前小標是吉他與鍋鏟交疊的趣味設計，背後印著那句屬於他的生活哲學。素黑底色百搭好穿，是給橫跨樂迷與食客的你最剛好的一件。",
    "specs": [
      {
        "k": "材質",
        "v": "100% 純棉 200g"
      },
      {
        "k": "版型",
        "v": "中性合身"
      },
      {
        "k": "印花",
        "v": "胸前聯名小標 + 背面標語"
      },
      {
        "k": "洗滌",
        "v": "翻面冷水機洗"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "純黑",
            "value": "pure-black"
          },
          {
            "label": "炭灰",
            "value": "charcoal"
          }
        ]
      }
    ],
    "related": [
      "nicholas-tse-tour-tee",
      "nicholas-tse-chef-apron",
      "nicholas-tse-embroidered-cap"
    ],
    "shipping": "台港地區 3–5 個工作天送達，滿額免運。",
    "returns": "未下水、吊牌齊全者 7 天內可換尺寸一次；個人因素退貨需自付運費。"
  },
  "eason-chan-u87-vinyl": {
    "description": "2005 年專輯《U87》的黑膠復刻版本，收錄〈浮誇〉〈夕陽無限好〉等被一整代人記得的歌。從唱針落下的第一秒起，那些熟悉的旋律就會把你帶回某個再也回不去的下午。",
    "specs": [
      {
        "k": "規格",
        "v": "12 吋黑膠雙碟 33⅓ rpm"
      },
      {
        "k": "發行年份",
        "v": "2005（2025 復刻）"
      },
      {
        "k": "重量",
        "v": "180g 重盤壓製"
      },
      {
        "k": "附件",
        "v": "復刻歌詞內頁一份"
      }
    ],
    "related": [
      "eason-chan-fad-photobook",
      "eason-chan-lyrics-poster",
      "eason-chan-vinyl-box"
    ],
    "shipping": "全臺與港澳專人配送，黑膠以防壓硬殼包裝，下單後 3–5 個工作天出貨。",
    "returns": "非人為損壞之破損或瑕疵，可於收貨 7 天內申請換貨；拆封後恕不退款。"
  },
  "eason-chan-duo-tour-tee": {
    "description": "為紀念 DUO 世界巡迴而做的限定 T 恤，把那一夜舞台的光影印在胸前。穿上它，就像把整場演唱會的溫度一起帶回家。",
    "specs": [
      {
        "k": "材質",
        "v": "100% 純棉 200g"
      },
      {
        "k": "版型",
        "v": "中性寬鬆剪裁"
      },
      {
        "k": "印花",
        "v": "DUO 巡演主視覺絹印"
      },
      {
        "k": "產地",
        "v": "台灣製造"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "墨黑",
            "value": "ink-black"
          },
          {
            "label": "霧白",
            "value": "misty-white"
          }
        ]
      }
    ],
    "related": [
      "eason-chan-fad-hoodie",
      "eason-chan-white-tee",
      "eason-chan-duo-cap"
    ],
    "shipping": "台港同步出貨，現貨商品 2–4 個工作天送達。",
    "returns": "未下水、未剪吊牌可於 7 天內換尺寸；individually 客製印花商品恕不退款。"
  },
  "eason-chan-fad-photobook": {
    "description": "Fear and Dreams 巡演的官方攝影集，收錄舞台上那些汗水與靜默並存的瞬間。一頁一頁翻過去，像重新走進那座被燈光填滿的夜晚。",
    "specs": [
      {
        "k": "頁數",
        "v": "全彩 168 頁"
      },
      {
        "k": "尺寸",
        "v": "240 × 300mm 精裝"
      },
      {
        "k": "印刷",
        "v": "進口藝術紙四色印刷"
      },
      {
        "k": "語言",
        "v": "中英對照"
      }
    ],
    "related": [
      "eason-chan-u87-vinyl",
      "eason-chan-fad-hoodie",
      "eason-chan-stage-puzzle"
    ],
    "shipping": "精裝書以氣泡防護包裝，台港地區 3–5 個工作天送達。",
    "returns": "印刷瑕疵或運送破損,可於收貨 7 天內換貨；拆封閱讀後恕不退款。"
  },
  "eason-chan-lyrics-poster": {
    "description": "把〈浮誇〉最揪心的那段詞印成海報，黑底燙白的字像深夜裡仍亮著的一盞燈。貼在牆上，每次抬頭都是一次小小的釋放。",
    "specs": [
      {
        "k": "尺寸",
        "v": "A2（420 × 594mm）"
      },
      {
        "k": "紙質",
        "v": "200g 啞光美術紙"
      },
      {
        "k": "設計",
        "v": "歌詞手寫風排版"
      },
      {
        "k": "包裝",
        "v": "硬管捲筒包裝"
      }
    ],
    "related": [
      "eason-chan-poster-set",
      "eason-chan-phone-case",
      "eason-chan-u87-vinyl"
    ],
    "shipping": "海報以硬紙管捲裝寄送，避免摺痕，台港 3–5 個工作天到貨。",
    "returns": "運送造成的摺損或破損可於 7 天內換貨；無瑕疵商品恕不退換。"
  },
  "eason-chan-ten-years-mug": {
    "description": "以〈十年〉為名的紀念馬克杯，杯身一圈淡淡的歌詞，陪你度過每個還在想念某個人的早晨。倒進熱水的瞬間，時間彷彿也慢了下來。",
    "specs": [
      {
        "k": "容量",
        "v": "350ml"
      },
      {
        "k": "材質",
        "v": "高溫白瓷"
      },
      {
        "k": "圖樣",
        "v": "〈十年〉歌詞環繞印刷"
      },
      {
        "k": "適用",
        "v": "可微波、可洗碗機"
      }
    ],
    "related": [
      "eason-chan-notebook",
      "eason-chan-tote-bag",
      "eason-chan-mic-keychain"
    ],
    "shipping": "陶瓷品以防震泡棉包裝，台港地區 3–5 個工作天送達。",
    "returns": "收到時若破裂請保留外箱拍照，7 天內可換貨；使用後恕不退款。"
  },
  "eason-chan-mic-keychain": {
    "description": "向〈K歌之王〉致敬的金屬麥克風鑰匙圈，小巧地掛在包上，像隨身帶著一個唱不完的舞台。指尖摩挲時，總會想起某次跟著大合唱的夜。",
    "specs": [
      {
        "k": "材質",
        "v": "鋅合金電鍍"
      },
      {
        "k": "尺寸",
        "v": "全長約 7cm"
      },
      {
        "k": "工藝",
        "v": "立體浮雕麥克風造型"
      },
      {
        "k": "配件",
        "v": "防刮龍蝦扣"
      }
    ],
    "related": [
      "eason-chan-acrylic-stand",
      "eason-chan-pattern-socks",
      "eason-chan-ten-years-mug"
    ],
    "shipping": "小件配件以氣泡袋包裝，台港地區 2–4 個工作天送達。",
    "returns": "電鍍瑕疵可於收貨 7 天內換貨；拆封使用後恕不退款。"
  },
  "eason-chan-bucket-hat": {
    "description": "Eason 私服愛戴的漁夫帽款，低調的剪裁配上素淨的繡標，怎麼搭都不費力。壓低帽簷的那一刻，城市的喧囂彷彿也跟著安靜。",
    "specs": [
      {
        "k": "材質",
        "v": "棉質斜紋布"
      },
      {
        "k": "尺寸",
        "v": "頭圍約 57–59cm"
      },
      {
        "k": "細節",
        "v": "側邊小字繡標"
      },
      {
        "k": "產地",
        "v": "台灣製造"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "均碼",
            "value": "one-size"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "卡其",
            "value": "khaki"
          },
          {
            "label": "炭灰",
            "value": "charcoal"
          },
          {
            "label": "墨黑",
            "value": "ink-black"
          }
        ]
      }
    ],
    "related": [
      "eason-chan-duo-cap",
      "eason-chan-pattern-socks",
      "eason-chan-tote-bag"
    ],
    "shipping": "帽款以防壓盒裝寄送，台港地區 2–4 個工作天送達。",
    "returns": "未拆吊牌、未配戴可於 7 天內換色或換貨；配戴後恕不退款。"
  },
  "eason-chan-vinyl-box": {
    "description": "集結 Eason 廣東歌時期經典的黑膠典藏盒組，從早期到近作一次收齊，是樂迷書架上最重的那一格。每翻出一張，都是一段跟著他長大的歲月。",
    "specs": [
      {
        "k": "內容",
        "v": "黑膠 5 張 + 典藏外盒"
      },
      {
        "k": "規格",
        "v": "12 吋 180g 重盤"
      },
      {
        "k": "附件",
        "v": "編號收藏卡一張"
      },
      {
        "k": "限量",
        "v": "全球編號限定"
      }
    ],
    "related": [
      "eason-chan-u87-vinyl",
      "eason-chan-cd-collection",
      "eason-chan-fad-photobook"
    ],
    "shipping": "典藏盒組以雙層硬箱包裝，台港地區 3–7 個工作天送達。",
    "returns": "整組未拆封可於收貨 7 天內退換；拆封後僅接受瑕疵換貨。"
  },
  "eason-chan-fad-hoodie": {
    "description": "Fear and Dreams 主視覺帽 T，把巡演那份在恐懼與夢想之間擺盪的情緒穿在身上。厚實的棉料像一個擁抱，冷天裡格外安心。",
    "specs": [
      {
        "k": "材質",
        "v": "320g 純棉內刷毛"
      },
      {
        "k": "版型",
        "v": "落肩寬鬆連帽"
      },
      {
        "k": "印花",
        "v": "FAD 巡演主視覺"
      },
      {
        "k": "細節",
        "v": "雙層帽簷與羅紋袖口"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "深炭灰",
            "value": "deep-charcoal"
          },
          {
            "label": "霧藍",
            "value": "misty-blue"
          }
        ]
      }
    ],
    "related": [
      "eason-chan-duo-tour-tee",
      "eason-chan-fad-photobook",
      "eason-chan-white-tee"
    ],
    "shipping": "現貨帽 T 台港同步出貨，2–4 個工作天送達。",
    "returns": "未下水、吊牌完整可於 7 天內換尺寸或換色；穿著後恕不退款。"
  },
  "eason-chan-tote-bag": {
    "description": "黑白灰三色拼接的帆布托特包，配色一如 Eason 歌裡那種不張揚的細膩。容量寬裕，裝得下一天的瑣碎，也裝得下一張剛買的黑膠。",
    "specs": [
      {
        "k": "材質",
        "v": "12 安加厚帆布"
      },
      {
        "k": "尺寸",
        "v": "38 × 40 × 10cm"
      },
      {
        "k": "設計",
        "v": "黑白灰拼色印刷"
      },
      {
        "k": "細節",
        "v": "內袋與磁扣設計"
      }
    ],
    "related": [
      "eason-chan-bucket-hat",
      "eason-chan-ten-years-mug",
      "eason-chan-notebook"
    ],
    "shipping": "帆布袋以環保紙袋包裝，台港地區 2–4 個工作天送達。",
    "returns": "未使用、標籤完整可於收貨 7 天內換貨；使用後恕不退款。"
  },
  "eason-chan-acrylic-stand": {
    "description": "把演唱會上 Eason 的招牌站姿做成壓克力立牌，擺在桌邊就像有個小小舞台一直亮著。每次工作累了抬頭，都能被那份從容稍微撐住一下。",
    "specs": [
      {
        "k": "材質",
        "v": "高透壓克力"
      },
      {
        "k": "尺寸",
        "v": "高約 15cm"
      },
      {
        "k": "工藝",
        "v": "雙面 UV 印刷"
      },
      {
        "k": "配件",
        "v": "可拆式底座"
      }
    ],
    "related": [
      "eason-chan-mic-keychain",
      "eason-chan-phone-case",
      "eason-chan-stage-puzzle"
    ],
    "shipping": "立牌附保護膜並以硬紙夾板包裝，台港地區 2–4 個工作天送達。",
    "returns": "運送破損可於收貨 7 天內換貨；撕除保護膜後恕不退款。"
  },
  "eason-chan-lightstick": {
    "description": "巡演現場人手一支的官方應援燈，燈亮起的瞬間，整個場館成了一片會呼吸的星海。即使散場很久，它仍記得那晚你跟著揮動的節奏。",
    "specs": [
      {
        "k": "材質",
        "v": "ABS 防滑握柄"
      },
      {
        "k": "電源",
        "v": "3 號電池 ×2（不附）"
      },
      {
        "k": "燈效",
        "v": "多段色彩切換"
      },
      {
        "k": "尺寸",
        "v": "全長約 24cm"
      }
    ],
    "related": [
      "eason-chan-acrylic-stand",
      "eason-chan-duo-cap",
      "eason-chan-fad-photobook"
    ],
    "shipping": "應援燈以防震盒裝寄送，補貨到貨後 5–7 個工作天出貨。",
    "returns": "功能瑕疵可於收貨 7 天內換貨；拆封使用後恕不退款。"
  },
  "eason-chan-pattern-socks": {
    "description": "印滿 Eason 專屬小圖樣的中筒襪，藏在鞋裡的低調小巧思，是只有自己知道的小確幸。走起路來，連腳步都帶著一點旋律感。",
    "specs": [
      {
        "k": "材質",
        "v": "精梳棉混紡"
      },
      {
        "k": "尺寸",
        "v": "均碼 22–27cm"
      },
      {
        "k": "款式",
        "v": "中筒提花圖樣"
      },
      {
        "k": "入數",
        "v": "兩雙一組"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "均碼",
            "value": "one-size"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "黑灰組",
            "value": "black-grey"
          },
          {
            "label": "米白組",
            "value": "off-white"
          }
        ]
      }
    ],
    "related": [
      "eason-chan-bucket-hat",
      "eason-chan-mic-keychain",
      "eason-chan-tote-bag"
    ],
    "shipping": "襪款以夾鏈袋包裝，台港地區 2–4 個工作天送達。",
    "returns": "基於衛生考量，襪類拆封後不予退換；未拆封可於 7 天內換貨。"
  },
  "eason-chan-duo-cap": {
    "description": "繡上 DUO 字樣的棒球帽，車線俐落、版型挺括，是把那場巡演記憶戴在頭上的方式。壓低帽簷出門，整個人都多了點舞台的篤定。",
    "specs": [
      {
        "k": "材質",
        "v": "棉質斜紋布"
      },
      {
        "k": "尺寸",
        "v": "後扣可調 56–60cm"
      },
      {
        "k": "細節",
        "v": "DUO 立體刺繡"
      },
      {
        "k": "帽型",
        "v": "六片硬挺帽身"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "均碼",
            "value": "one-size"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "純黑",
            "value": "pure-black"
          },
          {
            "label": "奶茶",
            "value": "milk-tea"
          }
        ]
      }
    ],
    "related": [
      "eason-chan-bucket-hat",
      "eason-chan-duo-tour-tee",
      "eason-chan-fad-hoodie"
    ],
    "shipping": "帽款以防壓盒裝寄送，台港地區 2–4 個工作天送達。",
    "returns": "未配戴、吊牌完整可於 7 天內換色或換貨；配戴後恕不退款。"
  },
  "eason-chan-notebook": {
    "description": "以〈不想放手〉為靈感的燙金筆記本，封面那行字像是替你說出了沒能說出口的話。內頁留白，等著你把那些放不下的事，慢慢寫下來。",
    "specs": [
      {
        "k": "尺寸",
        "v": "A5（148 × 210mm）"
      },
      {
        "k": "頁數",
        "v": "內頁 120 頁"
      },
      {
        "k": "裝幀",
        "v": "硬殼燙金封面"
      },
      {
        "k": "內頁",
        "v": "米色點陣紙"
      }
    ],
    "related": [
      "eason-chan-ten-years-mug",
      "eason-chan-tote-bag",
      "eason-chan-lyrics-poster"
    ],
    "shipping": "筆記本以氣泡袋包裝，台港地區 2–4 個工作天送達。",
    "returns": "印刷或裝幀瑕疵可於收貨 7 天內換貨；書寫使用後恕不退款。"
  },
  "eason-chan-phone-case": {
    "description": "把〈浮誇〉舞台的剪影做成手機殼，黑底裡那束聚光燈，是替每個渴望被看見的人留的光。握在手心，像隨身帶著一段不肯認輸的故事。",
    "specs": [
      {
        "k": "材質",
        "v": "軍規防摔軟邊"
      },
      {
        "k": "印刷",
        "v": "舞台剪影 UV 印刷"
      },
      {
        "k": "機型",
        "v": "iPhone／Android 主流款"
      },
      {
        "k": "細節",
        "v": "鏡頭加高防護"
      }
    ],
    "related": [
      "eason-chan-acrylic-stand",
      "eason-chan-lyrics-poster",
      "eason-chan-mic-keychain"
    ],
    "shipping": "手機殼接單後製作，台港地區 4–6 個工作天送達。",
    "returns": "客製機型商品恕不退換；印刷瑕疵或破損可於 7 天內補寄。"
  },
  "eason-chan-poster-set": {
    "description": "精選 Eason 三張經典專輯封面集結成海報三入組，把那些陪你走過低潮的封面一次掛上牆。光是並排看著，就是一段被音樂接住的時光。",
    "specs": [
      {
        "k": "入數",
        "v": "三張一組"
      },
      {
        "k": "尺寸",
        "v": "每張 A3（297 × 420mm）"
      },
      {
        "k": "紙質",
        "v": "200g 啞光美術紙"
      },
      {
        "k": "包裝",
        "v": "硬管捲筒包裝"
      }
    ],
    "related": [
      "eason-chan-lyrics-poster",
      "eason-chan-u87-vinyl",
      "eason-chan-cd-collection"
    ],
    "shipping": "海報以硬紙管捲裝寄送避免摺痕，台港地區 3–5 個工作天送達。",
    "returns": "運送摺損可於收貨 7 天內換貨；無瑕疵商品恕不退換。"
  },
  "eason-chan-white-tee": {
    "description": "以〈與你常在〉為名的純白 T 恤，胸前一行小字，像一句輕輕說給遠方某人的話。素得乾淨，卻把那份惦念穿得剛剛好。",
    "specs": [
      {
        "k": "材質",
        "v": "100% 精梳棉 180g"
      },
      {
        "k": "版型",
        "v": "中性合身剪裁"
      },
      {
        "k": "印花",
        "v": "歌名小字水印印花"
      },
      {
        "k": "產地",
        "v": "台灣製造"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "純白",
            "value": "pure-white"
          },
          {
            "label": "燕麥",
            "value": "oatmeal"
          }
        ]
      }
    ],
    "related": [
      "eason-chan-duo-tour-tee",
      "eason-chan-fad-hoodie",
      "eason-chan-tote-bag"
    ],
    "shipping": "現貨 T 恤台港同步出貨，2–4 個工作天送達。",
    "returns": "未下水、未剪吊牌可於 7 天內換尺寸或換色；穿著後恕不退款。"
  },
  "eason-chan-stage-puzzle": {
    "description": "把 Fear and Dreams 舞台主視覺拆成 1000 片拼圖，一塊一塊拼回那個被燈光點亮的夜晚。當最後一片落定，整座舞台彷彿又重新為你亮起。",
    "specs": [
      {
        "k": "片數",
        "v": "1000 片"
      },
      {
        "k": "完成尺寸",
        "v": "50 × 75cm"
      },
      {
        "k": "材質",
        "v": "加厚環保紙板"
      },
      {
        "k": "附件",
        "v": "完成參考海報一張"
      }
    ],
    "related": [
      "eason-chan-fad-photobook",
      "eason-chan-fad-hoodie",
      "eason-chan-acrylic-stand"
    ],
    "shipping": "拼圖以硬盒包裝，台港地區 3–5 個工作天送達。",
    "returns": "缺片或印刷瑕疵可於收貨 7 天內補寄或換貨；拆封後恕不退款。"
  },
  "eason-chan-cd-collection": {
    "description": "從出道作一路收錄的紀念 CD 套裝，是 Eason 二十餘年歌路最完整的縮影。一張張放進播放器，等於把整段華語流行的記憶重聽一遍。",
    "specs": [
      {
        "k": "內容",
        "v": "精選專輯 CD 套裝"
      },
      {
        "k": "裝幀",
        "v": "紙盒精裝典藏版"
      },
      {
        "k": "附件",
        "v": "復刻歌詞本一冊"
      },
      {
        "k": "編號",
        "v": "限量收藏編號"
      }
    ],
    "related": [
      "eason-chan-vinyl-box",
      "eason-chan-u87-vinyl",
      "eason-chan-poster-set"
    ],
    "shipping": "CD 套裝以防壓硬盒包裝，補貨到貨後 5–7 個工作天出貨。",
    "returns": "整組未拆封可於收貨 7 天內退換；拆封後僅接受瑕疵換貨。"
  },
  "jacky-cheung-kiss-goodbye-vinyl": {
    "description": "1993 年的《吻別》在轉盤上重新呼吸，那把把離別唱成永恆的嗓音，如今刻進每一道黑膠的紋路裡。前奏一落，整個九十年代的月台與燈光彷彿都回到了你的房間。",
    "specs": [
      {
        "k": "規格",
        "v": "180g 雙碟黑膠 LP"
      },
      {
        "k": "收錄",
        "v": "《吻別》《一路上有你》等十首"
      },
      {
        "k": "復刻",
        "v": "原始母帶修復・霧面內袋"
      },
      {
        "k": "轉速",
        "v": "33⅓ RPM"
      }
    ],
    "related": [
      "jacky-cheung-vinyl-box",
      "jacky-cheung-vinyl-keychain",
      "jacky-cheung-cd-collection"
    ],
    "shipping": "下單後 7 至 10 個工作天出貨，黑膠以防震硬殼包裝寄出。",
    "returns": "非人為損壞之七日內可換貨，拆封後恕不退款。"
  },
  "jacky-cheung-snow-wolf-program": {
    "description": "1997 年《雪狼湖》開創華語音樂劇先河，這本場刊復刻了當年舞台的雪景與胡狼的眼神。翻開它，寧靜雪原與寧瑪的歌聲又在指尖之間流轉。",
    "specs": [
      {
        "k": "頁數",
        "v": "全彩 64 頁"
      },
      {
        "k": "內容",
        "v": "劇照・分場介紹・幕後手記"
      },
      {
        "k": "尺寸",
        "v": "A4 直式"
      },
      {
        "k": "裝幀",
        "v": "啞光裱褙・線裝"
      }
    ],
    "related": [
      "jacky-cheung-photobook",
      "jacky-cheung-poster-set",
      "jacky-cheung-notebook"
    ],
    "shipping": "備貨後 5 個工作天內寄出，附硬卡防折保護。",
    "returns": "印刷品瑕疵可於七日內換貨，恕不接受退款。"
  },
  "jacky-cheung-tour-tee": {
    "description": "為「60+」世界巡迴而生的紀念 T 恤，把那場橫跨數年、場場滿座的演出收進一件衣服的厚度裡。穿上它，像是再次站在那片為歌神亮起的燈海之中。",
    "specs": [
      {
        "k": "材質",
        "v": "100% 精梳純棉"
      },
      {
        "k": "印刷",
        "v": "正面巡演主標・背面場次列表"
      },
      {
        "k": "版型",
        "v": "中性寬鬆剪裁"
      },
      {
        "k": "厚度",
        "v": "210gsm 厚磅"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "墨黑",
            "value": "ink-black"
          },
          {
            "label": "霧灰",
            "value": "fog-grey"
          }
        ]
      }
    ],
    "related": [
      "jacky-cheung-tour-hoodie",
      "jacky-cheung-concert-tee",
      "jacky-cheung-embroidered-cap"
    ],
    "shipping": "新品預計 7 個工作天內出貨，台港皆採掛號配送。",
    "returns": "未水洗、吊牌完整可於十四日內換尺寸，個人因素退貨需自付運費。"
  },
  "jacky-cheung-photobook": {
    "description": "從寶麗金時期的青澀到「60+」舞台上的從容，這本攝影集用四十年的影像，記錄歌神每一次彎腰謝幕的認真。每一頁都是一場不曾缺席的演出。",
    "specs": [
      {
        "k": "頁數",
        "v": "全彩精裝 168 頁"
      },
      {
        "k": "內容",
        "v": "歷年舞台・後台・寫真"
      },
      {
        "k": "尺寸",
        "v": "260 × 300 mm"
      },
      {
        "k": "印刷",
        "v": "進口紙・燙銀書名"
      }
    ],
    "related": [
      "jacky-cheung-snow-wolf-program",
      "jacky-cheung-poster-set",
      "jacky-cheung-vinyl-box"
    ],
    "shipping": "備貨後 5 至 7 個工作天寄出，外加書盒與防潮膜。",
    "returns": "收到後七日內如有裝幀瑕疵可換新品，恕不退款。"
  },
  "jacky-cheung-lyrics-poster": {
    "description": "《一千個傷心的理由》的字句沿著海報緩緩流下，那是 1993 年無數人單曲循環的傷心註腳。掛在牆上，像把一整個失戀的夜晚收進了畫框。",
    "specs": [
      {
        "k": "尺寸",
        "v": "A1（594 × 841 mm）"
      },
      {
        "k": "紙質",
        "v": "啞面藝術紙 200gsm"
      },
      {
        "k": "設計",
        "v": "手寫體歌詞排版"
      },
      {
        "k": "包裝",
        "v": "圓筒捲裝"
      }
    ],
    "related": [
      "jacky-cheung-poster-set",
      "jacky-cheung-photobook",
      "jacky-cheung-mug"
    ],
    "shipping": "下單後 5 個工作天內以海報筒寄出，避免摺痕。",
    "returns": "運送破損請於三日內拍照申請換貨，不含個人因素退貨。"
  },
  "jacky-cheung-mug": {
    "description": "晨間的第一杯熱茶，倒進這只印著歌神剪影的馬克杯裡，蒸氣升起時彷彿也哼起了那段熟悉的旋律。日常裡最安靜的一份陪伴。",
    "specs": [
      {
        "k": "容量",
        "v": "350 ml"
      },
      {
        "k": "材質",
        "v": "陶瓷・釉面印刷"
      },
      {
        "k": "圖樣",
        "v": "歌神舞台剪影"
      },
      {
        "k": "適用",
        "v": "可微波・可洗碗機"
      }
    ],
    "related": [
      "jacky-cheung-tote-bag",
      "jacky-cheung-notebook",
      "jacky-cheung-vinyl-keychain"
    ],
    "shipping": "下單後 5 個工作天內出貨，杯身以氣泡布包覆防撞。",
    "returns": "破損請於收貨三日內提供開箱影片換貨，恕不退款。"
  },
  "jacky-cheung-scarf": {
    "description": "演唱會尾聲，當《她來聽我的演唱會》響起，這條應援絲巾在燈海裡輕輕揚起，連成一片溫柔的潮水。散場後圍在頸間，那份感動還留著餘溫。",
    "specs": [
      {
        "k": "尺寸",
        "v": "180 × 50 cm"
      },
      {
        "k": "材質",
        "v": "輕磅雪紡"
      },
      {
        "k": "印花",
        "v": "巡演主視覺・燙金簽名"
      },
      {
        "k": "重量",
        "v": "約 75g 易收納"
      }
    ],
    "related": [
      "jacky-cheung-lightstick",
      "jacky-cheung-tour-tee",
      "jacky-cheung-embroidered-cap"
    ],
    "shipping": "備貨後 5 個工作天內寄出，平整摺疊附收納袋。",
    "returns": "未拆封可於七日內換貨，已使用恕不退款退貨。"
  },
  "jacky-cheung-vinyl-box": {
    "description": "從《Smile》到《遙遠的她》，寶麗金時期的歌神被完整收進這只典藏盒，是八十年代香港樂壇最深情的一段時光。每一張黑膠都像一封寫給舊日的信。",
    "specs": [
      {
        "k": "內容",
        "v": "寶麗金時期黑膠 5 張"
      },
      {
        "k": "規格",
        "v": "180g LP・原版封套復刻"
      },
      {
        "k": "附件",
        "v": "編號證書・歌詞別冊"
      },
      {
        "k": "外盒",
        "v": "硬殼磁吸典藏盒"
      }
    ],
    "related": [
      "jacky-cheung-kiss-goodbye-vinyl",
      "jacky-cheung-cd-collection",
      "jacky-cheung-photobook"
    ],
    "shipping": "典藏盒採限量編號，備貨後 10 個工作天內專人配送。",
    "returns": "已開封之編號商品恕不退換，運送瑕疵另行處理。"
  },
  "jacky-cheung-embroidered-cap": {
    "description": "帽沿低調繡上「學友」二字，是給懂得的人才看得見的暗號。從演唱會到日常街頭，戴著它走，心裡始終哼著那首屬於你的歌。",
    "specs": [
      {
        "k": "材質",
        "v": "斜紋純棉"
      },
      {
        "k": "工藝",
        "v": "立體刺繡字樣"
      },
      {
        "k": "調節",
        "v": "後扣金屬可調"
      },
      {
        "k": "帽型",
        "v": "六片式彎簷棒球帽"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "均碼",
            "value": "one-size"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "炭黑",
            "value": "charcoal"
          },
          {
            "label": "卡其",
            "value": "khaki"
          },
          {
            "label": "藏青",
            "value": "navy"
          }
        ]
      }
    ],
    "related": [
      "jacky-cheung-tour-tee",
      "jacky-cheung-tour-hoodie",
      "jacky-cheung-concert-tee"
    ],
    "shipping": "下單後 5 至 7 個工作天出貨，台港皆可配送。",
    "returns": "未配戴、吊牌完整可於十四日內換貨，個人因素退貨自付運費。"
  },
  "jacky-cheung-tour-hoodie": {
    "description": "把「60+」巡迴的主視覺穿在身上，秋夜微涼時拉起帽子，像是把那片燈海一起裹進了懷裡。是給歌迷在演唱會之外，繼續取暖的一件衣服。",
    "specs": [
      {
        "k": "材質",
        "v": "棉質內刷毛"
      },
      {
        "k": "印花",
        "v": "胸前巡演主視覺"
      },
      {
        "k": "版型",
        "v": "落肩寬鬆連帽"
      },
      {
        "k": "厚度",
        "v": "320gsm 保暖磅數"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "深灰",
            "value": "dark-grey"
          },
          {
            "label": "酒紅",
            "value": "wine-red"
          }
        ]
      }
    ],
    "related": [
      "jacky-cheung-tour-tee",
      "jacky-cheung-embroidered-cap",
      "jacky-cheung-concert-tee"
    ],
    "shipping": "備貨後 7 個工作天內掛號寄出，台港同步配送。",
    "returns": "未水洗、吊牌完整可於十四日內換尺寸，已洗滌恕不退換。"
  },
  "jacky-cheung-lightstick": {
    "description": "握住它，整座場館的黑暗就有了方向，幾萬支同時亮起的微光，是歌迷對歌神最沉默也最熱烈的回應。散場後放在桌邊，仍像留著那一晚的星光。",
    "specs": [
      {
        "k": "電源",
        "v": "三號電池 ×2（附）"
      },
      {
        "k": "燈效",
        "v": "多段亮度・呼吸模式"
      },
      {
        "k": "材質",
        "v": "ABS 握柄・霧透燈罩"
      },
      {
        "k": "長度",
        "v": "約 24 cm"
      }
    ],
    "related": [
      "jacky-cheung-scarf",
      "jacky-cheung-acrylic-stand",
      "jacky-cheung-tour-tee"
    ],
    "shipping": "下單後 5 個工作天內出貨，內附防撞泡棉。",
    "returns": "功能瑕疵可於七日內換貨，人為損壞不在此限。"
  },
  "jacky-cheung-acrylic-stand": {
    "description": "歌神一個轉身的舞台造型，被定格成桌上一方小小的透明風景。放在書桌或唱片架旁，日常裡也有了一束不滅的聚光燈。",
    "specs": [
      {
        "k": "尺寸",
        "v": "立牌高約 15 cm"
      },
      {
        "k": "材質",
        "v": "高透壓克力"
      },
      {
        "k": "造型",
        "v": "舞台演出剪影"
      },
      {
        "k": "底座",
        "v": "可拆式卡榫底座"
      }
    ],
    "related": [
      "jacky-cheung-vinyl-keychain",
      "jacky-cheung-lightstick",
      "jacky-cheung-phone-case"
    ],
    "shipping": "下單後 5 個工作天內寄出，附保護膜防刮。",
    "returns": "運送破損請於三日內拍照換貨，恕不退款。"
  },
  "jacky-cheung-vinyl-keychain": {
    "description": "一張微縮的黑膠掛在鑰匙上，旋轉時連溝紋都細緻得像真的會發出聲音。把對歌神的那份喜歡，悄悄帶在每天進出門的路上。",
    "specs": [
      {
        "k": "材質",
        "v": "鋅合金電鍍"
      },
      {
        "k": "直徑",
        "v": "約 4 cm"
      },
      {
        "k": "細節",
        "v": "蝕刻溝紋・霧黑碟面"
      },
      {
        "k": "扣環",
        "v": "防鬆龍蝦扣"
      }
    ],
    "related": [
      "jacky-cheung-acrylic-stand",
      "jacky-cheung-kiss-goodbye-vinyl",
      "jacky-cheung-mug"
    ],
    "shipping": "下單後 3 至 5 個工作天內以小包寄出。",
    "returns": "瑕疵品可於七日內換貨，已使用恕不退款。"
  },
  "jacky-cheung-tote-bag": {
    "description": "為《吻別》三十週年而做的帆布托特，把那張改寫華語唱片紀錄的封面，揹進了二○二○年代的街頭。耐裝又耐看，像一段不過時的旋律。",
    "specs": [
      {
        "k": "材質",
        "v": "12 安加厚帆布"
      },
      {
        "k": "尺寸",
        "v": "38 × 40 × 10 cm"
      },
      {
        "k": "印刷",
        "v": "三十週年紀念主視覺"
      },
      {
        "k": "提把",
        "v": "加長肩揹設計"
      }
    ],
    "related": [
      "jacky-cheung-mug",
      "jacky-cheung-notebook",
      "jacky-cheung-poster-set"
    ],
    "shipping": "下單後 5 個工作天內出貨，平整摺疊寄送。",
    "returns": "未使用、吊牌完整可於十四日內換貨，已使用恕不退換。"
  },
  "jacky-cheung-notebook": {
    "description": "封面燙金的《祝福》二字，是 1993 年那句最溫柔的道別與盼望。寫下今天的心事時，彷彿也有人在耳邊輕輕說了聲珍重。",
    "specs": [
      {
        "k": "頁數",
        "v": "內頁 120 頁"
      },
      {
        "k": "內頁",
        "v": "80gsm 米色橫線"
      },
      {
        "k": "封面",
        "v": "硬殼布紋・燙金書名"
      },
      {
        "k": "尺寸",
        "v": "A5 可攤平裝幀"
      }
    ],
    "related": [
      "jacky-cheung-mug",
      "jacky-cheung-tote-bag",
      "jacky-cheung-snow-wolf-program"
    ],
    "shipping": "下單後 3 至 5 個工作天內以小包寄出。",
    "returns": "裝幀瑕疵可於七日內換貨，書寫後恕不退換。"
  },
  "jacky-cheung-phone-case": {
    "description": "歌神舉麥的剪影印在透明殼上，像隨身帶著一座永不謝幕的舞台。每次拿起手機，都能與那個熟悉的身影再見一面。",
    "specs": [
      {
        "k": "材質",
        "v": "軍規防摔 TPU"
      },
      {
        "k": "圖樣",
        "v": "歌神舞台剪影"
      },
      {
        "k": "防護",
        "v": "四角氣囊・鏡頭加高"
      },
      {
        "k": "機型",
        "v": "iPhone / 主流 Android 多型號"
      }
    ],
    "related": [
      "jacky-cheung-acrylic-stand",
      "jacky-cheung-vinyl-keychain",
      "jacky-cheung-mug"
    ],
    "shipping": "依機型備貨，下單後 5 至 7 個工作天內出貨。",
    "returns": "請於下單時確認機型，未拆封可於七日內換貨。"
  },
  "jacky-cheung-poster-set": {
    "description": "《吻別》《祝福》《真情流露》三張經典封面集成一組海報，並排掛起就是一面屬於九十年代的牆。每一張都是一個再熟悉不過的封面記憶。",
    "specs": [
      {
        "k": "數量",
        "v": "三入一組"
      },
      {
        "k": "尺寸",
        "v": "每張 A2（420 × 594 mm）"
      },
      {
        "k": "紙質",
        "v": "啞面藝術紙 200gsm"
      },
      {
        "k": "包裝",
        "v": "圓筒捲裝"
      }
    ],
    "related": [
      "jacky-cheung-lyrics-poster",
      "jacky-cheung-photobook",
      "jacky-cheung-snow-wolf-program"
    ],
    "shipping": "下單後 5 個工作天內以海報筒寄出，避免摺損。",
    "returns": "運送破損請於三日內拍照換貨，恕不退款。"
  },
  "jacky-cheung-cd-collection": {
    "description": "從《李香蘭》到《餓狼傳說》，這套金曲 CD 把歌神最常被點唱的那些名字收得齊齊整整。放進音響的那一刻，整個房間都成了你的演唱會。",
    "specs": [
      {
        "k": "內容",
        "v": "精選 CD 4 片裝"
      },
      {
        "k": "收錄",
        "v": "歷年國粵語金曲 48 首"
      },
      {
        "k": "附件",
        "v": "歌詞本・復刻紙套"
      },
      {
        "k": "外盒",
        "v": "硬殼套裝盒"
      }
    ],
    "related": [
      "jacky-cheung-vinyl-box",
      "jacky-cheung-kiss-goodbye-vinyl",
      "jacky-cheung-photobook"
    ],
    "shipping": "新品備貨後 5 至 7 個工作天內掛號寄出。",
    "returns": "未拆封可於七日內換貨，已拆封恕不退款。"
  },
  "jacky-cheung-stage-puzzle": {
    "description": "把「60+」演唱會最壯觀的那一幕舞台拆成一千片，再一片片拼回那夜的燈光與人海。完成的瞬間，像重新走過了一場散不去的演出。",
    "specs": [
      {
        "k": "片數",
        "v": "1000 片"
      },
      {
        "k": "完成尺寸",
        "v": "50 × 75 cm"
      },
      {
        "k": "圖面",
        "v": "60+ 舞台主視覺"
      },
      {
        "k": "附件",
        "v": "對照海報・分類袋"
      }
    ],
    "related": [
      "jacky-cheung-tour-tee",
      "jacky-cheung-poster-set",
      "jacky-cheung-photobook"
    ],
    "shipping": "下單後 5 個工作天內出貨，盒裝防壓寄送。",
    "returns": "缺片可於七日內補件或換貨，拆封後恕不退款。"
  },
  "jacky-cheung-concert-tee": {
    "description": "胸前印著《她來聽我的演唱會》的歌名，那是 1999 年寫盡半生聚散的一首歌。穿上這件黑 T，像替自己留住了某一場捨不得結束的演出。",
    "specs": [
      {
        "k": "材質",
        "v": "100% 純棉"
      },
      {
        "k": "印刷",
        "v": "正面歌名字體・背面歌詞"
      },
      {
        "k": "版型",
        "v": "中性合身剪裁"
      },
      {
        "k": "厚度",
        "v": "200gsm 中磅"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "經典黑",
            "value": "classic-black"
          }
        ]
      }
    ],
    "related": [
      "jacky-cheung-tour-tee",
      "jacky-cheung-tour-hoodie",
      "jacky-cheung-embroidered-cap"
    ],
    "shipping": "下單後 5 至 7 個工作天內出貨，台港皆採掛號配送。",
    "returns": "未水洗、吊牌完整可於十四日內換尺寸，已洗滌恕不退換。"
  },
  "eric-chou-odyssey-vinyl": {
    "description": "《Odyssey 旅程》以雙黑膠收錄了這趟巡迴的起點與終點，從第一首前奏到最後的安可，像把整段旅程重新走過一次。轉動唱盤的那一刻，鋼琴與弦樂在房間裡緩緩散開，陪你回到某個還沒說再見的夜晚。",
    "specs": [
      {
        "k": "規格",
        "v": "180g 雙黑膠 (2LP)"
      },
      {
        "k": "轉速",
        "v": "33⅓ RPM"
      },
      {
        "k": "內容",
        "v": "附 12 頁歌詞跨頁本"
      },
      {
        "k": "版本",
        "v": "旅程典藏首批壓製"
      }
    ],
    "related": [
      "eric-chou-signed-cd",
      "eric-chou-piano-scorebook",
      "eric-chou-photobook"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天送達，黑膠以防壓硬殼專用箱出貨。",
    "returns": "非瑕疵不退換；若收到時外殼破損或唱片變形，七天內聯繫客服免費補寄。"
  },
  "eric-chou-tour-tee-black": {
    "description": "午夜黑的旅程巡演限定T恤，左胸繡上巡迴日期，背後印著那句陪大家走過整場的歌詞。布料厚實微磨毛，是散場後還想一直穿著、捨不得換下的那一件。",
    "specs": [
      {
        "k": "材質",
        "v": "100% 精梳棉，260gsm"
      },
      {
        "k": "版型",
        "v": "中性寬鬆落肩"
      },
      {
        "k": "印製",
        "v": "前繡章＋後絲網印刷"
      },
      {
        "k": "產地",
        "v": "台灣製"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s",
            "soldOut": true
          },
          {
            "label": "M",
            "value": "m",
            "soldOut": true
          },
          {
            "label": "L",
            "value": "l",
            "soldOut": true
          },
          {
            "label": "XL",
            "value": "xl",
            "soldOut": true
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "午夜黑",
            "value": "midnight-black"
          }
        ]
      }
    ],
    "related": [
      "eric-chou-hoodie-grey",
      "eric-chou-cap",
      "eric-chou-fan-bundle"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天；本品為巡演限量，售完不再補貨。",
    "returns": "限量商品恕不退換；尺寸疑慮請於下單前參考尺寸表，瑕疵品七天內換貨。"
  },
  "eric-chou-lyrics-poster-set": {
    "description": "三入手寫歌詞海報，把那些被唱了無數遍的句子，還原成他親筆落下的筆觸。貼在牆上，每天醒來第一眼看到的，是一句剛好懂你的話。",
    "specs": [
      {
        "k": "數量",
        "v": "3 入一組"
      },
      {
        "k": "尺寸",
        "v": "A2 (420×594mm)"
      },
      {
        "k": "紙質",
        "v": "進口霧面美術紙"
      },
      {
        "k": "設計",
        "v": "手寫歌詞燙白工藝"
      }
    ],
    "related": [
      "eric-chou-postcard-set",
      "eric-chou-sticker-pack",
      "eric-chou-photobook"
    ],
    "shipping": "以圓筒硬管包裝出貨，台灣本島 3-5 個工作天送達。",
    "returns": "印刷品拆封後非瑕疵不退換；運送導致摺損可於七天內申請補寄。"
  },
  "eric-chou-piano-scorebook": {
    "description": "鋼琴彈唱譜精裝本收錄了從《以後別做朋友》到《Odyssey 旅程》的代表作，每首都附上原調與簡化版指法。翻開它，你也能在自己的琴前，把那些旋律一個音一個音彈回來。",
    "specs": [
      {
        "k": "裝幀",
        "v": "精裝硬殼，可攤平"
      },
      {
        "k": "頁數",
        "v": "160 頁"
      },
      {
        "k": "收錄",
        "v": "18 首鋼琴彈唱譜"
      },
      {
        "k": "附錄",
        "v": "和弦級數速查表"
      }
    ],
    "related": [
      "eric-chou-odyssey-vinyl",
      "eric-chou-signed-cd",
      "eric-chou-photobook"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，書籍以氣泡袋加硬板保護出貨。",
    "returns": "書籍拆封後非瑕疵恕不退換；裝訂或印刷瑕疵七天內可換新品。"
  },
  "eric-chou-signed-cd": {
    "description": "《永不失聯的愛》親簽CD，每一張都有他逐一簽下的名字，扉頁角落還留著一句給歌迷的話。是那種會想用透明袋收好、偶爾拿出來看一眼就安心的收藏。",
    "specs": [
      {
        "k": "形式",
        "v": "親筆簽名實體CD"
      },
      {
        "k": "內容",
        "v": "原版專輯＋簽名扉頁"
      },
      {
        "k": "包裝",
        "v": "附獨立防刮收藏夾"
      },
      {
        "k": "數量",
        "v": "限量親簽"
      }
    ],
    "related": [
      "eric-chou-odyssey-vinyl",
      "eric-chou-piano-scorebook",
      "eric-chou-photobook"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，親簽品全程防潮防壓包裝。",
    "returns": "親簽限量品一經售出不退換；運送毀損請於七天內憑開箱影片申請處理。"
  },
  "eric-chou-hoodie-grey": {
    "description": "霧灰的終曲連帽帽T，靈感取自《終曲 Coda》收束時那片安靜的留白，內裡刷毛在台北濕冷的夜裡格外暖。帽繩末端壓著小小的金屬logo，是低調卻一眼能認出的細節。",
    "specs": [
      {
        "k": "材質",
        "v": "棉混紡刷毛，380gsm"
      },
      {
        "k": "版型",
        "v": "寬鬆中性連帽"
      },
      {
        "k": "細節",
        "v": "金屬帽繩釦＋袋鼠口袋"
      },
      {
        "k": "產地",
        "v": "台灣製"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "霧灰",
            "value": "misty-grey"
          },
          {
            "label": "墨黑",
            "value": "ink-black"
          }
        ]
      }
    ],
    "related": [
      "eric-chou-tour-tee-black",
      "eric-chou-cap",
      "eric-chou-fan-bundle"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，冬季檔期出貨可能順延 1-2 日。",
    "returns": "未水洗、吊牌完整可於七天內換尺寸一次；個人因素退貨運費自付。"
  },
  "eric-chou-canvas-tote": {
    "description": "旅程帆布托特包以耐磨厚帆布製成，側邊低調印著巡迴路線的城市縮寫，裝得下一本寫真集加一台筆電。它不張揚，卻像把整段旅程隨手揹在肩上。",
    "specs": [
      {
        "k": "材質",
        "v": "16oz 厚磅帆布"
      },
      {
        "k": "尺寸",
        "v": "38×40×12cm"
      },
      {
        "k": "細節",
        "v": "內襯拉鍊暗袋"
      },
      {
        "k": "承重",
        "v": "建議 8kg 內"
      }
    ],
    "related": [
      "eric-chou-tumbler",
      "eric-chou-mug-duo",
      "eric-chou-cap"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天送達。",
    "returns": "未使用且吊牌完整可於七天內退換；印刷為手感工藝，輕微色差不視為瑕疵。"
  },
  "eric-chou-mug-duo": {
    "description": "「你，好不好」對杯組，一只印著問句、一只印著回答，是為了兩個人準備的早晨。倒上熱飲時，杯身的釉面會透出溫潤的光，像一句輕輕的問候。",
    "specs": [
      {
        "k": "材質",
        "v": "高溫白瓷"
      },
      {
        "k": "容量",
        "v": "each 350ml"
      },
      {
        "k": "數量",
        "v": "2 入對杯"
      },
      {
        "k": "適用",
        "v": "可微波／洗碗機"
      }
    ],
    "related": [
      "eric-chou-tumbler",
      "eric-chou-candle",
      "eric-chou-canvas-tote"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，瓷器以雙層防震棉分隔出貨。",
    "returns": "收到七天內若有破損或裂痕，憑開箱影片免費補寄；個人因素退貨需保持完整包裝。"
  },
  "eric-chou-light-stick": {
    "description": "永不失聯應援燈以柔白光暈設計，可隨現場節奏切換呼吸燈與恆亮模式，握柄刻著那句熟悉的應援口號。當全場一起亮起，你會明白「永不失聯」從來不只是一首歌。",
    "specs": [
      {
        "k": "光源",
        "v": "暖白／彩光雙模式 LED"
      },
      {
        "k": "電力",
        "v": "3 號電池 ×2（未含）"
      },
      {
        "k": "模式",
        "v": "恆亮／呼吸／節奏閃爍"
      },
      {
        "k": "握柄",
        "v": "防滑矽膠刻字"
      }
    ],
    "related": [
      "eric-chou-bracelet",
      "eric-chou-fan-bundle",
      "eric-chou-tour-tee-black"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，電子應援品出貨前皆通過亮燈測試。",
    "returns": "非人為故障可於七天內換新；拆封後因個人因素退貨需保持配件齊全。"
  },
  "eric-chou-bracelet": {
    "description": "巡演紀念手環以霧面金屬扣搭配編織繩，內側細細刻上巡迴年份，是散場後仍能戴在手腕上的那點餘溫。鬆緊可微調，男生女生都能找到剛好的鬆度。",
    "specs": [
      {
        "k": "材質",
        "v": "編織繩＋不鏽鋼扣"
      },
      {
        "k": "長度",
        "v": "可調 16-20cm"
      },
      {
        "k": "刻字",
        "v": "內側巡迴年份"
      },
      {
        "k": "防護",
        "v": "防水抗氧化處理"
      }
    ],
    "related": [
      "eric-chou-keychain",
      "eric-chou-light-stick",
      "eric-chou-phone-strap"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，小型飾品以絨布袋包裝出貨。",
    "returns": "飾品基於衛生考量，非瑕疵恕不退換；金屬扣件瑕疵七天內換新。"
  },
  "eric-chou-photobook": {
    "description": "巡迴寫真集《在路上》收錄了後台、車程與一座座城市之間的他，鏡頭多半在準備上台前的安靜時刻按下。翻著翻著，你會看見舞台燈光以外，那個更接近自己的旅人。",
    "specs": [
      {
        "k": "頁數",
        "v": "144 頁全彩"
      },
      {
        "k": "開本",
        "v": "24×30cm 精裝"
      },
      {
        "k": "用紙",
        "v": "進口雪面銅版紙"
      },
      {
        "k": "附贈",
        "v": "隨機未公開花絮卡 1 張"
      }
    ],
    "related": [
      "eric-chou-postcard-set",
      "eric-chou-lyrics-poster-set",
      "eric-chou-piano-scorebook"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，寫真集以硬板加防潮膜保護出貨。",
    "returns": "書籍拆封後非瑕疵恕不退換；裝訂或印刷瑕疵可於七天內換新品。"
  },
  "eric-chou-postcard-set": {
    "description": "城市巡迴明信片十入組，每一張都對應一座巡演停靠的城市，背面留白等你寫下當晚的心情。寄給遠方的人，或留給未來的自己，都剛剛好。",
    "specs": [
      {
        "k": "數量",
        "v": "10 入一組"
      },
      {
        "k": "尺寸",
        "v": "明信片標準 100×148mm"
      },
      {
        "k": "紙質",
        "v": "300g 雙面霧卡"
      },
      {
        "k": "主題",
        "v": "10 座巡迴城市"
      }
    ],
    "related": [
      "eric-chou-lyrics-poster-set",
      "eric-chou-sticker-pack",
      "eric-chou-photobook"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，亦可選超商取貨。",
    "returns": "印刷品拆封後非瑕疵不退換；運送導致摺損七天內可申請補寄。"
  },
  "eric-chou-keychain": {
    "description": "鋼琴造型鑰匙圈以微縮琴鍵打造，黑白鍵的細節連觸感都還原得仔細，呼應他從鋼琴前出發的每一首歌。掛在包上，是隨身帶著的一小段旋律。",
    "specs": [
      {
        "k": "材質",
        "v": "鋅合金鍍黑"
      },
      {
        "k": "尺寸",
        "v": "6.5×2cm"
      },
      {
        "k": "細節",
        "v": "立體琴鍵浮雕"
      },
      {
        "k": "配件",
        "v": "防刮龍蝦扣"
      }
    ],
    "related": [
      "eric-chou-bracelet",
      "eric-chou-phone-strap",
      "eric-chou-piano-scorebook"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，可選超商取貨。",
    "returns": "未使用且包裝完整可於七天內退換；五金瑕疵免費換新。"
  },
  "eric-chou-phone-strap": {
    "description": "旅程藍的手機掛繩，取色自巡迴主視覺那片深邃的夜空藍，編織紋路握起來有恰好的摩擦感。短繩可繞手腕、長段能斜揹，把手機和那段旅程一起帶在身邊。",
    "specs": [
      {
        "k": "材質",
        "v": "尼龍編織繩"
      },
      {
        "k": "長度",
        "v": "可調式中長款"
      },
      {
        "k": "配件",
        "v": "附通用夾片"
      },
      {
        "k": "顏色",
        "v": "旅程藍"
      }
    ],
    "related": [
      "eric-chou-keychain",
      "eric-chou-bracelet",
      "eric-chou-canvas-tote"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，可選超商取貨。",
    "returns": "未使用可於七天內退換；夾片或繩結瑕疵免費補寄。"
  },
  "eric-chou-candle": {
    "description": "雨之後香氛蠟燭以雨後泥土與木質調為靈感，呼應《如果雨之後》那種淋過雨才懂的清新。點上它，房間像剛下完一場雨，所有委屈都被洗得乾淨了一些。",
    "specs": [
      {
        "k": "香調",
        "v": "雨後泥土／雪松木質"
      },
      {
        "k": "容量",
        "v": "200g 大豆蠟"
      },
      {
        "k": "燃燒",
        "v": "約 40 小時"
      },
      {
        "k": "容器",
        "v": "霧面玻璃杯附蓋"
      }
    ],
    "related": [
      "eric-chou-mug-duo",
      "eric-chou-tumbler",
      "eric-chou-umbrella"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，蠟燭以防撞內襯出貨。",
    "returns": "香氛拆封後基於品質考量恕不退換；收到時容器破損七天內免費補寄。"
  },
  "eric-chou-umbrella": {
    "description": "終曲摺疊傘以《終曲 Coda》的深色調為底，傘面內側藏著一行淡淡的歌詞，只有撐開抬頭時才看得見。下雨天打開它，像被一句溫柔的話悄悄罩住。",
    "specs": [
      {
        "k": "骨架",
        "v": "八骨自動開收"
      },
      {
        "k": "傘面",
        "v": "抗UV防潑水塗層"
      },
      {
        "k": "收合",
        "v": "摺疊長度 28cm"
      },
      {
        "k": "細節",
        "v": "傘面內側歌詞印製"
      }
    ],
    "related": [
      "eric-chou-candle",
      "eric-chou-canvas-tote",
      "eric-chou-hoodie-grey"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天送達。",
    "returns": "未使用且包裝完整可於七天內退換；傘骨或自動開收機構瑕疵免費換新。"
  },
  "eric-chou-sticker-pack": {
    "description": "歌詞貼紙包集結了多首代表作裡最常被截圖珍藏的句子，防水材質貼在筆電、水壺或手機殼上都不怕磨損。一張一句，把喜歡的歌詞貼進每天的日常。",
    "specs": [
      {
        "k": "數量",
        "v": "15 張一包"
      },
      {
        "k": "材質",
        "v": "防水霧面PVC"
      },
      {
        "k": "尺寸",
        "v": "4-8cm 不等"
      },
      {
        "k": "特性",
        "v": "耐刮可重複黏貼"
      }
    ],
    "related": [
      "eric-chou-postcard-set",
      "eric-chou-lyrics-poster-set",
      "eric-chou-keychain"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，亦可選超商取貨。",
    "returns": "貼紙拆封後非瑕疵恕不退換；印刷或裁切瑕疵七天內可換。"
  },
  "eric-chou-cap": {
    "description": "旅程刺繡棒球帽在帽簷側邊繡上巡迴標誌，洗水做舊的帽身越戴越有自己的痕跡。後扣可調的設計，無論誰戴上都剛好，是看演唱會與日常通勤都百搭的一頂。",
    "specs": [
      {
        "k": "材質",
        "v": "水洗純棉斜紋"
      },
      {
        "k": "工藝",
        "v": "立體刺繡標誌"
      },
      {
        "k": "調節",
        "v": "金屬後扣可調"
      },
      {
        "k": "帽型",
        "v": "經典六片彎簷"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "均碼",
            "value": "one-size"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "旅程藍",
            "value": "journey-blue"
          },
          {
            "label": "卡其",
            "value": "khaki"
          },
          {
            "label": "午夜黑",
            "value": "midnight-black"
          }
        ]
      }
    ],
    "related": [
      "eric-chou-tour-tee-black",
      "eric-chou-hoodie-grey",
      "eric-chou-canvas-tote"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天送達。",
    "returns": "未配戴且吊牌完整可於七天內換色一次；刺繡或扣件瑕疵免費換新。"
  },
  "eric-chou-fan-bundle": {
    "description": "永不失聯歌迷套組一次收齊巡演T恤、應援燈與海報，是準備走進現場最完整的一份裝備。從穿在身上到舉在手中，整套都在替你說那句「我一直都在」。",
    "specs": [
      {
        "k": "內容",
        "v": "巡演T恤＋應援燈＋海報"
      },
      {
        "k": "T恤",
        "v": "100% 精梳棉，可選尺寸"
      },
      {
        "k": "應援燈",
        "v": "暖白雙模式 LED"
      },
      {
        "k": "優惠",
        "v": "較單買省約 15%"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "T恤尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "T恤顏色",
        "options": [
          {
            "label": "午夜黑",
            "value": "midnight-black"
          },
          {
            "label": "旅程藍",
            "value": "journey-blue"
          }
        ]
      }
    ],
    "related": [
      "eric-chou-tour-tee-black",
      "eric-chou-light-stick",
      "eric-chou-lyrics-poster-set"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，套組合併一箱出貨。",
    "returns": "套組為優惠組合不可拆退；瑕疵品可於七天內就該單品換貨。"
  },
  "eric-chou-tumbler": {
    "description": "旅程保溫隨行杯採真空雙層不鏽鋼，杯身霧面噴塗上印著巡迴標語，握感溫潤不沾指紋。冬天裝熱拿鐵保溫數小時，像把那場演唱會的溫度一路帶在身邊。",
    "specs": [
      {
        "k": "材質",
        "v": "304 不鏽鋼雙層真空"
      },
      {
        "k": "容量",
        "v": "500ml"
      },
      {
        "k": "保溫",
        "v": "保溫 6h／保冰 12h"
      },
      {
        "k": "杯蓋",
        "v": "防漏旋蓋"
      }
    ],
    "related": [
      "eric-chou-mug-duo",
      "eric-chou-candle",
      "eric-chou-canvas-tote"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天送達。",
    "returns": "未使用且包裝完整可於七天內退換；保溫功能異常憑檢測免費換新。"
  },
  "adia-chan-classics-cd": {
    "description": "把陳松伶橫跨三十餘年的代表作重新錄唱，從《把歌談心》到一首首伴你長大的旋律，溫柔得像久別重逢。每一軌都重新編曲，留住的是那份不疾不徐、唱進心底的從容。",
    "specs": [
      {
        "k": "形式",
        "v": "CD 單片裝（紙盒精裝）"
      },
      {
        "k": "收錄曲目",
        "v": "12 首重新編曲錄唱"
      },
      {
        "k": "附贈",
        "v": "歌詞冊＋復刻劇照卡 4 張"
      },
      {
        "k": "語言",
        "v": "粵語／國語"
      }
    ],
    "related": [
      "adia-chan-vinyl-remaster",
      "adia-chan-musical-program",
      "adia-chan-fan-bundle"
    ],
    "shipping": "台港兩地寄送，下單後 5 至 7 個工作天出貨；CD 以防撞硬盒包裝。",
    "returns": "拆封後如音軌瑕疵可於 7 天內換貨；外包裝完好之未拆封品方可退貨。"
  },
  "adia-chan-vinyl-remaster": {
    "description": "《天涯歌女》母帶復刻黑膠，把當年那把重現一代歌女風華的嗓音，封進溫潤的黑色紋路裡。180 克重盤搭配跨頁內袋劇照，是收藏家等了很久的一張。",
    "specs": [
      {
        "k": "規格",
        "v": "12 吋 180g 黑膠（雙碟）"
      },
      {
        "k": "版本",
        "v": "母帶數位修復復刻"
      },
      {
        "k": "內附",
        "v": "跨頁劇照內袋＋編號收藏卡"
      },
      {
        "k": "發行量",
        "v": "限量 800 套"
      }
    ],
    "related": [
      "adia-chan-classics-cd",
      "adia-chan-signed-poster",
      "adia-chan-photo-essay"
    ],
    "shipping": "限量品採掛號寄送，台港皆可；備貨後 7 至 10 個工作天送達。",
    "returns": "限量編號商品恕不接受退換，僅針對運送破損提供補件。"
  },
  "adia-chan-musical-program": {
    "description": "音樂劇《天涯．歌女》的紀念場刊，收錄排練側拍、角色手記與舞台設計草圖，翻開就像走進西九戲曲中心的後台。厚磅紙印刷，連舞台燈下的那層細緻都看得見。",
    "specs": [
      {
        "k": "開本",
        "v": "A4 直式精裝"
      },
      {
        "k": "頁數",
        "v": "64 頁全彩"
      },
      {
        "k": "內容",
        "v": "排練側拍、角色手記、舞台設計"
      },
      {
        "k": "紙質",
        "v": "157g 雪面銅版"
      }
    ],
    "related": [
      "adia-chan-classics-cd",
      "adia-chan-signed-poster",
      "adia-chan-fan-bundle"
    ],
    "shipping": "全球寄送，台港地區約 5 個工作天送達；場刊以硬卡夾護角包裝。",
    "returns": "紙本印刷品如有裝訂瑕疵，7 天內可換貨；個人因素恕不退貨。"
  },
  "adia-chan-silk-scarf": {
    "description": "以松松最愛的墨綠為主調，絲巾上是手繪山茶花與五線譜交織的圖案，繫上的瞬間就多了一份舞台外的優雅。100% 真絲手捲邊，四季都能搭。",
    "specs": [
      {
        "k": "材質",
        "v": "100% 桑蠶絲"
      },
      {
        "k": "尺寸",
        "v": "90 × 90 cm 方巾"
      },
      {
        "k": "工藝",
        "v": "手捲邊縫製"
      },
      {
        "k": "圖案",
        "v": "山茶花＋五線譜印花"
      }
    ],
    "variants": [
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "墨綠",
            "value": "ink-green"
          },
          {
            "label": "霧棕",
            "value": "misty-brown"
          }
        ]
      }
    ],
    "related": [
      "adia-chan-brooch",
      "adia-chan-shawl",
      "adia-chan-teacup-set"
    ],
    "shipping": "台港寄送，3 至 5 個工作天出貨；絲巾以禮盒附防塵袋包裝。",
    "returns": "未配戴、吊牌完整者 14 天內可退換；貼身配件拆封使用後不予退貨。"
  },
  "adia-chan-teacup-set": {
    "description": "為「午後茶敘」見面會而生的骨瓷對杯，杯緣描金、杯身一抹淡淡山茶花，倒上一壺茶就是松松和你聊天的午後。兩杯成對，留一只給想念的人。",
    "specs": [
      {
        "k": "材質",
        "v": "高溫骨瓷描金"
      },
      {
        "k": "容量",
        "v": "單杯 220ml ×2"
      },
      {
        "k": "內含",
        "v": "對杯 2 只＋對碟 2 片"
      },
      {
        "k": "適用",
        "v": "可微波（描金處除外）"
      }
    ],
    "related": [
      "adia-chan-silk-scarf",
      "adia-chan-mug",
      "adia-chan-candle"
    ],
    "shipping": "易碎品專用泡棉防撞包裝，台港寄送約 5 至 7 個工作天。",
    "returns": "收到 7 天內如有破損請拍照申請換貨；完整未使用者方可退貨。"
  },
  "adia-chan-photo-essay": {
    "description": "寫真隨筆集《從容》，收錄陳松伶近年的生活影像與親筆短文，記下歲月教會她的那份淡定。是寫真，也是一封慢慢讀的長信。",
    "specs": [
      {
        "k": "開本",
        "v": "25 × 25 cm 方形精裝"
      },
      {
        "k": "頁數",
        "v": "120 頁"
      },
      {
        "k": "內容",
        "v": "生活寫真＋親筆隨筆"
      },
      {
        "k": "印刷",
        "v": "進口藝術紙四色印刷"
      }
    ],
    "related": [
      "adia-chan-vinyl-remaster",
      "adia-chan-notebook",
      "adia-chan-calendar-2027"
    ],
    "shipping": "精裝書以硬殼書盒寄送，台港地區約 5 至 7 個工作天送達。",
    "returns": "書籍類如有印刷或裝訂瑕疵 7 天內可換；無瑕疵恕不退換。"
  },
  "adia-chan-signed-poster": {
    "description": "陳松伶親筆簽名的經典劇照海報，定格的是《天涯歌女》裡那一回眸的風華。每張獨立簽名、附防潮筒，掛上牆就把黃金年代帶回家。",
    "specs": [
      {
        "k": "尺寸",
        "v": "A1（59.4 × 84.1 cm）"
      },
      {
        "k": "簽名",
        "v": "本人親筆逐張簽署"
      },
      {
        "k": "紙質",
        "v": "霧面藝術紙 200g"
      },
      {
        "k": "附件",
        "v": "防潮收納筒"
      }
    ],
    "related": [
      "adia-chan-vinyl-remaster",
      "adia-chan-photo-essay",
      "adia-chan-postcards"
    ],
    "shipping": "海報捲入硬筒寄送防摺損，台港地區約 7 個工作天送達。",
    "returns": "親簽商品為限量收藏品，除運送破損外恕不退換。"
  },
  "adia-chan-brooch": {
    "description": "山茶花胸針，靈感來自松松舞台上最常別的那一朵花，花瓣以琺瑯細描、花蕊鑲一顆微光珍珠。別在大衣或圍巾上，低調卻有戲。",
    "specs": [
      {
        "k": "材質",
        "v": "合金鍍金＋琺瑯"
      },
      {
        "k": "尺寸",
        "v": "約 4.5 cm 直徑"
      },
      {
        "k": "點綴",
        "v": "仿珍珠花蕊"
      },
      {
        "k": "扣式",
        "v": "防滑安全別針"
      }
    ],
    "related": [
      "adia-chan-silk-scarf",
      "adia-chan-shawl",
      "adia-chan-keyring"
    ],
    "shipping": "配件以絨布盒包裝寄送，台港地區約 3 至 5 個工作天。",
    "returns": "未配戴、包裝完整者 14 天內可退換；配戴後恕不退貨。"
  },
  "adia-chan-tote-bag": {
    "description": "歌女帆布袋以一句手寫歌詞為主視覺，厚磅棉布耐裝又好背，裝得下樂譜、書本和一整天的好心情。版型俐落，配什麼都自在。",
    "specs": [
      {
        "k": "材質",
        "v": "12 安士厚磅帆布"
      },
      {
        "k": "尺寸",
        "v": "38 × 40 × 10 cm"
      },
      {
        "k": "承重",
        "v": "約 8 公斤"
      },
      {
        "k": "細節",
        "v": "內�i拉鍊暗袋"
      }
    ],
    "related": [
      "adia-chan-mug",
      "adia-chan-keyring",
      "adia-chan-notebook"
    ],
    "shipping": "台港寄送，3 至 5 個工作天出貨；布製品以環保袋包裝。",
    "returns": "未使用、吊牌完整者 14 天內可退換；清洗或使用後不予退貨。"
  },
  "adia-chan-postcards": {
    "description": "港劇黃金年代明信片組，把陳松伶最經典的劇照定格成一張張可寄出的回憶。十張不同造型，寫上一句話，就把那個年代寄給遠方的誰。",
    "specs": [
      {
        "k": "數量",
        "v": "10 張一組"
      },
      {
        "k": "尺寸",
        "v": "10 × 15 cm"
      },
      {
        "k": "主題",
        "v": "黃金年代經典劇照"
      },
      {
        "k": "紙質",
        "v": "300g 雙面霧膜"
      }
    ],
    "related": [
      "adia-chan-signed-poster",
      "adia-chan-calendar-2027",
      "adia-chan-puzzle"
    ],
    "shipping": "全球寄送，台港地區約 5 個工作天；明信片附透明保護套。",
    "returns": "印刷品如有瑕疵 7 天內可換貨；個人因素恕不退貨。"
  },
  "adia-chan-calendar-2027": {
    "description": "2027 優雅月曆，十二個月配上陳松伶不同季節的影像與一句溫柔短語，讓整年都有人陪你慢慢過。桌上掛牆兩用，翻頁就是換季。",
    "specs": [
      {
        "k": "版式",
        "v": "桌曆／掛曆兩用"
      },
      {
        "k": "張數",
        "v": "13 張（封面＋12 月）"
      },
      {
        "k": "尺寸",
        "v": "21 × 29.7 cm"
      },
      {
        "k": "適用年份",
        "v": "2027 全年"
      }
    ],
    "related": [
      "adia-chan-photo-essay",
      "adia-chan-postcards",
      "adia-chan-notebook"
    ],
    "shipping": "台港寄送，下單後 5 個工作天出貨；月曆以硬卡護角包裝。",
    "returns": "拆封後恕不退換；運送途中受損可於 7 天內申請補件。"
  },
  "adia-chan-candle": {
    "description": "白茶香氛蠟燭，前調是清雅白茶、尾韻一抹木質回甘，點上一盞就像松松歌聲裡那份不張揚的安定。大豆蠟低煙，適合午後一個人的時光。",
    "specs": [
      {
        "k": "香調",
        "v": "白茶＋雪松木質"
      },
      {
        "k": "容量",
        "v": "200g 玻璃杯裝"
      },
      {
        "k": "燃燒時數",
        "v": "約 40 小時"
      },
      {
        "k": "蠟材",
        "v": "天然大豆蠟"
      }
    ],
    "related": [
      "adia-chan-teacup-set",
      "adia-chan-silk-scarf",
      "adia-chan-mug"
    ],
    "shipping": "香氛品以防漏防撞包裝，台港寄送約 5 個工作天；夏季避高溫運送。",
    "returns": "拆封使用後基於衛生考量不予退換；未拆封者 7 天內可退貨。"
  },
  "adia-chan-notebook": {
    "description": "談心手帳本，封面壓印「把歌談心」四字，內頁是溫柔的米黃道林紙，寫日記、抄歌詞都剛好。線裝可攤平，陪你記下每一個想說的瞬間。",
    "specs": [
      {
        "k": "規格",
        "v": "A5 線裝可攤平"
      },
      {
        "k": "內頁",
        "v": "120 頁米黃道林紙"
      },
      {
        "k": "頁式",
        "v": "橫線＋空白混排"
      },
      {
        "k": "封面",
        "v": "壓印燙印工藝"
      }
    ],
    "related": [
      "adia-chan-photo-essay",
      "adia-chan-tote-bag",
      "adia-chan-calendar-2027"
    ],
    "shipping": "台港寄送，3 至 5 個工作天出貨；手帳以紙套包裝防刮。",
    "returns": "未使用、包裝完整者 14 天內可退換；書寫後恕不退貨。"
  },
  "adia-chan-umbrella": {
    "description": "復古長柄傘，木質彎柄配深色傘面，撐開時自帶一種老電影裡走出來的從容。抗風骨架加大傘面，下雨天也能優雅地慢慢走。",
    "specs": [
      {
        "k": "型式",
        "v": "木質彎柄長傘"
      },
      {
        "k": "傘面",
        "v": "8 骨大傘面 105cm"
      },
      {
        "k": "面料",
        "v": "高密度防潑水布"
      },
      {
        "k": "骨架",
        "v": "玻纖抗風骨"
      }
    ],
    "related": [
      "adia-chan-tote-bag",
      "adia-chan-silk-scarf",
      "adia-chan-shawl"
    ],
    "shipping": "台港寄送，3 至 5 個工作天出貨；長傘以加長紙盒包裝。",
    "returns": "未使用、配件齊全者 14 天內可退換；開傘使用後不予退貨。"
  },
  "adia-chan-tee-white": {
    "description": "見面會限定 T 恤，米白底搭一行細緻的手寫字，像松松在午後茶敘裡輕輕對你說的一句話。精梳棉柔軟透氣，日常穿也舒服。",
    "specs": [
      {
        "k": "材質",
        "v": "100% 精梳純棉"
      },
      {
        "k": "克重",
        "v": "210g 厚磅"
      },
      {
        "k": "版型",
        "v": "中性寬鬆落肩"
      },
      {
        "k": "印製",
        "v": "水性環保印花"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "米白",
            "value": "off-white"
          },
          {
            "label": "淺杏",
            "value": "light-apricot"
          }
        ]
      }
    ],
    "related": [
      "adia-chan-tote-bag",
      "adia-chan-mug",
      "adia-chan-fan-bundle"
    ],
    "shipping": "台港寄送，3 至 5 個工作天出貨；服飾以環保夾鏈袋包裝。",
    "returns": "未水洗、未配戴且吊牌完整者 14 天內可換尺寸；個人因素退貨需自付運費。"
  },
  "adia-chan-keyring": {
    "description": "復古麥克風鑰匙扣，迷你金屬麥克風帶你想起松松登台的那一刻，掛在包上一晃一晃都是戲。小巧有重量，質感扎實。",
    "specs": [
      {
        "k": "材質",
        "v": "鋅合金電鍍"
      },
      {
        "k": "尺寸",
        "v": "約 6 cm 吊飾長度"
      },
      {
        "k": "造型",
        "v": "復古麥克風"
      },
      {
        "k": "五金",
        "v": "龍蝦扣＋圓環"
      }
    ],
    "related": [
      "adia-chan-brooch",
      "adia-chan-tote-bag",
      "adia-chan-mug"
    ],
    "shipping": "台港寄送，3 至 5 個工作天出貨；小物以氣泡袋包裝。",
    "returns": "未使用、包裝完整者 14 天內可退換；使用後恕不退貨。"
  },
  "adia-chan-shawl": {
    "description": "舞台披肩以深沉的酒紅為底，垂墜的流蘇隨步伐輕擺，披上肩就有了一身的氣場。柔軟針織保暖，從劇院走到日常都合宜。",
    "specs": [
      {
        "k": "材質",
        "v": "羊毛混紡針織"
      },
      {
        "k": "尺寸",
        "v": "180 × 65 cm"
      },
      {
        "k": "細節",
        "v": "手工流蘇收邊"
      },
      {
        "k": "重量",
        "v": "約 320g"
      }
    ],
    "variants": [
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "酒紅",
            "value": "wine-red"
          },
          {
            "label": "炭灰",
            "value": "charcoal"
          },
          {
            "label": "駝色",
            "value": "camel"
          }
        ]
      }
    ],
    "related": [
      "adia-chan-silk-scarf",
      "adia-chan-brooch",
      "adia-chan-teacup-set"
    ],
    "shipping": "台港寄送，3 至 5 個工作天出貨；披肩以禮盒附防塵袋包裝。",
    "returns": "未配戴、吊牌完整者 14 天內可退換；貼身披掛使用後不予退貨。"
  },
  "adia-chan-fan-bundle": {
    "description": "松果歌迷套組一次集齊《把歌談心》重唱 CD、音樂劇場刊與親簽劇照海報，把松松最動人的三種模樣帶回家。專屬禮盒包裝，送禮自留都剛剛好。",
    "specs": [
      {
        "k": "內容",
        "v": "重唱 CD＋紀念場刊＋親簽海報"
      },
      {
        "k": "包裝",
        "v": "套組專屬禮盒"
      },
      {
        "k": "附贈",
        "v": "松果限定貼紙一張"
      },
      {
        "k": "省下",
        "v": "較單買省 NT$360"
      }
    ],
    "related": [
      "adia-chan-classics-cd",
      "adia-chan-musical-program",
      "adia-chan-signed-poster"
    ],
    "shipping": "套組整盒寄送，台港地區約 7 個工作天送達；含親簽品需額外備貨。",
    "returns": "套組為組合優惠價，恕不單品退換；運送破損可於 7 天內申請補件。"
  },
  "adia-chan-mug": {
    "description": "歲月如歌馬克杯，杯身印著一段手寫歌詞，握在掌心溫溫的，配早晨第一杯咖啡剛好。大容量陶瓷，耐熱好洗、日日都想用。",
    "specs": [
      {
        "k": "材質",
        "v": "高溫陶瓷"
      },
      {
        "k": "容量",
        "v": "350ml"
      },
      {
        "k": "圖案",
        "v": "手寫歌詞印花"
      },
      {
        "k": "適用",
        "v": "可微波、可洗碗機"
      }
    ],
    "related": [
      "adia-chan-teacup-set",
      "adia-chan-candle",
      "adia-chan-tote-bag"
    ],
    "shipping": "陶瓷品以泡棉防撞包裝，台港寄送約 5 個工作天。",
    "returns": "收到 7 天內如有破損請拍照換貨；完整未使用者方可退貨。"
  },
  "adia-chan-puzzle": {
    "description": "經典劇照拼圖，把《天涯歌女》最雋永的一幕拆成一千片慢慢拼回來，拼的是耐心，也是回憶。完成尺寸夠大，裱起來就是一幅牆上的風景。",
    "specs": [
      {
        "k": "片數",
        "v": "1000 片"
      },
      {
        "k": "完成尺寸",
        "v": "50 × 70 cm"
      },
      {
        "k": "圖樣",
        "v": "天涯歌女經典劇照"
      },
      {
        "k": "材質",
        "v": "環保紙板加厚"
      }
    ],
    "related": [
      "adia-chan-signed-poster",
      "adia-chan-postcards",
      "adia-chan-photo-essay"
    ],
    "shipping": "台港寄送，3 至 5 個工作天出貨；拼圖以硬盒包裝防壓。",
    "returns": "未拆封者 7 天內可退換；拆封後因缺片以外因素恕不退貨。"
  },
  "andy-lau-vinyl-forget-love": {
    "description": "1994年的《忘情水》是無數人記憶裡的第一首情歌，如今以黑膠復刻重新轉動那段旋律。180克厚盤搭配跨頁歌詞內頁，讓那句「給我一杯忘情水」在唱針下緩緩流回耳邊。",
    "specs": [
      {
        "k": "規格",
        "v": "180g 黑膠 LP，單片裝"
      },
      {
        "k": "收錄",
        "v": "《忘情水》等10首國語經典"
      },
      {
        "k": "內附",
        "v": "復刻跨頁歌詞內頁"
      },
      {
        "k": "發行",
        "v": "限量編號復刻"
      }
    ],
    "related": [
      "andy-lau-signed-bluray",
      "andy-lau-poster-trilogy",
      "andy-lau-postcards"
    ],
    "shipping": "下單後7個工作天內出貨，黑膠以防壓硬殼專屬包裝寄送。",
    "returns": "拆封後因黑膠特性恕不接受退換，瑕疵品到貨7日內可換貨。"
  },
  "andy-lau-tour-tee": {
    "description": "巡演限定T恤以最耐看的經典黑為底，胸前低調印著巡演年份與華仔簽名字樣。一件可以穿很多年的演唱會記憶，從場館走回日常都恰到好處。",
    "specs": [
      {
        "k": "材質",
        "v": "100% 純棉，220g 厚磅"
      },
      {
        "k": "版型",
        "v": "中性寬鬆剪裁"
      },
      {
        "k": "印製",
        "v": "胸前簽名字樣絲網印刷"
      },
      {
        "k": "產地",
        "v": "台灣印製"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "經典黑",
            "value": "classic-black"
          }
        ]
      }
    ],
    "related": [
      "andy-lau-tee-anniversary",
      "andy-lau-cap",
      "andy-lau-fan-bundle"
    ],
    "shipping": "現貨商品，3個工作天內出貨，台港皆可配送。",
    "returns": "未下水、吊牌完整可於到貨7日內退換，已穿著或洗滌恕不受理。"
  },
  "andy-lau-film-photobook": {
    "description": "《無間道》裡那場天台對峙，是港片永遠繞不開的一幕。這本劇照攝影集收錄劉建明一角的幕前幕後影像，帶你重回那個身分與命運交錯的午後。",
    "specs": [
      {
        "k": "裝幀",
        "v": "精裝硬殼，方背鎖線"
      },
      {
        "k": "頁數",
        "v": "全彩 160 頁"
      },
      {
        "k": "內容",
        "v": "《無間道》劇照與側拍"
      },
      {
        "k": "尺寸",
        "v": "245 × 285 mm"
      }
    ],
    "related": [
      "andy-lau-poster-trilogy",
      "andy-lau-keychain",
      "andy-lau-puzzle"
    ],
    "shipping": "現貨3個工作天內出貨，精裝書以氣泡袋加硬紙板防護寄出。",
    "returns": "書籍類拆封後僅接受瑕疵換貨，請於到貨7日內反映。"
  },
  "andy-lau-signed-bluray": {
    "description": "演唱會藍光收錄整場舞台的呼吸與汗水，封面印有華仔親筆簽名，一張一筆絕無重複。從開場到安可，那些和你一起合唱過的夜晚，被完整地留了下來。",
    "specs": [
      {
        "k": "格式",
        "v": "Blu-ray 雙碟，1080p"
      },
      {
        "k": "簽名",
        "v": "封面親筆簽名，附真品卡"
      },
      {
        "k": "片長",
        "v": "正片約 180 分鐘"
      },
      {
        "k": "發行",
        "v": "限量簽名版"
      }
    ],
    "related": [
      "andy-lau-vinyl-forget-love",
      "andy-lau-light-stick",
      "andy-lau-cheer-towel"
    ],
    "shipping": "簽名商品採人工核對後出貨，約需7至10個工作天，附保護外盒。",
    "returns": "親簽限量品恕不接受退貨，運送破損可於到貨7日內換貨。"
  },
  "andy-lau-poster-trilogy": {
    "description": "從《天若有情》的青春浪漫，到《暗戰》的冷峻、《桃姐》的溫厚，三聯海報串起天王三種截然不同的銀幕人生。原版視覺重新校色復刻，裱框上牆都耐看。",
    "specs": [
      {
        "k": "組合",
        "v": "三張一組海報"
      },
      {
        "k": "尺寸",
        "v": "每張 A2（420 × 594 mm）"
      },
      {
        "k": "用紙",
        "v": "200g 啞面美術紙"
      },
      {
        "k": "印刷",
        "v": "原版視覺校色復刻"
      }
    ],
    "related": [
      "andy-lau-film-photobook",
      "andy-lau-postcards",
      "andy-lau-puzzle"
    ],
    "shipping": "現貨3個工作天內出貨，海報捲入硬紙筒寄送防折損。",
    "returns": "紙製品拆封後僅換瑕疵品，請到貨7日內聯繫客服。"
  },
  "andy-lau-cap": {
    "description": "《17歲》裡他唱「十七歲那年的雨季」，把整個出道時光都寫進歌裡。這頂棒球帽以低調刺繡繡上「17」字樣，像把那份初心戴在頭上。",
    "specs": [
      {
        "k": "材質",
        "v": "斜紋棉，六片式帽身"
      },
      {
        "k": "繡花",
        "v": "前片立體刺繡「17」"
      },
      {
        "k": "調節",
        "v": "後扣金屬釦帶可調"
      },
      {
        "k": "帽圍",
        "v": "均碼 56–60 cm"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "均碼",
            "value": "one-size"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "經典黑",
            "value": "black"
          },
          {
            "label": "復古卡其",
            "value": "khaki"
          }
        ]
      }
    ],
    "related": [
      "andy-lau-tour-tee",
      "andy-lau-hoodie",
      "andy-lau-tee-anniversary"
    ],
    "shipping": "現貨3個工作天內出貨，台港同步配送。",
    "returns": "未配戴、吊牌完整可於到貨7日內退換。"
  },
  "andy-lau-hoodie": {
    "description": "《笨小孩》唱的是傻傻向前、不問回報的那股勁。這件連帽帽T把那句溫柔的自嘲繡在袖口，厚實刷毛裡藏著一點不服輸的暖意。",
    "specs": [
      {
        "k": "材質",
        "v": "棉混紡內刷毛，340g"
      },
      {
        "k": "細節",
        "v": "袖口「笨小孩」刺繡"
      },
      {
        "k": "版型",
        "v": "落肩寬鬆連帽"
      },
      {
        "k": "口袋",
        "v": "前置大開口袋鼠袋"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "炭灰",
            "value": "charcoal"
          },
          {
            "label": "墨黑",
            "value": "ink-black"
          }
        ]
      }
    ],
    "related": [
      "andy-lau-tour-tee",
      "andy-lau-cap",
      "andy-lau-fan-bundle"
    ],
    "shipping": "現貨3至5個工作天內出貨，台港皆可寄送。",
    "returns": "未下水、吊牌完整可於到貨7日內退換，已洗滌恕不受理。"
  },
  "andy-lau-leather-wallet": {
    "description": "「今天的努力，是給明天最好的交代」——這句話被燙印在皮夾內側，提醒你自律的人最自由。真皮短夾低調耐用，是天王勤奮哲學的隨身版。",
    "specs": [
      {
        "k": "材質",
        "v": "頭層牛皮，植鞣處理"
      },
      {
        "k": "內裝",
        "v": "6 卡位、雙鈔層、零錢袋"
      },
      {
        "k": "燙印",
        "v": "內側勵志語錄燙金"
      },
      {
        "k": "尺寸",
        "v": "展開約 19 × 9.5 cm"
      }
    ],
    "related": [
      "andy-lau-notebook",
      "andy-lau-keychain",
      "andy-lau-phone-case"
    ],
    "shipping": "現貨3個工作天內出貨，附絨布防塵袋與禮盒。",
    "returns": "皮件未使用、包裝完整可於到貨7日內退換，燙印瑕疵免費換貨。"
  },
  "andy-lau-light-stick": {
    "description": "演唱會裡千萬支同時亮起的那一刻，是全場最動人的合唱。這支應援燈支援多段顏色切換，握把刻著華仔天地字樣，散場後仍是書桌上的一盞光。",
    "specs": [
      {
        "k": "光源",
        "v": "RGB 多色 LED，七段切換"
      },
      {
        "k": "電源",
        "v": "3 號電池 ×2（未含）"
      },
      {
        "k": "握把",
        "v": "鐳射雕刻華仔天地字樣"
      },
      {
        "k": "尺寸",
        "v": "全長約 24 cm"
      }
    ],
    "related": [
      "andy-lau-cheer-towel",
      "andy-lau-fan-bundle",
      "andy-lau-signed-bluray"
    ],
    "shipping": "現貨3個工作天內出貨，內含防撞泡棉內襯。",
    "returns": "電子應援品未拆封可於到貨7日內退換，功能瑕疵保固30天。"
  },
  "andy-lau-keychain": {
    "description": "一塊小小的電影場記板，記著開麥拉前的那聲「Action」。金屬鑰匙圈刻上經典片名與年份，把四十年的光影縮進掌心。",
    "specs": [
      {
        "k": "材質",
        "v": "鋅合金，啞光電鍍"
      },
      {
        "k": "造型",
        "v": "電影場記板，可翻動拍板"
      },
      {
        "k": "刻字",
        "v": "經典片名與年份雕刻"
      },
      {
        "k": "尺寸",
        "v": "板身約 4.5 × 4 cm"
      }
    ],
    "related": [
      "andy-lau-leather-wallet",
      "andy-lau-film-photobook",
      "andy-lau-phone-case"
    ],
    "shipping": "現貨3個工作天內出貨，小物以夾鏈包裝寄出。",
    "returns": "未使用、包裝完整可於到貨7日內退換。"
  },
  "andy-lau-postcards": {
    "description": "從《旺角卡門》到《拆彈專家》，這組明信片以四十年銀幕劇照串起一條時光長廊。寄給朋友，或留給自己貼在牆上，都是一封寫給歲月的情書。",
    "specs": [
      {
        "k": "數量",
        "v": "全套 12 張不重複"
      },
      {
        "k": "主題",
        "v": "四十年代表電影劇照"
      },
      {
        "k": "用紙",
        "v": "300g 啞粉卡紙"
      },
      {
        "k": "尺寸",
        "v": "明信片標準 102 × 152 mm"
      }
    ],
    "related": [
      "andy-lau-poster-trilogy",
      "andy-lau-film-photobook",
      "andy-lau-keychain"
    ],
    "shipping": "現貨3個工作天內出貨，整套以硬卡紙盒收納寄送。",
    "returns": "紙製品拆封後僅換瑕疵品，請到貨7日內聯繫。"
  },
  "andy-lau-mug": {
    "description": "《一起走過的日子》唱盡了並肩走來的情義，這只馬克杯把那句歌詞燒印在杯身。每天的第一杯熱茶，都像和老朋友重溫一段路。",
    "specs": [
      {
        "k": "材質",
        "v": "新骨瓷，可微波可洗碗機"
      },
      {
        "k": "容量",
        "v": "約 380 ml"
      },
      {
        "k": "印製",
        "v": "歌詞燒印，耐久不褪"
      },
      {
        "k": "尺寸",
        "v": "杯口直徑 8.2 cm"
      }
    ],
    "related": [
      "andy-lau-notebook",
      "andy-lau-tote",
      "andy-lau-cheer-towel"
    ],
    "shipping": "現貨3個工作天內出貨，陶瓷品以蜂巢紙加固包裝。",
    "returns": "未使用可於到貨7日內退換，運送破損請拍照於3日內反映免費補寄。"
  },
  "andy-lau-tote": {
    "description": "華仔天地陪著幾代人從少年走到中年，這只帆布袋印著歷久不衰的會徽圖樣。裝書裝菜都得體，是把那份歸屬感隨身帶著走的方式。",
    "specs": [
      {
        "k": "材質",
        "v": "12 安加厚胚布"
      },
      {
        "k": "印製",
        "v": "華仔天地會徽絲印"
      },
      {
        "k": "容量",
        "v": "可裝 A4，承重約 8 kg"
      },
      {
        "k": "尺寸",
        "v": "38 × 40 × 10 cm"
      }
    ],
    "related": [
      "andy-lau-mug",
      "andy-lau-notebook",
      "andy-lau-tee-anniversary"
    ],
    "shipping": "現貨3個工作天內出貨，台港皆可配送。",
    "returns": "未使用、無污損可於到貨7日內退換。"
  },
  "andy-lau-cheer-towel": {
    "description": "天王紅的應援毛巾，是散場前高舉過頭、用力揮動的那一抹顏色。吸汗柔軟，演唱會後拿來健身慢跑也剛剛好。",
    "specs": [
      {
        "k": "材質",
        "v": "純棉割絨，雙面印花"
      },
      {
        "k": "顏色",
        "v": "天王紅"
      },
      {
        "k": "尺寸",
        "v": "30 × 110 cm 長巾"
      },
      {
        "k": "印製",
        "v": "兩端應援標語印花"
      }
    ],
    "related": [
      "andy-lau-light-stick",
      "andy-lau-fan-bundle",
      "andy-lau-tour-tee"
    ],
    "shipping": "現貨3個工作天內出貨，台港同步寄送。",
    "returns": "未下水、吊牌完整可於到貨7日內退換。"
  },
  "andy-lau-notebook": {
    "description": "四十年如一日的自律，被收進這本語錄手帳的每一頁扉頁裡。內頁穿插華仔談努力與堅持的字句，寫計畫的同時也替自己打打氣。",
    "specs": [
      {
        "k": "裝幀",
        "v": "硬殼精裝，可180度攤平"
      },
      {
        "k": "內頁",
        "v": "120 頁，米色道林紙"
      },
      {
        "k": "內容",
        "v": "扉頁勵志語錄穿插"
      },
      {
        "k": "尺寸",
        "v": "A5（148 × 210 mm）"
      }
    ],
    "related": [
      "andy-lau-leather-wallet",
      "andy-lau-mug",
      "andy-lau-tote"
    ],
    "shipping": "現貨3個工作天內出貨，以氣泡袋防護寄出。",
    "returns": "文具類未使用可於到貨7日內退換，內頁瑕疵免費換貨。"
  },
  "andy-lau-tee-anniversary": {
    "description": "華仔天地走過三十五個年頭，這件紀念T恤把成立年份與會員精神印在前胸。一件衣服，記得的是幾代歌迷一路同行的故事。",
    "specs": [
      {
        "k": "材質",
        "v": "精梳棉，200g 親膚磅數"
      },
      {
        "k": "印製",
        "v": "前胸35週年紀念視覺"
      },
      {
        "k": "版型",
        "v": "經典合身剪裁"
      },
      {
        "k": "限定",
        "v": "週年紀念款"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "純白",
            "value": "white"
          },
          {
            "label": "天王紅",
            "value": "tian-wang-red"
          }
        ]
      }
    ],
    "related": [
      "andy-lau-tour-tee",
      "andy-lau-tote",
      "andy-lau-cap"
    ],
    "shipping": "現貨3個工作天內出貨，台港皆可寄送。",
    "returns": "未下水、吊牌完整可於到貨7日內退換，已穿著恕不受理。"
  },
  "andy-lau-puzzle": {
    "description": "把一張經典劇照拆成一千片，再用一個下午慢慢拼回完整的記憶。完成後可裱框收藏，是給長途歌迷的一場療癒儀式。",
    "specs": [
      {
        "k": "片數",
        "v": "1000 片"
      },
      {
        "k": "完成尺寸",
        "v": "約 50 × 75 cm"
      },
      {
        "k": "材質",
        "v": "環保紙板，啞面不反光"
      },
      {
        "k": "內附",
        "v": "拼圖海報對照圖一張"
      }
    ],
    "related": [
      "andy-lau-poster-trilogy",
      "andy-lau-film-photobook",
      "andy-lau-postcards"
    ],
    "shipping": "現貨3個工作天內出貨，盒裝以氣泡袋加固。",
    "returns": "拆封後因缺片難以核對恕不退換，缺件可於到貨7日內補件。"
  },
  "andy-lau-fan-bundle": {
    "description": "巡演必備三件，一次備齊：經典款T恤、多色應援燈與天王紅毛巾。從進場到安可，把整晚的儀式感打包帶回家。",
    "specs": [
      {
        "k": "內容",
        "v": "T恤 + 應援燈 + 應援毛巾"
      },
      {
        "k": "T恤尺寸",
        "v": "S / M / L / XL 可選"
      },
      {
        "k": "搭配價",
        "v": "較單買省約 15%"
      },
      {
        "k": "包裝",
        "v": "套組專屬禮盒"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "T恤尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "經典黑",
            "value": "classic-black"
          }
        ]
      }
    ],
    "related": [
      "andy-lau-tour-tee",
      "andy-lau-light-stick",
      "andy-lau-cheer-towel"
    ],
    "shipping": "套組現貨3至5個工作天內出貨，整組以禮盒包裝寄送。",
    "returns": "套組需整組退回方可受理，未使用且包裝完整於到貨7日內辦理。"
  },
  "andy-lau-phone-case": {
    "description": "《暗裡著迷》那句藏了多年的告白，被低調印在手機殼背面。霧面質感不沾指紋，把一份不張揚的喜歡，悄悄帶在身邊。",
    "specs": [
      {
        "k": "材質",
        "v": "軍規防摔 TPU + PC"
      },
      {
        "k": "印製",
        "v": "背面歌名霧面燙印"
      },
      {
        "k": "防護",
        "v": "四角氣囊、鏡頭加高"
      },
      {
        "k": "機型",
        "v": "iPhone / Android 主流機型"
      }
    ],
    "related": [
      "andy-lau-keychain",
      "andy-lau-leather-wallet",
      "andy-lau-umbrella"
    ],
    "shipping": "依機型備貨後出貨，約3至5個工作天，台港可配送。",
    "returns": "客製機型如未使用可於到貨7日內退換，請於下單前確認型號。"
  },
  "andy-lau-umbrella": {
    "description": "《暗戰》裡那場與時間賽跑的對決，被收進這把摺疊傘的低調設計裡。一鍵自動開收，抗風骨架撐得住城市的每一場突如其來的雨。",
    "specs": [
      {
        "k": "骨架",
        "v": "八骨自動開收，玻纖抗風"
      },
      {
        "k": "傘面",
        "v": "黑膠塗層，抗UV防曬"
      },
      {
        "k": "收合長度",
        "v": "約 30 cm，輕量便攜"
      },
      {
        "k": "設計",
        "v": "傘骨內側暗戰主題印字"
      }
    ],
    "related": [
      "andy-lau-phone-case",
      "andy-lau-keychain",
      "andy-lau-cheer-towel"
    ],
    "shipping": "現貨3個工作天內出貨，台港皆可寄送。",
    "returns": "未使用、包裝完整可於到貨7日內退換，開收功能瑕疵保固30天。"
  },
  "jolin-tsai-ugly-beauty-vinyl": {
    "description": "《Ugly Beauty 怪美的》以雙片重量黑膠重新封存那場關於自我和解的旅程，從〈玫瑰少年〉到〈怪美的〉，每一道刻痕都收進了當年的勇敢。典藏外盒採燙金工藝，翻面播放的儀式感，像把2018年的那個夜晚再聽一次。",
    "specs": [
      {
        "k": "規格",
        "v": "180g 重量級雙黑膠（2LP）"
      },
      {
        "k": "轉速",
        "v": "33⅓ RPM"
      },
      {
        "k": "內容",
        "v": "全專輯13首＋燙金跨頁歌詞冊"
      },
      {
        "k": "版本",
        "v": "Ztor 限量典藏編號"
      }
    ],
    "related": [
      "jolin-tsai-pleasure-cd",
      "jolin-tsai-photobook",
      "jolin-tsai-rose-necklace"
    ],
    "shipping": "台灣本島常溫宅配，下單後 5–7 個工作天出貨；黑膠以防壓硬殼包裝寄送。",
    "returns": "拆封後因屬影音商品恕不退換；外盒擠壓或刻痕瑕疵請於到貨 7 日內聯繫客服更換。"
  },
  "jolin-tsai-pleasure-cd": {
    "description": "《Pleasure 玩美》是她睽違後再次跳進舞池的宣言，把這些年的歷練都轉化成更鬆弛、更敢玩的節奏。實體CD收錄全新編曲與隱藏歌詞卡，適合在通勤的耳機裡，先一個人偷偷玩美。",
    "specs": [
      {
        "k": "格式",
        "v": "CD（單片裝）"
      },
      {
        "k": "收錄",
        "v": "全新專輯10首"
      },
      {
        "k": "附件",
        "v": "歌詞拉頁＋隨機造型卡一張"
      },
      {
        "k": "包裝",
        "v": "環保紙質書本式封套"
      }
    ],
    "related": [
      "jolin-tsai-ugly-beauty-vinyl",
      "jolin-tsai-tour-tee",
      "jolin-tsai-postcards"
    ],
    "shipping": "全台常溫宅配或超商取貨，2–4 個工作天送達。",
    "returns": "未拆封可於到貨 7 日內申請退換；已拆封之影音商品恕不接受退貨。"
  },
  "jolin-tsai-tour-tee": {
    "description": "巡演限定T恤把〈怪美的〉那抹標誌性的紫，染進了每一次起跳與落地的汗水裡。寬鬆落肩剪裁，背後印著巡演城市清單，是一件能直接穿去現場、也能日常想起那晚的衣服。",
    "specs": [
      {
        "k": "材質",
        "v": "純棉 230gsm 厚磅"
      },
      {
        "k": "版型",
        "v": "中性寬鬆落肩"
      },
      {
        "k": "印製",
        "v": "正面怪美主視覺＋背面巡演城市"
      },
      {
        "k": "洗滌",
        "v": "翻面冷水手洗，避免烘乾"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "怪美紫",
            "value": "ugly-purple"
          },
          {
            "label": "午夜黑",
            "value": "midnight-black"
          }
        ]
      }
    ],
    "related": [
      "jolin-tsai-hoodie",
      "jolin-tsai-cap",
      "jolin-tsai-fan-bundle"
    ],
    "shipping": "全台常溫宅配，2–4 個工作天出貨；可選超商取貨。",
    "returns": "未水洗、未剪標可於到貨 7 日內換尺寸一次；個人衛生因素恕不退貨。"
  },
  "jolin-tsai-rose-necklace": {
    "description": "以〈玫瑰少年〉為靈感的純銀項鍊，把那句「你並不孤單」鍛成可以隨身佩戴的溫柔。鎖骨間一朵小小的銀玫瑰，是給每個曾經害怕與眾不同的人的勇氣信物。",
    "specs": [
      {
        "k": "材質",
        "v": "925 純銀"
      },
      {
        "k": "鍊長",
        "v": "40cm＋5cm 延長鍊"
      },
      {
        "k": "墜飾",
        "v": "立體玫瑰墜（約 1.2cm）"
      },
      {
        "k": "附件",
        "v": "絨布收納袋＋拭銀布"
      }
    ],
    "related": [
      "jolin-tsai-earrings",
      "jolin-tsai-ugly-beauty-vinyl",
      "jolin-tsai-candle"
    ],
    "shipping": "台灣本島掛號宅配，下單後 5–7 個工作天出貨，附獨立禮盒。",
    "returns": "客製化飾品拆封後恕不退換；如有焊點或鍍層瑕疵，請於到貨 10 日內提供照片換貨。"
  },
  "jolin-tsai-photobook": {
    "description": "《怪美現場》收錄了Ugly Beauty巡演從彩排到謝幕的幕後光影，舞台上的張力與後台的安靜在同一本書裡並存。120頁全彩印刷，翻開就像重新走進那座只屬於她與歌迷的劇場。",
    "specs": [
      {
        "k": "頁數",
        "v": "120 頁全彩"
      },
      {
        "k": "尺寸",
        "v": "24 × 30cm 精裝"
      },
      {
        "k": "內容",
        "v": "巡演舞台＋後台側拍＋私房手記"
      },
      {
        "k": "印刷",
        "v": "日本進口霧面藝術紙"
      }
    ],
    "related": [
      "jolin-tsai-ugly-beauty-vinyl",
      "jolin-tsai-postcards",
      "jolin-tsai-tour-tee"
    ],
    "shipping": "全台常溫宅配，下單後 3–5 個工作天出貨；以硬殼防護包裝寄送。",
    "returns": "印刷品拆封後恕不退換；裝訂或印刷瑕疵請於到貨 7 日內聯繫更換。"
  },
  "jolin-tsai-yoga-mat": {
    "description": "取名自她最為人津津樂道的「地才」精神——天分不夠，就用練習補上。這張瑜珈墊把那份日復一日的自律帶回家，防滑表面與適中厚度，陪你把每個動作練到位。",
    "specs": [
      {
        "k": "尺寸",
        "v": "183 × 61cm"
      },
      {
        "k": "厚度",
        "v": "6mm TPE 環保材質"
      },
      {
        "k": "表面",
        "v": "雙面防滑壓紋"
      },
      {
        "k": "附件",
        "v": "專屬綁帶＋金句提袋"
      }
    ],
    "related": [
      "jolin-tsai-tumbler",
      "jolin-tsai-scrunchie-set",
      "jolin-tsai-baking-apron"
    ],
    "shipping": "全台常溫宅配，2–4 個工作天送達；捲裝以紙箱包裝。",
    "returns": "未使用且包裝完整可於到貨 7 日內退換；已使用之個人健身用品恕不退貨。"
  },
  "jolin-tsai-light-stick": {
    "description": "怪美應援燈的燈頭以不規則切面折射光線，呼應〈怪美的〉那種不完美才迷人的主張。可連動現場控燈，在黑暗裡跟著旋律一起呼吸，是握在手心的那束專屬光。",
    "specs": [
      {
        "k": "材質",
        "v": "ABS 燈身＋多切面亞克力燈頭"
      },
      {
        "k": "功能",
        "v": "藍牙連動現場控燈"
      },
      {
        "k": "電源",
        "v": "內建充電鋰電池（附 USB-C 線）"
      },
      {
        "k": "尺寸",
        "v": "全長約 28cm"
      }
    ],
    "related": [
      "jolin-tsai-fan-bundle",
      "jolin-tsai-tour-tee",
      "jolin-tsai-phone-strap"
    ],
    "shipping": "全台常溫宅配，2–4 個工作天出貨；內含鋰電池，僅限陸運寄送。",
    "returns": "未拆封可於到貨 7 日內退換；功能異常請於 14 日內聯繫保固維修。"
  },
  "jolin-tsai-cap": {
    "description": "棒球帽正面刺繡那個代表《呸 PLAY》的「呸」字，把當年那張突破之作的態度直接戴上頭。帽圍可調，曲簷低調好搭，無論進場或日常都能呸一下。",
    "specs": [
      {
        "k": "材質",
        "v": "純棉斜紋布"
      },
      {
        "k": "工藝",
        "v": "正面立體電繡「呸」字"
      },
      {
        "k": "帽圍",
        "v": "後扣可調 56–60cm"
      },
      {
        "k": "簷型",
        "v": "經典曲簷六片帽"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "均碼",
            "value": "one-size"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "純黑",
            "value": "black"
          },
          {
            "label": "奶茶",
            "value": "latte"
          },
          {
            "label": "霧灰",
            "value": "grey"
          }
        ]
      }
    ],
    "related": [
      "jolin-tsai-tour-tee",
      "jolin-tsai-hoodie",
      "jolin-tsai-scrunchie-set"
    ],
    "shipping": "全台常溫宅配，2–4 個工作天出貨；可選超商取貨。",
    "returns": "未拆吊牌、未使用可於到貨 7 日內換色一次；個人配戴用品恕不退貨。"
  },
  "jolin-tsai-hoodie": {
    "description": "Ugly Beauty連帽帽T以厚磅內刷毛打底，左胸低調繡上專輯標誌，把那段關於接納不完美的故事穿在身上。帽繩與口袋細節耐看，是換季時最想抓起來就出門的一件。",
    "specs": [
      {
        "k": "材質",
        "v": "棉混紡內刷毛 320gsm"
      },
      {
        "k": "版型",
        "v": "中性落肩寬鬆"
      },
      {
        "k": "細節",
        "v": "左胸電繡 logo＋雙層連帽"
      },
      {
        "k": "洗滌",
        "v": "翻面冷水洗，避免高溫烘乾"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "墨黑",
            "value": "ink-black"
          },
          {
            "label": "霧灰",
            "value": "fog-grey"
          }
        ]
      }
    ],
    "related": [
      "jolin-tsai-tour-tee",
      "jolin-tsai-cap",
      "jolin-tsai-fan-bundle"
    ],
    "shipping": "全台常溫宅配，2–4 個工作天出貨；可選超商取貨。",
    "returns": "未水洗、未剪標可於到貨 7 日內換尺寸一次；個人衛生因素恕不退貨。"
  },
  "jolin-tsai-earrings": {
    "description": "舞孃流蘇耳環的靈感來自《舞孃》那身搖曳生姿的造型，細密流蘇隨步伐輕擺，像把舞台上的律動戴在耳畔。輕量設計久戴不墜，日常一甩就有了主角光環。",
    "specs": [
      {
        "k": "材質",
        "v": "合金鍍金＋金屬流蘇"
      },
      {
        "k": "長度",
        "v": "墜長約 6.5cm"
      },
      {
        "k": "耳針",
        "v": "925 銀針抗敏"
      },
      {
        "k": "附件",
        "v": "防塵絨布袋"
      }
    ],
    "related": [
      "jolin-tsai-rose-necklace",
      "jolin-tsai-mirror",
      "jolin-tsai-scrunchie-set"
    ],
    "shipping": "全台常溫宅配，下單後 3–5 個工作天出貨，附小禮盒。",
    "returns": "耳飾屬貼身用品，拆封後恕不退換；如有瑕疵請於到貨 7 日內提供照片換貨。"
  },
  "jolin-tsai-tote": {
    "description": "日不落帆布袋取〈日不落〉那份永不熄滅的明亮,把歌名印成燙白標語,背在肩上像隨身帶著一整片不落幕的天空。厚磅帆布耐裝耐磨,裝書裝雜物都從容。",
    "specs": [
      {
        "k": "材質",
        "v": "12 安士厚磅帆布"
      },
      {
        "k": "尺寸",
        "v": "38 × 40 × 10cm"
      },
      {
        "k": "細節",
        "v": "燙白歌名標語＋內裡口袋"
      },
      {
        "k": "承重",
        "v": "建議 5kg 以內"
      }
    ],
    "related": [
      "jolin-tsai-tumbler",
      "jolin-tsai-postcards",
      "jolin-tsai-sticker-pack"
    ],
    "shipping": "全台常溫宅配或超商取貨，2–4 個工作天送達。",
    "returns": "未使用、吊牌完整可於到貨 7 日內退換；已使用恕不退貨。"
  },
  "jolin-tsai-mirror": {
    "description": "怪美隨身摺疊鏡的鏡面背後印著「怪美的，才是妳本來的樣子」,提醒每次補妝時都別忘了照見最真實的自己。掌心大小好攜帶,翻開的瞬間就有人替妳打氣。",
    "specs": [
      {
        "k": "材質",
        "v": "亮面鏡片＋金屬外框"
      },
      {
        "k": "尺寸",
        "v": "直徑約 7cm 摺疊式"
      },
      {
        "k": "功能",
        "v": "雙面鏡（一般＋放大）"
      },
      {
        "k": "印製",
        "v": "背面金句燙印"
      }
    ],
    "related": [
      "jolin-tsai-scrunchie-set",
      "jolin-tsai-earrings",
      "jolin-tsai-sticker-pack"
    ],
    "shipping": "全台常溫宅配或超商取貨,2–4 個工作天送達。",
    "returns": "未使用、包裝完整可於到貨 7 日內退換;鏡面破損請於到貨時即拍照聯繫客服。"
  },
  "jolin-tsai-sticker-pack": {
    "description": "歌詞金句貼紙包蒐集了她歷年作品裡最戳心的句子,從〈玫瑰少年〉到〈怪美的〉,撕下一張就把態度貼在筆電或水壺上。防水材質耐貼耐撕,讓金句陪妳走過每個平凡的日子。",
    "specs": [
      {
        "k": "張數",
        "v": "全套 16 張不重複"
      },
      {
        "k": "材質",
        "v": "防水 PVC 模切貼紙"
      },
      {
        "k": "主題",
        "v": "歷年歌詞金句"
      },
      {
        "k": "尺寸",
        "v": "單張 5–8cm 不等"
      }
    ],
    "related": [
      "jolin-tsai-postcards",
      "jolin-tsai-mirror",
      "jolin-tsai-fan-bundle"
    ],
    "shipping": "全台常溫宅配或超商取貨,2–4 個工作天送達;小件可平信寄送。",
    "returns": "貼紙拆封後恕不退換;若到貨破損請於 7 日內提供照片補寄。"
  },
  "jolin-tsai-postcards": {
    "description": "舞台造型明信片組收錄她從《舞孃》到《Ugly Beauty》各時期的經典造型,一張一個她敢於翻新的時代切片。可寄出也可收藏,把那些被她跳成永恆的瞬間留在手邊。",
    "specs": [
      {
        "k": "張數",
        "v": "全套 12 張"
      },
      {
        "k": "主題",
        "v": "歷年舞台造型"
      },
      {
        "k": "材質",
        "v": "300g 進口卡紙"
      },
      {
        "k": "尺寸",
        "v": "10 × 15cm 標準明信片"
      }
    ],
    "related": [
      "jolin-tsai-photobook",
      "jolin-tsai-sticker-pack",
      "jolin-tsai-pleasure-cd"
    ],
    "shipping": "全台常溫宅配或超商取貨,2–4 個工作天送達。",
    "returns": "印刷品拆封後恕不退換;若到貨折損請於 7 日內聯繫補寄。"
  },
  "jolin-tsai-tumbler": {
    "description": "倒帶保溫隨行杯側身印著〈倒帶〉那句熟悉的旋律,在杯壁凝結的水珠裡,彷彿時間真的能倒著走。雙層真空保溫,冷熱都鎖得住,陪妳重播每段想念的時光。",
    "specs": [
      {
        "k": "容量",
        "v": "480ml"
      },
      {
        "k": "材質",
        "v": "316 不鏽鋼內膽"
      },
      {
        "k": "保溫",
        "v": "保冷 12hr／保溫 8hr"
      },
      {
        "k": "印製",
        "v": "側身〈倒帶〉歌詞雷雕"
      }
    ],
    "related": [
      "jolin-tsai-yoga-mat",
      "jolin-tsai-tote",
      "jolin-tsai-baking-apron"
    ],
    "shipping": "全台常溫宅配或超商取貨,2–4 個工作天送達。",
    "returns": "未使用、包裝完整可於到貨 7 日內退換;已使用之飲用器具恕不退貨。"
  },
  "jolin-tsai-scrunchie-set": {
    "description": "大髮髻髮圈三入組呼應她舞台上那顆招牌的高髮髻,把那份俐落帥氣收進日常造型。緞面與絨布混搭三種質感,綁起來不勒髮,練舞、上班、賴床都能一秒換上態度。",
    "specs": [
      {
        "k": "數量",
        "v": "三入一組"
      },
      {
        "k": "材質",
        "v": "緞面 ×1、絲絨 ×1、棉質 ×1"
      },
      {
        "k": "尺寸",
        "v": "大尺寸加厚髮圈"
      },
      {
        "k": "配色",
        "v": "怪美紫／黑／奶茶"
      }
    ],
    "related": [
      "jolin-tsai-mirror",
      "jolin-tsai-cap",
      "jolin-tsai-earrings"
    ],
    "shipping": "全台常溫宅配或超商取貨,2–4 個工作天送達。",
    "returns": "髮飾屬貼身用品,拆封後恕不退換;如有瑕疵請於到貨 7 日內換貨。"
  },
  "jolin-tsai-candle": {
    "description": "玫瑰香氛蠟燭以〈玫瑰少年〉為名,前調是初綻玫瑰,尾韻沉著溫柔,點燃時像有人輕聲說著「你並不孤單」。大豆蠟燃燒乾淨,適合在獨處的夜晚,給自己一點被理解的暖。",
    "specs": [
      {
        "k": "容量",
        "v": "200g 玻璃罐裝"
      },
      {
        "k": "蠟材",
        "v": "天然大豆蠟"
      },
      {
        "k": "香調",
        "v": "玫瑰前調＋木質尾韻"
      },
      {
        "k": "燃燒",
        "v": "約 40 小時"
      }
    ],
    "related": [
      "jolin-tsai-rose-necklace",
      "jolin-tsai-mirror",
      "jolin-tsai-yoga-mat"
    ],
    "shipping": "全台常溫宅配,2–4 個工作天出貨;玻璃製品以防撞泡棉包裝。",
    "returns": "未拆封可於到貨 7 日內退換;已點燃之香氛商品恕不退貨,破損請拍照聯繫客服。"
  },
  "jolin-tsai-fan-bundle": {
    "description": "怪美套組一次集齊巡演T恤、怪美應援燈與歌詞金句貼紙包,從進場到日常一次備齊,讓初次入坑或想送禮的你都能輕鬆上手。三件組合搭配專屬包裝,是把「怪美的」整套帶回家的最快方式。",
    "specs": [
      {
        "k": "內容",
        "v": "巡演T恤 ×1＋怪美應援燈 ×1＋貼紙包 ×1"
      },
      {
        "k": "T恤尺寸",
        "v": "下單後於備註填寫 S–XL"
      },
      {
        "k": "包裝",
        "v": "專屬套組禮盒"
      },
      {
        "k": "附件",
        "v": "隨組造型卡一張"
      }
    ],
    "related": [
      "jolin-tsai-tour-tee",
      "jolin-tsai-light-stick",
      "jolin-tsai-sticker-pack"
    ],
    "shipping": "全台常溫宅配,2–4 個工作天出貨;含鋰電池應援燈,僅限陸運。",
    "returns": "套組為組合優惠商品,恕不單件退換;整組未拆封可於到貨 7 日內退貨。"
  },
  "jolin-tsai-phone-strap": {
    "description": "看我七十二變手機鍊取〈看我七十二變〉那份善變又自信的精神,珠鍊配色低調卻有記憶點,讓手機成了隨身的小舞台。可拆式設計能掛包也能斜背,變換造型就像她每張專輯一樣百看不膩。",
    "specs": [
      {
        "k": "材質",
        "v": "金屬珠鍊＋編織背帶"
      },
      {
        "k": "長度",
        "v": "可調 短掛／斜背兩用"
      },
      {
        "k": "接頭",
        "v": "通用夾片（多數機型適用）"
      },
      {
        "k": "配色",
        "v": "怪美紫漸層"
      }
    ],
    "related": [
      "jolin-tsai-light-stick",
      "jolin-tsai-tote",
      "jolin-tsai-mirror"
    ],
    "shipping": "全台常溫宅配或超商取貨,2–4 個工作天送達。",
    "returns": "未使用、包裝完整可於到貨 7 日內退換;已使用恕不退貨。"
  },
  "jolin-tsai-baking-apron": {
    "description": "甜點烘焙圍裙呼應她私下熱愛手作甜點、還曾出書的另一面,把舞台天后回到廚房的那份專注做成日常穿搭。防潑水帆布耐髒好洗,口袋設計順手,讓下廚也能玩得很美。",
    "specs": [
      {
        "k": "材質",
        "v": "防潑水帆布"
      },
      {
        "k": "版型",
        "v": "中性圍裙，頸帶可調"
      },
      {
        "k": "細節",
        "v": "前方雙口袋＋金句印製"
      },
      {
        "k": "洗滌",
        "v": "可機洗，低溫熨燙"
      }
    ],
    "variants": [
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "奶油白",
            "value": "cream"
          },
          {
            "label": "可可棕",
            "value": "cocoa"
          }
        ]
      }
    ],
    "related": [
      "jolin-tsai-tumbler",
      "jolin-tsai-yoga-mat",
      "jolin-tsai-tote"
    ],
    "shipping": "全台常溫宅配或超商取貨,2–4 個工作天送達。",
    "returns": "未水洗、吊牌完整可於到貨 7 日內換色一次;已使用恕不退貨。"
  },
  "rainie-yang-vinyl-rain-love": {
    "description": "〈雨愛〉是無數人青春裡那場下不停的雨，這張十五週年黑膠把那份溫柔的潮濕重新壓進溝槽裡。180 克重盤、跨頁歌詞內頁，適合在某個想念的夜晚，讓唱針慢慢走完整首副歌。",
    "specs": [
      {
        "k": "規格",
        "v": "12 吋 180g 黑膠，單張"
      },
      {
        "k": "轉速",
        "v": "33⅓ RPM"
      },
      {
        "k": "附件",
        "v": "跨頁歌詞內頁＋復刻側標"
      },
      {
        "k": "壓製",
        "v": "日本壓盤限量編號"
      }
    ],
    "related": [
      "rainie-yang-album-delete-reset",
      "rainie-yang-umbrella",
      "rainie-yang-fan-bundle"
    ],
    "shipping": "台灣本島常溫宅配，黑膠以防壓硬殼包裝，出貨後 3–5 個工作天送達。",
    "returns": "非人為損傷之七天鑑賞期，拆封黑膠經播放後恕不退換，瑕疵品可換貨。"
  },
  "rainie-yang-album-delete-reset": {
    "description": "《刪‧拾以後》是丞琳寫給自己的整理術，把放不下的都收進這張典藏 CD 裡。精裝書封設計、附完整創作手記，留給每個正在學著與過去和解的人。",
    "specs": [
      {
        "k": "格式",
        "v": "CD 單片＋精裝書冊"
      },
      {
        "k": "曲目",
        "v": "全專輯 11 首收錄"
      },
      {
        "k": "內容",
        "v": "創作手記＋歌詞全文"
      },
      {
        "k": "語言",
        "v": "國語"
      }
    ],
    "related": [
      "rainie-yang-vinyl-rain-love",
      "rainie-yang-photobook",
      "rainie-yang-tote-bag"
    ],
    "shipping": "台灣本島常溫宅配，出貨後 2–4 個工作天到貨，外島順延。",
    "returns": "享七天猶豫期，CD 拆封影響二次銷售恕不退貨，運送瑕疵可申請換貨。"
  },
  "rainie-yang-tour-tee-black": {
    "description": "LIKE A STAR 巡演限定的純黑款，把整場演唱會的星光收進胸前那一行燙印。厚磅純棉、寬鬆版型，是看完安可場還想一直穿著回家的那件。",
    "specs": [
      {
        "k": "材質",
        "v": "100% 純棉 200g/m²"
      },
      {
        "k": "版型",
        "v": "中性寬鬆"
      },
      {
        "k": "印製",
        "v": "正面燙印＋背後巡演日期"
      },
      {
        "k": "產地",
        "v": "台灣製"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "經典黑",
            "value": "black"
          }
        ]
      }
    ],
    "related": [
      "rainie-yang-tour-tee-white",
      "rainie-yang-tour-hoodie",
      "rainie-yang-fan-bundle"
    ],
    "shipping": "台灣本島常溫宅配，現貨出貨後 3–5 個工作天送達。",
    "returns": "七天鑑賞期內，未下水、吊牌完整可退換；個人因素退貨運費自付。"
  },
  "rainie-yang-tour-hoodie": {
    "description": "巡演限定的連帽外套，是散場後夜風裡最剛好的溫度。刷毛內裡、左胸小巧 LIKE A STAR 刺繡，低調得像只有同場的人才懂。",
    "specs": [
      {
        "k": "材質",
        "v": "棉混紡刷毛 320g/m²"
      },
      {
        "k": "細節",
        "v": "左胸刺繡＋雙層帽簷"
      },
      {
        "k": "版型",
        "v": "落肩寬鬆"
      },
      {
        "k": "洗滌",
        "v": "翻面冷水手洗"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "霧灰",
            "value": "grey"
          },
          {
            "label": "墨黑",
            "value": "black"
          }
        ]
      }
    ],
    "related": [
      "rainie-yang-tour-tee-black",
      "rainie-yang-cap",
      "rainie-yang-fan-bundle"
    ],
    "shipping": "台灣本島常溫宅配，新品現貨出貨後 3–5 個工作天到貨。",
    "returns": "收到七天內，未穿著、未拆吊牌可辦理退換，刺繡瑕疵免費換新。"
  },
  "rainie-yang-lyrics-poster-set": {
    "description": "三張歌詞海報，把〈雨愛〉〈年輪說〉〈青春住了誰〉裡最揪心的那幾句留在牆上。霧面藝術紙印刷，貼在床頭就像每天醒來都被歌詞輕輕抱了一下。",
    "specs": [
      {
        "k": "內容",
        "v": "歌詞海報 3 張一組"
      },
      {
        "k": "尺寸",
        "v": "A2（420×594mm）"
      },
      {
        "k": "紙質",
        "v": "霧面藝術紙 200g"
      },
      {
        "k": "包裝",
        "v": "硬筒捲裝"
      }
    ],
    "related": [
      "rainie-yang-photobook",
      "rainie-yang-postcard-set",
      "rainie-yang-sticker-pack"
    ],
    "shipping": "台灣本島常溫宅配，海報以硬筒捲裝出貨，3–5 個工作天送達。",
    "returns": "七天內未拆封可退換，捲裝拆封後僅接受瑕疵換貨。"
  },
  "rainie-yang-photobook": {
    "description": "《青春住了誰》寫真歌詞本，把那段關於成長與遺憾的旋律拍成了畫面。雜誌級全彩印刷、收錄手寫歌詞，翻著翻著就回到了那個夏天。",
    "specs": [
      {
        "k": "頁數",
        "v": "96 頁全彩"
      },
      {
        "k": "開本",
        "v": "21×28cm"
      },
      {
        "k": "內容",
        "v": "寫真＋手寫歌詞"
      },
      {
        "k": "裝幀",
        "v": "精裝硬殼"
      }
    ],
    "related": [
      "rainie-yang-album-delete-reset",
      "rainie-yang-lyrics-poster-set",
      "rainie-yang-postcard-set"
    ],
    "shipping": "台灣本島常溫宅配，精裝書以防撞包裝，出貨後 3–5 個工作天到貨。",
    "returns": "享七天鑑賞期，書況完整可退換，內頁印刷瑕疵免運換貨。"
  },
  "rainie-yang-light-stick": {
    "description": "雨滴造型的應援手燈，是整片觀眾席最溫柔的那場雨。可調色溫、握把貼合手心，把每一次揮舞都變成對舞台的回應。",
    "specs": [
      {
        "k": "造型",
        "v": "雨滴透光燈頭"
      },
      {
        "k": "光源",
        "v": "多段色溫 LED"
      },
      {
        "k": "電力",
        "v": "3 號電池 ×2（不含）"
      },
      {
        "k": "材質",
        "v": "ABS＋亞克力導光"
      }
    ],
    "related": [
      "rainie-yang-umbrella",
      "rainie-yang-badge-set",
      "rainie-yang-fan-bundle"
    ],
    "shipping": "台灣本島常溫宅配，含電子零件採防震包裝，3–5 個工作天送達。",
    "returns": "七天內非人為故障可退換，拆封通電後僅接受瑕疵換貨。"
  },
  "rainie-yang-umbrella": {
    "description": "〈雨愛〉透明傘，把那句「淋濕的並不是雨」撐在頭頂。大尺寸傘面、自動開收，下雨天也想被這首歌好好罩著。",
    "specs": [
      {
        "k": "傘面",
        "v": "透明 PVC 直徑 105cm"
      },
      {
        "k": "開收",
        "v": "自動開傘"
      },
      {
        "k": "傘骨",
        "v": "八骨防風"
      },
      {
        "k": "印製",
        "v": "傘緣歌詞燙印"
      }
    ],
    "related": [
      "rainie-yang-light-stick",
      "rainie-yang-vinyl-rain-love",
      "rainie-yang-tote-bag"
    ],
    "shipping": "台灣本島常溫宅配，出貨後 2–4 個工作天到貨，外島順延。",
    "returns": "七天內未使用、包裝完整可退換，傘骨瑕疵免費換新。"
  },
  "rainie-yang-tote-bag": {
    "description": "年輪說帆布托特包，把「一圈一圈纏成繭」的歌詞織進日常。厚磅帆布、容量俐落，裝得下黑膠也裝得下一整天的心事。",
    "specs": [
      {
        "k": "材質",
        "v": "12 安厚磅帆布"
      },
      {
        "k": "尺寸",
        "v": "38×40×10cm"
      },
      {
        "k": "印製",
        "v": "年輪圖騰絹印"
      },
      {
        "k": "提把",
        "v": "加長肩背款"
      }
    ],
    "related": [
      "rainie-yang-vinyl-rain-love",
      "rainie-yang-mug",
      "rainie-yang-phone-case"
    ],
    "shipping": "台灣本島常溫宅配，出貨後 3–5 個工作天送達。",
    "returns": "七天鑑賞期內未使用、吊牌完整可退換，絹印瑕疵可換貨。"
  },
  "rainie-yang-frog-keyring": {
    "description": "青蛙王子壓克力鑰匙圈，藏著那句「等待王子的青蛙」的少女心事。雙面印刷、霧面收邊，掛在包上是只有自己懂的小暗號。",
    "specs": [
      {
        "k": "材質",
        "v": "壓克力雙面印刷"
      },
      {
        "k": "尺寸",
        "v": "約 6cm"
      },
      {
        "k": "配件",
        "v": "龍蝦扣金屬圈"
      },
      {
        "k": "工藝",
        "v": "霧面 UV 收邊"
      }
    ],
    "related": [
      "rainie-yang-scrunchie-set",
      "rainie-yang-sticker-pack",
      "rainie-yang-badge-set"
    ],
    "shipping": "台灣本島常溫宅配，小物以氣泡袋包裝，2–4 個工作天到貨。",
    "returns": "七天內未拆封可退換，拆封後僅接受運送瑕疵換貨。"
  },
  "rainie-yang-postcard-set": {
    "description": "巡演劇照明信片組，把 LIKE A STAR 舞台上的十二個瞬間裝進口袋。霧面厚卡、可寫可收藏，留給想把那場演唱會寄給未來自己的人。",
    "specs": [
      {
        "k": "數量",
        "v": "12 張一組"
      },
      {
        "k": "尺寸",
        "v": "明信片標準 10×15cm"
      },
      {
        "k": "紙質",
        "v": "霧面厚卡 300g"
      },
      {
        "k": "內容",
        "v": "巡演幕後＋舞台劇照"
      }
    ],
    "related": [
      "rainie-yang-lyrics-poster-set",
      "rainie-yang-photobook",
      "rainie-yang-badge-set"
    ],
    "shipping": "台灣本島常溫宅配，平裝防折包裝，出貨後 2–4 個工作天送達。",
    "returns": "七天內未拆封可退換，拆封後僅接受瑕疵換貨。"
  },
  "rainie-yang-cap": {
    "description": "RY 刺繡棒球帽，把丞琳的名字縮成胸前最簡單的浪漫。立體刺繡、可調帽圍，不管哪個季節都能戴著她出門。",
    "specs": [
      {
        "k": "材質",
        "v": "斜紋純棉"
      },
      {
        "k": "工藝",
        "v": "RY 立體刺繡"
      },
      {
        "k": "帽圍",
        "v": "後扣可調 57–60cm"
      },
      {
        "k": "帽型",
        "v": "六片硬挺款"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "均碼",
            "value": "one-size"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "奶茶",
            "value": "beige"
          },
          {
            "label": "黑",
            "value": "black"
          }
        ]
      }
    ],
    "related": [
      "rainie-yang-tour-hoodie",
      "rainie-yang-tour-tee-white",
      "rainie-yang-scrunchie-set"
    ],
    "shipping": "台灣本島常溫宅配，出貨後 3–5 個工作天到貨。",
    "returns": "七天鑑賞期內未配戴、吊牌完整可退換，刺繡瑕疵免費換新。"
  },
  "rainie-yang-scrunchie-set": {
    "description": "曖昧緞面髮圈組，靈感來自〈曖昧〉裡那份「讓人受盡委屈」的柔軟。霧面緞布、不傷髮質，三色一組綁起一整週的好心情。",
    "specs": [
      {
        "k": "材質",
        "v": "啞光緞面布"
      },
      {
        "k": "數量",
        "v": "3 入一組"
      },
      {
        "k": "彈性",
        "v": "加寬鬆緊不勒髮"
      },
      {
        "k": "色系",
        "v": "霧粉／米白／墨綠"
      }
    ],
    "related": [
      "rainie-yang-frog-keyring",
      "rainie-yang-cap",
      "rainie-yang-sticker-pack"
    ],
    "shipping": "台灣本島常溫宅配，小物氣泡袋包裝，2–4 個工作天送達。",
    "returns": "基於衛生考量，髮飾拆封後恕不退換，運送瑕疵到貨三日內可換貨。"
  },
  "rainie-yang-mug": {
    "description": "海派甜心陶瓷馬克杯，把那部讓人又笑又暖的偶像劇收進晨間的第一杯咖啡。手繪風印花、容量大方，是甜心管家也會喜歡的日常儀式。",
    "specs": [
      {
        "k": "材質",
        "v": "高溫陶瓷"
      },
      {
        "k": "容量",
        "v": "380ml"
      },
      {
        "k": "印製",
        "v": "全彩轉印圖案"
      },
      {
        "k": "適用",
        "v": "可微波可洗碗機"
      }
    ],
    "related": [
      "rainie-yang-tote-bag",
      "rainie-yang-phone-case",
      "rainie-yang-sticker-pack"
    ],
    "shipping": "台灣本島常溫宅配，陶瓷品防撞包裝，出貨後 3–5 個工作天到貨。",
    "returns": "七天內未使用、包裝完整可退換，運送破損請於拆箱當下拍照申請換貨。"
  },
  "rainie-yang-phone-case": {
    "description": "雨夜霧面手機殼，把〈雨愛〉那種濕潤的藍調握在手心。霧面防指紋、四角加厚，讓每次拿起手機都像走進一場安靜的雨。",
    "specs": [
      {
        "k": "材質",
        "v": "霧面 TPU 軟殼"
      },
      {
        "k": "防護",
        "v": "四角氣囊加厚"
      },
      {
        "k": "手感",
        "v": "防指紋啞光"
      },
      {
        "k": "機型",
        "v": "下單時備註型號"
      }
    ],
    "related": [
      "rainie-yang-mug",
      "rainie-yang-tote-bag",
      "rainie-yang-frog-keyring"
    ],
    "shipping": "台灣本島常溫宅配，依機型備貨後 3–6 個工作天出貨。",
    "returns": "客製機型恕不退換，到貨瑕疵或型號錯誤可於七天內免費換貨。"
  },
  "rainie-yang-badge-set": {
    "description": "巡演徽章五入組，把 LIKE A STAR 舞台上的五個記憶別在外套上。金屬別針、霧面烤漆，散場後讓那場星光繼續跟著你走。",
    "specs": [
      {
        "k": "數量",
        "v": "5 入一組"
      },
      {
        "k": "尺寸",
        "v": "直徑 3.2cm"
      },
      {
        "k": "工藝",
        "v": "金屬烤漆別針"
      },
      {
        "k": "主題",
        "v": "巡演視覺五款"
      }
    ],
    "related": [
      "rainie-yang-postcard-set",
      "rainie-yang-light-stick",
      "rainie-yang-sticker-pack"
    ],
    "shipping": "台灣本島常溫宅配，徽章卡裝防刮包裝，2–4 個工作天送達。",
    "returns": "七天內未拆封可退換，拆封後僅接受瑕疵換貨。"
  },
  "rainie-yang-tour-tee-white": {
    "description": "LIKE A STAR 巡演限定的純白款，把舞台燈光那一抹最亮的瞬間留在身上。柔軟純棉、簡潔印製，是夏天看完安可場最想搭配牛仔褲的那件。",
    "specs": [
      {
        "k": "材質",
        "v": "100% 純棉 200g/m²"
      },
      {
        "k": "版型",
        "v": "中性寬鬆"
      },
      {
        "k": "印製",
        "v": "正面巡演主視覺"
      },
      {
        "k": "產地",
        "v": "台灣製"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "純白",
            "value": "white"
          }
        ]
      }
    ],
    "related": [
      "rainie-yang-tour-tee-black",
      "rainie-yang-cap",
      "rainie-yang-fan-bundle"
    ],
    "shipping": "台灣本島常溫宅配，現貨出貨後 3–5 個工作天送達。",
    "returns": "七天鑑賞期內未下水、吊牌完整可退換，淺色款請避免與深色衣物同洗。"
  },
  "rainie-yang-signed-poster": {
    "description": "親筆簽名海報編號版，是丞琳留給歌迷最私密的那道筆跡。逐張手簽、附獨立編號卡，為真正把她唱進生命裡的人而留。",
    "specs": [
      {
        "k": "尺寸",
        "v": "A1（594×841mm）"
      },
      {
        "k": "簽名",
        "v": "親筆手簽逐張限量"
      },
      {
        "k": "附件",
        "v": "獨立編號收藏卡"
      },
      {
        "k": "紙質",
        "v": "美術微噴藝術紙"
      }
    ],
    "related": [
      "rainie-yang-lyrics-poster-set",
      "rainie-yang-photobook",
      "rainie-yang-fan-bundle"
    ],
    "shipping": "台灣本島常溫宅配，簽名海報以硬筒專人包裝，出貨後 5–7 個工作天送達。",
    "returns": "親簽限量編號商品售出後恕不退換，僅運送破損可於到貨三日內申請換貨。"
  },
  "rainie-yang-fan-bundle": {
    "description": "雨愛應援組合包，把巡演 T 恤、雨滴手燈與海報一次收進同一個夜晚。為第一次進場、或捨不得錯過任何一場的你，準備好整套應援的心意。",
    "specs": [
      {
        "k": "內容",
        "v": "巡演T恤＋雨滴手燈＋海報"
      },
      {
        "k": "T恤尺寸",
        "v": "下單時選填"
      },
      {
        "k": "包裝",
        "v": "專屬禮盒裝"
      },
      {
        "k": "優惠",
        "v": "組合價較單買省一成"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "T恤尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "T恤顏色",
        "options": [
          {
            "label": "經典黑",
            "value": "black"
          },
          {
            "label": "純白",
            "value": "white"
          }
        ]
      }
    ],
    "related": [
      "rainie-yang-tour-tee-black",
      "rainie-yang-light-stick",
      "rainie-yang-signed-poster"
    ],
    "shipping": "台灣本島常溫宅配，組合禮盒整箱出貨後 3–5 個工作天到貨。",
    "returns": "組合包需整組退換、不拆售，七天內未使用且配件齊全可辦理，瑕疵免運換貨。"
  },
  "rainie-yang-sticker-pack": {
    "description": "歌詞手寫貼紙包，把丞琳專輯裡那幾句最戳心的話變成隨手可貼的溫柔。防水霧面材質，貼在筆電、水壺或手帳，走到哪都帶著一句歌詞。",
    "specs": [
      {
        "k": "數量",
        "v": "單包 15 枚"
      },
      {
        "k": "材質",
        "v": "防水霧面貼紙"
      },
      {
        "k": "內容",
        "v": "專輯手寫歌詞精選"
      },
      {
        "k": "尺寸",
        "v": "3–8cm 不等"
      }
    ],
    "related": [
      "rainie-yang-frog-keyring",
      "rainie-yang-postcard-set",
      "rainie-yang-scrunchie-set"
    ],
    "shipping": "台灣本島常溫宅配，輕薄小物可平信或宅配，2–4 個工作天送達。",
    "returns": "七天內未拆封可退換，拆封後僅接受印刷瑕疵換貨。"
  },
  "wong-kar-wai-stills-photobook": {
    "description": "《花樣年華》25週年4K修復，將周慕雲與蘇麗珍擦肩而過的每一個眼神，重新沖印成可以收進掌心的時間。翻開每一頁，都像走進那條被雨聲與旗袍填滿的窄巷，重逢一段沒有說出口的心事。",
    "specs": [
      {
        "k": "開本",
        "v": "260 × 290 mm 精裝橫式"
      },
      {
        "k": "頁數",
        "v": "168 頁，雙色印刷"
      },
      {
        "k": "內容",
        "v": "4K 修復劇照 90 幀＋導演註記"
      },
      {
        "k": "用紙",
        "v": "日本進口啞粉雪面紙"
      }
    ],
    "related": [
      "wong-kar-wai-mood-bluray",
      "wong-kar-wai-qipao-scarf",
      "wong-kar-wai-darkroom-print"
    ],
    "shipping": "全球配送，下單後 5–7 個工作天出貨；精裝書另以硬殼書盒包裝防壓。",
    "returns": "非人為損壞之印刷瑕疵，收到後 7 日內可換貨；拆封閱讀後恕不退貨。"
  },
  "wong-kar-wai-storyboard-print": {
    "description": "從《重慶森林》梁朝偉與王菲擦身的快門節奏裡，挑出最迷人的一格分鏡手稿複製成畫。鉛筆線條間還留著拍攝現場的猶豫與決斷，是那座霓虹森林最初的呼吸。",
    "specs": [
      {
        "k": "尺寸",
        "v": "A2（420 × 594 mm）"
      },
      {
        "k": "工藝",
        "v": "微噴藝術紙複製畫"
      },
      {
        "k": "紙材",
        "v": "德國 Hahnemühle 棉漿紙"
      },
      {
        "k": "附件",
        "v": "附導演工作室授權卡"
      }
    ],
    "related": [
      "wong-kar-wai-tee-chungking",
      "wong-kar-wai-grandmaster-print",
      "wong-kar-wai-film-notes"
    ],
    "shipping": "以硬式紙筒捲裝寄送，台港地區 3–5 個工作天送達。",
    "returns": "客製複製畫採接單製作，非瑕疵不接受退換；運送破損請於 3 日內拍照申請補寄。"
  },
  "wong-kar-wai-mood-bluray": {
    "description": "《花樣年華》25週年藍光珍藏版，收進那杯永遠喝不完的咖啡與 Yumeji's Theme 一再迴旋的弦音。從 4K 修復母帶轉製，連張曼玉旗袍上的每一道暗紋都重新清晰起來。",
    "specs": [
      {
        "k": "規格",
        "v": "BD50 藍光＋花絮碟"
      },
      {
        "k": "畫質",
        "v": "4K 修復・1080p 呈現"
      },
      {
        "k": "音軌",
        "v": "粵語 DTS-HD MA 5.1"
      },
      {
        "k": "特典",
        "v": "附 32 頁劇照小冊"
      }
    ],
    "related": [
      "wong-kar-wai-stills-photobook",
      "wong-kar-wai-trilogy-boxset",
      "wong-kar-wai-ost-vinyl"
    ],
    "shipping": "全球出貨，鐵盒外加緩衝包材，下單後 3–5 個工作天寄出。",
    "returns": "光碟商品拆封後若無播放瑕疵恕不退換；讀取異常 14 日內可換同款新品。"
  },
  "wong-kar-wai-2046-keyring": {
    "description": "那個誰也回不去、卻誰都想回去的房號，鑄成一枚沉甸甸的黃銅鑰匙圈。握在手心微涼，像替你保管一段不願醒來的記憶。",
    "specs": [
      {
        "k": "材質",
        "v": "實心黃銅・手工拋光"
      },
      {
        "k": "尺寸",
        "v": "55 × 18 mm"
      },
      {
        "k": "重量",
        "v": "約 42 克"
      },
      {
        "k": "刻字",
        "v": "正面浮雕「2046」"
      }
    ],
    "related": [
      "wong-kar-wai-ticket-pins",
      "wong-kar-wai-passport-cover",
      "wong-kar-wai-clock-lamp"
    ],
    "shipping": "台港及海外平信掛號，2–4 個工作天出貨；黃銅日久會自然氧化生韻。",
    "returns": "金屬小物收到 7 日內可退換，須保持未使用與原包裝完整。"
  },
  "wong-kar-wai-pineapple-candle": {
    "description": "取自《重慶森林》那一櫃即將過期的鳳梨罐頭，把金城武對愛情的賞味期限封進一盞香氛蠟燭。點燃時是微酸回甘的鳳梨與雪松，像在提醒你有些東西其實從不會真的過期。",
    "specs": [
      {
        "k": "容量",
        "v": "200 g 大豆蠟"
      },
      {
        "k": "香調",
        "v": "鳳梨・雪松・微鹹海風"
      },
      {
        "k": "燃燒時數",
        "v": "約 40 小時"
      },
      {
        "k": "罐身",
        "v": "復古罐頭造型錫罐"
      }
    ],
    "related": [
      "wong-kar-wai-clock-lamp",
      "wong-kar-wai-film-notes",
      "wong-kar-wai-night-tote"
    ],
    "shipping": "全球寄送，蠟燭以防撞棉紙包裹，下單後 3–5 個工作天出貨。",
    "returns": "香氛為個人衛生用品，拆封後不接受退換；瓶身運送破損請於 3 日內申請補寄。"
  },
  "wong-kar-wai-qipao-scarf": {
    "description": "把蘇麗珍那二十多襲旗袍裡最纏綿的花色，印成一條可以日日纏繞的絲巾。垂墜之間，彷彿仍有走廊盡頭那盞昏黃路燈，與一段始終沒能說破的情意。",
    "specs": [
      {
        "k": "材質",
        "v": "100% 桑蠶絲"
      },
      {
        "k": "尺寸",
        "v": "90 × 90 cm 方巾"
      },
      {
        "k": "印染",
        "v": "數位高清印花・捲邊手縫"
      },
      {
        "k": "花色",
        "v": "花樣年華暗紅牡丹"
      }
    ],
    "related": [
      "wong-kar-wai-stills-photobook",
      "wong-kar-wai-passport-cover",
      "wong-kar-wai-darkroom-print"
    ],
    "shipping": "全球配送，附絲質收納袋，下單後 5–7 個工作天出貨。",
    "returns": "絲織品貼身配件，拆封使用後恕不退換；瑕疵品 7 日內憑照片換貨。"
  },
  "wong-kar-wai-poster-set": {
    "description": "《阿飛正傳》《重慶森林》《花樣年華》三張經典海報復刻成組，把三個時代的孤獨並排掛上你的牆。從旭仔的探戈到周慕雲的背影，一次收齊那些關於錯過的母題。",
    "specs": [
      {
        "k": "內容",
        "v": "經典電影海報 3 張"
      },
      {
        "k": "尺寸",
        "v": "單張 50 × 70 cm"
      },
      {
        "k": "印刷",
        "v": "進口霧面藝術紙"
      },
      {
        "k": "包裝",
        "v": "硬式紙筒捲裝"
      }
    ],
    "related": [
      "wong-kar-wai-storyboard-print",
      "wong-kar-wai-grandmaster-print",
      "wong-kar-wai-mood-bluray"
    ],
    "shipping": "以紙筒捲裝寄送，台港 3–5 個工作天送達，海外約 7–10 天。",
    "returns": "成組海報恕不單張退換；運送摺損請於收到 3 日內拍照申請補寄。"
  },
  "wong-kar-wai-script-book": {
    "description": "《阿飛正傳》劇本典藏書，重現那隻沒有腳的鳥一輩子只能飛、落地便是死亡的獨白。一頁頁讀下去，像跟著旭仔走回 1960 年那個悶熱潮濕的香港午後。",
    "specs": [
      {
        "k": "開本",
        "v": "148 × 210 mm 精裝"
      },
      {
        "k": "頁數",
        "v": "224 頁"
      },
      {
        "k": "內容",
        "v": "完整對白本＋幕後手記"
      },
      {
        "k": "裝幀",
        "v": "布面書背・燙金書名"
      }
    ],
    "related": [
      "wong-kar-wai-film-notes",
      "wong-kar-wai-stills-photobook",
      "wong-kar-wai-trilogy-boxset"
    ],
    "shipping": "全球配送，精裝書另附書盒，下單後 5–7 個工作天出貨。",
    "returns": "書籍非印刷瑕疵恕不退換；裝幀瑕疵 7 日內可換同款。"
  },
  "wong-kar-wai-sunglasses": {
    "description": "墨鏡之後，是他凝視愛與錯過的方式；如今這副導演同款，把那層恰到好處的疏離戴回你的臉上。深色鏡片之下，每條街都成了可以慢慢走的長鏡頭。",
    "specs": [
      {
        "k": "鏡框",
        "v": "義大利醋酸纖維板材"
      },
      {
        "k": "鏡片",
        "v": "墨灰偏光・UV400"
      },
      {
        "k": "框型",
        "v": "經典威靈頓方框"
      },
      {
        "k": "配件",
        "v": "附硬殼眼鏡盒與拭鏡布"
      }
    ],
    "related": [
      "wong-kar-wai-passport-cover",
      "wong-kar-wai-2046-keyring",
      "wong-kar-wai-tee-chungking"
    ],
    "shipping": "全球寄送，附原廠硬殼盒，下單後 3–5 個工作天出貨。",
    "returns": "配戴類商品拆封後若無瑕疵恕不退換；鏡架瑕疵 14 日內可保固換貨。"
  },
  "wong-kar-wai-ost-vinyl": {
    "description": "《春光乍洩》原聲帶黑膠，從 Cucurrucucú Paloma 的悲鳴到探戈的纏綿，把何寶榮與黎耀輝那段反覆重來的愛刻進溝槽。落針的瞬間，伊瓜蘇瀑布的水聲彷彿就在客廳轟然展開。",
    "specs": [
      {
        "k": "規格",
        "v": "180g 重磅黑膠 1LP"
      },
      {
        "k": "轉速",
        "v": "33⅓ RPM"
      },
      {
        "k": "母帶",
        "v": "類比母帶重新製作"
      },
      {
        "k": "封套",
        "v": "霧面對開跨頁封套"
      }
    ],
    "related": [
      "wong-kar-wai-passport-cover",
      "wong-kar-wai-mood-bluray",
      "wong-kar-wai-trilogy-boxset"
    ],
    "shipping": "全球配送，黑膠以防壓硬卡包裝，下單後 3–5 個工作天出貨。",
    "returns": "黑膠拆封後若無刮痕跳針恕不退換；播放瑕疵 14 日內可換同款新品。"
  },
  "wong-kar-wai-postcard-box": {
    "description": "把他鏡頭裡那些走廊、霓虹與背影收進一只鐵盒，24 張劇照像 24 個不同時刻的心動。寄出一張，或只是偶爾翻看，都像替自己留住一段慢下來的光。",
    "specs": [
      {
        "k": "數量",
        "v": "24 張明信片"
      },
      {
        "k": "尺寸",
        "v": "明信片 100 × 148 mm"
      },
      {
        "k": "印刷",
        "v": "啞光厚卡・單面圖"
      },
      {
        "k": "收納",
        "v": "復古鐵盒裝"
      }
    ],
    "related": [
      "wong-kar-wai-poster-set",
      "wong-kar-wai-ticket-pins",
      "wong-kar-wai-film-notes"
    ],
    "shipping": "全球寄送，鐵盒外加緩衝包材，下單後 3–5 個工作天出貨。",
    "returns": "成組商品恕不單張退換；鐵盒運送凹損請於 3 日內申請補寄。"
  },
  "wong-kar-wai-tee-chungking": {
    "description": "重慶森林霓虹印花T恤，把午夜快餐店那片濕漉漉的紅藍燈光穿在身上。走在街頭，你也成了那座永不打烊森林裡，擦肩又錯過的其中一個人。",
    "specs": [
      {
        "k": "材質",
        "v": "精梳棉 230g 厚磅"
      },
      {
        "k": "印花",
        "v": "霓虹漸層水性印刷"
      },
      {
        "k": "版型",
        "v": "中性落肩寬鬆"
      },
      {
        "k": "洗滌",
        "v": "建議翻面冷水手洗"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s",
            "soldOut": false
          },
          {
            "label": "M",
            "value": "m",
            "soldOut": false
          },
          {
            "label": "L",
            "value": "l",
            "soldOut": false
          },
          {
            "label": "XL",
            "value": "xl",
            "soldOut": false
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "午夜黑",
            "value": "midnight-black",
            "soldOut": false
          },
          {
            "label": "霧霾灰",
            "value": "smog-grey",
            "soldOut": false
          }
        ]
      }
    ],
    "related": [
      "wong-kar-wai-night-tote",
      "wong-kar-wai-storyboard-print",
      "wong-kar-wai-sunglasses"
    ],
    "shipping": "全球配送，下單後 3–5 個工作天出貨；棉質印花首次下水建議翻面。",
    "returns": "未下水且吊牌完整可於 7 日內換尺寸；印花瑕疵憑照片換貨。"
  },
  "wong-kar-wai-night-tote": {
    "description": "《墮落天使》那場永遠在夜裡奔跑的城市，被收進一只可以隨身揹著的托特包。裝進你的夜班與心事，像黎明前還在霓虹下游蕩的最後一名乘客。",
    "specs": [
      {
        "k": "材質",
        "v": "12oz 厚磅帆布"
      },
      {
        "k": "尺寸",
        "v": "38 × 40 × 10 cm"
      },
      {
        "k": "印花",
        "v": "夜行霓虹單色絹印"
      },
      {
        "k": "細節",
        "v": "內袋一只・加厚提把"
      }
    ],
    "related": [
      "wong-kar-wai-tee-chungking",
      "wong-kar-wai-pineapple-candle",
      "wong-kar-wai-passport-cover"
    ],
    "shipping": "全球配送，下單後 3–5 個工作天出貨；帆布初期略硬屬正常。",
    "returns": "未使用且吊牌完整可於 7 日內退換；絹印瑕疵憑照片換貨。"
  },
  "wong-kar-wai-grandmaster-print": {
    "description": "《一代宗師》宮二在雪夜裡那一回身，化成一幅水墨韻味的劇照版畫。留白與墨色之間，藏著葉問與宮二「念念不忘，必有迴響」的一整個武林。",
    "specs": [
      {
        "k": "尺寸",
        "v": "50 × 70 cm"
      },
      {
        "k": "工藝",
        "v": "水墨微噴・宣紙質感"
      },
      {
        "k": "紙材",
        "v": "無酸藝術微噴紙"
      },
      {
        "k": "附件",
        "v": "附作品編號授權卡"
      }
    ],
    "related": [
      "wong-kar-wai-poster-set",
      "wong-kar-wai-storyboard-print",
      "wong-kar-wai-darkroom-print"
    ],
    "shipping": "以紙筒捲裝寄送，台港 3–5 個工作天送達，海外約 7–10 天。",
    "returns": "接單製作之版畫非瑕疵不退換；運送破損 3 日內拍照補寄。"
  },
  "wong-kar-wai-film-notes": {
    "description": "復刻自他拍片現場那本寫滿塗改的導演手記，留白處等著你寫下自己的那場戲。牛皮紙封面摸起來像舊膠卷，翻開卻是一整本還沒沖洗的可能。",
    "specs": [
      {
        "k": "開本",
        "v": "A5（148 × 210 mm）"
      },
      {
        "k": "頁數",
        "v": "160 頁・米色內頁"
      },
      {
        "k": "內頁",
        "v": "無格點陣・可平攤裝訂"
      },
      {
        "k": "封面",
        "v": "牛皮復古硬封"
      }
    ],
    "related": [
      "wong-kar-wai-script-book",
      "wong-kar-wai-postcard-box",
      "wong-kar-wai-storyboard-print"
    ],
    "shipping": "全球配送，下單後 3–5 個工作天出貨。",
    "returns": "文具拆封後若無瑕疵恕不退換；裝訂瑕疵 7 日內可換同款。"
  },
  "wong-kar-wai-clock-lamp": {
    "description": "他的電影總在數時間——《阿飛正傳》那一分鐘，《重慶森林》那即將過期的日子，全凝在這盞時鐘意象桌燈裡。夜裡亮起，秒針般的暖光提醒你，有些時刻值得被一直記得。",
    "specs": [
      {
        "k": "光源",
        "v": "暖白 LED・三段調光"
      },
      {
        "k": "尺寸",
        "v": "高 32 cm・底徑 14 cm"
      },
      {
        "k": "材質",
        "v": "霧面金屬＋磨砂玻璃罩"
      },
      {
        "k": "電源",
        "v": "USB-C 供電・附線"
      }
    ],
    "related": [
      "wong-kar-wai-pineapple-candle",
      "wong-kar-wai-2046-keyring",
      "wong-kar-wai-film-notes"
    ],
    "shipping": "全球寄送，桌燈以防撞泡棉固定，下單後 5–7 個工作天出貨。",
    "returns": "燈具收到 7 日內可退換，須保持未使用與原包裝完整；功能瑕疵 14 日內保固換貨。"
  },
  "wong-kar-wai-trilogy-boxset": {
    "description": "《阿飛正傳》《花樣年華》《2046》時代三部曲藍光套裝，把六〇年代香港那段欲言又止的情慾收進同一只書盒。從旭仔到周慕雲，一次走完他鏡頭下最纏綿的三段錯過。",
    "specs": [
      {
        "k": "內容",
        "v": "3 部片・4 碟藍光"
      },
      {
        "k": "畫質",
        "v": "4K 修復・1080p"
      },
      {
        "k": "特典",
        "v": "64 頁精裝寫真書"
      },
      {
        "k": "裝幀",
        "v": "硬殼書匣典藏裝"
      }
    ],
    "related": [
      "wong-kar-wai-mood-bluray",
      "wong-kar-wai-stills-photobook",
      "wong-kar-wai-script-book"
    ],
    "shipping": "全球出貨，書匣外加硬盒防壓，下單後 5–7 個工作天寄出。",
    "returns": "套裝光碟拆封後若無讀取瑕疵恕不退換；缺片或損碟 14 日內補寄。"
  },
  "wong-kar-wai-ticket-pins": {
    "description": "那些年走進戲院前撕下的半截戲票，化成一組可以別在外套上的琺瑯徽章。每一枚都像一張存根，替你收藏一次又一次走進他電影的入場時刻。",
    "specs": [
      {
        "k": "數量",
        "v": "戲票造型徽章 4 枚"
      },
      {
        "k": "材質",
        "v": "硬琺瑯・電鍍金邊"
      },
      {
        "k": "尺寸",
        "v": "單枚約 35 × 18 mm"
      },
      {
        "k": "扣件",
        "v": "蝴蝶夾背扣"
      }
    ],
    "related": [
      "wong-kar-wai-2046-keyring",
      "wong-kar-wai-postcard-box",
      "wong-kar-wai-passport-cover"
    ],
    "shipping": "台港及海外掛號，2–4 個工作天出貨。",
    "returns": "徽章小物收到 7 日內可退換，須保持未使用與原卡裝；掉漆瑕疵憑照片換貨。"
  },
  "wong-kar-wai-passport-cover": {
    "description": "《春光乍洩》裡那趟從香港飛到布宜諾斯艾利斯的出走，被縫進一只隨身的護照套。帶著它再次啟程，也許這一次，你會記得替自己「不如，我們從頭來過」。",
    "specs": [
      {
        "k": "材質",
        "v": "植鞣牛皮・手縫車線"
      },
      {
        "k": "尺寸",
        "v": "100 × 140 mm"
      },
      {
        "k": "內裝",
        "v": "護照夾層＋卡槽 2 格"
      },
      {
        "k": "壓印",
        "v": "內頁燙印電影經典台詞"
      }
    ],
    "related": [
      "wong-kar-wai-ost-vinyl",
      "wong-kar-wai-sunglasses",
      "wong-kar-wai-night-tote"
    ],
    "shipping": "全球配送，附棉布防塵袋，下單後 3–5 個工作天出貨；真皮使用後會自然變色。",
    "returns": "皮件未使用且包裝完整可於 7 日內退換；車線瑕疵 14 日內換貨。"
  },
  "wong-kar-wai-darkroom-print": {
    "description": "在暗房裡一張張手放、編號簽名的劇照，留著沖印藥水與光的呼吸，是離他鏡頭最近的一次收藏。每一幀都獨一無二，像替《花樣年華》那段心事，親手顯影出唯一的版本。",
    "specs": [
      {
        "k": "工藝",
        "v": "暗房銀鹽手放"
      },
      {
        "k": "尺寸",
        "v": "40 × 50 cm 相紙"
      },
      {
        "k": "版次",
        "v": "全球限量 50 版・編號簽名"
      },
      {
        "k": "附件",
        "v": "附親簽真品保證卡"
      }
    ],
    "related": [
      "wong-kar-wai-stills-photobook",
      "wong-kar-wai-grandmaster-print",
      "wong-kar-wai-qipao-scarf"
    ],
    "shipping": "專人裱框平放配送，附保價，下單後 10–14 個工作天出貨。",
    "returns": "限量簽名藝術品售出後不接受退換；運送損壞憑開箱影片申請理賠。"
  },
  "wei-te-sheng-cape7-vinyl": {
    "description": "收錄〈國境之南〉〈無樂不作〉等經典曲目，這張黑膠以恆春的海風為底色，讓那年夏天的旋律重新轉動。復刻封面保留了當年的暖黃色調，翻面之間，彷彿又聽見阿嘉在海邊唱著那首未寄出的歌。",
    "specs": [
      {
        "k": "規格",
        "v": "180g 彩膠 2LP"
      },
      {
        "k": "轉速",
        "v": "33⅓ RPM"
      },
      {
        "k": "內附",
        "v": "歌詞拉頁＋劇照夾頁"
      },
      {
        "k": "出版",
        "v": "原聲帶十五週年復刻"
      }
    ],
    "related": [
      "wei-te-sheng-cape7-poster",
      "wei-te-sheng-love-letters",
      "wei-te-sheng-ocean-bundle"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，外島及偏遠地區順延。黑膠以防震專用箱出貨，妥善保護溝槽。",
    "returns": "非人為損壞之瑕疵可於到貨 7 日內換貨；拆封後因黑膠特性恕不接受退貨。"
  },
  "wei-te-sheng-seediq-script": {
    "description": "《賽德克・巴萊》的每一句台詞，都是莫那・魯道族人用生命寫下的呼喊，如今收進這本典藏劇本書裡。從彩虹橋的傳說到霧社的清晨，翻開書頁，便走進那段不該被遺忘的山林記憶。",
    "specs": [
      {
        "k": "裝幀",
        "v": "精裝硬殼"
      },
      {
        "k": "頁數",
        "v": "約 420 頁"
      },
      {
        "k": "內容",
        "v": "完整劇本＋導演註記"
      },
      {
        "k": "語言",
        "v": "中文／賽德克語對照"
      }
    ],
    "related": [
      "wei-te-sheng-storyboard-book",
      "wei-te-sheng-mona-carving",
      "wei-te-sheng-director-notes"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，下單後隔日出貨。書籍以氣泡袋包覆避免運送磨損。",
    "returns": "到貨 7 日內如有印刷或裝幀瑕疵可申請換貨，書籍經翻閱使用後不接受退貨。"
  },
  "wei-te-sheng-kano-jersey": {
    "description": "嘉農野球隊那句「一球入魂」，就縫在這件復刻球衣的胸前。穿上它，彷彿站上昭和年代的甲子園紅土，與那群不放棄的少年一起，把汗水揮灑成榮光。",
    "specs": [
      {
        "k": "材質",
        "v": "吸濕排汗聚酯纖維"
      },
      {
        "k": "版型",
        "v": "復古寬鬆運動剪裁"
      },
      {
        "k": "細節",
        "v": "嘉農隊徽刺繡"
      },
      {
        "k": "洗滌",
        "v": "建議冷水手洗"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "嘉農白",
            "value": "kano-white"
          },
          {
            "label": "紅土棕",
            "value": "clay-brown"
          }
        ]
      }
    ],
    "related": [
      "wei-te-sheng-signed-baseball",
      "wei-te-sheng-kano-towel",
      "wei-te-sheng-embroidered-cap"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，滿額免運。球衣摺疊封裝，附防塵夾鏈袋。",
    "returns": "未水洗、吊牌完整者可於到貨 7 日內換尺寸；客製繡字款恕不退換。"
  },
  "wei-te-sheng-love-letters": {
    "description": "七封跨越六十年的情書，是《海角七號》裡最溫柔的牽掛，如今印成可以親手書寫的信紙組。在某個想念誰的午後，提筆寫下你的心事，把遲到的話語一一寄達。",
    "specs": [
      {
        "k": "內容",
        "v": "信紙 7 款各 4 張"
      },
      {
        "k": "附件",
        "v": "仿舊牛皮信封 7 入"
      },
      {
        "k": "紙質",
        "v": "米色仿古道林紙"
      },
      {
        "k": "尺寸",
        "v": "A5 直式"
      }
    ],
    "related": [
      "wei-te-sheng-cape7-vinyl",
      "wei-te-sheng-hengchun-postcards",
      "wei-te-sheng-ocean-bundle"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，亦可選超商取貨。紙品以硬紙板襯底防止摺角。",
    "returns": "到貨 7 日內如有缺頁或印刷瑕疵可換貨，拆封書寫後不接受退貨。"
  },
  "wei-te-sheng-rainbow-tee": {
    "description": "彩虹橋是賽德克族人通往祖靈的路，這件 T 恤把那道橫越山谷的圖騰穿在身上。簡單的線條藏著古老的信仰，讓每一次出門，都像帶著一段山林的祝福。",
    "specs": [
      {
        "k": "材質",
        "v": "100% 精梳純棉"
      },
      {
        "k": "磅數",
        "v": "230g 厚磅"
      },
      {
        "k": "印製",
        "v": "水性環保印花"
      },
      {
        "k": "版型",
        "v": "中性落肩寬版"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "霧灰",
            "value": "misty-grey"
          },
          {
            "label": "墨黑",
            "value": "ink-black"
          },
          {
            "label": "山岩白",
            "value": "rock-white"
          }
        ]
      }
    ],
    "related": [
      "wei-te-sheng-embroidered-cap",
      "wei-te-sheng-seediq-script",
      "wei-te-sheng-trilogy-badges"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，滿千免運。衣物以環保紙袋封裝，減少包材浪費。",
    "returns": "未下水、吊牌齊全可於到貨 7 日內換尺寸或退貨。"
  },
  "wei-te-sheng-storyboard-book": {
    "description": "台灣三部曲還沒上映，但夢的雛形已經在這本分鏡手稿集裡一格一格地誕生。從荷蘭船艦到原民部落，跟著導演的鉛筆線條，提前走進那片四百年前的福爾摩沙。",
    "specs": [
      {
        "k": "裝幀",
        "v": "裸背線裝可攤平"
      },
      {
        "k": "頁數",
        "v": "約 280 頁"
      },
      {
        "k": "內容",
        "v": "手繪分鏡＋場景設定"
      },
      {
        "k": "印刷",
        "v": "高彩雙色印刷"
      }
    ],
    "related": [
      "wei-te-sheng-storyboard-notebook",
      "wei-te-sheng-trilogy-badges",
      "wei-te-sheng-seediq-script"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天。大開本書籍以瓦楞書盒加固運送。",
    "returns": "到貨 7 日內如有裝幀瑕疵可換貨，經翻閱之書籍恕不退貨。"
  },
  "wei-te-sheng-malasun-glasses": {
    "description": "「馬拉桑！」那聲響徹《海角七號》的吆喝，化成這組溫潤的小米酒杯。倒上一杯，敬恆春的日落，也敬每一個在土地上努力打拼的傻氣靈魂。",
    "specs": [
      {
        "k": "材質",
        "v": "手工吹製玻璃"
      },
      {
        "k": "容量",
        "v": "單杯 60ml"
      },
      {
        "k": "組數",
        "v": "一組 4 入"
      },
      {
        "k": "附件",
        "v": "原木杯托"
      }
    ],
    "related": [
      "wei-te-sheng-south-tote",
      "wei-te-sheng-cape7-vinyl",
      "wei-te-sheng-hengchun-postcards"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天。玻璃杯以蜂巢隔板分裝，全程防碎包裝。",
    "returns": "到貨 7 日內如有破損請拍照申請換貨；人為損壞不在此限。"
  },
  "wei-te-sheng-cape7-poster": {
    "description": "那面寫滿郵遞地址的牆，那把斜插的吉他，《海角七號》的經典海報如今復刻成可收藏的版本。掛在牆上，恆春的陽光彷彿就灑進了房間的每一個角落。",
    "specs": [
      {
        "k": "尺寸",
        "v": "B2（約 50×70cm）"
      },
      {
        "k": "紙質",
        "v": "霧面藝術紙"
      },
      {
        "k": "印刷",
        "v": "高解析微噴"
      },
      {
        "k": "包裝",
        "v": "圓筒捲裝"
      }
    ],
    "related": [
      "wei-te-sheng-cape7-vinyl",
      "wei-te-sheng-love-letters",
      "wei-te-sheng-ocean-bundle"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天。海報捲入硬質圓筒，避免摺痕與受潮。",
    "returns": "到貨 7 日內如有印刷瑕疵或運送摺損可換貨，拆封後無瑕疵恕不退貨。"
  },
  "wei-te-sheng-52hz-dvd": {
    "description": "《52赫茲，我愛你》用一整座城市的歌聲，唱出那些不被聽見的孤單心事。這張音樂電影 DVD 收進了情人節清晨的台北，讓寂寞的人也能在旋律裡找到回應。",
    "specs": [
      {
        "k": "片數",
        "v": "單片裝 DVD"
      },
      {
        "k": "片長",
        "v": "約 110 分鐘"
      },
      {
        "k": "音軌",
        "v": "國語 5.1 聲道"
      },
      {
        "k": "字幕",
        "v": "中文／英文"
      }
    ],
    "related": [
      "wei-te-sheng-cape7-vinyl",
      "wei-te-sheng-cape7-poster",
      "wei-te-sheng-south-tote"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，可選超商取貨。光碟以防刮夾層包裝。",
    "returns": "光碟類商品拆封後恕不退換；未拆封者可於到貨 7 日內退貨。"
  },
  "wei-te-sheng-embroidered-cap": {
    "description": "賽德克族的菱形織紋，一針一線繡上了這頂帽簷。低調卻有故事，無論走到哪裡，都像把一段山林的記憶輕輕戴在頭上。",
    "specs": [
      {
        "k": "材質",
        "v": "水洗棉斜紋布"
      },
      {
        "k": "工藝",
        "v": "立體電腦刺繡"
      },
      {
        "k": "調節",
        "v": "金屬扣後調式"
      },
      {
        "k": "帽型",
        "v": "六片式老帽"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "均碼",
            "value": "one-size"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "卡其",
            "value": "khaki"
          },
          {
            "label": "炭黑",
            "value": "charcoal"
          }
        ]
      }
    ],
    "related": [
      "wei-te-sheng-rainbow-tee",
      "wei-te-sheng-kano-jersey",
      "wei-te-sheng-trilogy-badges"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，滿額免運。帽子以防壓紙托維持帽型出貨。",
    "returns": "未拆吊牌、未配戴者可於到貨 7 日內換色或退貨。"
  },
  "wei-te-sheng-hengchun-postcards": {
    "description": "恆春的海、白沙灣的浪、那條通往燈塔的小路，全收進了這組劇照明信片裡。寫上幾句話寄給遠方的人，把南國的夏天，也一起裝進信封。",
    "specs": [
      {
        "k": "張數",
        "v": "一組 10 張不重複"
      },
      {
        "k": "尺寸",
        "v": "標準明信片 10×15cm"
      },
      {
        "k": "紙質",
        "v": "300g 雪銅卡"
      },
      {
        "k": "工藝",
        "v": "局部霧膜處理"
      }
    ],
    "related": [
      "wei-te-sheng-love-letters",
      "wei-te-sheng-cape7-poster",
      "wei-te-sheng-south-tote"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，亦可超商取貨。明信片附透明保護套出貨。",
    "returns": "到貨 7 日內如有缺張或印刷瑕疵可換貨，書寫使用後不接受退貨。"
  },
  "wei-te-sheng-signed-baseball": {
    "description": "當嘉農的少年們把球擲向甲子園的天空，那份不放棄的傻勁也凝結在這顆紀念棒球上。導演親筆簽名落於球身，是給每一個追夢者最珍貴的鼓勵。",
    "specs": [
      {
        "k": "材質",
        "v": "正規牛皮硬式棒球"
      },
      {
        "k": "簽名",
        "v": "導演親筆簽名"
      },
      {
        "k": "附件",
        "v": "壓克力展示座"
      },
      {
        "k": "認證",
        "v": "附限量編號卡"
      }
    ],
    "related": [
      "wei-te-sheng-kano-jersey",
      "wei-te-sheng-kano-towel",
      "wei-te-sheng-mona-carving"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，簽名商品採掛號專人配送。出貨前逐顆檢查簽名狀態。",
    "returns": "親簽限量品恕不接受退換，到貨如有運送破損請於 3 日內拍照反映協助處理。"
  },
  "wei-te-sheng-south-tote": {
    "description": "〈國境之南〉那句「如果海會說話」，被印在這只帆布袋的一角。容量寬敞耐裝，陪你從市場走到海邊，把日常裝得滿滿，也裝進一點南方的浪漫。",
    "specs": [
      {
        "k": "材質",
        "v": "12 安加厚帆布"
      },
      {
        "k": "尺寸",
        "v": "38×40×12cm"
      },
      {
        "k": "承重",
        "v": "約 8 公斤"
      },
      {
        "k": "細節",
        "v": "內袋＋磁扣設計"
      }
    ],
    "related": [
      "wei-te-sheng-malasun-glasses",
      "wei-te-sheng-hengchun-postcards",
      "wei-te-sheng-52hz-dvd"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，可選超商取貨。布袋以環保紙袋簡易包裝。",
    "returns": "未使用、吊牌完整者可於到貨 7 日內退換貨。"
  },
  "wei-te-sheng-director-notes": {
    "description": "《導演・巴萊》記下了《賽德克・巴萊》從零到一的漫長拍攝路，字裡行間都是傻勁與堅持。翻開這本手記，你會看見一個人如何用十二年，把不可能拍成了傳奇。",
    "specs": [
      {
        "k": "裝幀",
        "v": "軟精裝"
      },
      {
        "k": "頁數",
        "v": "約 320 頁"
      },
      {
        "k": "內容",
        "v": "拍攝日誌＋幕後照片"
      },
      {
        "k": "開本",
        "v": "25 開"
      }
    ],
    "related": [
      "wei-te-sheng-seediq-script",
      "wei-te-sheng-storyboard-book",
      "wei-te-sheng-storyboard-notebook"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天。書籍以氣泡袋加硬紙板防護出貨。",
    "returns": "到貨 7 日內如有裝幀或印刷瑕疵可換貨，翻閱使用後恕不退貨。"
  },
  "wei-te-sheng-film-bookmark": {
    "description": "截一段真實的 35mm 膠卷做成書籤，每一枚都印著電影裡的某個瞬間，獨一無二。夾進正在讀的那本書，讓光影也陪你翻過一頁又一頁。",
    "specs": [
      {
        "k": "材質",
        "v": "真實 35mm 膠卷"
      },
      {
        "k": "配件",
        "v": "金屬流蘇吊飾"
      },
      {
        "k": "特性",
        "v": "每枚畫面隨機"
      },
      {
        "k": "尺寸",
        "v": "約 3.5×12cm"
      }
    ],
    "related": [
      "wei-te-sheng-storyboard-notebook",
      "wei-te-sheng-hengchun-postcards",
      "wei-te-sheng-trilogy-badges"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，可超商取貨。膠卷書籤以透明卡封裝避免刮傷。",
    "returns": "因每枚畫面隨機不可指定，恕不接受以畫面為由退換；瑕疵品可於 7 日內換貨。"
  },
  "wei-te-sheng-trilogy-badges": {
    "description": "台灣三部曲的夢還在路上，這組應援徽章是給同行者的小小信物。別在背包或外套上，讓更多人看見，這座島嶼的故事正被誰深深守護著。",
    "specs": [
      {
        "k": "組數",
        "v": "一組 5 入"
      },
      {
        "k": "材質",
        "v": "金屬琺瑯"
      },
      {
        "k": "工藝",
        "v": "硬琺瑯填色"
      },
      {
        "k": "扣式",
        "v": "蝴蝶夾背扣"
      }
    ],
    "related": [
      "wei-te-sheng-storyboard-book",
      "wei-te-sheng-rainbow-tee",
      "wei-te-sheng-film-bookmark"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，亦可超商取貨。徽章以泡棉卡固定包裝。",
    "returns": "未拆封者可於到貨 7 日內退換；拆封後如有掉漆瑕疵可換貨。"
  },
  "wei-te-sheng-ocean-bundle": {
    "description": "把《海角七號》最動人的三樣信物收進同一個珍藏組——黑膠、情書信紙與復刻海報。一次擁有恆春的聲音、字句與畫面，讓那年夏天完整地住進你的房間。",
    "specs": [
      {
        "k": "內容",
        "v": "原聲黑膠＋情書信紙＋復刻海報"
      },
      {
        "k": "包裝",
        "v": "主題禮盒裝"
      },
      {
        "k": "優惠",
        "v": "組合較單買省約 15%"
      },
      {
        "k": "附件",
        "v": "專屬珍藏卡"
      }
    ],
    "related": [
      "wei-te-sheng-cape7-vinyl",
      "wei-te-sheng-love-letters",
      "wei-te-sheng-cape7-poster"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，禮盒採加固專箱配送。出貨前逐項點檢內容物。",
    "returns": "組合內任一品項瑕疵可於到貨 7 日內換貨；拆封後黑膠與書寫類恕不退貨。"
  },
  "wei-te-sheng-mona-carving": {
    "description": "莫那・魯道凝視遠山的身影，被刻進這尊溫潤的木雕小像裡。擺在案頭，那份守護家園的堅毅彷彿日日相伴，提醒著一段不容遺忘的歷史重量。",
    "specs": [
      {
        "k": "材質",
        "v": "台灣檜木手工雕刻"
      },
      {
        "k": "高度",
        "v": "約 15cm"
      },
      {
        "k": "底座",
        "v": "實木刻字底座"
      },
      {
        "k": "特性",
        "v": "天然木紋各異"
      }
    ],
    "related": [
      "wei-te-sheng-seediq-script",
      "wei-te-sheng-director-notes",
      "wei-te-sheng-signed-baseball"
    ],
    "shipping": "台灣本島宅配 5-7 個工作天，木雕手工製作需備貨。以塑型泡棉全包防撞出貨。",
    "returns": "手工木雕因天然紋理差異不視為瑕疵；運送破損可於到貨 3 日內拍照換貨。"
  },
  "wei-te-sheng-kano-towel": {
    "description": "擦去汗水，也擦亮夢想，這條應援毛巾印著嘉農的隊徽與「甲子園」三字。揮舞在看台上，與當年那群少年一起，把熱血喊進每一個揮棒的瞬間。",
    "specs": [
      {
        "k": "材質",
        "v": "純棉無撚紗"
      },
      {
        "k": "尺寸",
        "v": "34×110cm 長巾"
      },
      {
        "k": "工藝",
        "v": "雙面提花織紋"
      },
      {
        "k": "特性",
        "v": "高吸水柔軟"
      }
    ],
    "related": [
      "wei-te-sheng-kano-jersey",
      "wei-te-sheng-signed-baseball",
      "wei-te-sheng-embroidered-cap"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，可超商取貨。毛巾以束帶捲裝環保出貨。",
    "returns": "未拆封、未使用者可於到貨 7 日內退換貨；下水後恕不退貨。"
  },
  "wei-te-sheng-storyboard-notebook": {
    "description": "翻開是一格一格的空白分鏡框，等著你把腦中的畫面親手填滿。無論是寫故事還是記日常，都讓你像個導演一樣，把生活分鏡成自己的電影。",
    "specs": [
      {
        "k": "內頁",
        "v": "空白分鏡格 160 頁"
      },
      {
        "k": "裝幀",
        "v": "線圈可 360 度翻折"
      },
      {
        "k": "紙質",
        "v": "100g 米白道林紙"
      },
      {
        "k": "尺寸",
        "v": "A5 橫式"
      }
    ],
    "related": [
      "wei-te-sheng-storyboard-book",
      "wei-te-sheng-film-bookmark",
      "wei-te-sheng-director-notes"
    ],
    "shipping": "台灣本島宅配 3-5 個工作天，可超商取貨。筆記本以紙質書衣簡易包裝。",
    "returns": "未書寫、包裝完整者可於到貨 7 日內退換貨。"
  },
  "tsai-a-ga-collab-tee": {
    "description": "印上蔡阿嘎招牌台語金句的聯名棉T，剪裁日常好搭，是嘎家軍走在路上也能對暗號的默契款。從短片裡的笑聲，到你衣櫥裡的常備款，把這份十五年的陪伴穿在身上。",
    "specs": [
      {
        "k": "材質",
        "v": "100% 精梳棉，水洗不易變形"
      },
      {
        "k": "印製",
        "v": "環保水性印花，台語金句字樣"
      },
      {
        "k": "版型",
        "v": "中性寬鬆，男女皆可穿"
      },
      {
        "k": "產地",
        "v": "台灣製造"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "奶茶米",
            "value": "milk-tea"
          },
          {
            "label": "墨黑",
            "value": "ink-black"
          }
        ]
      }
    ],
    "related": [
      "tsai-a-ga-army-hoodie",
      "tsai-a-ga-dad-cap",
      "tsai-a-ga-family-bundle"
    ],
    "shipping": "台灣本島常溫宅配，下單後 3–5 個工作天出貨。",
    "returns": "鑑賞期 7 天內，未拆吊牌、未洗滌可退換。"
  },
  "tsai-a-ga-taigi-textbook": {
    "description": "從「嘎名人」系列裡長出來的台語教材，把那些讓人笑著學起來的道地用語整理成冊。台語不輪轉沒關係，跟著蔡阿嘎一句一句練，認真愛台灣從會講開始。",
    "specs": [
      {
        "k": "內頁",
        "v": "128 頁，台語拼音對照"
      },
      {
        "k": "裝幀",
        "v": "平裝膠裝，方便攤平練習"
      },
      {
        "k": "附錄",
        "v": "經典語錄發音示範 QR 連結"
      },
      {
        "k": "尺寸",
        "v": "A5（14.8 × 21 公分）"
      }
    ],
    "related": [
      "tsai-a-ga-keycap-set",
      "tsai-a-ga-diary-notebook",
      "tsai-a-ga-sticker-set"
    ],
    "shipping": "台灣本島平面印刷品寄送，3–5 個工作天送達。",
    "returns": "書籍類拆封後若無瑕疵恕不退換，瑕疵品 7 天內可換貨。"
  },
  "tsai-a-ga-sticker-set": {
    "description": "收錄蔡阿嘎多年來的經典語錄，防水材質貼到哪笑到哪，筆電、水壺、安全帽都能貼。一包小小的貼紙，藏著嘎家軍十五年的共同回憶。",
    "specs": [
      {
        "k": "數量",
        "v": "單包 12 張不重複款式"
      },
      {
        "k": "材質",
        "v": "防水霧面 PVC，耐刮抗曬"
      },
      {
        "k": "尺寸",
        "v": "單張約 5–7 公分"
      },
      {
        "k": "用途",
        "v": "筆電、水壺、行李箱皆可貼"
      }
    ],
    "related": [
      "tsai-a-ga-acrylic-stand",
      "tsai-a-ga-phone-strap",
      "tsai-a-ga-diary-notebook"
    ],
    "shipping": "台灣本島平信或宅配，3–5 個工作天送達。",
    "returns": "貼紙類拆封後不接受退換，運送破損可於 7 天內換貨。"
  },
  "tsai-a-ga-kuei-pillow": {
    "description": "把蔡桃貴的可愛模樣做成抱枕，柔軟好抱，是桃貴星球居民客廳裡的必備成員。看著他長大的你，現在能把這份療癒抱在懷裡。",
    "specs": [
      {
        "k": "尺寸",
        "v": "約 40 × 40 公分"
      },
      {
        "k": "填充",
        "v": "高蓬鬆聚酯纖維棉"
      },
      {
        "k": "表布",
        "v": "短毛絨布，可拆洗枕套"
      },
      {
        "k": "造型",
        "v": "蔡桃貴 Q 版立體印製"
      }
    ],
    "related": [
      "tsai-a-ga-kuei-plush",
      "tsai-a-ga-planet-puzzle",
      "tsai-a-ga-phone-strap"
    ],
    "shipping": "台灣本島常溫宅配，補貨後依排序出貨。",
    "returns": "絨毛寢具類基於衛生考量，非瑕疵恕不退換。"
  },
  "tsai-a-ga-erbo-apron": {
    "description": "復刻二伯下廚時的同款圍裙，厚實耐髒，繫上它就有種「今天換我顧廚房」的儀式感。二伯的圍裙小幫手，現在多了你一個。",
    "specs": [
      {
        "k": "材質",
        "v": "加厚帆布，防潑水處理"
      },
      {
        "k": "設計",
        "v": "前置雙口袋，可調式頸帶"
      },
      {
        "k": "尺寸",
        "v": "成人均碼，腰帶可繞前綁結"
      },
      {
        "k": "清潔",
        "v": "可機洗，建議冷水"
      }
    ],
    "related": [
      "tsai-a-ga-eco-cup",
      "tsai-a-ga-mug",
      "tsai-a-ga-market-tote"
    ],
    "shipping": "台灣本島常溫宅配，3–5 個工作天出貨。",
    "returns": "鑑賞期 7 天內，未使用、未清洗可退換。"
  },
  "tsai-a-ga-army-hoodie": {
    "description": "嘎家軍專屬連帽T，厚磅刷毛保暖，胸前低調印記只有自己人看得懂。從螢幕前的留言區，到街頭巷尾的相認，這件外套就是一張入伍證。",
    "specs": [
      {
        "k": "材質",
        "v": "380gsm 厚磅棉，內裡刷毛"
      },
      {
        "k": "版型",
        "v": "落肩寬版，連帽附抽繩"
      },
      {
        "k": "細節",
        "v": "嘎家軍刺繡標誌，前袋一體成型"
      },
      {
        "k": "產地",
        "v": "台灣製造"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "炭灰",
            "value": "charcoal"
          },
          {
            "label": "軍綠",
            "value": "army-green"
          },
          {
            "label": "墨黑",
            "value": "ink-black"
          }
        ]
      }
    ],
    "related": [
      "tsai-a-ga-collab-tee",
      "tsai-a-ga-dad-cap",
      "tsai-a-ga-family-bundle"
    ],
    "shipping": "台灣本島常溫宅配，下單後 3–5 個工作天出貨。",
    "returns": "7 天鑑賞期內，吊牌完整、未水洗可退換貨。"
  },
  "tsai-a-ga-mug": {
    "description": "印上「嘎逼歪」招牌笑梗的陶瓷馬克杯，早上裝咖啡、下午泡茶，一杯就把蔡阿嘎的笑聲帶進日常。笑到嘎逼歪的你，杯緣藏著只有粉絲懂的梗。",
    "specs": [
      {
        "k": "材質",
        "v": "高溫白瓷，釉面光滑"
      },
      {
        "k": "容量",
        "v": "約 350 毫升"
      },
      {
        "k": "印製",
        "v": "窯燒轉印，不易掉色"
      },
      {
        "k": "適用",
        "v": "可微波、可洗碗機"
      }
    ],
    "related": [
      "tsai-a-ga-eco-cup",
      "tsai-a-ga-erbo-apron",
      "tsai-a-ga-family-bundle"
    ],
    "shipping": "台灣本島常溫宅配，易碎品加強包裝，3–5 個工作天出貨。",
    "returns": "運送破損請於收貨 7 天內拍照申請換貨。"
  },
  "tsai-a-ga-dad-cap": {
    "description": "低彩度的嘎潮流老帽，軟頂彎簷一戴就有種隨性的台味，搭什麼都對味。是嘎家軍出門遛達、看演唱會、菜市場買菜都離不開的本命單品。",
    "specs": [
      {
        "k": "材質",
        "v": "純棉斜紋布，軟頂老帽版型"
      },
      {
        "k": "尺寸",
        "v": "均碼，後扣金屬可調"
      },
      {
        "k": "細節",
        "v": "前片低調刺繡 LOGO"
      },
      {
        "k": "帽簷",
        "v": "自然彎簷，免整理"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "均碼",
            "value": "one-size"
          }
        ]
      },
      {
        "type": "colour",
        "label": "顏色",
        "options": [
          {
            "label": "卡其",
            "value": "khaki"
          },
          {
            "label": "墨黑",
            "value": "ink-black"
          }
        ]
      }
    ],
    "related": [
      "tsai-a-ga-collab-tee",
      "tsai-a-ga-army-hoodie",
      "tsai-a-ga-cheer-towel"
    ],
    "shipping": "台灣本島常溫宅配，3–5 個工作天出貨。",
    "returns": "7 天鑑賞期內，未拆吊牌、未使用可退換。"
  },
  "tsai-a-ga-desk-calendar": {
    "description": "收錄蔡桃貴一整年成長瞬間的 2027 桌曆，每翻一頁都是桃貴星球的新表情。擺在桌上，讓這個小傢伙的笑容陪你過完三百六十五天。",
    "specs": [
      {
        "k": "規格",
        "v": "12 個月份＋封面，三角立式"
      },
      {
        "k": "用紙",
        "v": "霧面厚卡紙，不反光"
      },
      {
        "k": "尺寸",
        "v": "約 21 × 15 公分"
      },
      {
        "k": "內容",
        "v": "蔡桃貴年度精選生活照"
      }
    ],
    "related": [
      "tsai-a-ga-diary-notebook",
      "tsai-a-ga-kuei-plush",
      "tsai-a-ga-planet-puzzle"
    ],
    "shipping": "台灣本島常溫宅配，3–5 個工作天出貨。",
    "returns": "印刷品拆封後非瑕疵恕不退換，瑕疵品 7 天內換貨。"
  },
  "tsai-a-ga-socks-pack": {
    "description": "三雙一組的台味襪子，把夜市、珍奶、台語梗都織進腳下，低頭一看就會心一笑。一次三款不重複，是嘎家軍最日常的小確幸。",
    "specs": [
      {
        "k": "數量",
        "v": "三雙一組，款式各異"
      },
      {
        "k": "材質",
        "v": "棉混紡，彈性透氣"
      },
      {
        "k": "尺寸",
        "v": "均碼，適合 22–27 公分"
      },
      {
        "k": "主題",
        "v": "台味元素提花設計"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "尺寸",
        "options": [
          {
            "label": "均碼",
            "value": "one-size"
          }
        ]
      },
      {
        "type": "colour",
        "label": "款式",
        "options": [
          {
            "label": "台味綜合組",
            "value": "taiwan-mix"
          }
        ]
      }
    ],
    "related": [
      "tsai-a-ga-collab-tee",
      "tsai-a-ga-market-tote",
      "tsai-a-ga-cheer-towel"
    ],
    "shipping": "台灣本島平面包裹寄送，3–5 個工作天送達。",
    "returns": "貼身衣物基於衛生考量，拆封後恕不退換，瑕疵品可換貨。"
  },
  "tsai-a-ga-phone-strap": {
    "description": "桃貴星球造型的手機吊飾，小巧一顆掛在手機上，走到哪都帶著一點宇宙級的可愛。是桃貴星球居民隨身攜帶的星際識別證。",
    "specs": [
      {
        "k": "材質",
        "v": "軟膠公仔吊飾，附金屬扣環"
      },
      {
        "k": "尺寸",
        "v": "吊飾本體約 4 公分"
      },
      {
        "k": "造型",
        "v": "桃貴星球主題立體成型"
      },
      {
        "k": "適用",
        "v": "手機、鑰匙、包包皆可掛"
      }
    ],
    "related": [
      "tsai-a-ga-acrylic-stand",
      "tsai-a-ga-kuei-pillow",
      "tsai-a-ga-planet-puzzle"
    ],
    "shipping": "台灣本島平信或宅配，3–5 個工作天送達。",
    "returns": "運送瑕疵 7 天內可換貨，人為損壞不在此限。"
  },
  "tsai-a-ga-eco-cup": {
    "description": "印著「呷飽未」問候語的環保隨行杯，買手搖、裝咖啡都減塑，把那句最台的關心隨身帶著。呷飽未？這句話，蔡阿嘎想對每個粉絲說。",
    "specs": [
      {
        "k": "容量",
        "v": "約 500 毫升"
      },
      {
        "k": "材質",
        "v": "304 不鏽鋼內膽，雙層保溫"
      },
      {
        "k": "杯蓋",
        "v": "防漏吸管蓋，附矽膠杯套"
      },
      {
        "k": "印製",
        "v": "「呷飽未」台語字樣"
      }
    ],
    "related": [
      "tsai-a-ga-erbo-apron",
      "tsai-a-ga-mug",
      "tsai-a-ga-market-tote"
    ],
    "shipping": "台灣本島常溫宅配，3–5 個工作天出貨。",
    "returns": "7 天鑑賞期內，未使用、配件齊全可退換。"
  },
  "tsai-a-ga-market-tote": {
    "description": "靈感來自菜市場阿姨的大容量購物袋，耐裝又好折，買菜、出遊一袋搞定。最台的生活風景，就從拎著它走進市場開始。",
    "specs": [
      {
        "k": "材質",
        "v": "加厚不織布＋帆布提把"
      },
      {
        "k": "容量",
        "v": "大容量，可裝整週採買"
      },
      {
        "k": "設計",
        "v": "菜市場意象印花"
      },
      {
        "k": "收納",
        "v": "可折疊收進內袋"
      }
    ],
    "related": [
      "tsai-a-ga-eco-cup",
      "tsai-a-ga-socks-pack",
      "tsai-a-ga-erbo-apron"
    ],
    "shipping": "台灣本島常溫宅配，3–5 個工作天出貨。",
    "returns": "7 天鑑賞期內，未使用、未污損可退換貨。"
  },
  "tsai-a-ga-keycap-set": {
    "description": "印上注音符號的客製鍵帽組，敲打鍵盤的同時也練台語、打鄉土味的字。給台語檢定班班長的鍵盤，每一顆鍵都很有戲。",
    "specs": [
      {
        "k": "數量",
        "v": "注音符號鍵帽一組"
      },
      {
        "k": "材質",
        "v": "PBT 二射成型，耐磨不掉字"
      },
      {
        "k": "軸體",
        "v": "通用 MX 十字軸"
      },
      {
        "k": "附件",
        "v": "附拔鍵器"
      }
    ],
    "related": [
      "tsai-a-ga-taigi-textbook",
      "tsai-a-ga-diary-notebook",
      "tsai-a-ga-sticker-set"
    ],
    "shipping": "台灣本島常溫宅配，3–5 個工作天出貨。",
    "returns": "7 天鑑賞期內，未安裝、包裝完整可退換。"
  },
  "tsai-a-ga-kuei-plush": {
    "description": "蔡桃貴絨毛娃娃，從頭到腳都軟綿綿，抱著睡、擺著看都療癒滿分。看著他在鏡頭前長大的你，現在能把這份成長收進懷裡。",
    "specs": [
      {
        "k": "尺寸",
        "v": "站高約 28 公分"
      },
      {
        "k": "填充",
        "v": "環保 PP 棉，蓬鬆有彈性"
      },
      {
        "k": "表布",
        "v": "短毛絨，親膚不刺激"
      },
      {
        "k": "造型",
        "v": "蔡桃貴經典招牌表情"
      }
    ],
    "related": [
      "tsai-a-ga-kuei-pillow",
      "tsai-a-ga-phone-strap",
      "tsai-a-ga-planet-puzzle"
    ],
    "shipping": "台灣本島常溫宅配，補貨後依訂單排序出貨。",
    "returns": "絨毛玩偶基於衛生考量，非瑕疵恕不退換。"
  },
  "tsai-a-ga-acrylic-stand": {
    "description": "把蔡阿嘎的經典貼圖做成壓克力立牌，擺在桌上、書架上都很搶戲。一個小小的立牌，把那些聊天室裡常用的梗立體化成日常的笑點。",
    "specs": [
      {
        "k": "材質",
        "v": "高透壓克力，附同款底座"
      },
      {
        "k": "尺寸",
        "v": "立牌高約 10 公分"
      },
      {
        "k": "印製",
        "v": "雙面 UV 印刷，色彩飽和"
      },
      {
        "k": "圖樣",
        "v": "經典貼圖款式"
      }
    ],
    "related": [
      "tsai-a-ga-sticker-set",
      "tsai-a-ga-phone-strap",
      "tsai-a-ga-diary-notebook"
    ],
    "shipping": "台灣本島常溫宅配，3–5 個工作天出貨。",
    "returns": "運送破損 7 天內可換貨，人為刮損不在此限。"
  },
  "tsai-a-ga-family-bundle": {
    "description": "一次擁有聯名T恤、嘎逼歪馬克杯與經典貼紙的嘎家日常組合包，從穿的、用的到貼的都到齊。把蔡阿嘎一家的日常，整套搬進你的生活裡。",
    "specs": [
      {
        "k": "內容",
        "v": "聯名T恤 ×1、馬克杯 ×1、貼紙包 ×1"
      },
      {
        "k": "T恤尺寸",
        "v": "可備註 S–XL"
      },
      {
        "k": "包裝",
        "v": "組合禮盒，附提袋"
      },
      {
        "k": "優惠",
        "v": "較單買更划算"
      }
    ],
    "variants": [
      {
        "type": "size",
        "label": "T恤尺寸",
        "options": [
          {
            "label": "S",
            "value": "s"
          },
          {
            "label": "M",
            "value": "m"
          },
          {
            "label": "L",
            "value": "l"
          },
          {
            "label": "XL",
            "value": "xl"
          }
        ]
      },
      {
        "type": "colour",
        "label": "T恤顏色",
        "options": [
          {
            "label": "奶茶米",
            "value": "milk-tea"
          },
          {
            "label": "墨黑",
            "value": "ink-black"
          }
        ]
      }
    ],
    "related": [
      "tsai-a-ga-collab-tee",
      "tsai-a-ga-mug",
      "tsai-a-ga-sticker-set"
    ],
    "shipping": "台灣本島常溫宅配，組合內含易碎品加強包裝，3–5 個工作天出貨。",
    "returns": "組合商品需整組退換，7 天鑑賞期內未拆封、未使用可辦理。"
  },
  "tsai-a-ga-cheer-towel": {
    "description": "印著「台灣加油」的應援毛巾，看球、看演唱會、運動擦汗都好用，揮起來就是一片台味的熱血。嘎家軍為這片土地加油時，手裡揮的就是它。",
    "specs": [
      {
        "k": "材質",
        "v": "純棉割絨，吸水柔軟"
      },
      {
        "k": "尺寸",
        "v": "約 30 × 110 公分"
      },
      {
        "k": "印製",
        "v": "「台灣加油」應援字樣"
      },
      {
        "k": "用途",
        "v": "應援、運動、日常擦拭"
      }
    ],
    "related": [
      "tsai-a-ga-dad-cap",
      "tsai-a-ga-socks-pack",
      "tsai-a-ga-collab-tee"
    ],
    "shipping": "台灣本島常溫宅配，3–5 個工作天出貨。",
    "returns": "7 天鑑賞期內，未使用、未清洗可退換貨。"
  },
  "tsai-a-ga-planet-puzzle": {
    "description": "520 片的桃貴星球拼圖，一片一片把這顆充滿童趣的星球拼回完整，拼的過程就是一段慢下來的陪伴。完成後裱框上牆，桃貴星球就住進了你家。",
    "specs": [
      {
        "k": "片數",
        "v": "520 片"
      },
      {
        "k": "完成尺寸",
        "v": "約 38 × 53 公分"
      },
      {
        "k": "材質",
        "v": "環保紙板，霧面不反光"
      },
      {
        "k": "主題",
        "v": "桃貴星球插畫"
      }
    ],
    "related": [
      "tsai-a-ga-kuei-plush",
      "tsai-a-ga-kuei-pillow",
      "tsai-a-ga-phone-strap"
    ],
    "shipping": "台灣本島常溫宅配，3–5 個工作天出貨。",
    "returns": "拼圖類拆封後非瑕疵恕不退換，缺片可於 7 天內申請補件。"
  },
  "tsai-a-ga-diary-notebook": {
    "description": "嘎日記手帳本，內頁留白好寫，封面印著台味滿滿的小插圖，記錄每天的瑣事與心情。把你的日常寫成日記，就像蔡阿嘎十五年來把生活拍成短片那樣。",
    "specs": [
      {
        "k": "內頁",
        "v": "160 頁，方格與留白混合"
      },
      {
        "k": "裝幀",
        "v": "穿線膠裝，可平攤書寫"
      },
      {
        "k": "尺寸",
        "v": "A5（14.8 × 21 公分）"
      },
      {
        "k": "附件",
        "v": "附書籤緞帶與彈性綁繩"
      }
    ],
    "related": [
      "tsai-a-ga-desk-calendar",
      "tsai-a-ga-taigi-textbook",
      "tsai-a-ga-sticker-set"
    ],
    "shipping": "台灣本島平面印刷品寄送，3–5 個工作天送達。",
    "returns": "文具拆封後非瑕疵恕不退換，瑕疵品 7 天內換貨。"
  },
  "ev-score-live": {
    "description": "那些年陪我們走過戲院的旋律,將由完整交響編制在台北流行音樂中心重新奏響。從刀光劍影到生離死別,讓現場的弦樂與銅管,把你帶回那個香港電影最閃亮的年代。",
    "doorsTime": "18:30 入場 · 19:30 開演",
    "lineup": [
      "指揮 葉聰",
      "長榮交響樂團",
      "客席鋼琴 陳冠宇",
      "客席二胡 王瀅絜"
    ],
    "ticketTiers": [
      {
        "label": "站票區",
        "ntd": 1200,
        "hkd": 300,
        "soldOut": false
      },
      {
        "label": "對號座",
        "ntd": 1800,
        "hkd": 450,
        "soldOut": false
      },
      {
        "label": "VIP 前排席（含節目冊）",
        "ntd": 2800,
        "hkd": 700,
        "soldOut": false
      }
    ],
    "related": [
      "ev-soundtrack-unplugged",
      "ev-themesong-night",
      "ev-foley-tour"
    ],
    "shipping": "電子票券，購票後將寄送至你的帳戶與 Email；實名制入場。",
    "returns": "售出之票券恕不退換；部分場次可申請轉讓，詳見活動說明。"
  },
  "ev-soundtrack-unplugged": {
    "description": "卸下華麗的編曲,只留一把吉他、一架鋼琴,與那些寫進片尾的真心話。在 Legacy Taipei 溫暖的燈光下,讓每一首離別與重逢的旋律,慢慢回到最初的模樣。",
    "doorsTime": "19:00 入場 · 20:00 開演",
    "lineup": [
      "原聲主唱 雷光夏",
      "吉他 黃玠",
      "鋼琴 盧律銘"
    ],
    "ticketTiers": [
      {
        "label": "全區站票",
        "ntd": 1200,
        "hkd": null,
        "soldOut": false
      },
      {
        "label": "限量吧台座",
        "ntd": 1600,
        "hkd": null,
        "soldOut": false
      }
    ],
    "related": [
      "ev-score-live",
      "ev-themesong-night",
      "ev-open-air"
    ],
    "shipping": "電子票券，購票後將寄送至你的帳戶與 Email；實名制入場。",
    "returns": "售出之票券恕不退換；部分場次可申請轉讓，詳見活動說明。"
  },
  "ev-fanmeet-trilogy": {
    "description": "《台灣三部曲》的主要演員與導演,將首次齊聚華山,與影迷分享拍攝時那些笑與淚的幕後時光。座席有限,是與心愛角色近距離相見的難得一刻。",
    "doorsTime": "13:30 入場 · 14:00 開始",
    "lineup": [
      "導演 魏德聖",
      "主演 阮經天",
      "主演 林依晨",
      "主演 莫子儀"
    ],
    "ticketTiers": [
      {
        "label": "一般席",
        "ntd": 880,
        "hkd": null,
        "soldOut": false
      },
      {
        "label": "前區簽名席（含合照）",
        "ntd": 1480,
        "hkd": null,
        "soldOut": false
      }
    ],
    "related": [
      "ev-fanmeet-director",
      "ev-premiere-trilogy",
      "ev-fan-screening-rose"
    ],
    "shipping": "電子票券，購票後將寄送至你的帳戶與 Email；實名制入場。",
    "returns": "售出之票券恕不退換；部分場次可申請轉讓，詳見活動說明。"
  },
  "ev-fanmeet-director": {
    "description": "電影散場後,故事其實才剛開始。在光點台北的小廳裡,導演將親自拆解每一顆鏡頭背後的選擇,陪你把那些看不懂的留白慢慢補上。",
    "doorsTime": "18:45 入場 · 19:15 開始",
    "lineup": [
      "導演 鍾孟宏",
      "映後主持 聞天祥"
    ],
    "ticketTiers": [
      {
        "label": "自由入座",
        "ntd": 520,
        "hkd": null,
        "soldOut": false
      },
      {
        "label": "前排對談席",
        "ntd": 780,
        "hkd": null,
        "soldOut": false
      }
    ],
    "related": [
      "ev-fanmeet-trilogy",
      "ev-fan-screening-rose",
      "ev-midnight-hk-double"
    ],
    "shipping": "電子票券，購票後將寄送至你的帳戶與 Email；實名制入場。",
    "returns": "售出之票券恕不退換；部分場次可申請轉讓，詳見活動說明。"
  },
  "ev-fanmeet-hk": {
    "description": "曾經在大銀幕上並肩的那群人,睽違多年後將在香港會議展覽中心重新聚首。一場關於青春、江湖與情義的重逢,獻給始終沒有忘記的你。",
    "doorsTime": "18:00 入場 · 19:00 開始",
    "lineup": [
      "張曼玉",
      "梁朝偉",
      "張學友",
      "主持 林海峰"
    ],
    "ticketTiers": [
      {
        "label": "後區席",
        "ntd": 1600,
        "hkd": 400,
        "soldOut": true
      },
      {
        "label": "前區握手席",
        "ntd": 2600,
        "hkd": 650,
        "soldOut": true
      }
    ],
    "related": [
      "ev-midnight-hk-double",
      "ev-score-live",
      "ev-fanmeet-trilogy"
    ],
    "shipping": "電子票券，購票後將寄送至你的帳戶與 Email；實名制入場。",
    "returns": "售出之票券恕不退換；部分場次可申請轉讓，詳見活動說明。"
  },
  "ev-online-concert": {
    "description": "這一次,我們把鏡頭直接架進了片場,讓你在家就能聽見那些誕生於拍攝現場的歌。多機位的即時直播,陪你度過一個不必出門也很靠近的夜晚。",
    "lineup": [
      "盧廣仲",
      "持修",
      "9m88"
    ],
    "ticketTiers": [
      {
        "label": "線上直播票",
        "ntd": 380,
        "hkd": 95,
        "soldOut": false
      },
      {
        "label": "直播 + 七日回放",
        "ntd": 580,
        "hkd": 145,
        "soldOut": false
      }
    ],
    "related": [
      "ev-online-premiere-live",
      "ev-themesong-night",
      "ev-soundtrack-unplugged"
    ],
    "shipping": "電子票券，購票後將寄送至你的帳戶與 Email；實名制入場。",
    "returns": "售出之票券恕不退換；部分場次可申請轉讓，詳見活動說明。"
  },
  "ev-online-premiere-live": {
    "description": "首映的那一刻,主創團隊就在線上陪你一起看。映畢隨即連線,把你打進聊天室的每一個問題,一一說給你聽。",
    "lineup": [
      "導演 程偉豪",
      "主演 許光漢",
      "主演 王淨",
      "連線主持 馬欣"
    ],
    "ticketTiers": [
      {
        "label": "線上首映票",
        "ntd": 250,
        "hkd": 65,
        "soldOut": false
      },
      {
        "label": "首映 + 限定數位海報",
        "ntd": 420,
        "hkd": 105,
        "soldOut": false
      }
    ],
    "related": [
      "ev-online-concert",
      "ev-premiere-trilogy",
      "ev-fanmeet-director"
    ],
    "shipping": "電子票券，購票後將寄送至你的帳戶與 Email；實名制入場。",
    "returns": "售出之票券恕不退換；部分場次可申請轉讓，詳見活動說明。"
  },
  "ev-premiere-trilogy": {
    "description": "等待多年的史詩,終於要在台北國際會議中心揭開第一頁。紅毯、主創、與大銀幕的第一道光,邀你成為見證這段島嶼故事啟程的人。",
    "doorsTime": "17:30 紅毯 · 19:00 開演",
    "lineup": [
      "導演 魏德聖",
      "主演 阮經天",
      "主演 林依晨",
      "監製 黃志明"
    ],
    "ticketTiers": [
      {
        "label": "二樓觀禮席",
        "ntd": 2800,
        "hkd": null,
        "soldOut": false
      },
      {
        "label": "一樓貴賓席（含紅毯區）",
        "ntd": 4200,
        "hkd": null,
        "soldOut": false
      }
    ],
    "related": [
      "ev-fanmeet-trilogy",
      "ev-online-premiere-live",
      "ev-score-live"
    ],
    "shipping": "電子票券，購票後將寄送至你的帳戶與 Email；實名制入場。",
    "returns": "售出之票券恕不退換；部分場次可申請轉讓，詳見活動說明。"
  },
  "ev-midnight-hk-double": {
    "description": "午夜的放映廳最適合江湖。一夜連看《英雄本色》與《倩女幽魂》兩部修復經典,讓菸與風衣、人鬼與痴情,陪你撐到天亮。",
    "doorsTime": "23:00 入場 · 23:30 開演",
    "ticketTiers": [
      {
        "label": "雙片連映票",
        "ntd": 680,
        "hkd": null,
        "soldOut": false
      },
      {
        "label": "雙片 + 宵夜套餐",
        "ntd": 880,
        "hkd": null,
        "soldOut": false
      }
    ],
    "related": [
      "ev-fanmeet-hk",
      "ev-open-air",
      "ev-fan-screening-rose"
    ],
    "shipping": "電子票券，購票後將寄送至你的帳戶與 Email；實名制入場。",
    "returns": "售出之票券恕不退換；部分場次可申請轉讓，詳見活動說明。"
  },
  "ev-fan-screening-rose": {
    "description": "把整間戲院留給最懂這部片的人。《玫瑰母親》影迷包場後,我們留下來聊聊那位母親、那座城,還有藏在花裡的眼淚。",
    "doorsTime": "13:00 入場 · 13:30 開演",
    "lineup": [
      "映後座談 導演 楊雅喆",
      "與談 影評人 鄭秉泓"
    ],
    "ticketTiers": [
      {
        "label": "包場座位票",
        "ntd": 520,
        "hkd": null,
        "soldOut": true
      }
    ],
    "related": [
      "ev-fanmeet-director",
      "ev-open-air",
      "ev-midnight-hk-double"
    ],
    "shipping": "電子票券，購票後將寄送至你的帳戶與 Email；實名制入場。",
    "returns": "售出之票券恕不退換；部分場次可申請轉讓，詳見活動說明。"
  },
  "ev-doc-workshop": {
    "description": "兩天的時間,跟著資深紀錄片工作者,從一個念頭走到一段真實的影像。在 Ztor. 創作基地,我們不談技巧的炫技,只練習如何耐心地看見人。",
    "doorsTime": "09:30 報到 · 10:00 開課",
    "lineup": [
      "主講導演 楊力州",
      "剪輯指導 林婉玉",
      "田野調查講師 賀照緹"
    ],
    "ticketTiers": [
      {
        "label": "兩日全程（含教材）",
        "ntd": 3200,
        "hkd": null,
        "soldOut": false
      },
      {
        "label": "兩日全程 + 一對一作品諮詢",
        "ntd": 4500,
        "hkd": null,
        "soldOut": false
      }
    ],
    "related": [
      "ev-foley-tour",
      "ev-pitch-night",
      "ev-fanmeet-director"
    ],
    "shipping": "電子票券，購票後將寄送至你的帳戶與 Email；實名制入場。",
    "returns": "售出之票券恕不退換；部分場次可申請轉讓，詳見活動說明。"
  },
  "ev-open-air": {
    "description": "鋪一塊野餐墊,躺在華中露營場的草地上,讓修復過的台語老片在星空下重新播映。風會吹過、蟲會鳴叫,而那些熟悉的台詞,依然在心裡發著光。",
    "doorsTime": "18:00 入場 · 19:30 開演",
    "ticketTiers": [
      {
        "label": "草地票（自備野餐墊）",
        "ntd": 380,
        "hkd": null,
        "soldOut": false
      },
      {
        "label": "懶人沙發雙人席",
        "ntd": 880,
        "hkd": null,
        "soldOut": false
      }
    ],
    "related": [
      "ev-midnight-hk-double",
      "ev-soundtrack-unplugged",
      "ev-fan-screening-rose"
    ],
    "shipping": "電子票券，購票後將寄送至你的帳戶與 Email；實名制入場。",
    "returns": "售出之票券恕不退換；部分場次可申請轉讓，詳見活動說明。"
  },
  "ev-foley-tour": {
    "description": "電影裡的腳步聲、雨聲、心碎聲,其實都是有人用手做出來的。走進 Ztor. 後期中心的擬音棚,親手敲出屬於你的那一段聲音魔法。",
    "doorsTime": "13:45 報到 · 14:00 開始",
    "lineup": [
      "擬音師 胡定一",
      "錄音指導 杜篤之團隊"
    ],
    "ticketTiers": [
      {
        "label": "導覽體驗票",
        "ntd": 980,
        "hkd": null,
        "soldOut": false
      },
      {
        "label": "親子雙人體驗票",
        "ntd": 1680,
        "hkd": null,
        "soldOut": false
      }
    ],
    "related": [
      "ev-doc-workshop",
      "ev-score-live",
      "ev-soundtrack-unplugged"
    ],
    "shipping": "電子票券，購票後將寄送至你的帳戶與 Email；實名制入場。",
    "returns": "售出之票券恕不退換；部分場次可申請轉讓，詳見活動說明。"
  },
  "ev-costume-exhibit": {
    "description": "那件戲服怎麼縫、那把道具刀藏著什麼祕密,這次都攤在松山文創園區的展間裡讓你細看。早鳥票限時開放,搶先走進角色們真正穿戴過的世界。",
    "ticketTiers": [
      {
        "label": "早鳥單人票",
        "ntd": 320,
        "hkd": 80,
        "soldOut": false
      },
      {
        "label": "早鳥雙人套票",
        "ntd": 580,
        "hkd": 145,
        "soldOut": false
      }
    ],
    "related": [
      "ev-foley-tour",
      "ev-premiere-trilogy",
      "ev-fanmeet-trilogy"
    ],
    "shipping": "電子票券，購票後將寄送至你的帳戶與 Email；實名制入場。",
    "returns": "售出之票券恕不退換；部分場次可申請轉讓，詳見活動說明。"
  },
  "ev-pitch-night": {
    "description": "把你心裡那個放了很久的故事,說給真正懂的人聽。在 Ztor. 創作基地,監製們會坐在你對面,陪你把一個念頭,推向有機會被拍出來的那一步。",
    "doorsTime": "18:30 入場 · 19:00 開始",
    "lineup": [
      "監製 葉如芬",
      "監製 李烈",
      "提案主持 製片 曾少千"
    ],
    "ticketTiers": [
      {
        "label": "免費報名",
        "ntd": 0,
        "hkd": null,
        "soldOut": false
      }
    ],
    "related": [
      "ev-doc-workshop",
      "ev-fanmeet-director",
      "ev-foley-tour"
    ],
    "shipping": "電子票券，購票後將寄送至你的帳戶與 Email；實名制入場。",
    "returns": "售出之票券恕不退換；部分場次可申請轉讓，詳見活動說明。"
  },
  "au-redcarpet": {
    "description": "秋季首映禮的紅毯一向是影迷與影人最靠近彼此的夜晚，這組雙人席讓你與身旁的人並肩走過那段被閃光燈包圍的紅色長廊。從入場到散場，你們不只是觀眾，而是這個夜晚故事裡的一部分。",
    "specs": [
      {
        "k": "件數",
        "v": "雙人席 1 組（2 席相鄰）"
      },
      {
        "k": "狀態",
        "v": "未使用・含當晚有效通行"
      },
      {
        "k": "附件",
        "v": "實名電子通行證、紅毯動線識別帶"
      },
      {
        "k": "席區",
        "v": "紅毯區後方迎賓座"
      }
    ],
    "provenance": "席位由主辦單位首映禮票務組統一配發，每席附帶當晚實名電子通行證與紅毯動線識別帶，憑證可於現場核驗。",
    "bidIncrement": 2000,
    "related": [
      "au-masterclass",
      "au-setvisit",
      "au-premiere-seat-row1"
    ],
    "shipping": "得標者於結標後由專人聯繫，安排交付與運送（含保險）事宜。",
    "returns": "競標商品為現況拍賣，得標後恕不退換。"
  },
  "au-masterclass": {
    "description": "在這堂大師班裡，你會聽見那些招牌畫面背後真正的猶豫與選擇，由本人親口娓娓道來。一個席位，換一個下午，把多年來只能從銀幕揣摩的東西，當面聽他說清楚。",
    "specs": [
      {
        "k": "件數",
        "v": "單席 1 個"
      },
      {
        "k": "狀態",
        "v": "未使用・含現場提問資格"
      },
      {
        "k": "附件",
        "v": "專屬識別證、課程講義一份"
      },
      {
        "k": "時長",
        "v": "約 150 分鐘（含問答）"
      }
    ],
    "provenance": "席位由活動策展單位限額釋出，憑當日簽到名冊與專屬識別證入場，名額與本人現場出席均經主辦確認。",
    "bidIncrement": 2000,
    "related": [
      "au-redcarpet",
      "au-setvisit",
      "au-storyboard-original"
    ],
    "shipping": "得標者於結標後由專人聯繫，安排交付與運送（含保險）事宜。",
    "returns": "競標商品為現況拍賣，得標後恕不退換。"
  },
  "au-setvisit": {
    "description": "《台灣三部曲》的劇組探班讓你走進那座還在呼吸的片場，看著燈光、軌道與一句句台詞如何被反覆雕琢成最後的畫面。一整天的時間，你不再隔著銀幕，而是站在故事正在發生的地方。",
    "specs": [
      {
        "k": "件數",
        "v": "個人名額 1 位"
      },
      {
        "k": "狀態",
        "v": "未使用・需簽署保密同意書"
      },
      {
        "k": "附件",
        "v": "訪客證、劇組陪同導覽"
      },
      {
        "k": "時長",
        "v": "現場一日（含午餐）"
      }
    ],
    "provenance": "探班名額由製作公司現場接待組安排，憑簽署之保密同意書與訪客證進場，行程與安全動線由劇組統籌人員陪同確認。",
    "bidIncrement": 1000,
    "related": [
      "au-redcarpet",
      "au-masterclass",
      "au-clapper-final"
    ],
    "shipping": "得標者於結標後由專人聯繫，安排交付與運送（含保險）事宜。",
    "returns": "競標商品為現況拍賣，得標後恕不退換。"
  },
  "au-premiere-seat-row1": {
    "description": "金馬首映場的第一排中央，是整個影廳裡最接近銀幕、也最接近這部作品初次與世界見面那一刻的位置。當燈光暗下、片名浮現，你會記得自己就坐在那一夜的正中央。",
    "specs": [
      {
        "k": "件數",
        "v": "單席 1 個（第一排中央）"
      },
      {
        "k": "狀態",
        "v": "未使用・對號實名入場"
      },
      {
        "k": "附件",
        "v": "實名入場憑證、場刊一份"
      },
      {
        "k": "席區",
        "v": "首映影廳 第 1 排中央"
      }
    ],
    "provenance": "席位由金馬首映場票務單位指定配發，附對號實名入場憑證，座位區段與場次資訊以主辦核發之票面為準。",
    "bidIncrement": 2000,
    "related": [
      "au-redcarpet",
      "au-masterclass",
      "au-poster-artistproof"
    ],
    "shipping": "得標者於結標後由專人聯繫，安排交付與運送（含保險）事宜。",
    "returns": "競標商品為現況拍賣，得標後恕不退換。"
  },
  "au-storyboard-original": {
    "description": "這三連幅分鏡手稿，是經典片頭在成為畫面之前最初的模樣，鉛筆線條裡還留著當時來回斟酌的塗改與筆觸。把它掛起來，等於把那段開場在腦中重播的瞬間，永遠留在了牆上。",
    "specs": [
      {
        "k": "件數",
        "v": "三連幅 1 組（共 3 張）"
      },
      {
        "k": "狀態",
        "v": "原件・輕微歲月痕跡"
      },
      {
        "k": "附件",
        "v": "真跡證明、無酸保存夾"
      },
      {
        "k": "材質",
        "v": "鉛筆／繪圖紙"
      }
    ],
    "provenance": "手稿出自原創作團隊保存之工作檔案，由分鏡作者親筆繪製並於背面標註場次序號，附作者本人簽署之真跡證明。",
    "bidIncrement": 5000,
    "related": [
      "au-clapper-final",
      "au-poster-artistproof",
      "au-costume-hero"
    ],
    "shipping": "得標者於結標後由專人聯繫，安排交付與運送（含保險）事宜。",
    "returns": "競標商品為現況拍賣，得標後恕不退換。"
  },
  "au-costume-hero": {
    "description": "這件男主角戲服連同戲用配飾一併保留，布料上還留著拍攝期間的折痕與光影細節，是角色在鏡頭前真正穿過的那一件。當你近看那些針腳與磨損，會更明白那個人物是怎麼被一寸寸穿成形的。",
    "specs": [
      {
        "k": "件數",
        "v": "戲服 1 套・含配飾 2 件"
      },
      {
        "k": "狀態",
        "v": "戲用原件・保留拍攝痕跡"
      },
      {
        "k": "附件",
        "v": "來源證明、防塵收納袋"
      },
      {
        "k": "尺碼",
        "v": "男版 M（依角色實穿）"
      }
    ],
    "provenance": "戲服由製作公司服裝組正式撥出，附戲用配飾與場次穿著紀錄，並由服裝統籌簽署之來源證明確認其為實際入鏡原件。",
    "bidIncrement": 5000,
    "related": [
      "au-storyboard-original",
      "au-clapper-final",
      "au-poster-artistproof"
    ],
    "shipping": "得標者於結標後由專人聯繫，安排交付與運送（含保險）事宜。",
    "returns": "競標商品為現況拍賣，得標後恕不退換。"
  },
  "au-poster-artistproof": {
    "description": "前導海報的藝術家校樣 AP1/3，是正式量產前供創作者確認色彩與細節的少數樣張之一，邊角還保留著校色時的手寫註記。它親簽於畫面一隅，記下了這張海報最初被認可的那一刻。",
    "specs": [
      {
        "k": "件數",
        "v": "1 張（AP1/3）"
      },
      {
        "k": "狀態",
        "v": "校樣・含手寫校色註記"
      },
      {
        "k": "附件",
        "v": "版次簽名證明、捲筒收納"
      },
      {
        "k": "尺寸",
        "v": "約 70 × 100 cm"
      }
    ],
    "provenance": "校樣為藝術家校樣版（Artist's Proof）三件中之第一件，由海報設計者親筆簽名並編號，附工作室出具之版次與簽名證明。",
    "bidIncrement": 2000,
    "related": [
      "au-storyboard-original",
      "au-costume-hero",
      "au-popcorn-gold"
    ],
    "shipping": "得標者於結標後由專人聯繫，安排交付與運送（含保險）事宜。",
    "returns": "競標商品為現況拍賣，得標後恕不退換。"
  },
  "au-clapper-final": {
    "description": "這塊殺青場記板上，留著劇組全員在最後一個鏡頭收工那天親手簽下的名字，每一筆都是一段一起熬過的日子。它記下的不只是最後一場戲的編號，而是一整個團隊說再見的那個瞬間。",
    "specs": [
      {
        "k": "件數",
        "v": "場記板 1 件"
      },
      {
        "k": "狀態",
        "v": "戲用原件・含全員簽名"
      },
      {
        "k": "附件",
        "v": "使用簽名證明、立式展示座"
      },
      {
        "k": "材質",
        "v": "木質板身／壓克力標記面"
      }
    ],
    "provenance": "場記板為實際拍攝使用之殺青道具，於最後一日拍攝結束後由全體劇組現場簽名，附製作公司開立之使用與簽名證明。",
    "bidIncrement": 2000,
    "related": [
      "au-storyboard-original",
      "au-costume-hero",
      "au-setvisit"
    ],
    "shipping": "得標者於結標後由專人聯繫，安排交付與運送（含保險）事宜。",
    "returns": "競標商品為現況拍賣，得標後恕不退換。"
  },
  "au-popcorn-gold": {
    "description": "金色爆米花桶 #001 是這款週邊量產前最初的編號原型，金屬光澤與桶身比例都還停在第一次被打樣出來的樣子。它小小一只，卻裝著一整套設計從草圖走向影廳的起點。",
    "specs": [
      {
        "k": "件數",
        "v": "1 只（編號 #001）"
      },
      {
        "k": "狀態",
        "v": "原型・桶底刻號"
      },
      {
        "k": "附件",
        "v": "原型出處說明、絨布內襯盒"
      },
      {
        "k": "材質",
        "v": "鍍金金屬桶身"
      }
    ],
    "provenance": "此為量產前打樣之首件編號原型（#001），桶底刻有序號並附設計團隊開立之原型出處說明，與後續市售版本規格略有差異。",
    "bidIncrement": 1000,
    "related": [
      "au-poster-artistproof",
      "au-clapper-final",
      "au-storyboard-original"
    ],
    "shipping": "得標者於結標後由專人聯繫，安排交付與運送（含保險）事宜。",
    "returns": "競標商品為現況拍賣，得標後恕不退換。"
  },
  "ztor-program-book": {
    "description": "翻開這本場刊,從分鏡手稿到幕後訪談,把整部電影的呼吸都收進掌心。封面燙金編號讓每一本都成為只屬於你的那一場記憶。",
    "specs": [
      {
        "k": "材質",
        "v": "進口美術紙內頁,硬殼精裝裱布封面"
      },
      {
        "k": "尺寸",
        "v": "21 × 28 cm,共 96 頁"
      },
      {
        "k": "限量",
        "v": "全球限量 300 份,逐本燙金流水編號"
      }
    ],
    "redeemNote": "以 1,800 爆米花兌換,限量 300 份兌完即止;確認後 14 個工作天內掛號寄出,屬限定典藏品,寄出後恕不退換。",
    "related": [
      "ztor-original-poster",
      "ztor-polaroid-stills",
      "ztor-signed-script"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "ztor-original-poster": {
    "description": "雙聯張海報攤開來,正是當年掛在戲院大廳的那一幕氣勢。捲起收好,改天裱框上牆,牆面就成了你的私人首映場。",
    "specs": [
      {
        "k": "材質",
        "v": "霧面藝術紙,環保大豆油墨印刷"
      },
      {
        "k": "尺寸",
        "v": "單張 70 × 100 cm,雙聯共兩張"
      },
      {
        "k": "限量",
        "v": "限量 500 份,附原廠防潮紙筒"
      }
    ],
    "redeemNote": "以 2,200 爆米花兌換,限量 500 份;確認後 14 個工作天內以捲筒包裝掛號寄出,屬限定海報恕不退換、不補發。",
    "related": [
      "ztor-program-book",
      "ztor-acrylic-standee",
      "ztor-postcard-set"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "ztor-polaroid-stills": {
    "description": "六張拍立得劇照,凝住了角色最不設防的那幾個瞬間。帶著底片的暖黃色調,像是從電影裡偷偷帶回家的私房記憶。",
    "specs": [
      {
        "k": "材質",
        "v": "拍立得即影即有相紙,白框設計"
      },
      {
        "k": "尺寸",
        "v": "單張 8.6 × 10.8 cm,一套 6 張"
      },
      {
        "k": "限量",
        "v": "限量 200 份,附半透明收納袋"
      }
    ],
    "redeemNote": "以 2,800 爆米花兌換,限量 200 份兌完為止;確認後 14 個工作天內掛號寄出,屬限定劇照組,寄出後恕不退換。",
    "related": [
      "ztor-postcard-set",
      "ztor-film-cell-frame",
      "ztor-program-book"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "ztor-popcorn-bucket": {
    "description": "午夜場限定色的爆米花桶,留著放映廳燈暗下來那一刻的深夜氣味。看完電影別丟,擺在書架上就是一盞會說故事的容器。",
    "specs": [
      {
        "k": "材質",
        "v": "食品級 PP 桶身,啞光特別色印刷"
      },
      {
        "k": "尺寸",
        "v": "高 22 cm,容量約 3.5 公升"
      },
      {
        "k": "限量",
        "v": "午夜場限定色,限量 500 份"
      }
    ],
    "redeemNote": "以 3,600 爆米花兌換,午夜場限定色限量 500 份;確認後 21 個工作天內寄出,屬限定色商品恕不退換、不另補發。",
    "related": [
      "ztor-keychain",
      "ztor-tote-bag",
      "ztor-crew-cap"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "ztor-pin-set": {
    "description": "四枚角色琺瑯徽章,把你最捨不得的那幾個人別在外套上隨身帶著。每一枚的細節都來自電影裡的小物,懂的人自然會心一笑。",
    "specs": [
      {
        "k": "材質",
        "v": "硬琺瑯填色,電鍍金屬底座"
      },
      {
        "k": "尺寸",
        "v": "單枚直徑約 3 cm,一套 4 枚"
      },
      {
        "k": "配件",
        "v": "附蝴蝶夾扣,展示卡裝"
      }
    ],
    "redeemNote": "以 1,500 爆米花兌換;確認後 14 個工作天內寄出,屬實體兌換商品,寄出後恕不退換或更換款式。",
    "related": [
      "ztor-keychain",
      "ztor-acrylic-standee",
      "ztor-crew-cap"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "ztor-film-cell-frame": {
    "description": "框裡那一格是真正的 35mm 原片,放映機曾讓它在大銀幕上閃過二十四分之一秒。如今它靜靜停格,讓你把那一瞬間留在牆上。",
    "specs": [
      {
        "k": "材質",
        "v": "35mm 原始膠片,實木相框裱裝"
      },
      {
        "k": "尺寸",
        "v": "框體 18 × 24 cm,附說明卡"
      },
      {
        "k": "限量",
        "v": "限量 120 份,每份原片格不重複"
      }
    ],
    "redeemNote": "以 4,800 爆米花兌換,限量 120 份、每帳戶限兌 1 份;確認後依序寄出,屬唯一原片典藏品恕不退換、不指定畫面。",
    "related": [
      "ztor-signed-script",
      "ztor-clapperboard",
      "ztor-polaroid-stills"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "ztor-tote-bag": {
    "description": "印著片名標準字的帆布袋,把這部電影低調地揹在肩上走進日常。容量裝得下一整天,也裝得下一整段散場後還沒退去的心情。",
    "specs": [
      {
        "k": "材質",
        "v": "12 安士厚磅胚布,水性印花"
      },
      {
        "k": "尺寸",
        "v": "36 × 40 cm,袋深 10 cm"
      },
      {
        "k": "承重",
        "v": "建議承重 8 公斤,雙肩長提把"
      }
    ],
    "redeemNote": "以 1,600 爆米花兌換;確認後 14 個工作天內寄出,屬實體兌換商品,寄出後恕不退換。",
    "related": [
      "ztor-crew-tee",
      "ztor-crew-cap",
      "ztor-keychain"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "ztor-clapperboard": {
    "description": "與片場同款的場記板複製品,木夾闔上那一聲清脆,是每個鏡頭開始前的儀式。放在桌上,你也能對著空氣喊一次 Action。",
    "specs": [
      {
        "k": "材質",
        "v": "實木板身,壓克力可擦寫面板"
      },
      {
        "k": "尺寸",
        "v": "30 × 28 cm,含拍板條"
      },
      {
        "k": "限量",
        "v": "限量 150 份,可手寫場次資訊"
      }
    ],
    "redeemNote": "以 5,200 爆米花兌換,限量 150 份兌完即止;確認後 21 個工作天內寄出,屬限定道具複製品恕不退換。",
    "related": [
      "ztor-signed-script",
      "ztor-film-cell-frame",
      "ztor-crew-tee"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "ztor-signed-script": {
    "description": "導演親筆簽名的劇本複製本,翻頁時還看得見現場手寫的走位與改動。這是離創作現場最近的一次,像是被請進了那間剪接室。",
    "specs": [
      {
        "k": "材質",
        "v": "仿原稿復刻內頁,軟皮封面"
      },
      {
        "k": "簽名",
        "v": "導演親筆簽名,逐本不同"
      },
      {
        "k": "限量",
        "v": "限量 50 份,每帳戶限兌 1 份"
      }
    ],
    "redeemNote": "以 12,000 爆米花兌換,限量 50 份、每帳戶限兌 1 份;確認後依序掛號寄出,屬親簽典藏品恕不退換、不補簽。",
    "related": [
      "ztor-clapperboard",
      "ztor-film-cell-frame",
      "ztor-program-book"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "ztor-acrylic-standee": {
    "description": "劇照壓克力立牌,讓那個角色就這樣站在你的書桌一角陪你。光線斜照過來時,邊緣會泛起一圈淡淡的透亮。",
    "specs": [
      {
        "k": "材質",
        "v": "高透壓克力,UV 直噴印刷"
      },
      {
        "k": "尺寸",
        "v": "立牌高 15 cm,附壓克力底座"
      },
      {
        "k": "款式",
        "v": "主視覺劇照單款"
      }
    ],
    "redeemNote": "以 1,300 爆米花兌換;確認後 14 個工作天內寄出,屬實體兌換商品,寄出後恕不退換或改款。",
    "related": [
      "ztor-pin-set",
      "ztor-postcard-set",
      "ztor-keychain"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "ztor-postcard-set": {
    "description": "十二張劇照明信片,一張一幕,湊起來剛好是整部電影的散步路線。寄一張給朋友,或留著自己慢慢翻,都像在重看一次。",
    "specs": [
      {
        "k": "材質",
        "v": "300 磅雪面卡紙,背面留白可書寫"
      },
      {
        "k": "尺寸",
        "v": "單張 10 × 15 cm,一套 12 張"
      },
      {
        "k": "包裝",
        "v": "附紙質書腰收納"
      }
    ],
    "redeemNote": "以 800 爆米花兌換;確認後 14 個工作天內寄出,屬實體兌換商品,寄出後恕不退換。",
    "related": [
      "ztor-polaroid-stills",
      "ztor-original-poster",
      "ztor-acrylic-standee"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "ztor-keychain": {
    "description": "做成電影片盤造型的金屬鑰匙圈,小小一枚卻沉得有分量。每次掏鑰匙,都會不經意摸到那段放映時光。",
    "specs": [
      {
        "k": "材質",
        "v": "鋅合金,啞光電鍍處理"
      },
      {
        "k": "尺寸",
        "v": "主體直徑 3.5 cm,含扣環"
      },
      {
        "k": "工藝",
        "v": "雷射雕刻片名標準字"
      }
    ],
    "redeemNote": "以 900 爆米花兌換;確認後 14 個工作天內寄出,屬實體兌換商品,寄出後恕不退換。",
    "related": [
      "ztor-pin-set",
      "ztor-popcorn-bucket",
      "ztor-tote-bag"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "ztor-crew-cap": {
    "description": "劇組同款的棒球帽,戴上它就像領到了一張幕後通行證。低調的繡字只有真正看懂的人才認得出來。",
    "specs": [
      {
        "k": "材質",
        "v": "純棉斜紋布,六片式帽身"
      },
      {
        "k": "尺寸",
        "v": "後扣金屬釦,頭圍 56–60 cm 可調"
      },
      {
        "k": "限量",
        "v": "限量 300 份,劇組同款配色"
      }
    ],
    "redeemNote": "以 2,600 爆米花兌換,限量 300 份;確認後 14 個工作天內寄出,屬限定服飾恕不退換、不換色。",
    "related": [
      "ztor-crew-tee",
      "ztor-tote-bag",
      "ztor-popcorn-bucket"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "ztor-crew-tee": {
    "description": "黑色的劇組工作 T 恤,胸前那行小字記著一段一起熬過的日子。穿著它出門,就像把片場的溫度繼續帶在身上。",
    "specs": [
      {
        "k": "材質",
        "v": "純棉厚磅平織,水洗不易變形"
      },
      {
        "k": "尺寸",
        "v": "S / M / L / XL,兌換時備註填寫"
      },
      {
        "k": "顏色",
        "v": "啞光黑,正面絹印標準字"
      }
    ],
    "redeemNote": "以 3,200 爆米花兌換,請於兌換備註填寫尺寸;確認後 14 個工作天內寄出,屬個人化服飾恕不退換、不改尺寸。",
    "related": [
      "ztor-crew-cap",
      "ztor-tote-bag",
      "ztor-clapperboard"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "movie-exchange-voucher": {
    "description": "一張 2D 正價座位的電影交換券,想看哪一場、約哪個人,都由你決定。把它留在帳戶裡,等一個值得進戲院的夜晚。",
    "specs": [
      {
        "k": "適用",
        "v": "全台合作戲院 2D 正價場次"
      },
      {
        "k": "座位",
        "v": "正價座位 1 位"
      },
      {
        "k": "效期",
        "v": "兌換後 90 天內使用"
      }
    ],
    "redeemNote": "以 4,400 爆米花兌換,確認後即時發送至帳戶;效期 90 天逾期失效,屬點數兌換之觀影權益恕不折現、不退還爆米花。",
    "related": [
      "imax-upgrade-voucher",
      "qa-priority-seat",
      "midnight-double-feature"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "imax-upgrade-voucher": {
    "description": "把手上的觀影券升級進 IMAX 廳,讓畫面與聲音整個包覆住你。有些電影,本來就該用更大的銀幕重新認識一次。",
    "specs": [
      {
        "k": "適用",
        "v": "合作戲院 IMAX 廳場次"
      },
      {
        "k": "使用條件",
        "v": "需搭配電影交換券一同使用"
      },
      {
        "k": "效期",
        "v": "兌換後 90 天內使用"
      }
    ],
    "redeemNote": "以 1,600 爆米花兌換,須搭配電影交換券使用、不可單獨入場;效期 90 天逾期失效,恕不折現、不退還爆米花。",
    "related": [
      "movie-exchange-voucher",
      "midnight-double-feature",
      "qa-priority-seat"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "premiere-lottery-entry": {
    "description": "投下一次首映禮的抽選資格,就有機會搶先在所有人之前看到這部電影。等待開獎的那幾天,也是屬於影迷的小小心跳。",
    "specs": [
      {
        "k": "形式",
        "v": "首映禮入場抽選資格 1 次"
      },
      {
        "k": "名額",
        "v": "限量 1,000 個抽選名額"
      },
      {
        "k": "公布",
        "v": "結果於首映前 7 天以站內通知公布"
      }
    ],
    "redeemNote": "以 880 爆米花兌換抽選資格 1 次,名額 1,000 個額滿為止;中選與否皆不退還爆米花,未中選不另補償。",
    "related": [
      "qa-priority-seat",
      "movie-exchange-voucher",
      "set-visit-experience"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "set-visit-experience": {
    "description": "半日的劇組探班體驗,讓你真正走進那個平常只能在銀幕後想像的世界。看一場戲怎麼被拍出來,是再多周邊都換不到的記憶。",
    "specs": [
      {
        "k": "時長",
        "v": "半日,約 4 小時"
      },
      {
        "k": "地點",
        "v": "指定拍攝場地,含市區定點接駁"
      },
      {
        "k": "名額",
        "v": "限量 4 名,需簽署保密協議"
      },
      {
        "k": "效期",
        "v": "依拍攝檔期安排,專人聯繫確認"
      }
    ],
    "redeemNote": "以 58,000 爆米花兌換,限量 4 名;入場前須簽署保密協議,屬限定體驗恕不退還爆米花、不可轉讓他人。",
    "related": [
      "private-screening-30",
      "premiere-lottery-entry",
      "qa-priority-seat"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "private-screening-30": {
    "description": "30 個座位的包場放映,整間影廳今晚只屬於你和你想邀的人。燈一暗下來,這場電影就成了你們之間的私密儀式。",
    "specs": [
      {
        "k": "規模",
        "v": "包場 30 個座位"
      },
      {
        "k": "地點",
        "v": "合作戲院,由專人協調場地"
      },
      {
        "k": "場次",
        "v": "限平日,兌換後專人聯繫安排"
      },
      {
        "k": "效期",
        "v": "自兌換起 90 天內完成預約"
      }
    ],
    "redeemNote": "以 52,000 爆米花兌換,確認後由專人聯繫安排平日場次;屬限定包場體驗恕不退還爆米花,確認場次後不可改期。",
    "related": [
      "midnight-double-feature",
      "set-visit-experience",
      "movie-exchange-voucher"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "qa-priority-seat": {
    "description": "映後座談的優先入場券,讓你不必排隊就能坐進離主創最近的那幾排。當燈亮起、開始對談時,你早已在最好的位置等著了。",
    "specs": [
      {
        "k": "形式",
        "v": "映後座談優先入場 1 位"
      },
      {
        "k": "場次",
        "v": "限指定場次使用"
      },
      {
        "k": "名額",
        "v": "限量 80 份"
      }
    ],
    "redeemNote": "以 2,600 爆米花兌換,限量 80 份、限指定場次使用;座位依入場順序安排,屬點數兌換權益恕不退還爆米花、不可轉讓。",
    "related": [
      "premiere-lottery-entry",
      "movie-exchange-voucher",
      "midnight-double-feature"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "midnight-double-feature": {
    "description": "午夜雙片連映的兩人座套票,陪你把一個尋常的夜晚過成一場小小的影展。看完第一部還捨不得回家的人,就是為這種場次而來的。",
    "specs": [
      {
        "k": "形式",
        "v": "午夜連映兩部,兩人座套票"
      },
      {
        "k": "場次",
        "v": "限定午夜連映場次"
      },
      {
        "k": "票券",
        "v": "兌換後即時發送電子票 2 張"
      }
    ],
    "redeemNote": "以 6,800 爆米花兌換,兌換後即時發送 2 張電子票;限定午夜場次使用,屬點數兌換票券恕不退還爆米花、不折現。",
    "related": [
      "movie-exchange-voucher",
      "imax-upgrade-voucher",
      "private-screening-30"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "parknshop-hk50": {
    "description": "百佳 PARKnSHOP 是香港常見的連鎖超市,這張 HK$50 電子購物禮券可在全港分店折抵日常採購。兌換後即時發送至帳戶,結帳時出示券碼即可使用。",
    "specs": [
      {
        "k": "面額",
        "v": "HK$50"
      },
      {
        "k": "形式",
        "v": "電子券"
      },
      {
        "k": "適用通路",
        "v": "全港百佳 PARKnSHOP 分店"
      },
      {
        "k": "效期",
        "v": "發券日起 12 個月"
      }
    ],
    "redeemNote": "兌換後即時發送電子券至帳戶",
    "related": [
      "parknshop-hk100",
      "parknshop-hk500",
      "watsons-hk50"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "parknshop-hk100": {
    "description": "百佳 PARKnSHOP HK$100 電子購物禮券,適合一次採買整週的食材與生活用品。兌換後即時入帳,於門市結帳時掃碼折抵。",
    "specs": [
      {
        "k": "面額",
        "v": "HK$100"
      },
      {
        "k": "形式",
        "v": "電子券"
      },
      {
        "k": "適用通路",
        "v": "全港百佳 PARKnSHOP 分店"
      },
      {
        "k": "效期",
        "v": "發券日起 12 個月"
      }
    ],
    "redeemNote": "兌換後即時發送電子券至帳戶",
    "related": [
      "parknshop-hk50",
      "parknshop-hk500",
      "yata-hk100"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "parknshop-hk500": {
    "description": "百佳 PARKnSHOP HK$500 電子購物禮券,適合月度大宗採買或家庭備貨。面額較高,兌換後需 3 個工作天發送,可分次於門市使用至餘額用罄。",
    "specs": [
      {
        "k": "面額",
        "v": "HK$500"
      },
      {
        "k": "形式",
        "v": "電子券"
      },
      {
        "k": "適用通路",
        "v": "全港百佳 PARKnSHOP 分店"
      },
      {
        "k": "效期",
        "v": "發券日起 24 個月"
      }
    ],
    "redeemNote": "兌換後 3 個工作天內發送電子券",
    "related": [
      "parknshop-hk100",
      "parknshop-hk50",
      "citysuper-hk500"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "citysuper-hk500": {
    "description": "city'super 是主打進口食材與精緻生活選物的高端超市,這張 HK$500 購物禮券可用於選購食品、廚具與生活雜貨。採實體卡寄送,每月每帳戶限兌兩份。",
    "specs": [
      {
        "k": "面額",
        "v": "HK$500"
      },
      {
        "k": "形式",
        "v": "實體卡(掛號寄送)"
      },
      {
        "k": "適用通路",
        "v": "香港 city'super 各分店"
      },
      {
        "k": "效期",
        "v": "啟用日起 24 個月"
      }
    ],
    "redeemNote": "兌換後 7 個工作天內寄送電子券,每帳戶每月限兌 2 份",
    "related": [
      "parknshop-hk500",
      "yata-hk100",
      "watsons-hk100"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "pxmart-nt100": {
    "description": "全聯福利中心遍布全台,這張 NT$100 禮物卡可在門市折抵生鮮、零食與生活用品。兌換後即時入帳,結帳時出示卡碼即可使用。",
    "specs": [
      {
        "k": "面額",
        "v": "NT$100"
      },
      {
        "k": "形式",
        "v": "電子券"
      },
      {
        "k": "適用通路",
        "v": "全台全聯福利中心門市"
      },
      {
        "k": "效期",
        "v": "發卡日起 12 個月"
      }
    ],
    "redeemNote": "兌換後即時發送至帳戶",
    "related": [
      "pxmart-nt500",
      "pxmart-nt1000",
      "carrefour-nt500"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "pxmart-nt500": {
    "description": "全聯福利中心 NT$500 禮物卡,適合一次補齊整週的生鮮與日用品。兌換後即時入帳,可分次於門市折抵至餘額用完。",
    "specs": [
      {
        "k": "面額",
        "v": "NT$500"
      },
      {
        "k": "形式",
        "v": "電子券"
      },
      {
        "k": "適用通路",
        "v": "全台全聯福利中心門市"
      },
      {
        "k": "效期",
        "v": "發卡日起 12 個月"
      }
    ],
    "redeemNote": "兌換後即時發送至帳戶",
    "related": [
      "pxmart-nt100",
      "pxmart-nt1000",
      "wellcome-tw-nt500"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "pxmart-nt1000": {
    "description": "全聯福利中心 NT$1,000 禮物卡,適合家庭月度採買或大量備貨。面額較高,兌換後需 3 個工作天發送至帳戶。",
    "specs": [
      {
        "k": "面額",
        "v": "NT$1,000"
      },
      {
        "k": "形式",
        "v": "電子券"
      },
      {
        "k": "適用通路",
        "v": "全台全聯福利中心門市"
      },
      {
        "k": "效期",
        "v": "發卡日起 18 個月"
      }
    ],
    "redeemNote": "兌換後 3 個工作天內發送至帳戶",
    "related": [
      "pxmart-nt500",
      "pxmart-nt100",
      "costco-nt1000"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "costco-nt1000": {
    "description": "好市多 Costco 禮品卡 NT$1,000,可於賣場選購大包裝食品、家電與生活用品。寄送實體卡,使用時須出示有效會員卡。",
    "specs": [
      {
        "k": "面額",
        "v": "NT$1,000"
      },
      {
        "k": "形式",
        "v": "實體卡(掛號寄送)"
      },
      {
        "k": "適用通路",
        "v": "全台好市多賣場(需會員卡)"
      },
      {
        "k": "效期",
        "v": "無使用期限"
      }
    ],
    "redeemNote": "兌換後 7 個工作天內掛號寄出實體卡,使用時需出示會員卡",
    "related": [
      "pxmart-nt1000",
      "carrefour-nt500",
      "wellcome-tw-nt500"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "watsons-hk50": {
    "description": "屈臣氏電子現金券 HK$50,可在門市選購保健、美妝與個人護理用品。兌換後即時入帳,結帳時掃碼折抵。",
    "specs": [
      {
        "k": "面額",
        "v": "HK$50"
      },
      {
        "k": "形式",
        "v": "電子券"
      },
      {
        "k": "適用通路",
        "v": "全港屈臣氏門市"
      },
      {
        "k": "效期",
        "v": "發券日起 6 個月"
      }
    ],
    "redeemNote": "兌換後即時發送至帳戶",
    "related": [
      "watsons-hk100",
      "parknshop-hk50",
      "yata-hk100"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "watsons-hk100": {
    "description": "屈臣氏電子現金券 HK$100,適合一次補齊保健品與日常護理用品。兌換後即時入帳,於全港門市掃碼即可使用。",
    "specs": [
      {
        "k": "面額",
        "v": "HK$100"
      },
      {
        "k": "形式",
        "v": "電子券"
      },
      {
        "k": "適用通路",
        "v": "全港屈臣氏門市"
      },
      {
        "k": "效期",
        "v": "發券日起 6 個月"
      }
    ],
    "redeemNote": "兌換後即時發送至帳戶",
    "related": [
      "watsons-hk50",
      "parknshop-hk100",
      "citysuper-hk500"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "wellcome-tw-nt500": {
    "description": "頂好超市禮券 NT$500,可在門市折抵生鮮、食品與生活雜貨。兌換後需 5 個工作天發送電子券至帳戶。",
    "specs": [
      {
        "k": "面額",
        "v": "NT$500"
      },
      {
        "k": "形式",
        "v": "電子券"
      },
      {
        "k": "適用通路",
        "v": "全台頂好超市門市"
      },
      {
        "k": "效期",
        "v": "發券日起 12 個月"
      }
    ],
    "redeemNote": "兌換後 5 個工作天內發送電子券",
    "related": [
      "carrefour-nt500",
      "pxmart-nt500",
      "costco-nt1000"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "carrefour-nt500": {
    "description": "家樂福禮物卡 NT$500,可於量販店與超市分店選購食品、家用與電器小物。兌換後 5 個工作天內發送電子券,於結帳時出示折抵。",
    "specs": [
      {
        "k": "面額",
        "v": "NT$500"
      },
      {
        "k": "形式",
        "v": "電子券"
      },
      {
        "k": "適用通路",
        "v": "全台家樂福量販店與超市"
      },
      {
        "k": "效期",
        "v": "發券日起 12 個月"
      }
    ],
    "redeemNote": "兌換後 5 個工作天內發送電子券",
    "related": [
      "wellcome-tw-nt500",
      "pxmart-nt500",
      "costco-nt1000"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "yata-hk100": {
    "description": "一田百貨購物禮券 HK$100,可在百貨與超市樓層選購食品、家品與服飾。兌換後 7 個工作天內寄送電子券,於門市出示使用。",
    "specs": [
      {
        "k": "面額",
        "v": "HK$100"
      },
      {
        "k": "形式",
        "v": "電子券"
      },
      {
        "k": "適用通路",
        "v": "香港一田百貨各分店"
      },
      {
        "k": "效期",
        "v": "發券日起 12 個月"
      }
    ],
    "redeemNote": "兌換後 7 個工作天內寄送電子券",
    "related": [
      "citysuper-hk500",
      "parknshop-hk100",
      "watsons-hk100"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "seven-eleven-nt100": {
    "description": "7-ELEVEN 商品卡 NT$100,可在全台門市折抵飲料、便當、零食與日用品。兌換後即時入帳,結帳時出示卡碼即可。",
    "specs": [
      {
        "k": "面額",
        "v": "NT$100"
      },
      {
        "k": "形式",
        "v": "電子券"
      },
      {
        "k": "適用通路",
        "v": "全台 7-ELEVEN 門市"
      },
      {
        "k": "效期",
        "v": "發卡日起 12 個月"
      }
    ],
    "redeemNote": "兌換後即時發送至帳戶",
    "related": [
      "seven-eleven-nt500",
      "familymart-nt100",
      "city-cafe-latte"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "seven-eleven-nt500": {
    "description": "7-ELEVEN 商品卡 NT$500,適合一次儲值多買幾趟的零食、咖啡與生活小物。兌換後即時入帳,可分次於門市折抵。",
    "specs": [
      {
        "k": "面額",
        "v": "NT$500"
      },
      {
        "k": "形式",
        "v": "電子券"
      },
      {
        "k": "適用通路",
        "v": "全台 7-ELEVEN 門市"
      },
      {
        "k": "效期",
        "v": "發卡日起 12 個月"
      }
    ],
    "redeemNote": "兌換後即時發送至帳戶",
    "related": [
      "seven-eleven-nt100",
      "familymart-nt500",
      "hilife-nt100"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "familymart-nt100": {
    "description": "全家 FamilyMart 商品卡 NT$100,可在全台門市折抵鮮食、飲品與日用品。兌換後即時入帳,結帳時出示卡碼使用。",
    "specs": [
      {
        "k": "面額",
        "v": "NT$100"
      },
      {
        "k": "形式",
        "v": "電子券"
      },
      {
        "k": "適用通路",
        "v": "全台全家 FamilyMart 門市"
      },
      {
        "k": "效期",
        "v": "發卡日起 12 個月"
      }
    ],
    "redeemNote": "兌換後即時發送至帳戶",
    "related": [
      "familymart-nt500",
      "seven-eleven-nt100",
      "lets-cafe-latte"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "familymart-nt500": {
    "description": "全家 FamilyMart 商品卡 NT$500,適合一次儲值常買的鮮食、咖啡與生活雜貨。兌換後即時入帳,可分次於門市折抵至用罄。",
    "specs": [
      {
        "k": "面額",
        "v": "NT$500"
      },
      {
        "k": "形式",
        "v": "電子券"
      },
      {
        "k": "適用通路",
        "v": "全台全家 FamilyMart 門市"
      },
      {
        "k": "效期",
        "v": "發卡日起 12 個月"
      }
    ],
    "redeemNote": "兌換後即時發送至帳戶",
    "related": [
      "familymart-nt100",
      "seven-eleven-nt500",
      "okmart-nt100"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "circlek-hk50": {
    "description": "OK 便利店現金券 HK$50,可在全港門市折抵飲品、小食與日常用品。兌換後 3 個工作天內發送電子券,於結帳時掃碼使用。",
    "specs": [
      {
        "k": "面額",
        "v": "HK$50"
      },
      {
        "k": "形式",
        "v": "電子券"
      },
      {
        "k": "適用通路",
        "v": "全港 OK 便利店"
      },
      {
        "k": "效期",
        "v": "發券日起 6 個月"
      }
    ],
    "redeemNote": "兌換後 3 個工作天內發送電子券",
    "related": [
      "seven-eleven-hk50",
      "watsons-hk50",
      "parknshop-hk50"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "seven-eleven-hk50": {
    "description": "7-ELEVEN 香港現金券 HK$50,可在全港門市折抵飲品、鮮食與生活小物。兌換後 3 個工作天內發送電子券,結帳時出示券碼。",
    "specs": [
      {
        "k": "面額",
        "v": "HK$50"
      },
      {
        "k": "形式",
        "v": "電子券"
      },
      {
        "k": "適用通路",
        "v": "全港 7-ELEVEN 門市"
      },
      {
        "k": "效期",
        "v": "發券日起 6 個月"
      }
    ],
    "redeemNote": "兌換後 3 個工作天內發送電子券",
    "related": [
      "circlek-hk50",
      "watsons-hk100",
      "parknshop-hk100"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "hilife-nt100": {
    "description": "萊爾富 Hi-Life 商品卡 NT$100,可在全台門市折抵鮮食、飲料與生活用品。兌換後即時入帳,於結帳時出示卡碼。",
    "specs": [
      {
        "k": "面額",
        "v": "NT$100"
      },
      {
        "k": "形式",
        "v": "電子券"
      },
      {
        "k": "適用通路",
        "v": "全台萊爾富 Hi-Life 門市"
      },
      {
        "k": "效期",
        "v": "發卡日起 12 個月"
      }
    ],
    "redeemNote": "兌換後即時發送至帳戶",
    "related": [
      "okmart-nt100",
      "familymart-nt100",
      "seven-eleven-nt100"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "okmart-nt100": {
    "description": "OK mart 商品卡 NT$100,可在全台門市折抵飲品、小食與日常雜貨。兌換後即時入帳,結帳時出示卡碼即可使用。",
    "specs": [
      {
        "k": "面額",
        "v": "NT$100"
      },
      {
        "k": "形式",
        "v": "電子券"
      },
      {
        "k": "適用通路",
        "v": "全台 OK mart 門市"
      },
      {
        "k": "效期",
        "v": "發卡日起 12 個月"
      }
    ],
    "redeemNote": "兌換後即時發送至帳戶",
    "related": [
      "hilife-nt100",
      "familymart-nt100",
      "seven-eleven-nt100"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "lets-cafe-latte": {
    "description": "全家 Let's Cafe 中杯拿鐵兌換券,可在全台全家門市現煮兌換一杯熱拿鐵。兌換後即時發送條碼,效期 30 天內到店出示使用。",
    "specs": [
      {
        "k": "面額",
        "v": "中杯拿鐵 1 杯"
      },
      {
        "k": "形式",
        "v": "電子券(條碼)"
      },
      {
        "k": "適用通路",
        "v": "全台全家 FamilyMart 門市"
      },
      {
        "k": "效期",
        "v": "發券日起 30 天"
      }
    ],
    "redeemNote": "兌換後即時發送條碼,效期 30 天",
    "related": [
      "city-cafe-latte",
      "familymart-nt100",
      "familymart-nt500"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "city-cafe-latte": {
    "description": "7-ELEVEN CITY CAFE 中杯拿鐵兌換券,可在全台 7-ELEVEN 門市兌換一杯現煮拿鐵。兌換後即時發送條碼,效期 30 天內到店掃碼使用。",
    "specs": [
      {
        "k": "面額",
        "v": "中杯拿鐵 1 杯"
      },
      {
        "k": "形式",
        "v": "電子券(條碼)"
      },
      {
        "k": "適用通路",
        "v": "全台 7-ELEVEN 門市"
      },
      {
        "k": "效期",
        "v": "發券日起 30 天"
      }
    ],
    "redeemNote": "兌換後即時發送條碼,效期 30 天",
    "related": [
      "lets-cafe-latte",
      "seven-eleven-nt100",
      "seven-eleven-nt500"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "asia-miles-500": {
    "description": "把累積的爆米花換成最入門的一筆亞洲萬里通里數,先讓帳戶裡有里、慢慢養成兌換機票的習慣。存入後可與其他里數合併,離下一趟旅程更近一步。",
    "specs": [
      {
        "k": "哩數",
        "v": "Asia Miles 500 里"
      },
      {
        "k": "存入方式",
        "v": "兌換後 5 個工作天內存入會員帳戶"
      },
      {
        "k": "綁定需求",
        "v": "需先綁定亞洲萬里通會員號碼"
      },
      {
        "k": "限制",
        "v": "里數有效期依亞洲萬里通會員條款計算"
      }
    ],
    "redeemNote": "兌換後 5 個工作天內存入,需綁定會員號碼",
    "related": [
      "asia-miles-1000",
      "asia-miles-5000",
      "eva-infinity-1000"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "asia-miles-1000": {
    "description": "一千里的亞洲萬里通,適合已經有里數基礎、想再往前推一段的旅人。存入後即可累積到下一個兌換門檻,讓每一次看戲都離出發更近。",
    "specs": [
      {
        "k": "哩數",
        "v": "Asia Miles 1,000 里"
      },
      {
        "k": "存入方式",
        "v": "兌換後 5 個工作天內存入會員帳戶"
      },
      {
        "k": "綁定需求",
        "v": "需先綁定亞洲萬里通會員號碼"
      },
      {
        "k": "限制",
        "v": "存入會員姓名須與本平台帳戶相符"
      }
    ],
    "redeemNote": "兌換後 5 個工作天內存入,需綁定會員號碼",
    "related": [
      "asia-miles-500",
      "asia-miles-5000",
      "china-airlines-dm-1000"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "asia-miles-5000": {
    "description": "一次存入五千里,是把長期累積的爆米花換成一段實在旅程的選擇,適合正在湊兌換機票門檻的人。每帳戶每月限兌一次,建議先確認里數使用計畫再下手。",
    "specs": [
      {
        "k": "哩數",
        "v": "Asia Miles 5,000 里"
      },
      {
        "k": "存入方式",
        "v": "兌換後 5 個工作天內存入會員帳戶"
      },
      {
        "k": "綁定需求",
        "v": "需先綁定亞洲萬里通會員號碼"
      },
      {
        "k": "限制",
        "v": "每帳戶每月限兌 1 次"
      }
    ],
    "redeemNote": "兌換後 5 個工作天內存入,每帳戶每月限兌 1 次",
    "related": [
      "asia-miles-1000",
      "asia-miles-500",
      "eva-infinity-5000"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "eva-infinity-1000": {
    "description": "長榮航空 Infinity MileageLands 一千哩,適合習慣搭長榮、想把哩程一點一滴累積起來的旅人。存入哩程帳戶後即可併入既有里數,慢慢攢出一張回家的機票。",
    "specs": [
      {
        "k": "哩數",
        "v": "Infinity MileageLands 1,000 哩"
      },
      {
        "k": "存入方式",
        "v": "兌換後 7 個工作天內存入哩程帳戶"
      },
      {
        "k": "綁定需求",
        "v": "需提供長榮航空會員編號"
      },
      {
        "k": "限制",
        "v": "哩程效期依長榮航空會員規章計算"
      }
    ],
    "redeemNote": "兌換後 7 個工作天內存入哩程帳戶",
    "related": [
      "eva-infinity-5000",
      "china-airlines-dm-1000",
      "starlux-cosmile-1000"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "eva-infinity-5000": {
    "description": "一次入帳五千哩的長榮 Infinity MileageLands,把長期累積的爆米花轉成一段實在的飛行距離。每帳戶每月限兌一次,適合正在湊機票或升等門檻的旅人。",
    "specs": [
      {
        "k": "哩數",
        "v": "Infinity MileageLands 5,000 哩"
      },
      {
        "k": "存入方式",
        "v": "兌換後 7 個工作天內存入哩程帳戶"
      },
      {
        "k": "綁定需求",
        "v": "需提供長榮航空會員編號"
      },
      {
        "k": "限制",
        "v": "每帳戶每月限兌 1 次"
      }
    ],
    "redeemNote": "兌換後 7 個工作天內存入,每帳戶每月限兌 1 次",
    "related": [
      "eva-infinity-1000",
      "china-airlines-dm-5000",
      "starlux-cosmile-5000"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "china-airlines-dm-1000": {
    "description": "中華航空華夏哩程一千哩,適合常搭華航、想穩穩累積里數的旅人。存入哩程帳戶後即可併入既有哩數,離下一段旅程更近。",
    "specs": [
      {
        "k": "哩數",
        "v": "華夏哩程 1,000 哩"
      },
      {
        "k": "存入方式",
        "v": "兌換後 7 個工作天內存入哩程帳戶"
      },
      {
        "k": "綁定需求",
        "v": "需提供華航會員卡號"
      },
      {
        "k": "限制",
        "v": "哩程效期依華夏會員規章計算"
      }
    ],
    "redeemNote": "兌換後 7 個工作天內存入哩程帳戶",
    "related": [
      "china-airlines-dm-5000",
      "eva-infinity-1000",
      "starlux-cosmile-1000"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "china-airlines-dm-5000": {
    "description": "一次存入五千哩的華夏哩程,把長期累積的爆米花換成一段實在的飛行。每帳戶每月限兌一次,適合正在湊兌換機票門檻的華航常客。",
    "specs": [
      {
        "k": "哩數",
        "v": "華夏哩程 5,000 哩"
      },
      {
        "k": "存入方式",
        "v": "兌換後 7 個工作天內存入哩程帳戶"
      },
      {
        "k": "綁定需求",
        "v": "需提供華航會員卡號"
      },
      {
        "k": "限制",
        "v": "每帳戶每月限兌 1 次"
      }
    ],
    "redeemNote": "兌換後 7 個工作天內存入,每帳戶每月限兌 1 次",
    "related": [
      "china-airlines-dm-1000",
      "eva-infinity-5000",
      "starlux-cosmile-5000"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "starlux-cosmile-1000": {
    "description": "星宇航空 COSMILE 一千哩,適合鍾情星宇旅程體驗、想慢慢累積里數的旅人。存入會員帳戶後即可併入既有哩數,陪你攢出下一趟出發。",
    "specs": [
      {
        "k": "哩數",
        "v": "COSMILE 1,000 哩"
      },
      {
        "k": "存入方式",
        "v": "兌換後 7 個工作天內存入會員帳戶"
      },
      {
        "k": "綁定需求",
        "v": "需提供 COSMILE 會員編號"
      },
      {
        "k": "限制",
        "v": "哩程效期依星宇 COSMILE 會員條款計算"
      }
    ],
    "redeemNote": "兌換後 7 個工作天內存入,需提供會員編號",
    "related": [
      "starlux-cosmile-5000",
      "eva-infinity-1000",
      "china-airlines-dm-1000"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "starlux-cosmile-5000": {
    "description": "一次入帳五千哩的星宇 COSMILE,把長期累積的爆米花換成一段嚮往已久的旅程。每帳戶每月限兌一次,適合正在湊兌換機票或升等門檻的星宇旅人。",
    "specs": [
      {
        "k": "哩數",
        "v": "COSMILE 5,000 哩"
      },
      {
        "k": "存入方式",
        "v": "兌換後 7 個工作天內存入會員帳戶"
      },
      {
        "k": "綁定需求",
        "v": "需提供 COSMILE 會員編號"
      },
      {
        "k": "限制",
        "v": "每帳戶每月限兌 1 次"
      }
    ],
    "redeemNote": "兌換後 7 個工作天內存入,每帳戶每月限兌 1 次",
    "related": [
      "starlux-cosmile-1000",
      "eva-infinity-5000",
      "china-airlines-dm-5000"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "line-points-100": {
    "description": "把零碎的爆米花換成 LINE POINTS 一百點,序號即時發送、想用就用,適合日常生活裡隨手折抵的小確幸。可在合作通路與 LINE 服務折抵消費,點數不浪費。",
    "specs": [
      {
        "k": "點數",
        "v": "LINE POINTS 100 點"
      },
      {
        "k": "存入方式",
        "v": "兌換後即時發送序號至帳戶"
      },
      {
        "k": "綁定需求",
        "v": "輸入序號後自動存入 LINE 帳戶"
      },
      {
        "k": "限制",
        "v": "序號限本人使用,逾期未輸入恕不補發"
      }
    ],
    "redeemNote": "兌換後即時發送序號至帳戶",
    "related": [
      "openpoint-1000",
      "yuu-points-1000",
      "asia-miles-500"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "openpoint-1000": {
    "description": "OPENPOINT 一千點,兌換後即時存入帳戶,適合常逛 7-ELEVEN 與 OPEN POINT 生態圈的人隨手折抵。點數可累積、可即時使用,讓日常消費多一份回饋。",
    "specs": [
      {
        "k": "點數",
        "v": "OPENPOINT 1,000 點"
      },
      {
        "k": "存入方式",
        "v": "兌換後即時存入 OPENPOINT 帳戶"
      },
      {
        "k": "綁定需求",
        "v": "需綁定 OPENPOINT 會員帳號"
      },
      {
        "k": "限制",
        "v": "存入帳號須與本人會員資料相符"
      }
    ],
    "redeemNote": "兌換後即時存入 OPENPOINT 帳戶",
    "related": [
      "line-points-100",
      "yuu-points-1000",
      "asia-miles-1000"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  },
  "yuu-points-1000": {
    "description": "yuu 積分一千分,兌換後即時入帳,適合慣用 yuu 跨通路消費、想把點數攢起來折抵的人。門檻低、入帳快,讓零散的爆米花也能立刻派上用場。",
    "specs": [
      {
        "k": "點數",
        "v": "yuu 積分 1,000 分"
      },
      {
        "k": "存入方式",
        "v": "兌換後即時存入 yuu 帳戶"
      },
      {
        "k": "綁定需求",
        "v": "需綁定 yuu 會員帳號"
      },
      {
        "k": "限制",
        "v": "積分效期依 yuu 會員條款計算"
      }
    ],
    "redeemNote": "兌換後即時存入 yuu 帳戶",
    "related": [
      "openpoint-1000",
      "line-points-100",
      "asia-miles-500"
    ],
    "shipping": "以爆米花點數兌換；依商品說明於指定時間發送至帳戶或寄出，無一般運費。",
    "returns": "本商品以爆米花點數兌換，點數扣除後恕不退點。"
  }
};
