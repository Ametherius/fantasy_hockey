import { randomUUID } from "crypto";
import { buildYahooAuthUrl } from "@/lib/yahoo/auth";
import { setOAuthState } from "@/lib/yahoo/tokens";

export async function GET() {
  const state = randomUUID();
  await setOAuthState(state);
  const url = buildYahooAuthUrl(state);
  return Response.redirect(url);
}
