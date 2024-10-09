import { TaskList, UserWorkspace } from '@/types/app-types';
import { createClient } from '@/lib/supabase/server';
import { getWorkspaceIdFromBoard } from './utils';

export async function getWorkspace({
  workspaceId,
  boardId,
}: {
  workspaceId?: string;
  boardId?: string;
}): Promise<UserWorkspace | undefined> {
  const workspaces = await fetchWorkspaces();

  const targetWorkspaceId = boardId ? getWorkspaceIdFromBoard(workspaces, boardId) : workspaceId;

  const workspace = workspaces.find(_workspace => _workspace.id === targetWorkspaceId);

  return workspace;
}

export async function fetchWorkspaces(): Promise<UserWorkspace[]> {
  const supabase = createClient();

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
    .eq('user_workspace.user_id', user.id);

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
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not logged in');

  const { data, error } = await supabase
    .from('task_list')
    .select(
      ` 
      *,
      board!inner(id),
      tasks: task(
        id,
        name,
        created_at
      )
    `,
    )
    .eq('board.id', boardId);

  if (error) throw new Error(error.message);

  return data;
}
