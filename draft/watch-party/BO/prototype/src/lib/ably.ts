"use client";

import * as Ably from "ably";

/**
 * Single shared Realtime connection per browser tab. All channels (video,
 * comments, presence) multiplex over it. Auth goes through /api/ably-auth so
 * the API key never reaches the client. echoMessages:false so the host does
 * not receive its own playback events back (which would fight the player).
 */
let client: Ably.Realtime | null = null;

export function getAbly(): Ably.Realtime {
  if (!client) {
    client = new Ably.Realtime({ authUrl: "/api/ably-auth", echoMessages: false });
  }
  return client;
}

// Per-room channel names.
export const chan = {
  video: (code: string) => `video-${code}`,
  comments: (code: string) => `comments-${code}`,
  presence: (code: string) => `presence-${code}`,
  // Host-camera ON/OFF signal ONLY. The camera *video* never rides Ably — in
  // production it's a separate live stream (LiveKit); here it's a self-view
  // on the host + a PiP placeholder on viewers. This channel just flips it.
  camera: (code: string) => `camera-${code}`,
};

// Video-channel event names + payloads (host-authoritative).
export type VideoEvent = "play" | "pause" | "seek" | "status-request" | "status";

export type VideoStatus = {
  videoId: string;
  title: string;
  url: string;
  currentTime: number;
  isPlaying: boolean;
};

// Comment payload on the comments channel.
export type CommentMsg = {
  author: string;
  body: string;
  ts: number;
};

// Presence member data.
export type Member = {
  name: string;
  isHost: boolean;
};

// Camera-channel events. Host publishes camera-on/off + answers camera-status-
// request for late joiners (so someone arriving mid-stream learns the cam is
// already live). Payload is just the on/off state + host name — never video.
export type CameraEvent = "camera-on" | "camera-off" | "camera-status-request" | "camera-status";

export type CameraStatus = {
  isLive: boolean;
  hostName: string;
};
