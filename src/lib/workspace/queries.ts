import { useSuspenseQuery } from '@tanstack/react-query';
import { TWorkspace } from '@/types/db';
import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getAuthUser, getClient } from '../supabase/client';

export const fetchWorkspaces = async () => {
  const supabase = await getClient();
  const user = await getAuthUser();

  const { data } = await supabase
    .from('workspaces')
    .select(
      `
      id,
      name,
      createdAt: created_at,
      updatedAt: updated_at,
      users!inner()
    `,
    )
    .eq('users.id', user.id)
    .order('created_at')
    .throwOnError();

  return data;
};

export const workspaceKeys = createQueryKeys('workspaces', {
  list: {
    queryKey: null,
    queryFn: fetchWorkspaces,
  },
});

export const useWorkspaces = <TData = TWorkspace[]>(select?: (data: TWorkspace[]) => TData) =>
  useSuspenseQuery({
    ...workspaceKeys.list,
    select,
  });

export const useWorkspace = (workspaceId: string) =>
  useWorkspaces(workspaces => {
    const index = workspaces.findIndex(workspace => workspace.id === workspaceId);
    return workspaces[index];
  });
