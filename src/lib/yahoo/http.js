import {
  YahooConfigError,
  YahooNotConnectedError,
} from "@/lib/yahoo/data";

export function json(data, status = 200) {
  return Response.json(data, { status });
}

export function handleYahooRouteError(error) {
  if (error instanceof YahooNotConnectedError) {
    return json({ error: error.message, connected: false }, 401);
  }

  if (error instanceof YahooConfigError) {
    return json({ error: error.message }, 400);
  }

  console.error("[yahoo]", error);
  return json(
    { error: error instanceof Error ? error.message : "Yahoo request failed" },
    500,
  );
}

export function getLeagueKeyFromRequest(request) {
  const { searchParams } = new URL(request.url);
  return searchParams.get("league_key") || undefined;
}
