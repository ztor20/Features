/* Ztor Shop — 活動 (ticketed events) mock data
   cats: 演唱會 | 粉絲見面會 | 線上演唱會 | 其他活動 | 拍賣入場券 */
window.ZTOR_SHOP = window.ZTOR_SHOP || {};
ZTOR_SHOP.shopEvents = [
  { id: "ev-score-live", name: "經典港片配樂交響音樂會", cat: "演唱會", date: "2026-11-21", venue: "台北流行音樂中心", ntd: 1800, hkd: 450, badge: null, soldOut: false },
  { id: "ev-themesong-night", name: "電影主題曲之夜：金曲原唱現場", cat: "演唱會", date: "2026-09-19", venue: "台北小巨蛋", ntd: 2400, hkd: 600, badge: "新品", soldOut: false },
  { id: "ev-soundtrack-unplugged", name: "片尾曲不插電音樂會", cat: "演唱會", date: "2026-10-24", venue: "Legacy Taipei", ntd: 1200, hkd: null, badge: null, soldOut: false },
  { id: "ev-fanmeet-trilogy", name: "《台灣三部曲》劇組粉絲見面會", cat: "粉絲見面會", date: "2026-08-22", venue: "華山文創園區", ntd: 880, hkd: null, badge: "限量", soldOut: false },
  { id: "ev-fanmeet-director", name: "導演面對面：映後深度 Q&A", cat: "粉絲見面會", date: "2026-09-05", venue: "光點台北", ntd: 520, hkd: null, badge: null, soldOut: false },
  { id: "ev-fanmeet-hk", name: "港星見面會：經典角色重聚場", cat: "粉絲見面會", date: "2026-10-10", venue: "香港會議展覽中心", ntd: 1600, hkd: 400, badge: null, soldOut: true },
  { id: "ev-online-concert", name: "線上演唱會：片場直播特別場", cat: "線上演唱會", date: "2026-08-30", venue: "Ztor. 線上直播", ntd: 380, hkd: 95, badge: null, soldOut: false },
  { id: "ev-online-premiere-live", name: "線上首映 + 主創即時連線", cat: "線上演唱會", date: "2026-09-26", venue: "Ztor. 線上直播", ntd: 250, hkd: 65, badge: "新品", soldOut: false },
  { id: "ev-premiere-trilogy", name: "《台灣三部曲》首部曲 世界首映禮", cat: "其他活動", date: "2026-08-14", venue: "台北國際會議中心", ntd: 2800, hkd: null, badge: "限量", soldOut: false },
  { id: "ev-midnight-hk-double", name: "港片午夜場雙片連映：英雄本色＋倩女幽魂", cat: "其他活動", date: "2026-07-25", venue: "Ztor. 放映廳（信義）", ntd: 680, hkd: null, badge: null, soldOut: false },
  { id: "ev-fan-screening-rose", name: "《玫瑰母親》影迷包場 + 映後座談", cat: "其他活動", date: "2026-07-18", venue: "光點華山", ntd: 520, hkd: null, badge: null, soldOut: true },
  { id: "ev-doc-workshop", name: "紀錄片創作工作坊（兩日）", cat: "其他活動", date: "2026-09-26", venue: "Ztor. 創作基地", ntd: 3200, hkd: null, badge: null, soldOut: false },
  { id: "ev-open-air", name: "戶外星空放映夜：台語經典修復場", cat: "其他活動", date: "2026-08-29", venue: "華中露營場", ntd: 380, hkd: null, badge: null, soldOut: false },
  { id: "ev-foley-tour", name: "擬音棚導覽 + 親手做音效體驗", cat: "其他活動", date: "2026-09-12", venue: "Ztor. 後期中心", ntd: 980, hkd: null, badge: "新品", soldOut: false },
  { id: "ev-costume-exhibit", name: "戲服與道具特展 早鳥票", cat: "其他活動", date: "2026-12-05", venue: "松山文創園區", ntd: 320, hkd: 80, badge: null, soldOut: false },
  { id: "ev-pitch-night", name: "共創提案之夜：與監製面對面", cat: "其他活動", date: "2026-10-17", venue: "Ztor. 創作基地", ntd: 0, hkd: null, badge: "限量", soldOut: false }
];
