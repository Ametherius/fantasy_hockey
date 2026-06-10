import YahooFantasy from "yahoo-fantasy";
import { refreshYahooTokens } from "./auth";
import { getYahooTokens, saveYahooTokens } from "./tokens";

export async function getYahooClient() {
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

  const yf = new YahooFantasy(
    process.env.YAHOO_CLIENT_ID,
    process.env.YAHOO_CLIENT_SECRET,
  );

  yf.setUserToken(tokens.access_token);
  return yf;
}
