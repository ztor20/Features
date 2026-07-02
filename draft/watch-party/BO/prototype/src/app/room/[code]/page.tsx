"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { getVideo } from "@/lib/videos";
import { SyncedPlayer } from "@/components/SyncedPlayer";
import { LiveComments } from "@/components/LiveComments";
import { PresenceBar } from "@/components/PresenceBar";

export default function RoomPage() {
  return (
    <Suspense fallback={<div className="px-6 py-10 text-muted">Loading room…</div>}>
      <RoomView />
    </Suspense>
  );
}

function RoomView() {
  const params = useParams<{ code: string }>();
  const search = useSearchParams();

  const code = params.code;
  const isHost = search.get("host") === "1";
  const queryName = search.get("name")?.trim() ?? "";

  // Guests who arrive via a raw invite link have no name yet → gate them.
  const [name, setName] = useState(isHost ? queryName || "Host" : queryName);

  if (!name) {
    return <NameGate code={code} onJoin={setName} />;
  }
  return <Room code={code} name={name} isHost={isHost} videoParam={search.get("video")} />;
}

/** Shown to a guest opening an invite link before they enter the party. */
function NameGate({ code, onJoin }: { code: string; onJoin: (name: string) => void }) {
  const [value, setValue] = useState("");
  function join() {
    if (value.trim()) onJoin(value.trim());
  }
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <section className="bg-surface border border-line rounded-xl p-6 text-center">
        <div className="text-3xl" aria-hidden="true">🍿</div>
        <h1 className="font-semibold text-xl mt-2">You&rsquo;re invited!</h1>
        <p className="text-sm text-muted mt-1">
          Joining room <span className="font-mono text-text tracking-wider">{code}</span>.
          Enter a name so the party knows who you are.
        </p>

        <label htmlFor="gate-name" className="sr-only">
          Your display name
        </label>
        <input
          id="gate-name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && join()}
          placeholder="Your display name"
          autoFocus
          className="w-full bg-bg border border-line rounded-md px-3 py-2 text-sm mt-5 text-center focus:outline-none focus:border-accent"
        />
        <button
          type="button"
          onClick={join}
          disabled={!value.trim()}
          className="mt-4 w-full bg-accent text-bg font-medium rounded-md py-2.5 text-sm hover:bg-accentLight disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
        >
          Join the party
        </button>
      </section>
    </div>
  );
}

function Room({
  code,
  name,
  isHost,
  videoParam,
}: {
  code: string;
  name: string;
  isHost: boolean;
  videoParam: string | null;
}) {
  // Host's video is known up front. A viewer learns it from the host's status
  // snapshot (see SyncedPlayer), so its title starts unknown.
  const hostVideo = isHost ? getVideo(videoParam) : null;
  const [activeTitle, setActiveTitle] = useState<string | null>(hostVideo?.title ?? null);

  const [copied, setCopied] = useState(false);
  function copyLink() {
    const url = `${window.location.origin}/room/${code}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid lg:grid-cols-[1fr_340px] gap-6">
      {/* Main column — player */}
      <div>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-danger bg-danger/10 border border-danger/30 rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" aria-hidden="true" />
              LIVE
            </span>
            <h1 className="font-semibold text-lg">
              {activeTitle ?? <span className="text-muted font-normal">Waiting for the host…</span>}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted">
              Room <span className="font-mono text-text tracking-wider">{code}</span>
            </span>
            <button
              type="button"
              onClick={copyLink}
              className="border border-line rounded-md px-2.5 py-1.5 text-muted hover:text-text hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {copied ? "Copied ✓" : "Copy invite link"}
            </button>
          </div>
        </div>

        {/* Player */}
        <div className="mt-4">
          <SyncedPlayer
            code={code}
            isHost={isHost}
            initialVideo={hostVideo}
            hostName={name}
            onActiveVideoChange={(v) => setActiveTitle(v?.title ?? null)}
          />
        </div>

        {/* Presence */}
        <div className="mt-4">
          <PresenceBar code={code} name={name} isHost={isHost} />
        </div>
      </div>

      {/* Aside — live comments */}
      <aside className="bg-surface border border-line rounded-xl p-4 h-fit lg:sticky lg:top-20">
        <LiveComments code={code} name={name} />
      </aside>
    </div>
  );
}
