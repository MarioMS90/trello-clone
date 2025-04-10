import { useSuspenseQuery } from '@tanstack/react-query';
import { createQueryKeys } from '@lukemorales/query-key-factory';
import { TWorkspace } from '@/types/db';
import { getAuthUser, getClient } from '../supabase/utils';

async function fetchWorkspaces() {
  const supabase = await getClient();
  const user = await getAuthUser();

  const { data, error } = await supabase
    .from('workspaces')
    .select(
      `
      id,
      name,
      createdAt: created_at,
      user_workspaces!inner()
    `,
    )
    .eq('user_workspaces.user_id', user.id)
    .order('created_at');

  if (error) throw error;

  return data;
}

async function fetchUserWorkspaces() {
  const supabase = await getClient();

  const workspaces = await fetchWorkspaces();
  const workspaceIds = workspaces.map(workspace => workspace.id);
  const { data, error } = await supabase
    .from('user_workspaces')
    .select(
      `
      userId: user_id,
      workspaceId: workspace_id,
      role,
      createdAt: created_at
    `,
    )
    .in('workspace_id', workspaceIds)
    .order('created_at');

  if (error) throw error;

  return data;
}

export const workspaceKeys = createQueryKeys('workspaces', {
  list: () => ({
    queryKey: ['workspaces'],
    queryFn: async () => fetchWorkspaces(),
  }),
});

export const userWorkspaceKeys = createQueryKeys('user_workspaces', {
  list: () => ({
    queryKey: ['user_workspaces'],
    queryFn: async () => fetchUserWorkspaces(),
  }),
});

export const useWorkspaces = <TData = TWorkspace[]>(select?: (data: TWorkspace[]) => TData) =>
  useSuspenseQuery({ ...workspaceKeys.list(), select });

export const useWorkspace = (workspaceId: string) =>
  useWorkspaces(workspaces => {
    const index = workspaces.findIndex(workspace => workspace.id === workspaceId);
    return workspaces[index];
  });

export function useUserWorkspaces() {
  return useSuspenseQuery(userWorkspaceKeys.list());
}
