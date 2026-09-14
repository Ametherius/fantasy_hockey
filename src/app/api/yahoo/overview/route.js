import { getLeagueOverview } from "@/lib/yahoo/data";
import {
  getLeagueKeyFromRequest,
  handleYahooRouteError,
  json,
} from "@/lib/yahoo/http";

/** Bundle: settings + standings + draft + teams (no rosters). */
export async function GET(request) {
  try {
    const data = await getLeagueOverview(getLeagueKeyFromRequest(request));
    return json({ connected: true, data });
  } catch (error) {
    return handleYahooRouteError(error);
  }
}
