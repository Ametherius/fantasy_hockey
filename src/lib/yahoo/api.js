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
    throw new Error(
      `Yahoo API ${response.status}: ${await response.text()}`,
    );
  }

  return response.json();
}
