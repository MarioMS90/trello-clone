import { useSuspenseQuery } from '@tanstack/react-query';
import { createQueryKeys } from '@lukemorales/query-key-factory';
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

export const workspaceKeys = createQueryKeys('workspaces', {
  list: () => ({
    queryKey: ['workspaces'],
    queryFn: async () => fetchWorkspaces(),
  }),
});

export function useWorkspaces() {
  return useSuspenseQuery(workspaceKeys.list());
}
