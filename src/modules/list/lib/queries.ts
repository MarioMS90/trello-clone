import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { TList } from '@/modules/common/types/db';
import { getClient } from '@/modules/common/lib/supabase/utils';

const fetchLists = async (boardId: string) => {
  const supabase = await getClient();

  const { data } = await supabase
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
    .eq('board_id', boardId)
    .throwOnError();

  return data;
};

export const listKeys = createQueryKeys('lists', {
  list: (boardId: string) => ({
    queryKey: [boardId],
    queryFn: () => fetchLists(boardId),
  }),
});

export const useLists = (boardId: string) =>
  useSuspenseQuery({
    ...listKeys.list(boardId),
    select: useCallback(
      (lists: TList[]) => lists.toSorted((a, b) => a.rank.localeCompare(b.rank)),
      [],
    ),
  });
