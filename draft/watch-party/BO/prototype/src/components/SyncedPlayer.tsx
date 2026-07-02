"use client";

import { useEffect, useRef, useState } from "react";
import type * as Ably from "ably";
import type { Video } from "@/lib/videos";
import { getAbly, chan, type VideoStatus } from "@/lib/ably";
import { HostCameraTile } from "@/components/HostCameraTile";

/**
 * Host-authoritative synced player.
 *
 * - HOST: native <video controls>. Its play / pause / seeked events are
 *   published on the video channel. It answers "status-request" from late
 *   joiners with a full snapshot (including which video is playing).
 * - VIEWER: a passenger player (no controls). It does NOT know the video up
 *   front — it learns it from the host's status snapshot and adopts that
 *   source, then replays the host's play / pause / seek. Starts muted so the
 *   browser allows programmatic play(); an unmute button is provided. A
 *   "Force sync" button re-requests the snapshot.
 *
 * The <video> element itself is lifted from the crowdfund proto's TrailerModal.
 */
export function SyncedPlayer({
  code,
  isHost,
  initialVideo,
  hostName = "Host",
  onActiveVideoChange,
}: {
  code: string;
  isHost: boolean;
  initialVideo: Video | null;
  hostName?: string;
  onActiveVideoChange?: (video: Video | null) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const channelRef = useRef<Ably.RealtimeChannel | null>(null);
  const [muted, setMuted] = useState(!isHost);
  const [synced, setSynced] = useState(isHost);

  // The video actually playing. Host: fixed. Viewer: adopted from status.
  const [active, _setActive] = useState<Video | null>(initialVideo);
  const activeRef = useRef<Video | null>(initialVideo);
  const setActive = (v: Video | null) => {
    activeRef.current = v;
    _setActive(v);
    onActiveVideoChange?.(v);
  };

  // When the viewer adopts a new source, the <video> reloads; we stash the
  // target position/state here and apply it once the new source is ready.
  const pending = useRef<{ time: number; play: boolean } | null>(null);

  useEffect(() => {
    const ably = getAbly();
    const channel = ably.channels.get(chan.video(code));
    channelRef.current = channel;
    const v = videoRef.current;
    if (!v) return;

    if (isHost) {
      const snapshot = (): VideoStatus => ({
        videoId: activeRef.current?.id ?? "",
        title: activeRef.current?.title ?? "",
        url: activeRef.current?.url ?? "",
        currentTime: v.currentTime,
        isPlaying: !v.paused,
      });
      const onRequest = () => channel.publish("status", snapshot());
      channel.subscribe("status-request", onRequest);
      return () => channel.unsubscribe("status-request", onRequest);
    }

    // ---- Viewer ----
    const seekIfFar = (time: number) => {
      if (Math.abs(v.currentTime - time) > 0.5) v.currentTime = time;
    };
    const onPlay = (m: Ably.Message) => {
      seekIfFar(m.data.currentTime);
      v.play().catch(() => {});
      setSynced(true);
    };
    const onPause = (m: Ably.Message) => {
      seekIfFar(m.data.currentTime);
      v.pause();
      setSynced(true);
    };
    const onSeek = (m: Ably.Message) => {
      v.currentTime = m.data.currentTime;
    };
    const onStatus = (m: Ably.Message) => {
      const s = m.data as VideoStatus;
      const cur = activeRef.current;
      if (!cur || cur.url !== s.url) {
        // Adopt the host's video; apply position once it has loaded.
        pending.current = { time: s.currentTime, play: s.isPlaying };
        setActive({ id: s.videoId, title: s.title, url: s.url });
      } else {
        v.currentTime = s.currentTime;
        if (s.isPlaying) v.play().catch(() => {});
        else v.pause();
      }
      setSynced(true);
    };

    channel.subscribe("play", onPlay);
    channel.subscribe("pause", onPause);
    channel.subscribe("seek", onSeek);
    channel.subscribe("status", onStatus);
    // Ask the host where we are (publishes queue until connected).
    channel.publish("status-request", {});

    return () => {
      channel.unsubscribe("play", onPlay);
      channel.unsubscribe("pause", onPause);
      channel.unsubscribe("seek", onSeek);
      channel.unsubscribe("status", onStatus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, isHost]);

  // Host → broadcast native player events.
  function publishHost(ev: "play" | "pause" | "seek") {
    const v = videoRef.current;
    if (!v) return;
    channelRef.current?.publish(ev, { currentTime: v.currentTime });
  }

  // Viewer → after adopting a new source, jump to the host's position.
  function onLoadedData() {
    if (isHost || !pending.current) return;
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = pending.current.time;
    if (pending.current.play) v.play().catch(() => {});
    else v.pause();
    pending.current = null;
  }

  function forceSync() {
    channelRef.current?.publish("status-request", {});
  }

  return (
    <div>
      <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden border border-line">
        {/* Single stable <video>; src updates in place when a viewer adopts the
            host's source (avoids remounting the element the effect listens on). */}
        <video
          ref={videoRef}
          src={active?.url}
          muted={muted}
          controls={isHost && !!active}
          playsInline
          preload="auto"
          className="w-full h-full bg-black"
          onLoadedData={onLoadedData}
          onPlay={isHost ? () => publishHost("play") : undefined}
          onPause={isHost ? () => publishHost("pause") : undefined}
          onSeeked={isHost ? () => publishHost("seek") : undefined}
        >
          Your browser doesn&rsquo;t support HTML5 video playback.
        </video>

        {/* Viewer overlay — waiting for the host's first sync */}
        {!isHost && !synced && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm text-muted">
            Waiting for the host…
          </div>
        )}

        {/* Host-camera PiP — host self-view / viewer placeholder. Overlays this
            video box; in production it's a subscriber to the host LiveKit camera track. */}
        <HostCameraTile code={code} isHost={isHost} hostName={hostName} />
      </div>

      {/* Controls row */}
      <div className="mt-3 flex items-center gap-3 text-xs">
        {isHost ? (
          <span className="text-muted">
            You&rsquo;re the host — your play, pause, and seek control everyone.
          </span>
        ) : (
          <>
            <button
              type="button"
              onClick={forceSync}
              className="inline-flex items-center gap-1.5 border border-line rounded-md px-3 py-1.5 text-muted hover:text-text hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span aria-hidden="true">⟳</span> Force sync with host
            </button>
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              className="inline-flex items-center gap-1.5 border border-line rounded-md px-3 py-1.5 text-muted hover:text-text hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {muted ? "🔇 Unmute" : "🔊 Mute"}
            </button>
            <span className="text-muted/70">Host controls playback</span>
          </>
        )}
      </div>
    </div>
  );
}
