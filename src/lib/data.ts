import { TaskList, UserWorkspace } from '@/types/app-types';
import { createClient } from '@/lib/supabase/server';

export async function getWorkspace(
  workspaceId: string | undefined,
): Promise<UserWorkspace | undefined> {
  const workspaces = await fetchWorkspaces();
  const workspace = workspaces.find(_workspace => _workspace.id === workspaceId);

  return workspace;
}

export async function fetchWorkspaces(): Promise<UserWorkspace[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not logged in');

  const { data, error } = await supabase
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
    .eq('user_workspace.user_id', user.id)
    .order('created_at', { referencedTable: 'board' });

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

export async function fetchTaskLists(boardId: string): Promise<TaskList[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not logged in');

  const { data, error } = await supabase
    .from('task_list')
    .select(
      ` 
      *,
      board!inner(
        id
      ),
      tasks: task(
        *
      )
    `,
    )
    .eq('board.id', boardId)
    .order('created_at');

  if (error) throw new Error(error.message);

  return data;
}
