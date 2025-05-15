import invariant from 'tiny-invariant';
import { createClient } from './client';

export async function getClient() {
  const isServer = typeof window === 'undefined';
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
  invariant(user);

  return user;
}
