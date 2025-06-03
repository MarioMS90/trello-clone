import { TCard, TList } from '@/types/db';
import { cardKeys } from '@/lib/card/queries';
import { insertQueryData, updateQueryData, deleteQueryData } from '@/lib/react-query/utils';
import { QueryClient } from '@tanstack/react-query';
import { listKeys } from '@/lib/list/queries';
import { CacheHandlers } from '../cache-types';

export default function cardCacheController(queryClient: QueryClient): CacheHandlers<TCard> {
  const defQueryKey = cardKeys._def;

  return {
    handleInsert: card => {
      // Supabase realtime doesn't provide calculated fields that
      // don't belong to the entity, so we need to update the
      // fields manually.
      const data = queryClient.getQueriesData<TList[]>({
        queryKey: listKeys._def,
      });
      const list = data.flatMap(([_, lists = []]) => lists).find(_list => _list.id === card.listId);

      insertQueryData({
        queryClient,
        defQueryKey,
        entity: { ...card, boardId: list?.boardId, listName: list?.name },
      });
    },

    handleUpdate: card => {
      updateQueryData({
        queryClient,
        defQueryKey,
        entity: card,
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
