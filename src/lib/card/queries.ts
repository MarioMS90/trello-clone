import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useSuspenseQuery } from '@tanstack/react-query';
import { TCard } from '@/types/db';
import { useCallback } from 'react';
import { getClient } from '../supabase/utils';
import getQueryClient from '../react-query/get-query-client';

const fetchCards = async (boardId: string) => {
  const supabase = await getClient();

  const { data } = await supabase
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
      ...lists!inner(boardId: board_id, listName: name)
    `,
    )
    .eq('lists.board_id', boardId)
    .throwOnError();

  return data;
};

export const fetchCard = async (cardId: string) => {
  const supabase = await getClient();

  const { data } = await supabase
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
      ...lists!inner(boardId: board_id, listName: name)
    `,
    )
    .eq('id', cardId)
    .maybeSingle()
    .throwOnError();

  if (!data) {
    return null;
  }

  return data;
};

export const cardKeys = createQueryKeys('cards', {
  list: (boardId: string) => ({
    queryKey: [boardId],
    queryFn: () => fetchCards(boardId),
  }),
  detail: (cardId: string) => ({
    queryKey: [cardId],
    queryFn: () => fetchCard(cardId),
  }),
});

export const useCardsQuery = <TData = TCard[]>(
  boardId: string,
  select?: (data: TCard[]) => TData,
) =>
  useSuspenseQuery({
    ...cardKeys.list(boardId),
    select,
  });

export const useCardsGroupedByList = (boardId: string, listIds: string[]) =>
  useCardsQuery(
    boardId,
    useCallback(
      (cards: TCard[]) =>
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

export const useCards = (boardId: string, listId: string) =>
  useCardsQuery(
    boardId,
    useCallback(
      (cards: TCard[]) =>
        cards
          .filter(card => card.listId === listId)
          .toSorted((a, b) => a.rank.localeCompare(b.rank)),
      [listId],
    ),
  );

export const useCard = (cardId: string) => {
  const queryClient = getQueryClient();

  return useSuspenseQuery({
    queryKey: cardKeys.detail(cardId).queryKey,
    queryFn: async () => (cardId ? fetchCard(cardId) : null),
    initialData: () => {
      const data = queryClient.getQueriesData<TCard[]>({
        queryKey: cardKeys.list._def,
      });
      const card = data?.flatMap(([_, cards = []]) => cards).find(_card => _card.id === cardId);

      return card;
    },
  });
};
