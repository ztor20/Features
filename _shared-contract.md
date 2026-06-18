# Ztor shared data contract

Platform-wide nouns. Features REFERENCE these — they never redefine them. To add a field, extend the
entity here (append-only); if a feature's need conflicts with an existing definition, stop and resolve
with a human. One definition per noun, ever.

## Fan
`Fan { id: uuid, email: string, display_name: string, locale: string, timezone: string, age_verified: bool }`

## Creator
`Creator { id: uuid, display_name: string }`

## Project   <!-- a crowdfunding campaign -->
`Project { id: uuid, creator_id: uuid→Creator, title: string, status, currency: string, age_restricted: bool, ends_at: timestamp }`
- `status`: `draft | live | funded | closed`

## Bundle   <!-- a crowdfunding reward tier the fan backs -->
`Bundle { id: uuid, project_id: uuid→Project, name: string, price: int(minor units), quantity_total: int, quantity_claimed: int }`
- A bundle slot is "open" when `quantity_claimed < quantity_total`.

## AddOn   <!-- optional extra a fan can attach to a backing -->
`AddOn { id: uuid, project_id: uuid→Project, name: string, price: int(minor units) }`

## Backing   <!-- the paid pledge; the existing crowdfunding payment object -->
`Backing { id: uuid, fan_id: uuid→Fan, project_id: uuid→Project, bundle_id: uuid→Bundle, addon_ids: uuid[], amount: int(minor units), status }`
- `status`: `pending | confirmed | refunded | failed`
- Payment, fees, and refunds follow the existing crowdfunding rules — not redefined per feature.

---
*Added by feature `crowdfunding-waitlist` (2026-06-18): no new shared nouns; references Fan, Project, Bundle, AddOn, Backing.*
