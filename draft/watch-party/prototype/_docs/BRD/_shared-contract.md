# Ztor — Shared Data Contract

Platform-wide nouns. Defined **once** here; feature BRDs reference these, never redefine them.
Append-only with conflict detection — if a feature needs a field a noun lacks, **add the field here**;
never fork a second definition.

> First created by the **Watch Party** feature (2026-06-24). Subsequent features extend this file.

## Entities

### `User`
The base account. Everyone is a User.
- `id`: string (uuid)
- `displayName`: string
- `avatarUrl`: string | null
- `email`: string
- `locale`: `zh-TW | zh-HK | en`
- `role`: `fan | tastemaker | tastemaker_plus | creator | ops_admin`
- `createdAt`: timestamp (UTC)

> **Role note (Watch Party):** the right to *host* a watch party is **not** a `role` — it is an
> explicitly granted capability (`HostGrant`, feature-local). A `creator`/`ops_admin` role does
> **not** by itself confer hosting. See `watch-party/_feature.md`.

### `Creator`
A `User` who publishes content. Watch-party **hosts** are Creators (or ops-designated accounts).
- `userId`: string → `User.id`
- `creatorName`: string
- `verified`: boolean

### `Fan`
A `User` in their viewer capacity. Buys tickets, joins rooms, comments.
- `userId`: string → `User.id`

### `Wallet`  *(POPCORN)*
The platform credit balance. Watch-party tickets are priced in **POPCORN** (integer credits).
- `userId`: string → `User.id`
- `popcornBalance`: integer (≥ 0, no fractional credits)

### `Title`
A film or series in the Ztor catalog.
- `id`: string
- `name`: string
- `kind`: `movie | series`
- `episodes`: `Episode[]`  *(empty for a **movie** — a movie is assigned/streamed as the whole title, it has no episodes; populated for a **series**)*
- `geoPolicy`: `worldwide | geoblocked`  *(licensing scope; enforced at the CDN/entitlement layer)*
- `ageRating`: `G | PG | R | null`

### `Episode`
- `id`: string
- `titleId`: string → `Title.id`
- `number`: integer
- `name`: string

### `Order`
A purchase/entitlement record. Platform-wide; **extended** by features.
- `id`: string
- `userId`: string → `User.id`
- `kind`: `ppv_purchase | rental | watch_party_ticket | merch`  *(extended by Watch Party with `watch_party_ticket`)*
- `amountPopcorn`: integer (≥ 0)
- `status`: `confirmed | refunded`
- `idempotencyKey`: string  *(unique per (userId, kind, refId) — blocks double-charge)*
- `refId`: string  *(the thing bought — e.g. `WatchParty.id` for a ticket)*
- `createdAt`: timestamp (UTC)

> **Order count rule:** every `Order` (any `kind`) counts toward a Title's **total order count**.
> Watch-party tickets are no exception (per 2026-06-22 decision). See `watch-party/_feature.md`.

### `AuditLog`
Who-did-what trail for permission and money actions. Platform-wide.
- `id`: string
- `actorId`: string → `User.id`  *(the ops admin / system actor)*
- `action`: string  *(e.g. `host_grant.create`, `content_grant.update`, `order.refund`, `watch_party.cancel`)*
- `targetType`: string
- `targetId`: string
- `before`: json | null
- `after`: json | null
- `at`: timestamp (UTC)

## Enums (platform-wide)
- `User.role`: `fan | tastemaker | tastemaker_plus | creator | ops_admin`
- `User.locale`: `zh-TW | zh-HK | en`
- `Title.geoPolicy`: `worldwide | geoblocked`
- `Order.kind`: `ppv_purchase | rental | watch_party_ticket | merch`
- `Order.status`: `confirmed | refunded`
