import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Browser Supabase client for Client Components.
 * Use for signUp / signIn / signOut from the UI you build.
 *
 * Example (in your own component):
 *   const supabase = createClient()
 *   await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${origin}/auth/callback` } })
 */
export function createClient() {
  const options = {
    auth: {
      // Avoids lock contention in some Next.js HMR / multi-tab cases
      lock: async (_name, _acquireTimeout, fn) => fn(),
      flowType: "pkce",
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
    },
  };

  if (typeof window !== "undefined") {
    if (!globalThis._fantasySupabaseBrowserClient) {
      globalThis._fantasySupabaseBrowserClient = createBrowserClient(
        supabaseUrl,
        supabaseKey,
        options,
      );
    }
    return globalThis._fantasySupabaseBrowserClient;
  }

  return createBrowserClient(supabaseUrl, supabaseKey, options);
}
