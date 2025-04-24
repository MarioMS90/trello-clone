import { TCard, TList } from '@/types/db';
import { cardKeys } from '@/lib/card/queries';
import { insertQueryData, updateQueryData, deleteQueryData } from '@/lib/react-query/utils';
import { QueryClient } from '@tanstack/react-query';
import { CacheHandlers } from '../cache-types';

export default function cardCacheController(queryClient: QueryClient): CacheHandlers<TCard> {
  const getQueryKey = (listId: string) => {
    const queryData = queryClient.getQueriesData<TList[]>({
      queryKey: ['lists'],
      type: 'active',
    });
    const list = queryData.flatMap(([_, lists]) => lists ?? []).find(_list => _list.id === listId);
    if (!list) {
      return undefined;
    }

    return cardKeys.list(list.boardId).queryKey;
  };

  return {
    handleInsert: card => {
      const queryKey = getQueryKey(card.listId) ?? [];

      insertQueryData({
        queryClient,
        queryKey,
        entity: { ...card, commentCount: 0 },
      });
    },

    handleUpdate: card => {
      const queryKey = getQueryKey(card.listId) ?? [];

      updateQueryData({
        queryClient,
        queryKey,
        entity: card,
      });
    },

    handleDelete: id => {
      const queriesData = queryClient.getQueriesData<TCard[]>({
        queryKey: ['cards'],
      });
      const oldCard = queriesData
        .flatMap(([_, cards = []]) => cards)
        .find(_oldCard => _oldCard.id === id);

      if (!oldCard) {
        return;
      }

      const queryKey = getQueryKey(oldCard.listId) ?? [];

      deleteQueryData({
        queryClient,
        queryKey,
        entityId: id,
      });
    },
  };
}
