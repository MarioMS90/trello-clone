import { redirect } from 'next/navigation';
import { createClient } from './client';

const isServer = typeof window === 'undefined';

export async function getClient() {
  if (isServer) {
    return (await import('./server')).createClient();
  }

  return createClient();
}

export const getAuthUser = async () => {
  const supabase = await getClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  return user;
};
