import { getYahooTokens } from "@/lib/yahoo/tokens";
import { json } from "@/lib/yahoo/http";

export async function GET() {
  const tokens = await getYahooTokens();
  return json({
    connected: Boolean(tokens?.access_token),
    expires_at: tokens?.expires_at ?? null,
  });
}
