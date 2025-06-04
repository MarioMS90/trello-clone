import { TCard, TList } from '@/modules/common/types/db';
import { listKeys } from '@/modules/list/lib/queries';
import {
  insertQueryData,
  updateQueryData,
  deleteQueryData,
} from '@/modules/common/lib/react-query/utils';
import { QueryClient } from '@tanstack/react-query';
import { cardKeys } from '@/modules/card/lib/queries';
import { CacheHandlers } from '@/modules/common/lib/real-time/types';

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
        .filter(card => card && card.listId === list.id);

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

    handleDelete: list => {
      deleteQueryData({
        queryClient,
        defQueryKey,
        entityId: list.id,
      });
    },
  };
}
