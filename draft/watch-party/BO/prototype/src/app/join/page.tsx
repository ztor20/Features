"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function JoinPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  function joinParty() {
    const room = code.trim().toLowerCase();
    if (!name.trim() || !room) return;
    const q = new URLSearchParams({ name: name.trim() });
    router.push(`/room/${room}?${q.toString()}`);
  }

  const canJoin = name.trim() && code.trim();

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <Link
        href="/"
        className="text-sm text-muted hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded inline-flex items-center gap-1"
      >
        <span aria-hidden="true">←</span> Back
      </Link>

      <section className="bg-surface border border-line rounded-xl p-6 mt-4">
        <h1 className="font-semibold text-xl flex items-center gap-2">
          <span aria-hidden="true">🍿</span> Join a watch party
        </h1>
        <p className="text-sm text-muted mt-1">
          Enter your name and the room code your host shared.
        </p>

        <label htmlFor="join-name" className="block text-xs text-muted mt-6 mb-1.5">
          Your display name
        </label>
        <input
          id="join-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && joinParty()}
          placeholder="e.g. Ana"
          autoFocus
          className="w-full bg-bg border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
        />

        <label htmlFor="join-code" className="block text-xs text-muted mt-4 mb-1.5">
          Room code
        </label>
        <input
          id="join-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && joinParty()}
          placeholder="e.g. a1b2c3"
          className="w-full bg-bg border border-line rounded-md px-3 py-2 text-sm font-mono tracking-wider focus:outline-none focus:border-accent"
        />

        <button
          type="button"
          onClick={joinParty}
          disabled={!canJoin}
          className="mt-6 w-full bg-accent text-bg font-medium rounded-md py-2.5 text-sm hover:bg-accentLight disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
        >
          Join the party
        </button>
      </section>
    </div>
  );
}
