import { UserWorkspace } from '@/types/app-types';
import { createClient } from '@/utils/supabase/server';

export async function fetchUserWorkspaces(): Promise<UserWorkspace[]> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not logged in');

  const query = supabase
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

  console.log('Fetching data...');
  await new Promise(resolve => setTimeout(resolve, 3000));

  const { data, error } = await query;

  console.log('Data fetch completed after 3 seconds.');

  if (error) throw new Error(error.message);

  const workspaces = data.map(({ id, name, boards, user_workspace: [{ role }], created_at }) => ({
    id,
    name,
    role,
    boards,
    created_at,
  }));

  return workspaces;
}

export async function fetchWorkspaceWithTasks(idWorkspace: string): Promise<UserWorkspace> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not logged in');

  const query = supabase
    .from('workspace')
    .select(
      `
    *,
    user_workspace!inner(
      role
    ),
    boards: board(
      *,
      task_lists: task_list(
        *,
        tasks: task(
          *, 
          comments: comment(
            *, 
            user: user(name)
          )
        )
      )
    )
    `,
    )
    .eq('user_workspace.user_id', user.id)
    .eq('id', idWorkspace);

  console.log('Fetching data...');
  await new Promise(resolve => setTimeout(resolve, 3000));

  const { data, error } = await query;

  console.log('Data fetch completed after 3 seconds.');

  if (error) throw new Error(error.message);

  const workspace = data.map(({ id, name, boards, user_workspace: [{ role }], created_at }) => ({
    id,
    name,
    role,
    boards,
    created_at,
  }))[0];

  return workspace;
}
