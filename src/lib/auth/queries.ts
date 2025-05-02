import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getClient } from '../supabase/get-client';

export const getAuthUser = async () => {
  const supabase = await getClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not logged in');

  return user;
};

export const authKeys = createQueryKeys('auth', {
  user: () => ({
    queryKey: ['user'],
    queryFn: getAuthUser,
  }),
});

export const useAuthUser = () =>
  useSuspenseQuery({
    ...authKeys.user(),
    staleTime: 0,
  });
