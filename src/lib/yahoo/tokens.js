import "server-only";

import { cookies } from "next/headers";

const ACCESS_TOKEN_COOKIE = "yahoo_access_token";
const REFRESH_TOKEN_COOKIE = "yahoo_refresh_token";
const EXPIRES_AT_COOKIE = "yahoo_token_expires_at";
const OAUTH_STATE_COOKIE = "yahoo_oauth_state";

/** Stay under typical ~4KB cookie limits (Yahoo access tokens are large). */
const COOKIE_CHUNK_SIZE = 3000;
const MAX_CHUNKS = 10;

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

async function readChunkedCookie(name) {
  const cookieStore = await cookies();
  const single = cookieStore.get(name)?.value;
  if (single) {
    return single;
  }

  const count = Number(cookieStore.get(`${name}__count`)?.value || 0);
  if (!count) {
    return null;
  }

  let value = "";
  for (let i = 0; i < count; i++) {
    const part = cookieStore.get(`${name}__${i}`)?.value;
    if (!part) {
      return null;
    }
    value += part;
  }
  return value;
}

async function writeChunkedCookie(name, value, options) {
  const cookieStore = await cookies();

  // Clear legacy single cookie + previous chunks
  cookieStore.delete(name);
  const previousCount = Number(cookieStore.get(`${name}__count`)?.value || 0);
  for (let i = 0; i < Math.max(previousCount, MAX_CHUNKS); i++) {
    cookieStore.delete(`${name}__${i}`);
  }

  if (!value) {
    cookieStore.delete(`${name}__count`);
    return;
  }

  if (value.length <= COOKIE_CHUNK_SIZE) {
    cookieStore.set(name, value, options);
    cookieStore.delete(`${name}__count`);
    return;
  }

  const chunks = Math.ceil(value.length / COOKIE_CHUNK_SIZE);
  cookieStore.set(`${name}__count`, String(chunks), options);
  for (let i = 0; i < chunks; i++) {
    cookieStore.set(
      `${name}__${i}`,
      value.slice(i * COOKIE_CHUNK_SIZE, (i + 1) * COOKIE_CHUNK_SIZE),
      options,
    );
  }
}

async function deleteChunkedCookie(name) {
  const cookieStore = await cookies();
  cookieStore.delete(name);
  const count = Number(cookieStore.get(`${name}__count`)?.value || MAX_CHUNKS);
  cookieStore.delete(`${name}__count`);
  for (let i = 0; i < count; i++) {
    cookieStore.delete(`${name}__${i}`);
  }
}

export async function getYahooTokens() {
  const cookieStore = await cookies();
  const access_token = await readChunkedCookie(ACCESS_TOKEN_COOKIE);
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
  const expiresIn = tokens.expires_in ?? 3600;
  const expiresAt = Date.now() + expiresIn * 1000;
  const existingRefresh = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
  const refreshToken = tokens.refresh_token || existingRefresh;

  await writeChunkedCookie(ACCESS_TOKEN_COOKIE, tokens.access_token, {
    ...cookieOptions,
    maxAge: expiresIn,
  });

  if (refreshToken) {
    cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  cookieStore.set(EXPIRES_AT_COOKIE, String(expiresAt), {
    ...cookieOptions,
    maxAge: expiresIn,
  });
}

export async function clearYahooTokens() {
  const cookieStore = await cookies();

  await deleteChunkedCookie(ACCESS_TOKEN_COOKIE);
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
