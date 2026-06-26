"use client";

import { useEffect, useRef, useState } from "react";
import type * as Ably from "ably";
import { getAbly, chan, type CameraStatus } from "@/lib/ably";

/**
 * Host-camera picture-in-picture tile — the "watch-along" face-cam.
 *
 * - HOST: a "Go on camera" toggle. On enable it opens the real webcam
 *   (getUserMedia) into a muted self-view and publishes `camera-on` so every
 *   viewer's tile appears. For DEMO purposes a tester can instead pick "Use
 *   demo avatar" (no camera prompt), and a denied/absent webcam auto-falls back
 *   to that same avatar feed — so the PiP always works without forcing a real
 *   camera on. It answers `camera-status-request` for late joiners.
 * - VIEWER: subscribes to the camera channel. While the host is live it shows a
 *   PiP placeholder (host initial + LIVE). In production this <div> is a second
 *   hls.js player pointed at the IVS playback URL — the real video pixels. The
 *   ON/OFF flip is genuinely realtime; only the cross-network video is mocked.
 *
 * The camera rides its OWN media layer (Amazon IVS) in production — never Ably,
 * never the movie's host-authoritative sync. This channel carries on/off only.
 */
export function HostCameraTile({
  code,
  isHost,
  hostName,
}: {
  code: string;
  isHost: boolean;
  hostName: string;
}) {
  const [live, setLive] = useState(false);
  const [mode, setMode] = useState<"camera" | "avatar">("camera");
  const [minimized, setMinimized] = useState(false);
  const [remoteHost, setRemoteHost] = useState(hostName);

  const channelRef = useRef<Ably.RealtimeChannel | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const avatarTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const selfViewRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const channel = getAbly().channels.get(chan.camera(code));
    channelRef.current = channel;

    if (isHost) {
      const onReq = () =>
        channel.publish("camera-status", {
          isLive: streamRef.current != null,
          hostName,
        } satisfies CameraStatus);
      channel.subscribe("camera-status-request", onReq);
      return () => {
        channel.unsubscribe("camera-status-request", onReq);
        stopStream();
      };
    }

    // ---- Viewer ----
    const onOn = (m: Ably.Message) => {
      if (m.data?.hostName) setRemoteHost(m.data.hostName);
      setLive(true);
    };
    const onOff = () => setLive(false);
    const onStatus = (m: Ably.Message) => {
      const s = m.data as CameraStatus;
      if (s?.hostName) setRemoteHost(s.hostName);
      setLive(!!s?.isLive);
    };
    channel.subscribe("camera-on", onOn);
    channel.subscribe("camera-off", onOff);
    channel.subscribe("camera-status", onStatus);
    // Ask whether the cam is already live (covers joining mid-stream).
    channel.publish("camera-status-request", {});

    return () => {
      channel.unsubscribe("camera-on", onOn);
      channel.unsubscribe("camera-off", onOff);
      channel.unsubscribe("camera-status", onStatus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, isHost]);

  // Attach the live stream (webcam or avatar canvas) to the self-view once mounted.
  useEffect(() => {
    if (isHost && live && selfViewRef.current && streamRef.current) {
      selfViewRef.current.srcObject = streamRef.current;
    }
  }, [isHost, live]);

  function stopStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (avatarTimerRef.current) {
      clearInterval(avatarTimerRef.current);
      avatarTimerRef.current = null;
    }
  }

  /** A self-contained "video" of the host's initial — no camera needed. */
  function makeAvatarStream(name: string): MediaStream {
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext("2d")!;
    const initial = (name || "H").trim().charAt(0).toUpperCase();
    let t = 0;
    const draw = () => {
      t += 1;
      const g = ctx.createLinearGradient(0, 0, 320, 240);
      g.addColorStop(0, "#242424");
      g.addColorStop(1, "#0e0e0e");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 320, 240);
      const r = 50 + Math.sin(t / 6) * 4; // gentle pulse
      ctx.beginPath();
      ctx.arc(160, 112, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(181,136,80,0.16)";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(210,163,111,0.55)";
      ctx.stroke();
      ctx.fillStyle = "#d2a36f";
      ctx.font = "bold 46px -apple-system, Segoe UI, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(initial, 160, 112);
      ctx.fillStyle = "#9a9a9a";
      ctx.font = "12px -apple-system, Segoe UI, sans-serif";
      ctx.fillText("demo avatar", 160, 210);
    };
    draw();
    avatarTimerRef.current = setInterval(draw, 90);
    return canvas.captureStream(12);
  }

  function goLive(stream: MediaStream, usedMode: "camera" | "avatar") {
    streamRef.current = stream;
    setMode(usedMode);
    setLive(true);
    channelRef.current?.publish("camera-on", { isLive: true, hostName } satisfies CameraStatus);
  }

  async function enableCam(useAvatar: boolean) {
    if (useAvatar) {
      goLive(makeAvatarStream(hostName), "avatar");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      goLive(stream, "camera");
    } catch {
      // Denied / no webcam → fall back to the demo avatar so the demo still works.
      goLive(makeAvatarStream(hostName), "avatar");
    }
  }

  function disableCam() {
    stopStream();
    if (selfViewRef.current) selfViewRef.current.srcObject = null;
    setLive(false);
    channelRef.current?.publish("camera-off", { isLive: false, hostName } satisfies CameraStatus);
  }

  // ---- HOST, camera off → real-camera + demo-avatar affordances ----
  if (isHost && !live) {
    return (
      <div className="absolute bottom-3 right-3 z-20 flex flex-col items-end gap-1.5">
        <button
          type="button"
          onClick={() => enableCam(false)}
          className="inline-flex items-center gap-1.5 bg-bg/85 backdrop-blur border border-line rounded-full px-3 py-1.5 text-xs text-text hover:border-accent hover:text-accentLight focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          🎥 Go on camera
        </button>
        <button
          type="button"
          onClick={() => enableCam(true)}
          title="Demo without turning on your real webcam"
          className="inline-flex items-center gap-1.5 bg-bg/70 backdrop-blur border border-line/70 rounded-full px-2.5 py-1 text-[11px] text-muted hover:text-text hover:border-accent/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          🙂 Use demo avatar
        </button>
      </div>
    );
  }

  // ---- Nothing to show for a viewer when the host isn't on camera ----
  if (!isHost && !live) return null;

  // ---- The PiP tile (host self-view OR viewer placeholder) ----
  return (
    <div className="absolute bottom-3 right-3 z-20 w-44 sm:w-52">
      {minimized ? (
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="inline-flex items-center gap-1.5 bg-bg/85 backdrop-blur border border-line rounded-full px-3 py-1.5 text-xs text-text hover:border-accent"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" aria-hidden="true" />
          Host cam
        </button>
      ) : (
        <div className="rounded-xl overflow-hidden border border-accent/50 bg-surface shadow-lg shadow-black/40 ring-1 ring-accent/20">
          <div className="relative aspect-video bg-black">
            {isHost ? (
              <video
                ref={selfViewRef}
                muted
                autoPlay
                playsInline
                className={`w-full h-full object-cover ${mode === "camera" ? "-scale-x-100" : ""}`}
              />
            ) : (
              // Viewer placeholder — in production this is a 2nd hls.js player on
              // the IVS playback URL. The LIVE flip is real; the feed is mocked.
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-surface2 to-bg">
                <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accentLight font-semibold text-lg">
                  {(remoteHost || "H").trim().charAt(0).toUpperCase()}
                </div>
                <span className="mt-1.5 text-[10px] text-muted">host cam · live feed</span>
              </div>
            )}

            {/* LIVE badge */}
            <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-white bg-danger/90 rounded-full px-1.5 py-0.5">
              <span className="w-1 h-1 rounded-full bg-white animate-pulse" aria-hidden="true" />
              LIVE
            </span>

            {/* Minimize */}
            <button
              type="button"
              onClick={() => setMinimized(true)}
              aria-label="Minimize host camera"
              className="absolute top-1.5 right-1.5 w-5 h-5 rounded bg-black/50 text-white/80 hover:text-white text-xs leading-none flex items-center justify-center"
            >
              –
            </button>
          </div>

          <div className="flex items-center justify-between px-2 py-1.5 bg-surface">
            <span className="text-[11px] text-text truncate">
              {isHost
                ? mode === "avatar"
                  ? "You're on (demo avatar)"
                  : "You're on camera"
                : `${remoteHost} on camera`}
            </span>
            {isHost && (
              <button
                type="button"
                onClick={disableCam}
                className="text-[10px] text-muted hover:text-danger border border-line hover:border-danger/40 rounded px-1.5 py-0.5 shrink-0 ml-1.5"
              >
                Stop
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
