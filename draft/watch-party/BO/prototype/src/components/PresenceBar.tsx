"use client";

import { useEffect, useState } from "react";
import type * as Ably from "ably";
import { getAbly, chan, type Member } from "@/lib/ably";
import { userAvatar } from "@/lib/avatar";

/**
 * Presence list — who's watching. Uses Ably presence on the room's presence
 * channel: enter on mount, render the live member set, update on enter/leave.
 * Avatars via the proto's userAvatar() helper.
 */
type Entry = Member & { clientId: string };

export function PresenceBar({
  code,
  name,
  isHost,
}: {
  code: string;
  name: string;
  isHost: boolean;
}) {
  const [members, setMembers] = useState<Entry[]>([]);

  useEffect(() => {
    const ably = getAbly();
    const channel = ably.channels.get(chan.presence(code));

    const toEntry = (m: Ably.PresenceMessage): Entry => ({
      clientId: m.clientId,
      name: (m.data as Member)?.name ?? "Guest",
      isHost: Boolean((m.data as Member)?.isHost),
    });

    const refresh = async () => {
      const present = await channel.presence.get();
      setMembers(present.map(toEntry));
    };

    const onPresence = () => {
      void refresh();
    };
    channel.presence.subscribe(["enter", "leave", "update"], onPresence);
    channel.presence.enter({ name, isHost } satisfies Member).then(refresh);

    return () => {
      channel.presence.unsubscribe(onPresence);
      void channel.presence.leave();
    };
  }, [code, name, isHost]);

  // Host first, then everyone else.
  const ordered = [...members].sort((a, b) => Number(b.isHost) - Number(a.isHost));

  return (
    <div className="flex items-center gap-3 flex-wrap text-sm">
      <span className="text-muted shrink-0">
        Watching now <span className="text-text">{members.length}</span>
      </span>
      <div className="flex items-center flex-wrap gap-2">
        {ordered.map((m) => (
          <span
            key={m.clientId}
            className="inline-flex items-center gap-1.5 bg-surface border border-line rounded-full pl-1 pr-2.5 py-1"
            title={m.isHost ? `${m.name} (host)` : m.name}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={userAvatar({ name: m.name, size: 48, background: m.isHost ? "b58850" : "2a4a6e" })}
              alt=""
              aria-hidden="true"
              className="w-5 h-5 rounded-full"
            />
            <span className="text-xs">{m.name}</span>
            {m.isHost && <span className="text-[10px] text-accent">host</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
