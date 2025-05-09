import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useSuspenseQuery } from '@tanstack/react-query';
import { TCardWithComments } from '@/types/db';
import { useCallback } from 'react';
import { getClient } from '../supabase/client';

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
      comments(
        count
      ),
      lists!inner()
    `,
    )
    .eq('lists.board_id', boardId)
    .throwOnError();

  return data?.map(card => ({ ...card, commentCount: card.comments[0].count, comment: undefined }));
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
      updatedAt: updated_at
    `,
    )
    .eq('id', cardId)
    .maybeSingle()
    .throwOnError();

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

export const useCardsQuery = <TData = TCardWithComments[]>(
  boardId: string,
  select?: (data: TCardWithComments[]) => TData,
) =>
  useSuspenseQuery({
    ...cardKeys.list(boardId),
    select,
  });

export const useCardsGroupedByList = (boardId: string, listIds: string[]) =>
  useCardsQuery(
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

export const useCards = (boardId: string, listId: string) =>
  useCardsQuery(
    boardId,
    useCallback(
      (cards: TCardWithComments[]) =>
        cards
          .filter(card => card.listId === listId)
          .toSorted((a, b) => a.rank.localeCompare(b.rank)),
      [listId],
    ),
  );

export const useCard = (cardId: string) => useSuspenseQuery(cardKeys.detail(cardId));
