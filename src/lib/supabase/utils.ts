'use client';

import { redirect } from 'next/navigation';
import createClient from './client';

type TSession = {
  accessToken: string;
  refreshToken: string;
};

export const sessionTokens: TSession = {
  accessToken: '',
  refreshToken: '',
};

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

export function UpdateSessionTokens({ currentSession }: { currentSession: TSession }) {
  sessionTokens.accessToken = currentSession.accessToken;
  sessionTokens.refreshToken = currentSession.refreshToken;

  return null;
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
