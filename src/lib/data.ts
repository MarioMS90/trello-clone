import { UserWorkspace } from '@/types/types';
import { createClient } from '@/utils/supabase/server';
import { QueryData } from '@supabase/supabase-js';

export async function fetchUserWorkspaces(): Promise<UserWorkspace[]> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const workspacesQuery = supabase
    .from('workspace')
    .select(
      `
    *,
    user_workspace!inner(
      role
    ),
    boards: board(
      *
    )
    `,
    )
    .eq('user_workspace.user_id', user.id);

  type Workspaces = QueryData<typeof workspacesQuery>;
  const { data, error } = await workspacesQuery;

  if (error) throw new Error(error.message);

  const workspaces: Workspaces = data;

  const proccessedWorkspaces = workspaces.map(
    ({ id, name, boards, user_workspace: [{ role }], created_at }) => ({
      id,
      name,
      role,
      boards,
      created_at,
    }),
  );

  return proccessedWorkspaces;
}
