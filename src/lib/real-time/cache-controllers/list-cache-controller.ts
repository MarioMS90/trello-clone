import { TCard, TList } from '@/types/db';
import { listKeys } from '@/lib/list/queries';
import { insertQueryData, updateQueryData, deleteQueryData } from '@/lib/react-query/utils';
import { QueryClient } from '@tanstack/react-query';
import { cardKeys } from '@/lib/card/queries';
import { CacheHandlers } from '../cache-types';

export default function listCacheController(queryClient: QueryClient): CacheHandlers<TList> {
  const defQueryKey = listKeys._def;

  return {
    handleInsert: list => {
      insertQueryData({
        queryClient,
        defQueryKey,
        entity: list,
      });
    },

    handleUpdate: list => {
      updateQueryData({
        queryClient,
        defQueryKey,
        entity: list,
      });

      const data = queryClient.getQueriesData<TCard[]>({
        queryKey: cardKeys._def,
      });
      const cards = data
        .flatMap(([_, _cards = []]) => _cards)
        .filter(card => card.listId === list.id);

      if (!cards) {
        return;
      }

      cards.forEach(card => {
        updateQueryData({
          queryClient,
          defQueryKey: cardKeys._def,
          entity: { ...card, listName: list.name },
        });
      });
    },

    handleDelete: id => {
      deleteQueryData({
        queryClient,
        defQueryKey,
        entityId: id,
      });
    },
  };
}
