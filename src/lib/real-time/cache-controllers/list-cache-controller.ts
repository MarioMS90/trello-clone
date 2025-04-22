import { TList } from '@/types/db';
import { listKeys } from '@/lib/list/queries';
import { insertQueryData, updateQueryData, deleteQueryData } from '@/lib/react-query/utils';
import { QueryClient } from '@tanstack/react-query';
import { CacheHandlers } from '../cache-types';

export default function listCacheController(queryClient: QueryClient): CacheHandlers<TList> {
  return {
    handleInsert: list => {
      insertQueryData({
        queryClient,
        queryKey: listKeys.list(list.boardId).queryKey,
        entity: list,
      });
    },

    handleUpdate: list => {
      updateQueryData({
        queryClient,
        queryKey: listKeys.list(list.boardId).queryKey,
        entity: list,
      });
    },

    handleDelete: id => {
      const queriesData = queryClient.getQueriesData<TList[]>({
        queryKey: ['lists'],
      });
      const oldList = queriesData
        .flatMap(([_, lists]) => lists ?? [])
        .find(_oldList => _oldList.id === id);

      if (!oldList) {
        return;
      }

      deleteQueryData({
        queryClient,
        queryKey: listKeys.list(oldList.boardId).queryKey,
        entityId: id,
      });
    },
  };
}
