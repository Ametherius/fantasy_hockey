import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function createClient() {
  const options = {
    auth: {
      lock: async (_name, _acquireTimeout, fn) => fn(),
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
