import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useSuspenseQuery } from '@tanstack/react-query';
import { TCard } from '@/types/db';
import { useCallback } from 'react';
import { getClient } from '../supabase/utils';

async function fetchCards(boardId: string): Promise<TCard[]> {
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
      createdAt: created_at,
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

export function useCardsGroupedByList(boardId: string) {
  return useSuspenseQuery({
    ...cardKeys.list(boardId),
    select: useCallback((cards: TCard[]) => {
      const grouped = cards.reduce<Record<string, TCard[]>>(
        (_cards, card) => ({
          ..._cards,
          [card.listId]: [...(_cards[card.listId] ?? []), card],
        }),
        {},
      );

      return Object.fromEntries(
        Object.entries(grouped).map(([listId, group]) => [
          listId,
          group.slice().toSorted((a, b) => a.rank.localeCompare(b.rank)),
        ]),
      );
    }, []),
  });
}
