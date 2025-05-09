'use client';

import invariant from 'tiny-invariant';
import { Database } from '@/types/database-types';
import { CookieMethodsBrowser, createBrowserClient } from '@supabase/ssr';

type TSession = {
  accessToken: string;
  refreshToken: string;
};

const sessionTokens: TSession = {
  accessToken: '',
  refreshToken: '',
};

export function UpdateSessionTokens({ currentSession }: { currentSession: TSession }) {
  sessionTokens.accessToken = currentSession.accessToken;
  sessionTokens.refreshToken = currentSession.refreshToken;

  return null;
}

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
    const cookieStore: {
      name: string;
      value: string;
    }[] = [];

    const supabase = createClient({
      getAll() {
        return cookieStore;
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => cookieStore.push({ name, value }));
      },
    });

    await supabase.auth.setSession({
      access_token: sessionTokens.accessToken,
      refresh_token: sessionTokens.refreshToken,
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
