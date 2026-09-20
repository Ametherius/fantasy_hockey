import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Auth callback for email confirmation + OAuth PKCE.
 * Add this URL in Supabase Dashboard → Authentication → URL Configuration:
 *   http://localhost:3000/auth/callback
 *   https://your-production-domain/auth/callback
 *
 * After signUp / magic link / OAuth, Supabase redirects here with ?code=...
 */
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // No UI page created — land on home with an error query you can handle later.
  return NextResponse.redirect(`${origin}/?auth_error=callback`);
}
