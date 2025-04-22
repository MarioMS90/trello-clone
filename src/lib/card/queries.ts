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

export function useCardsGroupedByList(boardId: string, listIds: string[]) {
  return useCardsQuery(
    boardId,
    useCallback(
      (cards: TCardWithComments[]) =>
        Object.fromEntries(
          listIds.map(listId => [
            listId,
            cards
              .filter(card => card.listId === listId)
              .toSorted((a, b) => a.rank.localeCompare(b.rank)),
          ]),
        ),
      [listIds],
    ),
  );
}

export function useCards(boardId: string, listId: string) {
  return useCardsQuery(boardId, (cards: TCardWithComments[]) =>
    cards.filter(card => card.listId === listId).toSorted((a, b) => a.rank.localeCompare(b.rank)),
  );
}
