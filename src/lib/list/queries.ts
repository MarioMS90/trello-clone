import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useSuspenseQuery } from '@tanstack/react-query';
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
      workspaceId: workspace_id,
      createdAt: created_at
    `,
    )
    .eq('board_id', boardId);

  if (error) throw error;

  return data;
}

export const listKeys = createQueryKeys('lists', {
  list: (boardId: string) => ({
    queryKey: ['lists', boardId],
    queryFn: async () => fetchLists(boardId),
  }),
});

export function useLists(boardId: string) {
  return useSuspenseQuery(listKeys.list(boardId));
}
