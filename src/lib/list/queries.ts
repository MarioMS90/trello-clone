import { getClient } from '../supabase/utils';

async function fetchLists(boardId: string) {
  const supabase = await getClient();

  const { data, error } = await supabase
    .from('lists')
    .select(
      ` 
      id,
      name,
      rank,
      boardId: board_id,
      createdAt: created_at
    `,
    )
    .eq('board_id', boardId)
    .order('rank');

  if (error) throw error;

  return data;
}
