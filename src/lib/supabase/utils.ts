import { redirect } from 'next/navigation';
import { CookieOptions } from '@supabase/ssr';
import { sessionTokens } from '@/providers/react-query-provider';
import createClient from './client';

const isServer = typeof window === 'undefined';
let cookieStore: {
  name: string;
  value: string;
  options: CookieOptions;
}[] = [];

export async function getClient() {
  if (isServer) {
    const supabase = createClient({
      getAll() {
        return cookieStore;
      },
      setAll(cookiesToSet) {
        cookieStore = cookiesToSet;
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

  if (!user) {
    redirect('/sign-in');
  }

  return user;
}
