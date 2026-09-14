import { getLeagueSettings } from "@/lib/yahoo/data";
import {
  getLeagueKeyFromRequest,
  handleYahooRouteError,
  json,
} from "@/lib/yahoo/http";

export async function GET(request) {
  try {
    const data = await getLeagueSettings(getLeagueKeyFromRequest(request));
    return json({ connected: true, data });
  } catch (error) {
    return handleYahooRouteError(error);
  }
}
