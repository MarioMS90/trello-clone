'use client';

import invariant from 'tiny-invariant';
import { Database } from '@/types/database-types';
import { CookieMethodsBrowser, createBrowserClient } from '@supabase/ssr';
import { sessionCookies } from '@/lib/supabase/session-updater';

export function createClient(cookies?: CookieMethodsBrowser) {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies,
    },
  );
}

export async function getClient() {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    const supabase = createClient({
      getAll() {
        return Array.from(sessionCookies, ([name, value]) => ({
          name,
          value,
        }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => sessionCookies.set(name, value));
      },
    });

    return supabase;
  }

  const supabase = createClient();
  return supabase;
}

export async function getAuthUser() {
  const supabase = await getClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  invariant(user);

  return user;
}
