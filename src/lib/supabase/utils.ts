import { createClient } from './client';

const isServer = typeof window === 'undefined';

export async function getClient() {
  if (isServer) {
    return (await import('./server')).createClient();
  }

  return createClient();
}

export async function getAuthUser() {
  const supabase = await getClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not logged in');

  return user;
}
