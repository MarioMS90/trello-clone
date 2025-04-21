import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { TList } from '@/types/db';
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
      createdAt: created_at,
      updatedAt: updated_at
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
  return useSuspenseQuery({
    ...listKeys.list(boardId),
    select: useCallback(
      (lists: TList[]) => lists.toSorted((a, b) => a.rank.localeCompare(b.rank)),
      [],
    ),
  });
}
