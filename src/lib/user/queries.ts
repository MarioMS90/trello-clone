import { useSuspenseQuery } from '@tanstack/react-query';
import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getAuthUser, getClient } from '../supabase/utils';

export async function fetchCurrentUser() {
  const supabase = await getClient();
  const user = await getAuthUser();

  const { data, error } = await supabase
    .from('users')
    .select(
      `
      id, 
      name, 
      email,
      createdAt: created_at
    `,
    )
    .eq('id', user.id)
    .single();

  if (error) throw error;

  return data;
}

export const userKeys = createQueryKeys('users', {
  current: () => ({
    queryKey: ['users'],
    queryFn: async () => fetchCurrentUser(),
  }),
});

export function useCurrentUser() {
  return useSuspenseQuery(userKeys.current());
}
