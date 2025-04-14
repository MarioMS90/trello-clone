import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getClient } from '../supabase/utils';

async function fetchCards(boardId: string) {
  const supabase = await getClient();

  const { data, error } = await supabase
    .from('cards')
    .select(
      `
      id,
      name,
      description,
      rank,
      listId: list_id,
      workspaceId: workspace_id,
      comments(
        count
      ),
      lists!inner()
    `,
    )
    .eq('lists.board_id', boardId);

  if (error) throw error;

  return data?.map(card => ({ ...card, commentCount: card.comments[0].count, comment: undefined }));
}

export const cardKeys = createQueryKeys('cards', {
  list: (boardId: string) => ({
    queryKey: ['cards', boardId],
    queryFn: async () => fetchCards(boardId),
  }),
});

export function useGroupedCardsByList(boardId: string) {
  return useSuspenseQuery({
    ...cardKeys.list(boardId),
    select: cards => Object.groupBy(cards, ({ listId }) => listId),
  });
}
