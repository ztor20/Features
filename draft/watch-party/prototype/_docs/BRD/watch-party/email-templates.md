# Ztor Watch Party — Email Notification Templates

> **Status:** DRAFT for content-team review · **Date:** 2026-06-24
> **Next step:** convert this to a Google Doc for the content team to refine the copy (tone, brand voice, 繁中 wording).
> Copy references the existing **purchase-confirmation email** (per the 2026-06-22 meeting: 「文案參考現有購片確認信」).

There are **three** transactional emails. All are system-sent (not a marketing console).

| # | Type (system key) | Trigger | Recipient |
|---|---|---|---|
| 1 | `party_created` | Host creates a watch party | Host |
| 2 | `ticket_purchased` | A fan buys / claims a ticket | Buyer |
| 3 | `party_reminder` | **24 hours before** start time (6-29) | Ticket holders |

## Placeholders
Fill these from the room + order records. Keep the exact `{{token}}` spelling.

| Token | Meaning | Example |
|---|---|---|
| `{{hostName}}` | Host display name | Alex Rivera |
| `{{partyName}}` | Watch-party room name | F《我要衝線》Premiere Night |
| `{{titleName}}` | Title being streamed | F《我要衝線》 |
| `{{startTimeLocal}}` | Start time in the recipient's timezone | Aug 4, 2026 · 8:00 PM (GMT+8) |
| `{{ticketPrice}}` | Price in POPCORN, or "Free" | 150 🍿 |
| `{{joinLink}}` | Room link | https://ztor.app/wp/AB12CD |
| `{{roomCode}}` | Room code | AB12CD |
| `{{buyerName}}` | Buyer display name | Avery K. |

---

## 1 · Party created → Host (`party_created`)

**Subject (EN):** Your watch party "{{partyName}}" is set
**主旨 (繁中):** 你的共看派對「{{partyName}}」已建立

**Body (EN):**
> Hi {{hostName}},
>
> Your watch party is ready to go.
>
> **{{partyName}}**
> Starts: **{{startTimeLocal}}**
> Ticket: **{{ticketPrice}}**
>
> Share this link so fans can join — they'll be let in once they have a ticket:
> **{{joinLink}}** (code: **{{roomCode}}**)
>
> When it's time, open the room and pick the episode to start. Remember: you control playback for everyone, so please stay in the room for the whole session.
>
> — The Ztor team

**內文 (繁中):**
> {{hostName}} 你好，
>
> 你的共看派對已準備就緒。
>
> **{{partyName}}**
> 開始時間：**{{startTimeLocal}}**
> 入場券：**{{ticketPrice}}**
>
> 把這個連結分享給粉絲，他們持票即可加入：
> **{{joinLink}}**（房間代碼：**{{roomCode}}**）
>
> 時間到時，進入房間並選擇要播放的集數。請注意：播放由你控制，請全程留在房間內。
>
> — Ztor 團隊

---

## 2 · Ticket purchased → Buyer (`ticket_purchased`)

**Subject (EN):** You're in — ticket for "{{partyName}}"
**主旨 (繁中):** 購票成功 —「{{partyName}}」入場券

**Body (EN):**
> Hi {{buyerName}},
>
> Your ticket is confirmed.
>
> **{{partyName}}** — {{titleName}}
> Starts: **{{startTimeLocal}}**
> Paid: **{{ticketPrice}}**
>
> Join here when it begins:
> **{{joinLink}}**
>
> **Please note:** a watch party is a live session — there's **no replay** afterward, so join at the start time. If you can't make it, contact support; refunds are handled manually.
>
> See you there,
> — The Ztor team

**內文 (繁中):**
> {{buyerName}} 你好，
>
> 你的入場券已確認。
>
> **{{partyName}}** — {{titleName}}
> 開始時間：**{{startTimeLocal}}**
> 已付：**{{ticketPrice}}**
>
> 開始時由此加入：
> **{{joinLink}}**
>
> **請注意：** 共看派對為即時直播，結束後**無法回播**，請準時參加。如未能出席，請聯絡客服；退款將以人工方式處理。
>
> 期待與你相見，
> — Ztor 團隊

---

## 3 · Party reminder (24 h before) → Ticket holders (`party_reminder`)

*Sent **24 hours before** start time (confirmed 2026-06-29).*

**Subject (EN):** Tomorrow: your watch party "{{partyName}}"
**主旨 (繁中):** 明天開演：你的共看派對「{{partyName}}」

**Body (EN):**
> Hi {{buyerName}},
>
> This is your 24-hour reminder — **{{partyName}}** starts **{{startTimeLocal}}**.
>
> Tap to join when it goes live:
> **{{joinLink}}**
>
> Reminder: it's live only, with no replay. Grab your popcorn 🍿
>
> — The Ztor team

**內文 (繁中):**
> {{buyerName}} 你好，
>
> 提前 24 小時提醒你 —**{{partyName}}** 將於 **{{startTimeLocal}}** 開始。
>
> 直播開始時點此加入：
> **{{joinLink}}**
>
> 提醒：本場為即時直播，不設回播。準備好你的爆米花 🍿
>
> — Ztor 團隊

---

## Content-team open questions
- ~~Confirm the **send window** for the reminder~~ — **resolved 6-29: 24 hours before start.**
- Confirm brand sign-off line (「Ztor 團隊」 vs a specific brand voice).
- Should the host email include a short "how to run a watch party" link?
- 繁中 wording for **POPCORN / 爆米花** and **入場券** — align with the existing purchase-confirmation email.
