import { exchangeCodeForTokens } from "@/lib/yahoo/auth";
import { consumeOAuthState, saveYahooTokens } from "@/lib/yahoo/tokens";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const oauthError = searchParams.get("error");
  const origin = new URL(request.url).origin;

  if (oauthError) {
    return Response.redirect(
      `${origin}/?yahoo_error=${encodeURIComponent(oauthError)}`,
    );
  }

  if (!code || !state) {
    return Response.redirect(`${origin}/?yahoo_error=missing_code`);
  }

  const stateOk = await consumeOAuthState(state);
  if (!stateOk) {
    return Response.redirect(`${origin}/?yahoo_error=invalid_state`);
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    await saveYahooTokens(tokens);
    return Response.redirect(`${origin}/?yahoo=connected`);
  } catch (error) {
    console.error("[yahoo] callback", error);
    return Response.redirect(`${origin}/?yahoo_error=token_exchange`);
  }
}
