import { cookies } from "next/headers";

const ACCESS_TOKEN_COOKIE = "yahoo_access_token";
const REFRESH_TOKEN_COOKIE = "yahoo_refresh_token";
const EXPIRES_AT_COOKIE = "yahoo_token_expires_at";
const OAUTH_STATE_COOKIE = "yahoo_oauth_state";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

export async function getYahooTokens() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const refresh_token = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
  const expires_at = cookieStore.get(EXPIRES_AT_COOKIE)?.value;

  if (!access_token) {
    return null;
  }

  return {
    access_token,
    refresh_token,
    expires_at: expires_at ? Number(expires_at) : null,
  };
}

export async function saveYahooTokens(tokens) {
  const cookieStore = await cookies();
  const expiresAt = Date.now() + tokens.expires_in * 1000;

  cookieStore.set(ACCESS_TOKEN_COOKIE, tokens.access_token, {
    ...cookieOptions,
    maxAge: tokens.expires_in,
  });

  if (tokens.refresh_token) {
    cookieStore.set(REFRESH_TOKEN_COOKIE, tokens.refresh_token, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  cookieStore.set(EXPIRES_AT_COOKIE, String(expiresAt), {
    ...cookieOptions,
    maxAge: tokens.expires_in,
  });
}

export async function clearYahooTokens() {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
  cookieStore.delete(EXPIRES_AT_COOKIE);
}

export async function setOAuthState(state) {
  const cookieStore = await cookies();

  cookieStore.set(OAUTH_STATE_COOKIE, state, {
    ...cookieOptions,
    maxAge: 60 * 10,
  });
}

export async function consumeOAuthState(state) {
  const cookieStore = await cookies();
  const storedState = cookieStore.get(OAUTH_STATE_COOKIE)?.value;

  cookieStore.delete(OAUTH_STATE_COOKIE);

  return storedState === state;
}
