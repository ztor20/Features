/**
 * Mock dataset for the Watch Party BACK OFFICE prototype (/bo).
 *
 * Field + enum names mirror the BRD contract verbatim
 * (_docs/BRD/_shared-contract.md + _docs/BRD/watch-party/_feature.md) so the
 * prototype reads as the spec made clickable. All data is fake; no backend.
 * Names are placeholders — NOT real people.
 */

// ---- Contract enums ---------------------------------------------------------
export type WatchPartyStatus =
  | "draft"
  | "scheduled"
  | "preshow"
  | "live"
  | "host_away"
  | "ended"
  | "cancelled";

export type OrderStatus = "confirmed" | "refunded";
export type HostGrantStatus = "active" | "revoked";
export type GeoPolicy = "worldwide" | "geoblocked";

// ---- Catalog (shared: Title / Episode) -------------------------------------
export type Episode = { id: string; titleId: string; number: number; name: string };
export type Title = {
  id: string;
  name: string;
  kind: "movie" | "series";
  geoPolicy: GeoPolicy;
  ageRating: "G" | "PG" | "R" | null;
  episodes: Episode[];
};

export const TITLES: Title[] = [
  {
    id: "f-rush",
    name: "F《我要衝線》",
    kind: "series",
    geoPolicy: "worldwide",
    ageRating: "PG",
    episodes: [
      { id: "f-rush-e1", titleId: "f-rush", number: 1, name: "第一集 · 起跑" },
      { id: "f-rush-e2", titleId: "f-rush", number: 2, name: "第二集 · 彎道" },
      { id: "f-rush-e3", titleId: "f-rush", number: 3, name: "第三集 · 衝線" },
    ],
  },
  {
    id: "hk-noir",
    name: "港片回憶錄",
    kind: "series",
    geoPolicy: "worldwide",
    ageRating: "PG",
    episodes: [
      { id: "hk-noir-e1", titleId: "hk-noir", number: 1, name: "上集" },
      { id: "hk-noir-e2", titleId: "hk-noir", number: 2, name: "下集" },
    ],
  },
  {
    // Movie — no episodes. Assigned as the whole title.
    id: "sea",
    name: "海闊天空",
    kind: "movie",
    geoPolicy: "worldwide",
    ageRating: "G",
    episodes: [],
  },
  {
    id: "import-mr",
    name: "Midnight Run (imported)",
    kind: "movie",
    geoPolicy: "geoblocked",
    ageRating: "R",
    episodes: [],
  },
];

export function getTitle(id: string) {
  return TITLES.find((t) => t.id === id);
}
export function getEpisode(id: string | null) {
  if (!id) return null;
  for (const t of TITLES) {
    const e = t.episodes.find((ep) => ep.id === id);
    if (e) return e;
  }
  return null;
}

// ---- Accounts (User directory) + HostGrant ---------------------------------
// Placeholder names only. `hostGrant: active` = currently a granted host.
export type Account = {
  id: string;
  displayName: string;
  email: string;
  role: "creator" | "tastemaker_plus" | "ops_admin";
  hostGrant: HostGrantStatus | null; // null = never granted
};

export const ACCOUNTS: Account[] = [
  { id: "u_a", displayName: "Alex Rivera", email: "alex.rivera@example.com", role: "creator", hostGrant: "active" },
  { id: "u_b", displayName: "Jordan Pace", email: "jordan.pace@example.com", role: "creator", hostGrant: "active" },
  { id: "u_c", displayName: "Casey Lam", email: "casey.lam@example.com", role: "creator", hostGrant: null },
  { id: "u_d", displayName: "Morgan Yu", email: "morgan.yu@example.com", role: "tastemaker_plus", hostGrant: null },
  { id: "u_e", displayName: "Riley Sato", email: "riley.sato@example.com", role: "creator", hostGrant: null },
  { id: "u_f", displayName: "Taylor Kwok", email: "taylor.kwok@example.com", role: "creator", hostGrant: null },
  { id: "u_g", displayName: "Jamie Ho", email: "jamie.ho@example.com", role: "tastemaker_plus", hostGrant: null },
  { id: "u_h", displayName: "Sam Okafor", email: "sam.okafor@example.com", role: "creator", hostGrant: null },
];

// ---- ContentGrant (host → titles + episodes) -------------------------------
export type ContentGrant = { userId: string; titleId: string; episodeIds: string[] };

// For a SERIES, episodeIds = granted episode ids. For a MOVIE (no episodes),
// the whole title is the unit — episodeIds = [titleId] when granted, [] when not.
export const CONTENT_GRANTS: ContentGrant[] = [
  { userId: "u_a", titleId: "f-rush", episodeIds: ["f-rush-e1", "f-rush-e2", "f-rush-e3"] },
  { userId: "u_a", titleId: "sea", episodeIds: ["sea"] },
  { userId: "u_b", titleId: "hk-noir", episodeIds: ["hk-noir-e1", "hk-noir-e2"] },
];

export function grantsForHost(userId: string) {
  return CONTENT_GRANTS.filter((g) => g.userId === userId);
}

// ---- ModeratorGrant (host → extra accounts who may moderate the party) ------
// 6-29: besides the host, ops can assign additional accounts as Moderators —
// they enter the room and moderate (manage comments, kick users). FE self-serve
// assignment is a future phase; for launch it's ops-assigned in the back office.
export type ModeratorGrant = { hostId: string; moderatorIds: string[] };

export const MODERATOR_GRANTS: ModeratorGrant[] = [
  { hostId: "u_a", moderatorIds: ["u_c"] }, // Alex Rivera → Casey Lam moderates
];

export function moderatorsForHost(userId: string): string[] {
  return MODERATOR_GRANTS.find((m) => m.hostId === userId)?.moderatorIds ?? [];
}

// ---- Capacity (6-29) --------------------------------------------------------
// Ops sets ONE site-wide maximum; a creator picks their room's capacity up to
// this ceiling and can never exceed it. (Refines the 6-28 single-number: it's a
// hard ceiling, not just a default.)
export const SITE_MAX_CAPACITY = 1000;

// ---- WatchParty -------------------------------------------------------------
export type WatchParty = {
  id: string;
  name: string;
  hostId: string;
  titleId: string;
  episodeId: string | null;
  status: WatchPartyStatus;
  scheduledStartAt: string; // ISO (UTC)
  capacity: number; // single hard limit — 6-28 dropped the advertised/dual-number design
  ticketPricePopcorn: number; // 0 = free
  isFree: boolean;
  ticketsSold: number;
  occupancy: number; // live presence; 0 unless live/host_away
  hostCameraAllowed: boolean; // ops policy — may this host go on camera at all
  hostCameraLive: boolean; // runtime — is the host's camera broadcasting now (LiveKit)
};

export const WATCH_PARTIES: WatchParty[] = [
  {
    id: "wp_001",
    name: "F《我要衝線》Premiere Night",
    hostId: "u_a",
    titleId: "f-rush",
    episodeId: "f-rush-e1",
    status: "live",
    scheduledStartAt: "2026-08-04T12:00:00Z",
    capacity: 1000,
    ticketPricePopcorn: 150,
    isFree: false,
    ticketsSold: 842,
    occupancy: 781,
    hostCameraAllowed: true,
    hostCameraLive: true,
  },
  {
    id: "wp_003",
    name: "F Ep2 Watch-along",
    hostId: "u_a",
    titleId: "f-rush",
    episodeId: "f-rush-e2",
    status: "host_away",
    scheduledStartAt: "2026-08-05T12:00:00Z",
    capacity: 500,
    ticketPricePopcorn: 100,
    isFree: false,
    ticketsSold: 410,
    occupancy: 388,
    hostCameraAllowed: true,
    hostCameraLive: false,
  },
  {
    id: "wp_002",
    name: "港片回憶錄 Marathon (free)",
    hostId: "u_b",
    titleId: "hk-noir",
    episodeId: null,
    status: "scheduled",
    scheduledStartAt: "2026-08-09T11:00:00Z",
    capacity: 1000,
    ticketPricePopcorn: 0,
    isFree: true,
    ticketsSold: 120,
    occupancy: 0,
    hostCameraAllowed: true,
    hostCameraLive: false,
  },
  {
    id: "wp_005",
    name: "F Finale Co-watch",
    hostId: "u_a",
    titleId: "f-rush",
    episodeId: "f-rush-e3",
    status: "scheduled",
    scheduledStartAt: "2026-08-16T12:00:00Z",
    capacity: 1000,
    ticketPricePopcorn: 150,
    isFree: false,
    ticketsSold: 58,
    occupancy: 0,
    hostCameraAllowed: false,
    hostCameraLive: false,
  },
  {
    id: "wp_004",
    name: "海闊天空 Sneak Peek (free)",
    hostId: "u_a",
    titleId: "sea",
    episodeId: null,
    status: "ended",
    scheduledStartAt: "2026-06-18T12:00:00Z",
    capacity: 500,
    ticketPricePopcorn: 0,
    isFree: true,
    ticketsSold: 350,
    occupancy: 0,
    hostCameraAllowed: true,
    hostCameraLive: false,
  },
];

export function getParty(id: string) {
  return WATCH_PARTIES.find((p) => p.id === id);
}
export function hostName(userId: string) {
  return ACCOUNTS.find((a) => a.id === userId)?.displayName ?? userId;
}

// ---- Orders / attendees (Order kind=watch_party_ticket) --------------------
// `buyerName` = the real Ztor account (ops-only). `chatAlias` = the temporary
// name the user set for THIS chat room — what other viewers see; keeps their
// real identity private. The BO stores the alias→account mapping so ops can
// trace a user if they need to (6-29 chat-privacy requirement).
export type Order = {
  id: string;
  watchPartyId: string;
  userId: string;
  buyerName: string; // real account display name (ops-only)
  chatAlias: string; // temporary in-room chat name (public to viewers)
  amountPopcorn: number;
  status: OrderStatus;
  createdAt: string; // ISO
};

const FIRST = ["Avery", "Blair", "Cleo", "Devon", "Esme", "Flynn", "Gia", "Hari", "Indi", "Juno", "Kai", "Lux", "Marlo", "Nico", "Onyx", "Remy"];
// Temporary chat-room aliases people pick to stay private — mix of CJK + handles.
const ALIASES = ["小花", "追劇仔", "PopcornPanda", "夜貓子", "GaryFan88", "匿名觀眾", "SpeedRacer", "貓奴", "MoonWatcher", "阿明", "QuietViewer", "衝線衝衝衝", "K.", "路人甲", "StarGazer", "小雨"];
// Deterministic pseudo-attendees per party (no Math.random — must be stable across renders/SSR).
export function ordersForParty(p: WatchParty): Order[] {
  const n = Math.min(p.ticketsSold, 14);
  const out: Order[] = [];
  for (let i = 0; i < n; i++) {
    const refunded = i === 3 && p.id === "wp_001"; // one example refund on the live party
    out.push({
      id: `o_${p.id}_${i + 1}`,
      watchPartyId: p.id,
      userId: `u_att_${p.id}_${i}`,
      buyerName: `${FIRST[i % FIRST.length]} ${String.fromCharCode(65 + (i % 26))}.`,
      chatAlias: ALIASES[(i * 7 + p.id.length) % ALIASES.length],
      amountPopcorn: p.ticketPricePopcorn,
      status: refunded ? "refunded" : "confirmed",
      createdAt: p.scheduledStartAt,
    });
  }
  return out;
}

// ---- AuditLog ---------------------------------------------------------------
export type AuditEntry = {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: string;
};

export const AUDIT_LOG: AuditEntry[] = [
  { id: "a1", actor: "Ops admin", action: "host_grant.create", target: "Alex Rivera", at: "2026-06-20T03:11:00Z" },
  { id: "a2", actor: "Ops admin", action: "content_grant.update", target: "Alex Rivera · F《我要衝線》 ep1–3", at: "2026-06-20T03:13:00Z" },
  { id: "a3", actor: "Ops admin", action: "host_grant.create", target: "Jordan Pace", at: "2026-06-21T07:02:00Z" },
  { id: "a4", actor: "Ops admin", action: "host_grant.revoke", target: "Riley Sato", at: "2026-06-22T09:40:00Z" },
  { id: "a5", actor: "system", action: "order.refund", target: "o_wp_001_4 · 150🍿", at: "2026-06-23T15:20:00Z" },
];

// Has the party started (so attendance is meaningful)?
export function hasStarted(p: WatchParty): boolean {
  return p.status === "live" || p.status === "host_away" || p.status === "ended";
}

// Actual attendance for a party (6-29 metric). Live rooms = who's present now;
// ended rooms = a deterministic mock (~86% of sold); not-yet-started = 0.
export function attendedFor(p: WatchParty): number {
  if (!hasStarted(p)) return 0;
  if (p.status === "live" || p.status === "host_away") return p.occupancy;
  return Math.round(p.ticketsSold * 0.86); // ended — mock realised attendance
}

// ---- Derived analytics ------------------------------------------------------
export function analytics() {
  const ticketOrders = WATCH_PARTIES.reduce((s, p) => s + p.ticketsSold, 0);
  const liveNow = WATCH_PARTIES.filter((p) => p.status === "live" || p.status === "host_away").length;
  const popcornRevenue = WATCH_PARTIES.reduce((s, p) => s + p.ticketPricePopcorn * p.ticketsSold, 0);
  // Attendance Rate (6-29) = actual attendance ÷ tickets sold, over started parties.
  const started = WATCH_PARTIES.filter(hasStarted);
  const soldStarted = started.reduce((s, p) => s + p.ticketsSold, 0);
  const attendedStarted = started.reduce((s, p) => s + attendedFor(p), 0);
  const attendanceRate = soldStarted > 0 ? attendedStarted / soldStarted : 0;
  return {
    ticketOrders, // counts toward total order count
    liveNow,
    popcornRevenue,
    attendees: attendedStarted, // real attendance, not just sold
    attendanceRate, // attended ÷ sold (started parties)
    chatActivityRate: 0.62, // mock
    avgWatchMinutes: 47, // mock
  };
}
