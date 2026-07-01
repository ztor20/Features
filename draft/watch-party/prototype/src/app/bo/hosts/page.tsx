"use client";

import { useState } from "react";
import { PageHeader } from "@/components/bo/BoShell";
import { Card, Modal, Btn, Toast, cx } from "@/components/bo/ui";
import {
  ACCOUNTS,
  TITLES,
  CONTENT_GRANTS,
  MODERATOR_GRANTS,
  getTitle,
  hostName,
  type Account,
  type Title,
} from "@/lib/bo-data";

// Local editable state: host roster + per-host content grant (titleId -> grant unit).
// For a SERIES the grant unit is the list of episode ids; for a MOVIE it is [titleId]
// when the whole title is granted, [] when not.
type GrantMap = Record<string, Record<string, string[]>>;

function seedGrants(): GrantMap {
  const m: GrantMap = {};
  for (const g of CONTENT_GRANTS) {
    m[g.userId] = m[g.userId] ?? {};
    m[g.userId][g.titleId] = [...g.episodeIds];
  }
  return m;
}

function seedMods(): Record<string, string[]> {
  const m: Record<string, string[]> = {};
  for (const g of MODERATOR_GRANTS) m[g.hostId] = [...g.moderatorIds];
  return m;
}

export default function HostsAndContent() {
  const [accounts, setAccounts] = useState<Account[]>(() => ACCOUNTS.map((a) => ({ ...a })));
  const [grants, setGrants] = useState<GrantMap>(seedGrants);
  const [mods, setMods] = useState<Record<string, string[]>>(seedMods);
  const [assignFor, setAssignFor] = useState<Account | null>(null);
  const [modFor, setModFor] = useState<Account | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [hostQuery, setHostQuery] = useState("");
  const [removeTarget, setRemoveTarget] = useState<Account | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const hosts = accounts.filter((a) => a.hostGrant === "active");
  const available = accounts.filter((a) => a.hostGrant !== "active");
  const q = hostQuery.trim().toLowerCase();
  const availableFiltered = q
    ? available.filter((a) => a.displayName.toLowerCase().includes(q) || a.email.toLowerCase().includes(q))
    : available;

  function openAddHost() {
    setHostQuery("");
    setAddOpen(true);
  }
  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }
  function addHost(acc: Account) {
    setAccounts((as) => as.map((a) => (a.id === acc.id ? { ...a, hostGrant: "active" } : a)));
    flash(`${acc.displayName} added as a host — logged.`);
    setAddOpen(false);
  }
  function removeHost(acc: Account) {
    setAccounts((as) => as.map((a) => (a.id === acc.id ? { ...a, hostGrant: "revoked" } : a)));
    flash(`${acc.displayName} removed as a host — logged.`);
    setRemoveTarget(null);
  }

  // Chips for a host's current grant — movie = title only, series = "· N ep".
  function grantSummary(userId: string) {
    const g = grants[userId];
    if (!g) return null;
    const rows = Object.keys(g)
      .filter((t) => g[t].length > 0)
      .map((t) => {
        const title = getTitle(t);
        const isMovie = title?.kind === "movie";
        return { titleId: t, name: title?.name ?? t, isMovie, epCount: g[t].length };
      });
    return rows.length ? rows : null;
  }

  return (
    <>
      <PageHeader
        title="Hosts & Content"
        sub="Only people added here can host a watch party — there is no open self-serve. For each host, assign the exact titles (and, for series, episodes) they may stream; they pick among these in-room. You can also assign Moderators — extra accounts (besides the host) who may enter the room to manage chat and kick users."
        actions={<Btn variant="primary" onClick={openAddHost}>+ Add new host</Btn>}
      />

      {hosts.length === 0 ? (
        <Card className="p-10 text-center text-muted">
          No hosts yet — <button type="button" className="text-accent" onClick={openAddHost}>add a host</button> to begin.
        </Card>
      ) : (
        <div className="grid gap-3">
          {hosts.map((acc) => {
            const summary = grantSummary(acc.id);
            return (
              <Card key={acc.id} className="p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-accentLight shrink-0" aria-hidden />
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {acc.displayName}
                        <span className="text-[10px] uppercase tracking-wider text-muted bg-surface2 border border-line rounded px-1.5 py-0.5">
                          {acc.role}
                        </span>
                      </div>
                      <div className="text-xs text-muted">{acc.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Btn variant="default" onClick={() => setAssignFor(acc)}>Assign content</Btn>
                    <Btn variant="default" onClick={() => setModFor(acc)}>Moderators</Btn>
                    <Btn variant="danger" onClick={() => setRemoveTarget(acc)}>Remove</Btn>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-line/70">
                  <div className="text-[10px] uppercase tracking-widest text-muted mb-1.5">Content</div>
                  {summary ? (
                    <div className="flex flex-wrap gap-2">
                      {summary.map((s) => (
                        <span key={s.titleId} className="text-xs bg-surface2 border border-line rounded-md px-2.5 py-1">
                          <span className="text-text">{s.name}</span>{" "}
                          <span className="text-muted">{s.isMovie ? "· movie" : `· ${s.epCount} ep`}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-amber-300">
                      ⚠ No content assigned — this host can&rsquo;t create a party yet.
                    </div>
                  )}

                  <div className="text-[10px] uppercase tracking-widest text-muted mt-3 mb-1.5">
                    Moderators <span className="text-muted/60 normal-case tracking-normal">· extra accounts who can moderate this host&rsquo;s rooms</span>
                  </div>
                  {(mods[acc.id]?.length ?? 0) > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {mods[acc.id].map((mid) => (
                        <span key={mid} className="text-xs bg-surface2 border border-line rounded-md px-2.5 py-1 text-text">
                          🛡 {hostName(mid)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-muted">Host only — no extra moderators assigned.</div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add host modal — searchable picker over registered users */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add a host">
        <p className="text-xs text-muted mb-3">Search a registered Ztor user to grant the host capability.</p>
        <input
          value={hostQuery}
          onChange={(e) => setHostQuery(e.target.value)}
          placeholder="Search by name or email…"
          autoFocus
          className="w-full bg-bg border border-line rounded-md px-3 py-2 text-sm mb-3 focus:outline-none focus:border-accent"
        />
        {available.length === 0 ? (
          <p className="text-sm text-muted">All registered users are already hosts.</p>
        ) : availableFiltered.length === 0 ? (
          <p className="text-sm text-muted px-1 py-3">No users match &ldquo;{hostQuery}&rdquo;.</p>
        ) : (
          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {availableFiltered.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => addHost(acc)}
                className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-md hover:bg-surface2 border border-transparent hover:border-line"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-surface2 to-line shrink-0" aria-hidden />
                <div className="min-w-0">
                  <div className="text-sm font-medium">{acc.displayName}</div>
                  <div className="text-xs text-muted">{acc.email} · {acc.role}</div>
                </div>
                <span className="ml-auto text-xs text-accent">Add →</span>
              </button>
            ))}
          </div>
        )}
      </Modal>

      {/* Remove host confirm */}
      <Modal
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        title="Remove this host?"
        footer={
          <>
            <Btn variant="ghost" onClick={() => setRemoveTarget(null)}>Cancel</Btn>
            <Btn variant="danger" onClick={() => removeTarget && removeHost(removeTarget)}>Remove host</Btn>
          </>
        }
      >
        <p className="text-sm text-muted leading-relaxed">
          {removeTarget?.displayName} will no longer be able to create watch parties. Existing rooms aren&rsquo;t affected.
          This is logged to the audit trail.
        </p>
      </Modal>

      {assignFor && (
        <AssignModal
          account={assignFor}
          current={grants[assignFor.id] ?? {}}
          onClose={() => setAssignFor(null)}
          onSave={(next) => {
            setGrants((g) => ({ ...g, [assignFor.id]: next }));
            const titleCount = Object.values(next).filter((v) => v.length > 0).length;
            flash(`Updated ${assignFor.displayName}'s content — ${titleCount} title${titleCount === 1 ? "" : "s"} assigned. Logged.`);
            setAssignFor(null);
          }}
        />
      )}

      {modFor && (
        <ModeratorModal
          account={modFor}
          accounts={accounts}
          current={mods[modFor.id] ?? []}
          onClose={() => setModFor(null)}
          onSave={(next) => {
            setMods((m) => ({ ...m, [modFor.id]: next }));
            flash(`Updated ${modFor.displayName}'s moderators — ${next.length} assigned. Logged.`);
            setModFor(null);
          }}
        />
      )}

      <Toast msg={toast} />
    </>
  );
}

function ModeratorModal({
  account,
  accounts,
  current,
  onClose,
  onSave,
}: {
  account: Account;
  accounts: Account[];
  current: string[];
  onClose: () => void;
  onSave: (next: string[]) => void;
}) {
  const [assigned, setAssigned] = useState<string[]>(() => [...current]);
  const [query, setQuery] = useState("");

  // Anyone registered can moderate — except the host themselves and those already assigned.
  const candidates = accounts.filter((a) => a.id !== account.id && !assigned.includes(a.id));
  const q = query.trim().toLowerCase();
  const shown = q
    ? candidates.filter((a) => a.displayName.toLowerCase().includes(q) || a.email.toLowerCase().includes(q))
    : candidates;

  function add(id: string) {
    setAssigned((xs) => [...xs, id]);
    setQuery("");
  }
  function remove(id: string) {
    setAssigned((xs) => xs.filter((x) => x !== id));
  }
  const nameOf = (id: string) => accounts.find((a) => a.id === id)?.displayName ?? id;

  return (
    <Modal
      open
      onClose={onClose}
      title={`Moderators — ${account.displayName}`}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" onClick={() => onSave(assigned)}>Save moderators</Btn>
        </>
      }
    >
      <p className="text-xs text-muted mb-3">
        Assign extra accounts who may enter <span className="text-text">{account.displayName}</span>&rsquo;s watch-party rooms
        to <strong className="text-text">moderate</strong> — manage chat and kick users. The host always moderates; this adds helpers.
        (Front-end self-serve assignment is a future phase.)
      </p>

      {/* Currently assigned */}
      <div className="mb-3">
        <div className="text-[10px] uppercase tracking-widest text-muted mb-1.5">Assigned moderators</div>
        {assigned.length === 0 ? (
          <p className="text-sm text-muted">None yet — add one below.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {assigned.map((id) => (
              <span key={id} className="inline-flex items-center gap-1.5 text-xs bg-surface2 border border-line rounded-md pl-2.5 pr-1.5 py-1">
                🛡 <span className="text-text">{nameOf(id)}</span>
                <button
                  type="button"
                  onClick={() => remove(id)}
                  aria-label={`Remove ${nameOf(id)}`}
                  className="w-4 h-4 rounded text-muted hover:text-danger hover:bg-danger/10 leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Add — searchable directory */}
      <div className="text-[10px] uppercase tracking-widest text-muted mb-1.5">Add a moderator</div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search a registered user by name or email…"
        className="w-full bg-bg border border-line rounded-md px-3 py-2 text-sm mb-2 focus:outline-none focus:border-accent"
      />
      {candidates.length === 0 ? (
        <p className="text-sm text-muted">Everyone is already assigned.</p>
      ) : shown.length === 0 ? (
        <p className="text-sm text-muted px-1 py-2">No users match &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="space-y-1.5 max-h-56 overflow-y-auto">
          {shown.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => add(a.id)}
              className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-md hover:bg-surface2 border border-transparent hover:border-line"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-surface2 to-line shrink-0" aria-hidden />
              <div className="min-w-0">
                <div className="text-sm font-medium">{a.displayName}</div>
                <div className="text-xs text-muted">{a.email} · {a.role}</div>
              </div>
              <span className="ml-auto text-xs text-accent">Add →</span>
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}

let customSeq = 0;

function AssignModal({
  account,
  current,
  onClose,
  onSave,
}: {
  account: Account;
  current: Record<string, string[]>;
  onClose: () => void;
  onSave: (next: Record<string, string[]>) => void;
}) {
  const [titles, setTitles] = useState<Title[]>(() => TITLES.map((t) => ({ ...t })));
  const [draft, setDraft] = useState<Record<string, string[]>>(() => {
    const d: Record<string, string[]> = {};
    for (const k of Object.keys(current)) d[k] = [...current[k]];
    return d;
  });
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newKind, setNewKind] = useState<"series" | "movie">("series");
  const [newEps, setNewEps] = useState(2);

  const q = query.trim().toLowerCase();
  const shown = q ? titles.filter((t) => t.name.toLowerCase().includes(q)) : titles;

  function toggleEpisode(titleId: string, episodeId: string) {
    setDraft((d) => {
      const eps = new Set(d[titleId] ?? []);
      eps.has(episodeId) ? eps.delete(episodeId) : eps.add(episodeId);
      return { ...d, [titleId]: [...eps] };
    });
  }
  function toggleAllEpisodes(titleId: string, allIds: string[]) {
    setDraft((d) => {
      const has = (d[titleId] ?? []).length === allIds.length;
      return { ...d, [titleId]: has ? [] : [...allIds] };
    });
  }
  function toggleMovie(titleId: string) {
    setDraft((d) => ({ ...d, [titleId]: (d[titleId]?.length ?? 0) > 0 ? [] : [titleId] }));
  }
  function addCustomTitle() {
    const name = newTitle.trim();
    if (!name) return;
    const tid = `custom-${++customSeq}`;
    if (newKind === "movie") {
      const t: Title = { id: tid, name, kind: "movie", geoPolicy: "worldwide", ageRating: null, episodes: [] };
      setTitles((ts) => [...ts, t]);
      setDraft((d) => ({ ...d, [tid]: [tid] })); // whole movie granted
    } else {
      const eps = Array.from({ length: Math.max(1, newEps) }, (_, i) => ({
        id: `${tid}-e${i + 1}`,
        titleId: tid,
        number: i + 1,
        name: `Ep ${i + 1}`,
      }));
      const t: Title = { id: tid, name, kind: "series", geoPolicy: "worldwide", ageRating: null, episodes: eps };
      setTitles((ts) => [...ts, t]);
      setDraft((d) => ({ ...d, [tid]: eps.map((e) => e.id) })); // all episodes ticked
    }
    setNewTitle("");
    setNewKind("series");
    setNewEps(2);
    setAdding(false);
    setQuery("");
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={`Assign content — ${account.displayName}`}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" onClick={() => onSave(draft)}>Save assignment</Btn>
        </>
      }
    >
      <p className="text-xs text-muted mb-3">
        Tick a movie, or the episodes of a series, this host may stream. They choose among these in-room (and can switch
        mid-session). Geoblocked titles are still enforced at playback per their licence.
      </p>

      {/* Search the content catalog */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search titles…"
        className="w-full bg-bg border border-line rounded-md px-3 py-2 text-sm mb-3 focus:outline-none focus:border-accent"
      />

      <div className="space-y-3">
        {shown.length === 0 && (
          <p className="text-sm text-muted px-1 py-2">No titles match &ldquo;{query}&rdquo;.</p>
        )}
        {shown.map((t) => {
          const isMovie = t.kind === "movie";
          const granted = (draft[t.id]?.length ?? 0) > 0;
          const allIds = t.episodes.map((e) => e.id);
          const allOn = granted && draft[t.id]?.length === allIds.length;
          return (
            <div key={t.id} className="border border-line rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2.5 bg-surface2/50">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{t.name}</span>
                  <span className="text-[10px] uppercase tracking-wide text-muted">{isMovie ? "movie" : "series"}</span>
                  {t.geoPolicy === "geoblocked" && (
                    <span className="text-[10px] text-amber-300 bg-amber-400/10 border border-amber-400/30 rounded px-1.5 py-0.5">geoblocked</span>
                  )}
                  {t.id.startsWith("custom-") && (
                    <span className="text-[10px] text-accent bg-accent/10 border border-accent/30 rounded px-1.5 py-0.5">new</span>
                  )}
                </div>
                {!isMovie && (
                  <button type="button" onClick={() => toggleAllEpisodes(t.id, allIds)} className="text-[11px] text-accent hover:text-accentLight">
                    {allOn ? "Clear" : "Select all"}
                  </button>
                )}
              </div>

              {isMovie ? (
                <label className="flex items-center gap-3 px-3 py-2.5 text-sm cursor-pointer hover:bg-surface2/40">
                  <input type="checkbox" checked={granted} onChange={() => toggleMovie(t.id)} className="accent-accent w-4 h-4" />
                  <span className={granted ? "text-text" : "text-muted"}>Assign this movie</span>
                </label>
              ) : (
                <div className="divide-y divide-line/60">
                  {t.episodes.map((e) => {
                    const on = (draft[t.id] ?? []).includes(e.id);
                    return (
                      <label key={e.id} className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-surface2/40">
                        <input type="checkbox" checked={on} onChange={() => toggleEpisode(t.id, e.id)} className="accent-accent w-4 h-4" />
                        <span className={on ? "text-text" : "text-muted"}>Ep {e.number} · {e.name}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add a custom title not in the catalog */}
      <div className="mt-3">
        {adding ? (
          <div className="border border-line rounded-lg p-3 bg-surface2/30">
            <div className="text-xs text-muted mb-2">Add a title to the assignable list</div>
            <div className="flex flex-wrap items-end gap-2">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-[11px] text-muted mb-1">Title name</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomTitle()}
                  placeholder="e.g. New Premiere Title"
                  autoFocus
                  className="w-full bg-bg border border-line rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-[11px] text-muted mb-1">Type</label>
                <div className="flex bg-bg border border-line rounded-md p-0.5 text-xs">
                  {(["series", "movie"] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setNewKind(k)}
                      className={cx("px-2.5 py-1 rounded", newKind === k ? "bg-accent text-bg font-medium" : "text-muted")}
                    >
                      {k === "series" ? "Series" : "Movie"}
                    </button>
                  ))}
                </div>
              </div>
              {newKind === "series" && (
                <div className="w-20">
                  <label className="block text-[11px] text-muted mb-1">Episodes</label>
                  <input
                    type="number"
                    min={1}
                    value={newEps}
                    onChange={(e) => setNewEps(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full bg-bg border border-line rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:border-accent tabular-nums"
                  />
                </div>
              )}
              <Btn variant="primary" onClick={addCustomTitle} disabled={!newTitle.trim()}>Add</Btn>
              <Btn variant="ghost" onClick={() => setAdding(false)}>Cancel</Btn>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => { setNewTitle(query); setAdding(true); }}
            className="w-full border border-dashed border-line rounded-lg py-2.5 text-sm text-muted hover:text-text hover:border-accent/40"
          >
            + Add a title not in the catalog
          </button>
        )}
      </div>
    </Modal>
  );
}
