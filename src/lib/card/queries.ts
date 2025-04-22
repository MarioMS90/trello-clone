import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useSuspenseQuery } from '@tanstack/react-query';
import { TCardWithComments } from '@/types/db';
import { useCallback } from 'react';
import { getClient } from '../supabase/utils';

async function fetchCards(boardId: string): Promise<TCardWithComments[]> {
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
      createdAt: created_at,
      updatedAt: updated_at,
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

export const useCardsQuery = <TData = TCardWithComments[]>(
  boardId: string,
  select?: (data: TCardWithComments[]) => TData,
) =>
  useSuspenseQuery({
    ...cardKeys.list(boardId),
    select,
  });

export function useCardsGroupedByList(boardId: string) {
  return useCardsQuery(
    boardId,
    useCallback((cards: TCardWithComments[]) => {
      const grouped = cards.reduce<Record<string, TCardWithComments[]>>(
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
  );
}

export function useCards(boardId: string, listId: string) {
  return useCardsQuery(boardId, (cards: TCardWithComments[]) =>
    cards.filter(card => card.listId === listId).toSorted((a, b) => a.rank.localeCompare(b.rank)),
  );
}
