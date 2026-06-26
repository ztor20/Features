import Ably from "ably";

/**
 * Token-auth endpoint — ported from the Ably watch-party repo's auth-ably.js.
 *
 * The browser never sees ABLY_API_KEY. Each client hits this route, gets a
 * short-lived signed token request, and uses it to connect. The random
 * clientId identifies the connection in presence.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.ABLY_API_KEY;
  if (!apiKey) {
    return new Response("ABLY_API_KEY not configured", { status: 500 });
  }

  const client = new Ably.Rest(apiKey);
  const tokenRequest = await client.auth.createTokenRequest({
    clientId: "id-" + Math.random().toString(36).slice(2, 18),
  });

  return Response.json(tokenRequest);
}
