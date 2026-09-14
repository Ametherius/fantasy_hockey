import "server-only";

import { refreshYahooTokens } from "./auth";
import { getYahooTokens, saveYahooTokens } from "./tokens";

/** Returns a valid Yahoo access token, refreshing if needed. */
export async function getYahooAccessToken() {
  let tokens = await getYahooTokens();

  if (!tokens?.access_token) {
    return null;
  }

  const isExpired =
    tokens.expires_at && Date.now() >= tokens.expires_at - 60_000;

  if (isExpired && tokens.refresh_token) {
    const refreshed = await refreshYahooTokens(tokens.refresh_token);
    await saveYahooTokens(refreshed);
    tokens = await getYahooTokens();
  }

  return tokens?.access_token ?? null;
}
