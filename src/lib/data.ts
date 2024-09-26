import { UserWorkspace } from '@/types/app-types';
import { createClient } from '@/utils/supabase/server';
import { QueryData } from '@supabase/supabase-js';

export async function fetchUserWorkspaces(): Promise<UserWorkspace[]> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not logged in');

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

export async function fetchWorkspaceWithTasks(idWorkspace: string): Promise<UserWorkspace> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not logged in');

  const workspaceQuery = supabase
    .from('workspace')
    .select(
      `
    *,
    user_workspace!inner(
      role
    ),
    boards: board(
      *
    ),
    task_lists: task_list(
      *
    ),
    tasks: task(
      *
    ),
    comments: comment(
      *
    )
    `,
    )
    .eq('user_workspace.user_id', user.id)
    .eq('workspace.id', idWorkspace);

  type Workspace = QueryData<typeof workspaceQuery>;
  const { data, error } = await workspaceQuery;

  if (error) throw new Error(error.message);

  const workspaces: Workspace = data;

  const proccessedWorkspace = workspaces.map(
    ({ id, name, boards, user_workspace: [{ role }], created_at }) => ({
      id,
      name,
      role,
      boards,
      created_at,
    }),
  )[0];

  return proccessedWorkspace;
}
