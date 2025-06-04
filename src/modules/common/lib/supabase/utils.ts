import invariant from 'tiny-invariant';
import createClient from '@/modules/common/lib/supabase/client';

export async function getClient() {
  const isServer = typeof window === 'undefined';
  if (isServer) {
    return (await import('@/modules/common/lib/supabase/server')).default();
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
