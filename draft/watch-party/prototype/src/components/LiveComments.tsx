"use client";

import { useEffect, useRef, useState } from "react";
import type * as Ably from "ably";
import { getAbly, chan, type CommentMsg } from "@/lib/ably";

/**
 * Live comments — forked from the crowdfund proto's CommentsList (same visual
 * grammar: avatar + author + body + composer), but wired to an Ably channel
 * instead of a static prop. The channel is opened with rewind:"5m" so a late
 * joiner immediately sees the last 5 minutes of chat.
 */
function timeAgo(ts: number, now: number): string {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

export function LiveComments({ code, name }: { code: string; name: string }) {
  const [comments, setComments] = useState<CommentMsg[]>([]);
  const [draft, setDraft] = useState("");
  const channelRef = useRef<Ably.RealtimeChannel | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // Re-render clock so relative timestamps refresh.
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const ably = getAbly();
    const channel = ably.channels.get(chan.comments(code), {
      params: { rewind: "5m" },
    });
    channelRef.current = channel;

    const onMsg = (m: Ably.Message) => {
      const c = m.data as CommentMsg;
      setComments((prev) => [...prev, c]);
    };
    channel.subscribe("comment", onMsg);
    return () => channel.unsubscribe("comment", onMsg);
  }, [code]);

  // Auto-scroll to newest.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [comments]);

  function send() {
    const body = draft.trim();
    if (!body) return;
    const msg: CommentMsg = { author: name, body, ts: Date.now() };
    channelRef.current?.publish("comment", msg);
    // Optimistic append — the connection runs echoMessages:false, so our own
    // message won't come back to us; show it immediately.
    setComments((prev) => [...prev, msg]);
    setDraft("");
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">
          Live comments{" "}
          <span className="text-muted text-sm font-normal ml-1">
            {comments.length}
          </span>
        </h2>
      </div>

      {/* Composer */}
      <div className="bg-bg border border-line rounded-lg p-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accentLight shrink-0" />
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Post a comment"
            aria-label="Post a comment"
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
          <button
            type="button"
            onClick={send}
            disabled={!draft.trim()}
            aria-label="Send comment"
            className="text-accent disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
          >
            ↑
          </button>
        </div>
      </div>

      {/* Stream */}
      <div ref={listRef} className="space-y-4 overflow-y-auto flex-1 min-h-0 max-h-[55vh] pr-1">
        {comments.length === 0 && (
          <p className="text-sm text-muted/70">
            No comments yet — say hi to the party. 👋
          </p>
        )}
        {comments.map((c, i) => (
          <div key={`${c.ts}-${i}`} className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-surface2 shrink-0 flex items-center justify-center text-xs uppercase">
              {c.author.slice(0, 1)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-medium truncate">{c.author}</span>
                <span className="text-muted shrink-0">{timeAgo(c.ts, now)}</span>
              </div>
              <div className="text-sm mt-1 text-text/90 leading-relaxed break-words">
                {c.body}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
