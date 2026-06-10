const YAHOO_AUTH_URL = "https://api.login.yahoo.com/oauth2/request_auth";
const YAHOO_TOKEN_URL = "https://api.login.yahoo.com/oauth2/get_token";
const YAHOO_SCOPE = "fspt-r";

function getYahooCredentials() {
  const clientId = process.env.YAHOO_CLIENT_ID;
  const clientSecret = process.env.YAHOO_CLIENT_SECRET;
  const redirectUri = process.env.YAHOO_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      "Missing YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET, or YAHOO_REDIRECT_URI",
    );
  }

  return { clientId, clientSecret, redirectUri };
}

export function buildYahooAuthUrl(state) {
  const { clientId, redirectUri } = getYahooCredentials();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: YAHOO_SCOPE,
    state,
  });

  return `${YAHOO_AUTH_URL}?${params.toString()}`;
}

async function requestYahooTokens(body) {
  const { clientId, clientSecret } = getYahooCredentials();
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(YAHOO_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body),
  });

  if (!response.ok) {
    throw new Error(`Yahoo token request failed: ${await response.text()}`);
  }

  return response.json();
}

export async function exchangeCodeForTokens(code) {
  const { redirectUri } = getYahooCredentials();

  return requestYahooTokens({
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code,
  });
}

export async function refreshYahooTokens(refreshToken) {
  const { redirectUri } = getYahooCredentials();

  return requestYahooTokens({
    grant_type: "refresh_token",
    redirect_uri: redirectUri,
    refresh_token: refreshToken,
  });
}
