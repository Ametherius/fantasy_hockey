import { getYahooTokens } from "@/lib/yahoo/tokens";
import { json } from "@/lib/yahoo/http";

export async function GET() {
  const tokens = await getYahooTokens();
  const connected = Boolean(tokens?.access_token);

  return json({
    connected,
    expires_at: tokens?.expires_at ?? null,
    hint: connected
      ? "If /api/yahoo/leagues returns 403, apply for Fantasy API access at https://sports.yahoo.com/developer/ and include your App ID from developer.yahoo.com/apps/"
      : "Visit /api/auth/yahoo to connect. Do not set YAHOO_OAUTH_SCOPE=fspt-r unless Yahoo has approved Fantasy API access for your app.",
  });
}
