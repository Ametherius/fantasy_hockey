import { getUserLeagues } from "@/lib/yahoo/data";
import { handleYahooRouteError, json } from "@/lib/yahoo/http";

export async function GET() {
  try {
    const data = await getUserLeagues();
    return json({ connected: true, data });
  } catch (error) {
    return handleYahooRouteError(error);
  }
}
