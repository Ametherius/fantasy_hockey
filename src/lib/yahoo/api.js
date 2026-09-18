import "server-only";

import { getYahooAccessToken } from "./client";
import { YahooNotConnectedError } from "./errors";

const YAHOO_API_BASE = "https://fantasysports.yahooapis.com/fantasy/v2";

export async function yahooGet(path) {
  const accessToken = await getYahooAccessToken();
  if (!accessToken) {
    throw new YahooNotConnectedError();
  }

  const url = path.startsWith("http")
    ? path
    : `${YAHOO_API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

  const separator = url.includes("?") ? "&" : "?";
  const response = await fetch(`${url}${separator}format=json`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();

    if (
      response.status === 403 ||
      (response.status === 401 &&
        body.includes("additional_authorization_required"))
    ) {
      throw new Error(
        `Yahoo Fantasy API not authorized for this app (${response.status}). ` +
          `Your OAuth login succeeded, but Yahoo has not granted Fantasy Sports API access. ` +
          `Apply (or re-bind your App ID) at https://sports.yahoo.com/developer/ — ` +
          `then reconnect via /api/auth/yahoo. Raw: ${body}`,
      );
    }

    throw new Error(`Yahoo API ${response.status}: ${body}`);
  }

  return response.json();
}
