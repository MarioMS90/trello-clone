import { TCard, TList } from '@/modules/common/types/db';
import { cardKeys } from '@/modules/card/lib/queries';
import {
  insertQueryData,
  updateQueryData,
  deleteQueryData,
} from '@/modules/common/lib/react-query/utils';
import { QueryClient } from '@tanstack/react-query';
import { listKeys } from '@/modules/list/lib/queries';
import { CacheHandlers } from '@/modules/common/lib/real-time/types';

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

    handleDelete: card => {
      deleteQueryData({
        queryClient,
        defQueryKey,
        entityId: card.id,
      });
    },
  };
}
