import { TColumn, User, UserWorkspace } from '@/types/app-types';
import { createClient } from '@/lib/supabase/server';

export async function fetchUser(): Promise<User> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not logged in');

  const { data, error } = await supabase.from('user').select('*').eq('id', user.id);

  if (error) throw new Error(error.message);

  return data[0];
}

export async function fetchWorkspaces(): Promise<UserWorkspace[]> {
  const supabase = await createClient();

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
    .order('created_at', { referencedTable: 'board' })
    .order('created_at');

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

export async function fetchColumns(boardId: string): Promise<TColumn[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('board_column')
    .select(
      ` 
      *,
      board!inner(
        id
      ),
      cards: card(
        *
      )
    `,
    )
    .eq('board.id', boardId)
    .order('rank', { referencedTable: 'cards' })
    .order('rank');

  if (error) throw new Error(error.message);

  return data;
}
