"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { VIDEOS } from "@/lib/videos";

function newRoomCode() {
  // Demo-grade room code — guess-resistant, not cryptographically secure.
  return Math.random().toString(36).slice(2, 8);
}

export default function Lobby() {
  const router = useRouter();
  const [hostName, setHostName] = useState("");
  const [videoId, setVideoId] = useState(VIDEOS[0].id);

  function hostParty() {
    if (!hostName.trim()) return;
    const code = newRoomCode();
    const q = new URLSearchParams({ host: "1", video: videoId, name: hostName.trim() });
    router.push(`/room/${code}?${q.toString()}`);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 text-xs text-accent bg-accent/10 border border-accent/30 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" /> Live watch party
        </span>
        <h1 className="text-3xl sm:text-4xl font-semibold mt-4 leading-tight">
          Watch together, in sync.
        </h1>
        <p className="text-muted mt-3 leading-relaxed">
          Host a private room and share the link. Everyone&rsquo;s playback stays
          in step — play, pause, and seek mirror to the whole party — with live
          comments and a presence list of who&rsquo;s watching.
        </p>
      </div>

      {/* Front-end now lives in the designer's build — this site keeps the BO + sync-engine demo */}
      <section className="mt-10 max-w-2xl bg-accent/10 border border-accent/30 rounded-xl p-6">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <span aria-hidden="true">🎨</span> User-facing front-end → designer&rsquo;s build
        </h2>
        <p className="text-sm text-muted mt-1.5 leading-relaxed">
          The fan/host front-end is now owned by the design team. The current user-facing UI lives at the
          designer&rsquo;s deploy — this prototype site keeps the{" "}
          <Link href="/bo" className="text-accent hover:text-accentLight rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">back office</Link>{" "}
          and the realtime sync-engine demo below.
        </p>
        <a
          href="https://ztor-2-0-f2e.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 bg-accent text-bg font-medium rounded-md px-4 py-2.5 text-sm hover:bg-accentLight focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
        >
          Open the designer&rsquo;s front-end ↗
        </a>
      </section>

      <div className="mt-10 max-w-md">
        {/* Sync-engine demo — original prototype, kept for realtime testing */}
        <p className="text-xs uppercase tracking-widest text-muted mb-3">Realtime sync-engine demo</p>
        <section className="bg-surface border border-line rounded-xl p-6">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <span aria-hidden="true">🎬</span> Host a watch party
          </h2>
          <p className="text-sm text-muted mt-1">
            Original prototype — demonstrates host-authoritative sync, live comments &amp; presence. You control playback for everyone.
          </p>

          <label htmlFor="host-name" className="block text-xs text-muted mt-5 mb-1.5">
            Your display name
          </label>
          <input
            id="host-name"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && hostParty()}
            placeholder="e.g. Jeff"
            className="w-full bg-bg border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
          />

          <label htmlFor="host-video" className="block text-xs text-muted mt-4 mb-1.5">
            Pick a video
          </label>
          <select
            id="host-video"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            className="w-full bg-bg border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
          >
            {VIDEOS.map((v) => (
              <option key={v.id} value={v.id}>
                {v.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={hostParty}
            disabled={!hostName.trim()}
            className="mt-5 w-full bg-accent text-bg font-medium rounded-md py-2.5 text-sm hover:bg-accentLight disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
          >
            Start watch party
          </button>
        </section>

        {/* Secondary path — joining with a code */}
        <p className="text-sm text-muted mt-5">
          Got a room code from a friend?{" "}
          <Link
            href="/join"
            className="text-accent hover:text-accentLight focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
          >
            Join a watch party →
          </Link>
        </p>
      </div>
    </div>
  );
}
