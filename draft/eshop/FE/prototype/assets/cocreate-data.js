/* ────────────────────────────────────────────
   Ztor 2.0 — Co-create mock data layer (cocreate-data.js)
   ------------------------------------------------------------
   Sets window.ZTOR_COCREATE (idempotent namespace, mirrors ZTOR_SHOP).
   ONE source of truth for BOTH the list page (cocreate.html) and the
   per-project inner page (cocreate-project.html?id=<id>). Front-end MOCK
   only — no real money, auth, or persistence (see HANDOFF.md). Compliance:
   reward-only (共創) — reward credits / merch / early access only; see
   HANDOFF.md ban-list for forbidden returns-wording.

   PROJECT SHAPE:
     id, title, origTitle, status, poster, langForm, genres[], summary,
     about, planDesc, currency, raised, goal, backers, daysLeft,
     startNote?, releaseNote?, finalPct?,
     packages[ {id,name,price,perks[],slots:{total,left},popular,note} ],
     budget[ {label,pct} ], team[ {name,role,href} ], stills[ url ]

   status ∈ soon | funding | full | charging | producing | released | ended | cancelled
   ──────────────────────────────────────────── */
window.ZTOR_COCREATE = window.ZTOR_COCREATE || {};

ZTOR_COCREATE.projects = [
  /* ── 1 · UPCOMING ─────────────────────────────────────────────────────── */
  {
    id: 'elevator-14f',
    title: '電梯按了 14 樓',
    origTitle: 'Floor 14',
    status: 'soon',
    poster: 'assets/images/projects/elevator-14f-card.webp',
    langForm: '粵語 · 驚悚短片 · 約 45 分鐘',
    genres: ['驚悚', '懸疑', '港產片'],
    summary: '大樓管理員交班時叮嚀：午夜過後，電梯停在哪裡都不要出去。尤其是 14 樓。',
    about: '一棟沒有 13 樓的舊式大廈，14 樓其實是第 13 層。管理員、夜更保安與一名剛搬進來的女子，在一個停電的夜裡先後按下了那個按鈕。',
    planDesc: '本計畫即將開放共創。開放後達成目標金額即正式開拍；卡片僅作驗證、達標才收款，未達標全額不扣。',
    currency: 'USD', raised: 0, goal: 8000, backers: 0, daysLeft: 0,
    opensInDays: 7,
    startNote: '將於 2026 年 7 月 1 日開始共創',
    budget: [
      { label: '製作費（拍攝、劇組、場景）', pct: 58 },
      { label: '後期與特效（剪接、調光、混音）', pct: 27 },
      { label: '宣傳與發行（上線推廣）', pct: 15 }
    ],
    team: [
      { name: '陳麗珊', role: '導演', href: '#' },
      { name: '李偉文', role: '編劇', href: '#' }
    ]
  },

  /* ── 2 · FUNDING LIVE — fully-fleshed reference project ───────────────── */
  {
    id: 'vulgaria-side-story',
    title: '低俗喜劇之嗨仔番外篇',
    origTitle: 'Vulgaria: Hai-Jai Side Story',
    status: 'funding',
    poster: 'assets/images/projects/vulgaria-luozai-card.webp',
    langForm: '粵語 · 劇情長片 · 約 105 分鐘',
    genres: ['喜劇', '犯罪', '港產片'],
    summary: '原班人馬回歸，一場為了拍出「最低俗喜劇」的荒誕集資之旅，笑爆院線。',
    about: '監製杜風一心想重啟系列，卻發現開戲的錢比劇本還難寫。他找回當年的嗨仔、流氓大佬與一頭傳說中的騾仔，決定用一部電影講一個關於「如何把一部電影拍出來」的故事。鏡頭內外互相映照，黑色幽默之下，是一群人對港產喜劇最後的浪漫。',
    planDesc: '本片以共創方式啟動：在募資期間達成目標金額，劇組即正式開拍。所有支持都屬於「共創回饋」——你獲得的是觀影權、限量周邊、片尾鳴謝與出品人署名等共創身分。卡片僅作驗證、達標才收款；未達標則全額不扣。',
    currency: 'USD', raised: 6240, goal: 10000, backers: 1204, daysLeft: 18,
    packages: [
      { id: 'p-entry', name: '入場應援', price: 380, perks: ['電影上線後正片數位觀看權', '限定數位海報（高解析下載）', '專屬幕後製作花絮'], slots: { total: 600, left: 312 }, popular: false },
      { id: 'p-partner', name: '共創夥伴', price: 880, perks: ['以上入場應援全部回饋', '限量電影周邊（帆布袋＋琺瑯別針）', '片尾「共創夥伴」鳴謝名單', '線上首映場觀禮邀請'], slots: { total: 250, left: 58 }, popular: true },
      { id: 'p-producer', name: '出品應援', price: 2880, perks: ['以上共創夥伴全部回饋', '片尾「出品人」署名', '劇組簽名實體場記板', '探班見面會名額（限量）'], slots: { total: 40, left: 7 }, popular: false },
      { id: 'p-collector', name: '典藏出品', price: 6800, perks: ['以上出品應援全部回饋', '導演親簽分鏡原稿一式', '殺青酒會雙人席位'], slots: { total: 12, left: 0 }, popular: false, note: '本級距名額已滿，可加入候補' }
    ],
    budget: [
      { label: '製作費（拍攝、劇組、場景）', pct: 55 },
      { label: '後期與特效（剪接、調光、混音）', pct: 28 },
      { label: '宣傳與發行（上線推廣）', pct: 17 }
    ],
    team: [
      { name: '杜可風', role: '導演', href: '#' },
      { name: '陳果', role: '監製', href: '#' },
      { name: '彭浩翔', role: '編劇', href: '#' },
      { name: '鄭中基', role: '主演', href: '#' }
    ],
    stills: [
      'https://picsum.photos/seed/vulgaria-still-1/960/540',
      'https://picsum.photos/seed/vulgaria-still-2/960/540',
      'https://picsum.photos/seed/vulgaria-still-3/960/540',
      'https://picsum.photos/seed/vulgaria-still-4/960/540',
      'https://picsum.photos/seed/vulgaria-still-5/960/540'
    ]
  },

  /* ── 2b · WAITLIST — every reward tier sold out → derives the 候補登記 CTA ── */
  {
    id: 'last-tram-shaukeiwan',
    title: '尾班電車到筲箕灣',
    origTitle: 'Last Tram to Shau Kei Wan',
    status: 'funding',
    poster: 'https://picsum.photos/seed/last-tram-hk/1056/594',
    langForm: '粵語 · 劇情 · 約 95 分鐘',
    genres: ['劇情', '犯罪', '港產片'],
    summary: '一座城市的最後一夜，全部回饋名額皆已額滿。加入候補，等一個位置。',
    about: '叮叮車駛過的最後一夜，車長、夜歸人與一個不肯下車的老人，在總站之前各自完成一段未說完的告別。',
    planDesc: '本片以共創方式啟動。目前各回饋方案名額皆已額滿；你可加入候補，若有支持者未完成付款而釋出名額，我們會依序邀請你補位。卡片僅驗證、達標才扣款，未達標全額不扣。',
    currency: 'USD', raised: 10000, goal: 10000, backers: 2400, daysLeft: 3,
    packages: [
      { id: 'lt-entry', name: '入場應援', price: 380, perks: ['電影上線後正片數位觀看權', '限定數位海報（高解析下載）', '專屬幕後製作花絮'], slots: { total: 500, left: 0 }, popular: false, note: '已額滿' },
      { id: 'lt-partner', name: '共創夥伴', price: 880, perks: ['以上入場應援全部回饋', '限量電影周邊（帆布袋＋琺瑯別針）', '片尾「共創夥伴」鳴謝名單', '線上首映場觀禮邀請'], slots: { total: 200, left: 0 }, popular: true, note: '已額滿' },
      { id: 'lt-producer', name: '出品應援', price: 2880, perks: ['以上共創夥伴全部回饋', '片尾「出品人」署名', '劇組簽名實體場記板', '探班見面會名額（限量）'], slots: { total: 30, left: 0 }, popular: false, note: '已額滿' }
    ],
    budget: [
      { label: '製作費（拍攝、劇組、場景）', pct: 56 },
      { label: '後期與特效（剪接、調光、混音）', pct: 28 },
      { label: '宣傳與發行（上線推廣）', pct: 16 }
    ],
    team: [
      { name: '邱禮濤', role: '導演', href: '#' },
      { name: '古天樂', role: '主演', href: '#' }
    ],
    stills: [
      'https://picsum.photos/seed/tram-still-1/960/540',
      'https://picsum.photos/seed/tram-still-2/960/540',
      'https://picsum.photos/seed/tram-still-3/960/540'
    ]
  },

  /* ── 3 · GOAL REACHED — charging ──────────────────────────────────────── */
  {
    id: 'mong-kok-shootout',
    title: '旺角狙擊',
    origTitle: 'Mong Kok Shootout',
    status: 'charging',
    poster: 'assets/images/projects/mong-kok-shootout-card.webp',
    langForm: '粵語 · 犯罪動作 · 約 110 分鐘',
    genres: ['犯罪', '動作', '港產片'],
    summary: '一場 24 小時內必須結案的綁架案，菜鳥談判專家對上失蹤十年的師父。',
    about: '霓虹未熄的旺角，一通電話把退役談判專家拉回現場。綁匪要的不是錢，是一場十年前未完的對話。倒數 24 小時，師徒在電話兩端各自賭上一切。',
    planDesc: '本片已達成共創目標，正進行收款。完成付款驗證的支持者將獲得對應的共創回饋；卡片於達標時收款，先前僅作驗證。',
    currency: 'USD', raised: 10000, goal: 10000, backers: 2860, daysLeft: 0, cureInHours: 48,
    packages: [
      { id: 'm-entry', name: '入場應援', price: 420, perks: ['電影上線後正片數位觀看權', '限定數位海報', '幕後製作花絮'], slots: { total: 800, left: 0 }, popular: false, note: '已額滿' },
      { id: 'm-partner', name: '共創夥伴', price: 980, perks: ['以上入場應援全部回饋', '限量電影周邊', '片尾鳴謝名單'], slots: { total: 300, left: 0 }, popular: true, note: '已額滿' }
    ],
    budget: [
      { label: '製作費（拍攝、劇組、場景）', pct: 52 },
      { label: '後期與特效（動作、調光、混音）', pct: 31 },
      { label: '宣傳與發行（上線推廣）', pct: 17 }
    ],
    team: [
      { name: '林超賢', role: '導演', href: '#' },
      { name: '爾冬陞', role: '監製', href: '#' },
      { name: '張家輝', role: '主演', href: '#' }
    ],
    stills: [
      'https://picsum.photos/seed/mongkok-still-1/960/540',
      'https://picsum.photos/seed/mongkok-still-2/960/540',
      'https://picsum.photos/seed/mongkok-still-3/960/540'
    ]
  },

  /* ── 4 · FUNDED → in production ───────────────────────────────────────── */
  {
    id: 'f-i-am-speed',
    title: '我要衝鋒',
    origTitle: 'F: I Am Speed',
    status: 'producing',
    poster: 'assets/images/projects/f-i-am-speed-card.webp',
    langForm: '國語 · 熱血賽車 · 約 120 分鐘',
    genres: ['熱血', '運動', '改編漫畫'],
    summary: '改編自六田登經典漫畫，農村青年憑勇氣闖入賽車世界。',
    about: '沒有車、沒有錢、沒有人看好。只有一雙看得見風的眼睛，和一台借來的舊車。他要在最不被祝福的起跑線上，跑出屬於自己的那一圈。',
    planDesc: '本片已完成共創募資，現正進入製作階段。共創夥伴可於此追蹤製作進度與幕後花絮；上線後將以對應回饋通知所有支持者。',
    currency: 'USD', raised: 10000, goal: 10000, backers: 3120, daysLeft: 0,
    releaseNote: '預計於 2026 年第 3 季上映',
    updates: [
      { date: '2026-03', by: '創作團隊', title: '劇本定稿', body: '第三稿完成，主要角色與賽車場景設定確定。', state: 'done' },
      { date: '2026-04', by: '平台', title: '共創達標', body: '感謝 3,120 位共創夥伴，募資目標達成，正式進入製作。', state: 'done' },
      { date: '2026-05', by: '創作團隊', title: '開鏡・主體拍攝', body: '台中麗寶賽車場封閉實拍兩週，賽車鏡頭順利完成。', state: 'current' },
      { date: '2026-07', by: '創作團隊', title: '後期與特效', body: '剪接、調光與賽車特效合成進行中。', state: 'upcoming' },
      { date: '2026 Q3', by: '平台', title: '上線首映', body: '共創夥伴將收到專屬首映通知與正片觀影權。', state: 'upcoming' }
    ],
    budget: [
      { label: '製作費（拍攝、賽車、場地）', pct: 60 },
      { label: '後期與特效（剪接、調光、混音）', pct: 26 },
      { label: '宣傳與發行（上線推廣）', pct: 14 }
    ],
    team: [
      { name: '林書宇', role: '導演', href: '#' },
      { name: '葉如芬', role: '監製', href: '#' },
      { name: '劉冠廷', role: '主演', href: '#' }
    ],
    stills: [
      'https://picsum.photos/seed/speed-still-1/960/540',
      'https://picsum.photos/seed/speed-still-2/960/540',
      'https://picsum.photos/seed/speed-still-3/960/540'
    ]
  },

  /* ── 5 · in production ────────────────────────────────────────────────── */
  {
    id: 'pirate-queen-zheng-yi-sao',
    title: '海上霸姬鄭一嫂',
    origTitle: 'Pirate Queen: Zheng Yi Sao',
    status: 'producing',
    poster: 'assets/images/projects/pirate-queen-zheng-yi-sao-card.webp',
    langForm: '粵語 · 史詩傳記 · 約 135 分鐘',
    genres: ['史詩', '傳記', '海戰'],
    summary: '清朝真實女海盜傳奇，從舞女到統領七萬眾的海上霸主。',
    about: '她從珠江口的一條花船起步，在男人主宰的海面上立下自己的規矩。當朝廷與列強的艦隊同時壓境，她要決定的不是如何贏，而是如何全身而退。',
    planDesc: '本片已完成共創募資，現正進入製作階段。共創夥伴可於此追蹤製作進度；上線後將以對應回饋通知所有支持者。',
    currency: 'USD', raised: 15000, goal: 15000, backers: 4180, daysLeft: 0,
    releaseNote: '預計於 2026 年第 4 季上映',
    updates: [
      { date: '2026-02', by: '創作團隊', title: '前期籌備', body: '海戰場景設計、美術與選角完成。', state: 'done' },
      { date: '2026-04', by: '平台', title: '共創達標', body: '4,180 位共創夥伴促成本片，正式進入製作。', state: 'done' },
      { date: '2026-06', by: '創作團隊', title: '主體拍攝中', body: '澳門外景與橫店海戰棚同步搭建拍攝。', state: 'current' },
      { date: '2026-09', by: '創作團隊', title: 'VFX 與後期', body: '大型海戰特效合成、調光與混音。', state: 'upcoming' },
      { date: '2026 Q4', by: '平台', title: '上線首映', body: '共創夥伴優先觀影，並收到專屬鳴謝。', state: 'upcoming' }
    ],
    budget: [
      { label: '製作費（拍攝、海戰、場景）', pct: 62 },
      { label: '後期與特效（VFX、調光、混音）', pct: 26 },
      { label: '宣傳與發行（上線推廣）', pct: 12 }
    ],
    team: [
      { name: '許鞍華', role: '導演', href: '#' },
      { name: '施南生', role: '監製', href: '#' },
      { name: '周迅', role: '主演', href: '#' }
    ],
    stills: [
      'https://picsum.photos/seed/pirate-still-1/960/540',
      'https://picsum.photos/seed/pirate-still-2/960/540',
      'https://picsum.photos/seed/pirate-still-3/960/540'
    ]
  },

  /* ── 6 · RELEASED ─────────────────────────────────────────────────────── */
  {
    id: 'dragon-tiger-gate-kowloon-night',
    title: '龍虎門外傳：九龍夜行',
    origTitle: 'Dragon Tiger Gate: Kowloon Night',
    status: 'released',
    poster: 'assets/images/projects/dragon-tiger-gate-kowloon-night-card.webp',
    langForm: '粵語 · 武打動作 · 約 100 分鐘',
    genres: ['武打', '動作', '改編漫畫'],
    summary: '經典武打 IP 新章，霓虹巷弄裡的江湖再起。',
    about: '老牌武館的招牌蒙塵，新一代卻在九龍的後巷裡接住了那塊匾。一場本不該發生的夜戰，讓江湖記起了自己的樣子。',
    planDesc: '本片由共創夥伴一同促成，現已上架。當初支持的共創回饋已陸續發送；感謝每一位讓這個故事誕生的人。',
    currency: 'USD', raised: 12000, goal: 12000, backers: 3540, daysLeft: 0,
    team: [
      { name: '葉偉信', role: '導演', href: '#' },
      { name: '黃百鳴', role: '監製', href: '#' },
      { name: '謝霆鋒', role: '主演', href: '#' }
    ],
    stills: [
      'https://picsum.photos/seed/dragon-still-1/960/540',
      'https://picsum.photos/seed/dragon-still-2/960/540',
      'https://picsum.photos/seed/dragon-still-3/960/540'
    ]
  },

  /* ── 7 · ENDED — not funded ───────────────────────────────────────────── */
  {
    id: 'temple-street-saga',
    title: '廟街風雲',
    origTitle: 'Temple Street Saga',
    status: 'ended',
    poster: 'https://picsum.photos/seed/miujie-fungwan/1056/594',
    langForm: '粵語 · 劇情 · 約 100 分鐘',
    genres: ['劇情', '市井', '港產片'],
    summary: '老街市井裡的恩怨情仇，一場未竟的江湖夢。',
    about: '大牌檔的煙火、算命攤的籤詩、夜市的霓虹——廟街的每個角落都藏著一個沒講完的故事。這一次，故事沒能等到開拍的那天。',
    planDesc: '本計畫未在期限內達成共創目標，已結束。依共創規則，所有支持皆未收款，卡片僅曾作驗證。感謝每一位曾經相信這個故事的人。',
    currency: 'USD', raised: 5000, goal: 10000, backers: 640, daysLeft: 0,
    finalPct: 50,
    team: [
      { name: '邱禮濤', role: '導演', href: '#' },
      { name: '古天樂', role: '主演', href: '#' }
    ]
  },

  /* ── 8 · CANCELLED ────────────────────────────────────────────────────── */
  {
    id: 'kowloon-bingsutt',
    title: '九龍冰室',
    origTitle: 'Kowloon Café',
    status: 'cancelled',
    poster: 'https://picsum.photos/seed/kowloon-bingsutt/1056/594',
    langForm: '粵語 · 劇情 · 約 95 分鐘',
    genres: ['劇情', '人情', '港產片'],
    summary: '茶餐廳裡的人情百態，因故未能繼續製作。',
    about: '一間開了四十年的冰室，三代人的故事在卡座之間流轉。計畫雖已達標，卻因不可抗力的因素未能繼續製作。',
    planDesc: '本計畫已取消。依共創規則，所有支持皆已全額退回或未曾收款。我們對未能完成這個故事深感抱歉。',
    currency: 'USD', raised: 10000, goal: 10000, backers: 2210, daysLeft: 0,
    finalPct: 100,
    team: [
      { name: '黃修平', role: '導演', href: '#' }
    ]
  },

  /* ── 9 · MUSIC CO-CREATE (mediaType song → audio-demo preview) ─────────── */
  {
    id: 'neon-harbour-score',
    title: '霓虹港都・電影原聲',
    origTitle: 'Neon Harbour — Original Score',
    status: 'funding',
    mediaType: 'song',
    poster: 'https://picsum.photos/seed/neon-harbour/1056/594',
    langForm: '器樂 · 電影原聲帶 · 共 12 軌',
    genres: ['原聲帶', '管弦', '爵士'],
    summary: '為港產犯罪片打造的爵士管弦原聲，邀你一起讓配樂誕生。',
    about: '作曲家以銅管與弦樂編織霓虹夜色，把港都的雨與光寫進旋律。共 12 軌，從追逐到離別，一張完整的城市夜曲。',
    planDesc: '達標後正式進錄音室與母帶。所有支持皆為共創回饋（數位專輯、黑膠、內頁鳴謝）；卡片僅驗證，達標才扣款，未達標全額不扣。',
    currency: 'USD', raised: 3200, goal: 6000, backers: 540, daysLeft: 21,
    preview: { track: '主題曲・霓虹港都（Demo）', cover: 'https://picsum.photos/seed/neon-harbour/600/600', demo: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    packages: [
      { id: 's-digital', name: '數位專輯', price: 120, perks: ['完整數位原聲帶下載', '限定數位封面', '幕後錄音花絮'], slots: { total: 1000, left: 640 }, popular: false },
      { id: 's-vinyl', name: '黑膠典藏', price: 680, perks: ['以上數位專輯全部回饋', '限量黑膠唱片', '內頁鳴謝署名'], slots: { total: 300, left: 88 }, popular: true }
    ],
    budget: [
      { label: '錄音與樂手', pct: 54 },
      { label: '混音與母帶', pct: 30 },
      { label: '製作與發行', pct: 16 }
    ],
    team: [
      { name: '黃英華', role: '作曲', href: '#' },
      { name: '金培達', role: '編曲', href: '#' }
    ],
    stills: ['https://picsum.photos/seed/neon-1/960/540', 'https://picsum.photos/seed/neon-2/960/540']
  },

  /* ── 10 · CONCERT CO-CREATE (mediaType concert → info + gallery preview) ── */
  {
    id: 'star-night-film-concert',
    title: '星夜電影音樂會',
    origTitle: 'A Night at the Movies — Live',
    status: 'funding',
    mediaType: 'concert',
    poster: 'https://picsum.photos/seed/film-concert/1056/594',
    langForm: '現場演出 · 約 90 分鐘 · 台北流行音樂中心',
    genres: ['音樂會', '現場', '電影音樂'],
    summary: '70 人編制管弦，現場重演經典港片配樂。共創這場演出，與你一起點亮舞台。',
    about: '從《英雄本色》到《重慶森林》，一夜聽遍港片的旋律記憶，搭配大銀幕同步影像。一場為影迷而生的現場。',
    planDesc: '達標後確認場地與檔期。所有支持皆為共創回饋（門票、週邊、後台導覽）；卡片僅驗證，達標才扣款，未達標全額不扣。',
    currency: 'USD', raised: 8800, goal: 12000, backers: 1320, daysLeft: 9,
    preview: { info: '2026 年 11 月 · 台北流行音樂中心 · 70 人管弦編制 · 含安可曲。以下為場地與彩排示意照。', photos: ['https://picsum.photos/seed/concert-1/960/540', 'https://picsum.photos/seed/concert-2/960/540', 'https://picsum.photos/seed/concert-3/960/540', 'https://picsum.photos/seed/concert-4/960/540'] },
    packages: [
      { id: 'c-ga', name: '入場票', price: 80, perks: ['音樂會入場一名', '數位節目單'], slots: { total: 1500, left: 430 }, popular: false },
      { id: 'c-vip', name: 'VIP 應援', price: 280, perks: ['前排 VIP 座席', '限量演出海報', '後台導覽名額'], slots: { total: 200, left: 25 }, popular: true }
    ],
    budget: [
      { label: '樂團與排練', pct: 48 },
      { label: '場地與技術', pct: 34 },
      { label: '宣傳與製作', pct: 18 }
    ],
    team: [
      { name: '胡瀞云', role: '指揮', href: '#' },
      { name: 'Ztor Live', role: '主辦', href: '#' }
    ],
    stills: ['https://picsum.photos/seed/concert-1/960/540', 'https://picsum.photos/seed/concert-2/960/540', 'https://picsum.photos/seed/concert-3/960/540']
  }
];

/* ── Current user's relationship to projects (MOCK; backend = per-user state).
   Keyed by project id → action state (see RIBBONS in cocreate-render.js).
   Drives the per-card ribbon + sorts acted-on projects to the top when logged
   in. Real source: the signed-in user's pledges / reminders / waitlist rows. */
ZTOR_COCREATE.userActions = {
  'mong-kok-shootout': 'needs-payment',          // pledged, goal hit, must pay (48h)
  'star-night-film-concert': 'pledged',          // pledged, awaiting goal
  'dragon-tiger-gate-kowloon-night': 'backed',   // backed; now watchable
  'elevator-14f': 'reminded',                    // reminder set for opening
  'f-i-am-speed': 'following'                     // following production updates
};
