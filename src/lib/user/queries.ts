import { useSuspenseQuery } from '@tanstack/react-query';
import { createQueryKeys } from '@lukemorales/query-key-factory';
import { TUser } from '@/types/db';
import { getClient } from '../supabase/get-client';
import { useWorkspaces } from '../workspace/queries';
import { useAuthUser } from '../auth/queries';

export const fetchUsers = async (workspaceIds: string[]) => {
  const supabase = await getClient();

  const { data, error } = await supabase
    .from('users')
    .select(
      `
      id,
      name,
      email,
      createdAt: created_at,
      updatedAt: updated_at,
      user_workspaces!inner()
    `,
    )
    .in('user_workspaces.workspace_id', workspaceIds);

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
      createdAt: created_at,
      updatedAt: updated_at
    `,
    )
    .eq('id', userId)
    .single();

  if (error) throw error;

  return data;
};

export const userKeys = createQueryKeys('users', {
  list: (workspaceIds: string[]) => ({
    queryKey: [workspaceIds],
    queryFn: async () => fetchUsers(workspaceIds),
  }),
  detail: (userId: string) => ({
    queryKey: [userId],
    queryFn: async () => fetchUser(userId),
  }),
});

const useUsersQuery = <TData = TUser[]>(select?: (data: TUser[]) => TData) => {
  const { data: workspaces } = useWorkspaces();

  return useSuspenseQuery({
    ...userKeys.list(workspaces.map(workspace => workspace.id)),
    select,
  });
};

export const useCurrentUser = () => {
  const { data: user } = useAuthUser();

  return useSuspenseQuery({ ...userKeys.detail(user.id), staleTime: 0 });
};

export const useUsers = (userIds: string[]) =>
  useUsersQuery(users =>
    userIds.map(userId => {
      const index = users.findIndex(user => user.id === userId);
      return users[index];
    }),
  );

export const useUser = (userId: string) =>
  useUsersQuery(users => {
    const index = users.findIndex(user => user.id === userId);
    return users[index];
  });
