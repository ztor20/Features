# 2026-06-12 — [Ztor 2.0] eShop dual-currency: cash + POPCORN (switchable); cash-based pricing with FX-derived POPCORN in separate fields

*Status: DRAFT — needs review*

## Decision
eShop 8 月版本將**同時支援現金（VR/信用卡）與 POPCORN** 兩種支付方式，並可隨時 **switch on/off**。商品定價以**現金為基礎**，系統根據匯率自動換算 POPCORN 參考值，但**兩者各自獨立欄位儲存**（避免四捨五入誤差）。POPCORN 購買流程不需讓用戶感知在「購買虛擬幣」，可直接以美金金額對應 POPCORN 數量完成結帳。

**收入端：暫時維持現金**，未來視法律與規模再導入 POPCORN（Alex 立場是希望平台全面使用 POPCORN，但目前 Tastemaker 佣金仍非 POPCORN）。

(English) The August eShop version will **support both cash (VR/credit card) and POPCORN**, each **switchable on/off** at any time. Pricing is **cash-based**; the system auto-converts a POPCORN reference value via FX, but **the two are stored in separate independent fields** (to avoid rounding errors). The POPCORN purchase flow doesn't have to make the user feel they're "buying virtual currency" — checkout can map a USD amount directly to a POPCORN quantity. **On the income/payout side: stay cash for now**, introducing POPCORN later subject to legal and scale considerations (Alex wants the platform fully on POPCORN, but Tastemaker commissions are still not in POPCORN today).

## Why
以現金為定價基準、POPCORN 以獨立欄位儲存可避免匯率換算的四捨五入誤差；收入端先維持現金以規避虛擬貨幣的法律/牌照風險。Cash-based pricing with POPCORN held in a separate field avoids FX rounding drift; keeping payouts in cash for now sidesteps the licensing/regulatory exposure of a money-out virtual currency.

## Alternatives considered
全平台採用 POPCORN（Alex 立場）— 暫緩，因 money-out 與牌照灰色地帶尚未釐清；長遠方案含商家兌換（超市券/Costco）甚至 ICO 兌換 USDT，最終依律師建議執行。 (Full-POPCORN platform — deferred pending the money-out / licensing grey area; long-term options include merchant redemption and eventually an ICO to USDT, final approach per legal counsel.)

## Source
- Daily Brief: https://app.notion.com/p/Daily-Brief-June-14-2026-37f9ca6e76ac8148ab51df3c809df22f
- Source meeting: https://app.notion.com/p/Meeting-Note-Core-37d9ca6e76ac8086b2a3e3f9555ddd11
