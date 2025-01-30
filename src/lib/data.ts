import { TList, TUser, TUserWorkspace } from '@/types/types';
import { createClient } from '@/lib/supabase/server';

export async function fetchUser(): Promise<TUser> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not logged in');

  const { data, error } = await supabase.from('user').select('*').eq('id', user.id).single();

  if (error) throw new Error(error.message);

  return data;
}

export async function fetchWorkspaces(): Promise<TUserWorkspace[]> {
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

export async function fetchLists(boardId: string): Promise<TList[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('list')
    .select(
      ` 
      *,
      cards: card(
        *
      )
    `,
    )
    .eq('board_id', boardId)
    .order('rank', { referencedTable: 'cards' })
    .order('rank');

  if (error) throw new Error(error.message);

  return data;
}
