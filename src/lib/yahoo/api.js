import "server-only";

import { getYahooAccessToken } from "./client";
import { YahooNotConnectedError } from "./errors";

const YAHOO_API_BASE = "https://fantasysports.yahooapis.com/fantasy/v2";

const FANTASY_ACCESS_HELP =
  "Yahoo Fantasy API access is restricted. Apply (or re-bind your App ID) at https://sports.yahoo.com/developer/ — Fantasy Sports is no longer self-serve for most apps.";

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

    if (response.status === 403) {
      throw new Error(
        `Yahoo API 403: application not authorized for Fantasy data. ${FANTASY_ACCESS_HELP} Raw: ${body}`,
      );
    }

    throw new Error(`Yahoo API ${response.status}: ${body}`);
  }

  return response.json();
}
