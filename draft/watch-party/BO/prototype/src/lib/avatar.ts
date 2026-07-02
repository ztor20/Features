/**
 * Builder for ui-avatars.com URLs that ALWAYS URL-encodes the name.
 *
 * Why this exists: passing raw CJK (or any code point > 255) in a URL
 * query parameter trips Next.js's `<Image>` preload-hint emission. Next
 * mirrors the original URL string into an HTTP `Link: <…>; rel=preload`
 * header, and HTTP header values are WHATWG `ByteString` (Latin-1 only).
 * The result is a recurring TypeError per render and a slow heap leak
 * that OOMs Turbopack within minutes.
 *
 * Use this helper for every ui-avatars URL. Never construct one inline
 * — `npm run check:urls` will fail the build if it finds raw CJK in any
 * URL literal under `src/`.
 */

export type UserAvatarOptions = {
  /** Display name. Will be URL-encoded — pass raw CJK / accented chars freely. */
  name: string;
  /** Square size in px (default 240). */
  size?: number;
  /** Background hex, no leading `#`. */
  background?: string;
  /** Foreground hex, no leading `#`. Default `ffffff`. */
  color?: string;
  /** Bold weight on the initials. Default true. */
  bold?: boolean;
};

export function userAvatar({
  name,
  size = 240,
  background = "2a4a6e",
  color = "ffffff",
  bold = true,
}: UserAvatarOptions): string {
  // URLSearchParams handles encoding — passing raw CJK here is safe.
  const params = new URLSearchParams({
    name,
    size: String(size),
    background,
    color,
    bold: String(bold),
  });
  return `https://ui-avatars.com/api/?${params.toString()}`;
}
