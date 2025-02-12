import { TBoard, TList, TPublicSchema, TUser, TWorkspace } from '@/types/types';
import { createClient } from '@/lib/supabase/server';
import { Tables } from '@/types/database-types';

async function getUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not logged in');

  return user;
}

export async function fetchUser(): Promise<TUser> {
  const supabase = await createClient();
  const user = await getUser();

  const { data, error } = await supabase
    .from('user')
    .select('id, name, email, createdAt: created_at')
    .eq('id', user.id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function fetchWorkspaces(): Promise<TWorkspace[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('workspace')
    .select(
      `
      id,
      name,
      createdAt: created_at
    `,
    )
    .order('created_at');

  if (error) throw new Error(error.message);

  return data;
}

export async function fetchBoards<ColumnName extends keyof Tables<'board'>>({
  eq,
}: {
  eq: { column: ColumnName; value: NonNullable<Tables<'board'>[ColumnName]> };
}): Promise<TBoard[]> {
  const supabase = await createClient();

  const query = supabase
    .from('board')
    .select(
      `
      id,
      name,
      starred,
      workspaceId: workspace_id,
      createdAt: created_at
    `,
    )
    .order('created_at');

  if (eq) {
    query.eq(eq.column, eq.value);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return data;
}

export async function fetchLists(boardId: string): Promise<TList[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('list')
    .select(
      ` 
      *,
      cards: card(
        *,
        comments: comment(
          *
        )
      )
    `,
    )
    .eq('board_id', boardId)
    .order('rank', { referencedTable: 'cards' })
    .order('rank');

  if (error) throw new Error(error.message);

  return data;
}

export async function fetchCards(boardId: string): Promise<TList[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('list')
    .select(
      ` 
      *,
      cards: card(
        *,
        comments: comment(
          *
        )
      )
    `,
    )
    .eq('board_id', boardId)
    .order('rank', { referencedTable: 'cards' })
    .order('rank');

  if (error) throw new Error(error.message);

  return data;
}
