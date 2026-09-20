import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js 16+ uses `proxy` (replaces `middleware`) to run before requests.
 * Keeps Supabase Auth cookies fresh on navigation.
 */
export async function proxy(request) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all paths except static assets and images.
     * Auth session refresh runs on app routes you build later (login, etc.).
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
