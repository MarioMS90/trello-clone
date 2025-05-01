import { useSuspenseQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getClient } from '../supabase/get-client';

export const getAuthUser = async () => {
  const supabase = await getClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not logged in');

  return user;
};

// Needs implementation
export const fetchUsers = async (workspaceId: string) => {
  const supabase = await getClient();

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
    .eq('workspace-id', workspaceId)
    .single();

  if (error) throw error;

  return data;
};

export const fetchUser = async (userId: string) => {
  const supabase = await getClient();

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
    .eq('id', userId)
    .single();

  if (error) throw error;

  return data;
};

export const userKeys = createQueryKeys('users', {
  auth: () => ({
    queryKey: ['auth'],
    queryFn: getAuthUser,
  }),
  list: (workspaceId: string) => ({
    queryKey: [workspaceId],
    queryFn: async () => fetchUsers(workspaceId),
  }),
  detail: (userId: string) => ({
    queryKey: [userId],
    queryFn: async () => fetchUser(userId),
  }),
});

const useAuthUser = () =>
  useSuspenseQuery({
    ...userKeys.auth(),
    staleTime: 0,
  });

export const useCurrentUser = () => {
  const { data: user } = useAuthUser();
  invariant(user);

  return useSuspenseQuery(userKeys.detail(user.id));
};

export const useUsers = (workspaceId: string) => useSuspenseQuery(userKeys.detail(workspaceId));
