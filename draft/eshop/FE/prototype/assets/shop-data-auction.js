/* Ztor Shop — 拍賣 (auctions) mock data
   cats: 入場券 | 收藏珍品
   bid = 目前出價 NTD, bids = 出價次數, ends = 截止日 */
window.ZTOR_SHOP = window.ZTOR_SHOP || {};
ZTOR_SHOP.auctions = [
  { id: "au-redcarpet", name: "秋季首映禮紅毯雙人席", cat: "入場券", bid: 14500, bids: 23, ends: "2026-10-25", badge: "限量", soldOut: false },
  { id: "au-masterclass", name: "王家衛大師班單席", cat: "入場券", bid: 31000, bids: 41, ends: "2026-08-28", badge: "限量", soldOut: false },
  { id: "au-setvisit", name: "《台灣三部曲》劇組探班一日", cat: "入場券", bid: 9200, bids: 17, ends: "2026-09-20", badge: null, soldOut: false },
  { id: "au-premiere-seat-row1", name: "金馬首映場 第一排中央席", cat: "入場券", bid: 22800, bids: 35, ends: "2026-11-02", badge: null, soldOut: false },
  { id: "au-script-signed", name: "《雙眼之間》導演簽名工作劇本（唯一）", cat: "收藏珍品", bid: 68000, bids: 52, ends: "2026-09-14", badge: "1 of 1", soldOut: false },
  { id: "au-storyboard-original", name: "經典片頭分鏡手稿真跡 三連幅", cat: "收藏珍品", bid: 126000, bids: 64, ends: "2026-10-12", badge: "1 of 1", soldOut: false },
  { id: "au-costume-hero", name: "男主角戲服原件（含戲用配飾）", cat: "收藏珍品", bid: 88500, bids: 38, ends: "2026-09-30", badge: "1 of 1", soldOut: false },
  { id: "au-poster-artistproof", name: "前導海報藝術家校樣 AP1/3 親簽", cat: "收藏珍品", bid: 45200, bids: 29, ends: "2026-08-31", badge: null, soldOut: false },
  { id: "au-clapper-final", name: "殺青場記板（劇組全員簽名）", cat: "收藏珍品", bid: 56400, bids: 47, ends: "2026-12-01", badge: "1 of 1", soldOut: false },
  { id: "au-popcorn-gold", name: "金色爆米花桶 #001 編號原型", cat: "收藏珍品", bid: 12600, bids: 19, ends: "2026-09-08", badge: null, soldOut: false }
];
