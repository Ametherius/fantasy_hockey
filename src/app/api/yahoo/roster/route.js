import { getLeagueRosters, getTeamRoster } from "@/lib/yahoo/data";
import {
  getLeagueKeyFromRequest,
  handleYahooRouteError,
  json,
} from "@/lib/yahoo/http";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamKey = searchParams.get("team_key");
    const when = searchParams.get("week") || searchParams.get("date") || undefined;

    if (teamKey) {
      const data = await getTeamRoster(teamKey, when);
      return json({ connected: true, data });
    }

    const data = await getLeagueRosters(
      getLeagueKeyFromRequest(request),
      when,
    );
    return json({ connected: true, data });
  } catch (error) {
    return handleYahooRouteError(error);
  }
}
