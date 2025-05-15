import { Database } from '@/types/database-types';
import { CookieMethodsBrowser, createBrowserClient } from '@supabase/ssr';

export function createClient(cookies?: CookieMethodsBrowser) {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies,
    },
  );
}
