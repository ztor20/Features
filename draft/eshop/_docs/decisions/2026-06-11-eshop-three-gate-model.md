# 2026-06-11 — [Ztor 2.0] eShop three-gate access model (Public / Rank / MVP-Card)
*Status: DRAFT — needs review*

## Decision
eShop is split into three access gates — **Public**, **Rank**, and **MVP-Card** — so different fan tiers see different store content.

Sequencing: the **Public** gate ships first (Aug). The **Rank** gate and **MVP-Card** gate ship together with **Fame & Loyalty** (Sep), because both depend on the ranking mechanism.

verbatim: 「eShop 分三個 Gate：Public、Rank、MVP Card，不同等級粉絲看到不同商店內容。Rank Gate 與 MVP Card Gate 應與 Fame & Loyalty 一起推出，因為這兩個 Gate 依賴 Ranking 機制。」

## Why
The Rank and MVP-Card gates can't function without the ranking system that Fame & Loyalty introduces, so they must ship alongside it. Backend permission logic can be added later with low impact, but the architecture must account for the gating up front.

## Source
- Daily Brief: https://app.notion.com/p/Daily-Brief-June-11-2026-37c9ca6e76ac81bf91e4f22921b59120
- Source meeting: https://app.notion.com/p/Meeting-Note-6-11-Core-37c9ca6e76ac8051a30ffa300cf204de
