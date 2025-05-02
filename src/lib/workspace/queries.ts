import { useSuspenseQuery } from '@tanstack/react-query';
import { TWorkspace } from '@/types/db';
import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getClient } from '../supabase/get-client';
import { useAuthUser } from '../auth/queries';

const fetchWorkspaces = async (userId: string) => {
  const supabase = await getClient();

  const { data, error } = await supabase
    .from('workspaces')
    .select(
      `
      id,
      name,
      createdAt: created_at,
      user_workspaces!inner(),
      updatedAt: updated_at
    `,
    )
    .eq('user_workspaces.user_id', userId)
    .order('created_at');

  if (error) throw error;

  return data;
};

const fetchUserWorkspaces = async (workspaceIds: string[]) => {
  const supabase = await getClient();

  const { data, error } = await supabase
    .from('user_workspaces')
    .select(
      `
      userId: user_id,
      workspaceId: workspace_id,
      role,
      createdAt: created_at,
      updatedAt: updated_at
    `,
    )
    .in('workspace_id', workspaceIds)
    .order('created_at');

  if (error) throw error;

  return data;
};

export const workspaceKeys = createQueryKeys('workspaces', {
  list: (userId: string) => ({
    queryKey: [userId],
    queryFn: async () => fetchWorkspaces(userId),
  }),
});

export const userWorkspaceKeys = createQueryKeys('user-workspaces', {
  list: (workspaceIds: string[]) => ({
    queryKey: [workspaceIds],
    queryFn: async () => fetchUserWorkspaces(workspaceIds),
  }),
});

export const useWorkspaces = <TData = TWorkspace[]>(select?: (data: TWorkspace[]) => TData) => {
  const { data: user } = useAuthUser();

  return useSuspenseQuery({
    ...workspaceKeys.list(user.id),
    select,
  });
};

export const useWorkspace = (workspaceId: string) =>
  useWorkspaces(workspaces => {
    const index = workspaces.findIndex(workspace => workspace.id === workspaceId);
    return workspaces[index];
  });

export const useUserWorkspaces = (workspaceId: string) => {
  const { data: workspaces } = useWorkspaces();

  return useSuspenseQuery({
    ...userWorkspaceKeys.list(workspaces.map(workspace => workspace.id)),
    select: userWorkspaces =>
      userWorkspaces.filter(userWorkspace => userWorkspace.workspaceId === workspaceId),
  });
};
