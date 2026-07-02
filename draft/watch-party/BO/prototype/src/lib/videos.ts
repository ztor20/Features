/**
 * Hardcoded sample clips for the watch-party demo.
 *
 * Self-hosted in /public/videos so they're SAME-ORIGIN: no CORS, no remote
 * 403s, and identical behaviour locally and on Vercel. (Earlier attempts at
 * Google's gtv-videos-bucket 403'd and archive.org was flaky on range
 * requests — see plan risk note.) Next's static file server supports HTTP
 * range requests, so the <video> element can seek freely.
 *
 * Clips: ~5MB 720p 10s samples (Blender open movies + Jellyfish) from
 * test-videos.co.uk. `poster` omitted — the player shows the first frame.
 */
export type Video = {
  id: string;
  title: string;
  url: string;
};

export const VIDEOS: Video[] = [
  { id: "big-buck-bunny", title: "Big Buck Bunny", url: "/videos/big-buck-bunny.mp4" },
  { id: "jellyfish", title: "Jellyfish", url: "/videos/jellyfish.mp4" },
  { id: "sintel", title: "Sintel", url: "/videos/sintel.mp4" },
];

export function getVideo(id: string | null | undefined): Video {
  return VIDEOS.find((v) => v.id === id) ?? VIDEOS[0];
}
